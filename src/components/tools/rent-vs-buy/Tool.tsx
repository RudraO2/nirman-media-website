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
  // collapsed <details> the user never clicked (same fix class the
  // stamp-duty-rj review applied to its DLC section). Seeded once from the
  // initial state, then freely toggle-able afterward.
  const [assumptionsOpen, setAssumptionsOpen] = useState(() =>
    ASSUMPTION_KEYS.some((k) => state[k] !== rentVsBuyDefaults[k])
  );

  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-10">
      {/* ---- Controls (left) ---- */}
      <div className="space-y-7 md:col-span-5">
        <Slider
          label="Home price"
          value={state.homePrice}
          min={rentVsBuyBounds.homePrice.min}
          max={rentVsBuyBounds.homePrice.max}
          step={rentVsBuyBounds.homePrice.step}
          prefix="₹"
          hint={inrCompact(state.homePrice)}
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
            disclaimer explicitly calls out as estimates, not facts. The
            inline <style> below forces the content visible when printing
            even while collapsed on screen — a closed <details> is excluded
            from print by default in every major browser, which would
            otherwise let "Download PDF" silently omit the assumptions that
            drove the printed verdict (caught in review). */}
        <style>{`
          @media print {
            details.rvb-assumptions summary { display: none; }
            details.rvb-assumptions:not([open]) > div { display: block !important; }
          }
        `}</style>
        <details
          className="rvb-assumptions group rounded-xl border border-line bg-cream-warm/50 p-4 [&_summary::-webkit-details-marker]:hidden"
          open={assumptionsOpen}
          onToggle={(e) => setAssumptionsOpen(e.currentTarget.open)}
        >
          <summary className="flex cursor-pointer items-center justify-between font-body text-sm font-medium text-ink">
            <span>
              Assumptions{" "}
              <span className="text-ink/50">
                — appreciation, rent growth, returns
              </span>
            </span>
            <span
              aria-hidden
              className="text-gold transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-5 space-y-6">
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
        </details>
      </div>

      {/* ---- Result (right) ---- */}
      <div className="md:col-span-7">
        <div className="md:sticky md:top-24">
          <ResultCard eyebrow="Your verdict">
            <p
              className="font-heading leading-tight text-gold"
              style={{ fontSize: "clamp(26px, 4vw, 38px)" }}
            >
              {result.verdict}
            </p>
            <p className="font-body mt-3 text-sm text-cream/60">
              Over {state.horizonYears} years — EMI{" "}
              <span className="tab-num text-cream">{inr(result.emi)}</span>
              /mo on a{" "}
              <span className="tab-num text-cream">
                {inrCompact(result.loanAmount)}
              </span>{" "}
              loan
            </p>

            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-cream/15 pt-6">
              <div className="space-y-4">
                <p className="font-body text-[11px] font-medium tracking-wide text-cream/40 uppercase">
                  Owning
                </p>
                <dl className="grid grid-cols-1 gap-4">
                  <Stat label="Down payment" value={inrCompact(result.downPayment)} dot="cream" />
                  <Stat label="Loan amount" value={inrCompact(result.loanAmount)} />
                  <Stat label="Monthly EMI" value={inr(result.emi)} dot="gold" />
                  <Stat
                    label="Total paid over horizon"
                    value={inrCompact(result.totalOwnerCashOutflow)}
                  />
                  <Stat
                    label="Home equity at horizon (before selling cost)"
                    value={inrCompact(result.homeEquityAtHorizon)}
                    dot="gold"
                  />
                </dl>
              </div>
              <div className="space-y-4">
                <p className="font-body text-[11px] font-medium tracking-wide text-cream/40 uppercase">
                  Renting + investing the difference
                </p>
                <dl className="grid grid-cols-1 gap-4">
                  <Stat
                    label="Total rent paid"
                    value={inrCompact(result.totalRenterCashOutflow)}
                  />
                  <Stat
                    label="Investment value at horizon"
                    value={inrCompact(result.investmentValueAtHorizon)}
                    dot="cream"
                  />
                </dl>
              </div>
            </div>

            <p className="font-body text-cream/70 mt-5 text-sm leading-relaxed">
              By year {state.horizonYears}, buying&apos;s net cost (cash spent
              minus wealth retained) comes to{" "}
              <span className="text-cream">{inrCompact(result.netOwnerCost)}</span>
              , against renting-and-investing&apos;s net{" "}
              <span className="text-cream">{inrCompact(result.netRenterCost)}</span>
              . This reflects the trajectory for the numbers you&apos;ve
              entered, not a guaranteed permanent lead — a close race can
              still narrow or swap over a longer or shorter horizon.
            </p>

            <NetCostChart yearly={result.yearly} breakevenYear={result.breakevenYear} />

            <YearlyTable yearly={result.yearly} />

            <p className="font-body text-cream/45 mt-5 text-xs leading-relaxed">
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

// Hand-drawn SVG two-line comparison — no charting library, matches EMI's
// no-library Donut precedent. Owner net cost (gold) vs. renter net cost
// (cream) across the horizon, with a zero baseline since renter cost can go
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
      <div className="mb-2 flex items-center gap-4 font-body text-xs text-cream/55">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-gold" />
          Owning — net cost
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-cream/70" />
          Renting — net cost
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Owner versus renter net cost across the comparison horizon"
        className="w-full"
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))" }}
      >
        <line
          x1={padX}
          x2={width - padX}
          y1={zeroY}
          y2={zeroY}
          stroke="var(--color-cream)"
          strokeOpacity="0.15"
          strokeDasharray="3 4"
        />
        {breakevenYear ? (
          <line
            x1={xFor(breakevenYear)}
            x2={xFor(breakevenYear)}
            y1={padY}
            y2={height - padY}
            stroke="var(--color-gold)"
            strokeOpacity="0.35"
            strokeDasharray="2 3"
          />
        ) : null}
        <polyline
          points={renterPoints}
          fill="none"
          stroke="var(--color-cream)"
          strokeOpacity="0.7"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={ownerPoints}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="font-body text-cream/40 mt-1.5 text-[11px]">
        Dashed grey line = ₹0 (net gain below it).
        {breakevenYear ? " Dashed gold line = the breakeven year." : null}
      </p>
    </div>
  );
}

// Collapsible year-by-year table — the exact figures behind the chart, for
// anyone who wants to check the math by hand or needs a non-visual
// alternative to the SVG chart (screen readers can't parse polyline
// coordinates). Mirrors EMI's collapsible amortization table pattern; the
// data is already computed in result.yearly, so no new math is added here.
function YearlyTable({ yearly }: { yearly: RentVsBuyYearRow[] }) {
  if (yearly.length === 0) return null;
  return (
    <details className="group mt-4 rounded-xl border border-cream/15 p-4 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between font-body text-sm font-medium text-cream/80">
        <span>Year-by-year net cost</span>
        <span
          aria-hidden
          className="text-gold transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-4 max-h-64 overflow-y-auto">
        <table className="tab-num w-full text-left font-body text-xs">
          <thead>
            <tr className="text-cream/50">
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
              <tr key={row.year} className="border-t border-cream/10 text-cream/75">
                <td className="py-1.5 pr-3">{row.year}</td>
                <td className="py-1.5 pr-3">{inrCompact(row.netOwnerCost)}</td>
                <td className="py-1.5">{inrCompact(row.netRenterCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
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
