/**
 * WasteWise Gemini Service
 * Handles AI chat queries with natural language understanding, context awareness,
 * strict topic boundaries (waste management & segregation only), and key validation.
 */

import { GoogleGenAI } from '@google/genai';
import { getApiKey, getStoredAuthMode } from '../utils/apiKeyStorage';
import { WasteCategory } from '../types';

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash';

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
  isOutOfScope?: boolean;
  needsDecision?: boolean;
  decisionQuestion?: string;
  decisionOptions?: Array<{ label: string; value: string; icon?: string }>;
  errorType?: 'missing_key' | 'invalid_key' | 'quota_reached' | 'network_error';
}

export const OUT_OF_SCOPE_RESPONSE =
  "I'm WasteWise, an AI assistant focused on waste segregation and waste management. 🌱\n\nAsk me about an item, waste category, recycling, composting, or disposal.";

const SYSTEM_INSTRUCTION = `You are WasteWise, an intelligent AI Waste Segregation Assistant.
Your singular objective is to help people properly classify, segregate, clean, and dispose of everyday household and commercial waste items according to modern environmental standards.

STRICT TOPIC BOUNDARY:
- ONLY answer questions concerning waste items, waste segregation, bins (wet/organic vs dry/recyclable vs e-waste vs hazardous), composting, recycling, upcycling, disposal procedures, packaging materials, environmental impact of waste, and following up on previously identified items.
- If a question is NOT about waste or waste segregation (e.g. general programming, general trivia, celebrities, mathematics, creative fiction, politics, jokes), respond ONLY with:
"I'm WasteWise, an AI assistant focused on waste segregation and waste management. 🌱

Ask me about an item, waste category, recycling, composting, or disposal."

CLASSIFICATION CRITERIA:
- Wet / Organic Waste: Biodegradable items, fruit/vegetable peels, leftover food scraps, flowers, garden waste, tea bags, eggshells, soiled paper without synthetic coatings.
- Dry / Recyclable: Rigid clean plastics (PET 1, HDPE 2, PP 5), cleaned glass bottles, paperboard, newspapers, metal cans, foil containers, cleaned beverage cartons. Must be emptied and rinsed.
- E-Waste: Electronics, chargers, circuit boards, batteries, headphones, wires, smartphones. Require specialized e-waste collection.
- Hazardous / Special: Pressurized aerosols, medical sharps, chemicals, expired medicines, paint cans, pesticides. Never place in standard trash.

OUTPUT FORMATTING:
- Be clear, practical, concise, and structured. Avoid huge walls of text.
- If an item is identified, specify its primary category clearly (Wet / Organic, Dry / Recyclable, E-Waste, or Hazardous/Special).
- Always include preparation tips (e.g., rinse thoroughly, drain liquids, remove plastic film, keep dry).
- Mention approximate degradation time if scientifically known.
- Use friendly, polite phrasing.`;

/**
 * Fast client-side check to catch blatant out-of-scope queries
 * without needlessly consuming user quota or making network calls.
 */
export function isClearlyOutOfScope(text: string): boolean {
  const query = text.toLowerCase().trim();

  // Explicit waste terms that are always permitted
  const wasteKeywords = [
    'waste', 'trash', 'garbage', 'bin', 'recycle', 'recycling', 'recyclable',
    'compost', 'composting', 'biodegradable', 'organic', 'wet', 'dry',
    'segregate', 'segregation', 'dispose', 'disposal', 'landfill', 'throw',
    'clean', 'rinse', 'peel', 'bottle', 'plastic', 'glass', 'paper',
    'cardboard', 'can', 'foil', 'battery', 'electronic', 'e-waste', 'food',
    'takeout', 'container', 'thermocol', 'styrofoam', 'packaging', 'box',
    'dirty', 'greasy', 'oily', 'soiled', 'scrap', 'metal', 'wire', 'cable',
    'leaf', 'tea', 'coffee', 'egg', 'medicine', 'aerosol', 'paint', 'hazard',
    'why', 'what', 'how', 'which', 'where', 'is it', 'can i'
  ];

  // Specific completely off-topic indicators
  const blatantOffTopic = [
    'write a poem', 'write a story', 'tell me a joke', 'who is elon musk',
    'what is python', 'what is java', 'what is javascript', 'write a resume',
    'capital of france', 'who won the match', 'tell me today news',
    'write an essay', 'help me solve this math', '2+2', 'quadratic equation'
  ];

  for (const phrase of blatantOffTopic) {
    if (query.includes(phrase)) {
      return true;
    }
  }

  // If query explicitly contains waste terms, it is in scope
  const hasWasteTerm = wasteKeywords.some((kw) => query.includes(kw));
  if (hasWasteTerm) {
    return false;
  }

  // Short follow-up phrases in a conversation are considered in scope
  if (['why?', 'why', 'what if it is dirty?', 'how?', 'where?', 'is it safe?'].includes(query)) {
    return false;
  }

  return false;
}

