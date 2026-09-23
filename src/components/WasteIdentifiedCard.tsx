import React, { useState } from 'react';
import { Scan, ShieldCheck, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { IKSReasoningView } from './IKSReasoningView';
import { WasteCategory, IKSReasoning } from '../types';

interface WasteIdentifiedCardProps {
  itemTitle: string;
  category: WasteCategory;
  categoryLabel?: string;
  description: string;
  imageUrl?: string;
  resinCode?: string;
  confidence?: number;
  iksReasoning?: IKSReasoning;
}

export const WasteIdentifiedCard: React.FC<WasteIdentifiedCardProps> = ({
  itemTitle,
  category,
  categoryLabel,
  description,
  imageUrl,
  resinCode,
  confidence = 0.94,
  iksReasoning,
}) => {
  const [isIksExpanded, setIsIksExpanded] = useState(false);
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="w-full my-3 bg-white rounded-2xl border border-[#e2ebdf] p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f3fcf0]">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#151d17] uppercase">
          <div className="p-1 rounded-sm bg-[#2f7d4a]/10 text-[#2f7d4a]">
            <Scan className="w-3.5 h-3.5" />
          </div>
          <span>WASTE IDENTIFIED</span>
        </div>
        <CategoryBadge category={category} customLabel={categoryLabel} doubleDot={true} />
      </div>

      {/* Main Content: Thumbnail & Details */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Image Thumbnail */}
        {imageUrl ? (
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#e7f0e5] border border-[#e2ebdf] shrink-0 self-center sm:self-start">
            <img
              src={imageUrl}
              alt={itemTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {resinCode && (
              <span className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm">
                {resinCode}
              </span>
            )}
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl bg-[#e7f0e5] flex items-center justify-center text-2xl border border-[#e2ebdf] shrink-0 self-center sm:self-start">
            🧴
          </div>
        )}

        {/* Text Info */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-base sm:text-lg font-semibold text-[#151d17] mb-1 flex items-center gap-1.5">
            {itemTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#404940] leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1 text-[#404940] font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2f7d4a]" />
            <span>AI Confidence Score</span>
          </div>
          <span className="font-semibold text-xs text-[#151d17]">
            {confidencePercent}%
          </span>
        </div>

        {/* Green Meter Bar */}
        <div className="w-full h-2 bg-[#e7f0e5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2f7d4a] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Expand IKS Knowledge Connection Button */}
      {iksReasoning && (
        <div className="mt-3 pt-3 border-t border-[#f3fcf0]">
          <button
            type="button"
            onClick={() => setIsIksExpanded((prev) => !prev)}
            aria-expanded={isIksExpanded}
            className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-medium text-[#151d17] hover:text-[#2f7d4a] hover:bg-[#f3fcf0] rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-[#2f7d4a]">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="font-semibold">View IKS Knowledge Connection</span>
            </div>
            {isIksExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#707a6f]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#707a6f]" />
            )}
          </button>

          {isIksExpanded && <IKSReasoningView reasoning={iksReasoning} />}
        </div>
      )}
    </div>
  );
};
