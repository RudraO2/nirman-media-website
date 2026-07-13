// Pure rent-vs-buy math (AD-4) — no React, no I/O, deterministic and
// unit-testable. Reuses emi/compute.ts's own compute() for the loan piece
// (EMI + full amortization schedule) rather than re-deriving the EMI
// formula — zero edits to emi/compute.ts, confirmed cleanly reusable as-is.
//
// Every rate here (appreciation, rent escalation, investment return,
// property tax, maintenance, selling cost) is a user-supplied ASSUMPTION,
// not a sourced statutory fact (unlike stamp-duty's AD-6 rate table) — so
// there is deliberately no data.ts; defaults live in schema.ts.

import { compute as computeEmi } from "@/lib/tools/emi/compute";
import { rentVsBuyBounds } from "./schema";

export interface RentVsBuyInput {
  /** total agreed price of the home, ₹ */
  homePrice: number;
  /** down payment as a % of homePrice */
  downPaymentPct: number;
  annualRate: number;
  tenureYears: number;
  monthlyRent: number;
  /** how many years forward the comparison runs */
  horizonYears: number;
  propertyTaxPct: number;
  maintenancePct: number;
  appreciationPct: number;
  rentEscalationPct: number;
  investmentReturnPct: number;
  sellingCostPct: number;
}

export interface RentVsBuyYearRow {
  year: number;
  netOwnerCost: number;
  netRenterCost: number;
  homeValue: number;
}

export interface RentVsBuyResult {
  emi: number;
  loanAmount: number;
  downPayment: number;
  /** net cost to the owner at the end of the horizon: cash spent minus wealth retained */
  netOwnerCost: number;
  /** net cost to the renter at the end of the horizon: cash spent minus wealth retained */
  netRenterCost: number;
  totalOwnerCashOutflow: number;
  totalRenterCashOutflow: number;
  /** gross home equity at horizon (home value − remaining loan balance), before any hypothetical selling cost */
  homeEquityAtHorizon: number;
  /** renter's invested pool (down payment + monthly savings, compounded) at horizon */
  investmentValueAtHorizon: number;
  /** first year Y (1..horizonYears) where netOwnerCost <= netRenterCost; null if buying never catches up within the horizon */
  breakevenYear: number | null;
  verdict: string;
  yearly: RentVsBuyYearRow[];
}

/** Narrow defensive backstop, scoped to this module only: clamps a value
 * into range and substitutes `min` for non-finite input, so a single
 * malformed field arriving via a non-standard call path (e.g. a future
 * caller that bypasses the zod schema) can't hand the loop below a
 * NaN/negative/absurd number. This does NOT address useToolState's own
 * documented initial-load behavior (an out-of-range URL param fails
 * `schema.safeParse` for the whole object and falls back to full defaults
 * before `compute()` is ever called — see deferred-work.md) — that gap is
 * pre-existing, shared by every tool using the hook, and out of this
 * module's scope to fix. */
function clamp(v: number, min: number, max: number): number {
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min;
}

/** Same as clamp(), additionally rounded to an integer — for the two
 * schema fields (tenureYears, horizonYears) that are zod `.int()`. Plain
 * clamp() alone would silently accept a fractional value (e.g. 1.9),
 * which would desync yearly[]'s whole-year snapshots (pushed only at
 * month%12===0) from totalOwnerCashOutflow/pool/homeValue state (updated
 * every month through the fractional final partial year) — caught in
 * review. */
function clampInt(v: number, min: number, max: number): number {
  return Math.round(clamp(v, min, max));
}

