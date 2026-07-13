// Versioned, date-stamped rate data for the Rajasthan Stamp Duty & Registration
// Calculator (AD-6). No rate lives anywhere else — compute.ts pulls every
// percentage from here, so a future budget-driven rate change touches exactly
// one file, and the UI can always show which figure + asOf/source produced a
// given result.
//
// Sources (brief addendum, "Tool 3 — Stamp duty + registration (Rajasthan)",
// 2025–26 figures, multi-source — verify vs official IGRS Rajasthan
// notification before relying on this for a real transaction):
const SOURCE_NOTE =
  "homefirstindia.com · 1acre.in/stamp-duty-calculator/rajasthan · godrejcapital.com (2025–26 Rajasthan rates — verify vs official IGRS Rajasthan notification)";

export interface DataPoint {
  /** the rate, expressed as a percent (e.g. 6 means 6%) */
  value: number;
  /** ISO date this figure was last verified */
  asOf: string;
  /** where the figure came from — never a silent constant */
  source: string;
}

/** Every selectable buyer-category id. Order drives the Select's option order. */
export const STAMP_DUTY_BUYER_CATEGORY_IDS = [
  "male-joint",
  "female-sole",
  "female-sc-st-bpl",
] as const;

export type BuyerCategory = (typeof STAMP_DUTY_BUYER_CATEGORY_IDS)[number];

export interface BuyerCategoryRate {
  id: BuyerCategory;
  label: string;
  /** stamp-duty rate, as a percent of the base (transaction value or DLC,
   * whichever is higher) */
  dutyRate: DataPoint;
}

/**
 * Stamp duty rate by buyer category (AD-6). Rajasthan gives a lower rate to
 * sole female buyers, and a lower rate still to SC/ST/BPL female buyers, as a
 * policy incentive — this is the whole reason buyer category is a required
 * input, not a flat percentage.
 */
export const buyerCategoryRates: BuyerCategoryRate[] = [
  {
    id: "male-joint",
    label: "Male buyer or joint ownership",
    dutyRate: { value: 6, asOf: "2026-07-13", source: SOURCE_NOTE },
  },
  {
    id: "female-sole",
    label: "Sole female buyer",
    dutyRate: { value: 5, asOf: "2026-07-13", source: SOURCE_NOTE },
  },
  {
    id: "female-sc-st-bpl",
    label: "Female buyer — SC/ST or BPL",
    dutyRate: { value: 4, asOf: "2026-07-13", source: SOURCE_NOTE },
  },
];

/** The default buyer category is male/joint by id, not array position — same
 * defensive pattern as area-converter's `defaultRegion`. */
export const defaultBuyerCategory: BuyerCategoryRate =
  buyerCategoryRates.find((c) => c.id === "male-joint") ?? buyerCategoryRates[0];

/**
 * Labour cess — a percentage of the DUTY AMOUNT, not of the base/transaction
 * value. This is the single easiest mistake to make in this domain; keep it a
 * distinct data point from `dutyRate` so `compute.ts` can never accidentally
 * apply it to the wrong figure.
 */
export const cessRate: DataPoint = {
  value: 20,
  asOf: "2026-07-13",
  source: SOURCE_NOTE,
};

/** Registration charge — flat 1% of the base, regardless of buyer category. */
export const registrationRate: DataPoint = {
  value: 1,
  asOf: "2026-07-13",
  source: SOURCE_NOTE,
};

export function findBuyerCategory(id: BuyerCategory): BuyerCategoryRate {
  return buyerCategoryRates.find((c) => c.id === id) ?? defaultBuyerCategory;
}
