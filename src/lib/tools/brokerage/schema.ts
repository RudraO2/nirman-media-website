import { z } from "zod";

// zod input schema for the Brokerage Calculator (AD-4). Bounds/defaults live
// here as the single source; Slider UI and schema both read
// `brokerageBounds` so they can't drift apart.
//
// Indian real estate brokerage convention (not a statutory rate, hence
// adjustable, not a data.ts table): sale deals commonly ~1-2% of property
// value; rental deals commonly one month's rent (sometimes half). GST at
// 18% applies when the broker/firm is GST-registered — optional toggle,
// not assumed.

export const brokerageBounds = {
  propertyValue: { min: 0, max: 1_000_000_000, step: 50_000 },
  brokeragePct: { min: 0, max: 5, step: 0.1 },
  monthlyRent: { min: 0, max: 2_000_000, step: 500 },
  customRentalPct: { min: 0, max: 10, step: 0.5 },
} as const;

export const brokerageSchema = z.object({
  dealType: z.enum(["sale", "rental"]),
  propertyValue: z
    .number()
    .finite()
    .min(brokerageBounds.propertyValue.min)
    .max(brokerageBounds.propertyValue.max),
  brokeragePct: z
    .number()
    .finite()
    .min(brokerageBounds.brokeragePct.min)
    .max(brokerageBounds.brokeragePct.max),
  monthlyRent: z
    .number()
    .finite()
    .min(brokerageBounds.monthlyRent.min)
    .max(brokerageBounds.monthlyRent.max),
  rentalMode: z.enum(["half-month", "one-month", "custom"]),
  customRentalPct: z
    .number()
    .finite()
    .min(brokerageBounds.customRentalPct.min)
    .max(brokerageBounds.customRentalPct.max),
  gstApplicable: z.boolean(),
});

export type BrokerageFormState = z.infer<typeof brokerageSchema>;

export const brokerageDefaults: BrokerageFormState = {
  dealType: "sale",
  propertyValue: 5_000_000,
  brokeragePct: 2,
  monthlyRent: 20_000,
  rentalMode: "one-month",
  customRentalPct: 8.33,
  gstApplicable: true,
};
