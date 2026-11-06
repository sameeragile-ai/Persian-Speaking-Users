import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/common/TopBar';
import { AVATAR_LIST } from '../data/seed';
import { toPersianDigits } from '../../src/i18n';
import {
  Users,
  Copy,
  Check,
  Share2,
  Volume2,
  VolumeX,
  Smartphone,
  Eye,
  LogOut,
  MapPin,
  Moon,
  Sun,
  Globe,
  Sliders,
  Type
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    settings,
    setLanguage,
    setTheme,
    setTextSize,
    setSoundEnabled,
    setHapticsEnabled,
    setReduceMotion,
    logout,
    updateProfile,
    showToast
  } = useAppStore();

  const [isCopied, setIsCopied] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const currentAvatar = AVATAR_LIST.find((a) => a.id === user.avatarId) || AVATAR_LIST[0];
  const referralLink = `tizbin.app/i/${user.referralCode}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(user.referralCode);
      setIsCopied(true);
      showToast('کد معرف کپی شد!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {}
  };

  const handleShareReferral = async () => {
    const text = `🎯 بیا توی تیزبین با هم مسابقه بدیم! با کد معرف من ثبت‌نام کن: ${user.referralCode}\nلینک: https://${referralLink}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'دعوت به بازی تیزبین',
          text,
          url: `https://${referralLink}`
        });
        return;
      } catch {}
    }
    await handleCopyCode();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 overflow-y-auto no-scrollbar pb-24">
      <TopBar title="پروفایل کاربری" />

      <main className="p-4 flex flex-col gap-4 max-w-[412px] mx-auto w-full">
        {/* User Profile Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex flex-col items-center text-center gap-3 relative">
          <div className="relative">
            <div
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${currentAvatar.color} text-white font-display text-3xl flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform border-4 border-white dark:border-stone-700`}
            >
              {currentAvatar.initial}
            </div>
            <span
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-1 -end-1 px-2 py-0.5 rounded-full bg-saffron text-stone-950 text-[10px] font-bold cursor-pointer shadow-xs"
            >
              تغییر
            </span>
          </div>

          <div>
            <h2 className="font-display text-xl text-stone-900 dark:text-stone-100">{user.name}</h2>
            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{user.city}</span>
              <span>·</span>
              <span>{user.phone}</span>
            </div>
          </div>

          {/* 12 Illustrated Avatar Picker Modal/Drawer */}
          {showAvatarPicker && (
            <div className="w-full pt-3 pb-1 border-t border-stone-100 dark:border-stone-700">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-300 block mb-2.5">
                یکی از ۱۲ تصویر نمایه را انتخاب کنید:
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {AVATAR_LIST.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => {
                      updateProfile({ avatarId: av.id });
                      setShowAvatarPicker(false);
                      showToast('تصویر نمایه تغییر کرد');
                    }}
                    type="button"
                    className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${av.color} text-white font-display text-lg flex items-center justify-center transition-transform hover:scale-110 shadow-xs ${
                      user.avatarId === av.id ? 'ring-4 ring-saffron' : ''
                    }`}
                  >
                    {av.initial}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Referral Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800/80 border border-amber-200/80 dark:border-stone-700 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-700 dark:text-saffron" />
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                کد دعوت و جوایز دوستان
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-800 dark:text-saffron">
              {toPersianDigits(user.invitedCount)} دوست دعوت شده
            </span>
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed">
            با دعوت از هر دوست، ۱ تم بازی تمرینی جدید باز می‌شود. (جوایز فقط جنبه سرگرمی دارند)
          </p>

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-700">
            <div className="flex flex-col text-start">
              <span className="text-[10px] text-stone-400">کد دعوت اختصاصی:</span>
              <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100">
                {user.referralCode}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyCode}
                type="button"
                className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-medium flex items-center gap-1 hover:bg-stone-200"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'کپی شد' : 'کپی'}</span>
              </button>

              <button
                onClick={handleShareReferral}
                type="button"
                className="p-1.5 rounded-xl bg-saffron text-stone-950 hover:bg-amber-400"
                title="ارسال لینک"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* App Settings Section */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex flex-col gap-3.5">
          <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-turquoise-deep dark:text-turquoise-tile" />
            <span>تنظیمات تجربه کاربری</span>
          </h3>

          {/* Language Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">زبان (Language)</span>
            </div>
            <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-700 text-xs">
              <button
                onClick={() => setLanguage('fa')}
                type="button"
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  settings.language === 'fa'
                    ? 'bg-white dark:bg-stone-600 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500'
                }`}
              >
                فارسی
              </button>
              <button
                onClick={() => setLanguage('en')}
                type="button"
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  settings.language === 'en'
                    ? 'bg-white dark:bg-stone-600 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Theme Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">پوسته ظاهری</span>
            </div>
            <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-700 text-xs">
              <button
                onClick={() => setTheme('light')}
                type="button"
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  settings.theme === 'light'
                    ? 'bg-white dark:bg-stone-600 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500'
                }`}
              >
                روشن
              </button>
              <button
                onClick={() => setTheme('dark')}
                type="button"
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  settings.theme === 'dark'
                    ? 'bg-white dark:bg-stone-600 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500'
                }`}
              >
                تاریک
              </button>
              <button
                onClick={() => setTheme('system')}
                type="button"
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  settings.theme === 'system'
                    ? 'bg-white dark:bg-stone-600 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500'
                }`}
              >
                خودکار
              </button>
            </div>
          </div>

          {/* Text Size Scale (for elderly users) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">اندازه قلم (سالمندان)</span>
            </div>
            <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-700 text-xs">
              <button
                onClick={() => setTextSize('normal')}
                type="button"
                className={`px-2 py-1 rounded-lg ${settings.textSize === 'normal' ? 'bg-white dark:bg-stone-600 font-bold shadow-xs' : 'text-stone-500'}`}
              >
                عادی
              </button>
              <button
                onClick={() => setTextSize('large')}
                type="button"
                className={`px-2 py-1 rounded-lg ${settings.textSize === 'large' ? 'bg-white dark:bg-stone-600 font-bold shadow-xs' : 'text-stone-500'}`}
              >
                بزرگ
              </button>
              <button
                onClick={() => setTextSize('xlarge')}
                type="button"
                className={`px-2 py-1 rounded-lg ${settings.textSize === 'xlarge' ? 'bg-white dark:bg-stone-600 font-bold shadow-xs' : 'text-stone-500'}`}
              >
                خیلی بزرگ
              </button>
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">افکت‌های صوتی</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!settings.soundEnabled)}
              type="button"
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.soundEnabled ? 'bg-turquoise-deep' : 'bg-stone-300 dark:bg-stone-600'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  settings.soundEnabled ? 'start-6' : 'start-1'
                }`}
              />
            </button>
          </div>

          {/* Haptics Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">لرزش لمسی (ویبره)</span>
            </div>
            <button
              onClick={() => setHapticsEnabled(!settings.hapticsEnabled)}
              type="button"
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.hapticsEnabled ? 'bg-turquoise-deep' : 'bg-stone-300 dark:bg-stone-600'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  settings.hapticsEnabled ? 'start-6' : 'start-1'
                }`}
              />
            </button>
          </div>

          {/* Reduce Motion Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">کاهش انیمیشن‌ها</span>
            </div>
            <button
              onClick={() => setReduceMotion(!settings.reduceMotion)}
              type="button"
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.reduceMotion ? 'bg-turquoise-deep' : 'bg-stone-300 dark:bg-stone-600'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  settings.reduceMotion ? 'start-6' : 'start-1'
                }`}
              />
            </button>
          </div>

          {/* Data Used Line (Sells low data story) */}
          <div className="pt-2 text-center border-t border-stone-100 dark:border-stone-700/60">
            <span className="text-[11px] text-stone-400">
              حجم مصرفی داده امروز: <strong className="text-emerald-600 dark:text-emerald-400">۴۲ کیلوبایت</strong> (فوق سبک · SVG درون‌برنامه)
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          type="button"
          className="w-full py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-pomegranate font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>خروج از حساب کاربری</span>
        </button>
      </main>
    </div>
  );
};
