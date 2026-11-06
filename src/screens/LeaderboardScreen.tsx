import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/common/TopBar';
import {
  generateDailyLeaderboardForDate,
  generateMonthlyLeaderboard,
  TODAY_DATE_STR,
  AVATAR_LIST,
  SEED_PLAYERS
} from '../data/seed';
import { MedalBadge } from '../components/common/MedalBadge';
import { toPersianDigits, formatNumberByLang } from '../i18n';
import { Trophy, RefreshCw, Calendar, Flame, ChevronLeft } from 'lucide-react';
import { LeaderboardEntry, UserProfile } from '../types';

export const LeaderboardScreen: React.FC = () => {
  const { user, todayAttempt, settings, setSelectedUserPreview, showToast } = useAppStore();
  const [tab, setTab] = useState<'daily' | 'monthly'>('daily');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dailyEntries = generateDailyLeaderboardForDate(
    TODAY_DATE_STR,
    todayAttempt ? todayAttempt.score : undefined
  );
  const monthlyEntries = generateMonthlyLeaderboard();

  const activeEntries = tab === 'daily' ? dailyEntries : monthlyEntries;
  const top3 = activeEntries.slice(0, 3);
  const restList = activeEntries.slice(3, 50);
  const currentUserRow = activeEntries.find((e) => e.isCurrentUser || e.userId === user.id);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('جدول رتبه‌ها به‌روزرسانی شد!');
    }, 600);
  };

  const handleOpenPlayerSheet = (entry: LeaderboardEntry) => {
    const matched = SEED_PLAYERS.find((p) => p.id === entry.userId) || {
      id: entry.userId,
      name: entry.name,
      city: entry.city,
      phone: '۰۹۱۲۰۰۰۰۰۰۰',
      avatarId: entry.avatarId,
      referralCode: 'TIZ-REF',
      invitedCount: 3,
      streak: entry.streak,
      totalPoints: entry.score,
      bestScore: entry.score,
      createdAt: '1405-07-01',
      status: 'active' as const
    };
    setSelectedUserPreview(matched);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 overflow-hidden relative">
      <TopBar title="جدول رده‌بندی تیزبین" />

      {/* Segmented Control: Daily / Monthly */}
      <div className="p-3 max-w-[412px] mx-auto w-full shrink-0">
        <div className="p-1 rounded-2xl bg-stone-200/70 dark:bg-stone-800 flex items-center justify-between">
          <button
            onClick={() => setTab('daily')}
            type="button"
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'daily'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            مسابقه امروز
          </button>
          <button
            onClick={() => setTab('monthly')}
            type="button"
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'monthly'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            ماهانه (۱۵ روز برتر)
          </button>
        </div>

        {tab === 'monthly' && (
          <div className="text-[11px] text-stone-500 text-center mt-1.5 px-2">
            رتبه‌بندی ماهانه بر اساس مجموع ۱۵ رکورد برتر هر بازیکن محاسبه می‌شود.
          </div>
        )}
      </div>

      {/* Scrollable Leaderboard List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 max-w-[412px] mx-auto w-full pb-36">
        {/* Pull-to-refresh button / indicator */}
        <div className="flex items-center justify-center pb-2">
          <button
            onClick={handleRefresh}
            type="button"
            className="flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-turquoise-deep' : ''}`} />
            <span>به‌روزرسانی جدول</span>
          </button>
        </div>

        {/* Podium Top 3 (2nd, 1st, 3rd) */}
        <div className="grid grid-cols-3 gap-2 items-end pt-3 pb-5 mb-2">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div
              onClick={() => handleOpenPlayerSheet(top3[1])}
              className="flex flex-col items-center p-3 rounded-3xl bg-white/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 shadow-xs cursor-pointer hover:shadow-md transition-shadow"
            >
              <MedalBadge rank={2} size="sm" />
              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${
                  AVATAR_LIST.find((a) => a.id === top3[1].avatarId)?.color || 'from-teal-500 to-teal-800'
                } text-white font-display text-base flex items-center justify-center my-1.5 shadow-sm`}
              >
                {top3[1].name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate max-w-[80px]">
                {top3[1].name}
              </span>
              <span className="font-display text-xs text-saffron mt-0.5">
                {formatNumberByLang(top3[1].score, settings.language)}
              </span>
            </div>
          )}

          {/* Rank 1 (Gold - Elevated) */}
          {top3[0] && (
            <div
              onClick={() => handleOpenPlayerSheet(top3[0])}
              className="flex flex-col items-center p-3.5 rounded-3xl bg-gradient-to-b from-amber-50 to-white dark:from-stone-800 dark:to-stone-800 border-2 border-saffron/40 shadow-md cursor-pointer hover:shadow-lg transition-shadow relative -top-3"
            >
              <MedalBadge rank={1} size="md" />
              <div
                className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${
                  AVATAR_LIST.find((a) => a.id === top3[0].avatarId)?.color || 'from-rose-500 to-red-800'
                } text-white font-display text-xl flex items-center justify-center my-1.5 shadow-md border-2 border-saffron`}
              >
                {top3[0].name.charAt(0)}
              </div>
              <span className="text-xs font-black text-stone-900 dark:text-stone-100 truncate max-w-[85px]">
                {top3[0].name}
              </span>
              <span className="font-display text-sm text-saffron font-bold mt-0.5">
                {formatNumberByLang(top3[0].score, settings.language)}
              </span>
              <span className="text-[10px] text-stone-400">{top3[0].city}</span>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div
              onClick={() => handleOpenPlayerSheet(top3[2])}
              className="flex flex-col items-center p-3 rounded-3xl bg-white/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 shadow-xs cursor-pointer hover:shadow-md transition-shadow"
            >
              <MedalBadge rank={3} size="sm" />
              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${
                  AVATAR_LIST.find((a) => a.id === top3[2].avatarId)?.color || 'from-cyan-500 to-teal-800'
                } text-white font-display text-base flex items-center justify-center my-1.5 shadow-sm`}
              >
                {top3[2].name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate max-w-[80px]">
                {top3[2].name}
              </span>
              <span className="font-display text-xs text-saffron mt-0.5">
                {formatNumberByLang(top3[2].score, settings.language)}
              </span>
            </div>
          )}
        </div>

        {/* Ranked Rows List */}
        <div className="flex flex-col gap-2">
          {restList.map((entry) => {
            const avatar = AVATAR_LIST.find((a) => a.id === entry.avatarId) || AVATAR_LIST[0];
            const isMe = entry.isCurrentUser || entry.userId === user.id;

            return (
              <div
                key={entry.userId}
                onClick={() => handleOpenPlayerSheet(entry)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
                  isMe
                    ? 'bg-saffron-light/80 dark:bg-amber-950/40 border-2 border-saffron shadow-xs'
                    : 'bg-white dark:bg-stone-800/90 border border-stone-200/70 dark:border-stone-700/70 hover:bg-stone-50 dark:hover:bg-stone-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-stone-500 dark:text-stone-400 text-sm font-bold w-6 text-center">
                    {toPersianDigits(entry.rank)}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatar.color} text-white font-display text-sm flex items-center justify-center`}
                  >
                    {avatar.initial}
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                      <span>{entry.name}</span>
                      {isMe && (
                        <span className="text-[10px] text-amber-700 dark:text-saffron font-bold px-1.5 py-0.2 rounded-md bg-saffron/20">
                          شما
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {entry.city}
                      {tab === 'monthly' && entry.daysCounted ? ` · ${toPersianDigits(entry.daysCounted)} روز` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-display text-base text-saffron font-bold">
                    {formatNumberByLang(entry.score, settings.language)}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {toPersianDigits(entry.timeSpentSeconds)} ثانیه
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pinned Bottom User Standing Row */}
      {currentUserRow && (
        <div className="fixed bottom-20 inset-x-3 max-w-[390px] mx-auto z-30">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-turquoise-deep to-[#0C585C] text-white shadow-xl border border-turquoise-tile/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-base text-saffron px-2 py-0.5 rounded-lg bg-black/20">
                #{toPersianDigits(currentUserRow.rank)}
              </span>
              <div className="flex flex-col text-start">
                <span className="text-xs font-bold text-white">جایگاه شما: {user.name}</span>
                <span className="text-[10px] text-white/70">
                  {tab === 'daily' ? 'مسابقه امروز' : `مجموع ۱۵ روز: ${toPersianDigits(currentUserRow.score)} امتیاز`}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-display text-base text-saffron font-bold">
                {formatNumberByLang(currentUserRow.score, settings.language)}
              </span>
              <span className="text-[10px] text-white/80">
                {toPersianDigits(currentUserRow.timeSpentSeconds)} ثانیه
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
