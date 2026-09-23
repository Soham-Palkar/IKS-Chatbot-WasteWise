import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { IKSReasoningView } from './IKSReasoningView';
import { IKSReasoning } from '../types';

interface IKSInsightCardProps {
  reasoning: IKSReasoning;
  defaultExpanded?: boolean;
}

export const IKSInsightCard: React.FC<IKSInsightCardProps> = ({
  reasoning,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="w-full mt-3 pt-3 border-t border-[#f3fcf0]">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        className="w-full flex items-center justify-between py-1.5 px-2.5 text-xs font-medium text-[#151d17] hover:text-[#2f7d4a] hover:bg-[#f3fcf0] rounded-xl transition-colors cursor-pointer border border-[#e2ebdf]/60"
      >
        <div className="flex items-center gap-1.5 text-[#2f7d4a]">
          <BookOpen className="w-3.5 h-3.5" />
          <span className="font-semibold">IKS Knowledge Connection</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[#707a6f]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#707a6f]" />
        )}
      </button>

      {isExpanded && <IKSReasoningView reasoning={reasoning} />}
    </div>
  );
};
