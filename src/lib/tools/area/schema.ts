import { z } from "zod";
import { AREA_UNIT_IDS, AREA_REGION_IDS } from "./data";

// zod input schema for the Area Unit Converter (AD-4). Mirrors emi/schema.ts:
// bounds keep the UI + URL state sane, defaults match the addendum's stated
// happy path (1 bigha, Rajasthan).
export const areaSchema = z.object({
  value: z.number().finite().min(0).max(1_000_000_000),
  fromUnit: z.enum(AREA_UNIT_IDS),
  region: z.enum(AREA_REGION_IDS),
});

export type AreaFormState = z.infer<typeof areaSchema>;

export const areaDefaults: AreaFormState = {
  value: 1,
  fromUnit: "bigha",
  region: "rajasthan",
};

// UI bounds for the value field (kept next to the schema so they stay in sync).
export const areaBounds = {
  value: { min: 0, max: 1_000_000_000, step: 0.01 },
};
