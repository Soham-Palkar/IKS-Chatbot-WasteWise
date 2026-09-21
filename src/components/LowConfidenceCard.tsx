import React from 'react';
import { HelpCircle } from 'lucide-react';

interface LowConfidenceCardProps {
  onSelectClarification: (itemType: string) => void;
}

export const LowConfidenceCard: React.FC<LowConfidenceCardProps> = ({
  onSelectClarification,
}) => {
  const options = [
    { label: 'Plastic container', emoji: '🧴' },
    { label: 'Glass container', emoji: '🫙' },
    { label: 'Metal container', emoji: '🥫' },
  ];

  return (
    <div className="w-full my-3 bg-white rounded-2xl border border-[#e2ebdf] p-4 sm:p-5 shadow-xs animate-fade-in">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#f3fcf0]">
        <div className="p-1 rounded bg-[#c8872f]/10 text-[#c8872f]">
          <HelpCircle className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-semibold text-[#151d17]">
          Identification Uncertain
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[#404940] leading-relaxed mb-4">
        I'm not confident enough to identify this item from the image alone. Can you help me narrow it down?
      </p>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => onSelectClarification(opt.label)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl border border-[#e2ebdf] bg-[#f7f8f6] text-[#151d17] hover:bg-[#e7f3ea] hover:border-[#2f7d4a]/50 hover:text-[#124727] transition-all cursor-pointer"
          >
            <span>{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
