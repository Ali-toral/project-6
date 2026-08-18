// Types for the educational game

export type QuestionType =
  | 'count_ones'
  | 'count_tens'
  | 'count_hundreds'
  | 'identify_one'
  | 'identify_ten'
  | 'identify_hundred'
  | 'build_number'
  | 'image_to_number'
  | 'number_to_image'
  | 'identify_sadgan'
  | 'identify_dahgan'
  | 'identify_yekan'
  | 'place_digit'
  | 'missing_digit'
  | 'drag_build'
  | 'expand_number'
  | 'expand_to_number'
  | 'number_to_word'
  | 'word_to_number'
  | 'match_image_number'
  | 'match_number_word'
  | 'sequence'
  | 'next_number'
  | 'prev_number'
  | 'missing_in_sequence'
  | 'number_train'
  | 'number_shop'
  | 'warehouse'
  | 'memory_game'
  | 'final_challenge'
  | 'missing_place_value';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: number;
  hint: string;
  score: number;
  hundreds: number;
  tens: number;
  ones: number;
  number: number;
  wordForm: string;
  stageId: number;
  visualOnly: boolean;
}

export interface QuestionResult {
  questionId: string;
  questionType: QuestionType;
  correct: boolean;
  attempts: number;
  timestamp: number;
}

export interface Stage {
  id: number;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  stars: number;
  questionTypes: QuestionType[];
  color: string;
}

export interface StudentReport {
  totalQuestions: number;
  correctAnswers: number;
  totalAttempts: number;
  strongAreas: QuestionType[];
  weakAreas: QuestionType[];
  questionResults: QuestionResult[];
  lastPlayDate: string;
  totalPlayTime: number;
}

export interface GameState {
  currentStage: number;
  currentQuestion: number;
  totalStars: number;
  combo: number;
  maxCombo: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  difficultyLevel: number;
  questionsAnswered: number;
  correctAnswers: number;
  stages: Stage[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  currentScreen: 'start' | 'assessment' | 'stage_select' | 'playing' | 'stage_complete' | 'game_complete' | 'report';
  showHint: boolean;
  storyMessage: string;
  characterMood: 'happy' | 'excited' | 'thinking' | 'encouraging';
  lastAnswerCorrect: boolean | null;
  showFeedback: boolean;
  assessmentStep: number;
  startingStage: number;
  canRetry: boolean;
  currentAttempts: number;
  studentReport: StudentReport;
}

export interface PlaceValueDisplay {
  hundreds: number;
  tens: number;
  ones: number;
}
