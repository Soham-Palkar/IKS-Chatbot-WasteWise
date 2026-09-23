/**
 * API Key Storage Utility
 * Safely manages user-configured API keys for the session using sessionStorage.
 * Never logs, exposes, or transmits keys anywhere except directly to AI APIs.
 */

const STORAGE_KEY = 'wastewise_gemini_api_key';
const OPENAI_STORAGE_KEY = 'wastewise_openai_api_key';
const AUTH_MODE_KEY = 'wastewise_auth_mode';
const PROVIDER_KEY = 'wastewise_ai_provider';
const MODEL_KEY = 'wastewise_ai_model';

export function saveApiKey(key: string, provider: 'gemini' | 'openai' = 'gemini'): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storageKey = provider === 'openai' ? OPENAI_STORAGE_KEY : STORAGE_KEY;
      window.sessionStorage.setItem(storageKey, key.trim());
    }
  } catch {
    console.error('SessionStorage unavailable');
  }
}

export function getApiKey(provider: 'gemini' | 'openai' = 'gemini'): string | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storageKey = provider === 'openai' ? OPENAI_STORAGE_KEY : STORAGE_KEY;
      return window.sessionStorage.getItem(storageKey);
    }
  } catch {
    return null;
  }
  return null;
}

export function removeApiKey(provider: 'gemini' | 'openai' = 'gemini'): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storageKey = provider === 'openai' ? OPENAI_STORAGE_KEY : STORAGE_KEY;
      window.sessionStorage.removeItem(storageKey);
    }
  } catch {
    console.error('SessionStorage unavailable');
  }
}

export function hasApiKey(provider: 'gemini' | 'openai' = 'gemini'): boolean {
  const key = getApiKey(provider);
  return Boolean(key && key.trim().length > 5);
}

export function getStoredAuthMode(): 'default' | 'custom' {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const mode = window.sessionStorage.getItem(AUTH_MODE_KEY);
      if (mode === 'custom' || mode === 'default') {
        return mode;
      }
    }
  } catch {
    return 'default';
  }
  return 'default';
}

export function setStoredAuthMode(mode: 'default' | 'custom'): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(AUTH_MODE_KEY, mode);
    }
  } catch {
    console.error('SessionStorage unavailable');
  }
}

export function getStoredProvider(): 'gemini' | 'openai' {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const p = window.sessionStorage.getItem(PROVIDER_KEY);
      if (p === 'openai' || p === 'gemini') return p;
    }
  } catch {
    return 'gemini';
  }
  return 'gemini';
}

export function setStoredProvider(provider: 'gemini' | 'openai'): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(PROVIDER_KEY, provider);
    }
  } catch {
    console.error('SessionStorage unavailable');
  }
}

export function getStoredModel(): string {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem(MODEL_KEY) || '';
    }
  } catch {
    return '';
  }
  return '';
}

export function setStoredModel(model: string): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(MODEL_KEY, model);
    }
  } catch {
    console.error('SessionStorage unavailable');
  }
}
