import { z } from "zod";

// zod input schema for the Rental Yield Calculator (AD-4). Every numeric
// field's zod .min()/.max() and its Slider's min/max UI bound derive from
// THIS SAME rentalYieldBounds object below — never two separately-typed
// numbers that can drift apart (the stamp-duty-rj-class bound-drift defect
// rent-vs-buy/schema.ts's own header comment documents). compute.ts also
// clamps against these same bounds as a defensive backstop for the
// unrecognized/out-of-range URL param case (useToolState's known
// patch-path validation gap), so all three consumers — schema, UI, and
// compute-time defense — share one source of truth.
//
// Every rate here (property tax, maintenance, society charges, vacancy,
// down payment, loan rate/tenure, acquisition costs) is a user-supplied
// ASSUMPTION, not a sourced statutory fact (unlike stamp-duty's AD-6 rate
// table) — so there is deliberately no data.ts; defaults live here.

export const rentalYieldBounds = {
  propertyPrice: { min: 0, max: 100_000_000, step: 50_000 }, // ₹0 – ₹10 Cr
  monthlyRent: { min: 0, max: 2_000_000, step: 500 },
  propertyTaxPct: { min: 0, max: 5, step: 0.1 },
  maintenancePct: { min: 0, max: 5, step: 0.1 },
  societyChargesMonthly: { min: 0, max: 100_000, step: 500 },
  vacancyMonths: { min: 0, max: 12, step: 1 }, // months/year assumed vacant
  downPaymentPct: { min: 0, max: 100, step: 1 }, // 100% = no loan
  annualRate: { min: 0, max: 20, step: 0.05 },
  tenureYears: { min: 1, max: 30, step: 1 },
  acquisitionCostsPct: { min: 0, max: 15, step: 0.5 }, // stamp duty/registration/brokerage/loan fees etc. — widened from an initial 10 (review-caught: stamp-duty-rj's own ~8.2% combined rate plus a lender processing fee and brokerage can plausibly land just over 10)
} as const;

export const rentalYieldSchema = z.object({
  propertyPrice: z
    .number()
    .finite()
    .min(rentalYieldBounds.propertyPrice.min)
    .max(rentalYieldBounds.propertyPrice.max),
  monthlyRent: z
    .number()
    .finite()
    .min(rentalYieldBounds.monthlyRent.min)
    .max(rentalYieldBounds.monthlyRent.max),
  propertyTaxPct: z
    .number()
    .finite()
    .min(rentalYieldBounds.propertyTaxPct.min)
    .max(rentalYieldBounds.propertyTaxPct.max),
  maintenancePct: z
    .number()
    .finite()
    .min(rentalYieldBounds.maintenancePct.min)
    .max(rentalYieldBounds.maintenancePct.max),
  societyChargesMonthly: z
    .number()
    .finite()
    .min(rentalYieldBounds.societyChargesMonthly.min)
    .max(rentalYieldBounds.societyChargesMonthly.max),
  vacancyMonths: z
    .number()
    .int()
    .min(rentalYieldBounds.vacancyMonths.min)
    .max(rentalYieldBounds.vacancyMonths.max),
  leverage: z.enum(["off", "on"]),
  downPaymentPct: z
    .number()
    .finite()
    .min(rentalYieldBounds.downPaymentPct.min)
    .max(rentalYieldBounds.downPaymentPct.max),
  annualRate: z
    .number()
    .finite()
    .min(rentalYieldBounds.annualRate.min)
    .max(rentalYieldBounds.annualRate.max),
  tenureYears: z
    .number()
    .int()
    .min(rentalYieldBounds.tenureYears.min)
    .max(rentalYieldBounds.tenureYears.max),
  acquisitionCostsPct: z
    .number()
    .finite()
    .min(rentalYieldBounds.acquisitionCostsPct.min)
    .max(rentalYieldBounds.acquisitionCostsPct.max),
});

export type RentalYieldFormState = z.infer<typeof rentalYieldSchema>;

// Defaults match the spec's Default-load I/O row exactly.
export const rentalYieldDefaults: RentalYieldFormState = {
  propertyPrice: 5_000_000, // ₹50,00,000
  monthlyRent: 12_500,
  propertyTaxPct: 0.5,
  maintenancePct: 1, // genuine adjustable input (India convention default), never hardcoded in compute.ts
  societyChargesMonthly: 2_000,
  vacancyMonths: 1,
  leverage: "off",
  downPaymentPct: 20,
  annualRate: 8.5,
  tenureYears: 20,
  acquisitionCostsPct: 3,
};
