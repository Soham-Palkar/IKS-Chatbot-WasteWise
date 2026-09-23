import React from 'react';
import { X, Settings, Shield, CheckCircle } from 'lucide-react';
import { SettingsState } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  onSaveSettings: (newSettings: SettingsState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

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

        <div className="space-y-4">
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
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#2f7d4a] bg-[#f7f8f6] transition-colors">
                <input
                  type="radio"
                  name="authMode"
                  checked={true}
                  readOnly
                  className="text-[#2f7d4a] focus:ring-[#2f7d4a]"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#151d17]">Managed API Key</div>
                  <div className="text-[11px] text-[#707a6f]">Using backend environment configuration</div>
                </div>
              </label>
            </div>
          </div>

          {/* Status Row */}
          <div className="p-3 bg-[#f7f8f6] rounded-xl border border-[#e2ebdf] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#707a6f]">Status</span>
              <div className="flex items-center gap-1.5 font-medium text-[#2f7d4a]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2f7d4a]" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Security Disclaimer */}
          <div className="flex items-start gap-1.5 text-[11px] text-[#707a6f] leading-snug">
            <Shield className="w-3.5 h-3.5 text-[#2f7d4a] shrink-0 mt-0.5" />
            <span>API keys are securely managed by the system administrator.</span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#f3fcf0]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-[#404940] hover:text-[#151d17] hover:bg-[#f7f8f6] rounded-xl border border-[#e2ebdf] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
