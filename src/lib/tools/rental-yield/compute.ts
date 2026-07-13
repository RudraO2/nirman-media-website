// Pure rental yield math (AD-4) — no React, no I/O, deterministic and
// unit-testable. Reuses emi/compute.ts's own compute() for the leveraged
// piece (EMI + year-1 interest read off the amortization schedule) rather
// than re-deriving the EMI formula — zero edits to emi/compute.ts, confirmed
// cleanly reusable as-is (same reuse pattern rent-vs-buy/compute.ts uses).
//
// Every rate here (property tax, maintenance, society charges, vacancy,
// down payment, loan rate/tenure, acquisition costs) is a user-supplied
// ASSUMPTION, not a sourced statutory fact (unlike stamp-duty's AD-6 rate
// table) — so there is deliberately no data.ts; defaults live in schema.ts.

import { compute as computeEmi } from "@/lib/tools/emi/compute";
import { rentalYieldBounds } from "./schema";

export type LeverageMode = "off" | "on";

export interface RentalYieldInput {
  /** total agreed price of the property, ₹ */
  propertyPrice: number;
  monthlyRent: number;
  propertyTaxPct: number;
  maintenancePct: number;
  societyChargesMonthly: number;
  /** months per year the property is assumed vacant (lost rent) */
  vacancyMonths: number;
  leverage: LeverageMode;
  /** down payment as a % of propertyPrice — only meaningful when leverage is "on" */
  downPaymentPct: number;
  annualRate: number;
  tenureYears: number;
  /** stamp duty/registration/brokerage etc. as a % of propertyPrice — only meaningful when leverage is "on" */
  acquisitionCostsPct: number;
}

export interface RentalYieldResult {
  annualRent: number;
  annualOperatingCosts: number;
  netAnnualIncome: number;
  /** annual rent ÷ property price × 100 — the commonly-quoted headline figure */
  grossYieldPct: number;
  /** gross yield minus real running costs (tax, maintenance, society, vacancy) — the honest, unleveraged default. Never subtracts loan interest, regardless of leverage state. */
  netYieldPct: number;
  /** hedged sentence comparing grossYieldPct to the ~2–3.5% informally-cited India range */
  benchmarkNote: string;
  /** 0 when leverage is "off" */
  downPayment: number;
  /** 0 when leverage is "off" */
  loanAmount: number;
  /** 0 when leverage is "off" */
  emi: number;
  /** 0 when leverage is "off" */
  annualEmi: number;
  /** 0 when leverage is "off" */
  year1Interest: number;
  /** null (not 0) when leverage is "off" — distinguishes "not computed" from "computed to zero" */
  netYieldLeveragedPct: number | null;
  /** null when leverage is "off" */
  actualCashInvested: number | null;
  /** null when leverage is "off" */
  annualNetCashFlow: number | null;
  /** null when leverage is "off" */
  cashOnCashReturnPct: number | null;
}

/** Narrow defensive backstop, scoped to this module only: clamps a value
 * into range and substitutes `min` for non-finite input, so a single
 * malformed field arriving via a non-standard call path can't hand the math
 * below a NaN/negative/absurd number. Mirrors rent-vs-buy/compute.ts's own
 * clamp() precedent; does NOT address useToolState's own documented
 * initial-load behavior (an out-of-range URL param fails schema.safeParse
 * for the whole object and falls back to full defaults before compute() is
 * ever called) — that gap is pre-existing, shared by every tool using the
 * hook, and out of this module's scope to fix. */
function clamp(v: number, min: number, max: number): number {
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min;
}

/** Same as clamp(), additionally rounded to an integer — for the two schema
 * fields (vacancyMonths, tenureYears) that are zod `.int()`. */
function clampInt(v: number, min: number, max: number): number {
  return Math.round(clamp(v, min, max));
}

/** Hedged sentence comparing the gross yield to the ~2–3.5% range commonly
 * (informally) cited for Indian residential property. Deliberately no false
 * precision on the band itself. Matches rent-vs-buy's own FAQ #2 figure
 * exactly (review-caught: an earlier draft cited "~2–3%" here, a different
 * number from the sibling tool's already-shipped "~2–3.5%" for what both
 * tools present as the same market fact — aligned to one figure so a user
 * comparing the two tools doesn't see the site contradict itself). */
function benchmarkNote(grossYieldPct: number): string {
  const pct = grossYieldPct.toFixed(2);
  if (grossYieldPct < 2) {
    return `Your gross yield of ${pct}% is below the ~2–3.5% range commonly cited for Indian residential property — a general, informally-cited reference, not an official statistic, and it varies a lot by city and market.`;
  }
  if (grossYieldPct <= 3.5) {
    return `Your gross yield of ${pct}% sits within the ~2–3.5% range commonly cited for Indian residential property — a general, informally-cited reference, not an official statistic, and it varies a lot by city and market.`;
  }
  return `Your gross yield of ${pct}% is above the ~2–3.5% range commonly cited for Indian residential property — a general, informally-cited reference, not an official statistic, and it varies a lot by city and market.`;
}

