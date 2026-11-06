import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/common/TopBar';
import { toPersianDigits, formatJalaliDate, formatNumberByLang } from '../i18n';
import { Trophy, Flame, Calendar, Clock, Target, Share2, Award, Zap } from 'lucide-react';
import { PAST_30_DAYS } from '../data/seed';

export const HistoryScreen: React.FC = () => {
  const { user, history, settings, setShareModalAttempt } = useAppStore();
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

  // Group or map 30 days for heatmap
  const historyMap = new Map(history.map((h) => [h.date, h]));

  // Calculate 30-day SVG trend points
  const recent30 = PAST_30_DAYS.map((date) => {
    const entry = historyMap.get(date);
    return {
      date,
      score: entry ? entry.score : 0,
      played: Boolean(entry)
    };
  });

  const maxChartScore = 1600;
  const svgWidth = 320;
  const svgHeight = 110;
  const padding = 12;

  // Build SVG path for trendline
  const points = recent30.map((item, idx) => {
    const x = padding + (idx / (recent30.length - 1)) * (svgWidth - padding * 2);
    const scoreVal = item.score > 0 ? item.score : 800;
    const y = svgHeight - padding - (scoreVal / maxChartScore) * (svgHeight - padding * 2);
    return { x, y, score: item.score, played: item.played, date: item.date };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 overflow-y-auto no-scrollbar pb-24">
      <TopBar title="کارنامه و سوابق" />

      <main className="p-4 flex flex-col gap-4 max-w-[412px] mx-auto w-full">
        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex flex-col">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>بهترین رکورد</span>
              <Trophy className="w-4 h-4 text-saffron" />
            </div>
            <span className="font-display text-2xl text-stone-900 dark:text-stone-100">
              {formatNumberByLang(user.bestScore, settings.language)}
            </span>
            <span className="text-[10px] text-stone-400">حداکثر ۱٬۵۹۰</span>
          </div>

          <div className="p-3.5 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex flex-col">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>تداوم بازی</span>
              <Flame className="w-4 h-4 text-pomegranate fill-pomegranate" />
            </div>
            <span className="font-display text-2xl text-pomegranate">
              {toPersianDigits(user.streak)} روز
            </span>
            <span className="text-[10px] text-stone-400">پیاپی و فعال</span>
          </div>

          <div className="p-3.5 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex flex-col">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>کل مسابقات</span>
              <Calendar className="w-4 h-4 text-turquoise-tile" />
            </div>
            <span className="font-display text-2xl text-turquoise-deep dark:text-turquoise-tile">
              {toPersianDigits(history.length)} بار
            </span>
            <span className="text-[10px] text-stone-400">ثبت‌شده</span>
          </div>

          <div className="p-3.5 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex flex-col">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>مجموع امتیازات</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <span className="font-display text-2xl text-stone-900 dark:text-stone-100">
              {formatNumberByLang(user.totalPoints, settings.language)}
            </span>
            <span className="text-[10px] text-stone-400">مادام‌العمر</span>
          </div>
        </div>

        {/* 30-Day Activity Heatmap */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
            <span>تقویم ۳۰ روز اخیر</span>
            <span className="text-[10px] text-stone-400 font-normal">
              {toPersianDigits(history.length)} از {toPersianDigits(30)} روز بازی شده
            </span>
          </div>

          {/* Heatmap Grid of 30 blocks */}
          <div className="grid grid-cols-10 gap-1.5 pt-1">
            {recent30.map((d, i) => {
              let bg = 'bg-stone-100 dark:bg-stone-700/60';
              if (d.played) {
                if (d.score >= 1400) bg = 'bg-turquoise-deep dark:bg-turquoise-tile';
                else if (d.score >= 1200) bg = 'bg-teal-500';
                else bg = 'bg-teal-300 dark:bg-teal-700';
              }
              return (
                <div
                  key={d.date}
                  title={`${d.date}: ${d.played ? `${d.score} امتیاز` : 'بازی نشده'}`}
                  className={`w-full aspect-square rounded-md ${bg} transition-colors cursor-pointer hover:ring-2 hover:ring-saffron`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
            <span>۳۰ روز پیش</span>
            <div className="flex items-center gap-1">
              <span>کمتر</span>
              <span className="w-2.5 h-2.5 rounded-xs bg-teal-200 dark:bg-teal-800" />
              <span className="w-2.5 h-2.5 rounded-xs bg-teal-500" />
              <span className="w-2.5 h-2.5 rounded-xs bg-turquoise-deep dark:bg-turquoise-tile" />
              <span>بیشتر</span>
            </div>
            <span>امروز</span>
          </div>
        </div>

        {/* 30-Day Score Trend Interactive SVG Chart */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
            <span>روند پیشرفت امتیازات</span>
            <span className="text-[10px] text-saffron font-bold">میانگین: ۱٬۳۲۰</span>
          </div>

          <div className="w-full flex justify-center py-1">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-28 overflow-visible">
              {/* Subtle background guide lines */}
              <line
                x1={padding}
                y1={padding}
                x2={svgWidth - padding}
                y2={padding}
                stroke="#E7E5E4"
                strokeDasharray="3 3"
              />
              <line
                x1={padding}
                y1={svgHeight / 2}
                x2={svgWidth - padding}
                y2={svgHeight / 2}
                stroke="#E7E5E4"
                strokeDasharray="3 3"
              />
              <line
                x1={padding}
                y1={svgHeight - padding}
                x2={svgWidth - padding}
                y2={svgHeight - padding}
                stroke="#E7E5E4"
                strokeDasharray="3 3"
              />

              {/* Trendline */}
              <path
                d={pathD}
                fill="none"
                stroke="#0E6E73"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points
                .filter((p) => p.played)
                .slice(-12)
                .map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={3}
                    fill="#F2A007"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                ))}
            </svg>
          </div>
        </div>

        {/* Recent Scores List */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-stone-500 px-1">سوابق مسابقات اخیر</h3>

          {history.length === 0 ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-800 text-center text-xs text-stone-400">
              هنوز مسابقه‌ای ثبت نشده است.
            </div>
          ) : (
            history.slice(0, 15).map((att) => (
              <div
                key={att.id}
                onClick={() => setShareModalAttempt(att)}
                className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between shadow-xs hover:border-saffron transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-turquoise-light dark:bg-stone-700 text-turquoise-deep dark:text-turquoise-tile flex items-center justify-center font-display text-base">
                    #{toPersianDigits(att.dailyRank || 12)}
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      {formatJalaliDate(att.date, settings.language)}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                      <span>{toPersianDigits(att.correctCount)} درست</span>
                      <span>·</span>
                      <span>{toPersianDigits(att.totalTimeSpentSeconds)} ثانیه</span>
                      {att.speedBonus > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-saffron">+{toPersianDigits(att.speedBonus)} پاداش</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-display text-lg text-saffron font-bold">
                    {formatNumberByLang(att.score, settings.language)}
                  </span>
                  <Share2 className="w-4 h-4 text-stone-400 hover:text-stone-600" />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
