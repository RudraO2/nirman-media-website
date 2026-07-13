// One shared en-IN formatter for every tool (AD-8 convention). Never call
// toLocaleString ad-hoc per tool — money display must be identical everywhere.

const inrFmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numFmt = new Intl.NumberFormat("en-IN");

/** Full rupee amount, no decimals, Indian grouping: ₹43,391 */
export const inr = (n: number) => inrFmt.format(Math.round(n));

/** Plain number with Indian grouping: 1,04,000 */
export const num = (n: number) => numFmt.format(Math.round(n));

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
