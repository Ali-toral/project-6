import React from 'react';
import Character from '../components/Character';
import { toPersianDigits } from '../utils/numberToWord';

interface GameCompleteScreenProps {
  totalStars: number;
  maxCombo: number;
  completedStages: number;
  totalStages: number;
  onRestart: () => void;
  onMenu: () => void;
}

export const GameCompleteScreen: React.FC<GameCompleteScreenProps> = ({
  totalStars, maxCombo, completedStages, totalStages, onRestart, onMenu,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Static decorations */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="text-9xl opacity-20">🏆</div>
      </div>
      <div className="absolute top-10 right-10 text-4xl opacity-30">🎉</div>
      <div className="absolute bottom-16 left-12 text-4xl opacity-30">🎊</div>

      <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 space-y-5">
        {/* Trophy */}
        <div className="text-center">
          <div className="text-7xl mb-2">🏆</div>
          <h1 className="text-2xl font-black text-indigo-700">
            قهرمان ارزش مکانی!
          </h1>
        </div>

        {/* Character */}
        <Character mood="excited" message="تو عددهای ۴۰۰ تا ۴۹۹ رو یاد گرفتی! آفرین!" size="md" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-200">
            <p className="text-2xl font-black text-yellow-600">🌟 {toPersianDigits(totalStars)}</p>
            <p className="text-xs font-bold text-yellow-500">امتیاز</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-3 text-center border border-indigo-200">
            <p className="text-2xl font-black text-indigo-600">🐿️ {toPersianDigits(maxCombo)}</p>
            <p className="text-xs font-bold text-indigo-500">بهترین زنجیره</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
            <p className="text-2xl font-black text-emerald-600">✅ {toPersianDigits(completedStages)}/{toPersianDigits(totalStages)}</p>
            <p className="text-xs font-bold text-emerald-500">مراحل</p>
          </div>
        </div>

        {/* Message */}
        <div className="bg-gradient-to-r from-teal-50 to-sky-50 rounded-xl px-4 py-3 text-center border border-teal-200">
          <p className="text-lg font-black text-teal-700">
            تو عددها رو می‌فهمی! 🔢💪
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button onClick={onMenu}
            className="w-full py-3 bg-gradient-to-r from-indigo-400 to-violet-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all active:scale-95">
            🗺️ نقشه مراحل
          </button>
          <button onClick={onRestart}
            className="w-full py-3 bg-gradient-to-r from-sky-400 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all active:scale-95">
            🔄 شروع دوباره
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCompleteScreen;