export function compute(input: RentalYieldInput): RentalYieldResult {
  const propertyPrice = clamp(
    input.propertyPrice,
    rentalYieldBounds.propertyPrice.min,
    rentalYieldBounds.propertyPrice.max
  );
  const monthlyRent = clamp(
    input.monthlyRent,
    rentalYieldBounds.monthlyRent.min,
    rentalYieldBounds.monthlyRent.max
  );
  const propertyTaxPct = clamp(
    input.propertyTaxPct,
    rentalYieldBounds.propertyTaxPct.min,
    rentalYieldBounds.propertyTaxPct.max
  );
  const maintenancePct = clamp(
    input.maintenancePct,
    rentalYieldBounds.maintenancePct.min,
    rentalYieldBounds.maintenancePct.max
  );
  const societyChargesMonthly = clamp(
    input.societyChargesMonthly,
    rentalYieldBounds.societyChargesMonthly.min,
    rentalYieldBounds.societyChargesMonthly.max
  );
  const vacancyMonths = clampInt(
    input.vacancyMonths,
    rentalYieldBounds.vacancyMonths.min,
    rentalYieldBounds.vacancyMonths.max
  );
  // Safe default ("off") for a malformed/unrecognized leverage value, rather
  // than propagating anything other than the literal "on" into the math.
  const leverage: LeverageMode = input.leverage === "on" ? "on" : "off";
  const downPaymentPct = clamp(
    input.downPaymentPct,
    rentalYieldBounds.downPaymentPct.min,
    rentalYieldBounds.downPaymentPct.max
  );
  const annualRate = clamp(input.annualRate, rentalYieldBounds.annualRate.min, rentalYieldBounds.annualRate.max);
  const tenureYears = clampInt(
    input.tenureYears,
    rentalYieldBounds.tenureYears.min,
    rentalYieldBounds.tenureYears.max
  );
  const acquisitionCostsPct = clamp(
    input.acquisitionCostsPct,
    rentalYieldBounds.acquisitionCostsPct.min,
    rentalYieldBounds.acquisitionCostsPct.max
  );

  const annualRent = monthlyRent * 12;
  const annualPropertyTax = (propertyPrice * propertyTaxPct) / 100;
  const annualMaintenance = (propertyPrice * maintenancePct) / 100;
  const annualSocietyCharges = societyChargesMonthly * 12;
  const annualVacancyCost = monthlyRent * vacancyMonths;
  const annualOperatingCosts =
    annualPropertyTax + annualMaintenance + annualSocietyCharges + annualVacancyCost;
  const netAnnualIncome = annualRent - annualOperatingCosts;

  const grossYieldPct = propertyPrice > 0 ? (annualRent / propertyPrice) * 100 : 0;
  const netYieldPct = propertyPrice > 0 ? (netAnnualIncome / propertyPrice) * 100 : 0;
  const note = benchmarkNote(grossYieldPct);

  let downPayment = 0;
  let loanAmount = 0;
  let emi = 0;
  let annualEmi = 0;
  let year1Interest = 0;
  let netYieldLeveragedPct: number | null = null;
  let actualCashInvested: number | null = null;
  let annualNetCashFlow: number | null = null;
  let cashOnCashReturnPct: number | null = null;

  if (leverage === "on") {
    downPayment = propertyPrice * (downPaymentPct / 100);
    loanAmount = propertyPrice - downPayment;

    const { emi: loanEmi, schedule } = computeEmi({
      principal: loanAmount,
      annualRate,
      tenureMonths: Math.round(tenureYears * 12),
    });
    emi = loanEmi;
    annualEmi = emi * 12;

    // Year-1 interest = sum of the first up-to-12 amortization rows. Handles
    // tenure < 1yr (schedule shorter than 12 rows, e.g. the "short tenure"
    // I/O row) and loanAmount = 0 (empty schedule -> 0) safely — never reads
    // past the array bounds regardless of tenure length.
    const year1Rows = schedule.slice(0, Math.min(12, schedule.length));
    year1Interest = year1Rows.reduce((sum, row) => sum + row.interest, 0);

    netYieldLeveragedPct =
      propertyPrice > 0
        ? ((annualRent - annualOperatingCosts - year1Interest) / propertyPrice) * 100
        : 0;

    const acquisitionCosts = propertyPrice * (acquisitionCostsPct / 100);
    actualCashInvested = downPayment + acquisitionCosts;
    annualNetCashFlow = netAnnualIncome - annualEmi;
    // When actualCashInvested is 0 (0% down + 0% acquisition costs), the true
    // cash-on-cash return is undefined/unbounded, not a real 0% — reporting a
    // confident "0.00%" would tell the user the opposite of reality for a
    // fully-financed, zero-closing-cost purchase. null (review-caught fix,
    // matches this result's existing "null means not computable" convention)
    // is honest here in the same way the leverage-off fields already are.
    cashOnCashReturnPct =
      actualCashInvested > 0 ? (annualNetCashFlow / actualCashInvested) * 100 : null;
  }

  return {
    annualRent,
    annualOperatingCosts,
    netAnnualIncome,
    grossYieldPct,
    netYieldPct,
    benchmarkNote: note,
    downPayment,
    loanAmount,
    emi,
    annualEmi,
    year1Interest,
    netYieldLeveragedPct,
    actualCashInvested,
    annualNetCashFlow,
    cashOnCashReturnPct,
  };
}
