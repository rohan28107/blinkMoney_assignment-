import type { VaultProgress } from '@/src/types/models';

/** Converts raw amounts into ring-fill percentages, capping the visual ring at 100%
 * even when the vault has overshot its target (the actual percent/amount is still
 * shown as text — only the ring geometry clamps). */
export function toRingPercents(progress: VaultProgress): { savedPercent: number; grownPercent: number } {
  if (progress.targetAmount <= 0) return { savedPercent: 0, grownPercent: 0 };
  const savedPercent = Math.min(100, (progress.savedAmount / progress.targetAmount) * 100);
  const grownPercent = Math.min(100 - savedPercent, (progress.grownAmount / progress.targetAmount) * 100);
  return { savedPercent, grownPercent };
}
