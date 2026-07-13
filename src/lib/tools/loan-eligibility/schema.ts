import { z } from "zod";

// zod input schema for the Loan Eligibility Calculator (AD-4). Bounds and
// defaults live here as the single source; the Slider UI and schema both
// read from `loanEligibilityBounds` so they can't drift apart.
//
// FOIR (Fixed Obligation to Income Ratio) is the standard Indian lender
// method: total EMI obligations (new + existing) are capped at a percentage
// of net monthly income. That percentage is a lender-policy choice, not a
// fixed law — hence it's a user-adjustable input here, not hardcoded.

export const loanEligibilityBounds = {
  netMonthlyIncome: { min: 10_000, max: 50_00_000, step: 1_000 },
  existingEmi: { min: 0, max: 10_00_000, step: 500 },
  annualRate: { min: 0, max: 20, step: 0.05 },
  tenureYears: { min: 1, max: 30, step: 1 },
  foirPercent: { min: 30, max: 70, step: 1 },
} as const;

export const loanEligibilitySchema = z.object({
  netMonthlyIncome: z
    .number()
    .finite()
    .min(loanEligibilityBounds.netMonthlyIncome.min)
    .max(loanEligibilityBounds.netMonthlyIncome.max),
  existingEmi: z
    .number()
    .finite()
    .min(loanEligibilityBounds.existingEmi.min)
    .max(loanEligibilityBounds.existingEmi.max),
  annualRate: z
    .number()
    .finite()
    .min(loanEligibilityBounds.annualRate.min)
    .max(loanEligibilityBounds.annualRate.max),
  tenureYears: z
    .number()
    .int()
    .min(loanEligibilityBounds.tenureYears.min)
    .max(loanEligibilityBounds.tenureYears.max),
  foirPercent: z
    .number()
    .finite()
    .min(loanEligibilityBounds.foirPercent.min)
    .max(loanEligibilityBounds.foirPercent.max),
});

export type LoanEligibilityFormState = z.infer<typeof loanEligibilitySchema>;

export const loanEligibilityDefaults: LoanEligibilityFormState = {
  netMonthlyIncome: 100_000,
  existingEmi: 0,
  annualRate: 8.5,
  tenureYears: 20,
  foirPercent: 50,
};
