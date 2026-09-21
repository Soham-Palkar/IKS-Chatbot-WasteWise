import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorCardProps {
  onRetry: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ onRetry }) => {
  return (
    <div className="w-full my-3 bg-white rounded-2xl border border-[#feddd6] p-4 sm:p-5 shadow-xs animate-fade-in">
      <div className="flex items-center gap-2 pb-2 mb-2 text-[#ba1a1a]">
        <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
        <span className="text-xs font-semibold">Something went wrong</span>
      </div>
      <p className="text-xs sm:text-sm text-[#404940] mb-3">
        I couldn't process that request right now. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2f7d4a] hover:bg-[#24643a] rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Try Again</span>
      </button>
    </div>
  );
};
