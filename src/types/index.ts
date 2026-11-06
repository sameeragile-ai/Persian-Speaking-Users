export type UserRole = 'player' | 'admin';

export type GameType =
  | 'find_different'
  | 'what_disappeared'
  | 'count_them'
  | 'same_or_different'
  | 'match_pair';

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  city: string;
  avatarId: string;
  referralCode: string;
  referredBy?: string;
  invitedCount: number;
  streak: number;
  totalPoints: number;
  bestScore: number;
  createdAt: string;
  status: 'active' | 'suspended';
}

export interface SVGItemConfig {
  id: string;
  nameKey: string;
  color?: string;
  rotation?: number;
  size?: number;
  variation?: number;
}

export interface ChallengePayload {
  hint: string;
  items?: SVGItemConfig[];
  targetItem?: SVGItemConfig;
  targetCount?: number;
  options?: any[];
  gridCols?: number;
  memoryDurationMs?: number;
  pairLeft?: SVGItemConfig;
  pairRight?: SVGItemConfig;
}

export interface Challenge {
  id: string;
  index: number;
  type: GameType;
  titleKey: string;
  hintKey: string;
  payload: ChallengePayload;
  correctAnswer: any;
}

export interface AnswerLog {
  challengeId: string;
  challengeIndex: number;
  gameType: GameType;
  userAnswer: any;
  correctAnswer: any;
  isCorrect: boolean;
  timeSpentMs: number;
}

export interface AttemptResult {
  id: string;
  userId: string;
  userName: string;
  userAvatarId: string;
  date: string; // YYYY-MM-DD
  isPractice: boolean;
  score: number;
  correctCount: number;
  totalChallenges: number;
  totalTimeSpentSeconds: number;
  speedBonus: number;
  answers: AnswerLog[];
  completedAt: string;
  deviceId: string;
  validationStatus: 'valid' | 'flagged' | 'voided';
  flagReason?: string;
  dailyRank?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  city: string;
  avatarId: string;
  score: number;
  correctCount: number;
  timeSpentSeconds: number;
  streak: number;
  isCurrentUser?: boolean;
  daysCounted?: number; // for monthly
  dailyScores?: number[]; // for monthly best 15
}

export interface PrizeRecord {
  id: string;
  month: string; // e.g. "آبان ۱۴۰۵"
  rank: number;
  winnerName: string;
  winnerCity: string;
  winnerPhone: string;
  score: number;
  amountToman: number;
  status: 'pending' | 'approved' | 'paid';
  notes: string;
}

export interface FlaggedAttempt {
  id: string;
  attemptId: string;
  userId: string;
  userName: string;
  score: number;
  timeSpentSeconds: number;
  date: string;
  reason: string;
  avgTimePerChallengeMs: number;
  status: 'pending' | 'approved' | 'voided';
}

export interface AppSettings {
  language: 'fa' | 'en';
  theme: 'light' | 'dark' | 'system';
  textSize: 'normal' | 'large' | 'xlarge';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reduceMotion: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'challenge' | 'rank' | 'social' | 'system';
  read: boolean;
  linkTab?: string;
}
