import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Home,
  Trophy,
  Play,
  Calendar,
  User,
  LayoutDashboard,
  Users,
  CheckCircle2,
  AlertTriangle,
  Gift
} from 'lucide-react';
import { sounds } from '../../lib/audio';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, role } = useAppStore();

  const handleTabClick = (tabKey: string) => {
    sounds.playTap();
    setActiveTab(tabKey);
  };

  if (role === 'admin') {
    // Admin 5 tabs: overview, users, scores, flags, prizes
    const adminTabs = [
      { key: 'admin_overview', label: 'داشبورد', icon: LayoutDashboard },
      { key: 'admin_users', label: 'کاربران', icon: Users },
      { key: 'admin_scores', label: 'امتیازات', icon: CheckCircle2 },
      { key: 'admin_flags', label: 'تخلفات', icon: AlertTriangle },
      { key: 'admin_prizes', label: 'جوایز', icon: Gift }
    ];

    return (
      <div className="fixed bottom-3 inset-x-3 z-40 max-w-[390px] mx-auto">
        <nav
          className="h-16 rounded-3xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200/80 dark:border-stone-800/80 shadow-lg px-2 flex items-center justify-around"
          aria-label="منوی مدیریت"
        >
          {adminTabs.map((t) => {
            const isActive = activeTab === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => handleTabClick(t.key)}
                type="button"
                className={`flex flex-col items-center justify-center min-w-[56px] h-12 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-turquoise-deep dark:text-turquoise-tile font-bold'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] mt-1 leading-none">{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // Player 5 tabs: Home, Leaderboard, Play (Center Raised), History, Profile
  return (
    <div className="fixed bottom-3 inset-x-3 z-40 max-w-[390px] mx-auto select-none pointer-events-auto">
      <nav
        className="h-16 rounded-3xl bg-white/92 dark:bg-stone-900/92 backdrop-blur-md border border-stone-200/80 dark:border-stone-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-2 flex items-center justify-between relative"
        aria-label="منوی اصلی برنامه"
      >
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabClick('home')}
          type="button"
          className={`flex-1 flex flex-col items-center justify-center h-12 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-turquoise-deep dark:text-turquoise-tile font-bold scale-105'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-700'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 leading-none">خانه</span>
        </button>

        {/* Tab 2: Leaderboard */}
        <button
          onClick={() => handleTabClick('leaderboard')}
          type="button"
          className={`flex-1 flex flex-col items-center justify-center h-12 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'text-turquoise-deep dark:text-turquoise-tile font-bold scale-105'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-700'
          }`}
        >
          <Trophy className={`w-5 h-5 ${activeTab === 'leaderboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 leading-none">رتبه‌ها</span>
        </button>

        {/* Tab 3: CENTER RAISED PLAY BUTTON (Saffron) */}
        <div className="relative -top-4 px-2">
          <button
            onClick={() => handleTabClick('play')}
            type="button"
            className="w-14 h-14 rounded-full bg-saffron text-stone-950 flex flex-col items-center justify-center shadow-lg shadow-saffron/40 hover:scale-105 active:scale-95 transition-transform border-4 border-[#FBF7EF] dark:border-[#0F1A1C] cursor-pointer"
            aria-label="شروع بازی"
          >
            <Play className="w-6 h-6 fill-stone-950 ps-0.5" />
          </button>
          <span className="block text-center text-[10px] font-bold text-saffron mt-0.5">بازی</span>
        </div>

        {/* Tab 4: History */}
        <button
          onClick={() => handleTabClick('history')}
          type="button"
          className={`flex-1 flex flex-col items-center justify-center h-12 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'text-turquoise-deep dark:text-turquoise-tile font-bold scale-105'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-700'
          }`}
        >
          <Calendar className={`w-5 h-5 ${activeTab === 'history' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 leading-none">سابقه</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => handleTabClick('profile')}
          type="button"
          className={`flex-1 flex flex-col items-center justify-center h-12 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'text-turquoise-deep dark:text-turquoise-tile font-bold scale-105'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-700'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 leading-none">پروفایل</span>
        </button>
      </nav>
    </div>
  );
};
