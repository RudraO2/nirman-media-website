"use client";

import { useMemo, useState } from "react";
import { compute } from "@/lib/tools/rent-vs-buy/compute";
import type { RentVsBuyYearRow } from "@/lib/tools/rent-vs-buy/compute";
import {
  rentVsBuySchema,
  rentVsBuyDefaults,
  rentVsBuyBounds,
} from "@/lib/tools/rent-vs-buy/schema";
import { useToolState } from "@/lib/tools/useToolState";
import { inr, inrCompact } from "@/lib/tools/format";
import { Slider } from "@/components/tools/_surface/Slider";
import { ResultCard } from "@/components/tools/_surface/ResultCard";
import { ResultStat } from "@/components/tools/_surface/ResultStat";
import { ResultActions } from "@/components/tools/_surface/ResultActions";
import { Disclosure } from "@/components/tools/_surface/Disclosure";
import { ToolLayout } from "@/components/tools/_surface/ToolLayout";

// Assumption fields collapsed behind "Assumptions" (progressive disclosure,
// mirrors EMI's collapsible prepayment section / stamp-duty's collapsible
// DLC section) — these are exactly the fields the honesty disclaimer below
// refers to as user-chosen estimates, not sourced facts.
const ASSUMPTION_KEYS = [
  "propertyTaxPct",
  "maintenancePct",
  "appreciationPct",
  "rentEscalationPct",
  "investmentReturnPct",
  "sellingCostPct",
] as const;

