/**
 * Format a value as Colombian pesos: "$ 2.268.000".
 *
 * We format manually (dot as thousands separator, no decimals, $ prefix)
 * instead of using Intl.NumberFormat because Node's ICU and browser Intl
 * disagree on the exact whitespace character between the symbol and digits,
 * which caused React hydration mismatches. Manual formatting is byte-for-byte
 * identical on server and client. The non-breaking space (U+00A0) keeps
 * "$ 2.268.000" together on narrow tiles.
 */
export function formatCOP(value: number): string {
  const n = Math.round(value);
  const abs = Math.abs(n);
  const withSeparators = String(abs).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (n < 0 ? "-$" : "$") + " " + withSeparators;
}
