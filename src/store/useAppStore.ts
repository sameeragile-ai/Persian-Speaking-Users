import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  UserProfile,
  UserRole,
  AppSettings,
  AttemptResult,
  FlaggedAttempt,
  PrizeRecord,
  NotificationItem
} from '../types';
import {
  DEFAULT_CURRENT_PLAYER,
  SEED_FLAGGED_ATTEMPTS,
  SEED_PRIZE_RECORDS,
  generateUserHistory,
  TODAY_DATE_STR
} from '../data/seed';
import { SimulatedApi } from '../lib/api';
import { sounds } from '../lib/audio';

interface AppState {
  // Auth & Profile
  user: UserProfile;
  role: UserRole;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;

  // Navigation & View
  activeTab: string;
  isOffline: boolean;
  isSyncingOffline: boolean;
  offlineQueue: AttemptResult[];

  // Settings
  settings: AppSettings;

  // Games & History
  todayAttempt: AttemptResult | null;
  history: AttemptResult[];
  lastCompletedResult: AttemptResult | null;
  practiceCount: number;

  // Admin Data
  flaggedAttempts: FlaggedAttempt[];
  prizeRecords: PrizeRecord[];

  // UI States
  selectedUserPreview: UserProfile | null;
  shareModalAttempt: AttemptResult | null;
  demoPanelOpen: boolean;
  notifications: NotificationItem[];
  activeToast: string | null;

  // Actions
  setRole: (role: UserRole) => void;
  setActiveTab: (tab: string) => void;
  setLanguage: (lang: 'fa' | 'en') => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setReduceMotion: (reduce: boolean) => void;
  
  toggleOffline: () => void;
  recordAttempt: (attempt: AttemptResult) => Promise<{ status: string; rank?: number; reason?: string }>;
  syncOfflineQueue: () => Promise<void>;
  
  setSelectedUserPreview: (user: UserProfile | null) => void;
  setShareModalAttempt: (attempt: AttemptResult | null) => void;
  setDemoPanelOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
  
  // Push Notifications
  addNotification: (item: NotificationItem) => void;
  markNotificationRead: (id: string) => void;
  triggerDemoNotification: (type?: 'challenge' | 'rank' | 'social') => void;

  // Admin Actions
  approveFlag: (flagId: string) => void;
  voidFlag: (flagId: string) => void;
  updatePrizeStatus: (prizeId: string, status: 'pending' | 'approved' | 'paid') => void;

  // Demo Controls
  resetTodayAttempt: () => void;
  simulateAlreadyPlayed: () => void;
  submitSuspiciousScoreDemo: () => Promise<void>;
  jumpToEndOfMonth: () => void;
  resetDemoData: () => void;
  
  // Auth Actions
  loginDemo: (phone?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_CURRENT_PLAYER,
      role: 'player',
      isAuthenticated: true,
      hasCompletedOnboarding: true,

      activeTab: 'home',
      isOffline: false,
      isSyncingOffline: false,
      offlineQueue: [],

      settings: {
        language: 'fa',
        theme: 'light',
        textSize: 'normal',
        soundEnabled: true,
        hapticsEnabled: true,
        reduceMotion: false
      },

      todayAttempt: null,
      history: generateUserHistory(),
      lastCompletedResult: null,
      practiceCount: 0,

      flaggedAttempts: SEED_FLAGGED_ATTEMPTS,
      prizeRecords: SEED_PRIZE_RECORDS,

      selectedUserPreview: null,
      shareModalAttempt: null,
      demoPanelOpen: false,
      activeToast: null,

      notifications: [
        {
          id: 'n_1',
          title: 'مسابقه روزانه آماده است!',
          message: 'چالش ۹۰ ثانیه‌ای امروز با انار و کاشی‌های فیروزه منتظر شماست.',
          time: '۱۰ دقیقه پیش',
          type: 'challenge',
          read: false,
          linkTab: 'home'
        },
        {
          id: 'n_2',
          title: 'صعود در جدول رده‌بندی',
          message: 'شما به جمع ۵۰ تیزبین برتر ماه پیوستید!',
          time: 'دیروز',
          type: 'rank',
          read: true,
          linkTab: 'leaderboard'
        }
      ],

      setRole: (role) => {
        set({
          role,
          activeTab: role === 'admin' ? 'admin_overview' : 'home'
        });
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      setLanguage: (language) => {
        set((state) => ({
          settings: { ...state.settings, language }
        }));
        if (typeof document !== 'undefined') {
          document.documentElement.lang = language;
          document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
        }
      },

      setTheme: (theme) => {
        set((state) => ({
          settings: { ...state.settings, theme }
        }));
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
          } else {
            // system
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', isDark);
          }
        }
      },

