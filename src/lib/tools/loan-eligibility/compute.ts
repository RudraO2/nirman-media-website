import { principalForEmi } from "@/lib/tools/emi/compute";

// Pure loan-eligibility math (AD-4) — no React, no I/O. Standard Indian
// lender FOIR (Fixed Obligation to Income Ratio) method: cap total EMI
// obligations at a percentage of net monthly income, then back-solve the
// loan amount that EMI supports at the given rate/tenure (reusing the
// EMI-tool's inverse formula — see emi/compute.ts's principalForEmi).

export interface LoanEligibilityInput {
  netMonthlyIncome: number;
  existingEmi: number;
  annualRate: number;
  tenureYears: number;
  foirPercent: number;
}

export interface LoanEligibilityResult {
  allowableTotalEmi: number;
  maxNewEmi: number;
  maxLoanAmount: number;
  existingEmiUsesFullFoir: boolean;
}

export function compute(input: LoanEligibilityInput): LoanEligibilityResult {
  const { netMonthlyIncome, existingEmi, annualRate, tenureYears, foirPercent } = input;

  const allowableTotalEmi = (foirPercent / 100) * netMonthlyIncome;
  const maxNewEmi = Math.max(0, allowableTotalEmi - existingEmi);

  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  const maxLoanAmount = principalForEmi(maxNewEmi, r, n);

  return {
    allowableTotalEmi,
    maxNewEmi,
    maxLoanAmount,
    existingEmiUsesFullFoir: existingEmi >= allowableTotalEmi,
  };
}
