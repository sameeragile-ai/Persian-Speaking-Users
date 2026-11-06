import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/common/TopBar';
import { toPersianDigits, formatJalaliDate, formatNumberByLang } from '../i18n';
import { Play, Sparkles, Trophy, Users, ArrowLeft, CheckCircle2, Flame, Share2 } from 'lucide-react';
import { generateDailyLeaderboardForDate, TODAY_DATE_STR, AVATAR_LIST } from '../data/seed';
import { MedalBadge } from '../components/common/MedalBadge';
import { RenderIcon } from '../games/icons';

export const HomeScreen: React.FC = () => {
  const {
    user,
    todayAttempt,
    setActiveTab,
    settings,
    setShareModalAttempt,
    setSelectedUserPreview
  } = useAppStore();

  const [timeLeftToMidnight, setTimeLeftToMidnight] = useState({ hours: 7, minutes: 24, seconds: 18 });

  // Countdown timer to midnight (next daily challenge)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = 23 - now.getHours();
      const minutes = 59 - now.getMinutes();
      const seconds = 59 - now.getSeconds();
      setTimeLeftToMidnight({ hours, minutes, seconds });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayBoard = generateDailyLeaderboardForDate(
    TODAY_DATE_STR,
    todayAttempt ? todayAttempt.score : undefined
  );
  const top3 = todayBoard.slice(0, 3);
  const userRankEntry = todayBoard.find((e) => e.isCurrentUser);

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 overflow-y-auto no-scrollbar pb-24">
      <TopBar />

      <main className="p-4 flex flex-col gap-4 max-w-[412px] mx-auto w-full">
        {/* Hero Daily Challenge Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-turquoise-deep via-[#0D5B5F] to-[#083C3E] text-white p-5 shadow-lg overflow-hidden border border-turquoise-tile/30">
          {/* Subtle Persian tile background */}
          <div className="absolute inset-0 bg-persian-tile opacity-15 pointer-events-none" />

          {/* Floating decorative mini-SVGs */}
          <div className="absolute top-3 end-3 opacity-20 pointer-events-none">
            <RenderIcon name="star" size={64} color="#F2A007" />
          </div>

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-white/90">
                {formatJalaliDate(new Date(), settings.language)}
              </span>
              <div className="text-[11px] text-saffron font-bold flex items-center gap-1">
                <span>مسابقه بعدی:</span>
                <span className="font-mono">
                  {toPersianDigits(
                    `${String(timeLeftToMidnight.hours).padStart(2, '0')}:${String(
                      timeLeftToMidnight.minutes
                    ).padStart(2, '0')}:${String(timeLeftToMidnight.seconds).padStart(2, '0')}`
                  )}
                </span>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-white">مسابقه تصویری امروز</h2>
              <p className="text-xs text-white/80 mt-0.5">
                ۱۵ چالش سرعتی تیزبینی در ۹۰ ثانیه · سنجش تمرکز و سرعت
              </p>
            </div>

            {/* Play CTA or Already Played Card */}
            {todayAttempt ? (
              <div className="mt-1 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div className="flex flex-col text-start">
                    <span className="text-xs font-bold text-white">امروز مسابقه دادید!</span>
                    <span className="text-[11px] text-white/75">
                      امتیاز شما: {toPersianDigits(todayAttempt.score)} (رتبه{' '}
                      {toPersianDigits(todayAttempt.dailyRank || 14)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShareModalAttempt(todayAttempt)}
                    type="button"
                    className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                    title="اشتراک‌گذاری کارنامه"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('play')}
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-saffron text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    تمرین آزاد
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-1 flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('play')}
                  type="button"
                  className="w-full py-3.5 px-4 rounded-2xl bg-saffron text-stone-950 font-display text-lg flex items-center justify-center gap-2 shadow-lg shadow-saffron/30 hover:bg-amber-400 active:scale-98 transition-all cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-stone-950 ps-0.5" />
                  <span>شروع مسابقه امروز (۹۰ ثانیه)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Fast Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Current Rank Card */}
          <div
            onClick={() => setActiveTab('leaderboard')}
            className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>رتبه روزانه شما</span>
              <Trophy className="w-4 h-4 text-saffron" />
            </div>
            <div className="my-2">
              <span className="font-display text-3xl text-turquoise-deep dark:text-turquoise-tile">
                {userRankEntry ? `#${toPersianDigits(userRankEntry.rank)}` : 'هنوز بازی نکردید'}
              </span>
            </div>
            <span className="text-[11px] text-stone-400">مشاهده جدول کامل ←</span>
          </div>

          {/* Daily Streak Card */}
          <div
            onClick={() => setActiveTab('history')}
            className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>تداوم حضور</span>
              <Flame className="w-4 h-4 text-pomegranate fill-pomegranate" />
            </div>
            <div className="my-2">
              <span className="font-display text-3xl text-pomegranate">
                {toPersianDigits(user.streak)} روز
              </span>
            </div>
            <span className="text-[11px] text-stone-400">کارنامه مسابقات ←</span>
          </div>
        </div>

        {/* Top 3 Podium of Today */}
        <div className="rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-saffron" />
              <span>پیشتازان مسابقه امروز</span>
            </h3>
            <button
              onClick={() => setActiveTab('leaderboard')}
              type="button"
              className="text-xs text-turquoise-deep dark:text-turquoise-tile font-bold hover:underline cursor-pointer"
            >
              مشاهده همه
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {top3.map((player) => {
              const avatar = AVATAR_LIST.find((a) => a.id === player.avatarId) || AVATAR_LIST[0];
              return (
                <div
                  key={player.userId}
                  onClick={() =>
                    setSelectedUserPreview({
                      id: player.userId,
                      name: player.name,
                      city: player.city,
                      phone: '۰۹۱۲۰۰۰۰۰۰۰',
                      avatarId: player.avatarId,
                      referralCode: 'TIZ-REF',
                      invitedCount: 3,
                      streak: player.streak,
                      totalPoints: player.score * 8,
                      bestScore: player.score,
                      createdAt: '1405-07-01',
                      status: 'active'
                    })
                  }
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-700/40 hover:bg-turquoise-light/40 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MedalBadge rank={player.rank} size="sm" />
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatar.color} text-white font-display text-sm flex items-center justify-center`}
                    >
                      {avatar.initial}
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                        {player.name}
                      </span>
                      <span className="text-[10px] text-stone-400">{player.city}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="font-display text-sm text-saffron font-bold">
                      {toPersianDigits(player.score)}
                    </span>
                    <span className="text-[9px] text-stone-400">
                      {toPersianDigits(player.timeSpentSeconds)} ثانیه
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invite Friends Banner */}
        <div
          onClick={() => setActiveTab('profile')}
          className="rounded-3xl p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800/60 border border-amber-200/70 dark:border-stone-700 flex items-center justify-between cursor-pointer hover:shadow-xs transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-saffron/20 text-amber-700 dark:text-saffron flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-start">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                دعوت از دوستان و باز کردن تم‌ها
              </span>
              <span className="text-[11px] text-stone-500">
                کد معرف شما: <strong className="text-amber-700 dark:text-saffron">{user.referralCode}</strong>
              </span>
            </div>
          </div>
          <ArrowLeft className="w-4 h-4 text-stone-400 rtl:rotate-0 ltr:rotate-180" />
        </div>
      </main>
    </div>
  );
};
