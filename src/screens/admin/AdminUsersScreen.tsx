import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TopBar } from '../../components/common/TopBar';
import { SEED_PLAYERS, AVATAR_LIST } from '../../data/seed';
import { toPersianDigits, formatNumberByLang } from '../../i18n';
import { Search, ShieldAlert, ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { UserProfile } from '../../types';

export const AdminUsersScreen: React.FC = () => {
  const { setSelectedUserPreview, showToast } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [usersList, setUsersList] = useState<UserProfile[]>(SEED_PLAYERS);

  const filtered = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm)
  );

  const toggleSuspend = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          showToast(`وضعیت کاربر به ${nextStatus === 'active' ? 'فعال' : 'معلق'} تغییر یافت.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF7EF] dark:bg-[#0F1A1C] text-stone-900 dark:text-stone-100 overflow-hidden">
      <TopBar title="مدیریت کاربران" />

      {/* Search Header */}
      <div className="p-3 max-w-[412px] mx-auto w-full shrink-0">
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو بر اساس نام، شهر یا شماره..."
            className="w-full bg-transparent text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 max-w-[412px] mx-auto w-full pb-24 flex flex-col gap-2">
        {filtered.map((player) => {
          const avatar = AVATAR_LIST.find((a) => a.id === player.avatarId) || AVATAR_LIST[0];
          const isSuspended = player.status === 'suspended';

          return (
            <div
              key={player.id}
              onClick={() => setSelectedUserPreview(player)}
              className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between shadow-xs hover:border-turquoise-deep transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatar.color} text-white font-display text-sm flex items-center justify-center`}
                >
                  {avatar.initial}
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <span>{player.name}</span>
                    {isSuspended && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-rose-100 text-pomegranate">
                        معلق
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {player.city} · {player.phone}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => toggleSuspend(player.id, e)}
                  type="button"
                  className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                    isSuspended
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-rose-50 text-pomegranate hover:bg-rose-100'
                  }`}
                  title={isSuspended ? 'فعال‌سازی مجدد' : 'تعلیق حساب'}
                >
                  {isSuspended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
