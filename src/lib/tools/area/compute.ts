// Pure area-conversion math (AD-4) — no React, no I/O, deterministic and
// unit-testable. Zero hardcoded numbers: every factor comes from data.ts (AD-6).

import {
  AREA_UNIT_IDS,
  fixedUnitsSqFt,
  findRegion,
  marlaSqFt,
  kanalSqFt,
  type AreaUnit,
  type AreaRegionId,
} from "./data";

export interface AreaConvertInput {
  /** the entered value, in `fromUnit` units */
  value: number;
  fromUnit: AreaUnit;
  /** which bigha/biswa basis to use — ignored for non-region units */
  region: AreaRegionId;
}

/** The bigha/biswa basis actually used, for the provenance line — never a
 * silent constant. */
export interface ActiveBigha {
  regionId: AreaRegionId;
  regionLabel: string;
  bighaSqFt: number;
  biswaSqFt: number;
  asOf: string;
  source: string;
}

export interface AreaConvertResult {
  /** the input value expressed in sq ft — the common conversion base */
  sqft: number;
  /** every unit's converted value, keyed by unit id (includes fromUnit) */
  units: Record<AreaUnit, number>;
  /** the region basis used for this conversion */
  activeBigha: ActiveBigha;
  /** true when fromUnit is marla or kanal — triggers the "not Rajasthan-native" note */
  isNorthIndiaUnit: boolean;
}

/** sq ft per 1 unit, resolved against the active region for bigha/biswa. */
function sqFtPerUnit(unit: AreaUnit, region: ReturnType<typeof findRegion>): number {
  if (unit === "bigha") return region.bighaSqFt.value;
  if (unit === "biswa") return region.bighaSqFt.value / 20;
  if (unit === "marla") return marlaSqFt.value;
  if (unit === "kanal") return kanalSqFt.value;
  // Defensive fallback: AreaUnit is a closed union, but `fromUnit` can reach
  // here from a live-typed/URL value that failed zod validation and was kept
  // as-is by useToolState's patch path — never throw, zero-out instead.
  return fixedUnitsSqFt[unit]?.value ?? 0;
}

export function compute(input: AreaConvertInput): AreaConvertResult {
  const region = findRegion(input.region);

  // Guard zero/negative/NaN — never throw, never divide by zero, just 0-out.
  const safeValue =
    Number.isFinite(input.value) && input.value > 0 ? input.value : 0;

  const fromFactor = sqFtPerUnit(input.fromUnit, region);
  const sqft = safeValue * fromFactor;

  const units = {} as Record<AreaUnit, number>;
  for (const unit of AREA_UNIT_IDS) {
    const factor = sqFtPerUnit(unit, region);
    units[unit] = factor > 0 ? sqft / factor : 0;
  }

  const biswaSqFt = region.bighaSqFt.value / 20;

  return {
    sqft,
    units,
    activeBigha: {
      regionId: region.id,
      regionLabel: region.label,
      bighaSqFt: region.bighaSqFt.value,
      biswaSqFt,
      asOf: region.bighaSqFt.asOf,
      source: region.bighaSqFt.source,
    },
    isNorthIndiaUnit: input.fromUnit === "marla" || input.fromUnit === "kanal",
  };
}
