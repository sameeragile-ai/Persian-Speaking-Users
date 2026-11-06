import { UserProfile, LeaderboardEntry, PrizeRecord, FlaggedAttempt, AttemptResult } from '../types';

export const PERSIAN_CITIES = [
  'تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'اهواز',
  'قم', 'کرمانشاه', 'رشت', 'یزد', 'همدان', 'ارومیه', 'کابل', 'هرات'
];

export const PERSIAN_FIRST_NAMES = [
  'آرش', 'نیلوفر', 'پریسا', 'کوروش', 'شیرین', 'مهسا', 'بابک', 'رویا',
  'داریوش', 'یاسمن', 'سامان', 'فرشته', 'بهرام', 'سارا', 'کیوان', 'سپیده',
  'نوید', 'مینا', 'پویان', 'الناز', 'کامران', 'لیلا', 'شهاب', 'آزاده',
  'سهراب', 'تارا', 'امید', 'آتنا', 'فرهاد', 'شیدا', 'احسان', 'مریم',
  'پیمان', 'نگین', 'امیرعلی', 'بهاره', 'ماهان', 'زهرا', 'دانیال', 'هستی',
  'سینا', 'فاطمه', 'آرمین', 'عسل', 'رضا', 'طناز', 'میلاد', 'سیمین',
  'امیرحسین', 'گلناز', 'پرهام', 'روژین', 'مهراد', 'لاله', 'بردیا', 'سوگل',
  'افشین', 'حدیث', 'هومان', 'ستاره'
];

export const PERSIAN_LAST_NAMES = [
  'رستمی', 'طاهری', 'تهرانی', 'کریمی', 'افشار', 'حسینی', 'صالحی',
  'میرزایی', 'کاظمی', 'خسروی', 'بختیاری', 'صادقی', 'محمدی', 'انصاری',
  'موسوی', 'نوری', 'رحمانی', 'سلیمانی', 'یزدانی', 'اکبری'
];

export const AVATAR_LIST = [
  { id: 'av_1', name: 'سرو سبز', color: 'from-emerald-500 to-teal-700', initial: 'س' },
  { id: 'av_2', name: 'انار سرخ', color: 'from-rose-500 to-red-800', initial: 'ا' },
  { id: 'av_3', name: 'فیروزه کهن', color: 'from-cyan-500 to-teal-800', initial: 'ف' },
  { id: 'av_4', name: 'زعفران دانا', color: 'from-amber-400 to-amber-700', initial: 'ز' },
  { id: 'av_5', name: 'بلبل نغمه‌خوان', color: 'from-yellow-400 to-orange-600', initial: 'ب' },
  { id: 'av_6', name: 'سیمرغ پرتوان', color: 'from-indigo-500 to-purple-800', initial: 'س' },
  { id: 'av_7', name: 'ماه تابان', color: 'from-blue-400 to-slate-800', initial: 'م' },
  { id: 'av_8', name: 'خورشید خندان', color: 'from-orange-400 to-amber-600', initial: 'خ' },
  { id: 'av_9', name: 'نگین لاجورد', color: 'from-sky-500 to-blue-900', initial: 'ن' },
  { id: 'av_10', name: 'گل شاه‌عباسی', color: 'from-pink-500 to-rose-700', initial: 'گ' },
  { id: 'av_11', name: 'ماهی حوض', color: 'from-red-400 to-orange-600', initial: 'م' },
  { id: 'av_12', name: 'فانوس شب', color: 'from-amber-500 to-stone-800', initial: 'ف' }
];

// Generate 60 realistic players
export const SEED_PLAYERS: UserProfile[] = PERSIAN_FIRST_NAMES.map((firstName, i) => {
  const lastName = PERSIAN_LAST_NAMES[i % PERSIAN_LAST_NAMES.length];
  const city = PERSIAN_CITIES[i % PERSIAN_CITIES.length];
  const avatar = AVATAR_LIST[i % AVATAR_LIST.length];
  const phone = `۰۹${(120000000 + i * 13749).toString().slice(0, 9)}`;
  const streak = Math.max(1, (i * 7 + 3) % 28);
  const bestScore = 1100 + ((i * 37) % 470); // 1100 to 1570

  return {
    id: `usr_${i + 1}`,
    phone,
    name: `${firstName} ${lastName}`,
    city,
    avatarId: avatar.id,
    referralCode: `TIZ-${1000 + i}`,
    invitedCount: (i * 3) % 9,
    streak,
    totalPoints: (i + 1) * 980 + 3500,
    bestScore,
    createdAt: '1405-07-01',
    status: i === 13 ? 'suspended' : 'active'
  };
});

// Current active demo player (default)
export const DEFAULT_CURRENT_PLAYER: UserProfile = {
  id: 'usr_me',
  phone: '۰۹۱۲۳۴۵۶۷۸۹',
  name: 'آرش رستمی',
  city: 'تهران',
  avatarId: 'av_3',
  referralCode: 'TIZ-8821',
  invitedCount: 4,
  streak: 12,
  totalPoints: 14250,
  bestScore: 1475,
  createdAt: '1405-07-15',
  status: 'active'
};

