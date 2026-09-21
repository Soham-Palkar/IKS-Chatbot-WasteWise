import React from 'react';
import { X, Activity, Key } from 'lucide-react';
import { ApiUsageState, SettingsState } from '../types';

interface ApiUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiUsage: ApiUsageState;
  settings: SettingsState;
  onOpenSettings: () => void;
}

export const ApiUsageModal: React.FC<ApiUsageModalProps> = ({
  isOpen,
  onClose,
  apiUsage,
  settings,
  onOpenSettings,
}) => {
  if (!isOpen) return null;

  const percentage = Math.min(100, Math.round((apiUsage.usedRequests / apiUsage.maxRequests) * 100));
  const isHigh = percentage >= 80 && percentage < 100;
  const isLimitReached = percentage >= 100;

  // Determine key badge display
  let keyStatusLabel = 'API Key Not Configured';
  let keyStatusDot = 'border border-[#707a6f]';
  let keyTextColor = 'text-[#707a6f]';

  if (settings.authMode === 'custom' && settings.keyStatus === 'active') {
    keyStatusLabel = 'Custom API Key Active';
    keyStatusDot = 'bg-[#2f7d4a]';
    keyTextColor = 'text-[#2f7d4a]';
  } else if (settings.authMode === 'default' && settings.keyStatus === 'active') {
    keyStatusLabel = 'Default API Key Active';
    keyStatusDot = 'bg-[#2f7d4a]';
    keyTextColor = 'text-[#2f7d4a]';
  } else if (settings.keyStatus === 'invalid') {
    keyStatusLabel = 'Invalid API Key';
    keyStatusDot = 'bg-[#ba1a1a]';
    keyTextColor = 'text-[#ba1a1a]';
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl border border-[#e2ebdf] p-5 shadow-lg relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f3fcf0]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#2f7d4a]/10 text-[#2f7d4a]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#151d17]">API Usage</h2>
              <p className="text-[10px] text-[#707a6f]">Current Session</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close API Usage dialog"
            className="p-1 rounded-md text-[#707a6f] hover:text-[#151d17] hover:bg-[#f7f8f6] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Usage metrics */}
        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#707a6f]">Current Session</span>
            <span className="font-semibold text-[#151d17]">
              {apiUsage.usedRequests} / {apiUsage.maxRequests} credits
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#707a6f]">Session Consumption</span>
              <span
                className={`font-semibold ${
                  isLimitReached
                    ? 'text-[#ba1a1a]'
                    : isHigh
                    ? 'text-[#e07a1e]'
                    : 'text-[#2f7d4a]'
                }`}
              >
                {percentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-[#e7f0e5] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isLimitReached
                    ? 'bg-[#ba1a1a]'
                    : isHigh
                    ? 'bg-[#e07a1e]'
                    : 'bg-[#2f7d4a]'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs pt-1 border-t border-[#f3fcf0]">
            <span className="text-[#707a6f]">Status</span>
            <span
              className={`inline-flex items-center gap-1.5 font-medium ${
                isLimitReached ? 'text-[#ba1a1a]' : 'text-[#2f7d4a]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLimitReached ? 'bg-[#ba1a1a]' : 'bg-[#2f7d4a]'
                }`}
              />
              {isLimitReached ? 'Limit Reached' : 'Active'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#707a6f] flex items-center gap-1">
              <Key className="w-3 h-3 text-[#707a6f]" />
              API Key
            </span>
            <span className={`inline-flex items-center gap-1.5 font-medium ${keyTextColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${keyStatusDot}`} />
              {keyStatusLabel}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-[#f3fcf0] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="text-xs font-semibold text-[#2f7d4a] hover:underline cursor-pointer"
          >
            Manage API Key
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#2f7d4a] text-white hover:bg-[#24643a] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
