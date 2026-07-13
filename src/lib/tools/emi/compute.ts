// Pure EMI math (AD-4) — no React, no I/O, deterministic and unit-testable.
// Formula (Indian bank standard): EMI = [P·R·(1+R)^N] / [(1+R)^N − 1]

export type PrepaymentMode = "none" | "onetime" | "monthly";

export interface EmiInput {
  /** loan amount (principal), ₹ */
  principal: number;
  /** annual interest rate, percent (e.g. 8.5) */
  annualRate: number;
  /** tenure in months */
  tenureMonths: number;
  /** optional extra payment amount, ₹ */
  prepayAmount?: number;
  /** how the prepayment is applied */
  prepayMode?: PrepaymentMode;
}

export interface AmortRow {
  month: number;
  openingBalance: number;
  emi: number;
  interest: number;
  principal: number;
  closingBalance: number;
}

export interface PrepayResult {
  monthsSaved: number;
  interestSaved: number;
  newTenureMonths: number;
  newTotalInterest: number;
}

export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: AmortRow[];
  prepay?: PrepayResult;
}

/** Flat EMI for principal P, monthly rate r, n months. Handles r = 0. */
export function emiForRate(principal: number, monthlyRate: number, n: number): number {
  if (n <= 0) return 0;
  if (monthlyRate <= 0) return principal / n;
  const f = Math.pow(1 + monthlyRate, n);
  return (principal * monthlyRate * f) / (f - 1);
}

/** Inverse of emiForRate: the principal a given flat EMI supports at monthly
 * rate r over n months. Used by loan-eligibility (AD-4 reuse — the two
 * formulas must never drift apart, so this stays the single source). */
export function principalForEmi(emi: number, monthlyRate: number, n: number): number {
  if (n <= 0 || emi <= 0) return 0;
  if (monthlyRate <= 0) return emi * n;
  const f = Math.pow(1 + monthlyRate, n);
  return (emi * (f - 1)) / (monthlyRate * f);
}

/** Reduce a balance to zero and return months elapsed + total interest paid. */
function amortizeToZero(
  principal: number,
  monthlyRate: number,
  emi: number,
  extraPerMonth: number,
  extraOnceMonth1: number,
  hardCapMonths: number
): { months: number; totalInterest: number } {
  let balance = principal;
  let totalInterest = 0;
  let month = 0;
  while (balance > 0.005 && month < hardCapMonths) {
    month += 1;
    const interest = balance * monthlyRate;
    let principalPaid = emi - interest;
    if (principalPaid <= 0) {
      // EMI cannot cover interest — loan never amortizes. Guard against infinite loop.
      return { months: hardCapMonths, totalInterest };
    }
    if (month === 1) principalPaid += extraOnceMonth1;
    principalPaid += extraPerMonth;
    if (principalPaid > balance) principalPaid = balance;
    balance -= principalPaid;
    totalInterest += interest;
  }
  return { months: month, totalInterest };
}

export function compute(input: EmiInput): EmiResult {
  const { principal, annualRate, tenureMonths } = input;
  const r = annualRate / 12 / 100;
  const emi = emiForRate(principal, r, tenureMonths);

  // Base amortization schedule (no prepayment).
  const schedule: AmortRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  for (let m = 1; m <= tenureMonths && balance > 0.005; m += 1) {
    const interest = balance * r;
    let principalPaid = emi - interest;
    if (principalPaid > balance) principalPaid = balance;
    const closing = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    schedule.push({
      month: m,
      openingBalance: balance,
      emi: principalPaid + interest,
      interest,
      principal: principalPaid,
      closingBalance: closing,
    });
    balance = closing;
  }

  const result: EmiResult = {
    emi,
    totalInterest,
    totalPayment: principal + totalInterest,
    schedule,
  };

  // Prepayment scenario, if requested.
  const mode = input.prepayMode ?? "none";
  const amt = input.prepayAmount ?? 0;
  if (mode !== "none" && amt > 0) {
    const extraMonthly = mode === "monthly" ? amt : 0;
    const extraOnce = mode === "onetime" ? amt : 0;
    const { months, totalInterest: newInterest } = amortizeToZero(
      principal,
      r,
      emi,
      extraMonthly,
      extraOnce,
      tenureMonths * 2 // generous cap; prepayment only shortens
    );
    result.prepay = {
      monthsSaved: Math.max(0, tenureMonths - months),
      interestSaved: Math.max(0, totalInterest - newInterest),
      newTenureMonths: months,
      newTotalInterest: newInterest,
    };
  }

  return result;
}
