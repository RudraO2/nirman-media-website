"use client";

import { useMemo, useState } from "react";
import { compute } from "@/lib/tools/emi/compute";
import { emiSchema, emiDefaults, emiBounds } from "@/lib/tools/emi/schema";
import { useToolState } from "@/lib/tools/useToolState";
import { inr, inrCompact, formatMonths } from "@/lib/tools/format";
import { Slider } from "@/components/tools/_surface/Slider";
import { InputField } from "@/components/tools/_surface/InputField";
import { ResultCard } from "@/components/tools/_surface/ResultCard";

export function EmiTool() {
  const [state, patch] = useToolState(emiSchema, emiDefaults);
  const result = useMemo(() => compute(state), [state]);

  const tenureYears = Math.round(state.tenureMonths / 12);
  const prepayOn = state.prepayMode !== "none" && state.prepayAmount > 0;

  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-10">
      {/* ---- Controls (left) ---- */}
      <div className="space-y-7 md:col-span-5">
        <Slider
          label="Loan amount"
          value={state.principal}
          min={emiBounds.principal.min}
          max={emiBounds.principal.max}
          step={emiBounds.principal.step}
          prefix="₹"
          hint={inrCompact(state.principal)}
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
        <details className="group rounded-xl border border-line bg-cream-warm/50 p-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between font-body text-sm font-medium text-ink">
            <span>
              Add prepayment{" "}
              <span className="text-ink/50">— see what you save</span>
            </span>
            <span
              aria-hidden
              className="text-gold transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-5 space-y-4">
            <div className="flex gap-2">
              {(["onetime", "monthly"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() =>
                    patch({
                      prepayMode: state.prepayMode === mode ? "none" : mode,
                      prepayAmount:
                        state.prepayAmount > 0 ? state.prepayAmount : 500000,
                    })
                  }
                  className={`flex-1 rounded-lg border px-3 py-2 font-body text-sm transition-colors ${
                    state.prepayMode === mode
                      ? "border-gold bg-gold/15 text-ink"
                      : "border-line text-ink/60 hover:border-ink/30"
                  }`}
                >
                  {mode === "onetime" ? "One-time" : "Every month"}
                </button>
              ))}
            </div>
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
        </details>
      </div>

      {/* ---- Result (right) ---- */}
      <div className="md:col-span-7">
        <div className="md:sticky md:top-24">
          <ResultCard eyebrow="Your monthly EMI">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="tab-num font-heading text-gold leading-none" style={{ fontSize: "clamp(40px, 7vw, 68px)" }}>
                  {inr(result.emi)}
                </p>
                <p className="font-body text-cream/60 mt-2 text-sm">per month</p>
              </div>
              <Donut
                principal={state.principal}
                interest={result.totalInterest}
              />
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-cream/15 pt-6">
              <Stat label="Principal" value={inrCompact(state.principal)} dot="cream" />
              <Stat label="Total interest" value={inrCompact(result.totalInterest)} dot="gold" />
              <Stat label="Total payment" value={inrCompact(result.totalPayment)} />
              <Stat label="Tenure" value={`${tenureYears} years`} />
            </dl>

            <p className="font-body text-cream/70 mt-5 text-sm leading-relaxed">
              Over {tenureYears} years you pay{" "}
              <span className="text-cream">{inrCompact(result.totalInterest)}</span>{" "}
              in interest —{" "}
              {(result.totalInterest / state.principal).toFixed(2)}× the loan
              itself.
            </p>

            {prepayOn && result.prepay ? (
              <div className="mt-5 rounded-xl bg-gold/15 p-4">
                <p className="font-body text-sm text-cream">
                  With this prepayment you finish{" "}
                  <span className="font-medium text-gold">
                    {formatMonths(result.prepay.monthsSaved)} early
                  </span>{" "}
                  and save{" "}
                  <span className="font-medium text-gold">
                    {inrCompact(result.prepay.interestSaved)}
                  </span>{" "}
                  in interest.
                </p>
              </div>
            ) : null}

            <p className="font-body text-cream/45 mt-5 text-xs leading-relaxed">
              Floating-rate estimate. Most Indian home loans are linked to the
              repo rate (RLLR), so your actual EMI or tenure can change when the
              benchmark resets.
            </p>

            <ResultActions />
          </ResultCard>

          {/* Amortization — collapsed, below the result */}
          <AmortizationTable
            schedule={result.schedule}
            emi={result.emi}
          />
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

// Hand-drawn SVG donut — principal vs interest. No charting library.
function Donut({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  const r = 46;
  const c = 2 * Math.PI * r;
  const principalFrac = total > 0 ? principal / total : 1;
  const principalLen = c * principalFrac;

  return (
    <svg
      width="116"
      height="116"
      viewBox="0 0 116 116"
      role="img"
      aria-label="Principal versus interest split"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}
    >
      <g transform="rotate(-90 58 58)">
        {/* interest (full ring, gold) */}
        <circle cx="58" cy="58" r={r} fill="none" stroke="var(--color-gold)" strokeWidth="14" />
        {/* principal arc (cream) drawn over it */}
        <circle
          cx="58"
          cy="58"
          r={r}
          fill="none"
          stroke="var(--color-cream)"
          strokeWidth="14"
          strokeDasharray={`${principalLen} ${c - principalLen}`}
          strokeLinecap="butt"
          style={{ transition: "stroke-dasharray 500ms var(--ease-out-quart)" }}
        />
      </g>
      <text x="58" y="54" textAnchor="middle" className="tab-num" fill="var(--color-cream)" fontSize="15" fontWeight="600">
        {Math.round(principalFrac * 100)}%
      </text>
      <text x="58" y="70" textAnchor="middle" fill="var(--color-cream)" fontSize="8" opacity="0.6">
        principal
      </text>
    </svg>
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
    <details className="group mt-4 rounded-2xl border border-line bg-cream [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-body text-sm font-medium text-ink">
        <span>Amortization schedule (year by year)</span>
        <span aria-hidden className="text-gold transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="overflow-x-auto px-5 pb-5">
        <table className="w-full min-w-[520px] border-collapse text-right">
          <thead>
            <tr className="border-b border-line text-ink/55">
              <th className="py-2 text-left font-body text-xs font-medium">Year</th>
              <th className="py-2 font-body text-xs font-medium">Principal paid</th>
              <th className="py-2 font-body text-xs font-medium">Interest paid</th>
              <th className="py-2 font-body text-xs font-medium">Balance left</th>
            </tr>
          </thead>
          <tbody className="tab-num font-body text-sm text-ink/80">
            {years.map((y) => (
              <tr key={y.year} className="border-b border-line/60">
                <td className="py-2 text-left">{y.year}</td>
                <td className="py-2">{inr(y.principal)}</td>
                <td className="py-2">{inr(y.interest)}</td>
                <td className="py-2">{inr(y.closing)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="tab-num mt-3 font-body text-xs text-ink/45">
          Based on a level EMI of {inr(emi)} / month.
        </p>
      </div>
    </details>
  );
}
