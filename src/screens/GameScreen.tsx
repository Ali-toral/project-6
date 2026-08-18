import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../types';
import Character from '../components/Character';
import PlaceValueBlocks, { HundredBlockDemo, TenBlockDemo, OneBlockDemo } from '../components/PlaceValueBlocks';
import { toPersianDigits } from '../utils/numberToWord';

interface GameScreenProps {
  question: Question;
  stageId: number;
  stageName: string;
  questionIndex: number;
  totalQuestions: number;
  stars: number;
  combo: number;
  storyMessage: string;
  onAnswer: (answer: string) => void;
  onRetry: () => void;
  onHint: () => void;
  onSkip: () => void;
  onBack: () => void;
  showHint: boolean;
  hintText: string;
  lastAnswerCorrect: boolean | null;
  showFeedback: boolean;
  feedbackMessage: string;
  characterMood: 'happy' | 'excited' | 'thinking' | 'encouraging';
  canRetry: boolean;
}

function parseImageOption(opt: string): { h: number; t: number; o: number } | null {
  const parts = opt.split('|');
  if (parts.length === 3) {
    return { h: parseInt(parts[0]), t: parseInt(parts[1]), o: parseInt(parts[2]) };
  }
  return null;
}

/* ───── Drag Build ───── */
const DragBuildQuestion: React.FC<{
  question: Question;
  onAnswer: (answer: string) => void;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
}> = ({ question, onAnswer, showFeedback, lastAnswerCorrect }) => {
  const [hundreds, setHundreds] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);

  const correct = question.correctAnswer.split('|').map(Number);

  const handleSubmit = () => {
    onAnswer(`${hundreds}|${tens}|${ones}`);
  };

  const isCorrect = lastAnswerCorrect === true;

  return (
    <div className="space-y-4 w-full">
      <PlaceValueBlocks hundreds={hundreds} tens={tens} ones={ones} size="sm" />

      <div className="grid grid-cols-3 gap-2">
        {/* Hundreds */}
        <div className={`rounded-2xl p-3 flex flex-col items-center gap-2 border-2 transition-all ${showFeedback ? (isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-200') : 'bg-purple-50 border-purple-200'}`}>
          <span className="text-xs font-bold text-purple-700">🟣 صدتایی</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setHundreds(Math.max(0, hundreds - 1))} disabled={showFeedback}
              className="w-9 h-9 rounded-full bg-purple-200 text-purple-800 font-bold text-xl flex items-center justify-center hover:bg-purple-300 transition active:scale-90 disabled:opacity-40">−</button>
            <span className="text-2xl font-black text-purple-700 w-8 text-center">{toPersianDigits(hundreds)}</span>
            <button onClick={() => setHundreds(Math.min(9, hundreds + 1))} disabled={showFeedback}
              className="w-9 h-9 rounded-full bg-purple-500 text-white font-bold text-xl flex items-center justify-center hover:bg-purple-600 transition active:scale-90 disabled:opacity-40">+</button>
          </div>
        </div>

        {/* Tens */}
        <div className={`rounded-2xl p-3 flex flex-col items-center gap-2 border-2 transition-all ${showFeedback ? (isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-200') : 'bg-blue-50 border-blue-200'}`}>
          <span className="text-xs font-bold text-blue-700">🔵 ده‌تایی</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setTens(Math.max(0, tens - 1))} disabled={showFeedback}
              className="w-9 h-9 rounded-full bg-blue-200 text-blue-800 font-bold text-xl flex items-center justify-center hover:bg-blue-300 transition active:scale-90 disabled:opacity-40">−</button>
            <span className="text-2xl font-black text-blue-700 w-8 text-center">{toPersianDigits(tens)}</span>
            <button onClick={() => setTens(Math.min(9, tens + 1))} disabled={showFeedback}
              className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold text-xl flex items-center justify-center hover:bg-blue-600 transition active:scale-90 disabled:opacity-40">+</button>
          </div>
        </div>

        {/* Ones */}
        <div className={`rounded-2xl p-3 flex flex-col items-center gap-2 border-2 transition-all ${showFeedback ? (isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-200') : 'bg-amber-50 border-amber-200'}`}>
          <span className="text-xs font-bold text-amber-700">🟡 یکی</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setOnes(Math.max(0, ones - 1))} disabled={showFeedback}
              className="w-9 h-9 rounded-full bg-amber-200 text-amber-800 font-bold text-xl flex items-center justify-center hover:bg-amber-300 transition active:scale-90 disabled:opacity-40">−</button>
            <span className="text-2xl font-black text-amber-700 w-8 text-center">{toPersianDigits(ones)}</span>
            <button onClick={() => setOnes(Math.min(9, ones + 1))} disabled={showFeedback}
              className="w-9 h-9 rounded-full bg-amber-500 text-white font-bold text-xl flex items-center justify-center hover:bg-amber-600 transition active:scale-90 disabled:opacity-40">+</button>
          </div>
        </div>
      </div>

      {showFeedback && !isCorrect && (
        <div className="text-center text-sm text-gray-500 bg-gray-50 p-2 rounded-xl">
          پاسخ درست: {toPersianDigits(correct[0])} صدتایی، {toPersianDigits(correct[1])} ده‌تایی، {toPersianDigits(correct[2])} یکی
        </div>
      )}

      {!showFeedback && (
        <button onClick={handleSubmit}
          className="w-full py-3.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all active:scale-95 border-2 border-white/30">
          🏗️ بساز!
        </button>
      )}
    </div>
  );
};

