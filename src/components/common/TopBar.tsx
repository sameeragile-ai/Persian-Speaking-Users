import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { toPersianDigits, formatNumberByLang } from '../../i18n';
import { Flame, Bell, Shield, Sparkles, ChevronRight, X } from 'lucide-react';

interface Props {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const TopBar: React.FC<Props> = ({ title, showBack, onBack }) => {
  const {
    user,
    role,
    settings,
    notifications,
    markNotificationRead,
    setRole,
    setDemoPanelOpen
  } = useAppStore();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 w-full px-4 py-3 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between transition-colors">
      {/* Start Slot: Back button OR Streak Badge */}
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            type="button"
            className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center hover:bg-stone-200 transition-colors"
            aria-label="بازگشت"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
          </button>
        ) : (
          <div
            onClick={() => setDemoPanelOpen(true)}
            title="برای منوی تنظیمات نمایشی ضربه بزنید"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-pomegranate cursor-pointer hover:bg-rose-100 transition-colors"
          >
            <Flame className="w-4 h-4 fill-pomegranate" />
            <span className="font-display text-xs font-bold leading-none">
              {toPersianDigits(user.streak)}
            </span>
          </div>
        )}

        {role === 'admin' && (
          <span className="px-2 py-0.5 rounded-md bg-stone-900 text-saffron text-[10px] font-bold tracking-tight">
            ادمین
          </span>
        )}
      </div>

      {/* Center Slot: Title or App Name with long press hint */}
      <div className="flex flex-col items-center">
        {title ? (
          <h1 className="font-display text-base text-stone-900 dark:text-stone-100">
            {title}
          </h1>
        ) : (
          <div
            onContextMenu={(e) => {
              e.preventDefault();
              setDemoPanelOpen(true);
            }}
            onClick={() => setDemoPanelOpen(true)}
            className="cursor-pointer group flex items-center gap-1"
          >
            <span className="font-display text-xl text-turquoise-deep dark:text-turquoise-tile tracking-tight">
              تیزبین
            </span>
            <span className="text-[10px] text-saffron font-bold">●</span>
          </div>
        )}
      </div>

      {/* End Slot: Total Points + Notification Bell */}
      <div className="flex items-center gap-2 relative">
        <div className="flex items-center gap-1 text-xs font-bold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-saffron" />
          <span>{formatNumberByLang(user.totalPoints, settings.language)}</span>
        </div>

        {/* Bell Button */}
        <button
          onClick={() => setShowNotifMenu(!showNotifMenu)}
          type="button"
          className="relative w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center hover:bg-stone-200 transition-colors cursor-pointer"
          aria-label="اعلان‌ها"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 end-1 w-2.5 h-2.5 rounded-full bg-pomegranate ring-2 ring-white dark:ring-stone-900" />
          )}
        </button>

        {/* Notifications Dropdown Panel */}
        {showNotifMenu && (
          <div className="absolute top-12 end-0 w-72 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-3 z-50 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300">
              <span>اعلان‌های تیزبین</span>
              <button onClick={() => setShowNotifMenu(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto no-scrollbar">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    setShowNotifMenu(false);
                  }}
                  className={`p-2 rounded-xl text-start cursor-pointer transition-colors ${
                    n.read
                      ? 'bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400'
                      : 'bg-turquoise-light/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>{n.title}</span>
                    <span className="text-[9px] text-stone-400 font-normal">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
