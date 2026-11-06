import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateDailyChallengeSet } from '../games/generator';
import { ChallengeEngine } from '../games/engine/ChallengeEngine';
import { TimerRing } from '../components/game/TimerRing';
import { ProgressStrip } from '../components/game/ProgressStrip';
import { firePomegranateBurst, fireVictoryCelebration } from '../components/game/PomegranateConfetti';
import { calculateAttemptScore } from '../lib/scoring';
import { sounds } from '../lib/audio';
import { TODAY_DATE_STR } from '../data/seed';
import { toPersianDigits, formatNumberByLang } from '../i18n';
import { AnswerLog, Challenge, AttemptResult } from '../types';
import { X, Play, RotateCcw, AlertTriangle, WifiOff } from 'lucide-react';

export const PlayScreen: React.FC = () => {
  const {
    user,
    todayAttempt,
    setActiveTab,
    settings,
    recordAttempt,
    isOffline
  } = useAppStore();

  const isPracticeMode = Boolean(todayAttempt);

  // Challenges loaded all at once upfront (for offline safety)
  const [challenges, setChallenges] = useState<Challenge[]>(() =>
    generateDailyChallengeSet(TODAY_DATE_STR, isPracticeMode)
  );

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerLog[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'between_challenges' | 'finished'>('ready');
  const [showExitModal, setShowExitModal] = useState(false);
  const [score, setScore] = useState<number>(0);

  const timerRef = useRef<any>(null);
  const activeTimeSpentRef = useRef<number>(0);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Main 90-second game clock: runs ONLY while gameState === 'playing'
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeExpired();
            return 0;
          }
          if (prev <= 10 && settings.soundEnabled) {
            sounds.playTick();
          }
          activeTimeSpentRef.current += 1;
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, settings.soundEnabled]);

  const handleStartGame = () => {
    sounds.playTap();
    setGameState('playing');
  };

  const handleTimeExpired = async () => {
    setGameState('finished');
    sounds.playWrong();

    const finalCalc = calculateAttemptScore(answers, 90, true);
    setScore(finalCalc.finalScore);

    const attemptResult: AttemptResult = {
      id: `att_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatarId: user.avatarId,
      date: TODAY_DATE_STR,
      isPractice: isPracticeMode,
      score: finalCalc.finalScore,
      correctCount: finalCalc.correctCount,
      totalChallenges: 15,
      totalTimeSpentSeconds: 90,
      speedBonus: 0,
      answers,
      completedAt: new Date().toISOString(),
      deviceId: 'dev_iphone_15_fa',
      validationStatus: 'valid'
    };

    await recordAttempt(attemptResult);
    setActiveTab('result');
  };

  const handleAnswerLogged = (userAnswer: any, isCorrect: boolean, msTaken: number) => {
    // Clock pauses during feedback animation!
    setGameState('between_challenges');

    const log: AnswerLog = {
      challengeId: challenges[currentIdx].id,
      challengeIndex: currentIdx + 1,
      gameType: challenges[currentIdx].type,
      userAnswer,
      correctAnswer: challenges[currentIdx].correctAnswer,
      isCorrect,
      timeSpentMs: msTaken
    };

    const nextAnswers = [...answers, log];
    setAnswers(nextAnswers);

    if (isCorrect) {
      if (settings.soundEnabled) sounds.playCorrect();
      if (settings.hapticsEnabled) sounds.vibrate([15, 40, 20]);
      firePomegranateBurst(settings.reduceMotion);
      setScore((s) => s + 100);
    } else {
      if (settings.soundEnabled) sounds.playWrong();
      if (settings.hapticsEnabled) sounds.vibrate(40);
    }

    // Delay slightly to show visual feedback (600ms)
    setTimeout(async () => {
      if (currentIdx + 1 < challenges.length) {
        setCurrentIdx(currentIdx + 1);
        setGameState('playing');
      } else {
        // All 15 challenges finished!
        setGameState('finished');
        if (settings.soundEnabled) sounds.playVictory();
        fireVictoryCelebration(settings.reduceMotion);

        const activeTimeUsed = Math.min(90, Math.max(1, 90 - timeLeft));
        const finalCalc = calculateAttemptScore(nextAnswers, activeTimeUsed, false);
        setScore(finalCalc.finalScore);

        const attemptResult: AttemptResult = {
          id: `att_${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userAvatarId: user.avatarId,
          date: TODAY_DATE_STR,
          isPractice: isPracticeMode,
          score: finalCalc.finalScore,
          correctCount: finalCalc.correctCount,
          totalChallenges: 15,
          totalTimeSpentSeconds: activeTimeUsed,
          speedBonus: finalCalc.speedBonus,
          answers: nextAnswers,
          completedAt: new Date().toISOString(),
          deviceId: 'dev_iphone_15_fa',
          validationStatus: 'valid'
        };

        await recordAttempt(attemptResult);
        setActiveTab('result');
      }
    }, 650);
  };

  const handleExitConfirm = () => {
    setShowExitModal(false);
    setActiveTab('home');
  };

  const currentChallenge = challenges[currentIdx];

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 select-none relative overflow-hidden">
      {/* Offline Status Alert if offline */}
      {isOffline && (
        <div className="w-full bg-stone-800 text-stone-200 px-3 py-1.5 text-[11px] flex items-center justify-center gap-1.5">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>حالت آفلاین: چالش‌ها قبلاً دانلود شده و امتیاز در دستگاه ذخیره خواهد شد.</span>
        </div>
      )}

      {/* READY SCREEN (Pre-game briefing) */}
      {gameState === 'ready' && (
        <div className="flex-1 flex flex-col items-center justify-between p-6 max-w-[412px] mx-auto w-full">
          {/* Header */}
          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => setActiveTab('home')}
              type="button"
              className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {isPracticeMode ? 'حالت تمرین نامحدود' : 'مسابقه رسمی روزانه'}
            </span>
            <div className="w-10" />
          </div>

          {/* Central Briefing Card */}
          <div className="flex flex-col items-center text-center my-auto gap-4 max-w-xs">
            <div className="relative">
              <TimerRing timeLeft={90} size={110} strokeWidth={8} />
            </div>

            <div>
              <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">
                {isPracticeMode ? 'تمرین تیزبینی' : 'مسابقه روزانه ۹۰ ثانیه‌ای'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                ۱۵ چالش تصویری سریع. هر پاسخ درست ۱۰۰ امتیاز دارد + هر ثانیه‌ای که ذخیره کنید ۱ امتیاز
                پاداش سرعت دریافت می‌کنید!
              </p>
            </div>

            <div className="w-full p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex items-center justify-around text-xs text-stone-600 dark:text-stone-300">
              <div className="flex flex-col items-center">
                <span className="font-display text-base text-turquoise-deep dark:text-turquoise-tile">
                  ۱۵
                </span>
                <span className="text-[10px] text-stone-400">چالش</span>
              </div>
              <div className="w-px h-6 bg-stone-200 dark:bg-stone-700" />
              <div className="flex flex-col items-center">
                <span className="font-display text-base text-saffron">۹۰</span>
                <span className="text-[10px] text-stone-400">ثانیه کل</span>
              </div>
              <div className="w-px h-6 bg-stone-200 dark:bg-stone-700" />
              <div className="flex flex-col items-center">
                <span className="font-display text-base text-pomegranate">۱٬۵۹۰</span>
                <span className="text-[10px] text-stone-400">حداکثر امتیاز</span>
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <div className="w-full pb-4">
            <button
              onClick={handleStartGame}
              type="button"
              className="w-full py-4 rounded-2xl bg-saffron text-stone-950 font-display text-xl flex items-center justify-center gap-2 shadow-xl shadow-saffron/30 hover:bg-amber-400 active:scale-98 transition-all cursor-pointer"
            >
              <Play className="w-6 h-6 fill-stone-950 ps-0.5" />
              <span>شروع بازی!</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE PLAY SCREEN */}
      {(gameState === 'playing' || gameState === 'between_challenges' || gameState === 'paused') && (
        <div className="flex-1 flex flex-col justify-between p-4 max-w-[412px] mx-auto w-full">
          {/* Game Top HUD: Exit button, Timer Ring, Score Display */}
          <div className="w-full flex items-center justify-between pt-1">
            {/* Exit/Pause button */}
            <button
              onClick={() => {
                setGameState('paused');
                setShowExitModal(true);
              }}
              type="button"
              className="w-10 h-10 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-500 hover:text-stone-900 cursor-pointer shadow-xs"
              aria-label="خروج یا مکث"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Saffron Circular 90s Timer Ring */}
            <TimerRing timeLeft={timeLeft} size={64} strokeWidth={5} />

            {/* Live Score Counter */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-stone-500 font-medium">امتیاز</span>
              <span className="font-display text-xl text-saffron leading-none font-bold">
                {formatNumberByLang(score, settings.language)}
              </span>
            </div>
          </div>

          {/* 15-Dot Garden Path Progress Strip */}
          <div className="my-2">
            <ProgressStrip total={15} currentIndex={currentIdx} answers={answers} />
          </div>

          {/* The Active Challenge Engine */}
          <div className="my-auto w-full">
            {currentChallenge && (
              <ChallengeEngine
                challenge={currentChallenge}
                onAnswerLogged={handleAnswerLogged}
                disabled={gameState !== 'playing'}
                reduceMotion={settings.reduceMotion}
              />
            )}
          </div>

          {/* Bottom Challenge Step Label */}
          <div className="pb-3 text-center">
            <span className="text-xs font-semibold text-stone-400">
              چالش {toPersianDigits(currentIdx + 1)} از ۱۵
            </span>
          </div>
        </div>
      )}

      {/* EXIT / PAUSE CONFIRMATION MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-[320px] bg-white dark:bg-stone-900 rounded-3xl p-5 shadow-2xl border border-stone-200 dark:border-stone-800 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">
              خروج از مسابقه؟
            </h3>

            <p className="text-xs text-stone-500 leading-relaxed">
              {!isPracticeMode
                ? 'در صورت خروج، فرصت مسابقه رسمی امروز شما محاسبه نخواهد شد.'
                : 'آیا می‌خواهید از حالت تمرین خارج شوید؟'}
            </p>

            <div className="flex flex-col gap-2 w-full pt-2">
              <button
                onClick={() => {
                  setShowExitModal(false);
                  setGameState('playing');
                }}
                type="button"
                className="w-full py-3 rounded-xl bg-turquoise-deep text-white font-medium text-sm hover:bg-teal-800 transition-colors"
              >
                ادامه مسابقه
              </button>
              <button
                onClick={handleExitConfirm}
                type="button"
                className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium text-xs hover:bg-stone-200 transition-colors"
              >
                خروج به صفحه اصلی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
