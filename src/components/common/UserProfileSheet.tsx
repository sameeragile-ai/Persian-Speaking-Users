import React from 'react';
import { UserProfile } from '../../types';
import { AVATAR_LIST } from '../../data/seed';
import { toPersianDigits, formatNumberByLang } from '../../i18n';
import { X, Flame, Trophy, MapPin, Award } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  user: UserProfile;
  onClose: () => void;
}

export const UserProfileSheet: React.FC<Props> = ({ user, onClose }) => {
  const { settings, showToast } = useAppStore();
  const avatar = AVATAR_LIST.find((a) => a.id === user.avatarId) || AVATAR_LIST[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-[412px] bg-white dark:bg-stone-900 rounded-t-[32px] p-6 shadow-2xl border-t border-stone-200 dark:border-stone-800 flex flex-col items-center gap-5 animate-in slide-in-from-bottom duration-250"
      >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto" />

        {/* Header with Close */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatar.color} flex items-center justify-center text-white font-display text-2xl shadow-sm`}
            >
              {avatar.initial}
            </div>
            <div className="flex flex-col text-start">
              <span className="font-display text-lg text-stone-900 dark:text-stone-100">
                {user.name}
              </span>
              <div className="flex items-center gap-1 text-xs text-stone-500">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.city}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 w-full">
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700/60 flex flex-col items-center">
            <Trophy className="w-4 h-4 text-saffron mb-1" />
            <span className="font-display text-lg text-stone-900 dark:text-stone-100">
              {formatNumberByLang(user.bestScore, settings.language)}
            </span>
            <span className="text-[10px] text-stone-500">بهترین رکورد</span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700/60 flex flex-col items-center">
            <Flame className="w-4 h-4 text-pomegranate mb-1" />
            <span className="font-display text-lg text-stone-900 dark:text-stone-100">
              {toPersianDigits(user.streak)}
            </span>
            <span className="text-[10px] text-stone-500">روز پیاپی</span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700/60 flex flex-col items-center">
            <Award className="w-4 h-4 text-turquoise-deep dark:text-turquoise-tile mb-1" />
            <span className="font-display text-lg text-stone-900 dark:text-stone-100">
              {formatNumberByLang(user.totalPoints, settings.language)}
            </span>
            <span className="text-[10px] text-stone-500">مجموع امتیاز</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => {
            showToast(`درخواست رقابت برای ${user.name} ارسال شد!`);
            onClose();
          }}
          type="button"
          className="w-full py-3 rounded-2xl bg-turquoise-deep text-white font-medium text-sm hover:bg-teal-800 transition-colors shadow-xs"
        >
          دعوت به دوئل تمرینی
        </button>
      </div>
    </div>
  );
};
