import { GameState, Stage, StudentReport } from '../types';

export const STAGES: Stage[] = [
  {
    id: 1, name: 'یکی‌ها', emoji: '🟡', description: 'شناخت یکی‌ها',
    unlocked: true, completed: false, stars: 0,
    questionTypes: ['count_ones', 'identify_one'],
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 2, name: 'ده‌تایی‌ها', emoji: '🔵', description: 'شناخت ده‌تایی‌ها',
    unlocked: false, completed: false, stars: 0,
    questionTypes: ['count_tens', 'identify_ten'],
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 3, name: 'صدتایی‌ها', emoji: '🟣', description: 'شناخت صدتایی‌ها',
    unlocked: false, completed: false, stars: 0,
    questionTypes: ['count_hundreds', 'identify_hundred'],
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 4, name: 'ساخت عدد', emoji: '🧩', description: 'ساخت عدد سه‌رقمی',
    unlocked: false, completed: false, stars: 0,
    questionTypes: ['build_number', 'image_to_number', 'number_to_image'],
    color: 'from-green-400 to-emerald-600',
  },
  {
    id: 5, name: 'جایگاه عددها', emoji: '🎯', description: 'صدگان، دهگان و یکان',
    unlocked: false, completed: false, stars: 0,
    questionTypes: ['identify_sadgan', 'identify_dahgan', 'identify_yekan', 'place_digit', 'missing_digit'],
    color: 'from-rose-400 to-pink-500',
  },
  {
    id: 6, name: 'بسط عدد', emoji: '🔢', description: 'باز کردن عدد',
    unlocked: false, completed: false, stars: 0,
    questionTypes: ['expand_number', 'expand_to_number'],
    color: 'from-teal-400 to-cyan-600',
  },
  {
    id: 7, name: 'عدد و حروف', emoji: '📝', description: 'عدد به حروف و برعکس',
    unlocked: false, completed: false, stars: 0,
    questionTypes: ['number_to_word', 'word_to_number', 'sequence', 'number_train'],
    color: 'from-pink-400 to-rose-600',
  },
];

function createEmptyReport(): StudentReport {
  return {
    totalQuestions: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    strongAreas: [],
    weakAreas: [],
    questionResults: [],
    lastPlayDate: new Date().toISOString(),
    totalPlayTime: 0,
  };
}

export function createInitialState(): GameState {
  return {
    currentStage: 1,
    currentQuestion: 0,
    totalStars: 0,
    combo: 0,
    maxCombo: 0,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    difficultyLevel: 1,
    questionsAnswered: 0,
    correctAnswers: 0,
    stages: STAGES.map(s => ({ ...s })),
    soundEnabled: true,
    musicEnabled: true,
    currentScreen: 'start',
    showHint: false,
    storyMessage: '',
    characterMood: 'happy',
    lastAnswerCorrect: null,
    showFeedback: false,
    assessmentStep: 0,
    startingStage: 1,
    canRetry: true,
    currentAttempts: 0,
    studentReport: createEmptyReport(),
  };
}

export function saveProgress(state: GameState) {
  try {
    const toSave = {
      totalStars: state.totalStars,
      maxCombo: state.maxCombo,
      stages: state.stages.map(s => ({
        id: s.id,
        unlocked: s.unlocked,
        completed: s.completed,
        stars: s.stars,
      })),
      difficultyLevel: state.difficultyLevel,
      questionsAnswered: state.questionsAnswered,
      correctAnswers: state.correctAnswers,
      studentReport: state.studentReport,
    };
    localStorage.setItem('sanjabak_progress', JSON.stringify(toSave));
  } catch {
    // silently fail
  }
}

export function loadProgress(): Partial<GameState> | null {
  try {
    const data = localStorage.getItem('sanjabak_progress');
    if (!data) return null;
    const parsed = JSON.parse(data);
    const stages = STAGES.map(s => {
      const saved = parsed.stages?.find((ss: { id: number }) => ss.id === s.id);
      return saved ? { ...s, ...saved } : { ...s };
    });
    return {
      totalStars: parsed.totalStars || 0,
      maxCombo: parsed.maxCombo || 0,
      stages,
      difficultyLevel: parsed.difficultyLevel || 1,
      questionsAnswered: parsed.questionsAnswered || 0,
      correctAnswers: parsed.correctAnswers || 0,
      studentReport: parsed.studentReport || createEmptyReport(),
    };
  } catch {
    return null;
  }
}

export function analyzeStudentProgress(report: StudentReport): { strong: string[]; weak: string[] } {
  const typeStats: Record<string, { correct: number; total: number }> = {};

  for (const result of report.questionResults) {
    if (!typeStats[result.questionType]) {
      typeStats[result.questionType] = { correct: 0, total: 0 };
    }
    typeStats[result.questionType].total++;
    if (result.correct) {
      typeStats[result.questionType].correct++;
    }
  }

  const strong: string[] = [];
  const weak: string[] = [];

  const typeNames: Record<string, string> = {
    'count_ones': 'شمارش یکی‌ها',
    'count_tens': 'شمارش ده‌تایی‌ها',
    'count_hundreds': 'شمارش صدتایی‌ها',
    'identify_one': 'شناخت یکی',
    'identify_ten': 'شناخت ده‌تایی',
    'identify_hundred': 'شناخت صدتایی',
    'build_number': 'ساخت عدد',
    'image_to_number': 'تصویر به عدد',
    'number_to_image': 'عدد به تصویر',
    'identify_sadgan': 'تشخیص صدگان',
    'identify_dahgan': 'تشخیص دهگان',
    'identify_yekan': 'تشخیص یکان',
    'place_digit': 'قرار دادن رقم',
    'missing_digit': 'رقم گمشده',
    'expand_number': 'بسط عدد',
    'expand_to_number': 'بسط به عدد',
    'number_to_word': 'عدد به حروف',
    'word_to_number': 'حروف به عدد',
    'sequence': 'دنباله عددی',
    'number_train': 'قطار عددها',
    'next_number': 'عدد بعدی',
    'prev_number': 'عدد قبلی',
  };

  for (const [type, stats] of Object.entries(typeStats)) {
    if (stats.total >= 2) {
      const rate = stats.correct / stats.total;
      const name = typeNames[type] || type;
      if (rate >= 0.8) {
        strong.push(name);
      } else if (rate < 0.5) {
        weak.push(name);
      }
    }
  }

  return { strong, weak };
}
