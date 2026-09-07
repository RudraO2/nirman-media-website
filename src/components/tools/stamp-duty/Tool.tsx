"use client";

import { useMemo, useState } from "react";
import { compute } from "@/lib/tools/stamp-duty/compute";
import {
  stampDutySchema,
  stampDutyDefaults,
  stampDutyBounds,
} from "@/lib/tools/stamp-duty/schema";
import {
  buyerCategoryRates,
  type BuyerCategory,
} from "@/lib/tools/stamp-duty/data";
import { useToolState } from "@/lib/tools/useToolState";
import { inr, inrCompact } from "@/lib/tools/format";
import { Slider } from "@/components/tools/_surface/Slider";
import { InputField } from "@/components/tools/_surface/InputField";
import { Select } from "@/components/tools/_surface/Select";
import { ResultCard } from "@/components/tools/_surface/ResultCard";
import { ResultValue } from "@/components/tools/_surface/ResultValue";
import { ResultStat } from "@/components/tools/_surface/ResultStat";
import { ResultActions } from "@/components/tools/_surface/ResultActions";
import { Disclosure } from "@/components/tools/_surface/Disclosure";
import { ToolLayout } from "@/components/tools/_surface/ToolLayout";

const buyerCategoryOptions = buyerCategoryRates.map((c) => ({
  value: c.id,
  label: c.label,
}));

export function StampDutyTool() {
  const [state, patch] = useToolState(stampDutySchema, stampDutyDefaults);
  const result = useMemo(() => compute(state), [state]);
  // Auto-open the DLC section when a shared/bookmarked link already carries a
  // non-zero DLC value, so the control explaining the override isn't hidden
  // behind a collapsed <details> the user never clicked. Seeded once from the
  // initial state, then freely toggle-able — never re-forced shut by a later
  // re-render (e.g. changing buyer category) while the user has it open.
  const [dlcOpen, setDlcOpen] = useState(() => state.dlcValue > 0);

  return (
    <ToolLayout
      controls={
        <>
          <Slider
            label="Transaction value"
            value={state.transactionValue}
            min={stampDutyBounds.transactionValue.min}
            max={stampDutyBounds.transactionValue.max}
            step={stampDutyBounds.transactionValue.step}
            prefix="₹"
            hint={inrCompact(state.transactionValue)}
            presets={[2500000, 5000000, 7500000, 10000000]}
            onChange={(v) => patch({ transactionValue: v })}
          />

          <Select
            label="Buyer category"
            value={state.buyerCategory}
            options={buyerCategoryOptions}
            onChange={(v) => patch({ buyerCategory: v as BuyerCategory })}
          />

          {/* DLC/circle-rate value — progressively disclosed, most users won't
              know it offhand. printExpand: the DLC figure can drive the printed
              result, so it must never be omitted from the PDF. */}
          <Disclosure
            label="Know the DLC / circle rate?"
            sub="— add it if higher"
            printExpand
            open={dlcOpen}
            onToggle={setDlcOpen}
          >
            <div className="space-y-3">
              <InputField
                label="DLC valuation, if known"
                value={state.dlcValue}
                min={stampDutyBounds.dlcValue.min}
                max={stampDutyBounds.dlcValue.max}
                step={stampDutyBounds.dlcValue.step}
                prefix="₹"
                onChange={(v) => patch({ dlcValue: v })}
              />
              <p className="font-body text-xs leading-relaxed text-zinc-500">
                Stamp duty is charged on whichever is higher: your transaction
                value or the government-notified DLC (District Level Committee)
                rate for your plot. Leave this at ₹0 if you don&apos;t know it —
                we&apos;ll use your transaction value.
              </p>
            </div>
          </Disclosure>

          <p className="font-body text-xs leading-relaxed text-zinc-500">
            Rajasthan gives a lower duty rate to a sole female buyer, and a
            lower rate still to an SC/ST or BPL female buyer, as a policy
            incentive — that&apos;s why buyer category changes the total.
          </p>
        </>
      }
      result={
        <ResultCard eyebrow="Estimated government charges">
          <ResultValue
            value={inr(result.govtCharges)}
            caption={`duty + labour cess + registration · ${result.buyerCategoryLabel}`}
          />

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5 sm:grid-cols-3">
            <ResultStat
              label={`Stamp duty (${result.dutyRatePercent}%)`}
              value={inr(result.duty)}
              dot="plain"
            />
            <ResultStat
              label={`Labour cess (${result.cessRatePercent}% of duty)`}
              value={inr(result.cess)}
              dot="accent"
            />
            <ResultStat
              label={`Registration (${result.registrationRatePercent}%)`}
              value={inr(result.registration)}
            />
          </dl>

          <p className="font-body mt-5 text-sm leading-relaxed text-zinc-300">
            That&apos;s{" "}
            <span className="text-white">
              {result.allInPercent.toFixed(2)}%
            </span>{" "}
            of the{" "}
            {result.dlcOverrideActive ? "DLC valuation" : "transaction value"}{" "}
            on top of the price — total outlay ≈{" "}
            <span className="text-white">
              {inrCompact(result.totalOutlay)}
            </span>
            .
          </p>

          {result.dlcOverrideActive ? (
            <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
              <p className="font-body text-sm text-zinc-200">
                Your DLC valuation of{" "}
                <span className="font-medium text-emerald-300">
                  {inrCompact(Math.max(0, state.dlcValue))}
                </span>{" "}
                is higher than your entered transaction value of{" "}
                <span className="font-medium text-emerald-300">
                  {inrCompact(Math.max(0, state.transactionValue))}
                </span>{" "}
                — duty, cess and registration are computed on the higher
                DLC figure, not the price you entered.
              </p>
            </div>
          ) : null}

          {/* Provenance line (AD-6) — never a silent constant. */}
          <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
            <p className="font-body text-sm text-zinc-200">
              Rates used: duty{" "}
              <span className="font-medium text-emerald-300">
                {result.dutyRatePercent}%
              </span>{" "}
              · cess{" "}
              <span className="font-medium text-emerald-300">
                {result.cessRatePercent}%
              </span>{" "}
              of duty · registration{" "}
              <span className="font-medium text-emerald-300">
                {result.registrationRatePercent}%
              </span>
            </p>
            <p className="font-body mt-1 text-xs text-zinc-400">
              As of {result.dutyRateAsOf} · Source: {result.dutyRateSource}
            </p>
          </div>

          <p className="font-body mt-5 text-xs leading-relaxed text-zinc-500">
            Estimate only. This tool does not know your plot&apos;s actual
            DLC/circle rate — confirm the exact figure with your
            Sub-Registrar or on the IGRS Rajasthan portal before relying on
            this number for a real transaction. Rates shift with state
            budgets; verify against the current official notification.
          </p>

          <ResultActions />
        </ResultCard>
      }
    />
  );
}
