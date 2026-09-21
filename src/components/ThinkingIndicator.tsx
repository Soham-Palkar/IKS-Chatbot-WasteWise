import React from 'react';
import { Recycle } from 'lucide-react';

export const ThinkingIndicator: React.FC = () => {
  return (
    <div className="w-full my-3 bg-white rounded-2xl border border-[#e2ebdf] p-3 sm:p-4 shadow-xs animate-fade-in flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-[#2f7d4a]/10 flex items-center justify-center text-[#2f7d4a]">
          <Recycle className="w-3.5 h-3.5 animate-spin [animation-duration:3s]" />
        </div>
        <span className="text-xs text-[#404940] font-medium">
          WasteWise is thinking...
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2f7d4a] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#2f7d4a] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#2f7d4a] animate-bounce" />
      </div>
    </div>
  );
};
