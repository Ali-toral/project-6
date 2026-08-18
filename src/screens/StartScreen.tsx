import React, { useEffect, useState } from 'react';
import Character from '../components/Character';
import { toPersianDigits } from '../utils/numberToWord';

interface StartScreenProps {
  onStart: () => void;
  onContinue: () => void;
  onReport: () => void;
  hasSavedProgress: boolean;
  totalStars: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onContinue, onReport, hasSavedProgress, totalStars }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-sky-500 to-indigo-600 flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Static background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { e: '🌰', l: 8, t: 18 },
          { e: '', l: 85, t: 12 },
          { e: '🔢', l: 12, t: 75 },
          { e: '🧮', l: 82, t: 70 },
        ].map(({ e, l, t }, i) => (
          <div key={i} className="absolute opacity-25 text-2xl md:text-3xl" style={{ left: `${l}%`, top: `${t}%` }}>
            {e}
          </div>
        ))}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full" />
      </div>

      <div className={`relative z-10 flex flex-col items-center gap-5 max-w-md w-full transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Title Card */}
        <div className="text-center bg-white/15 backdrop-blur-sm rounded-3xl p-6 w-full border border-white/25 shadow-2xl">
          <div className="text-5xl mb-3">🏰</div>
          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg leading-relaxed">
            شهر عددها
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-yellow-100 mt-1 drop-shadow">
            و گنج چهارصدتایی‌ها
          </h2>
          <div className="flex justify-center gap-2 mt-3">
            <span className="text-2xl">🟣</span>
            <span className="text-2xl">🔵</span>
            <span className="text-2xl">🟡</span>
          </div>
        </div>

        {/* Character */}
        <Character
          mood="excited"
          message="سلام! من سنجابک هستم! بیا با هم ماجراجویی کنیم و عددهای ۴۰۰ تا ۴۹۹ رو یاد بگیریم!"
          size="lg"
        />

        {/* Progress indicator */}
        {hasSavedProgress && totalStars > 0 && (
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 text-center w-full border border-white/25">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🌟</span>
              <span className="text-white font-black text-xl">{toPersianDigits(totalStars)}</span>
              <span className="text-white/80 font-bold text-sm">امتیاز داری!</span>
            </div>
            <p className="text-white/70 text-xs mt-1">
              تو از دفعه قبل قوی‌تر شدی!
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          {hasSavedProgress && (
            <button onClick={onContinue}
              className="w-full py-4 bg-gradient-to-r from-emerald-400 to-green-500 text-white font-black text-xl rounded-2xl shadow-lg shadow-emerald-900/20 hover:shadow-xl transform hover:scale-[1.02] transition-all active:scale-95 border-2 border-white/30 flex items-center justify-center gap-2">
              <span>🚀</span> <span>ادامه بازی</span>
            </button>
          )}
          <button onClick={onStart}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-xl rounded-2xl shadow-lg shadow-amber-900/20 hover:shadow-xl transform hover:scale-[1.02] transition-all active:scale-95 border-2 border-white/30 flex items-center justify-center gap-2">
            <span>🎮</span> <span>{hasSavedProgress ? 'شروع جدید' : 'شروع بازی'}</span>
          </button>
          <button onClick={onReport}
            className="w-full py-4 bg-gradient-to-r from-violet-400 to-purple-500 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all active:scale-95 border-2 border-white/30 flex items-center justify-center gap-2">
            <span>📋</span> <span>کارنامه مربی</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-2">
          <p className="text-white/60 text-xs">
            🐿️ بازی آموزشی ارزش مکانی عددها
          </p>
          <p className="text-white/40 text-[10px] mt-1">
            عدد ۴۰۰ تا ۴۹۹ • صدتایی • ده‌تایی • یکی
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
