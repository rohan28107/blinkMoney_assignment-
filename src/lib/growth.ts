import type { Contribution } from '@/src/types/models';

/** Matches BlinkMoney's real pitch: ~15% p.a., diversified. */
export const ANNUAL_GROWTH_RATE = 0.15;

/**
 * 1 real second ≈ 1 simulated day, so the "Grown" figure visibly ticks up rupee
 * by rupee while someone is watching the screen live. Real 15% p.a. on a small
 * contribution over a few live minutes would otherwise round to a few paise —
 * technically correct but invisible, which defeats the point of showing it.
 */
const REAL_MS_PER_SIMULATED_DAY = 1_000;

function simulatedDaysElapsed(sinceIso: string, nowMs: number): number {
  const realMs = nowMs - new Date(sinceIso).getTime();
  return Math.max(0, realMs / REAL_MS_PER_SIMULATED_DAY);
}

/**
 * Growth is a pure function of (amount, elapsed time) — never stored — so it
 * stays correct across app restarts and recomputes live on every render.
 */
export function growthForContribution(contribution: Contribution, nowMs: number): number {
  const days = simulatedDaysElapsed(contribution.createdAt, nowMs);
  return contribution.amount * ANNUAL_GROWTH_RATE * (days / 365);
}

export function totalGrownAmount(contributions: Contribution[], nowMs: number): number {
  return contributions.reduce((sum, c) => sum + growthForContribution(c, nowMs), 0);
}
