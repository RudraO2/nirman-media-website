import { z } from "zod";

// zod input schema for the Property Tax Calculator (AD-4). Bounds/defaults
// live here as the single source; Slider UI and schema both read
// `propertyTaxBounds` so they can't drift apart.
//
// Deliberately NOT city-specific data (unlike stamp-duty-rj's sourced AD-6
// rate table): every Indian municipal corporation sets its own annual-value
// method, rate slabs, and rebate — Jaipur Nagar Nigam included — and those
// change by notification. Rather than fabricate unsourced slab numbers, this
// tool takes the annual value and rate straight from the user's own bill/
// municipal portal and does the rebate/cess arithmetic honestly.

export const propertyTaxBounds = {
  annualValue: { min: 0, max: 10_000_000, step: 1_000 },
  taxRatePct: { min: 0, max: 40, step: 0.5 },
  rebatePct: { min: 0, max: 25, step: 1 },
  cessPct: { min: 0, max: 10, step: 0.5 },
} as const;

export const propertyTaxSchema = z.object({
  annualValue: z
    .number()
    .finite()
    .min(propertyTaxBounds.annualValue.min)
    .max(propertyTaxBounds.annualValue.max),
  taxRatePct: z
    .number()
    .finite()
    .min(propertyTaxBounds.taxRatePct.min)
    .max(propertyTaxBounds.taxRatePct.max),
  rebatePct: z
    .number()
    .finite()
    .min(propertyTaxBounds.rebatePct.min)
    .max(propertyTaxBounds.rebatePct.max),
  cessPct: z
    .number()
    .finite()
    .min(propertyTaxBounds.cessPct.min)
    .max(propertyTaxBounds.cessPct.max),
});

export type PropertyTaxFormState = z.infer<typeof propertyTaxSchema>;

export const propertyTaxDefaults: PropertyTaxFormState = {
  annualValue: 120_000,
  taxRatePct: 10,
  rebatePct: 10,
  cessPct: 0,
};
