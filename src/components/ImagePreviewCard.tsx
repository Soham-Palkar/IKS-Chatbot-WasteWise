import React from 'react';
import { Camera, Sparkles, X, Loader2 } from 'lucide-react';

interface ImagePreviewCardProps {
  imageUrl: string;
  fileName: string;
  isAnalyzing: boolean;
  onCancel: () => void;
  onAnalyze: () => void;
}

export const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({
  imageUrl,
  fileName,
  isAnalyzing,
  onCancel,
  onAnalyze,
}) => {
  return (
    <div className="w-full my-3 bg-white rounded-2xl border border-[#e2ebdf] p-4 sm:p-5 shadow-xs animate-fade-in">
      {!isAnalyzing ? (
        <>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f3fcf0]">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-[#2f7d4a]/10 text-[#2f7d4a]">
                <Camera className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-[#151d17]">Identify Waste</span>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-[#707a6f] hover:text-[#151d17] p-1 rounded-md transition-colors"
              aria-label="Cancel image upload"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="w-32 h-32 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#e7f0e5] border border-[#e2ebdf] shrink-0">
              <img
                src={imageUrl}
                alt="Selected waste preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-semibold text-sm text-[#151d17] truncate max-w-[280px]">
                {fileName}
              </p>
              <p className="text-xs text-[#707a6f] mt-1">
                Ready to extract material composition and segregation protocol.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f3fcf0]">
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-1.5 text-xs font-medium text-[#404940] hover:text-[#151d17] hover:bg-[#f7f8f6] rounded-xl border border-[#e2ebdf] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              id="btn-analyze-waste"
              onClick={onAnalyze}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#2f7d4a] hover:bg-[#24643a] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Waste</span>
            </button>
          </div>
        </>
      ) : (
        <div className="py-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#e7f3ea] flex items-center justify-center text-[#2f7d4a] mb-3">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <h4 className="text-sm font-semibold text-[#151d17] mb-1">
            Analyzing waste...
          </h4>
          <p className="text-xs text-[#707a6f] max-w-xs">
            Identifying the item and determining its waste category.
          </p>
          {/* Subtle animated dots */}
          <div className="flex items-center gap-1.5 mt-3">
            <span className="w-2 h-2 rounded-full bg-[#2f7d4a] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-[#2f7d4a] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-[#2f7d4a] animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
};
