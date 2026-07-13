// Pure stamp-duty math (AD-4) — no React, no I/O, deterministic and
// unit-testable. Zero hardcoded numbers: every rate comes from data.ts (AD-6).

import {
  findBuyerCategory,
  cessRate,
  registrationRate,
  type BuyerCategory,
} from "./data";

export interface StampDutyInput {
  /** the price the buyer and seller agreed on, ₹ */
  transactionValue: number;
  /** the buyer's known DLC/circle-rate valuation, ₹ (0 = unknown/unset) */
  dlcValue: number;
  buyerCategory: BuyerCategory;
}

export interface StampDutyResult {
  /** the higher of transactionValue / dlcValue — what duty/cess/reg are computed on */
  base: number;
  /** true when dlcValue > transactionValue, i.e. the DLC figure was used instead of the entered price */
  dlcOverrideActive: boolean;
  buyerCategoryLabel: string;
  dutyRatePercent: number;
  cessRatePercent: number;
  registrationRatePercent: number;
  /** provenance for the duty rate actually used (varies by buyer category —
   * the figure most likely to change on a future budget update, so the UI's
   * provenance line must track THIS DataPoint, not a sibling one). */
  dutyRateAsOf: string;
  dutyRateSource: string;
  duty: number;
  cess: number;
  registration: number;
  /** duty + cess + registration */
  govtCharges: number;
  /** govtCharges as a percent of base */
  allInPercent: number;
  /** transactionValue + govtCharges — what the buyer actually pays out */
  totalOutlay: number;
}

/** Guard non-finite/negative/cleared input to 0 — never throw/NaN/Infinity,
 * same defensive style as area/compute.ts's value guard. */
function safeAmount(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function compute(input: StampDutyInput): StampDutyResult {
  const transactionValue = safeAmount(input.transactionValue);
  const dlcValue = safeAmount(input.dlcValue);

  // Defensive fallback to the male/joint rate for an unrecognized category —
  // reachable only via a malformed URL param surviving useToolState's known
  // patch-path validation gap. Never throw.
  const category = findBuyerCategory(input.buyerCategory);

  // Base = higher of transaction value or DLC rate. DLC only overrides when
  // STRICTLY greater — a DLC value at or below the transaction value is
  // ignored, and the UI must not claim it was used.
  const dlcOverrideActive = dlcValue > transactionValue;
  const base = dlcOverrideActive ? dlcValue : transactionValue;

  const dutyRatePercent = category.dutyRate.value;
  const cessRatePercent = cessRate.value;
  const registrationRatePercent = registrationRate.value;

  const duty = base * (dutyRatePercent / 100);
  // Cess is 20% of the DUTY AMOUNT, never of base/value directly — the one
  // easy mistake to avoid in this domain.
  const cess = duty * (cessRatePercent / 100);
  const registration = base * (registrationRatePercent / 100);
  const govtCharges = duty + cess + registration;
  // Guard divide-by-zero: base = 0 → 0%, never NaN/Infinity.
  const allInPercent = base > 0 ? (govtCharges / base) * 100 : 0;
  const totalOutlay = transactionValue + govtCharges;

  return {
    base,
    dlcOverrideActive,
    buyerCategoryLabel: category.label,
    dutyRatePercent,
    cessRatePercent,
    registrationRatePercent,
    dutyRateAsOf: category.dutyRate.asOf,
    dutyRateSource: category.dutyRate.source,
    duty,
    cess,
    registration,
    govtCharges,
    allInPercent,
    totalOutlay,
  };
}