/**
 * Validate a user-provided Gemini API key by making a lightweight test call.
 */
export async function validateGeminiApiKey(apiKey: string): Promise<boolean> {
  const trimmed = apiKey.trim();
  if (!trimmed || trimmed.length < 15) {
    return false;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: trimmed });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: 'Ping',
      config: {
        maxOutputTokens: 2,
      },
    });
    return Boolean(response && response.text);
  } catch (err: unknown) {
    return false;
  }
}

/**
 * Get active API key based on auth mode (custom user key vs default environment key)
 */
export function getActiveApiKey(): { key: string | null; mode: 'default' | 'custom' } {
  const mode = getStoredAuthMode();
  if (mode === 'custom') {
    const userKey = getApiKey();
    return { key: userKey, mode: 'custom' };
  }

  // Default project key: read from client environment if set
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || null;
  return { key: envKey, mode: 'default' };
}

/**
 * Main query function to send user questions to Gemini with WasteWise persona
 */
export async function queryWasteWise(options: {
  userQuery: string;
  history?: ChatHistoryTurn[];
  visionContext?: LastVisionContext | null;
}): Promise<WasteQueryResult> {
  const { userQuery, history = [], visionContext } = options;

  // 1. Check local scope rule first
  if (isClearlyOutOfScope(userQuery)) {
    return {
      text: OUT_OF_SCOPE_RESPONSE,
      isOutOfScope: true,
    };
  }

  // 2. Check for food container ambiguity to offer interactive decision card
  const lowerQuery = userQuery.toLowerCase().trim();
  if (
    (lowerQuery.includes('food container') ||
      lowerQuery.includes('takeaway container') ||
      lowerQuery.includes('takeout container') ||
      lowerQuery.includes('pizza box')) &&
    !lowerQuery.includes('clean') &&
    !lowerQuery.includes('dirty') &&
    !lowerQuery.includes('contaminated')
  ) {
    return {
      text: 'I can help identify the best segregation protocol for your container. Is it still contaminated with food residue or grease?',
      needsDecision: true,
      decisionQuestion:
        'I can help identify the container. Is it still contaminated with food or grease residue?',
      decisionOptions: [
        { label: 'Yes, contaminated', value: 'contaminated', icon: '🍽️' },
        { label: 'No, clean & dry', value: 'clean', icon: '🧼' },
      ],
    };
  }

  // 3. Resolve active API key
  const { key, mode } = getActiveApiKey();

  if (!key) {
    return {
      text: 'To use WasteWise AI chat, add a Gemini API key in Settings.',
      errorType: 'missing_key',
    };
  }

  // 4. Construct prompt with context
  try {
    const ai = new GoogleGenAI({ apiKey: key });

    // Format conversation history turns
    const contents: any[] = [];

    // If there is an active visual prediction context, feed it into model's awareness
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
            text: `Understood. I have logged that the user recently scanned a ${visionContext.object} (${visionContext.category} waste). I will contextualize follow-up queries accordingly.`,
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

    // Add current user query
    contents.push({
      role: 'user',
      parts: [{ text: userQuery }],
    });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: 600,
      },
    });

    const responseText = response.text || '';

    if (!responseText.trim()) {
      return {
        text: "I couldn't generate a clear answer. Please try rephrasing your question.",
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

    // Parse category tags from response if present
    let category: WasteCategory = 'dry';
    let categoryLabel = 'Dry / Recyclable';

    const lowerResp = responseText.toLowerCase();
    if (
      lowerResp.includes('wet waste') ||
      lowerResp.includes('organic waste') ||
      lowerResp.includes('compostable') ||
      lowerResp.includes('green bin')
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
      lowerResp.includes('explosive')
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

    return {
      text: responseText,
      itemTitle: userQuery.length < 35 ? userQuery : undefined,
      category,
      categoryLabel,
      degradationTime,
    };
  } catch (err: any) {
    const errorMsg = String(err?.message || err);

    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota')) {
      return {
        text: 'Your current Gemini API usage limit has been reached. You can add or switch to another valid Gemini API key in Settings.',
        errorType: 'quota_reached',
      };
    }

    if (errorMsg.includes('API key') || errorMsg.includes('403') || errorMsg.includes('401') || errorMsg.includes('PERMISSION_DENIED')) {
      return {
        text: mode === 'custom'
          ? 'Your custom Gemini API key was rejected. Please verify or update it in Settings.'
          : 'To use WasteWise AI chat, add a Gemini API key in Settings.',
        errorType: 'invalid_key',
      };
    }

    return {
      text: "Sorry, I couldn't process that request right now. Please try again.",
      errorType: 'network_error',
    };
  }
}
