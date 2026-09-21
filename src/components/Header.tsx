import React from 'react';
import { Recycle, Settings } from 'lucide-react';
import { ApiUsageState } from '../types';

interface HeaderProps {
  apiUsage: ApiUsageState;
  onOpenUsage: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiUsage,
  onOpenUsage,
  onOpenSettings,
}) => {
  const percentage = Math.round((apiUsage.usedRequests / apiUsage.maxRequests) * 100);
  const isLimitReached = percentage >= 100;
  const isWarning = percentage >= 80;

  // Status dot color
  let dotColor = 'bg-[#2f7d4a]'; // 🟢 Normal dark green
  if (isLimitReached) {
    dotColor = 'bg-[#ba1a1a]'; // 🔴 Limit reached
  } else if (isWarning) {
    dotColor = 'bg-[#e07a1e]'; // 🟠 Warning / Near limit
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-[#f3fcf0]/95 backdrop-blur-xs border-b border-[#e2ebdf] px-3 sm:px-4 py-2 sm:py-2.5">
      <div className="max-w-[1040px] mx-auto flex items-center justify-between gap-2">
        {/* Left Branding */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2f7d4a]/10 text-[#2f7d4a] shrink-0">
            <Recycle className="w-4.5 h-4.5" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-base sm:text-base tracking-tight text-[#151d17]">
              WasteWise
            </span>
            <span className="hidden sm:inline-block text-[#707a6f]/60 font-light select-none">|</span>
            <span className="hidden sm:inline-block text-xs text-[#404940] font-normal tracking-tight truncate">
              AI Waste Segregation Assistant
            </span>
          </div>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Compact Usage Pill: [ 🟢 44 / 50 credits (88%) ] */}
          <button
            type="button"
            id="btn-api-usage"
            onClick={onOpenUsage}
            aria-label={`API usage: ${apiUsage.usedRequests} of ${apiUsage.maxRequests} credits used (${percentage}%)`}
            title="Click to view WasteWise session credit usage"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs font-medium rounded-full bg-[#f0f8ee] border border-[#c6dfc3] hover:bg-[#e6f3e3] hover:border-[#2f7d4a]/40 text-[#151d17] transition-all cursor-pointer shadow-2xs select-none"
          >
            {/* Dark green / orange / red status dot */}
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />

            {/* Desktop / tablet full label */}
            <span className="hidden sm:inline text-[#151d17] font-medium">
              {apiUsage.usedRequests} / {apiUsage.maxRequests} credits
            </span>
            <span className="hidden sm:inline text-[#586b59] text-[11px] font-normal">
              ({percentage}%)
            </span>

            {/* Compact mobile label: 🟢 44/50 */}
            <span className="sm:hidden text-[#151d17] font-medium">
              {apiUsage.usedRequests}/{apiUsage.maxRequests}
            </span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            id="btn-settings"
            onClick={onOpenSettings}
            aria-label="Open Settings"
            title="Settings"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-medium rounded-full bg-white border border-[#e2ebdf] text-[#151d17] hover:bg-[#edf6ea] hover:border-[#2f7d4a]/40 transition-colors cursor-pointer shadow-2xs"
          >
            <Settings className="w-3.5 h-3.5 text-[#404940]" />
            <span className="hidden xs:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
