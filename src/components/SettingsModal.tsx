import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Settings, Shield, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { SettingsState, ApiUsageState } from '../types';
import { saveApiKey, removeApiKey, getApiKey, setStoredAuthMode } from '../utils/apiKeyStorage';
import { validateGeminiApiKey } from '../services/gemini';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  apiUsage: ApiUsageState;
  onSaveSettings: (newSettings: SettingsState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [authMode, setAuthMode] = useState<'default' | 'custom'>(settings.authMode);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<SettingsState['keyStatus']>(settings.keyStatus);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setAuthMode(settings.authMode);
    setKeyStatus(settings.keyStatus);
    setValidationError(null);
    setSaveSuccess(false);

    const storedKey = getApiKey();
    if (storedKey) {
      setApiKeyInput(storedKey);
    } else {
      setApiKeyInput('');
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (authMode === 'default') {
      setStoredAuthMode('default');
      setKeyStatus('active');
      onSaveSettings({
        ...settings,
        authMode: 'default',
        customApiKey: '',
        keyStatus: 'active',
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 500);
      return;
    }

    // Custom Key Validation Flow
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setKeyStatus('not_configured');
      setValidationError('Please enter an API key to save.');
      return;
    }

    setIsValidating(true);
    const isValid = await validateGeminiApiKey(trimmed);
    setIsValidating(false);

    if (isValid) {
      saveApiKey(trimmed);
      setStoredAuthMode('custom');
      setKeyStatus('active');
      setValidationError(null);

      onSaveSettings({
        ...settings,
        authMode: 'custom',
        customApiKey: trimmed,
        keyStatus: 'active',
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 600);
    } else {
      setKeyStatus('invalid');
      setValidationError('Could not validate this API key. Please check your key and try again.');
    }
  };

  const handleRemoveKey = () => {
    removeApiKey();
    setApiKeyInput('');
    setKeyStatus('not_configured');
    setValidationError(null);

    onSaveSettings({
      ...settings,
      customApiKey: '',
      keyStatus: 'not_configured',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-[#e2ebdf] p-5 sm:p-6 shadow-lg relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f3fcf0]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#2f7d4a]/10 text-[#2f7d4a]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#151d17]">Settings</h2>
              <p className="text-[10px] text-[#707a6f]">API Key Configuration</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Settings dialog"
            className="p-1 rounded-md text-[#707a6f] hover:text-[#151d17] hover:bg-[#f7f8f6] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSaveKey} className="space-y-4">
          {/* AI Provider */}
          <div className="p-2.5 rounded-xl bg-[#f7f8f6] border border-[#e2ebdf]">
            <div className="text-[10px] uppercase font-semibold text-[#707a6f] mb-0.5">
              AI Provider
            </div>
            <div className="text-xs font-semibold text-[#151d17]">
              Google Gemini
            </div>
          </div>

          {/* Authentication Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#151d17] mb-2">
              Authentication
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#e2ebdf] hover:bg-[#f7f8f6] transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="authMode"
                  checked={authMode === 'default'}
                  onChange={() => {
                    setAuthMode('default');
                    setValidationError(null);
                  }}
                  className="text-[#2f7d4a] focus:ring-[#2f7d4a]"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#151d17]">Default API Key</div>
                  <div className="text-[11px] text-[#707a6f]">Standard institutional backend configuration</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#e2ebdf] hover:bg-[#f7f8f6] transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="authMode"
                  checked={authMode === 'custom'}
                  onChange={() => {
                    setAuthMode('custom');
                    setValidationError(null);
                  }}
                  className="text-[#2f7d4a] focus:ring-[#2f7d4a]"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#151d17]">My API Key</div>
                  <div className="text-[11px] text-[#707a6f]">Custom Google AI Studio API key</div>
                </div>
              </label>
            </div>
          </div>

          {/* API Key Input when My API Key is selected */}
          {authMode === 'custom' && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-[#151d17]">
                  API Key
                </label>
                {getApiKey() && (
                  <span className="text-[10px] text-[#2f7d4a] font-medium">
                    ● Key stored for session
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => {
                    setApiKeyInput(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Enter Gemini API key (e.g. AIzaSy...)"
                  className="w-full text-xs px-3 py-2 pr-16 bg-white border border-[#e2ebdf] rounded-xl focus:border-[#2f7d4a] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#707a6f] hover:text-[#151d17] px-1.5 py-1 rounded-sm cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Status Row */}
          <div className="p-3 bg-[#f7f8f6] rounded-xl border border-[#e2ebdf] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#707a6f]">Status</span>
              <div className="flex items-center gap-1.5 font-medium">
                {keyStatus === 'active' && (
                  <span className="text-[#2f7d4a] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2f7d4a]" />
                    {authMode === 'custom' ? 'Custom API Key Active' : 'Default API Key Active'}
                  </span>
                )}
                {keyStatus === 'not_configured' && (
                  <span className="text-[#707a6f] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full border border-[#707a6f]" />
                    API Key Not Configured
                  </span>
                )}
                {keyStatus === 'invalid' && (
                  <span className="text-[#ba1a1a] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                    Invalid Key
                  </span>
                )}
              </div>
            </div>

            {validationError && (
              <p className="text-[11px] text-[#ba1a1a] flex items-center gap-1 pt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{validationError}</span>
              </p>
            )}
          </div>

          {/* Security Disclaimer */}
          <div className="flex items-start gap-1.5 text-[11px] text-[#707a6f] leading-snug">
            <Shield className="w-3.5 h-3.5 text-[#2f7d4a] shrink-0 mt-0.5" />
            <span>Your API key is stored only for this session and is not displayed after saving.</span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#f3fcf0]">
            {authMode === 'custom' && Boolean(getApiKey()) ? (
              <button
                type="button"
                onClick={handleRemoveKey}
                className="px-3 py-1.5 text-xs font-medium text-[#ba1a1a] hover:bg-[#feddd6]/40 rounded-xl transition-colors cursor-pointer"
              >
                Remove Key
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-[#404940] hover:text-[#151d17] hover:bg-[#f7f8f6] rounded-xl border border-[#e2ebdf] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isValidating}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#2f7d4a] hover:bg-[#24643a] disabled:opacity-60 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Validating...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Key</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
