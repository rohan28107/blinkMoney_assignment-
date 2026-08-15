/**
 * Hand-rolled Indian digit grouping (₹1,00,000 not ₹100,000).
 * Deliberately not using Intl.NumberFormat('en-IN') — Hermes' bundled ICU data
 * has historically been unreliable for en-IN grouping on-device.
 */
export function formatINR(amount: number, opts?: { showSymbol?: boolean; decimals?: number }): string {
  const { showSymbol = true, decimals = 0 } = opts ?? {};
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const fixed = decimals > 0 ? abs.toFixed(decimals) : Math.round(abs).toString();
  const [intPart, decPart] = fixed.split('.');

  const lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const restGrouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const grouped = restGrouped ? `${restGrouped},${lastThree}` : lastThree;

  const sign = isNegative ? '-' : '';
  const symbol = showSymbol ? '₹' : '';
  return `${sign}${symbol}${grouped}${decPart ? `.${decPart}` : ''}`;
}

/** Compact form for tight spaces: ₹1.2L, ₹85K, ₹950 */
export function formatINRCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(1)}K`;
  return formatINR(amount);
}

export function clampAmount(value: number, { min = 0, max = 99_99_999 }: { min?: number; max?: number } = {}) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}