/* ───── Place Digit ───── */
const PlaceDigitQuestion: React.FC<{
  question: Question;
  onAnswer: (answer: string) => void;
  showFeedback: boolean;
}> = ({ question, onAnswer, showFeedback }) => {
  const correct = question.correctAnswer.split('|').map(Number);
  const [placed, setPlaced] = useState<(number | null)[]>([null, null, null]);
  const digits = question.options.map(o => parseInt(o.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))));
  const [available, setAvailable] = useState<number[]>([...digits]);

  const placeNames = ['صدگان 🟣', 'دهگان 🔵', 'یکان 🟡'];
  const colors = [
    { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700', active: 'hover:border-purple-500 hover:bg-purple-100' },
    { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', active: 'hover:border-blue-500 hover:bg-blue-100' },
    { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', active: 'hover:border-amber-500 hover:bg-amber-100' },
  ];

  const handlePlace = (slotIdx: number) => {
    if (showFeedback || available.length === 0 || placed[slotIdx] !== null) return;
    const digit = available[0];
    const newPlaced = [...placed];
    newPlaced[slotIdx] = digit;
    setPlaced(newPlaced);
    const newAvailable = available.slice(1);
    setAvailable(newAvailable);

    if (newAvailable.length === 0) {
      onAnswer(newPlaced.join('|'));
    }
  };

  const handleReset = () => {
    setPlaced([null, null, null]);
    setAvailable([...digits]);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Available digits */}
      <div className="flex justify-center gap-3">
        {available.map((d, i) => (
          <div key={`${d}-${i}`} className="w-14 h-14 bg-indigo-100 border-2 border-indigo-300 rounded-2xl flex items-center justify-center text-2xl font-black text-indigo-700 shadow-sm">
            {toPersianDigits(d)}
          </div>
        ))}
        {available.length === 0 && !showFeedback && (
          <p className="text-sm text-gray-400">همه رو جا دادی! 👁️</p>
        )}
      </div>

      {/* Arrow */}
      {available.length > 0 && <div className="text-center text-gray-400 text-xl">⬇️ کجا بگذارم؟</div>}

      {/* Slots */}
      <div className="grid grid-cols-3 gap-3">
        {placeNames.map((name, idx) => (
          <button
            key={idx}
            onClick={() => handlePlace(idx)}
            disabled={showFeedback || placed[idx] !== null}
            className={`py-4 rounded-2xl border-2 text-center transition-all transform ${
              placed[idx] !== null
                ? showFeedback && placed[idx] === correct[idx]
                  ? 'bg-green-100 border-green-400 scale-105'
                  : showFeedback && placed[idx] !== correct[idx]
                  ? 'bg-red-100 border-red-400'
                  : `${colors[idx].bg} ${colors[idx].border}`
                : `bg-white border-dashed border-gray-300 ${colors[idx].active} active:scale-95`
            }`}
          >
            <p className="text-xs font-bold text-gray-500">{name}</p>
            <p className={`text-2xl font-black mt-1 ${colors[idx].text}`}>
              {placed[idx] !== null ? toPersianDigits(placed[idx]!) : '؟'}
            </p>
          </button>
        ))}
      </div>

      {!showFeedback && placed.some(p => p !== null) && (
        <button onClick={handleReset} className="w-full py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm">
          🔄 دوباره چیدن
        </button>
      )}
    </div>
  );
};

/* ───── Memory Game ───── */
const MemoryQuestion: React.FC<{
  question: Question;
  onAnswer: (answer: string) => void;
  showFeedback: boolean;
}> = ({ question, onAnswer, showFeedback }) => {
  const [phase, setPhase] = useState<'show' | 'hide'>('show');

  useEffect(() => {
    setPhase('show');
    const timer = setTimeout(() => setPhase('hide'), 3500);
    return () => clearTimeout(timer);
  }, [question.id]);

  return (
    <div className="space-y-4 w-full">
      {phase === 'show' ? (
        <div className="text-center space-y-4">
          <p className="text-sm font-bold text-indigo-600">🧠 این عدد را به خاطر بسپار!</p>
          <div className="text-6xl font-black text-indigo-700 py-4">
            {toPersianDigits(question.number)}
          </div>
          <PlaceValueBlocks hundreds={question.hundreds} tens={question.tens} ones={question.ones} size="sm" showLabels />
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2.5 rounded-full" style={{animation: 'shrink 3.5s linear forwards'}} />
          </div>
          <p className="text-xs text-gray-400">در حال مخفی شدن...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-2">🤔</div>
            <p className="text-lg font-bold text-gray-800">عدد چه بود؟</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {question.options.map((opt) => (
              <button
                key={opt}
                onClick={() => !showFeedback && onAnswer(opt)}
                disabled={showFeedback}
                className={`py-5 rounded-2xl font-bold text-xl transition-all border-2 transform ${
                  showFeedback && opt === question.correctAnswer
                    ? 'bg-green-100 border-green-500 ring-2 ring-green-300 scale-105'
                    : showFeedback
                    ? 'bg-gray-50 border-gray-200 opacity-50'
                    : 'bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 active:scale-95 shadow-sm hover:shadow'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ───── Main GameScreen ───── */
export const GameScreen: React.FC<GameScreenProps> = ({
  question, stageId, stageName, questionIndex, totalQuestions,
  stars, combo, storyMessage, onAnswer, onRetry, onHint, onSkip, onBack,
  showHint, hintText, lastAnswerCorrect, showFeedback, feedbackMessage,
  characterMood, canRetry,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setConfetti(false);
  }, [question.id]);

  useEffect(() => {
    if (lastAnswerCorrect === true) {
      setConfetti(true);
      const t = setTimeout(() => setConfetti(false), 1500);
      return () => clearTimeout(t);
    }
  }, [lastAnswerCorrect, question.id]);

  const handleOptionClick = useCallback((option: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    onAnswer(option);
  }, [showFeedback, onAnswer]);

  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  const showVisualBlocks = [
    'count_ones', 'count_tens', 'count_hundreds',
    'image_to_number', 'match_image_number', 'warehouse',
    'build_number', 'missing_place_value', 'missing_digit',
  ].includes(question.type);

  // Show block demos for identification questions
  const showBlockDemos = [
    'identify_one', 'identify_ten', 'identify_hundred',
  ].includes(question.type);

  const showBigNumber = [
    'identify_sadgan', 'identify_dahgan', 'identify_yekan',
    'expand_number', 'number_to_word', 'match_number_word',
    'next_number', 'prev_number', 'number_shop',
  ].includes(question.type);

  const showExpandBlocks = [
    'expand_number', 'expand_to_number', 'final_challenge',
  ].includes(question.type);

  const isImageChoice = question.type === 'number_to_image';
  const isDragBuild = question.type === 'drag_build';
  const isPlaceDigit = question.type === 'place_digit';
  const isMemory = question.type === 'memory_game';

  // Combo indicator text
  const comboText = combo >= 10 ? '🏆 قهرمان!' : combo >= 5 ? '👁️✨ فوق‌العاده!' : combo >= 3 ? '👁️ عالی!' : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col" dir="rtl">
      {/* Confetti - static stars, no animation */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl">👁️✨🐿️✨👁️</div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm px-3 py-2 flex items-center justify-between gap-2 sticky top-0 z-40 border-b border-gray-100">
        <button onClick={onBack} className="bg-gray-100 text-gray-600 font-bold px-3 py-1.5 rounded-xl hover:bg-gray-200 transition-all text-sm flex items-center gap-1">
          <span>⬅️</span>
        </button>
        <div className="text-center flex-1">
          <span className="text-xs font-bold text-gray-500">
            مرحله {toPersianDigits(stageId)}: {stageName}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold border border-yellow-200">
            🌟 {toPersianDigits(stars)}
          </span>
          {combo >= 3 && (
            <span className="bg-green-50 text-green-600 px-2 py-1 rounded-lg text-xs font-bold border border-green-200">
              🐿️{toPersianDigits(combo)}
            </span>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 pt-1.5 pb-0.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-teal-400 to-sky-500 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">
            {toPersianDigits(questionIndex + 1)} از {toPersianDigits(totalQuestions)}
          </span>
        </div>
      </div>

      {/* Combo Banner */}
      {comboText && (
        <div className="mx-4 mt-1">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-3 py-1 text-center">
            <span className="text-sm font-bold text-emerald-700">{comboText}</span>
          </div>
        </div>
      )}

      {/* Story Message */}
      {storyMessage && !showFeedback && (
        <div className="mx-4 mt-1">
          <div className="bg-teal-50 border border-teal-200 rounded-xl px-3 py-1.5 text-center">
            <p className="text-sm font-bold text-teal-700">{storyMessage}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4 py-2 max-w-lg mx-auto w-full overflow-y-auto">
        {/* Character + Feedback */}
        <div className="mb-2 w-full flex justify-center">
          <Character
            mood={characterMood}
            message={showFeedback ? feedbackMessage : undefined}
            size="sm"
          />
        </div>

        {/* Block Demos for identification */}
        {showBlockDemos && (
          <div className="mb-3 flex justify-center gap-3 w-full">
            <HundredBlockDemo />
            <TenBlockDemo />
            <OneBlockDemo />
          </div>
        )}

        {/* Visual Blocks */}
        {showVisualBlocks && (
          <div className="mb-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 w-full">
            <PlaceValueBlocks
              hundreds={question.hundreds}
              tens={question.tens}
              ones={question.ones}
              showLabels={question.stageId >= 3}
              size={question.hundreds > 3 ? 'sm' : 'md'}
            />
          </div>
        )}

        {/* Big Number Display */}
        {showBigNumber && (
          <div className="mb-3 text-center">
            <div className="inline-block bg-white rounded-2xl shadow-sm border border-indigo-100 px-8 py-3">
              <span className="text-5xl font-black text-indigo-700 tracking-wider">
                {toPersianDigits(question.number)}
              </span>
            </div>
          </div>
        )}

        {/* Expand visualization */}
        {showExpandBlocks && (
          <div className="mb-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 w-full">
            <PlaceValueBlocks
              hundreds={question.hundreds}
              tens={question.tens}
              ones={question.ones}
              showLabels
              size="sm"
            />
          </div>
        )}

        {/* Question Text */}
        <div className="mb-3 text-center w-full">
          <p className="text-base md:text-lg font-bold text-gray-800 leading-relaxed whitespace-pre-line">
            {question.text}
          </p>
        </div>

        {/* Question Type Specific Content */}
        {isDragBuild ? (
          <DragBuildQuestion question={question} onAnswer={onAnswer} showFeedback={showFeedback} lastAnswerCorrect={lastAnswerCorrect} />
        ) : isPlaceDigit ? (
          <PlaceDigitQuestion question={question} onAnswer={onAnswer} showFeedback={showFeedback} />
        ) : isMemory ? (
          <MemoryQuestion question={question} onAnswer={onAnswer} showFeedback={showFeedback} />
        ) : isImageChoice ? (
          <div className="grid grid-cols-1 gap-3 w-full">
            {question.options.map((opt) => {
              const parsed = parseImageOption(opt);
              if (!parsed) return null;
              let cls = 'bg-white border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 shadow-sm';
              if (showFeedback) {
                if (opt === question.correctAnswer) cls = 'bg-green-50 border-2 border-green-500 ring-2 ring-green-300 scale-[1.02] shadow-md';
                else if (opt === selectedAnswer) cls = 'bg-red-50 border-2 border-red-300';
                else cls = 'bg-gray-50 border-2 border-gray-200 opacity-40';
              }
              return (
                <button key={opt} onClick={() => handleOptionClick(opt)} disabled={showFeedback}
                  className={`p-3 rounded-2xl transition-all transform ${cls} ${!showFeedback ? 'active:scale-95' : ''}`}>
                  <PlaceValueBlocks hundreds={parsed.h} tens={parsed.t} ones={parsed.o} showLabels={false} size="sm" />
                </button>
              );
            })}
          </div>
        ) : (
          /* Standard Options */
          <div className={`grid gap-3 w-full ${question.options.length <= 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
            {question.options.map((opt) => {
              const isLong = opt.length > 15;
              let cls = 'bg-white border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 shadow-sm hover:shadow';
              if (showFeedback) {
                if (opt === question.correctAnswer) cls = 'bg-green-100 border-2 border-green-500 ring-2 ring-green-300 scale-[1.03] shadow-md';
                else if (opt === selectedAnswer) cls = 'bg-red-50 border-2 border-red-300';
                else cls = 'bg-gray-50 border-2 border-gray-200 opacity-40';
              }

              return (
                <button key={opt} onClick={() => handleOptionClick(opt)} disabled={showFeedback}
                  className={`py-4 px-4 rounded-2xl font-bold transition-all transform ${cls} ${!showFeedback ? 'active:scale-95' : ''}`}>
                  <span className={`block leading-relaxed ${isLong ? 'text-sm' : 'text-lg'}`}>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Hint */}
        {showHint && (
          <div className="mt-3 bg-sky-50 border border-sky-300 rounded-xl px-4 py-2.5 w-full">
            <p className="text-sm text-sky-800 font-bold text-center">
              💡 {hintText}
            </p>
          </div>
        )}

        {/* Spacer for bottom bar */}
        <div className="h-4" />
      </div>

      {/* Bottom Bar */}
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2.5 sticky bottom-0 z-40">
        <div className="flex items-center justify-center gap-2 max-w-lg mx-auto">
          <button onClick={onBack}
            className="bg-gray-100 text-gray-600 font-bold py-3 px-3 rounded-2xl hover:bg-gray-200 transition-all text-sm border border-gray-200 active:scale-95"
            title="برگشت به عقب">
            ⬅️
          </button>
          <button onClick={onHint}
            className="flex-1 bg-sky-50 text-sky-700 font-bold py-3 rounded-2xl hover:bg-sky-100 transition-all text-sm border border-sky-200 active:scale-95">
            💡 راهنمایی
          </button>
          {showFeedback && lastAnswerCorrect === false && canRetry ? (
            <button onClick={onRetry}
              className="flex-1 bg-indigo-50 text-indigo-700 font-bold py-3 rounded-2xl hover:bg-indigo-100 transition-all text-sm border border-indigo-200 active:scale-95">
              🔄 دوباره تلاش کن
            </button>
          ) : (
            <button onClick={onSkip}
              className="flex-1 bg-slate-50 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-100 transition-all text-sm border border-slate-200 active:scale-95">
              ⏭️ رد کن
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
