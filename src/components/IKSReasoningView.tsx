import React from 'react';
import { Brain, ArrowDown } from 'lucide-react';
import { IKSReasoning } from '../types';

interface IKSReasoningViewProps {
  reasoning: IKSReasoning;
}

export const IKSReasoningView: React.FC<IKSReasoningViewProps> = ({ reasoning }) => {
  const steps = [
    { num: '01', title: 'Observation', desc: reasoning.observation },
    { num: '02', title: 'Evidence', desc: reasoning.evidence },
    { num: '03', title: 'Inference', desc: reasoning.inference },
    { num: '04', title: 'Conclusion', desc: reasoning.conclusion },
  ];

  return (
    <div className="mt-4 pt-4 border-t border-[#e2ebdf] bg-[#f9fcf8] rounded-xl p-3.5 sm:p-4 text-xs animate-fade-in">
      <div className="flex items-center gap-1.5 font-semibold text-[#151d17] mb-3">
        <Brain className="w-4 h-4 text-[#2f7d4a]" />
        <span>IKS Reasoning Architecture</span>
      </div>

      <div className="relative pl-6 space-y-4">
        {/* Subtle vertical connecting line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[1.5px] bg-[#2f7d4a]/20" />

        {steps.map((step, idx) => (
          <div key={step.num} className="relative">
            {/* Step dot / number */}
            <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-white border border-[#2f7d4a]/40 text-[#2f7d4a] flex items-center justify-center text-[10px] font-bold shadow-2xs">
              {step.num}
            </div>

            <div>
              <div className="text-[11px] font-semibold tracking-wide text-[#2f7d4a] uppercase mb-0.5">
                {step.title}
              </div>
              <p className="text-[#404940] text-xs leading-relaxed">
                {step.desc}
              </p>
            </div>

            {idx < steps.length - 1 && (
              <div className="pl-0.5 py-1 text-[#2f7d4a]/40">
                <ArrowDown className="w-2.5 h-2.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
