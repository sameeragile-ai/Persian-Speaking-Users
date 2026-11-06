import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TopBar } from '../../components/common/TopBar';
import { toPersianDigits, formatNumberByLang } from '../../i18n';
import { AlertTriangle, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';

export const AdminFlagsScreen: React.FC = () => {
  const { flaggedAttempts, approveFlag, voidFlag, settings, showToast } = useAppStore();

  const handleApprove = (id: string) => {
    approveFlag(id);
    showToast('رکورد کاربر تأیید شد و امتیاز معتبر اعلام گردید.');
  };

  const handleVoid = (id: string) => {
    voidFlag(id);
    showToast('رکورد باطل شد و از جدول حذف گردید.');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 overflow-hidden">
      <TopBar title="گزارش موارد مشکوک و تقلب" />

      <div className="p-3 max-w-[412px] mx-auto w-full shrink-0">
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            سیستم ضدتقلب تلاش‌های زیر ۲۵۰ میلی‌ثانیه یا الگوهای رباتیک را علامت‌گذاری می‌کند.
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-3 max-w-[412px] mx-auto w-full pb-24 flex flex-col gap-3">
        {flaggedAttempts.map((flag) => {
          const isPending = flag.status === 'pending';
          const isApproved = flag.status === 'approved';
          const isVoided = flag.status === 'voided';

          return (
            <div
              key={flag.id}
              className={`p-4 rounded-3xl bg-white dark:bg-stone-800 border shadow-xs flex flex-col gap-2.5 ${
                isPending
                  ? 'border-pomegranate/50 ring-2 ring-pomegranate/10'
                  : 'border-stone-200 dark:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                    {flag.userName}
                  </span>
                  <span className="text-[10px] text-stone-400">{flag.date}</span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPending
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      : isApproved
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-100 text-pomegranate dark:bg-rose-900/60'
                  }`}
                >
                  {isPending ? 'نیازمند بررسی' : isApproved ? 'تأیید شده' : 'باطل شده'}
                </span>
              </div>

              {/* Reason Box */}
              <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 text-xs text-pomegranate leading-relaxed font-medium">
                {flag.reason}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span>امتیاز: <strong className="text-saffron font-display text-sm">{formatNumberByLang(flag.score, settings.language)}</strong></span>
                <span>زمان کل: {toPersianDigits(flag.timeSpentSeconds)} ثانیه</span>
                <span>میانگین چالش: {toPersianDigits(flag.avgTimePerChallengeMs)}ms</span>
              </div>

              {/* Action Buttons if pending */}
              {isPending && (
                <div className="flex items-center gap-2 pt-1 border-t border-stone-100 dark:border-stone-700 mt-1">
                  <button
                    onClick={() => handleApprove(flag.id)}
                    type="button"
                    className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1 hover:bg-emerald-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تأیید رکورد</span>
                  </button>

                  <button
                    onClick={() => handleVoid(flag.id)}
                    type="button"
                    className="flex-1 py-2 rounded-xl bg-rose-50 text-pomegranate dark:bg-rose-950/50 text-xs font-bold flex items-center justify-center gap-1 hover:bg-rose-100"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>ابطال رکورد</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
