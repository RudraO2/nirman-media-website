"use client";

import { useMemo, useState } from "react";
import { compute } from "@/lib/tools/rental-yield/compute";
import {
  rentalYieldSchema,
  rentalYieldDefaults,
  rentalYieldBounds,
} from "@/lib/tools/rental-yield/schema";
import { useToolState } from "@/lib/tools/useToolState";
import { inr, inrCompact } from "@/lib/tools/format";
import { Slider } from "@/components/tools/_surface/Slider";
import { ResultCard } from "@/components/tools/_surface/ResultCard";
import { ResultStat } from "@/components/tools/_surface/ResultStat";
import { ResultActions } from "@/components/tools/_surface/ResultActions";
import { Disclosure } from "@/components/tools/_surface/Disclosure";
import { Switch } from "@/components/tools/_surface/Switch";
import { ToolLayout } from "@/components/tools/_surface/ToolLayout";

// Cost/assumption fields collapsed behind "Costs & assumptions" (progressive
// disclosure, mirrors rent-vs-buy's "Assumptions" section) — these are
// exactly the fields the honesty disclaimer below calls out as user-chosen
// inputs, not sourced facts.
const COST_KEYS = [
  "propertyTaxPct",
  "maintenancePct",
  "societyChargesMonthly",
  "vacancyMonths",
] as const;

