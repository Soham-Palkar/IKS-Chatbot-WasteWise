import React from 'react';
import { Recycle, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#f3fcf0]/95 backdrop-blur-xs border-b border-[#e2ebdf] px-3 sm:px-4 py-2.5">
      <div className="max-w-[1040px] mx-auto flex items-center justify-between gap-2">
        {/* Left Branding */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2f7d4a]/10 text-[#2f7d4a] shrink-0">
            <Recycle className="w-4.5 h-4.5" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-base sm:text-base tracking-tight text-[#151d17]">
              WasteWise
            </span>
            <span className="hidden sm:inline-block text-[#707a6f]/60 font-light select-none">|</span>
            <span className="hidden sm:inline-block text-xs text-[#404940] font-normal tracking-tight truncate">
              AI Waste Segregation Assistant
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
