import { milestoneTiers, type MilestoneTier } from '@/src/theme/tokens';

export function tiersCrossed(percent: number): MilestoneTier[] {
  return milestoneTiers.filter((tier) => percent >= tier);
}

/** Cascades through tiers one at a time even if a single contribution jumps several at once. */
export function nextUncelebratedTier(
  percent: number,
  celebratedTiers: MilestoneTier[]
): MilestoneTier | undefined {
  return tiersCrossed(percent).find((tier) => !celebratedTiers.includes(tier));
}

export const milestoneCopy: Record<MilestoneTier, { title: string; subtitle: string }> = {
  25: { title: 'Quarter of the way!', subtitle: 'The squad is off to a strong start.' },
  50: { title: 'Halfway there!', subtitle: 'This vault is really growing now.' },
  75: { title: 'So close!', subtitle: 'The final stretch — keep it going.' },
  100: { title: 'Goal smashed! 🎉', subtitle: 'Your whole squad hit the target together — nice work, team.' },
};

/** "Priya", "Priya & Rahul", "Priya, Rahul & 1 other" */
export function formatNameList(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  const [first, second, ...rest] = names;
  return `${first}, ${second} & ${rest.length} other${rest.length > 1 ? 's' : ''}`;
}
