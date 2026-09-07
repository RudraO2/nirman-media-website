"use client";

import { useMemo } from "react";
import { compute } from "@/lib/tools/emi/compute";
import { emiSchema, emiDefaults, emiBounds } from "@/lib/tools/emi/schema";
import { useToolState } from "@/lib/tools/useToolState";
import { inr, inrCompact, formatMonths } from "@/lib/tools/format";
import { Slider } from "@/components/tools/_surface/Slider";
import { InputField } from "@/components/tools/_surface/InputField";
import { ResultCard } from "@/components/tools/_surface/ResultCard";
import { ResultValue } from "@/components/tools/_surface/ResultValue";
import { ResultStat } from "@/components/tools/_surface/ResultStat";
import { ResultActions } from "@/components/tools/_surface/ResultActions";
import { Disclosure } from "@/components/tools/_surface/Disclosure";
import { SegmentedControl } from "@/components/tools/_surface/SegmentedControl";
import { ToolLayout } from "@/components/tools/_surface/ToolLayout";

export function EmiTool() {
  const [state, patch] = useToolState(emiSchema, emiDefaults);
  const result = useMemo(() => compute(state), [state]);

  const tenureYears = Math.round(state.tenureMonths / 12);
  const prepayOn = state.prepayMode !== "none" && state.prepayAmount > 0;

  return (
    <ToolLayout
      controls={
        <>
          <Slider
            label="Loan amount"
            value={state.principal}
            min={emiBounds.principal.min}
            max={emiBounds.principal.max}
            step={emiBounds.principal.step}
            prefix="₹"
            hint={inrCompact(state.principal)}
            presets={[2500000, 5000000, 7500000, 10000000]}
            onChange={(v) => patch({ principal: v })}
          />
          <Slider
            label="Interest rate (per year)"
            value={state.annualRate}
            min={emiBounds.annualRate.min}
            max={emiBounds.annualRate.max}
            step={emiBounds.annualRate.step}
            suffix="%"
            onChange={(v) => patch({ annualRate: v })}
          />
          <Slider
            label="Tenure"
            value={tenureYears}
            min={emiBounds.tenureYears.min}
            max={emiBounds.tenureYears.max}
            step={emiBounds.tenureYears.step}
            suffix="years"
            onChange={(v) => patch({ tenureMonths: v * 12 })}
          />

          {/* Prepayment — the differentiator, hidden until wanted */}
          <Disclosure label="Add prepayment" sub="— see what you save">
            <div className="space-y-4">
              <SegmentedControl
                options={[
                  { value: "onetime", label: "One-time" },
                  { value: "monthly", label: "Every month" },
                ]}
                value={state.prepayMode === "none" ? null : state.prepayMode}
                onChange={(mode) =>
                  patch({
                    prepayMode: state.prepayMode === mode ? "none" : mode,
                    prepayAmount:
                      state.prepayAmount > 0 ? state.prepayAmount : 500000,
                  })
                }
              />
              {state.prepayMode !== "none" ? (
                <InputField
                  label={
                    state.prepayMode === "monthly"
                      ? "Extra per month"
                      : "One-time prepayment"
                  }
                  value={state.prepayAmount}
                  min={0}
                  step={10000}
                  prefix="₹"
                  onChange={(v) => patch({ prepayAmount: v })}
                />
              ) : null}
            </div>
          </Disclosure>
        </>
      }
      result={
        <>
          <ResultCard eyebrow="Your monthly EMI">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <ResultValue value={inr(result.emi)} caption="per month" />
              <Donut
                principal={state.principal}
                interest={result.totalInterest}
              />
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5">
              <ResultStat
                label="Principal"
                value={inrCompact(state.principal)}
                dot="plain"
              />
              <ResultStat
                label="Total interest"
                value={inrCompact(result.totalInterest)}
                dot="accent"
              />
              <ResultStat
                label="Total payment"
                value={inrCompact(result.totalPayment)}
              />
              <ResultStat label="Tenure" value={`${tenureYears} years`} />
            </dl>

            <p className="font-body mt-5 text-sm leading-relaxed text-zinc-300">
              Over {tenureYears} years you pay{" "}
              <span className="text-white">
                {inrCompact(result.totalInterest)}
              </span>{" "}
              in interest —{" "}
              {(result.totalInterest / state.principal).toFixed(2)}× the loan
              itself.
            </p>

            {prepayOn && result.prepay ? (
              <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
                <p className="font-body text-sm text-zinc-200">
                  With this prepayment you finish{" "}
                  <span className="font-medium text-emerald-300">
                    {formatMonths(result.prepay.monthsSaved)} early
                  </span>{" "}
                  and save{" "}
                  <span className="font-medium text-emerald-300">
                    {inrCompact(result.prepay.interestSaved)}
                  </span>{" "}
                  in interest.
                </p>
              </div>
            ) : null}

            <p className="font-body mt-5 text-xs leading-relaxed text-zinc-500">
              Floating-rate estimate. Most Indian home loans are linked to the
              repo rate (RLLR), so your actual EMI or tenure can change when the
              benchmark resets.
            </p>

            <ResultActions />
          </ResultCard>

          {/* Amortization — collapsed, below the result */}
          <AmortizationTable schedule={result.schedule} emi={result.emi} />
        </>
      }
    />
  );
}

