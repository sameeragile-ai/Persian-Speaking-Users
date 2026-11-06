import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TopBar } from '../../components/common/TopBar';
import { toPersianDigits, formatNumberByLang } from '../../i18n';
import { SEED_PLAYERS } from '../../data/seed';
import { Users, CheckCircle2, AlertTriangle, Gift, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const AdminOverviewScreen: React.FC = () => {
  const { flaggedAttempts, prizeRecords, setActiveTab, setRole } = useAppStore();

  const totalPlayers = SEED_PLAYERS.length + 1;
  const attemptsToday = 48;
  const avgScore = 1285;
  const pendingFlagsCount = flaggedAttempts.filter((f) => f.status === 'pending').length;

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 overflow-y-auto no-scrollbar pb-24">
      <TopBar title="داشبورد مدیریت" />

      <main className="p-4 flex flex-col gap-4 max-w-[412px] mx-auto w-full">
        {/* Role Switcher Alert */}
        <div className="p-3 rounded-2xl bg-stone-900 text-white flex items-center justify-between text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-saffron" />
            <span>حالت مدیر کل (Admin) فعال است</span>
          </div>
          <button
            onClick={() => setRole('player')}
            type="button"
            className="px-2.5 py-1 rounded-lg bg-stone-800 text-saffron font-bold hover:bg-stone-700"
          >
            تغییر به کاربر
          </button>
        </div>

        {/* 4 Core KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setActiveTab('admin_users')}
            className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs cursor-pointer hover:border-turquoise-deep flex flex-col"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>کل کاربران</span>
              <Users className="w-4 h-4 text-turquoise-deep" />
            </div>
            <span className="font-display text-2xl text-stone-900 dark:text-stone-100">
              {toPersianDigits(totalPlayers)}
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">مشاهده لیست ←</span>
          </div>

          <div
            onClick={() => setActiveTab('admin_scores')}
            className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs cursor-pointer hover:border-turquoise-deep flex flex-col"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>تلاش‌های امروز</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="font-display text-2xl text-stone-900 dark:text-stone-100">
              {toPersianDigits(attemptsToday)}
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">میانگین: {toPersianDigits(avgScore)}</span>
          </div>

          <div
            onClick={() => setActiveTab('admin_flags')}
            className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs cursor-pointer hover:border-pomegranate flex flex-col"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>گزارشات تخلف</span>
              <AlertTriangle className="w-4 h-4 text-pomegranate" />
            </div>
            <span className="font-display text-2xl text-pomegranate">
              {toPersianDigits(pendingFlagsCount)} مورد
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">نیازمند بازبینی ←</span>
          </div>

          <div
            onClick={() => setActiveTab('admin_prizes')}
            className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs cursor-pointer hover:border-saffron flex flex-col"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>دفتر جوایز دستی</span>
              <Gift className="w-4 h-4 text-saffron" />
            </div>
            <span className="font-display text-2xl text-stone-900 dark:text-stone-100">
              {toPersianDigits(prizeRecords.length)} ردیف
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">ثبت دفتری ←</span>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-col gap-2">
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
            عملیات سریع مدیریتی
          </span>

          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={() => setActiveTab('admin_flags')}
              className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-700/50 flex items-center justify-between text-xs text-stone-800 dark:text-stone-200 hover:bg-stone-100 transition-colors"
            >
              <span>بررسی ۵ تلاش مشکوک به ربات و کلیک سریع</span>
              <ArrowUpRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => setActiveTab('admin_prizes')}
              className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-700/50 flex items-center justify-between text-xs text-stone-800 dark:text-stone-200 hover:bg-stone-100 transition-colors"
            >
              <span>مشاهده کارنامه برندگان ماهانه و ثبت حواله دستی</span>
              <ArrowUpRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
