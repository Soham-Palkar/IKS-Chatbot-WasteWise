import React, { useRef, useState } from 'react';
import { Camera, Mic, SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onImageSelected: (file: File) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onImageSelected,
  disabled = false,
}) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
      // Reset input value so same file can be selected again if needed
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pb-4 pt-2 bg-gradient-to-t from-[#f3fcf0] via-[#f3fcf0]/95 to-transparent px-3 sm:px-4">
      <div className="max-w-[1000px] mx-auto">
        {/* Hidden camera / file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          id="waste-camera-input"
          aria-label="Upload waste image"
        />

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-1.5 sm:gap-2 bg-white rounded-full border border-[#e2ebdf] px-2 py-1.5 sm:px-3 sm:py-2 shadow-sm transition-all focus-within:border-[#2f7d4a] focus-within:shadow-md"
        >
          {/* Camera / Image Button */}
          <button
            type="button"
            id="btn-upload-image"
            onClick={triggerFileInput}
            disabled={disabled}
            aria-label="Upload or take photo of waste"
            title="Upload or take photo of waste"
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-[#404940] hover:text-[#2f7d4a] hover:bg-[#f3fcf0] transition-colors cursor-pointer shrink-0"
          >
            <Camera className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            id="waste-text-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={disabled}
            placeholder="Ask where your waste belongs (e.g. coffee cup, aerosol can)..."
            className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#151d17] placeholder:text-[#707a6f] focus:outline-hidden py-1 px-1"
          />

          {/* Visual Microphone Icon (UI indicator) */}
          <div
            title="Voice input indicator"
            className="hidden xs:flex items-center justify-center w-7 h-7 text-[#707a6f]/60 select-none shrink-0"
          >
            <Mic className="w-4 h-4" />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            id="btn-send-message"
            disabled={!inputText.trim() || disabled}
            aria-label="Send query"
            title="Send query"
            className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all shrink-0 cursor-pointer ${
              inputText.trim() && !disabled
                ? 'bg-[#124727] text-white hover:bg-[#0d361d] shadow-xs'
                : 'bg-[#e2ebdf] text-[#707a6f] cursor-not-allowed opacity-70'
            }`}
          >
            <SendHorizontal className="w-4 h-4 -mr-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
