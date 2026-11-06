import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TopBar } from '../../components/common/TopBar';
import { toPersianDigits, formatNumberByLang } from '../../i18n';
import { MedalBadge } from '../../components/common/MedalBadge';
import { AlertCircle, Gift, Check, Clock, ShieldAlert } from 'lucide-react';

export const AdminPrizesScreen: React.FC = () => {
  const { prizeRecords, updatePrizeStatus, settings, showToast } = useAppStore();

  const handleStatusChange = (
    id: string,
    nextStatus: 'pending' | 'approved' | 'paid'
  ) => {
    updatePrizeStatus(id, nextStatus);
    showToast(`وضعیت جایزه به "${nextStatus === 'paid' ? 'پرداخت دستی انجام شد' : nextStatus === 'approved' ? 'تأیید شده' : 'در انتظار'}" تغییر یافت.`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 overflow-hidden">
      <TopBar title="دفتر ثبت جوایز ماهانه" />

      {/* Mandatory Compliance Banner */}
      <div className="p-3 max-w-[412px] mx-auto w-full shrink-0">
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex flex-col text-start">
            <span className="font-bold">ثبت دستی و دفتری جوایز:</span>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
              پرداخت خودکار تا زمان اخذ کامل مجوزهای قانونی و احراز هویت بانکی غیرفعال است (تمام موارد صرفاً به صورت دفتری و دستی تسویه می‌شوند).
            </p>
          </div>
        </div>
      </div>

      {/* Prize Ledger List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 max-w-[412px] mx-auto w-full pb-24 flex flex-col gap-3">
        {prizeRecords.map((record) => {
          return (
            <div
              key={record.id}
              className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MedalBadge rank={record.rank} size="sm" />
                  <div className="flex flex-col text-start">
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                      {record.winnerName}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {record.winnerCity} · {record.winnerPhone}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-display text-base text-emerald-600 dark:text-emerald-400 font-bold">
                    {formatNumberByLang(record.amountToman, settings.language)} تومان
                  </span>
                  <span className="text-[9px] text-stone-400">مجموع: {toPersianDigits(record.score)} امتیاز</span>
                </div>
              </div>

              {/* Notes */}
              <div className="text-[11px] text-stone-500 bg-stone-50 dark:bg-stone-700/40 p-2.5 rounded-xl text-start">
                {record.notes}
              </div>

              {/* Status Switcher segmented buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-700">
                <span className="text-[10px] text-stone-400 font-medium">وضعیت تسویه:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStatusChange(record.id, 'pending')}
                    type="button"
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      record.status === 'pending'
                        ? 'bg-amber-100 text-amber-900 shadow-xs'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    در انتظار
                  </button>

                  <button
                    onClick={() => handleStatusChange(record.id, 'approved')}
                    type="button"
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      record.status === 'approved'
                        ? 'bg-blue-100 text-blue-900 shadow-xs'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    تأیید شد
                  </button>

                  <button
                    onClick={() => handleStatusChange(record.id, 'paid')}
                    type="button"
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      record.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-900 shadow-xs'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    واریز دستی شد ✓
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
