import React from 'react';
import { StudentReport } from '../types';
import Character from '../components/Character';
import { toPersianDigits } from '../utils/numberToWord';

interface ReportScreenProps {
  report: StudentReport;
  strongAreas: string[];
  weakAreas: string[];
  totalStars: number;
  maxCombo: number;
  completedStages: number;
  totalStages: number;
  onBack: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  report, strongAreas, weakAreas, totalStars, maxCombo,
  completedStages, totalStages, onBack,
}) => {
  const accuracy = report.totalQuestions > 0
    ? Math.round((report.correctAnswers / report.totalQuestions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 p-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack}
          className="bg-white/20 text-white font-bold px-4 py-2 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all active:scale-95 text-sm">
          ⬅️ برگشت
        </button>
        <h1 className="text-xl font-black text-white drop-shadow">📋 کارنامه مربی</h1>
        <div className="w-20" />
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Character */}
        <div className="flex justify-center">
          <Character mood="happy" message="این کارنامه دانش‌آموز است! 🐿️" size="sm" />
        </div>

        {/* Overview Stats */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            📊 خلاصه عملکرد
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-200">
              <p className="text-2xl font-black text-yellow-600">🌟 {toPersianDigits(totalStars)}</p>
              <p className="text-xs font-bold text-yellow-500">امتیاز کل</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
              <p className="text-2xl font-black text-green-600">✅ {toPersianDigits(accuracy)}٪</p>
              <p className="text-xs font-bold text-green-500">دقت پاسخ‌ها</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
              <p className="text-2xl font-black text-blue-600">📝 {toPersianDigits(report.totalQuestions)}</p>
              <p className="text-xs font-bold text-blue-500">سؤال پاسخ داده</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-200">
              <p className="text-2xl font-black text-purple-600">🏆 {toPersianDigits(completedStages)}/{toPersianDigits(totalStages)}</p>
              <p className="text-xs font-bold text-purple-500">مراحل تکمیل</p>
            </div>
          </div>
        </div>

        {/* Strong Areas */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
            💪 نقاط قوت
          </h2>
          {strongAreas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {strongAreas.map((area, i) => (
                <span key={i} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold border border-green-200">
                  ✅ {area}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">هنوز داده کافی برای تحلیل نقاط قوت نیست.</p>
          )}
        </div>

        {/* Weak Areas */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg font-bold text-rose-700 mb-3 flex items-center gap-2">
            📚 نیاز به تمرین بیشتر
          </h2>
          {weakAreas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {weakAreas.map((area, i) => (
                <span key={i} className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full text-sm font-bold border border-rose-200">
                  📖 {area}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              {report.totalQuestions < 5 
                ? 'هنوز سؤال کافی پاسخ داده نشده است.'
                : 'عالی! مشکل خاصی مشاهده نشد! 🌟'
              }
            </p>
          )}
        </div>

        {/* Detailed Stats */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            📈 آمار تفصیلی
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">تعداد کل سؤالات:</span>
              <span className="font-bold text-gray-800">{toPersianDigits(report.totalQuestions)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">پاسخ‌های درست:</span>
              <span className="font-bold text-green-600">{toPersianDigits(report.correctAnswers)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">کل تلاش‌ها:</span>
              <span className="font-bold text-gray-800">{toPersianDigits(report.totalAttempts)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">بهترین زنجیره:</span>
              <span className="font-bold text-indigo-600">🐿️ {toPersianDigits(maxCombo)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">آخرین بازی:</span>
              <span className="font-bold text-gray-800">
                {new Date(report.lastPlayDate).toLocaleDateString('fa-IR')}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg font-bold text-indigo-700 mb-3 flex items-center gap-2">
            💡 پیشنهادات
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {weakAreas.length > 0 && (
              <li className="flex items-start gap-2">
                <span>🎯</span>
                <span>روی مفاهیم <strong>{weakAreas[0]}</strong> بیشتر تمرین کنید.</span>
              </li>
            )}
            {accuracy < 70 && (
              <li className="flex items-start gap-2">
                <span>📖</span>
                <span>قبل از پاسخ دادن، سؤال را با دقت بخوانید.</span>
              </li>
            )}
            {completedStages < totalStages && (
              <li className="flex items-start gap-2">
                <span>🚀</span>
                <span>ادامه دهید تا تمام مراحل را کامل کنید!</span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span>🐿️</span>
              <span>هر روز کمی تمرین کنید تا یادگیری تثبیت شود.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportScreen;
