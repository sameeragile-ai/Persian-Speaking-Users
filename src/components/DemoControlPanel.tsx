import React from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Shield,
  User,
  Globe,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Bell,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';

interface Props {
  isSheet?: boolean;
  onClose?: () => void;
}

export const DemoControlPanel: React.FC<Props> = ({ isSheet = false, onClose }) => {
  const {
    role,
    setRole,
    settings,
    setLanguage,
    setTheme,
    isOffline,
    toggleOffline,
    triggerDemoNotification,
    resetTodayAttempt,
    simulateAlreadyPlayed,
    submitSuspiciousScoreDemo,
    jumpToEndOfMonth,
    resetDemoData,
    showToast
  } = useAppStore();

  const handleRoleToggle = () => {
    const nextRole = role === 'player' ? 'admin' : 'player';
    setRole(nextRole);
    showToast(`نقش به "${nextRole === 'admin' ? 'مدیر سیستم (Admin)' : 'بازیکن (Player)'}" تغییر یافت.`);
  };

  const handleLanguageToggle = () => {
    const nextLang = settings.language === 'fa' ? 'en' : 'fa';
    setLanguage(nextLang);
    showToast(`زبان به ${nextLang === 'fa' ? 'فارسی' : 'English'} تغییر کرد.`);
  };

  const handleThemeToggle = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`پوسته به ${nextTheme === 'dark' ? 'تاریک' : 'روشن'} تغییر کرد.`);
  };

  return (
    <div
      className={`flex flex-col gap-3 select-none ${
        isSheet
          ? 'w-full p-4 bg-white dark:bg-stone-900 rounded-t-3xl max-h-[85vh] overflow-y-auto'
          : 'w-full'
      }`}
    >
      {isSheet && (
        <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-saffron" />
            <h3 className="font-display text-base text-stone-900 dark:text-stone-100">
              کنترل پنل ویژه دمو (Demo Tools)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Control Buttons Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* 1. Switch Role (Player / Admin) */}
        <button
          onClick={handleRoleToggle}
          type="button"
          className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 flex items-center justify-between transition-colors cursor-pointer border border-stone-200/60 dark:border-stone-700"
        >
          <div className="flex items-center gap-1.5">
            {role === 'admin' ? <Shield className="w-4 h-4 text-pomegranate" /> : <User className="w-4 h-4 text-turquoise-deep" />}
            <span className="font-bold">تغییر نقش</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 font-bold">
            {role === 'admin' ? 'ادمین' : 'کاربر'}
          </span>
        </button>

        {/* 2. Switch Language (FA / EN) */}
        <button
          onClick={handleLanguageToggle}
          type="button"
          className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 flex items-center justify-between transition-colors cursor-pointer border border-stone-200/60 dark:border-stone-700"
        >
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-turquoise-tile" />
            <span className="font-bold">تغییر زبان</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 font-bold">
            {settings.language.toUpperCase()}
          </span>
        </button>

        {/* 3. Toggle Theme */}
        <button
          onClick={handleThemeToggle}
          type="button"
          className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 flex items-center justify-between transition-colors cursor-pointer border border-stone-200/60 dark:border-stone-700"
        >
          <div className="flex items-center gap-1.5">
            {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-saffron" />}
            <span className="font-bold">پوسته ظاهری</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 font-bold">
            {settings.theme === 'dark' ? 'تاریک' : 'روشن'}
          </span>
        </button>

        {/* 4. Toggle Offline */}
        <button
          onClick={toggleOffline}
          type="button"
          className={`p-3 rounded-2xl flex items-center justify-between transition-colors cursor-pointer border ${
            isOffline
              ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 border-stone-200/60 dark:border-stone-700'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {isOffline ? <WifiOff className="w-4 h-4 text-pomegranate" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
            <span className="font-bold">شبیه‌ساز آفلاین</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/10 font-bold">
            {isOffline ? 'قطع' : 'وصل'}
          </span>
        </button>

        {/* 5. Trigger Push Notification */}
        <button
          onClick={() => triggerDemoNotification('rank')}
          type="button"
          className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200/60 dark:border-stone-700"
        >
          <Bell className="w-4 h-4 text-amber-500" />
          <span className="font-bold">تست نوتیفیکیشن</span>
        </button>

        {/* 6. Reset Today's Attempt */}
        <button
          onClick={() => {
            resetTodayAttempt();
            showToast('مسابقه امروز ریست شد؛ می‌توانید مجدداً بازی کنید.');
          }}
          type="button"
          className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200/60 dark:border-stone-700"
        >
          <RotateCcw className="w-4 h-4 text-turquoise-deep" />
          <span className="font-bold">ریست مسابقه امروز</span>
        </button>

        {/* 7. Simulate "Already Played Today" */}
        <button
          onClick={() => {
            simulateAlreadyPlayed();
            showToast('وضعیت "قبلاً بازی شده امروز" فعال شد.');
          }}
          type="button"
          className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200/60 dark:border-stone-700"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-bold">شبیه‌سازی بازی شده</span>
        </button>

        {/* 8. Submit Suspicious Score (Anti-Cheat flag trigger) */}
        <button
          onClick={submitSuspiciousScoreDemo}
          type="button"
          className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200/60 dark:border-stone-700"
        >
          <AlertTriangle className="w-4 h-4 text-pomegranate" />
          <span className="font-bold">ثبت امتیاز مشکوک (فلگ)</span>
        </button>
      </div>

      {/* Row of Action Links */}
      <div className="flex items-center gap-2 pt-1">
        {/* 9. Jump to end of month */}
        <button
          onClick={jumpToEndOfMonth}
          type="button"
          className="flex-1 py-2 px-3 rounded-xl bg-turquoise-deep text-white font-medium text-xs hover:bg-teal-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>پرش به پایان ماه</span>
        </button>

        {/* 10. Reset Demo Data */}
        <button
          onClick={resetDemoData}
          type="button"
          className="py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-pomegranate font-medium text-xs hover:bg-rose-100 transition-colors"
        >
          بازنشانی کامل
        </button>
      </div>
    </div>
  );
};
