import React from 'react';
import { Recycle } from 'lucide-react';
import { QUICK_PROMPTS } from '../data/mockWaste';

interface WelcomeStateProps {
  onSelectPrompt: (promptText: string) => void;
}

export const WelcomeState: React.FC<WelcomeStateProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 px-4 animate-fade-in max-w-md mx-auto my-auto">
      {/* Small Icon */}
      <div className="w-12 h-12 rounded-2xl bg-[#e7f3ea] flex items-center justify-center text-[#2f7d4a] mb-3 shadow-2xs">
        <Recycle className="w-6 h-6" />
      </div>

      <h1 className="text-xl font-bold tracking-tight text-[#151d17]">
        WasteWise
      </h1>
      <p className="text-xs font-semibold text-[#2f7d4a] uppercase tracking-wider mb-2">
        AI Waste Segregation Assistant
      </p>

      <p className="text-xs sm:text-sm text-[#404940] max-w-sm mb-6 leading-relaxed">
        Ask where something belongs, or upload a photo and I'll help identify its material composition and disposal stream.
      </p>

      <div className="w-full">
        <div className="text-[11px] font-semibold text-[#707a6f] uppercase tracking-wider mb-2.5">
          Quick Questions
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {QUICK_PROMPTS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-[#e2ebdf] text-[#151d17] hover:bg-[#edf6ea] hover:border-[#2f7d4a]/50 hover:text-[#124727] transition-all shadow-2xs cursor-pointer"
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
