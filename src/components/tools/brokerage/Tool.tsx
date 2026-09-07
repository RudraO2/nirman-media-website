"use client";

import { useMemo } from "react";
import { compute } from "@/lib/tools/brokerage/compute";
import {
  brokerageSchema,
  brokerageDefaults,
  brokerageBounds,
} from "@/lib/tools/brokerage/schema";
import { useToolState } from "@/lib/tools/useToolState";
import { inr, inrCompact } from "@/lib/tools/format";
import { Slider } from "@/components/tools/_surface/Slider";
import { Select } from "@/components/tools/_surface/Select";
import { ResultCard } from "@/components/tools/_surface/ResultCard";
import { ResultValue } from "@/components/tools/_surface/ResultValue";
import { ResultStat } from "@/components/tools/_surface/ResultStat";
import { ResultActions } from "@/components/tools/_surface/ResultActions";
import { SegmentedControl } from "@/components/tools/_surface/SegmentedControl";
import { Switch } from "@/components/tools/_surface/Switch";
import { ToolLayout } from "@/components/tools/_surface/ToolLayout";

const RENTAL_MODE_OPTIONS = [
  { value: "one-month", label: "One month's rent (most common)" },
  { value: "half-month", label: "Half month's rent" },
  { value: "custom", label: "Custom % of monthly rent" },
];

export function BrokerageTool() {
  const [state, patch] = useToolState(brokerageSchema, brokerageDefaults);
  const result = useMemo(() => compute(state), [state]);
  const isSale = state.dealType === "sale";

  return (
    <ToolLayout
      controls={
        <>
          <SegmentedControl
            label="Deal type"
            options={[
              { value: "sale", label: "Sale" },
              { value: "rental", label: "Rental" },
            ]}
            value={state.dealType}
            onChange={(mode) => patch({ dealType: mode })}
          />

          {isSale ? (
            <>
              <Slider
                label="Property value"
                value={state.propertyValue}
                min={brokerageBounds.propertyValue.min}
                max={brokerageBounds.propertyValue.max}
                step={brokerageBounds.propertyValue.step}
                prefix="₹"
                hint={inrCompact(state.propertyValue)}
                presets={[2500000, 5000000, 7500000, 10000000]}
                onChange={(v) => patch({ propertyValue: v })}
              />
              <Slider
                label="Brokerage rate"
                value={state.brokeragePct}
                min={brokerageBounds.brokeragePct.min}
                max={brokerageBounds.brokeragePct.max}
                step={brokerageBounds.brokeragePct.step}
                suffix="%"
                hint="Commonly 1–2% of property value"
                onChange={(v) => patch({ brokeragePct: v })}
              />
            </>
          ) : (
            <>
              <Slider
                label="Monthly rent"
                value={state.monthlyRent}
                min={brokerageBounds.monthlyRent.min}
                max={brokerageBounds.monthlyRent.max}
                step={brokerageBounds.monthlyRent.step}
                prefix="₹"
                onChange={(v) => patch({ monthlyRent: v })}
              />
              <Select
                label="Brokerage convention"
                value={state.rentalMode}
                options={RENTAL_MODE_OPTIONS}
                onChange={(v) => patch({ rentalMode: v as typeof state.rentalMode })}
              />
              {state.rentalMode === "custom" ? (
                <Slider
                  label="Custom rate"
                  value={state.customRentalPct}
                  min={brokerageBounds.customRentalPct.min}
                  max={brokerageBounds.customRentalPct.max}
                  step={brokerageBounds.customRentalPct.step}
                  suffix="% of monthly rent"
                  onChange={(v) => patch({ customRentalPct: v })}
                />
              ) : null}
            </>
          )}

          <Switch
            label="GST (18%)"
            description={
              state.gstApplicable
                ? "Included — broker/firm is GST-registered"
                : "Not included — switch on to add 18% GST"
            }
            checked={state.gstApplicable}
            onChange={(on) => patch({ gstApplicable: on })}
          />
        </>
      }
      result={
        <ResultCard eyebrow="Brokerage due">
          <ResultValue
            value={inr(result.totalBrokerage)}
            caption={
              state.gstApplicable ? "including 18% GST" : "GST not included"
            }
          />

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5">
            <ResultStat
              label="Base brokerage"
              value={inr(result.baseBrokerage)}
              dot="plain"
            />
            <ResultStat label="GST" value={inr(result.gstAmount)} dot="accent" />
          </dl>

          <p className="font-body mt-5 text-xs leading-relaxed text-zinc-500">
            Brokerage rates and conventions are negotiated between broker
            and client, not fixed by law — the defaults here reflect common
            market practice, not a statutory rate. GST applies only if the
            broker or firm is GST-registered.
          </p>

          <ResultActions />
        </ResultCard>
      }
    />
  );
}
