import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Wifi, Signal, Battery, Sparkles, Smartphone, Layers, CheckCircle2 } from 'lucide-react';
import { DemoControlPanel } from '../DemoControlPanel';
import { toPersianDigits } from '../../i18n';

interface Props {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<Props> = ({ children }) => {
  const { demoPanelOpen, setDemoPanelOpen, activeToast, clearToast, settings } = useAppStore();
  const [currentTime, setCurrentTime] = useState('۱۲:۴۵');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(
        settings.language === 'fa'
          ? `${toPersianDigits(h)}:${toPersianDigits(m)}`
          : `${h}:${m}`
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, [settings.language]);

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#FBF7EF] via-[#F4EDE0] to-[#E6F4F3] dark:from-[#081012] dark:via-[#0F1A1C] dark:to-[#081619] relative">
      {/* Background Subtle Persian Tile Pattern */}
      <div className="absolute inset-0 bg-persian-tile opacity-30 pointer-events-none" />

      {/* DESKTOP BRAND & DEMO PANEL (Shown on >=1100px screen, on the LEFT side because app is RTL) */}
      <aside className="hidden xl:flex flex-col justify-between w-96 p-8 absolute start-12 top-10 bottom-10 z-20 select-none">
        {/* Brand Lockup */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-turquoise-deep shadow-md flex items-center justify-center">
              <span className="font-display text-2xl text-saffron">ت</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-3xl text-turquoise-deep dark:text-turquoise-tile tracking-tight leading-none">
                تیزبین
              </span>
              <span className="text-[11px] font-sans text-stone-500 font-bold mt-1">
                Tizbin Mobile Prototype
              </span>
            </div>
          </div>

          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
            هر روز ۹۰ ثانیه، تیزبین‌ترین باش. نمونه اولیه تعاملی برای دموی بازی روزانه مخاطبان فارسی‌زبان.
          </p>

          <div className="flex items-center gap-2 text-xs text-stone-500 bg-white/70 dark:bg-stone-800/70 p-3 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 backdrop-blur-xs">
            <Layers className="w-4 h-4 text-turquoise-deep dark:text-turquoise-tile shrink-0" />
            <span>نسخه آزمایشی · ۲ نقش · ۶۰ بازیکن · ۳۰ روز رکورد مسابقه</span>
          </div>
        </div>

        {/* Embedded Desktop Demo Control Panel */}
        <div className="p-4 rounded-3xl bg-white/85 dark:bg-stone-850/85 backdrop-blur-md border border-stone-200/80 dark:border-stone-700/80 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-saffron" />
              <span>پنل ابزار دمو (Live Controls)</span>
            </span>
          </div>

          <DemoControlPanel isSheet={false} />
        </div>

        {/* Bottom Tag */}
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <Smartphone className="w-4 h-4" />
          <span>طراحی منطبق بر گوشی‌های اقتصادی و اینترنت ناپایدار</span>
        </div>
      </aside>

      {/* PHONE CONTAINER CANVAS */}
      <div className="relative w-full h-full md:w-[412px] md:h-[min(840px,calc(100vh-48px))] md:rounded-[48px] md:border-[8px] md:border-stone-900/90 md:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] bg-[#FBF7EF] dark:bg-[#0F1A1C] overflow-hidden flex flex-col z-10 transition-colors">
        {/* Fake Camera Pill (Desktop only) */}
        <div className="hidden md:flex absolute top-2 inset-x-0 justify-center z-50 pointer-events-none">
          <div className="w-24 h-4 bg-stone-900 rounded-full" />
        </div>

        {/* Fake Mobile Status Bar (Desktop only) */}
        <div className="hidden md:flex items-center justify-between px-6 pt-2 pb-1 text-xs font-bold text-stone-800 dark:text-stone-200 select-none z-40 bg-transparent">
          <span className="font-mono text-xs ps-1">{currentTime}</span>
          <div className="flex items-center gap-2 pe-1">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Global Toast Notification inside phone frame */}
        {activeToast && (
          <div className="absolute top-10 inset-x-4 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="max-w-xs px-4 py-2.5 rounded-2xl bg-stone-900/95 text-white text-xs font-medium shadow-xl border border-stone-700/50 flex items-center gap-2 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{activeToast}</span>
            </div>
          </div>
        )}

        {/* Inner Phone Content (Only this scrolls) */}
        <div
          className={`flex-1 w-full h-full relative overflow-hidden flex flex-col ${
            settings.textSize === 'large'
              ? 'text-[1.08rem]'
              : settings.textSize === 'xlarge'
              ? 'text-[1.2rem]'
              : 'text-sm'
          }`}
        >
          {children}
        </div>

        {/* Mobile Hidden Sheet for Demo Control Panel (long press or triggered) */}
        {demoPanelOpen && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-h-[85vh] bg-white dark:bg-stone-900 rounded-t-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250">
              <DemoControlPanel isSheet={true} onClose={() => setDemoPanelOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
