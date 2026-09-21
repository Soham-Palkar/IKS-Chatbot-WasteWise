import React from 'react';
import { AlertCircle, KeyRound } from 'lucide-react';

interface LimitReachedCardProps {
  onManageKey: () => void;
}

export const LimitReachedCard: React.FC<LimitReachedCardProps> = ({ onManageKey }) => {
  return (
    <div className="w-full my-3 bg-white rounded-2xl border border-[#f3d3cb] p-4 sm:p-5 shadow-xs animate-fade-in">
      <div className="flex items-center gap-2 pb-2 mb-2 text-[#ba1a1a] border-b border-[#fff5f2]">
        <div className="p-1 rounded-md bg-[#ba1a1a]/10 text-[#ba1a1a]">
          <AlertCircle className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-semibold text-[#ba1a1a]">Session Limit Reached</span>
      </div>
      <p className="text-xs sm:text-sm text-[#404940] mb-3 leading-relaxed">
        Your WasteWise session credit limit has been reached.
      </p>
      <button
        type="button"
        onClick={onManageKey}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2f7d4a] hover:bg-[#24643a] rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        <KeyRound className="w-3.5 h-3.5" />
        <span>Manage API Key</span>
      </button>
    </div>
  );
};
