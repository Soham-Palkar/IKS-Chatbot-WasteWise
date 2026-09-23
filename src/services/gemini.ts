/**
 * WasteWise Gemini Service
 * Handles AI chat queries with natural language understanding, multi-turn context awareness,
 * strict topic boundaries (waste management & segregation only), and robust key validation.
 */

import { getApiKey, getStoredAuthMode } from '../utils/apiKeyStorage';
import { WasteCategory, IKSReasoning } from '../types';
import { findIKSConnection, formatIKSSteps } from './iksService';
import { findWasteMatch } from '../data/mockWaste';

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-lite';
export const GEMINI_CANDIDATE_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
];

export interface ChatHistoryTurn {
  role: 'user' | 'model';
  text: string;
}

export interface LastVisionContext {
  object: string;
  category: string;
  confidence?: number;
  reason?: string;
}

export interface WasteQueryResult {
  text: string;
  itemTitle?: string;
  category?: WasteCategory;
  categoryLabel?: string;
  degradationTime?: string;
  soilNutrientYield?: string;
  iksReasoning?: IKSReasoning;
  isOutOfScope?: boolean;
  needsDecision?: boolean;
  decisionQuestion?: string;
  decisionOptions?: Array<{ label: string; value: string; icon?: string }>;
  errorType?: 'missing_key' | 'invalid_key' | 'quota_reached' | 'network_error';
}

export const OUT_OF_SCOPE_RESPONSE =
  "I'm WasteWise, an AI assistant focused on waste segregation and sustainable waste practices. Please ask me questions about identifying, segregating, recycling, composting, or responsibly managing waste.";

const SYSTEM_INSTRUCTION = `You are WasteWise, a sharp, friendly AI Waste Segregation Assistant. Give direct answers immediately. Never repeat the user's question.

HOW TO RESPOND:
- State the Bin type and color clearly on the first line: 🟢 Green (Wet/Organic), 🔵 Blue (Dry/Recyclable), 🔴 Red (Hazardous/Special), ⬛ Black (E-Waste).
- Write a short, natural paragraph (2-3 lines) explaining why it goes there and how to prepare it (e.g., rinsing or crushing).
- DO NOT use bullet points or words like "Why:" or "How:".
- Ask a follow-up question ONLY when the item is genuinely ambiguous (e.g. you don't know if a container is clean or greasy).

EXAMPLES:
User: "plastic bottle"
Assistant: 🔵 Blue bin — Dry/Recyclable. 
Plastics are highly recyclable and should be kept dry. Rinse out any leftover liquid and crush it flat before tossing it in.

User: "banana peel"
Assistant: 🟢 Green bin — Wet/Organic. 
Fruit peels decompose naturally and easily. Just toss it in as-is.

User: "pizza box"
Assistant: Depends — is it greasy/stained, or clean?

SCOPE:
- Only answer waste, recycling, composting, bin, and disposal questions.
- For greetings, introduce yourself briefly and ask what they want to dispose of.
- For off-topic questions, politely decline in one line.`;

/**
 * Direct REST API Caller for Google Gemini
 */
