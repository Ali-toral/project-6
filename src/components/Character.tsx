import React from 'react';
import sanjibakImg from '../assets/sanjibak.png';

interface CharacterProps {
  mood: 'happy' | 'excited' | 'thinking' | 'encouraging';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Character: React.FC<CharacterProps> = ({ mood, message, size = 'md' }) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  // Mood indicators around the character
  const moodDecor: Record<string, React.ReactNode> = {
    happy: null,
    excited: (
      <>
        <span className="absolute -top-1 -right-1 text-xl">✨</span>
        <span className="absolute -bottom-1 -left-1 text-xl">✨</span>
      </>
    ),
    thinking: <span className="absolute -top-2 -left-2 text-2xl">🤔</span>,
    encouraging: <span className="absolute -top-2 -left-2 text-2xl">💪</span>,
  };

  const bgColors: Record<string, string> = {
    happy: 'from-sky-100 to-teal-50',
    excited: 'from-amber-50 to-yellow-100',
    thinking: 'from-blue-50 to-indigo-100',
    encouraging: 'from-green-50 to-emerald-100',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeMap[size]} relative`}>
        <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${bgColors[mood]} shadow-lg border-2 border-white flex items-center justify-center overflow-visible`}>
          <img
            src={sanjibakImg}
            alt="سنجابک"
            className="w-[88%] h-[88%] object-contain drop-shadow-sm mix-blend-multiply"
            draggable={false}
          />
          {moodDecor[mood]}
        </div>
        {/* Name badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
          سنجابک
        </div>
      </div>
      {message && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md border border-teal-200 max-w-xs text-center relative mt-3">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-teal-200 rotate-45" />
          <p className="text-sm font-bold text-slate-700 leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
};

export default Character;
