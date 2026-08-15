const DAY_MS = 24 * 60 * 60 * 1000;

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / DAY_MS);
}

export function daysUntil(dateIso: string, nowMs: number): number {
  return Math.ceil((new Date(dateIso).getTime() - nowMs) / DAY_MS);
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatRelativeTime(iso: string, nowMs: number): string {
  const diffMs = nowMs - new Date(iso).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatShortDate(iso);
}

export function daysLeftLabel(targetDateIso: string | undefined, nowMs: number): string {
  if (!targetDateIso) return 'No deadline';
  const days = daysUntil(targetDateIso, nowMs);
  if (days < 0) return 'Deadline passed';
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}
