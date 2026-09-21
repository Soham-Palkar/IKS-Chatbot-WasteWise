import React from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';
import { DecisionOption } from '../types';

interface DecisionCardProps {
  question: string;
  options: DecisionOption[];
  isAnswered?: boolean;
  selectedDecision?: string;
  onSelectOption: (option: DecisionOption) => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  question,
  options,
  isAnswered = false,
  selectedDecision,
  onSelectOption,
}) => {
  return (
    <div className="w-full my-3 bg-white rounded-2xl border border-[#e2ebdf] p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f3fcf0]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#151d17]">
          <span className="w-2 h-2 rounded-full bg-[#c8872f]" />
          <span>Material Verification</span>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#fff5e5] text-[#b46506] border border-[#feddb2]">
          <HelpCircle className="w-3 h-3 text-[#b46506]" />
          <span>Decision Required</span>
        </span>
      </div>

      {/* Question */}
      <p className="text-xs sm:text-sm text-[#404940] leading-relaxed mb-4">
        {question}
      </p>

      {/* Decision Option Buttons */}
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const isSelected = selectedDecision === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectOption(opt)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#e7f3ea] border-[#2f7d4a] text-[#124727] shadow-xs'
                  : isAnswered
                  ? 'bg-[#f7f8f6] border-[#e2ebdf] text-[#707a6f] opacity-60 cursor-not-allowed'
                  : 'bg-[#f7f8f6] border-[#e2ebdf] text-[#151d17] hover:bg-[#e7f3ea] hover:border-[#2f7d4a]/50 hover:text-[#124727]'
              }`}
            >
              {opt.icon && <span className="text-base">{opt.icon}</span>}
              <span>{opt.label}</span>
              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#2f7d4a] ml-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