export function RentVsBuyTool() {
  const [state, patch] = useToolState(rentVsBuySchema, rentVsBuyDefaults);
  const result = useMemo(() => compute(state), [state]);

  // Auto-open the Assumptions section when a shared/bookmarked link already
  // carries a non-default assumption, so the control explaining WHY the
  // verdict differs from the out-of-the-box defaults isn't hidden behind a
  // collapsed <details> the user never clicked. Seeded once from the initial
  // state, then freely toggle-able afterward.
  const [assumptionsOpen, setAssumptionsOpen] = useState(() =>
    ASSUMPTION_KEYS.some((k) => state[k] !== rentVsBuyDefaults[k])
  );

  return (
    <ToolLayout
      controls={
        <>
          <Slider
            label="Home price"
            value={state.homePrice}
            min={rentVsBuyBounds.homePrice.min}
            max={rentVsBuyBounds.homePrice.max}
            step={rentVsBuyBounds.homePrice.step}
            prefix="₹"
            hint={inrCompact(state.homePrice)}
            presets={[2500000, 5000000, 7500000, 10000000]}
            onChange={(v) => patch({ homePrice: v })}
          />
          <Slider
            label="Down payment"
            value={state.downPaymentPct}
            min={rentVsBuyBounds.downPaymentPct.min}
            max={rentVsBuyBounds.downPaymentPct.max}
            step={rentVsBuyBounds.downPaymentPct.step}
            suffix="%"
            hint={`${inr(result.downPayment)} up front`}
            onChange={(v) => patch({ downPaymentPct: v })}
          />
          <Slider
            label="Interest rate (per year)"
            value={state.annualRate}
            min={rentVsBuyBounds.annualRate.min}
            max={rentVsBuyBounds.annualRate.max}
            step={rentVsBuyBounds.annualRate.step}
            suffix="%"
            onChange={(v) => patch({ annualRate: v })}
          />
          <Slider
            label="Loan tenure"
            value={state.tenureYears}
            min={rentVsBuyBounds.tenureYears.min}
            max={rentVsBuyBounds.tenureYears.max}
            step={rentVsBuyBounds.tenureYears.step}
            suffix="years"
            onChange={(v) => patch({ tenureYears: v })}
          />
          <Slider
            label="Monthly rent (equivalent home)"
            value={state.monthlyRent}
            min={rentVsBuyBounds.monthlyRent.min}
            max={rentVsBuyBounds.monthlyRent.max}
            step={rentVsBuyBounds.monthlyRent.step}
            prefix="₹"
            hint={inrCompact(state.monthlyRent)}
            onChange={(v) => patch({ monthlyRent: v })}
          />
          <Slider
            label="Comparison horizon"
            value={state.horizonYears}
            min={rentVsBuyBounds.horizonYears.min}
            max={rentVsBuyBounds.horizonYears.max}
            step={rentVsBuyBounds.horizonYears.step}
            suffix="years"
            onChange={(v) => patch({ horizonYears: v })}
          />

          {/* Assumptions — progressively disclosed, the fields the honesty
              disclaimer explicitly calls out as estimates, not facts.
              printExpand: these drive the printed verdict, so the PDF must
              carry them even while collapsed on screen. */}
          <Disclosure
            label="Assumptions"
            sub="— appreciation, rent growth, returns"
            printExpand
            open={assumptionsOpen}
            onToggle={setAssumptionsOpen}
          >
            <div className="space-y-6">
              <Slider
                label="Property tax"
                value={state.propertyTaxPct}
                min={rentVsBuyBounds.propertyTaxPct.min}
                max={rentVsBuyBounds.propertyTaxPct.max}
                step={rentVsBuyBounds.propertyTaxPct.step}
                suffix="% / yr"
                onChange={(v) => patch({ propertyTaxPct: v })}
              />
              <Slider
                label="Maintenance"
                value={state.maintenancePct}
                min={rentVsBuyBounds.maintenancePct.min}
                max={rentVsBuyBounds.maintenancePct.max}
                step={rentVsBuyBounds.maintenancePct.step}
                suffix="% / yr"
                onChange={(v) => patch({ maintenancePct: v })}
              />
              <Slider
                label="Home appreciation"
                value={state.appreciationPct}
                min={rentVsBuyBounds.appreciationPct.min}
                max={rentVsBuyBounds.appreciationPct.max}
                step={rentVsBuyBounds.appreciationPct.step}
                suffix="% / yr"
                onChange={(v) => patch({ appreciationPct: v })}
              />
              <Slider
                label="Rent escalation"
                value={state.rentEscalationPct}
                min={rentVsBuyBounds.rentEscalationPct.min}
                max={rentVsBuyBounds.rentEscalationPct.max}
                step={rentVsBuyBounds.rentEscalationPct.step}
                suffix="% / yr"
                onChange={(v) => patch({ rentEscalationPct: v })}
              />
              <Slider
                label="Return if you invested the difference"
                value={state.investmentReturnPct}
                min={rentVsBuyBounds.investmentReturnPct.min}
                max={rentVsBuyBounds.investmentReturnPct.max}
                step={rentVsBuyBounds.investmentReturnPct.step}
                suffix="% / yr"
                onChange={(v) => patch({ investmentReturnPct: v })}
              />
              <Slider
                label="Selling cost at exit"
                value={state.sellingCostPct}
                min={rentVsBuyBounds.sellingCostPct.min}
                max={rentVsBuyBounds.sellingCostPct.max}
                step={rentVsBuyBounds.sellingCostPct.step}
                suffix="%"
                onChange={(v) => patch({ sellingCostPct: v })}
              />
            </div>
          </Disclosure>
        </>
      }
      result={
        <ResultCard eyebrow="Your verdict">
          <p
            className="font-body font-semibold leading-tight tracking-tight text-emerald-400"
            style={{ fontSize: "clamp(24px, 5vw, 34px)" }}
          >
            {result.verdict}
          </p>
          <p className="font-body mt-3 text-sm text-zinc-400">
            Over {state.horizonYears} years — EMI{" "}
            <span className="tab-num text-white">{inr(result.emi)}</span>
            /mo on a{" "}
            <span className="tab-num text-white">
              {inrCompact(result.loanAmount)}
            </span>{" "}
            loan
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-5">
            <div className="space-y-4">
              <p className="font-body text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                Owning
              </p>
              <dl className="grid grid-cols-1 gap-4">
                <ResultStat
                  label="Down payment"
                  value={inrCompact(result.downPayment)}
                  dot="plain"
                />
                <ResultStat
                  label="Loan amount"
                  value={inrCompact(result.loanAmount)}
                />
                <ResultStat label="Monthly EMI" value={inr(result.emi)} dot="accent" />
                <ResultStat
                  label="Total paid over horizon"
                  value={inrCompact(result.totalOwnerCashOutflow)}
                />
                <ResultStat
                  label="Home equity at horizon (before selling cost)"
                  value={inrCompact(result.homeEquityAtHorizon)}
                  dot="accent"
                />
              </dl>
            </div>
            <div className="space-y-4">
              <p className="font-body text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                Renting + investing the difference
              </p>
              <dl className="grid grid-cols-1 gap-4">
                <ResultStat
                  label="Total rent paid"
                  value={inrCompact(result.totalRenterCashOutflow)}
                />
                <ResultStat
                  label="Investment value at horizon"
                  value={inrCompact(result.investmentValueAtHorizon)}
                  dot="plain"
                />
              </dl>
            </div>
          </div>

          <p className="font-body mt-5 text-sm leading-relaxed text-zinc-300">
            By year {state.horizonYears}, buying&apos;s net cost (cash spent
            minus wealth retained) comes to{" "}
            <span className="text-white">{inrCompact(result.netOwnerCost)}</span>
            , against renting-and-investing&apos;s net{" "}
            <span className="text-white">{inrCompact(result.netRenterCost)}</span>
            . This reflects the trajectory for the numbers you&apos;ve
            entered, not a guaranteed permanent lead — a close race can
            still narrow or swap over a longer or shorter horizon.
          </p>

          <NetCostChart yearly={result.yearly} breakevenYear={result.breakevenYear} />

          <YearlyTable yearly={result.yearly} />

          <p className="font-body mt-5 text-xs leading-relaxed text-zinc-500">
            Every figure in Assumptions — property tax, maintenance,
            appreciation, rent growth, investment return and selling cost —
            is an estimate you&apos;re choosing, not a fact; the breakeven
            year and verdict above will move if you change any of them.
            This calculator also doesn&apos;t model income-tax treatment
            (Section 24(b) interest deduction, 80C principal deduction, HRA
            exemption), which can favor either side depending on your tax
            bracket. This is not financial advice.
          </p>

          <ResultActions />
        </ResultCard>
      }
    />
  );
}

