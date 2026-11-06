import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AVATAR_LIST, PERSIAN_CITIES } from '../data/seed';
import { toPersianDigits } from '../i18n';
import { RenderIcon } from '../games/icons';
import { ArrowLeft, Check, Sparkles, Smartphone, ChevronRight } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { loginDemo, updateProfile, showToast } = useAppStore();

  const [step, setStep] = useState<'splash' | 'slides' | 'phone' | 'otp' | 'profile'>('splash');
  const [slideIdx, setSlideIdx] = useState(0);

  // Auth form states
  const [phone, setPhone] = useState('۰۹۱۲۳۴۵۶۷۸۹');
  const [otpCode, setOtpCode] = useState('۱۲۳۴۵۶');
  const [name, setName] = useState('آرش رستمی');
  const [city, setCity] = useState('تهران');
  const [avatarId, setAvatarId] = useState('av_3');
  const [referralCode, setReferralCode] = useState('');

  // Splash auto-transition under 2s
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('slides');
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const slides = [
    {
      title: 'روزانه فقط ۹۰ ثانیه!',
      desc: '۱۵ چالش تصویری تیزبینی و تمرکز برای تقویت ذهن تمام اعضای خانواده بدون هیچ متنی.',
      iconName: 'pomegranate'
    },
    {
      title: 'در جدول رتبه‌ها بدرخش',
      desc: 'با تیزبین‌های سراسر ایران رقابت کن و با کسب سرعت بالاتر، مدال‌های روزانه را از آن خود کن.',
      iconName: 'star'
    },
    {
      title: 'با دوستانت به اشتراک بگذار',
      desc: 'کارنامه روزانه‌ات را به اشتراک بگذار و دوستانت را به مسابقه دعوت کن.',
      iconName: 'flower'
    }
  ];

  const handleNextSlide = () => {
    if (slideIdx + 1 < slides.length) {
      setSlideIdx(slideIdx + 1);
    } else {
      setStep('phone');
    }
  };

  const handleSendOtp = () => {
    setStep('otp');
    showToast('کد تایید ۱۲۳۴۵۶ ارسال شد');
  };

  const handleVerifyOtp = () => {
    setStep('profile');
  };

  const handleFinishSetup = () => {
    updateProfile({
      name: name.trim() || 'تیزبین جوان',
      city,
      avatarId,
      phone
    });
    loginDemo(phone);
    showToast('به خانواده تیزبین خوش آمدید!');
  };

  const handleGoogleLogin = () => {
    loginDemo('۰۹۱۲۹۹۹۸۸۷۷');
    showToast('ورود با حساب گوگل با موفقیت انجام شد');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 max-w-[412px] mx-auto overflow-hidden relative select-none">
      {/* 1. SPLASH SCREEN (<2s) */}
      {step === 'splash' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-3xl bg-turquoise-deep shadow-xl flex items-center justify-center animate-soft-pulse">
              <RenderIcon name="star" size={56} color="#F2A007" />
            </div>
          </div>
          <h1 className="font-display text-4xl text-turquoise-deep dark:text-turquoise-tile tracking-tight">
            تیزبین
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-1">
            هر روز ۹۰ ثانیه، تیزبین‌ترین باش
          </p>
        </div>
      )}

      {/* 2. ONBOARDING 3-SLIDE WALKTHROUGH */}
      {step === 'slides' && (
        <div className="flex-1 flex flex-col justify-between p-6">
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep('phone')}
              type="button"
              className="text-xs text-stone-400 font-medium hover:text-stone-700 cursor-pointer"
            >
              رد کردن
            </button>
          </div>

          <div className="flex flex-col items-center text-center my-auto px-2">
            <div className="w-32 h-32 rounded-3xl bg-white dark:bg-stone-800 border-2 border-turquoise-tile/20 shadow-md flex items-center justify-center mb-6">
              <RenderIcon name={slides[slideIdx].iconName} size={84} />
            </div>

            <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">
              {slides[slideIdx].title}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed max-w-xs">
              {slides[slideIdx].desc}
            </p>

            {/* Slide Dots */}
            <div className="flex items-center gap-1.5 mt-6">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === slideIdx ? 'w-6 bg-saffron' : 'w-2 bg-stone-300 dark:bg-stone-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pb-4">
            <button
              onClick={handleNextSlide}
              type="button"
              className="w-full py-4 rounded-2xl bg-saffron text-stone-950 font-display text-lg flex items-center justify-center gap-2 shadow-lg shadow-saffron/30 hover:bg-amber-400 transition-all cursor-pointer"
            >
              <span>{slideIdx === 2 ? 'شروع و ثبت نام' : 'ادامه'}</span>
              <ChevronRight className="w-5 h-5 rtl:rotate-180 ltr:rotate-0" />
            </button>
          </div>
        </div>
      )}

      {/* 3. PHONE NUMBER ENTRY */}
      {step === 'phone' && (
        <div className="flex-1 flex flex-col justify-between p-6">
          <div className="pt-4">
            <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">
              ورود به تیزبین
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              شماره تلفن همراه خود را برای دریافت کد یکبار مصرف وارد کنید:
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs">
                <Smartphone className="w-5 h-5 text-stone-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-transparent text-sm font-bold text-stone-900 dark:text-stone-100 focus:outline-none text-start font-mono"
                />
              </div>

              <button
                onClick={handleSendOtp}
                type="button"
                className="w-full py-3.5 rounded-2xl bg-turquoise-deep text-white font-medium text-sm hover:bg-teal-800 transition-colors cursor-pointer shadow-md"
              >
                ارسال کد تأیید پیامکی
              </button>

              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
                <span className="text-[10px] text-stone-400">یا</span>
                <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
              </div>

              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full py-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span>ورود مستقیم با گوگل (دمو)</span>
              </button>
            </div>
          </div>

          <div className="text-center pb-4 text-[10px] text-stone-400">
            ثبت‌نام به منزله پذیرش قوانین مسابقه روزانه تیزبین است.
          </div>
        </div>
      )}

      {/* 4. OTP VERIFICATION */}
      {step === 'otp' && (
        <div className="flex-1 flex flex-col justify-between p-6">
          <div className="pt-4">
            <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">
              کد تأیید را وارد کنید
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              کد ۶ رقمی ارسال‌شده به شماره {phone} را وارد نمایید:
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="۱۲۳۴۵۶"
                className="p-4 rounded-2xl bg-white dark:bg-stone-800 border-2 border-turquoise-tile/50 text-center font-mono text-2xl font-bold tracking-widest text-stone-900 dark:text-stone-100 focus:outline-none shadow-xs"
              />
              <span className="text-[11px] text-stone-400 text-center">
                کد آزمایشی پیش‌فرض: ۱۲۳۴۵۶
              </span>

              <button
                onClick={handleVerifyOtp}
                type="button"
                className="w-full py-3.5 rounded-2xl bg-saffron text-stone-950 font-display text-lg hover:bg-amber-400 transition-colors cursor-pointer shadow-md mt-2"
              >
                تأیید و ادامه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PROFILE SETUP (Avatar, Name, City, Referral) */}
      {step === 'profile' && (
        <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto no-scrollbar">
          <div className="pt-2">
            <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">
              تکمیل مشخصات تیزبین
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              تصویر نمایه و نام خود را برای نمایش در جدول رتبه‌ها انتخاب کنید:
            </p>

            {/* Avatar Selector (12 options) */}
            <div className="my-4">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                انتخاب آواتار:
              </span>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_LIST.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => setAvatarId(av.id)}
                    type="button"
                    className={`aspect-square rounded-xl bg-gradient-to-br ${av.color} text-white font-display text-sm flex items-center justify-center transition-transform hover:scale-110 ${
                      avatarId === av.id ? 'ring-3 ring-saffron scale-105' : 'opacity-80'
                    }`}
                  >
                    {av.initial}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Name, City, Referral */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300 block mb-1">
                  نام یا نام مستعار
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300 block mb-1">
                  شهر محل سکونت
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none"
                >
                  {PERSIAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300 block mb-1">
                  کد معرف (اختیاری)
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="مثلاً: TIZ-1042"
                  className="w-full p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="py-4">
            <button
              onClick={handleFinishSetup}
              type="button"
              className="w-full py-4 rounded-2xl bg-saffron text-stone-950 font-display text-lg flex items-center justify-center gap-2 shadow-lg shadow-saffron/30 hover:bg-amber-400 transition-all cursor-pointer"
            >
              <span>ورود به باغ تیزبین</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
