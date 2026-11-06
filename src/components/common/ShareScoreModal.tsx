import React, { useState } from 'react';
import { AttemptResult } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { toPersianDigits, formatJalaliDate, formatNumberByLang } from '../../i18n';
import { AVATAR_LIST } from '../../data/seed';
import { X, Share2, Copy, Check, Sparkles } from 'lucide-react';
import { MedalBadge } from './MedalBadge';

interface Props {
  attempt: AttemptResult;
  onClose: () => void;
}

export const ShareScoreModal: React.FC<Props> = ({ attempt, onClose }) => {
  const { user, showToast, settings } = useAppStore();
  const [copied, setCopied] = useState(false);

  const avatar = AVATAR_LIST.find((a) => a.id === user.avatarId) || AVATAR_LIST[0];
  const referralLink = `tizbin.app/i/${user.referralCode}`;

  const handleShare = async () => {
    const textToShare = `🎯 من در مسابقه تیزبین امروز ${toPersianDigits(
      attempt.score
    )} امتیاز کسب کردم! آیا می‌توانی رکوردم را بشکنی؟\nلینک بازی: https://${referralLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'کارنامه تیزبین من',
          text: textToShare,
          url: `https://${referralLink}`
        });
        return;
      } catch {}
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      showToast('متن و لینک کارنامه کپی شد!');
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${referralLink}`);
      setCopied(true);
      showToast('لینک دعوت اختصاصی شما کپی شد!');
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[360px] bg-white dark:bg-stone-900 rounded-3xl p-5 shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col items-center gap-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 start-4 w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <h3 className="font-display text-xl text-stone-900 dark:text-stone-100">
            کارنامه افتخار تیزبین
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">تصویر قابل اشتراک در شبکه‌های اجتماعی</p>
        </div>

        {/* The Persian Tile Scorecard */}
        <div
          id="scorecard-tile"
          className="w-full bg-gradient-to-b from-turquoise-deep to-[#09474A] text-white rounded-3xl p-5 border-4 border-turquoise-tile/30 shadow-lg relative overflow-hidden flex flex-col items-center"
        >
          {/* Subtle background Persian geometric tile */}
          <div className="absolute inset-0 bg-persian-tile opacity-20 pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="flex items-center justify-between w-full z-10 mb-3 border-b border-white/15 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg text-saffron tracking-tight">تیزبین</span>
              <span className="text-[10px] text-white/70">· مسابقه هوش و سرعت</span>
            </div>
            <span className="text-[10px] text-white/80 font-medium">
              {formatJalaliDate(attempt.date, settings.language)}
            </span>
          </div>

          {/* Avatar and Player Name */}
          <div className="flex items-center gap-3 z-10 my-1 w-full">
            <div
              className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${avatar.color} flex items-center justify-center text-white font-display text-xl shadow-md border-2 border-white/40`}
            >
              {avatar.initial}
            </div>
            <div className="flex flex-col text-start">
              <span className="font-bold text-sm text-white">{user.name}</span>
              <span className="text-[11px] text-white/75">{user.city}</span>
            </div>
            {attempt.dailyRank && attempt.dailyRank <= 3 && (
              <div className="ms-auto">
                <MedalBadge rank={attempt.dailyRank} size="md" />
              </div>
            )}
          </div>

          {/* Big Score Box */}
          <div className="my-3 py-3 px-6 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex flex-col items-center w-full z-10">
            <span className="text-[11px] text-white/80">امتیاز ثبت‌شده</span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="font-display text-4xl text-saffron drop-shadow-sm">
                {formatNumberByLang(attempt.score, settings.language)}
              </span>
              <span className="text-xs text-white/80 font-medium">امتیاز</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
              <span>
                دقت: {toPersianDigits(attempt.correctCount)} از {toPersianDigits(15)}
              </span>
              <span>·</span>
              <span>زمان: {toPersianDigits(attempt.totalTimeSpentSeconds)} ثانیه</span>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="w-full flex items-center justify-between z-10 pt-1 text-[10px] text-white/70">
            <span>کد دعوت: {user.referralCode}</span>
            <span className="font-mono text-saffron">{referralLink}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full pt-1">
          <button
            onClick={handleShare}
            type="button"
            className="w-full py-3.5 px-4 rounded-2xl bg-saffron text-stone-950 font-display text-base flex items-center justify-center gap-2 shadow-md hover:bg-amber-400 active:scale-98 transition-all cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
            <span>اشتراک‌گذاری کارنامه</span>
          </button>

          <button
            onClick={handleCopyLink}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>کپی لینک دعوت دوستان</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
