import React from 'react';

interface UserMessageProps {
  text: string;
  timestamp: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({ text, timestamp }) => {
  return (
    <div className="flex flex-col items-end my-3 max-w-[90%] sm:max-w-[70%] ml-auto animate-fade-in">
      {/* Sender and Time metadata */}
      <div className="flex items-center gap-2 mb-1.5 px-1 text-[11px] text-[#404940] font-medium select-none">
        <span>You</span>
        <span className="text-[#707a6f]/70 font-normal">{timestamp}</span>
      </div>

      {/* Message Bubble */}
      <div className="bg-[#124727] text-white px-4 py-2.5 rounded-2xl rounded-tr-xs text-sm sm:text-[15px] leading-relaxed shadow-xs font-normal">
        {text}
      </div>
    </div>
  );
};