// Hand-drawn SVG two-line comparison — no charting library, matches EMI's
// no-library Donut precedent. Owner net cost (accent) vs. renter net cost
// (white) across the horizon, with a zero baseline since renter cost can go
// negative (net wealth gain from investment growth outpacing rent).
function NetCostChart({
  yearly,
  breakevenYear,
}: {
  yearly: RentVsBuyYearRow[];
  breakevenYear: number | null;
}) {
  if (yearly.length === 0) return null;

  const width = 400;
  const height = 180;
  const padX = 8;
  const padY = 16;

  const values = yearly.flatMap((y) => [y.netOwnerCost, y.netRenterCost]);
  let min = Math.min(0, ...values);
  let max = Math.max(0, ...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const range = max - min;

  const xFor = (year: number) =>
    yearly.length === 1
      ? width / 2
      : padX + ((year - 1) / (yearly.length - 1)) * (width - padX * 2);
  const yFor = (v: number) =>
    padY + (1 - (v - min) / range) * (height - padY * 2);

  const ownerPoints = yearly.map((y) => `${xFor(y.year)},${yFor(y.netOwnerCost)}`).join(" ");
  const renterPoints = yearly.map((y) => `${xFor(y.year)},${yFor(y.netRenterCost)}`).join(" ");
  const zeroY = yFor(0);

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center gap-4 font-body text-xs text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Owning — net cost
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-white/70" />
          Renting — net cost
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Owner versus renter net cost across the comparison horizon"
        className="w-full"
      >
        <line
          x1={padX}
          x2={width - padX}
          y1={zeroY}
          y2={zeroY}
          stroke="#fff"
          strokeOpacity="0.15"
          strokeDasharray="3 4"
        />
        {breakevenYear ? (
          <line
            x1={xFor(breakevenYear)}
            x2={xFor(breakevenYear)}
            y1={padY}
            y2={height - padY}
            stroke="var(--color-emerald-400)"
            strokeOpacity="0.4"
            strokeDasharray="2 3"
          />
        ) : null}
        <polyline
          points={renterPoints}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.7"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={ownerPoints}
          fill="none"
          stroke="var(--color-emerald-400)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="font-body mt-1.5 text-[11px] text-zinc-500">
        Dashed grey line = ₹0 (net gain below it).
        {breakevenYear ? " Dashed green line = the breakeven year." : null}
      </p>
    </div>
  );
}

// Collapsible year-by-year table — the exact figures behind the chart, for
// anyone who wants to check the math by hand or needs a non-visual
// alternative to the SVG chart (screen readers can't parse polyline
// coordinates). The data is already computed in result.yearly, so no new
// math is added here.
function YearlyTable({ yearly }: { yearly: RentVsBuyYearRow[] }) {
  if (yearly.length === 0) return null;
  return (
    <div className="mt-4">
      <Disclosure label="Year-by-year net cost" tone="dark">
        <div className="max-h-64 overflow-y-auto">
          <table className="tab-num w-full text-left font-body text-xs">
            <thead>
              <tr className="text-zinc-500">
                <th scope="col" className="py-1 pr-3 font-medium">
                  Year
                </th>
                <th scope="col" className="py-1 pr-3 font-medium">
                  Owning — net cost
                </th>
                <th scope="col" className="py-1 font-medium">
                  Renting — net cost
                </th>
              </tr>
            </thead>
            <tbody>
              {yearly.map((row) => (
                <tr key={row.year} className="border-t border-white/10 text-zinc-300">
                  <td className="py-1.5 pr-3">{row.year}</td>
                  <td className="py-1.5 pr-3">{inrCompact(row.netOwnerCost)}</td>
                  <td className="py-1.5">{inrCompact(row.netRenterCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Disclosure>
    </div>
  );
}
