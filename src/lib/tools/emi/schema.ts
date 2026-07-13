import { z } from "zod";

// zod input schema for the EMI tool (AD-4). Bounds keep the UI + URL state sane.
export const emiSchema = z.object({
  principal: z.number().min(50_000).max(500_000_000),
  annualRate: z.number().min(0.1).max(30),
  tenureMonths: z.number().int().min(1).max(360),
  prepayAmount: z.number().min(0).max(500_000_000),
  prepayMode: z.enum(["none", "onetime", "monthly"]),
});

export type EmiFormState = z.infer<typeof emiSchema>;

export const emiDefaults: EmiFormState = {
  principal: 5_000_000, // ₹50,00,000
  annualRate: 8.5,
  tenureMonths: 240, // 20 years
  prepayAmount: 0,
  prepayMode: "none",
};

// Slider bounds for the UI (kept next to the schema so they stay in sync).
export const emiBounds = {
  principal: { min: 100_000, max: 100_000_000, step: 50_000 },
  annualRate: { min: 5, max: 20, step: 0.05 },
  tenureYears: { min: 1, max: 30, step: 1 },
};
