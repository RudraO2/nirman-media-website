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
  // collapsed <details> the user never clicked (same fix class rent-vs-buy's
  // review applied to its own Assumptions section).
  const [costsOpen, setCostsOpen] = useState(() =>
    COST_KEYS.some((k) => state[k] !== rentalYieldDefaults[k])
  );

  const leverageOn = state.leverage === "on";

  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-10">
      {/* ---- Controls (left) ---- */}
      <div className="space-y-7 md:col-span-5">
        <Slider
          label="Property price"
          value={state.propertyPrice}
          min={rentalYieldBounds.propertyPrice.min}
          max={rentalYieldBounds.propertyPrice.max}
          step={rentalYieldBounds.propertyPrice.step}
          prefix="₹"
          hint={inrCompact(state.propertyPrice)}
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

        {/* Costs & assumptions — progressively disclosed. The inline <style>
            below forces the content visible when printing even while
            collapsed on screen — a closed <details> is excluded from print
            by default in every major browser, which would otherwise let
            "Download PDF" silently omit the real costs behind the printed
            net yield (same fix rent-vs-buy applies to its Assumptions
            section). Review-caught fix: only the "+" toggle icon is hidden in
            print, not the whole <summary> — rent-vs-buy's own copy of this
            pattern hides the ENTIRE summary (including the section's heading
            text) in print, which would leave a printed page with four
            unlabeled cost figures and no heading identifying them; logged as
            a defer item for that file since it's out of this story's scope
            to edit. */}
        <style>{`
          @media print {
            details.ry-costs summary .ry-costs-toggle-icon { display: none; }
            details.ry-costs:not([open]) > div { display: block !important; }
          }
        `}</style>
        <details
          className="ry-costs group rounded-xl border border-line bg-cream-warm/50 p-4 [&_summary::-webkit-details-marker]:hidden"
          open={costsOpen}
          onToggle={(e) => setCostsOpen(e.currentTarget.open)}
        >
          <summary className="flex cursor-pointer items-center justify-between font-body text-sm font-medium text-ink">
            <span>
              Costs &amp; assumptions{" "}
              <span className="text-ink/50">
                — tax, maintenance, society, vacancy
              </span>
            </span>
            <span
              aria-hidden
              className="ry-costs-toggle-icon text-gold transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-5 space-y-6">
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
        </details>

        {/* Leverage — a single self-toggling pill, not a fork of a new
            checkbox/switch primitive. Uses the exact selected/unselected
            class pair already established by emi/Tool.tsx's prepayment-mode
            pills. */}
        <div className="space-y-2.5">
          <p className="font-body text-sm text-ink/70">
            Financing this with a home loan?
          </p>
          <button
            type="button"
            onClick={() => patch({ leverage: leverageOn ? "off" : "on" })}
            aria-pressed={leverageOn}
            className={`w-full rounded-lg border px-4 py-2.5 text-left font-body text-sm transition-colors ${
              leverageOn
                ? "border-gold bg-gold/15 text-ink"
                : "border-line text-ink/60 hover:border-ink/30"
            }`}
          >
            {leverageOn
              ? "Yes — show my leveraged returns"
              : "No — cash purchase (tap to model a loan)"}
          </button>
        </div>

        {leverageOn ? (
          <div className="space-y-6 rounded-xl border border-gold/25 bg-gold/5 p-4">
            <p className="font-body text-[11px] font-medium tracking-wide text-gold/80 uppercase">
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
      </div>

      {/* ---- Result (right) ---- */}
      <div className="md:col-span-7">
        <div className="md:sticky md:top-24">
          <ResultCard eyebrow="Your rental yield">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="font-body text-xs tracking-wide text-cream/50 uppercase">
                  Gross yield
                </p>
                <p
                  className="tab-num font-heading leading-none text-gold mt-1.5"
                  style={{ fontSize: "clamp(34px, 6vw, 54px)" }}
                >
                  {result.grossYieldPct.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="font-body text-xs tracking-wide text-cream/50 uppercase">
                  Net yield (after real costs)
                </p>
                <p
                  className="tab-num font-heading leading-none text-cream mt-1.5"
                  style={{ fontSize: "clamp(34px, 6vw, 54px)" }}
                >
                  {result.netYieldPct.toFixed(2)}%
                </p>
              </div>
            </div>

            <p className="font-body mt-4 text-sm leading-relaxed text-cream/70">
              {result.benchmarkNote}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6">
              <YieldDonut kept={result.netAnnualIncome} total={result.annualRent} />
              <p className="font-body max-w-[220px] text-xs leading-relaxed text-cream/55">
                Share of gross rent you actually keep after property tax,
                maintenance, society charges and vacancy.
              </p>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-cream/15 pt-6">
              <Stat label="Annual rent" value={inrCompact(result.annualRent)} dot="cream" />
              <Stat
                label="Annual operating costs"
                value={inrCompact(result.annualOperatingCosts)}
                dot="gold"
              />
              <Stat label="Net annual income" value={inrCompact(result.netAnnualIncome)} />
            </dl>

            {leverageOn &&
            result.netYieldLeveragedPct !== null &&
            result.actualCashInvested !== null &&
            result.annualNetCashFlow !== null ? (
              <div className="mt-7 rounded-xl border border-gold/25 bg-gold/10 p-5">
                <p className="font-body text-[11px] font-medium tracking-wide text-gold/80 uppercase">
                  With your loan
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                  <Stat
                    label="Net yield (leveraged)"
                    value={`${result.netYieldLeveragedPct.toFixed(2)}%`}
                    dot="gold"
                  />
                  <Stat
                    label="Cash-on-cash return"
                    value={
                      result.cashOnCashReturnPct !== null
                        ? `${result.cashOnCashReturnPct.toFixed(2)}%`
                        : "N/A — no cash in"
                    }
                    dot="gold"
                  />
                  <Stat label="Loan amount" value={inrCompact(result.loanAmount)} />
                  <Stat label="Monthly EMI" value={inr(result.emi)} />
                  <Stat label="Cash invested" value={inrCompact(result.actualCashInvested)} />
                </dl>
                <p className="font-body mt-4 text-xs leading-relaxed text-cream/60">
                  These are two different answers, deliberately not conflated:
                  net yield (leveraged) still divides by the full property
                  price — only year-1 interest changes it. Cash-on-cash
                  return divides by your actual cash in (down payment +
                  acquisition costs) and subtracts the full EMI, so it can
                  swing far more sharply.
                </p>
              </div>
            ) : null}

            <p className="font-body text-cream/45 mt-5 text-xs leading-relaxed">
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

// Hand-drawn SVG donut — net income kept vs. operating costs, as a share of
// gross rent. No charting library, matches EMI's principal-vs-interest donut
// precedent. When operating costs meet or exceed rent (net income <= 0) the
// "kept" arc clamps to 0 — there's no such thing as a negative slice — and
// the whole ring reads as "cost", an honest (if blunt) way to show a
// yield-negative scenario.
function YieldDonut({ kept, total }: { kept: number; total: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const keptFrac = total > 0 ? Math.max(0, Math.min(1, kept / total)) : 0;
  const keptLen = c * keptFrac;

  return (
    <svg
      width="116"
      height="116"
      viewBox="0 0 116 116"
      role="img"
      aria-label="Net income kept versus operating costs, as a share of gross rent"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}
    >
      <g transform="rotate(-90 58 58)">
        {/* operating costs (full ring, gold) */}
        <circle cx="58" cy="58" r={r} fill="none" stroke="var(--color-gold)" strokeWidth="14" />
        {/* net income kept (cream) drawn over it */}
        <circle
          cx="58"
          cy="58"
          r={r}
          fill="none"
          stroke="var(--color-cream)"
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
        fill="var(--color-cream)"
        fontSize="15"
        fontWeight="600"
      >
        {Math.round(keptFrac * 100)}%
      </text>
      <text x="58" y="70" textAnchor="middle" fill="var(--color-cream)" fontSize="8" opacity="0.6">
        kept
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
