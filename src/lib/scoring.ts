import { AnswerLog, LeaderboardEntry } from '../types';

export const TOTAL_CHALLENGES = 15;
export const TOTAL_TIME_SECONDS = 90;
export const POINTS_PER_CORRECT = 100;
export const MAX_SCORE = TOTAL_CHALLENGES * POINTS_PER_CORRECT + TOTAL_TIME_SECONDS; // 1,590

export interface ScoreCalculationResult {
  correctCount: number;
  totalChallenges: number;
  timeSpentSeconds: number;
  remainingSeconds: number;
  baseScore: number;
  speedBonus: number;
  finalScore: number;
  allAnswered: boolean;
  isTimedOut: boolean;
}

/**
 * Pure scoring calculation matching Tizbin specifications
 */
export function calculateAttemptScore(
  answers: AnswerLog[],
  totalTimeSpentSeconds: number,
  isTimedOut: boolean = false
): ScoreCalculationResult {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const baseScore = correctCount * POINTS_PER_CORRECT;

  const boundedTime = Math.min(TOTAL_TIME_SECONDS, Math.max(0, Math.round(totalTimeSpentSeconds)));
  const remainingSeconds = Math.max(0, TOTAL_TIME_SECONDS - boundedTime);

  // Speed bonus only applies if all 15 challenges were answered before clock expired
  const allAnswered = answers.length >= TOTAL_CHALLENGES && !isTimedOut;
  const speedBonus = allAnswered ? remainingSeconds : 0;

  const finalScore = Math.min(MAX_SCORE, baseScore + speedBonus);

  return {
    correctCount,
    totalChallenges: TOTAL_CHALLENGES,
    timeSpentSeconds: boundedTime,
    remainingSeconds,
    baseScore,
    speedBonus,
    finalScore,
    allAnswered,
    isTimedOut
  };
}

/**
 * Rank comparator for daily leaderboard
 * 1. Highest score (or most correct answers)
 * 2. Lower total time used
 * 3. Earlier completion timestamp
 */
export function compareDailyLeaderboard(
  a: { score: number; correctCount: number; timeSpentSeconds: number; completedAt?: string },
  b: { score: number; correctCount: number; timeSpentSeconds: number; completedAt?: string }
): number {
  if (b.score !== a.score) {
    return b.score - a.score;
  }
  if (b.correctCount !== a.correctCount) {
    return b.correctCount - a.correctCount;
  }
  if (a.timeSpentSeconds !== b.timeSpentSeconds) {
    return a.timeSpentSeconds - b.timeSpentSeconds; // lower is better
  }
  if (a.completedAt && b.completedAt) {
    return a.completedAt.localeCompare(b.completedAt);
  }
  return 0;
}

/**
 * Monthly calculation:
 * Takes all daily scores in the current month for a player and sums the BEST 15 scores.
 */
export function calculateMonthlyStanding(dailyScores: number[]): {
  monthlyScore: number;
  daysCounted: number;
  top15Scores: number[];
} {
  if (!dailyScores || dailyScores.length === 0) {
    return { monthlyScore: 0, daysCounted: 0, top15Scores: [] };
  }

  // Sort descending
  const sorted = [...dailyScores].sort((a, b) => b - a);
  const top15 = sorted.slice(0, 15);
  const monthlyScore = top15.reduce((acc, curr) => acc + curr, 0);

  return {
    monthlyScore,
    daysCounted: Math.min(15, dailyScores.length),
    top15Scores: top15
  };
}
