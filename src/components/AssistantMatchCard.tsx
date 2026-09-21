import React from 'react';
import { Recycle, Sprout } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { WasteCategory } from '../types';

interface AssistantMatchCardProps {
  itemTitle: string;
  category: WasteCategory;
  categoryLabel?: string;
  description: string;
  degradationTime?: string;
  soilNutrientYield?: string;
}

export const AssistantMatchCard: React.FC<AssistantMatchCardProps> = ({
  itemTitle,
  category,
  categoryLabel,
  description,
  degradationTime,
  soilNutrientYield
}) => {
  return (
    <div className="w-full my-3 bg-white rounded-2xl border border-[#e2ebdf] p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f3fcf0]">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#2f7d4a]/15 text-[#2f7d4a]">
            <Recycle className="w-3 h-3" />
          </div>
          <span className="text-xs font-semibold text-[#151d17]">WasteWise Assistant</span>
        </div>
        <span className="text-[11px] font-medium text-[#707a6f] bg-[#f7f8f6] px-2 py-0.5 rounded-full border border-[#e2ebdf]">
          Instant Match
        </span>
      </div>

      {/* Item Title & Category */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className="text-base sm:text-lg font-semibold text-[#151d17] flex items-center gap-1.5">
          {itemTitle}
        </h3>
        <CategoryBadge category={category} customLabel={categoryLabel} />
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#404940] leading-relaxed mb-3 whitespace-pre-line">
        {description}
      </p>

      {/* Footer Metrics */}
      {(degradationTime || soilNutrientYield) && (
        <div className="pt-2.5 border-t border-[#f3fcf0] flex flex-wrap items-center gap-4 text-[11px] text-[#707a6f]">
          {degradationTime && (
            <div className="flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-[#2f7d4a]" />
              <span>Degradation time: <strong className="text-[#151d17] font-medium">{degradationTime}</strong></span>
            </div>
          )}
          {soilNutrientYield && (
            <div className="flex items-center gap-1">
              <span>Soil Nutrient Yield: <strong className="text-[#151d17] font-medium">{soilNutrientYield}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
