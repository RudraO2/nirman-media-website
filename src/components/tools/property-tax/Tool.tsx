"use client";

import { useState, useMemo } from "react";
import { compute } from "@/lib/tools/property-tax/compute";
import {
  propertyTaxSchema,
  propertyTaxDefaults,
  propertyTaxBounds,
} from "@/lib/tools/property-tax/schema";
import { useToolState } from "@/lib/tools/useToolState";
import { inr } from "@/lib/tools/format";
import { Slider } from "@/components/tools/_surface/Slider";
import { ResultCard } from "@/components/tools/_surface/ResultCard";

export function PropertyTaxTool() {
  const [state, patch] = useToolState(propertyTaxSchema, propertyTaxDefaults);
  const result = useMemo(() => compute(state), [state]);

  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-10">
      {/* ---- Controls (left) ---- */}
      <div className="space-y-7 md:col-span-5">
        <Slider
          label="Annual value (from your property tax bill)"
          value={state.annualValue}
          min={propertyTaxBounds.annualValue.min}
          max={propertyTaxBounds.annualValue.max}
          step={propertyTaxBounds.annualValue.step}
          prefix="₹"
          onChange={(v) => patch({ annualValue: v })}
        />
        <Slider
          label="Tax rate (from your bill or municipal portal)"
          value={state.taxRatePct}
          min={propertyTaxBounds.taxRatePct.min}
          max={propertyTaxBounds.taxRatePct.max}
          step={propertyTaxBounds.taxRatePct.step}
          suffix="%"
          onChange={(v) => patch({ taxRatePct: v })}
        />
        <Slider
          label="Early-payment rebate (if your corporation offers one)"
          value={state.rebatePct}
          min={propertyTaxBounds.rebatePct.min}
          max={propertyTaxBounds.rebatePct.max}
          step={propertyTaxBounds.rebatePct.step}
          suffix="%"
          onChange={(v) => patch({ rebatePct: v })}
        />
        <Slider
          label="Additional cess (fire cess, education cess, etc.)"
          value={state.cessPct}
          min={propertyTaxBounds.cessPct.min}
          max={propertyTaxBounds.cessPct.max}
          step={propertyTaxBounds.cessPct.step}
          suffix="%"
          onChange={(v) => patch({ cessPct: v })}
        />
      </div>

      {/* ---- Result (right) ---- */}
      <div className="md:col-span-7">
        <div className="md:sticky md:top-24">
          <ResultCard eyebrow="Net property tax payable">
            <p
              className="tab-num font-heading text-gold leading-none"
              style={{ fontSize: "clamp(40px, 7vw, 68px)" }}
            >
              {inr(result.netTaxPayable)}
            </p>
            <p className="font-body text-cream/60 mt-2 text-sm">per year</p>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-cream/15 pt-6">
              <Stat label="Base tax" value={inr(result.baseTax)} dot="cream" />
              <Stat label="Rebate" value={`− ${inr(result.rebateAmount)}`} dot="gold" />
              <Stat label="Cess" value={`+ ${inr(result.cessAmount)}`} />
            </dl>

            <p className="font-body text-cream/45 mt-5 text-xs leading-relaxed">
              Every Indian municipal corporation — Jaipur Nagar Nigam included
              — sets its own annual-value method, rate slabs and rebate
              policy, and these change by notification. This calculator
              doesn&apos;t guess city-specific slabs: it applies straightforward
              arithmetic to the annual value and rate on your own property tax
              bill or municipal portal, so the math is exact even where the
              underlying figures are yours to supply.
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