// 30 days of daily competition date keys (e.g. recent dates)
export function getPast30DaysDates(): string[] {
  const dates: string[] = [];
  const base = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(base.getTime() - i * 24 * 60 * 60 * 1000);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export const PAST_30_DAYS = getPast30DaysDates();
export const TODAY_DATE_STR = PAST_30_DAYS[PAST_30_DAYS.length - 1];

// Generate realistic daily leaderboard for any date
export function generateDailyLeaderboardForDate(dateStr: string, currentScore?: number): LeaderboardEntry[] {
  // Deterministic seed based on date string
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed << 5) - seed + dateStr.charCodeAt(i);
    seed |= 0;
  }
  seed = Math.abs(seed);

  const entries: LeaderboardEntry[] = SEED_PLAYERS.slice(0, 50).map((player, idx) => {
    // Generate realistic score between 920 and 1580
    const varFactor = ((seed * (idx + 1) * 31) % 550);
    const score = 980 + varFactor; // 980 - 1530
    const correctCount = Math.min(15, Math.floor(score / 100));
    const timeSpentSeconds = Math.max(34, 90 - (score - correctCount * 100));

    return {
      rank: 0,
      userId: player.id,
      name: player.name,
      city: player.city,
      avatarId: player.avatarId,
      score,
      correctCount,
      timeSpentSeconds,
      streak: player.streak
    };
  });

  // If current player has played today
  if (currentScore !== undefined && currentScore > 0) {
    entries.push({
      rank: 0,
      userId: DEFAULT_CURRENT_PLAYER.id,
      name: DEFAULT_CURRENT_PLAYER.name,
      city: DEFAULT_CURRENT_PLAYER.city,
      avatarId: DEFAULT_CURRENT_PLAYER.avatarId,
      score: currentScore,
      correctCount: Math.min(15, Math.floor(currentScore / 100)),
      timeSpentSeconds: Math.max(30, 90 - (currentScore % 100)),
      streak: DEFAULT_CURRENT_PLAYER.streak,
      isCurrentUser: true
    });
  }

  // Sort: score desc, time asc
  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSpentSeconds - b.timeSpentSeconds;
  });

  // Assign ranks
  entries.forEach((e, i) => {
    e.rank = i + 1;
  });

  return entries;
}

// Generate monthly leaderboard (sum of best 15 days)
export function generateMonthlyLeaderboard(): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = SEED_PLAYERS.slice(0, 45).map((player, idx) => {
    const daysCounted = Math.min(15, 10 + (idx % 6));
    const baseDaily = 1150 + ((idx * 47) % 350);
    const dailyScores: number[] = [];
    for (let d = 0; d < daysCounted; d++) {
      dailyScores.push(baseDaily + ((d * 19) % 70));
    }
    const totalScore = dailyScores.reduce((a, b) => a + b, 0);

    return {
      rank: 0,
      userId: player.id,
      name: player.name,
      city: player.city,
      avatarId: player.avatarId,
      score: totalScore,
      correctCount: daysCounted * 14,
      timeSpentSeconds: Math.round(daysCounted * 52),
      streak: player.streak,
      daysCounted,
      dailyScores
    };
  });

  // Add current player
  const myDaysCounted = 14;
  const myScores = [1350, 1420, 1280, 1460, 1310, 1390, 1475, 1240, 1380, 1410, 1330, 1450, 1290, 1400];
  const myTotal = myScores.reduce((a, b) => a + b, 0);

  entries.push({
    rank: 0,
    userId: DEFAULT_CURRENT_PLAYER.id,
    name: DEFAULT_CURRENT_PLAYER.name,
    city: DEFAULT_CURRENT_PLAYER.city,
    avatarId: DEFAULT_CURRENT_PLAYER.avatarId,
    score: myTotal,
    correctCount: myDaysCounted * 14,
    timeSpentSeconds: myDaysCounted * 48,
    streak: DEFAULT_CURRENT_PLAYER.streak,
    daysCounted: myDaysCounted,
    dailyScores: myScores,
    isCurrentUser: true
  });

  entries.sort((a, b) => b.score - a.score);
  entries.forEach((e, i) => {
    e.rank = i + 1;
  });

  return entries;
}

// 30 days of player history
export function generateUserHistory(): AttemptResult[] {
  const results: AttemptResult[] = [];
  const dates = getPast30DaysDates().slice(0, 24); // 24 days played

  dates.forEach((date, i) => {
    const correctCount = 12 + (i % 4); // 12, 13, 14, 15
    const timeSpent = 45 + (i * 3) % 35; // 45 to 80s
    const speedBonus = 90 - timeSpent;
    const score = correctCount * 100 + speedBonus;

    results.push({
      id: `att_hist_${i}`,
      userId: DEFAULT_CURRENT_PLAYER.id,
      userName: DEFAULT_CURRENT_PLAYER.name,
      userAvatarId: DEFAULT_CURRENT_PLAYER.avatarId,
      date,
      isPractice: false,
      score,
      correctCount,
      totalChallenges: 15,
      totalTimeSpentSeconds: timeSpent,
      speedBonus,
      answers: [],
      completedAt: `${date}T19:30:00Z`,
      deviceId: 'dev_iphone_15_fa',
      validationStatus: 'valid',
      dailyRank: 4 + ((i * 7) % 19)
    });
  });

  return results.reverse();
}

