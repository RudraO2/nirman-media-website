// Versioned, date-stamped conversion data for the Area Unit Converter (AD-6).
// No factor lives anywhere else — compute.ts pulls every number from here, so a
// future rate correction touches exactly one file, and the UI can always show
// which value + region + asOf/source produced a given result.

export interface DataPoint {
  /** the conversion factor, always expressed as "sq ft per 1 unit" */
  value: number;
  /** ISO date this figure was last verified */
  asOf: string;
  /** where the figure came from — never a silent constant */
  source: string;
}

// Every selectable unit id. Order here drives the Select's option order and the
// result grid's iteration order.
export const AREA_UNIT_IDS = [
  "sqft",
  "gaj",
  "sqm",
  "acre",
  "hectare",
  "cent",
  "guntha",
  "ground",
  "bigha",
  "biswa",
  "marla",
  "kanal",
] as const;

export type AreaUnit = (typeof AREA_UNIT_IDS)[number];

/**
 * Fixed, region-invariant units — sq ft per 1 unit. Source: brief addendum
 * "Tool 2 — Area unit converter" fixed-constants table.
 * Note: "bigha" / "biswa" / "marla" / "kanal" are deliberately NOT here — they
 * are region-variable (bigha/biswa) or a single North-India convention
 * (marla/kanal) and are modelled separately below.
 */
export const fixedUnitsSqFt: Record<
  Exclude<AreaUnit, "bigha" | "biswa" | "marla" | "kanal">,
  DataPoint
> = {
  sqft: {
    value: 1,
    asOf: "2026-07-13",
    source: "Base unit (1 sq ft = 1 sq ft)",
  },
  gaj: {
    value: 9,
    asOf: "2026-07-13",
    source: "Brief addendum, Tool 2 data table (gaj / sq yard, 0.8361 sq m)",
  },
  sqm: {
    value: 10.7639,
    asOf: "2026-07-13",
    source: "Brief addendum, Tool 2 data table (SI sq metre conversion)",
  },
  acre: {
    value: 43_560,
    asOf: "2026-07-13",
    source: "Brief addendum, Tool 2 data table (4,046.86 sq m)",
  },
  hectare: {
    value: 107_639,
    asOf: "2026-07-13",
    source: "Brief addendum, Tool 2 data table (10,000 sq m)",
  },
  cent: {
    value: 435.6,
    asOf: "2026-07-13",
    source: "Brief addendum, Tool 2 data table (1/100 acre, 40.47 sq m)",
  },
  guntha: {
    value: 1_089,
    asOf: "2026-07-13",
    source: "Brief addendum, Tool 2 data table (1/40 acre, 101.17 sq m)",
  },
  ground: {
    value: 2_400,
    asOf: "2026-07-13",
    source: "Brief addendum, Tool 2 data table (Tamil Nadu ground, 222.97 sq m)",
  },
};

/** Selectable bigha region-variant ids, Rajasthan is the default. */
export const AREA_REGION_IDS = [
  "rajasthan",
  "shahjahani-pucca",
  "gantari",
  "up-pucca",
  "up-kaccha",
  "bengal",
] as const;

export type AreaRegionId = (typeof AREA_REGION_IDS)[number];

export interface RegionBigha {
  id: AreaRegionId;
  label: string;
  /** sq ft per 1 bigha for this region — the single authoritative basis.
   * Biswa is always derived from this (bigha ÷ 20), never tabulated
   * separately, so it can never drift out of sync with the bigha figure. */
  bighaSqFt: DataPoint;
}

/**
 * Region-variable bigha table (AD-6). Bigha has no national standard — this is
 * the whole reason the tool needs a state selector instead of one constant.
 * Rajasthan (9,680 sq ft) is the default per the addendum's explicit guidance.
 */
export const bighaRegions: RegionBigha[] = [
  {
    id: "rajasthan",
    label: "Rajasthan",
    bighaSqFt: {
      value: 9_680,
      asOf: "2026-07-13",
      source: "bhumicalculator.com (Rajasthan)",
    },
  },
  {
    id: "shahjahani-pucca",
    label: "Shahjahani / Pucca bigha",
    bighaSqFt: {
      value: 27_225,
      asOf: "2026-07-13",
      source:
        "Brief addendum, Tool 2 data table (Shahjahani / pucca bigha, 165 ft × 165 ft)",
    },
  },
  {
    id: "gantari",
    label: "Gantari bigha",
    bighaSqFt: {
      value: 17_424,
      asOf: "2026-07-13",
      source: "Brief addendum, Tool 2 data table (Gantari bigha)",
    },
  },
  {
    id: "up-pucca",
    label: "Uttar Pradesh — pucca",
    bighaSqFt: {
      value: 27_225,
      asOf: "2026-07-13",
      source: "landvaluetools.com state chart (Uttar Pradesh pucca bigha)",
    },
  },
  {
    id: "up-kaccha",
    label: "Uttar Pradesh — kaccha",
    bighaSqFt: {
      value: 9_070,
      asOf: "2026-07-13",
      source: "landvaluetools.com state chart (Uttar Pradesh kaccha bigha)",
    },
  },
  {
    id: "bengal",
    label: "West Bengal",
    bighaSqFt: {
      value: 14_400,
      asOf: "2026-07-13",
      source: "landvaluetools.com state chart (West Bengal bigha)",
    },
  },
];

/** The default region is Rajasthan by id, not array position — reordering
 * `bighaRegions` for any UI reason (e.g. alphabetizing) can never silently
 * change the default. */
export const defaultRegion: RegionBigha =
  bighaRegions.find((r) => r.id === "rajasthan") ?? bighaRegions[0];

/**
 * Marla/kanal — a single canonical North-India (Punjab/Haryana) figure, NOT a
 * per-state table like bigha (the addendum gives one number, not a state
 * chart). Kept out of `bighaRegions` intentionally: the UI must never present
 * these as Rajasthan-verified values.
 */
export const marlaSqFt: DataPoint = {
  value: 272.25,
  asOf: "2026-07-13",
  source:
    "Brief addendum, Tool 2 data table (North India / Punjab-Haryana convention, ~25 sq yd; not native to Rajasthan)",
};

/** Kanal = 20 marla exactly (272.25 × 20 = 5,445 sq ft). */
export const kanalSqFt: DataPoint = {
  value: 5_445,
  asOf: "2026-07-13",
  source:
    "Brief addendum, Tool 2 data table (kanal = 20 marla, North India / Punjab-Haryana convention; not native to Rajasthan)",
};

export function findRegion(id: AreaRegionId): RegionBigha {
  return bighaRegions.find((r) => r.id === id) ?? defaultRegion;
}
