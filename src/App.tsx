import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { UserMessage } from './components/UserMessage';
import { AssistantMatchCard } from './components/AssistantMatchCard';
import { WasteIdentifiedCard } from './components/WasteIdentifiedCard';
import { DecisionCard } from './components/DecisionCard';
import { ImagePreviewCard } from './components/ImagePreviewCard';
import { LowConfidenceCard } from './components/LowConfidenceCard';
import { ThinkingIndicator } from './components/ThinkingIndicator';
import { ErrorCard } from './components/ErrorCard';
import { WelcomeState } from './components/WelcomeState';
import { ChatInput } from './components/ChatInput';
import { SettingsModal } from './components/SettingsModal';
import { MissingKeyCard } from './components/MissingKeyCard';
import { analyzeWasteImage, VisionPredictionResponse } from './services/wasteService';
import {
  queryWasteWise,
  ChatHistoryTurn,
  LastVisionContext,
  getActiveApiKey,
} from './services/gemini';
import { hasApiKey, getStoredAuthMode, getApiKey } from './utils/apiKeyStorage';
import { ChatMessage, DecisionOption } from './types';
import { RotateCcw } from 'lucide-react';

export default function App() {
  // Fresh, empty conversation state - NO demo messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ file: File; url: string; name: string } | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [lastVisionPrediction, setLastVisionPrediction] = useState<LastVisionContext | null>(null);



  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, pendingImage, isAnalyzingImage]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Main chat message handler using Gemini AI
   */
  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking || isAnalyzingImage) return;

    // 1. Add user message to conversation feed
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: getCurrentTime(),
      type: 'user',
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    // 3. Extract recent conversation context for Gemini
    const history: ChatHistoryTurn[] = messages
      .filter((m) => m.type === 'user' || m.type === 'assistant_match')
      .slice(-6)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text || m.description || '',
      }));

    // 4. Send query to WasteWise Gemini service
    try {
      const result = await queryWasteWise({
        userQuery: trimmed,
        history,
        visionContext: lastVisionPrediction,
      });

      setIsThinking(false);

      // Handle missing API key
      if (result.errorType === 'missing_key' || result.errorType === 'invalid_key') {
        const missingKeyMsg: ChatMessage = {
          id: `missing-key-${Date.now()}`,
          sender: 'assistant',
          timestamp: getCurrentTime(),
          type: 'missing_key',
          text: result.text,
        };
        setMessages((prev) => [...prev, missingKeyMsg]);
        return;
      }

      // Handle interactive decision question (e.g. food container contamination check)
      if (result.needsDecision && result.decisionOptions) {
        const decisionMsg: ChatMessage = {
          id: `decision-${Date.now()}`,
          sender: 'assistant',
          timestamp: getCurrentTime(),
          type: 'material_verification',
          decisionQuestion: result.decisionQuestion || result.text,
          decisionOptions: result.decisionOptions,
          decisionAnswered: false,
        };
        setMessages((prev) => [...prev, decisionMsg]);
        return;
      }



      // Display response card
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        timestamp: getCurrentTime(),
        type: 'assistant_match',
        itemTitle: result.itemTitle || (result.isOutOfScope ? 'WasteWise Assistant' : trimmed),
        category: result.category || 'dry',
        categoryLabel: result.categoryLabel || 'Segregation Guidance',
        description: result.text,
        degradationTime: result.degradationTime,
        soilNutrientYield: result.soilNutrientYield,
        iksReasoning: result.iksReasoning,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setIsThinking(false);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: getCurrentTime(),
        type: 'error_state',
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  /**
   * Handles user response to verification decision cards
   */
  const handleDecisionSelect = async (messageId: string, option: DecisionOption) => {
    // Mark the card as answered
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, decisionAnswered: true, selectedDecision: option.value }
          : msg
      )
    );

    // Forward the user's choice into the chat flow for real AI guidance
    const decisionQuery =
      option.value === 'contaminated'
        ? 'The food container is contaminated with grease and food residue. Where does it go?'
        : 'The food container is clean and dry. Where does it go?';

    handleSendMessage(decisionQuery);
  };

  /**
   * Handle image capture/selection
   */
  const handleImageSelected = (file: File) => {
    const url = URL.createObjectURL(file);
    setPendingImage({
      file,
      url,
      name: file.name,
    });
  };

  const handleCancelPendingImage = () => {
    if (pendingImage?.url) {
      URL.revokeObjectURL(pendingImage.url);
    }
    setPendingImage(null);
    setIsAnalyzingImage(false);
  };

  /**
   * Calls POST /predict to classify uploaded waste image
   */
  const handleAnalyzeWasteImage = async () => {
    if (!pendingImage || isAnalyzingImage) return;

    setIsAnalyzingImage(true);

    try {
      const result: VisionPredictionResponse = await analyzeWasteImage(pendingImage.file);

      setIsAnalyzingImage(false);
      const currentUrl = pendingImage.url;
      setPendingImage(null);

      // Save context for conversational follow-ups (e.g. "Why is this dry waste?")
      setLastVisionPrediction({
        object: result.object,
        category: result.category,
        confidence: result.confidence,
        reason: result.reason,
      });

      // Low confidence fallback if confidence is below threshold (< 0.70)
      if (result.confidence < 0.70) {
        const lowConfMsg: ChatMessage = {
          id: `low-conf-${Date.now()}`,
          sender: 'assistant',
          timestamp: getCurrentTime(),
          type: 'low_confidence',
          imageUrl: currentUrl,
        };
        setMessages((prev) => [...prev, lowConfMsg]);
        return;
      }

      const identifiedMsg: ChatMessage = {
        id: `waste-id-${Date.now()}`,
        sender: 'assistant',
        timestamp: getCurrentTime(),
        type: 'waste_identified',
        itemTitle: result.object,
        category: result.category,
        categoryLabel:
          result.category === 'wet'
            ? 'Wet / Organic Waste'
            : result.category === 'ewaste'
            ? 'E-Waste'
            : result.category === 'hazardous'
            ? 'Hazardous / Special'
            : 'Dry / Recyclable',
        description: result.reason,
        imageUrl: currentUrl,
        resinCode: result.resinCode,
        confidence: result.confidence,
        iksReasoning: result.iksReasoning,
      };

      setMessages((prev) => [...prev, identifiedMsg]);
    } catch {
      setIsAnalyzingImage(false);
      setPendingImage(null);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: getCurrentTime(),
        type: 'error_state',
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleResetConversation = () => {
    setMessages([]);
    setLastVisionPrediction(null);
  };

  return (
    <div className="min-h-screen bg-[#f3fcf0] flex flex-col antialiased text-[#151d17]">
      {/* Top Header */}
      <Header />

      {/* Main Conversation Container */}
      <main className="flex-1 w-full max-w-[1040px] mx-auto px-3 sm:px-6 pt-3 pb-28 flex flex-col">
        {/* Active Segregation Feed Divider */}
        <div className="flex items-center justify-center gap-3 my-2 select-none">
          <div className="h-px bg-[#e2ebdf] flex-1 max-w-[140px] sm:max-w-[200px]" />
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#707a6f] uppercase px-1">
            Active Segregation Feed
          </span>
          <div className="h-px bg-[#e2ebdf] flex-1 max-w-[140px] sm:max-w-[200px]" />
        </div>

        {/* Clear Feed action button */}
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={handleResetConversation}
              className="text-[11px] text-[#707a6f] hover:text-[#2f7d4a] flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-[#e7f0e5]/60 transition-colors cursor-pointer"
              title="Start a fresh conversation"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Feed</span>
            </button>
          </div>
        )}

        {/* Conversation Feed or Fresh Welcome State */}
        {messages.length === 0 ? (
          <WelcomeState onSelectPrompt={handleSendMessage} />
        ) : (
          <div className="flex-1 flex flex-col">
            {messages.map((msg) => {
              if (msg.type === 'user') {
                return (
                  <UserMessage
                    key={msg.id}
                    text={msg.text || ''}
                    timestamp={msg.timestamp}
                  />
                );
              }

              if (msg.type === 'assistant_match') {
                return (
                  <AssistantMatchCard
                    key={msg.id}
                    itemTitle={msg.itemTitle || 'Waste Item'}
                    category={msg.category || 'dry'}
                    categoryLabel={msg.categoryLabel}
                    description={msg.description || ''}
                    degradationTime={msg.degradationTime}
                    soilNutrientYield={msg.soilNutrientYield}
                    iksReasoning={msg.iksReasoning}
                  />
                );
              }

              if (msg.type === 'waste_identified') {
                return (
                  <WasteIdentifiedCard
                    key={msg.id}
                    itemTitle={msg.itemTitle || ''}
                    category={msg.category || 'dry'}
                    categoryLabel={msg.categoryLabel}
                    description={msg.description || ''}
                    imageUrl={msg.imageUrl}
                    resinCode={msg.resinCode}
                    confidence={msg.confidence}
                    iksReasoning={msg.iksReasoning}
                  />
                );
              }

              if (msg.type === 'material_verification') {
                return (
                  <DecisionCard
                    key={msg.id}
                    question={msg.decisionQuestion || ''}
                    options={msg.decisionOptions || []}
                    isAnswered={msg.decisionAnswered}
                    selectedDecision={msg.selectedDecision}
                    onSelectOption={(opt) => handleDecisionSelect(msg.id, opt)}
                  />
                );
              }

              if (msg.type === 'missing_key') {
                return (
                  <MissingKeyCard
                    key={msg.id}
                    onOpenSettings={() => setIsSettingsModalOpen(true)}
                  />
                );
              }



              if (msg.type === 'low_confidence') {
                return (
                  <LowConfidenceCard
                    key={msg.id}
                    onSelectClarification={(type) => handleSendMessage(`It is a ${type}`)}
                  />
                );
              }

              if (msg.type === 'error_state') {
                return (
                  <ErrorCard
                    key={msg.id}
                    onRetry={() => handleSendMessage('Please recheck the last item.')}
                  />
                );
              }

              return null;
            })}

            {/* Pending Image Preview Card */}
            {pendingImage && (
              <ImagePreviewCard
                imageUrl={pendingImage.url}
                fileName={pendingImage.name}
                isAnalyzing={isAnalyzingImage}
                onCancel={handleCancelPendingImage}
                onAnalyze={handleAnalyzeWasteImage}
              />
            )}

            {/* Thinking Indicator */}
            {isThinking && <ThinkingIndicator />}

            <div ref={chatEndRef} />
          </div>
        )}
      </main>

      {/* Fixed Bottom Input Bar */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onImageSelected={handleImageSelected}
        disabled={isThinking || isAnalyzingImage}
      />


    </div>
  );
}
