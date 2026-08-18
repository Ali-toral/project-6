import React, { useState } from 'react';
import Character from '../components/Character';
import PlaceValueBlocks from '../components/PlaceValueBlocks';

interface AssessmentScreenProps {
  onComplete: (startStage: number) => void;
}

const assessmentQuestions = [
  {
    visual: { hundreds: 0, tens: 0, ones: 5 },
    text: 'چند تا یکی می‌بینی؟ 👁️',
    options: ['۳', '۵', '۷'],
    correct: '۵',
  },
  {
    visual: { hundreds: 0, tens: 3, ones: 0 },
    text: 'چند تا ده‌تایی می‌بینی؟ 👁️',
    options: ['۲', '۳', '۴'],
    correct: '۳',
  },
  {
    visual: { hundreds: 4, tens: 2, ones: 5 },
    text: 'این چه عددی است؟',
    options: ['۴۲۵', '۳۲۵', '۵۲۵'],
    correct: '۴۲۵',
  },
];

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<boolean[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQ = assessmentQuestions[step];

  const handleAnswer = (option: string) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);

    const isCorrect = option === currentQ.correct;
    const newScores = [...scores, isCorrect];
    setScores(newScores);

    setTimeout(() => {
      if (step + 1 < assessmentQuestions.length) {
        setStep(step + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        // Determine starting stage
        const correctCount = newScores.filter(Boolean).length;
        let startStage = 1;
        if (correctCount >= 3) startStage = 4;
        else if (correctCount >= 2) startStage = 3;
        else if (correctCount >= 1) startStage = 2;
        onComplete(startStage);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="max-w-lg w-full bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-indigo-700">
            🚀 بیا ببینیم از کجا شروع کنیم!
          </h2>
          <div className="flex justify-center gap-2 mt-3">
            {assessmentQuestions.map((_, i) => (
              <div
                key={i}
                className={`w-8 h-2 rounded-full transition-all ${
                  i < step ? (scores[i] ? 'bg-green-400' : 'bg-red-300') :
                  i === step ? 'bg-indigo-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Character */}
        <Character
          mood={showResult && selected === currentQ.correct ? 'excited' : 'thinking'}
          size="sm"
        />

        {/* Visual */}
        <div className="flex justify-center py-3">
          <PlaceValueBlocks
            hundreds={currentQ.visual.hundreds}
            tens={currentQ.visual.tens}
            ones={currentQ.visual.ones}
            showLabels={false}
            size="md"
          />
        </div>

        {/* Question */}
        <p className="text-lg font-bold text-center text-gray-800">
          {currentQ.text}
        </p>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3">
          {currentQ.options.map((opt) => {
            let btnClass = 'bg-white border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50';
            if (showResult) {
              if (opt === currentQ.correct) btnClass = 'bg-green-100 border-2 border-green-500 ring-2 ring-green-300';
              else if (opt === selected) btnClass = 'bg-red-50 border-2 border-red-300';
              else btnClass = 'bg-gray-50 border-2 border-gray-200 opacity-50';
            }

            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={showResult}
                className={`py-4 px-4 rounded-2xl font-bold text-xl transition-all ${btnClass} ${!showResult ? 'active:scale-95 transform hover:scale-105' : ''}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssessmentScreen;