export async function callGeminiREST(
  apiKey: string,
  contents: Array<{ role: string; parts: Array<{ text?: string; inlineData?: any }> }>,
  systemInstructionText: string = SYSTEM_INSTRUCTION
): Promise<string> {
  let lastError: any = null;

  for (const model of GEMINI_CANDIDATE_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
          apiKey.trim()
        )}`;

        const bodyPayload: any = {
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 250,
          },
        };

        if (systemInstructionText) {
          bodyPayload.systemInstruction = {
            parts: [{ text: systemInstructionText }],
          };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyPayload),
        });

        if (response.ok) {
          const data = await response.json();
          const parts = data?.candidates?.[0]?.content?.parts;
          if (Array.isArray(parts)) {
            const textParts = parts
              .filter((p: any) => typeof p.text === 'string' && !p.thought)
              .map((p: any) => p.text);
            const combinedText = textParts.join('').trim() || parts.map((p: any) => p.text || '').join('').trim();
            if (combinedText) {
              return combinedText;
            }
          }
        } else if (response.status === 503) {
          // Model temporarily busy, brief pause before retry
          await new Promise((r) => setTimeout(r, 400));
          continue;
        } else {
          const errorJson = await response.json().catch(() => ({}));
          lastError = errorJson?.error?.message || `HTTP ${response.status}`;
          break; // Try next candidate model
        }
      } catch (err: any) {
        lastError = err?.message || err;
        break;
      }
    }
  }

  throw new Error(lastError || 'Failed to generate content from Gemini API');
}

/**
 * Direct REST API Caller for Groq (Fallback)
 */
export async function callGroqREST(
  apiKey: string,
  contents: Array<{ role: string; parts: Array<{ text?: string; inlineData?: any }> }>,
  systemInstructionText: string = SYSTEM_INSTRUCTION
): Promise<string> {
  const messages = [];
  if (systemInstructionText) {
    messages.push({ role: 'system', content: systemInstructionText });
  }

  for (const c of contents) {
    const text = c.parts.map((p) => p.text || '').join('');
    // map model role to assistant for OpenAI/Groq spec
    messages.push({ role: c.role === 'model' ? 'assistant' : 'user', content: text });
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.3,
      max_tokens: 250,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API Error: ${response.status}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}

/**
 * Client-side filter to intercept obvious out-of-scope queries
 */
export function isClearlyOutOfScope(text: string): boolean {
  const query = text.toLowerCase().trim();

  // Explicit waste terms and conversational starters that are always permitted
  const wasteKeywords = [
    'waste', 'trash', 'garbage', 'bin', 'recycle', 'recycling', 'recyclable',
    'compost', 'composting', 'biodegradable', 'organic', 'wet', 'dry',
    'segregate', 'segregation', 'dispose', 'disposal', 'landfill', 'throw',
    'clean', 'rinse', 'peel', 'bottle', 'plastic', 'glass', 'paper',
    'cardboard', 'can', 'foil', 'battery', 'electronic', 'e-waste', 'food',
    'takeout', 'container', 'thermocol', 'styrofoam', 'packaging', 'box',
    'dirty', 'greasy', 'oily', 'soiled', 'scrap', 'metal', 'wire', 'cable',
    'leaf', 'tea', 'coffee', 'egg', 'medicine', 'aerosol', 'paint', 'hazard',
    'kulhad', 'pattal', 'dona', 'iks', 'traditional', 'cloth', 'saree',
    'banana', 'apple', 'vegetable', 'where', 'how', 'which', 'can i', 'is it',
    'why', 'what', 'who', 'dustbin', 'color', 'colour', 'blue', 'green', 'red', 'black'
  ];

  // Specific completely off-topic phrases
  const blatantOffTopic = [
    'write a poem', 'write a story', 'tell me a joke', 'who is elon musk',
    'what is python', 'what is java', 'what is javascript', 'write a resume',
    'capital of france', 'who won the match', 'tell me today news',
    'write an essay', 'help me solve this math', '2+2', 'quadratic equation',
    'how to code', 'write code', 'fix my code', 'who is the president'
  ];

  for (const phrase of blatantOffTopic) {
    if (query.includes(phrase)) {
      return true;
    }
  }

  const hasWasteTerm = wasteKeywords.some((kw) => query.includes(kw));
  if (hasWasteTerm) {
    return false;
  }

  // Short conversational continuations
  if (['why?', 'why', 'what if it is dirty?', 'how?', 'where?', 'is it safe?', 'what next?', 'hi', 'hello', 'hey'].includes(query)) {
    return false;
  }

  return false;
}

/**
 * Validate a user-provided Gemini API key with direct Google Gemini REST ping.
 */
export async function validateGeminiApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  const trimmed = apiKey.trim().replace(/^["']|["']$/g, '');
  if (!trimmed || trimmed.length < 10) {
    return { valid: false, error: 'API key is too short. Please enter a valid Gemini API key.' };
  }

  // Use just the first model for a quick validation ping
  const model = GEMINI_CANDIDATE_MODELS[0];
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'hi' }] }],
        generationConfig: { maxOutputTokens: 5 },
      }),
    });

    // Success or rate-limited → key is valid
    if (res.ok || res.status === 429) {
      return { valid: true };
    }

    const errorJson = await res.json().catch(() => ({}));
    const msg: string = errorJson?.error?.message || '';
    const code: number = errorJson?.error?.code || res.status;

    // 401 or 403 with API key mention → genuinely invalid key
    if (
      (code === 401 || code === 403) &&
      (msg.toLowerCase().includes('api key') ||
        msg.toLowerCase().includes('api_key_invalid') ||
        msg.toLowerCase().includes('permission'))
    ) {
      return { valid: false, error: 'Invalid API key. Please check it at Google AI Studio (aistudio.google.com).' };
    }

    // 404 = model not found, 503 = overloaded, 400 = bad request body — key itself is fine
    if (code === 404 || code === 503 || code === 400) {
      return { valid: true };
    }

    // Any other error from Google → treat key as valid (network/quota issue, not key issue)
    return { valid: true };
  } catch {
    // Network error → can't verify, accept the key optimistically
    return { valid: true };
  }
}

/**
 * Resolves active API key with priority:
 * 1. Custom User Key (from sessionStorage)
 * 2. Environment Key (VITE_GEMINI_API_KEY or GEMINI_API_KEY)
 */
export function getActiveApiKey(): { key: string | null; mode: 'default' | 'custom' } {
  const mode = getStoredAuthMode();
  if (mode === 'custom') {
    const userKey = getApiKey();
    if (userKey && userKey.trim().length > 3) {
      return { key: userKey.trim(), mode: 'custom' };
    }
  }

  // Check Vite environment variables
  const envVite = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const envDirect = (import.meta as any).env?.GEMINI_API_KEY;
  const candidate = (envVite || envDirect || '') as string;

  if (candidate && typeof candidate === 'string') {
    const trimmed = candidate.trim().replace(/^["']|["']$/g, '');
    if (trimmed && trimmed.length > 3 && !trimmed.includes('MY_GEMINI_API_KEY') && !trimmed.includes('YOUR_API_KEY')) {
      return { key: trimmed, mode: 'default' };
    }
  }

  // Fallback to session key if configured
  const sessionKey = getApiKey();
  if (sessionKey && sessionKey.trim().length > 3) {
    return { key: sessionKey.trim(), mode: 'custom' };
  }

  return { key: null, mode: 'default' };
}

/**
 * Main query function: sends every user request directly to Gemini AI in real time
 * with full conversational memory and Indian Knowledge Systems (IKS) reasoning.
 */
export async function queryWasteWise(options: {
  userQuery: string;
  history?: ChatHistoryTurn[];
  visionContext?: LastVisionContext | null;
}): Promise<WasteQueryResult> {
  const { userQuery, history = [], visionContext } = options;
  const lowerQuery = userQuery.toLowerCase().trim();

  // 1. Check local scope rule for completely off-topic questions (e.g. math, coding)
  if (isClearlyOutOfScope(userQuery)) {
    return {
      text: OUT_OF_SCOPE_RESPONSE,
      isOutOfScope: true,
    };
  }

  // 3. Check for standard greetings to save API calls
  if (lowerQuery === 'hi' || lowerQuery === 'hello' || lowerQuery === 'hey' || lowerQuery === 'hii') {
    return {
      text: "Hi there! I'm WasteWise. Ask me about an item, waste category, or upload a photo, and I'll help you dispose of it correctly.",
    };
  }

  // 4. Check for predefined Quick Prompts to save API calls
  if (lowerQuery === 'where does a banana peel go?') {
    return { text: "🟢 Green bin — Wet/Organic. \nFruit peels decompose naturally and easily. Just toss it in as-is." };
  }
  if (lowerQuery === 'is this plastic bottle recyclable?') {
    return { text: "🔵 Blue bin — Dry/Recyclable. \nPlastics are highly recyclable and should be kept dry. Rinse out any leftover liquid and crush it flat before tossing it in." };
  }
  if (lowerQuery === 'how should i dispose of an old battery?') {
    return { text: "🔴 Red bin — Hazardous/Special. \nBatteries contain toxic heavy metals and pose fire hazards. Deposit them at designated municipal e-waste collection bins." };
  }
  if (lowerQuery === 'what is the iks connection to sustainable waste practices?') {
    return { text: "Indian Knowledge Systems (IKS) emphasize circular living, such as using compostable leaf platters (Pattal), earthen cups (Kulhad) that return to the soil, and upcycling fabrics (Kantha). It’s about creating zero waste by returning materials back to nature safely." };
  }

  // 5. Check for ambiguous composite item (e.g. food container) to trigger interactive DecisionCard
  if (
    (lowerQuery.includes('food container') ||
      lowerQuery.includes('takeaway container') ||
      lowerQuery.includes('takeout container') ||
      lowerQuery.includes('pizza box')) &&
    !lowerQuery.includes('clean') &&
    !lowerQuery.includes('dirty') &&
    !lowerQuery.includes('grease') &&
    !lowerQuery.includes('contaminated')
  ) {
    return {
      text: 'I can help identify the best segregation protocol for your container. Is it contaminated with food residue or grease?',
      needsDecision: true,
      decisionQuestion:
        'Is the container or box contaminated with food residue or grease?',
      decisionOptions: [
        { label: 'Yes, contaminated', value: 'contaminated', icon: '🍽️' },
        { label: 'No, clean & dry', value: 'clean', icon: '🧼' },
      ],
    };
  }

  // 3. Resolve active API key
  const { key, mode } = getActiveApiKey();
  const localMatch = findWasteMatch(userQuery);

  // If no API key configured at all
  if (!key) {
    if (localMatch) {
      return {
        text: localMatch.description,
        itemTitle: localMatch.title,
        category: localMatch.category,
        categoryLabel: localMatch.categoryLabel,
        degradationTime: localMatch.degradationTime,
        soilNutrientYield: localMatch.soilNutrientYield,
        iksReasoning: localMatch.iksReasoning,
      };
    }

    return {
      text: 'To use real-time WasteWise AI chat, please configure a Gemini API key in Settings.',
      errorType: 'missing_key',
    };
  }

  // 4. Build real-time conversation payload for Gemini AI
  const contents: Array<{ role: string; parts: Array<{ text?: string; inlineData?: any }> }> = [];

  if (visionContext) {
    contents.push({
      role: 'user',
      parts: [
        {
          text: `[SYSTEM CONTEXT: The user recently scanned an image. Optical vision model detected:
Item: ${visionContext.object}
Category: ${visionContext.category}
Confidence: ${visionContext.confidence ? Math.round(visionContext.confidence * 100) + '%' : 'high'}
Reason: ${visionContext.reason || 'standard identification'}
Use this context if the user asks follow-up questions like "Why?", "How do I clean it?", or "Can I recycle this?"]`,
        },
      ],
    });
    contents.push({
      role: 'model',
      parts: [
        {
          text: `Understood. I logged that the user recently scanned a ${visionContext.object} (${visionContext.category} waste). I will contextualize follow-up queries accordingly.`,
        },
      ],
    });
  }

  // Add recent dialogue history
  for (const turn of history.slice(-6)) {
    contents.push({
      role: turn.role,
      parts: [{ text: turn.text }],
    });
  }

  // Add current query
  contents.push({
    role: 'user',
    parts: [{ text: userQuery }],
  });

  try {
    let responseText = '';
    try {
      responseText = await callGeminiREST(key, contents, SYSTEM_INSTRUCTION);
    } catch (geminiError: any) {
      console.warn('Gemini API failed, attempting Groq fallback...', geminiError);
      
      const envGroqVite = (import.meta as any).env?.VITE_GROQ_API_KEY;
      const envGroqDirect = (import.meta as any).env?.GROQ_API_KEY;
      const groqKey = (envGroqVite || envGroqDirect || '') as string;
      
      if (groqKey && groqKey.length > 5) {
        responseText = await callGroqREST(groqKey, contents, SYSTEM_INSTRUCTION);
      } else {
        throw geminiError; // No Groq key, rethrow original Gemini error
      }
    }

    if (!responseText || !responseText.trim()) {
      return {
        text: "I couldn't generate a clear answer from the AI model. Please try rephrasing your question.",
        errorType: 'network_error',
      };
    }

    // Check if model refused due to scope
    if (
      responseText.includes("I'm WasteWise, an AI assistant focused on waste segregation") ||
      responseText.includes("Ask me about an item, waste category")
    ) {
      return {
        text: OUT_OF_SCOPE_RESPONSE,
        isOutOfScope: true,
      };
    }

    // Parse category tags from response
    let category: WasteCategory = 'dry';
    let categoryLabel = 'Dry / Recyclable';

    const lowerResp = responseText.toLowerCase();
    if (
      lowerResp.includes('wet waste') ||
      lowerResp.includes('organic waste') ||
      lowerResp.includes('compostable') ||
      lowerResp.includes('green bin') ||
      lowerResp.includes('biodegradable')
    ) {
      category = 'wet';
      categoryLabel = 'Wet / Organic Waste';
    } else if (
      lowerResp.includes('e-waste') ||
      lowerResp.includes('electronic waste') ||
      lowerResp.includes('battery') ||
      lowerResp.includes('specialized e-waste')
    ) {
      category = 'ewaste';
      categoryLabel = 'E-Waste';
    } else if (
      lowerResp.includes('hazardous') ||
      lowerResp.includes('flammable') ||
      lowerResp.includes('explosive') ||
      lowerResp.includes('special waste')
    ) {
      category = 'hazardous';
      categoryLabel = 'Hazardous / Special';
    }

    // Extract degradation time if mentioned
    let degradationTime: string | undefined;
    const degMatch = responseText.match(/degradation time:?\s*([^\n.,;]+)/i);
    if (degMatch) {
      degradationTime = degMatch[1].trim();
    }

    // Attach authentic IKS insight if genuine match exists for this query
    const iksMatch = findIKSConnection(userQuery);
    const iksReasoning = iksMatch ? formatIKSSteps(iksMatch) : (localMatch?.iksReasoning || undefined);

    return {
      text: responseText,
      itemTitle: userQuery.length < 35 ? userQuery : (localMatch?.title || undefined),
      category,
      categoryLabel,
      degradationTime: degradationTime || localMatch?.degradationTime,
      soilNutrientYield: localMatch?.soilNutrientYield,
      iksReasoning,
    };
  } catch (err: any) {
    // If Gemini fails but we have a matching waste item locally, provide instant smart answer!
    if (localMatch) {
      return {
        text: localMatch.description,
        itemTitle: localMatch.title,
        category: localMatch.category,
        categoryLabel: localMatch.categoryLabel,
        degradationTime: localMatch.degradationTime,
        soilNutrientYield: localMatch.soilNutrientYield,
        iksReasoning: localMatch.iksReasoning,
      };
    }

    const errorMsg = String(err?.message || err);

    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota')) {
      return {
        text: 'Your current Gemini API usage limit has been reached. You can add or switch to another valid Gemini API key in Settings.',
        errorType: 'quota_reached',
      };
    }

    if (
      errorMsg.includes('API key') ||
      errorMsg.includes('403') ||
      errorMsg.includes('401') ||
      errorMsg.includes('400') ||
      errorMsg.includes('PERMISSION_DENIED') ||
      errorMsg.includes('API_KEY_INVALID') ||
      errorMsg.includes('Forbidden')
    ) {
      return {
        text: mode === 'custom'
          ? 'Your custom Gemini API key was rejected by Google (403 Forbidden / Invalid key). Please check your key in Settings or switch back to the Default key.'
          : 'Google Gemini rejected the default API request. You can configure a personal key in Settings.',
        errorType: 'invalid_key',
      };
    }

    return {
      text: "Sorry, I couldn't reach Google Gemini right now. Please check your network and try again.",
      errorType: 'network_error',
    };
  }
}
