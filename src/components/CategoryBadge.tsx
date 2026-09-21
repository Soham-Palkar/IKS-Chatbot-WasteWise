import React from 'react';
import { WasteCategory } from '../types';

interface CategoryBadgeProps {
  category: WasteCategory;
  customLabel?: string;
  doubleDot?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  customLabel,
  doubleDot = false
}) => {
  let badgeStyles = 'bg-[#e7f3ea] text-[#24643a] border-[#cde5d3]';
  let dotColor = 'bg-[#2f7d4a]';
  let defaultLabel = 'Wet / Organic Waste';

  if (category === 'dry') {
    badgeStyles = 'bg-[#e8f1fa] text-[#1e5a88] border-[#cbe1f5]';
    dotColor = 'bg-[#287bb5]';
    defaultLabel = 'Dry / Recyclable';
  } else if (category === 'ewaste') {
    badgeStyles = 'bg-[#feecec] text-[#b92c2c] border-[#fad2d2]';
    dotColor = 'bg-[#d63030]';
    defaultLabel = 'E-Waste';
  } else if (category === 'hazardous' || category === 'special') {
    badgeStyles = 'bg-[#fff5e5] text-[#b46506] border-[#feddb2]';
    dotColor = 'bg-[#d97706]';
    defaultLabel = 'Hazardous / Special';
  }

  const label = customLabel || defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeStyles} tracking-tight select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {doubleDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} -ml-0.5`} />}
      <span>{label}</span>
    </span>
  );
};
