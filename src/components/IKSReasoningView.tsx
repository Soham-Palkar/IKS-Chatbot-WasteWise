import React from 'react';
import { BookOpen, ArrowDown, ShieldCheck } from 'lucide-react';
import { IKSReasoning } from '../types';

interface IKSReasoningViewProps {
  reasoning: IKSReasoning;
}

export const IKSReasoningView: React.FC<IKSReasoningViewProps> = ({ reasoning }) => {
  const step1 = reasoning.traditionalKnowledge || reasoning.observation || 'Traditional resource stewardship practice.';
  const step2 = reasoning.knowledgePrinciple || reasoning.evidence || 'Ecological balance and resource conservation.';
  const step3 = reasoning.modernInterpretation || reasoning.inference || 'Contemporary waste reduction and circularity principle.';
  const step4 = reasoning.practicalApplication || reasoning.conclusion || 'Segregate and handle according to sustainable guidelines.';

  const steps = [
    { num: '01', title: 'Traditional Knowledge', desc: step1 },
    { num: '02', title: 'Knowledge Principle', desc: step2 },
    { num: '03', title: 'Modern Interpretation', desc: step3 },
    { num: '04', title: 'Practical Application', desc: step4 },
  ];

  return (
    <div className="mt-4 pt-4 border-t border-[#e2ebdf] bg-[#f9fcf8] rounded-xl p-3.5 sm:p-4 text-xs animate-fade-in">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 font-semibold text-[#151d17]">
          <BookOpen className="w-4 h-4 text-[#2f7d4a]" />
          <span>IKS Knowledge Connection</span>
        </div>
        {reasoning.topic && (
          <span className="text-[10px] text-[#2f7d4a] font-medium bg-[#e7f3ea] px-2 py-0.5 rounded-md border border-[#c6dfc3]">
            {reasoning.topic}
          </span>
        )}
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

      {reasoning.source && (
        <div className="mt-3.5 pt-2.5 border-t border-[#e2ebdf]/70 flex items-start gap-1.5 text-[10px] text-[#707a6f]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2f7d4a] shrink-0 mt-0.5" />
          <span><strong>Source:</strong> {reasoning.source}</span>
        </div>
      )}
    </div>
  );
};
