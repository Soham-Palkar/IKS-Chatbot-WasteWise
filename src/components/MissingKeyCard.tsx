import React from 'react';
import { KeyRound, Settings } from 'lucide-react';

interface MissingKeyCardProps {
  onOpenSettings: () => void;
}

export const MissingKeyCard: React.FC<MissingKeyCardProps> = ({ onOpenSettings }) => {
  return (
    <div className="w-full my-3 bg-white rounded-2xl border border-[#e2ebdf] p-4 sm:p-5 shadow-xs animate-fade-in">
      <div className="flex items-center gap-2 pb-2 mb-2 text-[#404940] border-b border-[#f3fcf0]">
        <div className="p-1 rounded-md bg-[#2f7d4a]/10 text-[#2f7d4a]">
          <KeyRound className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-semibold text-[#151d17]">Gemini API Key Required</span>
      </div>
      <p className="text-xs sm:text-sm text-[#404940] mb-3 leading-relaxed">
        To use WasteWise AI chat, add a Gemini API key in Settings.
      </p>
      <button
        type="button"
        onClick={onOpenSettings}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2f7d4a] hover:bg-[#24643a] rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        <Settings className="w-3.5 h-3.5" />
        <span>Open Settings</span>
      </button>
    </div>
  );
};
