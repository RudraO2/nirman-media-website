import { z } from "zod";

// zod input schema for the Rent vs. Buy Calculator (AD-4). Every numeric
// field's zod .min()/.max() and its Slider's min/max UI bound derive from
// THIS SAME rentVsBuyBounds object below — never two separately-typed
// numbers that can drift apart (the exact defect class the stamp-duty-rj
// review caught: a schema max desynced from the Slider's max desyncs the
// range input's fill percentage from the actual value). compute.ts also
// clamps against these same bounds as a defensive backstop for the
// unrecognized/out-of-range URL param case (useToolState's known
// patch-path validation gap), so all three consumers — schema, UI, and
// compute-time defense — share one source of truth.

export const rentVsBuyBounds = {
  homePrice: { min: 0, max: 100_000_000, step: 50_000 }, // ₹0 – ₹10 Cr
  downPaymentPct: { min: 0, max: 100, step: 1 }, // 0% (interest-free-style, unusual) – 100% (no loan)
  annualRate: { min: 0, max: 20, step: 0.05 }, // supports the zero-growth exact-check row
  tenureYears: { min: 1, max: 30, step: 1 },
  monthlyRent: { min: 0, max: 2_000_000, step: 500 },
  horizonYears: { min: 1, max: 30, step: 1 },
  propertyTaxPct: { min: 0, max: 5, step: 0.1 },
  maintenancePct: { min: 0, max: 5, step: 0.1 },
  appreciationPct: { min: 0, max: 20, step: 0.5 },
  rentEscalationPct: { min: 0, max: 20, step: 0.5 },
  investmentReturnPct: { min: 0, max: 25, step: 0.5 }, // must clear 20 for the "high investment return" I/O row
  sellingCostPct: { min: 0, max: 10, step: 0.5 },
} as const;

export const rentVsBuySchema = z.object({
  homePrice: z
    .number()
    .finite()
    .min(rentVsBuyBounds.homePrice.min)
    .max(rentVsBuyBounds.homePrice.max),
  downPaymentPct: z
    .number()
    .finite()
    .min(rentVsBuyBounds.downPaymentPct.min)
    .max(rentVsBuyBounds.downPaymentPct.max),
  annualRate: z
    .number()
    .finite()
    .min(rentVsBuyBounds.annualRate.min)
    .max(rentVsBuyBounds.annualRate.max),
  tenureYears: z
    .number()
    .int()
    .min(rentVsBuyBounds.tenureYears.min)
    .max(rentVsBuyBounds.tenureYears.max),
  monthlyRent: z
    .number()
    .finite()
    .min(rentVsBuyBounds.monthlyRent.min)
    .max(rentVsBuyBounds.monthlyRent.max),
  horizonYears: z
    .number()
    .int()
    .min(rentVsBuyBounds.horizonYears.min)
    .max(rentVsBuyBounds.horizonYears.max),
  propertyTaxPct: z
    .number()
    .finite()
    .min(rentVsBuyBounds.propertyTaxPct.min)
    .max(rentVsBuyBounds.propertyTaxPct.max),
  maintenancePct: z
    .number()
    .finite()
    .min(rentVsBuyBounds.maintenancePct.min)
    .max(rentVsBuyBounds.maintenancePct.max),
  appreciationPct: z
    .number()
    .finite()
    .min(rentVsBuyBounds.appreciationPct.min)
    .max(rentVsBuyBounds.appreciationPct.max),
  rentEscalationPct: z
    .number()
    .finite()
    .min(rentVsBuyBounds.rentEscalationPct.min)
    .max(rentVsBuyBounds.rentEscalationPct.max),
  investmentReturnPct: z
    .number()
    .finite()
    .min(rentVsBuyBounds.investmentReturnPct.min)
    .max(rentVsBuyBounds.investmentReturnPct.max),
  sellingCostPct: z
    .number()
    .finite()
    .min(rentVsBuyBounds.sellingCostPct.min)
    .max(rentVsBuyBounds.sellingCostPct.max),
});

export type RentVsBuyFormState = z.infer<typeof rentVsBuySchema>;

// Defaults match the spec's Default-load I/O row exactly.
export const rentVsBuyDefaults: RentVsBuyFormState = {
  homePrice: 5_000_000, // ₹50,00,000
  downPaymentPct: 20,
  annualRate: 8.5,
  tenureYears: 20,
  monthlyRent: 12_500,
  horizonYears: 15,
  propertyTaxPct: 0.5,
  maintenancePct: 1, // genuine adjustable input (India convention default), never hardcoded in compute.ts
  appreciationPct: 5,
  rentEscalationPct: 5,
  investmentReturnPct: 7,
  sellingCostPct: 2,
};
