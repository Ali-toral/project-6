import React from 'react';
import { Stage } from '../types';
import Character from '../components/Character';
import { toPersianDigits } from '../utils/numberToWord';

interface StageSelectScreenProps {
  stages: Stage[];
  totalStars: number;
  onSelectStage: (stageId: number) => void;
  onBack: () => void;
}

export const StageSelectScreen: React.FC<StageSelectScreenProps> = ({
  stages, totalStars, onSelectStage, onBack,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 p-4 flex flex-col" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onBack}
          className="bg-white/20 text-white font-bold px-4 py-2 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all active:scale-95 text-sm">
          ⬅️ برگشت
        </button>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white font-bold text-sm flex items-center gap-1">
          <span>🌟</span> <span>{toPersianDigits(totalStars)}</span>
        </div>
      </div>

      {/* Title + Character */}
      <div className="text-center mb-3">
        <h1 className="text-2xl font-black text-white drop-shadow-lg mb-2">
          🗺️ نقشه ماجراجویی
        </h1>
        <Character mood="happy" message="کدوم مرحله رو بازی کنیم؟" size="sm" />
      </div>

      {/* Path visualization */}
      <div className="flex-1 max-w-xl mx-auto w-full">
        <div className="space-y-3">
          {stages.map((stage, idx) => {
            const isOdd = idx % 2 === 1;
            return (
              <div key={stage.id} className={`flex items-center gap-3 ${isOdd ? 'flex-row-reverse' : ''}`}>
                {/* Stage Card */}
                <button
                  onClick={() => stage.unlocked ? onSelectStage(stage.id) : undefined}
                  disabled={!stage.unlocked}
                  className={`flex-1 relative rounded-2xl p-4 flex items-center gap-4 transition-all transform
                    ${stage.unlocked
                      ? `bg-gradient-to-r ${isOdd ? stage.color.replace('to-br', 'to-l') : stage.color} shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border-2 border-white/30`
                      : 'bg-gray-500/30 border-2 border-gray-500/20 cursor-not-allowed backdrop-blur-sm'
                    }
                    ${stage.completed ? 'ring-2 ring-yellow-300/60' : ''}
                  `}
                >
                  {/* Icon */}
                  <div className={`text-4xl w-14 h-14 rounded-xl flex items-center justify-center shadow-inner ${
                    stage.unlocked ? 'bg-white/20' : 'bg-gray-600/20'
                  }`}>
                    {stage.unlocked ? stage.emoji : '🔒'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-right">
                    <p className={`font-black text-sm ${stage.unlocked ? 'text-white' : 'text-gray-400'}`}>
                      مرحله {toPersianDigits(stage.id)}: {stage.name}
                    </p>
                    <p className={`text-xs mt-0.5 ${stage.unlocked ? 'text-white/80' : 'text-gray-500'}`}>
                      {stage.description}
                    </p>
                    {/* Stars */}
                    {stage.unlocked && (
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3].map(s => (
                          <span key={s} className={`text-xs ${s <= stage.stars ? 'text-yellow-300' : 'text-white/20'}`}>🌟</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Completed badge */}
                  {stage.completed && (
                    <div className="absolute -top-1.5 -left-1.5 bg-green-400 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md border-2 border-white">
                      ✓
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="text-center mt-4">
        <p className="text-white/70 text-xs">
          🐿️ عدد ۴۰۰ تا ۴۹۹ را یاد می‌گیریم!
        </p>
      </div>
    </div>
  );
};

export default StageSelectScreen;