      setTextSize: (textSize) =>
        set((state) => ({
          settings: { ...state.settings, textSize }
        })),

      setSoundEnabled: (soundEnabled) => {
        sounds.enabled = soundEnabled;
        set((state) => ({
          settings: { ...state.settings, soundEnabled }
        }));
      },

      setHapticsEnabled: (hapticsEnabled) =>
        set((state) => ({
          settings: { ...state.settings, hapticsEnabled }
        })),

      setReduceMotion: (reduceMotion) =>
        set((state) => ({
          settings: { ...state.settings, reduceMotion }
        })),

      toggleOffline: () => {
        const nextOffline = !get().isOffline;
        set({ isOffline: nextOffline });
        if (!nextOffline && get().offlineQueue.length > 0) {
          get().syncOfflineQueue();
        }
      },

      recordAttempt: async (attempt) => {
        const state = get();
        if (attempt.isPractice) {
          set((s) => ({
            practiceCount: s.practiceCount + 1,
            lastCompletedResult: attempt
          }));
          return { status: 'practice_complete' };
        }

        // If currently offline, queue it!
        if (state.isOffline) {
          set((s) => ({
            offlineQueue: [...s.offlineQueue, attempt],
            todayAttempt: attempt,
            lastCompletedResult: attempt,
            history: [attempt, ...s.history]
          }));
          return { status: 'offline_saved' };
        }

        // Online: call simulated server
        const resp = await SimulatedApi.submitDailyAttempt(attempt, state.history);

        const updatedAttempt = {
          ...attempt,
          dailyRank: resp.dailyRank || 24,
          validationStatus: resp.status === 'valid' ? ('valid' as const) : ('flagged' as const),
          flagReason: resp.reason
        };

        set((s) => {
          const newFlagged = resp.flaggedRecord
            ? [resp.flaggedRecord, ...s.flaggedAttempts]
            : s.flaggedAttempts;

          // Update user points and streak
          const newTotalPoints = s.user.totalPoints + updatedAttempt.score;
          const newBest = Math.max(s.user.bestScore, updatedAttempt.score);
          const newStreak = s.user.streak + 1;

          return {
            todayAttempt: updatedAttempt,
            lastCompletedResult: updatedAttempt,
            history: [updatedAttempt, ...s.history],
            flaggedAttempts: newFlagged,
            user: {
              ...s.user,
              totalPoints: newTotalPoints,
              bestScore: newBest,
              streak: newStreak
            }
          };
        });

        return {
          status: resp.status,
          rank: resp.dailyRank,
          reason: resp.reason
        };
      },

      syncOfflineQueue: async () => {
        const { offlineQueue } = get();
        if (offlineQueue.length === 0) return;

        set({ isSyncingOffline: true });
        for (const item of offlineQueue) {
          await SimulatedApi.submitDailyAttempt(item, []);
        }
        set({
          offlineQueue: [],
          isSyncingOffline: false,
          activeToast: 'امتیازات ذخیره‌شده با موفقیت در سرور ثبت شدند!'
        });
      },

      setSelectedUserPreview: (user) => set({ selectedUserPreview: user }),
      setShareModalAttempt: (attempt) => set({ shareModalAttempt: attempt }),
      setDemoPanelOpen: (open) => set({ demoPanelOpen: open }),

      showToast: (msg) => {
        set({ activeToast: msg });
        setTimeout(() => {
          if (get().activeToast === msg) {
            set({ activeToast: null });
          }
        }, 3200);
      },

      clearToast: () => set({ activeToast: null }),

      addNotification: (item) =>
        set((s) => ({
          notifications: [item, ...s.notifications]
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        })),

      triggerDemoNotification: (type = 'challenge') => {
        let notif: NotificationItem;
        if (type === 'challenge') {
          notif = {
            id: `notif_${Date.now()}`,
            title: 'مسابقه روزانه فعال شد!',
            message: '۱۵ چالش جدید امروز برای سنجش تیزبینی در دسترس است.',
            time: 'هم‌اکنون',
            type: 'challenge',
            read: false,
            linkTab: 'home'
          };
        } else if (type === 'rank') {
          notif = {
            id: `notif_${Date.now()}`,
            title: 'تغییر رتبه در جدول تیزبین‌ها',
            message: 'آرش، شما با عملکرد امروزتان به رتبه ۱۲ صعود کردید!',
            time: 'هم‌اکنون',
            type: 'rank',
            read: false,
            linkTab: 'leaderboard'
          };
        } else {
          notif = {
            id: `notif_${Date.now()}`,
            title: 'رقابت دوستانه',
            message: 'نیلوفر رکورد دیروز شما را شکست! آیا می‌توانید دوباره پیشی بگیرید؟',
            time: 'هم‌اکنون',
            type: 'social',
            read: false,
            linkTab: 'leaderboard'
          };
        }
        get().addNotification(notif);
        get().showToast(notif.title);
      },

