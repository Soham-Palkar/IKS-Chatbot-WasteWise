export type WasteCategory = 'wet' | 'dry' | 'ewaste' | 'hazardous' | 'special';

export interface IKSReasoning {
  observation: string;
  evidence: string;
  inference: string;
  conclusion: string;
}

export interface WasteItemData {
  title: string;
  category: WasteCategory;
  categoryLabel: string;
  description: string;
  degradationTime?: string;
  soilNutrientYield?: string;
  resinCode?: string;
  confidence?: number;
  iksReasoning?: IKSReasoning;
}

export type MessageType =
  | 'user'
  | 'assistant_match'
  | 'waste_identified'
  | 'material_verification'
  | 'low_confidence'
  | 'image_preview_pending'
  | 'analyzing'
  | 'assistant_text'
  | 'limit_reached'
  | 'missing_key'
  | 'error_state';

export interface DecisionOption {
  label: string;
  value: string;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  type: MessageType;
  text?: string;
  itemTitle?: string;
  category?: WasteCategory;
  categoryLabel?: string;
  description?: string;
  degradationTime?: string;
  soilNutrientYield?: string;
  imageUrl?: string;
  imageFile?: File;
  imageName?: string;
  resinCode?: string;
  confidence?: number;
  iksReasoning?: IKSReasoning;
  decisionQuestion?: string;
  decisionOptions?: DecisionOption[];
  decisionAnswered?: boolean;
  selectedDecision?: string;
  errorMessage?: string;
}

export interface ApiUsageState {
  currentModel?: string;
  usedRequests: number;
  maxRequests: number;
  sessionUsageDate: string;
  status: 'active' | 'warning' | 'limit_reached' | 'unavailable';
  authType: 'default' | 'custom';
}

export interface SettingsState {
  provider: string;
  model: string;
  authMode: 'default' | 'custom';
  customApiKey: string;
  keyStatus: 'not_configured' | 'active' | 'invalid' | 'unavailable';
}
