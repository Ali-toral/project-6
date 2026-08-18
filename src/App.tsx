import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Question, QuestionResult } from './types';
import { createInitialState, saveProgress, loadProgress, analyzeStudentProgress } from './engine/gameState';
import { generateQuestionsForStage } from './engine/questionGenerator';
import { getStoryIntro, getCorrectMessage, getWrongMessage, getComboMessage } from './engine/story';
import { playCorrectSound, playWrongSound, playComboSound } from './utils/sound';
import StartScreen from './screens/StartScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import StageSelectScreen from './screens/StageSelectScreen';
import GameScreen from './screens/GameScreen';
import StageCompleteScreen from './screens/StageCompleteScreen';
import GameCompleteScreen from './screens/GameCompleteScreen';
import ReportScreen from './screens/ReportScreen';

const QUESTIONS_PER_STAGE = 6;

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const state = createInitialState();
    const saved = loadProgress();
    if (saved) {
      return { ...state, ...saved, currentScreen: 'start' };
    }
    return state;
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [stageCorrectCount, setStageCorrectCount] = useState(0);
  const [stageTotalCount, setStageTotalCount] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [hintText, setHintText] = useState('');
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctCountRef = useRef(0);

  const hasSavedProgress = gameState.stages.some(s => s.completed || s.stars > 0);

  // Save progress whenever stages or stars change
  useEffect(() => {
    saveProgress(gameState);
  }, [gameState.totalStars, gameState.stages, gameState.maxCombo, gameState.studentReport]);

  const startNewGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'assessment',
    }));
  }, []);

  const continueGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'stage_select',
    }));
  }, []);

  const showReport = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'report',
    }));
  }, []);

  const handleAssessmentComplete = useCallback((startStage: number) => {
    setGameState(prev => {
      const newStages = prev.stages.map(s => ({
        ...s,
        unlocked: s.id <= startStage,
      }));
      return {
        ...prev,
        currentScreen: 'stage_select',
        stages: newStages,
        startingStage: startStage,
      };
    });
  }, []);

  const startStage = useCallback((stageId: number) => {
    const difficulty = gameState.difficultyLevel;
    const qs = generateQuestionsForStage(stageId, difficulty, QUESTIONS_PER_STAGE);
    setQuestions(qs);
    setStageCorrectCount(0);
    setStageTotalCount(0);
    correctCountRef.current = 0;
    setHintText('');
    setGameState(prev => ({
      ...prev,
      currentStage: stageId,
      currentQuestion: 0,
      combo: 0,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      showHint: false,
      showFeedback: false,
      lastAnswerCorrect: null,
      storyMessage: getStoryIntro(stageId),
      characterMood: 'happy',
      currentScreen: 'playing',
      canRetry: true,
      currentAttempts: 0,
    }));
  }, [gameState.difficultyLevel]);

  const advanceToNextQuestion = useCallback(() => {
    setGameState(prev => {
      const nextQ = prev.currentQuestion + 1;

      if (nextQ >= questions.length) {
        // Stage complete
        const cc = correctCountRef.current;
        const stars = cc >= questions.length - 1 ? 3 :
          cc >= Math.floor(questions.length * 0.6) ? 2 : 1;
        const newStages = prev.stages.map(s => {
          if (s.id === prev.currentStage) {
            return { ...s, completed: true, stars: Math.max(s.stars, stars) };
          }
          if (s.id === prev.currentStage + 1) {
            return { ...s, unlocked: true };
          }
          return s;
        });

        const allCompleted = newStages.every(s => s.completed);

        return {
          ...prev,
          showFeedback: false,
          stages: newStages,
          currentScreen: allCompleted ? 'game_complete' : 'stage_complete',
        };
      }

      return {
        ...prev,
        currentQuestion: nextQ,
        showFeedback: false,
        lastAnswerCorrect: null,
        characterMood: 'happy',
        storyMessage: '',
        canRetry: true,
        currentAttempts: 0,
      };
    });
  }, [questions.length]);

  const handleAnswer = useCallback((answer: string) => {
    if (gameState.showFeedback) return;

    const currentQ = questions[gameState.currentQuestion];
    if (!currentQ) return;

    const isCorrect = answer === currentQ.correctAnswer;

    // Clear any existing timer
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }

    if (isCorrect) {
      setFeedbackMessage(getCorrectMessage());
      setStageCorrectCount(prev => prev + 1);
      correctCountRef.current += 1;
      if (gameState.soundEnabled) playCorrectSound();
    } else {
      setFeedbackMessage(getWrongMessage());
      if (gameState.soundEnabled) playWrongSound();
    }
    setStageTotalCount(prev => prev + 1);

    // Record question result
    const questionResult: QuestionResult = {
      questionId: currentQ.id,
      questionType: currentQ.type,
      correct: isCorrect,
      attempts: gameState.currentAttempts + 1,
      timestamp: Date.now(),
    };

    setGameState(prev => {
      const newCombo = isCorrect ? prev.combo + 1 : 0;
      const newMaxCombo = Math.max(prev.maxCombo, newCombo);
      const newConsecutiveCorrect = isCorrect ? prev.consecutiveCorrect + 1 : 0;
      const newConsecutiveWrong = isCorrect ? 0 : prev.consecutiveWrong + 1;

      // Adaptive difficulty
      let newDifficulty = prev.difficultyLevel;
      if (newConsecutiveCorrect >= 3 && newDifficulty < 5) {
        newDifficulty = Math.min(5, newDifficulty + 1);
      } else if (newConsecutiveWrong >= 2 && newDifficulty > 1) {
        newDifficulty = Math.max(1, newDifficulty - 1);
      }

      // Combo message
      const comboMsg = getComboMessage(newCombo);
      if (comboMsg && gameState.soundEnabled) playComboSound();
      const storyMsg = comboMsg || prev.storyMessage;

      // Update student report
      const newReport = {
        ...prev.studentReport,
        totalQuestions: prev.studentReport.totalQuestions + (isCorrect || prev.currentAttempts === 0 ? 1 : 0),
        correctAnswers: prev.studentReport.correctAnswers + (isCorrect ? 1 : 0),
        totalAttempts: prev.studentReport.totalAttempts + 1,
        questionResults: [...prev.studentReport.questionResults.slice(-99), questionResult],
        lastPlayDate: new Date().toISOString(),
      };

      return {
        ...prev,
        showFeedback: true,
        lastAnswerCorrect: isCorrect,
        totalStars: isCorrect ? prev.totalStars + 1 : prev.totalStars,
        combo: newCombo,
        maxCombo: newMaxCombo,
        consecutiveCorrect: newConsecutiveCorrect,
        consecutiveWrong: newConsecutiveWrong,
        difficultyLevel: newDifficulty,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        characterMood: isCorrect ? 'excited' : 'encouraging',
        storyMessage: storyMsg,
        showHint: false,
        canRetry: !isCorrect && prev.currentAttempts < 2,
        currentAttempts: prev.currentAttempts + 1,
        studentReport: newReport,
      };
    });

    // Auto-advance: on correct (after short delay)
    // On wrong: allow retry; if retries exhausted, show answer then advance
    if (isCorrect) {
      feedbackTimerRef.current = setTimeout(() => {
        advanceToNextQuestion();
      }, 1500);
    } else {
      const attemptsUsed = gameState.currentAttempts + 1;
      if (attemptsUsed >= 3) {
        // No more retries - let the child see the correct answer, then move on
        feedbackTimerRef.current = setTimeout(() => {
          advanceToNextQuestion();
        }, 2500);
      }
    }
  }, [gameState.showFeedback, gameState.currentQuestion, questions, gameState.soundEnabled, gameState.currentAttempts, advanceToNextQuestion]);

  const handleRetry = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
    setGameState(prev => ({
      ...prev,
      showFeedback: false,
      lastAnswerCorrect: null,
      characterMood: 'thinking',
      canRetry: prev.currentAttempts < 2,
    }));
  }, []);

  const handleHint = useCallback(() => {
    const currentQ = questions[gameState.currentQuestion];
    if (currentQ) {
      setHintText(currentQ.hint);
      setGameState(prev => ({ ...prev, showHint: true }));
    }
  }, [gameState.currentQuestion, questions]);

  const handleSkip = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
    advanceToNextQuestion();
  }, [advanceToNextQuestion]);

  const handleBack = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
    setGameState(prev => ({
      ...prev,
      currentScreen: 'stage_select',
      showFeedback: false,
    }));
  }, []);

  const currentStageData = gameState.stages.find(s => s.id === gameState.currentStage);
  const currentQuestion = questions[gameState.currentQuestion];
  const analysis = analyzeStudentProgress(gameState.studentReport);

  // Render
  switch (gameState.currentScreen) {
    case 'start':
      return (
        <StartScreen
          onStart={startNewGame}
          onContinue={continueGame}
          onReport={showReport}
          hasSavedProgress={hasSavedProgress}
          totalStars={gameState.totalStars}
        />
      );

    case 'assessment':
      return (
        <AssessmentScreen onComplete={handleAssessmentComplete} />
      );

    case 'stage_select':
      return (
        <StageSelectScreen
          stages={gameState.stages}
          totalStars={gameState.totalStars}
          onSelectStage={startStage}
          onBack={() => setGameState(prev => ({ ...prev, currentScreen: 'start' }))}
        />
      );

    case 'playing':
      if (!currentQuestion) return null;
      return (
        <GameScreen
          question={currentQuestion}
          stageId={gameState.currentStage}
          stageName={currentStageData?.name || ''}
          questionIndex={gameState.currentQuestion}
          totalQuestions={questions.length}
          stars={gameState.totalStars}
          combo={gameState.combo}
          storyMessage={gameState.storyMessage}
          onAnswer={handleAnswer}
          onRetry={handleRetry}
          onHint={handleHint}
          onSkip={handleSkip}
          onBack={handleBack}
          showHint={gameState.showHint}
          hintText={hintText}
          lastAnswerCorrect={gameState.lastAnswerCorrect}
          showFeedback={gameState.showFeedback}
          feedbackMessage={feedbackMessage}
          characterMood={gameState.characterMood}
          canRetry={gameState.canRetry}
        />
      );

    case 'stage_complete':
      return (
        <StageCompleteScreen
          stageId={gameState.currentStage}
          stageName={currentStageData?.name || ''}
          starsEarned={currentStageData?.stars || 0}
          totalStars={gameState.totalStars}
          maxCombo={gameState.maxCombo}
          correctCount={stageCorrectCount}
          totalCount={stageTotalCount || QUESTIONS_PER_STAGE}
          onNext={() => startStage(gameState.currentStage + 1)}
          onReplay={() => startStage(gameState.currentStage)}
          onMenu={() => setGameState(prev => ({ ...prev, currentScreen: 'stage_select' }))}
          isLastStage={gameState.currentStage >= 7}
        />
      );

    case 'game_complete':
      return (
        <GameCompleteScreen
          totalStars={gameState.totalStars}
          maxCombo={gameState.maxCombo}
          completedStages={gameState.stages.filter(s => s.completed).length}
          totalStages={gameState.stages.length}
          onRestart={() => {
            const state = createInitialState();
            setGameState(state);
            localStorage.removeItem('sanjabak_progress');
          }}
          onMenu={() => setGameState(prev => ({ ...prev, currentScreen: 'stage_select' }))}
        />
      );

    case 'report':
      return (
        <ReportScreen
          report={gameState.studentReport}
          strongAreas={analysis.strong}
          weakAreas={analysis.weak}
          totalStars={gameState.totalStars}
          maxCombo={gameState.maxCombo}
          completedStages={gameState.stages.filter(s => s.completed).length}
          totalStages={gameState.stages.length}
          onBack={() => setGameState(prev => ({ ...prev, currentScreen: 'start' }))}
        />
      );

    default:
      return null;
  }
}
