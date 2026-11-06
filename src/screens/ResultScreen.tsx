import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { toPersianDigits, formatNumberByLang } from '../i18n';
import { Trophy, Share2, ArrowLeft, RotateCcw, Clock, Target, Zap, WifiOff } from 'lucide-react';
import { MedalBadge } from '../components/common/MedalBadge';

export const ResultScreen: React.FC = () => {
  const {
    lastCompletedResult,
    setActiveTab,
    setShareModalAttempt,
    settings,
    isOffline
  } = useAppStore();

  const [displayedScore, setDisplayedScore] = useState(0);

  const result = lastCompletedResult || {
    score: 1380,
    correctCount: 14,
    totalChallenges: 15,
    totalTimeSpentSeconds: 42,
    speedBonus: 48,
    dailyRank: 7,
    isPractice: false
  };

  // Animated count-up of score
  useEffect(() => {
    let start = 0;
    const end = result.score;
    const duration = 1200;
    const startTime = performance.now();

    const step = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const current = Math.floor(progress * end);
      setDisplayedScore(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayedScore(end);
      }
    };

    requestAnimationFrame(step);
  }, [result.score]);

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 p-4 max-w-[412px] mx-auto overflow-y-auto no-scrollbar pb-8 select-none">
      {/* Offline banner if offline */}
      {isOffline && (
        <div className="w-full bg-amber-500 text-stone-950 px-3 py-2 rounded-2xl text-xs font-medium flex items-center justify-center gap-1.5 mb-3 shadow-sm">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>امتیاز شما روی گوشی ذخیره شد و به محض اتصال اینترنت ثبت می‌شود.</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="text-center my-3">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-turquoise-light text-turquoise-deep dark:bg-stone-800 dark:text-turquoise-tile">
          {result.isPractice ? 'تمرین به پایان رسید' : 'پایان مسابقه امروز'}
        </span>
        <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100 mt-2">
          {result.score >= 1400
            ? 'فوق‌العاده تیزبین بودید!'
            : result.score >= 1100
            ? 'آفرین به دقت و تمرکزتان!'
            : 'خوب بود! با تمرین تیزتر می‌شوید.'}
        </h2>
      </div>

      {/* Main Score Hero Card */}
      <div className="w-full bg-white dark:bg-stone-800 rounded-3xl p-6 border-2 border-turquoise-tile/20 shadow-md flex flex-col items-center gap-3 my-2 text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-turquoise-deep via-saffron to-pomegranate" />

        <span className="text-xs font-bold text-stone-400">امتیاز نهایی کسب‌شده</span>

        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-5xl text-saffron tracking-tight font-black">
            {formatNumberByLang(displayedScore, settings.language)}
          </span>
          <span className="text-xs text-stone-500 font-bold">امتیاز</span>
        </div>

        {/* Daily Rank Tag if ranked */}
        {result.dailyRank && !result.isPractice && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-700/60 text-xs font-bold text-stone-700 dark:text-stone-200 mt-1">
            <Trophy className="w-4 h-4 text-saffron" />
            <span>رتبه موقت شما در جدول امروز: #{toPersianDigits(result.dailyRank)}</span>
          </div>
        )}
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 my-3">
        {/* Accuracy */}
        <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 flex flex-col items-center">
          <Target className="w-4 h-4 text-emerald-500 mb-1" />
          <span className="font-display text-lg text-stone-900 dark:text-stone-100">
            {toPersianDigits(result.correctCount)} / {toPersianDigits(15)}
          </span>
          <span className="text-[10px] text-stone-500">پاسخ درست</span>
        </div>

        {/* Active Time */}
        <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 flex flex-col items-center">
          <Clock className="w-4 h-4 text-turquoise-tile mb-1" />
          <span className="font-display text-lg text-stone-900 dark:text-stone-100">
            {toPersianDigits(result.totalTimeSpentSeconds)} ثانیه
          </span>
          <span className="text-[10px] text-stone-500">زمان کل</span>
        </div>

        {/* Speed Bonus */}
        <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 flex flex-col items-center">
          <Zap className="w-4 h-4 text-saffron mb-1" />
          <span className="font-display text-lg text-saffron">
            +{toPersianDigits(result.speedBonus)}
          </span>
          <span className="text-[10px] text-stone-500">پاداش سرعت</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2.5 mt-auto pt-4">
        {/* Share Button */}
        <button
          onClick={() => {
            if (lastCompletedResult) {
              setShareModalAttempt(lastCompletedResult);
            }
          }}
          type="button"
          className="w-full py-4 rounded-2xl bg-saffron text-stone-950 font-display text-lg flex items-center justify-center gap-2 shadow-lg shadow-saffron/30 hover:bg-amber-400 active:scale-98 transition-all cursor-pointer"
        >
          <Share2 className="w-5 h-5" />
          <span>اشتراک‌گذاری کارنامه زیبا</span>
        </button>

        {/* View Leaderboard Button */}
        <button
          onClick={() => setActiveTab('leaderboard')}
          type="button"
          className="w-full py-3.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-turquoise-deep text-turquoise-deep dark:text-turquoise-tile font-medium text-sm flex items-center justify-center gap-2 hover:bg-turquoise-light/30 transition-colors cursor-pointer"
        >
          <Trophy className="w-4 h-4" />
          <span>مشاهده جدول رده‌بندی</span>
        </button>

        {/* Back to Home Button */}
        <button
          onClick={() => setActiveTab('home')}
          type="button"
          className="w-full py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-stone-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          <span>بازگشت به صفحه اصلی</span>
        </button>
      </div>
    </div>
  );
};