// 5 Flagged attempts for anti-cheat demo
export const SEED_FLAGGED_ATTEMPTS: FlaggedAttempt[] = [
  {
    id: 'flg_1',
    attemptId: 'att_sus_101',
    userId: 'usr_24',
    userName: 'شهاب تهرانی',
    score: 1588,
    timeSpentSeconds: 14,
    date: TODAY_DATE_STR,
    reason: 'پاسخ‌دهی فراانسانی (میانگین زمان هر پاسخ کمتر از ۱۸۰ میلی‌ثانیه)',
    avgTimePerChallengeMs: 165,
    status: 'pending'
  },
  {
    id: 'flg_2',
    attemptId: 'att_sus_102',
    userId: 'usr_39',
    userName: 'دانیال کاظمی',
    score: 1570,
    timeSpentSeconds: 22,
    date: TODAY_DATE_STR,
    reason: 'عدم تطابق چک‌سام پاسخ‌ها با زمان فعال صفحه',
    avgTimePerChallengeMs: 220,
    status: 'pending'
  },
  {
    id: 'flg_3',
    attemptId: 'att_sus_103',
    userId: 'usr_12',
    userName: 'فرشته افشار',
    score: 1520,
    timeSpentSeconds: 38,
    date: PAST_30_DAYS[PAST_30_DAYS.length - 2],
    reason: 'تلاش دوم با همان شناسه سخت‌افزاری دستگاه (Device ID)',
    avgTimePerChallengeMs: 410,
    status: 'voided'
  },
  {
    id: 'flg_4',
    attemptId: 'att_sus_104',
    userId: 'usr_48',
    userName: 'سیمین صادقی',
    score: 1490,
    timeSpentSeconds: 44,
    date: PAST_30_DAYS[PAST_30_DAYS.length - 3],
    reason: 'دعوت به خود (Self-Referral) از همان محدوده آی‌پی',
    avgTimePerChallengeMs: 510,
    status: 'approved'
  },
  {
    id: 'flg_5',
    attemptId: 'att_sus_105',
    userId: 'usr_55',
    userName: 'سوگل بختیاری',
    score: 1590,
    timeSpentSeconds: 18,
    date: PAST_30_DAYS[PAST_30_DAYS.length - 4],
    reason: 'ثبت بالاترین امتیاز تئوری در کمتر از ۲۰ ثانیه (ربات تلگرام)',
    avgTimePerChallengeMs: 140,
    status: 'voided'
  }
];

// Month of prize records (Admin screen)
export const SEED_PRIZE_RECORDS: PrizeRecord[] = [
  {
    id: 'prz_1',
    month: 'آبان ۱۴۰۵',
    rank: 1,
    winnerName: 'نیلوفر طاهری',
    winnerCity: 'مشهد',
    winnerPhone: '۰۹۱۵۱۲۳۴۵۶۷',
    score: 22890,
    amountToman: 15000000,
    status: 'paid',
    notes: 'واریز دستی به شماره شبای بانک ملت در تاریخ ۱۰ آبان'
  },
  {
    id: 'prz_2',
    month: 'آبان ۱۴۰۵',
    rank: 2,
    winnerName: 'پریسا خسروی',
    winnerCity: 'اصفهان',
    winnerPhone: '۰۹۱۳۴۵۶۷۸۹۰',
    score: 22640,
    amountToman: 10000000,
    status: 'paid',
    notes: 'واریز دستی به شماره شبای بانک سامان'
  },
  {
    id: 'prz_3',
    month: 'آبان ۱۴۰۵',
    rank: 3,
    winnerName: 'کوروش تهرانی',
    winnerCity: 'تهران',
    winnerPhone: '۰۹۱۲۹۸۷۶۵۴۳',
    score: 22350,
    amountToman: 5000000,
    status: 'approved',
    notes: 'شماره کارت دریافت شد، منتظر تأیید حسابداری'
  },
  {
    id: 'prz_4',
    month: 'آبان ۱۴۰۵',
    rank: 4,
    winnerName: 'سامان یزدانی',
    winnerCity: 'شیراز',
    winnerPhone: '۰۹۱۷۳۴۵۶۷۱۲',
    score: 21980,
    amountToman: 2000000,
    status: 'pending',
    notes: 'در انتظار پاسخ به پیامک احراز هویت'
  },
  {
    id: 'prz_5',
    month: 'آبان ۱۴۰۵',
    rank: 5,
    winnerName: 'یاسمن انصاری',
    winnerCity: 'تبریز',
    winnerPhone: '۰۹۱۴۷۶۵۴۳۲۱',
    score: 21760,
    amountToman: 1000000,
    status: 'pending',
    notes: 'پیامک اطلاع‌رسانی ارسال شد'
  }
];
