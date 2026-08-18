import React from 'react';
import Character from '../components/Character';
import { toPersianDigits } from '../utils/numberToWord';

interface StageCompleteScreenProps {
  stageId: number;
  stageName: string;
  starsEarned: number;
  totalStars: number;
  maxCombo: number;
  correctCount: number;
  totalCount: number;
  onNext: () => void;
  onReplay: () => void;
  onMenu: () => void;
  isLastStage: boolean;
}

export const StageCompleteScreen: React.FC<StageCompleteScreenProps> = ({
  stageId, stageName, starsEarned, totalStars, maxCombo,
  correctCount, totalCount, onNext, onReplay, onMenu, isLastStage,
}) => {
  const percentage = Math.round((correctCount / totalCount) * 100);
  const message = percentage >= 80 ? 'فوق‌العاده بود! 🐿️' :
    percentage >= 60 ? 'خیلی خوب بود! 👁️' :
    'ادامه بده، داری پیشرفت می‌کنی! 💪';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-emerald-700">
            🎉 مرحله {toPersianDigits(stageId)} تمام شد!
          </h1>
          <p className="text-lg font-bold text-emerald-600 mt-1">{stageName}</p>
        </div>

        {/* Character */}
        <Character mood="excited" message={message} size="md" />

        {/* Stars */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map(s => (
            <span key={s} className={`text-4xl transition-all ${s <= starsEarned ? '' : 'opacity-20'}`}>
              👁️
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-200">
            <p className="text-2xl font-black text-yellow-600">🌟 {toPersianDigits(totalStars)}</p>
            <p className="text-xs font-bold text-yellow-500">کل امتیاز</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-3 text-center border border-indigo-200">
            <p className="text-2xl font-black text-indigo-600">🐿️ {toPersianDigits(maxCombo)}</p>
            <p className="text-xs font-bold text-indigo-500">بهترین زنجیره</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
            <p className="text-2xl font-black text-green-600">✅ {toPersianDigits(correctCount)}/{toPersianDigits(totalCount)}</p>
            <p className="text-xs font-bold text-green-500">پاسخ درست</p>
          </div>
        </div>

        {/* Progress message */}
        <div className="bg-indigo-50 rounded-xl px-4 py-3 text-center border border-indigo-200">
          <p className="text-sm font-bold text-indigo-700">
            امروز خیلی خوب تلاش کردی! 💪🐿️
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          {!isLastStage && (
            <button onClick={onNext}
              className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all active:scale-95">
              🚀 مرحله بعد
            </button>
          )}
          <button onClick={onReplay}
            className="w-full py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all active:scale-95">
            🔄 دوباره بازی کن
          </button>
          <button onClick={onMenu}
            className="w-full py-3 bg-gray-100 text-gray-700 font-bold text-lg rounded-2xl hover:bg-gray-200 transition-all">
            🗺️ نقشه مراحل
          </button>
        </div>
      </div>
    </div>
  );
};

export default StageCompleteScreen;