      approveFlag: (flagId) =>
        set((s) => ({
          flaggedAttempts: s.flaggedAttempts.map((f) =>
            f.id === flagId ? { ...f, status: 'approved' } : f
          )
        })),

      voidFlag: (flagId) =>
        set((s) => ({
          flaggedAttempts: s.flaggedAttempts.map((f) =>
            f.id === flagId ? { ...f, status: 'voided' } : f
          )
        })),

      updatePrizeStatus: (prizeId, status) =>
        set((s) => ({
          prizeRecords: s.prizeRecords.map((p) =>
            p.id === prizeId ? { ...p, status } : p
          )
        })),

      resetTodayAttempt: () =>
        set({
          todayAttempt: null,
          lastCompletedResult: null
        }),

      simulateAlreadyPlayed: () => {
        const dummyAttempt: AttemptResult = {
          id: `att_sim_${Date.now()}`,
          userId: get().user.id,
          userName: get().user.name,
          userAvatarId: get().user.avatarId,
          date: TODAY_DATE_STR,
          isPractice: false,
          score: 1395,
          correctCount: 14,
          totalChallenges: 15,
          totalTimeSpentSeconds: 55,
          speedBonus: 35,
          answers: [],
          completedAt: new Date().toISOString(),
          deviceId: 'dev_iphone_15_fa',
          validationStatus: 'valid',
          dailyRank: 9
        };
        set({
          todayAttempt: dummyAttempt,
          lastCompletedResult: dummyAttempt
        });
      },

      submitSuspiciousScoreDemo: async () => {
        const susAttempt: AttemptResult = {
          id: `att_sus_bot_${Date.now()}`,
          userId: get().user.id,
          userName: get().user.name,
          userAvatarId: get().user.avatarId,
          date: TODAY_DATE_STR,
          isPractice: false,
          score: 1590,
          correctCount: 15,
          totalChallenges: 15,
          totalTimeSpentSeconds: 12,
          speedBonus: 90,
          answers: Array.from({ length: 15 }, (_, i) => ({
            challengeId: `c_${i}`,
            challengeIndex: i + 1,
            gameType: 'find_different',
            userAnswer: 1,
            correctAnswer: 1,
            isCorrect: true,
            timeSpentMs: 140
          })),
          completedAt: new Date().toISOString(),
          deviceId: 'dev_auto_bot_x',
          validationStatus: 'flagged'
        };

        await get().recordAttempt(susAttempt);
        get().showToast('تلاش مشکوک با موفقیت به بخش بررسی تخلفات (Admin Flags) فرستاده شد!');
      },

      jumpToEndOfMonth: () => {
        set({
          activeTab: 'leaderboard'
        });
        get().showToast('نمایش برندگان انتهای ماه با احتساب ۱۵ روز برتر!');
      },

      resetDemoData: () => {
        set({
          user: DEFAULT_CURRENT_PLAYER,
          todayAttempt: null,
          lastCompletedResult: null,
          history: generateUserHistory(),
          flaggedAttempts: SEED_FLAGGED_ATTEMPTS,
          prizeRecords: SEED_PRIZE_RECORDS,
          offlineQueue: [],
          practiceCount: 0
        });
        get().showToast('داده‌های نمونه مجدداً بارگذاری شدند.');
      },

      loginDemo: (phone = '۰۹۱۲۳۴۵۶۷۸۹') =>
        set((s) => ({
          isAuthenticated: true,
          hasCompletedOnboarding: true,
          user: { ...s.user, phone }
        })),

      logout: () =>
        set({
          isAuthenticated: false,
          hasCompletedOnboarding: false
        }),

      updateProfile: (updates) =>
        set((s) => ({
          user: { ...s.user, ...updates }
        }))
    }),
    {
      name: 'tizbin-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        settings: state.settings,
        todayAttempt: state.todayAttempt,
        history: state.history,
        offlineQueue: state.offlineQueue,
        practiceCount: state.practiceCount
      })
    }
  )
);
