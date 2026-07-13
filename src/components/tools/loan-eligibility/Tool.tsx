"use client";

import { useState } from "react";
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

export function LoanEligibilityTool() {
  const [state, patch] = useToolState(loanEligibilitySchema, loanEligibilityDefaults);
  const result = useMemo(() => compute(state), [state]);

  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-10">
      {/* ---- Controls (left) ---- */}
      <div className="space-y-7 md:col-span-5">
        <Slider
          label="Net monthly income (take-home)"
          value={state.netMonthlyIncome}
          min={loanEligibilityBounds.netMonthlyIncome.min}
          max={loanEligibilityBounds.netMonthlyIncome.max}
          step={loanEligibilityBounds.netMonthlyIncome.step}
          prefix="₹"
          hint={inrCompact(state.netMonthlyIncome)}
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
      </div>

      {/* ---- Result (right) ---- */}
      <div className="md:col-span-7">
        <div className="md:sticky md:top-24">
          <ResultCard eyebrow="Estimated loan eligibility">
            <p
              className="tab-num font-heading text-gold leading-none"
              style={{ fontSize: "clamp(40px, 7vw, 68px)" }}
            >
              {inrCompact(result.maxLoanAmount)}
            </p>
            <p className="font-body text-cream/60 mt-2 text-sm">
              maximum loan amount, at your chosen rate and tenure
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-cream/15 pt-6">
              <Stat label="Max new EMI you qualify for" value={inr(result.maxNewEmi)} dot="gold" />
              <Stat
                label="Total EMI allowed at your FOIR"
                value={inr(result.allowableTotalEmi)}
                dot="cream"
              />
            </dl>

            {result.existingEmiUsesFullFoir ? (
              <div className="mt-5 rounded-xl bg-gold/15 p-4">
                <p className="font-body text-sm text-cream">
                  Your existing EMIs already use up your entire allowable FOIR
                  at this income — a new loan wouldn&apos;t qualify unless
                  income rises, existing EMIs reduce, or a co-applicant&apos;s
                  income is added.
                </p>
              </div>
            ) : null}

            <p className="font-body text-cream/45 mt-5 text-xs leading-relaxed">
              This is a FOIR-based estimate, not a bank's actual underwriting
              decision. Real sanction also depends on your credit score,
              employment type, co-applicant income, age-based tenure caps, and
              each lender's own policy — treat this as a starting point for
              what you can realistically shop for, not an approved offer.
            </p>

            <ResultActions />
          </ResultCard>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  dot?: "gold" | "cream";
}) {
  return (
    <div>
      <dt className="font-body text-xs text-cream/55 flex items-center gap-1.5">
        {dot ? (
          <span
            aria-hidden
            className={`inline-block h-2 w-2 rounded-full ${
              dot === "gold" ? "bg-gold" : "bg-cream/70"
            }`}
          />
        ) : null}
        {label}
      </dt>
      <dd className="tab-num font-heading text-cream text-xl mt-1">{value}</dd>
    </div>
  );
}

function ResultActions() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-6 flex flex-wrap gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:bg-cream"
      >
        ⤓ Download PDF
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {
            /* clipboard unavailable — no-op */
          }
        }}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cream/25 px-5 py-2.5 font-body text-sm text-cream transition-colors hover:border-gold hover:text-gold"
      >
        {copied ? "Link copied ✓" : "⧉ Share"}
      </button>
    </div>
  );
}
