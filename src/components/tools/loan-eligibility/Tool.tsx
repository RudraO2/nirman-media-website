"use client";

import { useMemo } from "react";
import { compute } from "@/lib/tools/loan-eligibility/compute";
import {
  loanEligibilitySchema,
  loanEligibilityDefaults,
  loanEligibilityBounds,
} from "@/lib/tools/loan-eligibility/schema";
import { useToolState } from "@/lib/tools/useToolState";
import { inr, inrCompact } from "@/lib/tools/format";
import { Slider } from "@/components/tools/_surface/Slider";
import { ResultCard } from "@/components/tools/_surface/ResultCard";
import { ResultValue } from "@/components/tools/_surface/ResultValue";
import { ResultStat } from "@/components/tools/_surface/ResultStat";
import { ResultActions } from "@/components/tools/_surface/ResultActions";
import { ToolLayout } from "@/components/tools/_surface/ToolLayout";

export function LoanEligibilityTool() {
  const [state, patch] = useToolState(loanEligibilitySchema, loanEligibilityDefaults);
  const result = useMemo(() => compute(state), [state]);

  return (
    <ToolLayout
      controls={
        <>
          <Slider
            label="Net monthly income (take-home)"
            value={state.netMonthlyIncome}
            min={loanEligibilityBounds.netMonthlyIncome.min}
            max={loanEligibilityBounds.netMonthlyIncome.max}
            step={loanEligibilityBounds.netMonthlyIncome.step}
            prefix="₹"
            hint={inrCompact(state.netMonthlyIncome)}
            presets={[50000, 100000, 150000, 250000]}
            onChange={(v) => patch({ netMonthlyIncome: v })}
          />
          <Slider
            label="Existing EMIs (loans, cards, etc.)"
            value={state.existingEmi}
            min={loanEligibilityBounds.existingEmi.min}
            max={loanEligibilityBounds.existingEmi.max}
            step={loanEligibilityBounds.existingEmi.step}
            prefix="₹"
            suffix="/mo"
            onChange={(v) => patch({ existingEmi: v })}
          />
          <Slider
            label="Interest rate (per year)"
            value={state.annualRate}
            min={loanEligibilityBounds.annualRate.min}
            max={loanEligibilityBounds.annualRate.max}
            step={loanEligibilityBounds.annualRate.step}
            suffix="%"
            onChange={(v) => patch({ annualRate: v })}
          />
          <Slider
            label="Tenure"
            value={state.tenureYears}
            min={loanEligibilityBounds.tenureYears.min}
            max={loanEligibilityBounds.tenureYears.max}
            step={loanEligibilityBounds.tenureYears.step}
            suffix="years"
            onChange={(v) => patch({ tenureYears: v })}
          />
          <Slider
            label="FOIR — % of income lenders allow for EMIs"
            value={state.foirPercent}
            min={loanEligibilityBounds.foirPercent.min}
            max={loanEligibilityBounds.foirPercent.max}
            step={loanEligibilityBounds.foirPercent.step}
            suffix="%"
            hint="Most lenders use 40–50%; adjust if you know yours"
            onChange={(v) => patch({ foirPercent: v })}
          />
        </>
      }
      result={
        <ResultCard eyebrow="Estimated loan eligibility">
          <ResultValue
            value={inrCompact(result.maxLoanAmount)}
            caption="maximum loan amount, at your chosen rate and tenure"
          />

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5">
            <ResultStat
              label="Max new EMI you qualify for"
              value={inr(result.maxNewEmi)}
              dot="accent"
            />
            <ResultStat
              label="Total EMI allowed at your FOIR"
              value={inr(result.allowableTotalEmi)}
              dot="plain"
            />
          </dl>

          {result.existingEmiUsesFullFoir ? (
            <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
              <p className="font-body text-sm text-zinc-200">
                Your existing EMIs already use up your entire allowable FOIR
                at this income — a new loan wouldn&apos;t qualify unless
                income rises, existing EMIs reduce, or a co-applicant&apos;s
                income is added.
              </p>
            </div>
          ) : null}

          <p className="font-body mt-5 text-xs leading-relaxed text-zinc-500">
            This is a FOIR-based estimate, not a bank's actual underwriting
            decision. Real sanction also depends on your credit score,
            employment type, co-applicant income, age-based tenure caps, and
            each lender's own policy — treat this as a starting point for
            what you can realistically shop for, not an approved offer.
          </p>

          <ResultActions />
        </ResultCard>
      }
    />
  );
}
