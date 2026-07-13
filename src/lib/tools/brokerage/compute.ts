// Pure brokerage math (AD-4) — no React, no I/O.

export interface BrokerageInput {
  dealType: "sale" | "rental";
  propertyValue: number;
  brokeragePct: number;
  monthlyRent: number;
  rentalMode: "half-month" | "one-month" | "custom";
  customRentalPct: number;
  gstApplicable: boolean;
}

export interface BrokerageResult {
  baseBrokerage: number;
  gstAmount: number;
  totalBrokerage: number;
}

const GST_RATE = 0.18;

export function compute(input: BrokerageInput): BrokerageResult {
  const {
    dealType,
    propertyValue,
    brokeragePct,
    monthlyRent,
    rentalMode,
    customRentalPct,
    gstApplicable,
  } = input;

  let baseBrokerage: number;
  if (dealType === "sale") {
    baseBrokerage = propertyValue * (brokeragePct / 100);
  } else {
    if (rentalMode === "half-month") baseBrokerage = monthlyRent * 0.5;
    else if (rentalMode === "one-month") baseBrokerage = monthlyRent;
    else baseBrokerage = monthlyRent * (customRentalPct / 100);
  }

  const gstAmount = gstApplicable ? baseBrokerage * GST_RATE : 0;

  return {
    baseBrokerage,
    gstAmount,
    totalBrokerage: baseBrokerage + gstAmount,
  };
}
