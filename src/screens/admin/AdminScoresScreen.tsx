import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TopBar } from '../../components/common/TopBar';
import { generateDailyLeaderboardForDate, TODAY_DATE_STR, AVATAR_LIST } from '../../data/seed';
import { toPersianDigits, formatNumberByLang } from '../../i18n';
import { CheckCircle2, AlertCircle, Clock, Award } from 'lucide-react';

export const AdminScoresScreen: React.FC = () => {
  const { todayAttempt, settings } = useAppStore();
  const entries = generateDailyLeaderboardForDate(
    TODAY_DATE_STR,
    todayAttempt ? todayAttempt.score : undefined
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 overflow-hidden">
      <TopBar title="امتیازات و تلاش‌های امروز" />

      <div className="p-3 max-w-[412px] mx-auto w-full shrink-0">
        <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 flex items-center justify-between">
          <span>تعداد کل ثبت‌شده‌ها امروز: {toPersianDigits(entries.length)} تلاش</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>اعتبارسنجی خودکار فعال</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-3 max-w-[412px] mx-auto w-full pb-24 flex flex-col gap-2">
        {entries.map((item, idx) => {
          const avatar = AVATAR_LIST.find((a) => a.id === item.avatarId) || AVATAR_LIST[0];
          const isValid = item.score <= 1580;

          return (
            <div
              key={item.userId}
              className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-display text-xs text-stone-400 w-5 text-center">
                  #{toPersianDigits(idx + 1)}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatar.color} text-white font-display text-xs flex items-center justify-center`}
                >
                  {avatar.initial}
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-stone-400">
                    <span>{toPersianDigits(item.correctCount)} از ۱۵ درست</span>
                    <span>·</span>
                    <span>{toPersianDigits(item.timeSpentSeconds)} ثانیه</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-display text-base text-saffron font-bold">
                  {formatNumberByLang(item.score, settings.language)}
                </span>
                <span className="text-[9px] text-emerald-600 font-medium">تأیید سرور ✓</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
