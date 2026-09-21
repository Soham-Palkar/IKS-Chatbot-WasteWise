/**
 * API Key Storage Utility
 * Safely manages user-configured Gemini API keys for the session using sessionStorage.
 * Never logs, exposes, or transmits keys anywhere except directly to the Gemini SDK.
 */

const STORAGE_KEY = 'wastewise_gemini_api_key';
const AUTH_MODE_KEY = 'wastewise_auth_mode';

export function saveApiKey(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(STORAGE_KEY, key.trim());
    }
  } catch (err) {
    console.error('SessionStorage unavailable');
  }
}

export function getApiKey(): string | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem(STORAGE_KEY);
    }
  } catch (err) {
    return null;
  }
  return null;
}

export function removeApiKey(): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.error('SessionStorage unavailable');
  }
}

export function hasApiKey(): boolean {
  const key = getApiKey();
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
  } catch (err) {
    console.error('SessionStorage unavailable');
  }
}
