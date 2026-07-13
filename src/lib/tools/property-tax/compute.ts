// Pure property-tax math (AD-4) — no React, no I/O. Straightforward
// arithmetic on user-supplied figures (see schema.ts header for why there's
// no city-specific rate table here).

export interface PropertyTaxInput {
  annualValue: number;
  taxRatePct: number;
  rebatePct: number;
  cessPct: number;
}

export interface PropertyTaxResult {
  baseTax: number;
  rebateAmount: number;
  cessAmount: number;
  netTaxPayable: number;
}

export function compute(input: PropertyTaxInput): PropertyTaxResult {
  const { annualValue, taxRatePct, rebatePct, cessPct } = input;

  const baseTax = annualValue * (taxRatePct / 100);
  const rebateAmount = baseTax * (rebatePct / 100);
  const cessAmount = baseTax * (cessPct / 100);
  const netTaxPayable = Math.max(0, baseTax - rebateAmount + cessAmount);

  return { baseTax, rebateAmount, cessAmount, netTaxPayable };
}
