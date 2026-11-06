import { AttemptResult, AnswerLog, FlaggedAttempt } from '../types';
import { calculateAttemptScore } from './scoring';

export interface SubmitAttemptResponse {
  success: boolean;
  status: 'valid' | 'flagged' | 'rejected';
  score: number;
  dailyRank?: number;
  reason?: string;
  flaggedRecord?: FlaggedAttempt;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class SimulatedApi {
  // Simulates 300 - 600ms network roundtrip
  private static async simulateLatency() {
    const delay = Math.floor(Math.random() * 300) + 300;
    await sleep(delay);
  }

  /**
   * Validates and submits an official attempt to the simulated server
   */
  static async submitDailyAttempt(
    attempt: AttemptResult,
    existingAttemptsToday: AttemptResult[]
  ): Promise<SubmitAttemptResponse> {
    await this.simulateLatency();

    // 1. One official attempt per day check
    if (!attempt.isPractice) {
      const alreadySubmitted = existingAttemptsToday.some(
        (a) => !a.isPractice && a.userId === attempt.userId && a.date === attempt.date
      );
      if (alreadySubmitted) {
        return {
          success: false,
          status: 'rejected',
          score: 0,
          reason: 'شما قبلاً در مسابقه رسمی امروز شرکت کرده‌اید (تنها یک تلاش در روز مجاز است).'
        };
      }
    }

    // 2. Score validation from raw answer logs
    const recalculated = calculateAttemptScore(
      attempt.answers,
      attempt.totalTimeSpentSeconds,
      false
    );

    // If client lied about raw score
    if (Math.abs(recalculated.finalScore - attempt.score) > 2) {
      return {
        success: false,
        status: 'rejected',
        score: recalculated.finalScore,
        reason: 'امتیاز ارسالی با ثبت پاسخ‌ها تطابق ندارد (خطای اعتبارسنجی سرور).'
      };
    }

    // 3. Anti-cheat checks (speed and unnatural human timing)
    let isFlagged = false;
    let flagReason = '';

    // Check if any answer was < 200ms or avg < 250ms
    if (attempt.answers.length > 0) {
      const superFastAnswers = attempt.answers.filter((a) => a.timeSpentMs < 220);
      const avgTime =
        attempt.answers.reduce((acc, a) => acc + a.timeSpentMs, 0) / attempt.answers.length;

      if (superFastAnswers.length >= 4 || avgTime < 300) {
        isFlagged = true;
        flagReason = `پاسخ‌دهی فراانسانی (میانگین زمان هر پاسخ ${Math.round(avgTime)} میلی‌ثانیه)`;
      } else if (attempt.totalTimeSpentSeconds < 16 && recalculated.correctCount >= 14) {
        isFlagged = true;
        flagReason = 'اتمام کل ۱۵ مرحله در کمتر از ۱۶ ثانیه با دقت حداکثری (مشکوک به ربات)';
      }
    }

    if (isFlagged) {
      const flaggedRecord: FlaggedAttempt = {
        id: `flg_${Date.now()}`,
        attemptId: attempt.id,
        userId: attempt.userId,
        userName: attempt.userName,
        score: attempt.score,
        timeSpentSeconds: attempt.totalTimeSpentSeconds,
        date: attempt.date,
        reason: flagReason,
        avgTimePerChallengeMs: Math.round(
          attempt.answers.length > 0
            ? attempt.answers.reduce((acc, a) => acc + a.timeSpentMs, 0) / attempt.answers.length
            : 0
        ),
        status: 'pending'
      };

      return {
        success: true,
        status: 'flagged',
        score: attempt.score,
        dailyRank: 18,
        reason: flagReason,
        flaggedRecord
      };
    }

    // Valid score - calculate simulated daily rank based on score
    let calculatedRank = 1;
    if (attempt.score >= 1550) calculatedRank = 1;
    else if (attempt.score >= 1500) calculatedRank = 2;
    else if (attempt.score >= 1450) calculatedRank = 4;
    else if (attempt.score >= 1400) calculatedRank = 8;
    else if (attempt.score >= 1300) calculatedRank = 14;
    else if (attempt.score >= 1200) calculatedRank = 21;
    else calculatedRank = 35;

    return {
      success: true,
      status: 'valid',
      score: attempt.score,
      dailyRank: calculatedRank
    };
  }
}