// Hand-drawn SVG donut — principal vs interest. No charting library.
function Donut({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  const r = 46;
  const c = 2 * Math.PI * r;
  const principalFrac = total > 0 ? principal / total : 1;
  const principalLen = c * principalFrac;

  return (
    <svg
      width="108"
      height="108"
      viewBox="0 0 116 116"
      role="img"
      aria-label="Principal versus interest split"
    >
      <g transform="rotate(-90 58 58)">
        {/* interest (full ring, accent) */}
        <circle cx="58" cy="58" r={r} fill="none" stroke="var(--color-emerald-500)" strokeWidth="14" />
        {/* principal arc (white) drawn over it */}
        <circle
          cx="58"
          cy="58"
          r={r}
          fill="none"
          stroke="#fff"
          strokeWidth="14"
          strokeDasharray={`${principalLen} ${c - principalLen}`}
          strokeLinecap="butt"
          style={{ transition: "stroke-dasharray 500ms var(--ease-out-quart)" }}
        />
      </g>
      <text x="58" y="54" textAnchor="middle" className="tab-num" fill="#fff" fontSize="15" fontWeight="600">
        {Math.round(principalFrac * 100)}%
      </text>
      <text x="58" y="70" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.6">
        principal
      </text>
    </svg>
  );
}

function AmortizationTable({
  schedule,
  emi,
}: {
  schedule: { month: number; interest: number; principal: number; closingBalance: number }[];
  emi: number;
}) {
  // Aggregate to a yearly view to keep it scannable.
  const years = useMemo(() => {
    const rows: {
      year: number;
      interest: number;
      principal: number;
      closing: number;
    }[] = [];
    schedule.forEach((row) => {
      const y = Math.ceil(row.month / 12);
      let acc = rows[y - 1];
      if (!acc) {
        acc = { year: y, interest: 0, principal: 0, closing: 0 };
        rows[y - 1] = acc;
      }
      acc.interest += row.interest;
      acc.principal += row.principal;
      acc.closing = row.closingBalance;
    });
    return rows;
  }, [schedule]);

  return (
    <div className="mt-4">
      <Disclosure label="Amortization schedule" sub="— year by year">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-right">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="py-2 text-left font-body text-xs font-medium">Year</th>
                <th className="py-2 font-body text-xs font-medium">Principal paid</th>
                <th className="py-2 font-body text-xs font-medium">Interest paid</th>
                <th className="py-2 font-body text-xs font-medium">Balance left</th>
              </tr>
            </thead>
            <tbody className="tab-num font-body text-sm text-zinc-700">
              {years.map((y) => (
                <tr key={y.year} className="border-b border-zinc-100">
                  <td className="py-2 text-left">{y.year}</td>
                  <td className="py-2">{inr(y.principal)}</td>
                  <td className="py-2">{inr(y.interest)}</td>
                  <td className="py-2">{inr(y.closing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="tab-num font-body mt-3 text-xs text-zinc-500">
            Based on a level EMI of {inr(emi)} / month.
          </p>
        </div>
      </Disclosure>
    </div>
  );
}
