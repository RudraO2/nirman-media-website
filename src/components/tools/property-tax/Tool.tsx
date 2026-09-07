"use client";

import { useMemo } from "react";
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
import { ResultValue } from "@/components/tools/_surface/ResultValue";
import { ResultStat } from "@/components/tools/_surface/ResultStat";
import { ResultActions } from "@/components/tools/_surface/ResultActions";
import { ToolLayout } from "@/components/tools/_surface/ToolLayout";

export function PropertyTaxTool() {
  const [state, patch] = useToolState(propertyTaxSchema, propertyTaxDefaults);
  const result = useMemo(() => compute(state), [state]);

  return (
    <ToolLayout
      controlsLabel="From your bill"
      controls={
        <>
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
        </>
      }
      result={
        <ResultCard eyebrow="Net property tax payable">
          <ResultValue value={inr(result.netTaxPayable)} caption="per year" />

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5 sm:grid-cols-3">
            <ResultStat label="Base tax" value={inr(result.baseTax)} dot="plain" />
            <ResultStat
              label="Rebate"
              value={`− ${inr(result.rebateAmount)}`}
              dot="accent"
            />
            <ResultStat label="Cess" value={`+ ${inr(result.cessAmount)}`} />
          </dl>

          <p className="font-body mt-5 text-xs leading-relaxed text-zinc-500">
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
      }
    />
  );
}
