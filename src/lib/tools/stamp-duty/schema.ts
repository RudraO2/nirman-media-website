import { z } from "zod";
import { STAMP_DUTY_BUYER_CATEGORY_IDS } from "./data";

// zod input schema for the Rajasthan Stamp Duty & Registration Calculator
// (AD-4). Mirrors emi/schema.ts / area/schema.ts shape: bounds keep the UI +
// URL state sane, defaults match the addendum's own worked example (₹50L,
// male/joint, no DLC override).
// Schema max mirrors stampDutyBounds.max (below) exactly — a URL param inside
// the schema's range but past the UI's slider max would desync the Slider's
// fill percentage from the actual value, so the two bounds must never drift
// apart.
const AMOUNT_MAX = 100_000_000;

export const stampDutySchema = z.object({
  transactionValue: z.number().finite().min(0).max(AMOUNT_MAX),
  dlcValue: z.number().finite().min(0).max(AMOUNT_MAX),
  buyerCategory: z.enum(STAMP_DUTY_BUYER_CATEGORY_IDS),
});

export type StampDutyFormState = z.infer<typeof stampDutySchema>;

export const stampDutyDefaults: StampDutyFormState = {
  transactionValue: 5_000_000, // ₹50,00,000 — the addendum's own worked example
  dlcValue: 0, // unknown/unset — base falls back to transaction value
  buyerCategory: "male-joint",
};

// UI bounds (kept next to the schema so they stay in sync). min:0 on both
// amount fields deliberately allows a cleared/zero input to reach compute() —
// the I/O matrix requires zero, not a clamped minimum, to render as ₹0.
export const stampDutyBounds = {
  transactionValue: { min: 0, max: AMOUNT_MAX, step: 50_000 },
  dlcValue: { min: 0, max: AMOUNT_MAX, step: 50_000 },
};