export function RentalYieldTool() {
  const [state, patch] = useToolState(rentalYieldSchema, rentalYieldDefaults);
  const result = useMemo(() => compute(state), [state]);

  // Auto-open "Costs & assumptions" when a shared/bookmarked link already
  // carries a non-default cost input, so the control explaining WHY the net
  // yield differs from the out-of-the-box default isn't hidden behind a
  // collapsed <details> the user never clicked.
  const [costsOpen, setCostsOpen] = useState(() =>
    COST_KEYS.some((k) => state[k] !== rentalYieldDefaults[k])
  );

  const leverageOn = state.leverage === "on";

  return (
    <ToolLayout
      controls={
        <>
          <Slider
            label="Property price"
            value={state.propertyPrice}
            min={rentalYieldBounds.propertyPrice.min}
            max={rentalYieldBounds.propertyPrice.max}
            step={rentalYieldBounds.propertyPrice.step}
            prefix="₹"
            hint={inrCompact(state.propertyPrice)}
            presets={[2500000, 5000000, 7500000, 10000000]}
            onChange={(v) => patch({ propertyPrice: v })}
          />
          <Slider
            label="Expected monthly rent"
            value={state.monthlyRent}
            min={rentalYieldBounds.monthlyRent.min}
            max={rentalYieldBounds.monthlyRent.max}
            step={rentalYieldBounds.monthlyRent.step}
            prefix="₹"
            hint={inrCompact(state.monthlyRent)}
            onChange={(v) => patch({ monthlyRent: v })}
          />

          {/* Costs & assumptions — progressively disclosed. printExpand: these
              drive the printed net yield, so the PDF must carry them even
              while collapsed on screen; only the toggle icon is hidden in
              print, never the heading text. */}
          <Disclosure
            label="Costs & assumptions"
            sub="— tax, maintenance, society, vacancy"
            printExpand
            open={costsOpen}
            onToggle={setCostsOpen}
          >
            <div className="space-y-6">
              <Slider
                label="Property tax"
                value={state.propertyTaxPct}
                min={rentalYieldBounds.propertyTaxPct.min}
                max={rentalYieldBounds.propertyTaxPct.max}
                step={rentalYieldBounds.propertyTaxPct.step}
                suffix="% / yr"
                onChange={(v) => patch({ propertyTaxPct: v })}
              />
              <Slider
                label="Maintenance"
                value={state.maintenancePct}
                min={rentalYieldBounds.maintenancePct.min}
                max={rentalYieldBounds.maintenancePct.max}
                step={rentalYieldBounds.maintenancePct.step}
                suffix="% / yr"
                onChange={(v) => patch({ maintenancePct: v })}
              />
              <Slider
                label="Society / association charges"
                value={state.societyChargesMonthly}
                min={rentalYieldBounds.societyChargesMonthly.min}
                max={rentalYieldBounds.societyChargesMonthly.max}
                step={rentalYieldBounds.societyChargesMonthly.step}
                prefix="₹"
                suffix="/mo"
                onChange={(v) => patch({ societyChargesMonthly: v })}
              />
              <Slider
                label="Vacancy allowance"
                value={state.vacancyMonths}
                min={rentalYieldBounds.vacancyMonths.min}
                max={rentalYieldBounds.vacancyMonths.max}
                step={rentalYieldBounds.vacancyMonths.step}
                suffix="months/yr"
                onChange={(v) => patch({ vacancyMonths: v })}
              />
            </div>
          </Disclosure>

          <Switch
            label="Financing this with a home loan?"
            description={
              leverageOn
                ? "Yes — showing your leveraged returns below"
                : "No — cash purchase (switch on to model a loan)"
            }
            checked={leverageOn}
            onChange={(on) => patch({ leverage: on ? "on" : "off" })}
          />

          {leverageOn ? (
            <div className="space-y-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <p className="font-body text-[11px] font-medium tracking-wide text-emerald-700 uppercase">
                Loan details
              </p>
              <Slider
                label="Down payment"
                value={state.downPaymentPct}
                min={rentalYieldBounds.downPaymentPct.min}
                max={rentalYieldBounds.downPaymentPct.max}
                step={rentalYieldBounds.downPaymentPct.step}
                suffix="%"
                hint={`${inr(result.downPayment)} up front`}
                onChange={(v) => patch({ downPaymentPct: v })}
              />
              <Slider
                label="Interest rate (per year)"
                value={state.annualRate}
                min={rentalYieldBounds.annualRate.min}
                max={rentalYieldBounds.annualRate.max}
                step={rentalYieldBounds.annualRate.step}
                suffix="%"
                onChange={(v) => patch({ annualRate: v })}
              />
              <Slider
                label="Loan tenure"
                value={state.tenureYears}
                min={rentalYieldBounds.tenureYears.min}
                max={rentalYieldBounds.tenureYears.max}
                step={rentalYieldBounds.tenureYears.step}
                suffix="years"
                onChange={(v) => patch({ tenureYears: v })}
              />
              <Slider
                label="Acquisition costs (stamp duty, registration, brokerage, loan fees)"
                value={state.acquisitionCostsPct}
                min={rentalYieldBounds.acquisitionCostsPct.min}
                max={rentalYieldBounds.acquisitionCostsPct.max}
                step={rentalYieldBounds.acquisitionCostsPct.step}
                suffix="%"
                onChange={(v) => patch({ acquisitionCostsPct: v })}
              />
            </div>
          ) : null}
        </>
      }
      result={
        <ResultCard eyebrow="Your rental yield">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="font-body text-xs tracking-wide text-zinc-500 uppercase">
                Gross yield
              </p>
              <p
                className="tab-num font-body mt-1.5 font-semibold leading-none tracking-tight text-emerald-400"
                style={{ fontSize: "clamp(30px, 6vw, 46px)" }}
              >
                {result.grossYieldPct.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="font-body text-xs tracking-wide text-zinc-500 uppercase">
                Net yield (after real costs)
              </p>
              <p
                className="tab-num font-body mt-1.5 font-semibold leading-none tracking-tight text-white"
                style={{ fontSize: "clamp(30px, 6vw, 46px)" }}
              >
                {result.netYieldPct.toFixed(2)}%
              </p>
            </div>
          </div>

          <p className="font-body mt-4 text-sm leading-relaxed text-zinc-300">
            {result.benchmarkNote}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <YieldDonut kept={result.netAnnualIncome} total={result.annualRent} />
            <p className="font-body max-w-[220px] text-xs leading-relaxed text-zinc-400">
              Share of gross rent you actually keep after property tax,
              maintenance, society charges and vacancy.
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5">
            <ResultStat
              label="Annual rent"
              value={inrCompact(result.annualRent)}
              dot="plain"
            />
            <ResultStat
              label="Annual operating costs"
              value={inrCompact(result.annualOperatingCosts)}
              dot="accent"
            />
            <ResultStat
              label="Net annual income"
              value={inrCompact(result.netAnnualIncome)}
            />
          </dl>

          {leverageOn &&
          result.netYieldLeveragedPct !== null &&
          result.actualCashInvested !== null &&
          result.annualNetCashFlow !== null ? (
            <div className="mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-5">
              <p className="font-body text-[11px] font-medium tracking-wide text-emerald-300 uppercase">
                With your loan
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                <ResultStat
                  label="Net yield (leveraged)"
                  value={`${result.netYieldLeveragedPct.toFixed(2)}%`}
                  dot="accent"
                />
                <ResultStat
                  label="Cash-on-cash return"
                  value={
                    result.cashOnCashReturnPct !== null
                      ? `${result.cashOnCashReturnPct.toFixed(2)}%`
                      : "N/A — no cash in"
                  }
                  dot="accent"
                />
                <ResultStat label="Loan amount" value={inrCompact(result.loanAmount)} />
                <ResultStat label="Monthly EMI" value={inr(result.emi)} />
                <ResultStat
                  label="Cash invested"
                  value={inrCompact(result.actualCashInvested)}
                />
              </dl>
              <p className="font-body mt-4 text-xs leading-relaxed text-zinc-400">
                These are two different answers, deliberately not conflated:
                net yield (leveraged) still divides by the full property
                price — only year-1 interest changes it. Cash-on-cash
                return divides by your actual cash in (down payment +
                acquisition costs) and subtracts the full EMI, so it can
                swing far more sharply.
              </p>
            </div>
          ) : null}

          <p className="font-body mt-5 text-xs leading-relaxed text-zinc-500">
            Every figure in Costs &amp; assumptions — property tax,
            maintenance, society charges and vacancy — and the loan fields
            above, if you&apos;ve turned financing on, is an input
            you&apos;re choosing, not a sourced fact. The ~2–3.5% benchmark
            band is a general, informally-cited reference range, not an
            official statistic, and will vary by city and market. This
            calculator doesn&apos;t model income tax on rental income,
            capital gains on an eventual sale, or a negotiated/below-market
            rent. This is not financial advice.
          </p>

          <ResultActions />
        </ResultCard>
      }
    />
  );
}

// Hand-drawn SVG donut — net income kept vs. operating costs, as a share of
// gross rent. No charting library. When operating costs meet or exceed rent
// (net income <= 0) the "kept" arc clamps to 0 — there's no such thing as a
// negative slice — and the whole ring reads as "cost", an honest (if blunt)
// way to show a yield-negative scenario.
function YieldDonut({ kept, total }: { kept: number; total: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const keptFrac = total > 0 ? Math.max(0, Math.min(1, kept / total)) : 0;
  const keptLen = c * keptFrac;

  return (
    <svg
      width="108"
      height="108"
      viewBox="0 0 116 116"
      role="img"
      aria-label="Net income kept versus operating costs, as a share of gross rent"
    >
      <g transform="rotate(-90 58 58)">
        {/* operating costs (full ring, accent) */}
        <circle cx="58" cy="58" r={r} fill="none" stroke="var(--color-emerald-500)" strokeWidth="14" />
        {/* net income kept (white) drawn over it */}
        <circle
          cx="58"
          cy="58"
          r={r}
          fill="none"
          stroke="#fff"
          strokeWidth="14"
          strokeDasharray={`${keptLen} ${c - keptLen}`}
          strokeLinecap="butt"
          style={{ transition: "stroke-dasharray 500ms var(--ease-out-quart)" }}
        />
      </g>
      <text
        x="58"
        y="54"
        textAnchor="middle"
        className="tab-num"
        fill="#fff"
        fontSize="15"
        fontWeight="600"
      >
        {Math.round(keptFrac * 100)}%
      </text>
      <text x="58" y="70" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.6">
        kept
      </text>
    </svg>
  );
}
