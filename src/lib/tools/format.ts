// One shared en-IN formatter for every tool (AD-8 convention). Never call
// toLocaleString ad-hoc per tool — money display must be identical everywhere.

const inrFmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numFmt = new Intl.NumberFormat("en-IN");

const numDecimal2Fmt = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
const numDecimal4Fmt = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 4,
  minimumFractionDigits: 0,
});
const numDecimal6Fmt = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 6,
  minimumFractionDigits: 0,
});

/** Full rupee amount, no decimals, Indian grouping: ₹43,391 */
export const inr = (n: number) => inrFmt.format(Math.round(n));

/** Plain number with Indian grouping: 1,04,000 */
export const num = (n: number) => numFmt.format(Math.round(n));

/** Number with Indian grouping and adaptive decimal precision, no rounding to
 * an integer: 899.3, 1,075.56, 0.2222 — needed for sq m / acre / hectare
 * results where `num()`'s Math.round would erase meaningful precision.
 * Precision scales up for small magnitudes so a real (if tiny) result never
 * collapses to a misleading "0" — e.g. a modest plot converted to acre/hectare. */
export function numDecimal(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  const abs = Math.abs(v);
  if (abs > 0 && abs < 0.01) return numDecimal6Fmt.format(v);
  if (abs > 0 && abs < 1) return numDecimal4Fmt.format(v);
  return numDecimal2Fmt.format(v);
}

/** Compact rupees in lakh / crore for large sums: ₹1.04 Cr, ₹54.1 L */
export function inrCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return inr(n);
}

/** "3 yrs 4 mo" from a month count. */
export function formatMonths(totalMonths: number): string {
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  const parts: string[] = [];
  if (y > 0) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (m > 0) parts.push(`${m} mo`);
  return parts.length ? parts.join(" ") : "0 mo";
}
