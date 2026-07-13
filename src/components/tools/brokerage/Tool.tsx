"use client";

import { useState, useMemo } from "react";
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
    <div className="grid gap-8 md:grid-cols-12 md:gap-10">
      {/* ---- Controls (left) ---- */}
      <div className="space-y-7 md:col-span-5">
        <div className="space-y-2.5">
          <p className="font-body text-sm text-ink/70">Deal type</p>
          <div className="flex gap-2">
            {(["sale", "rental"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => patch({ dealType: mode })}
                aria-pressed={state.dealType === mode}
                className={`flex-1 rounded-lg border px-3 py-2 font-body text-sm transition-colors cursor-pointer ${
                  state.dealType === mode
                    ? "border-gold bg-gold/15 text-ink"
                    : "border-line text-ink/60 hover:border-ink/30"
                }`}
              >
                {mode === "sale" ? "Sale" : "Rental"}
              </button>
            ))}
          </div>
        </div>

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

        <div className="space-y-2.5">
          <p className="font-body text-sm text-ink/70">GST (18%)</p>
          <button
            type="button"
            onClick={() => patch({ gstApplicable: !state.gstApplicable })}
            aria-pressed={state.gstApplicable}
            className={`w-full rounded-lg border px-4 py-2.5 text-left font-body text-sm transition-colors cursor-pointer ${
              state.gstApplicable
                ? "border-gold bg-gold/15 text-ink"
                : "border-line text-ink/60 hover:border-ink/30"
            }`}
          >
            {state.gstApplicable
              ? "Included — broker/firm is GST-registered"
              : "Not included — tap to add 18% GST"}
          </button>
        </div>
      </div>

      {/* ---- Result (right) ---- */}
      <div className="md:col-span-7">
        <div className="md:sticky md:top-24">
          <ResultCard eyebrow="Brokerage due">
            <p
              className="tab-num font-heading text-gold leading-none"
              style={{ fontSize: "clamp(40px, 7vw, 68px)" }}
            >
              {inr(result.totalBrokerage)}
            </p>
            <p className="font-body text-cream/60 mt-2 text-sm">
              {state.gstApplicable ? "including 18% GST" : "GST not included"}
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-cream/15 pt-6">
              <Stat label="Base brokerage" value={inr(result.baseBrokerage)} dot="cream" />
              <Stat label="GST" value={inr(result.gstAmount)} dot="gold" />
            </dl>

            <p className="font-body text-cream/45 mt-5 text-xs leading-relaxed">
              Brokerage rates and conventions are negotiated between broker
              and client, not fixed by law — the defaults here reflect common
              market practice, not a statutory rate. GST applies only if the
              broker or firm is GST-registered.
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