export function compute(input: RentVsBuyInput): RentVsBuyResult {
  const homePrice = clamp(input.homePrice, rentVsBuyBounds.homePrice.min, rentVsBuyBounds.homePrice.max);
  const downPaymentPct = clamp(
    input.downPaymentPct,
    rentVsBuyBounds.downPaymentPct.min,
    rentVsBuyBounds.downPaymentPct.max
  );
  const annualRate = clamp(input.annualRate, rentVsBuyBounds.annualRate.min, rentVsBuyBounds.annualRate.max);
  const tenureYears = clampInt(
    input.tenureYears,
    rentVsBuyBounds.tenureYears.min,
    rentVsBuyBounds.tenureYears.max
  );
  const monthlyRent = clamp(input.monthlyRent, rentVsBuyBounds.monthlyRent.min, rentVsBuyBounds.monthlyRent.max);
  const horizonYears = clampInt(
    input.horizonYears,
    rentVsBuyBounds.horizonYears.min,
    rentVsBuyBounds.horizonYears.max
  );
  const propertyTaxPct = clamp(
    input.propertyTaxPct,
    rentVsBuyBounds.propertyTaxPct.min,
    rentVsBuyBounds.propertyTaxPct.max
  );
  const maintenancePct = clamp(
    input.maintenancePct,
    rentVsBuyBounds.maintenancePct.min,
    rentVsBuyBounds.maintenancePct.max
  );
  const appreciationPct = clamp(
    input.appreciationPct,
    rentVsBuyBounds.appreciationPct.min,
    rentVsBuyBounds.appreciationPct.max
  );
  const rentEscalationPct = clamp(
    input.rentEscalationPct,
    rentVsBuyBounds.rentEscalationPct.min,
    rentVsBuyBounds.rentEscalationPct.max
  );
  const investmentReturnPct = clamp(
    input.investmentReturnPct,
    rentVsBuyBounds.investmentReturnPct.min,
    rentVsBuyBounds.investmentReturnPct.max
  );
  const sellingCostPct = clamp(
    input.sellingCostPct,
    rentVsBuyBounds.sellingCostPct.min,
    rentVsBuyBounds.sellingCostPct.max
  );

  const downPayment = homePrice * (downPaymentPct / 100);
  const loanAmount = homePrice - downPayment;

  const { emi, schedule } = computeEmi({
    principal: loanAmount,
    annualRate,
    tenureMonths: Math.round(tenureYears * 12),
  });
  const paidOffMonth = schedule.length;

  let pool = downPayment; // renter's invested capital
  let contributed = downPayment; // principal-only tracker (never double-counted as growth)
  let totalOwnerCash = 0;
  let totalRentCash = 0;

  const yearly: RentVsBuyYearRow[] = [];
  const totalMonths = Math.round(horizonYears * 12);

  let lastHomeValue = homePrice;
  let lastRemainingBal = loanAmount;

  for (let m = 1; m <= totalMonths; m += 1) {
    const homeValue = homePrice * Math.pow(1 + appreciationPct / 100, m / 12);
    const taxM = (homeValue * propertyTaxPct) / 100 / 12;
    const maintM = (homeValue * maintenancePct) / 100 / 12;
    const loanPay = m <= paidOffMonth ? emi : 0;
    const ownerCash = loanPay + taxM + maintM;
    const remainingBal = m < paidOffMonth ? schedule[m - 1].closingBalance : 0;
    const rent = monthlyRent * Math.pow(1 + rentEscalationPct / 100, Math.floor((m - 1) / 12));
    const contribution = Math.max(0, ownerCash - rent);

    pool = pool * (1 + investmentReturnPct / 12 / 100) + contribution;
    contributed += contribution;
    totalOwnerCash += ownerCash;
    totalRentCash += rent;

    lastHomeValue = homeValue;
    lastRemainingBal = remainingBal;

    if (m % 12 === 0) {
      const sellingCost = (homeValue * sellingCostPct) / 100;
      const netSaleProceeds = homeValue - sellingCost - remainingBal;
      const netOwnerCost = downPayment + totalOwnerCash - netSaleProceeds;
      const investmentGrowth = pool - contributed;
      const netRenterCost = totalRentCash - investmentGrowth;

      yearly.push({
        year: m / 12,
        netOwnerCost,
        netRenterCost,
        homeValue,
      });
    }
  }

  let breakevenYear: number | null = null;
  for (const row of yearly) {
    if (row.netOwnerCost <= row.netRenterCost) {
      breakevenYear = row.year;
      break;
    }
  }

  const finalRow = yearly[yearly.length - 1];
  const netOwnerCost = finalRow ? finalRow.netOwnerCost : 0;
  const netRenterCost = finalRow ? finalRow.netRenterCost : 0;

  const verdict =
    breakevenYear !== null
      ? `Buying wins from year ${breakevenYear}.`
      : `Renting is cheaper for your full ${horizonYears}-year horizon.`;

  return {
    emi,
    loanAmount,
    downPayment,
    netOwnerCost,
    netRenterCost,
    totalOwnerCashOutflow: totalOwnerCash,
    totalRenterCashOutflow: totalRentCash,
    homeEquityAtHorizon: lastHomeValue - lastRemainingBal,
    investmentValueAtHorizon: pool,
    breakevenYear,
    verdict,
    yearly,
  };
}
