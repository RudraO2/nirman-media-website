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
    <div className="grid gap-8 md:grid-cols-12 md:gap-10">
      {/* ---- Controls (left) ---- */}
      <div className="space-y-7 md:col-span-5">
        <Slider
          label="Transaction value"
          value={state.transactionValue}
          min={stampDutyBounds.transactionValue.min}
          max={stampDutyBounds.transactionValue.max}
          step={stampDutyBounds.transactionValue.step}
          prefix="₹"
          hint={inrCompact(state.transactionValue)}
          onChange={(v) => patch({ transactionValue: v })}
        />

        <Select
          label="Buyer category"
          value={state.buyerCategory}
          options={buyerCategoryOptions}
          onChange={(v) => patch({ buyerCategory: v as BuyerCategory })}
        />

        {/* DLC/circle-rate value — progressively disclosed, most users won't
            know it offhand (mirrors EMI's collapsible prepayment section). */}
        <details
          className="group rounded-xl border border-line bg-cream-warm/50 p-4 [&_summary::-webkit-details-marker]:hidden"
          open={dlcOpen}
          onToggle={(e) => setDlcOpen(e.currentTarget.open)}
        >
          <summary className="flex cursor-pointer items-center justify-between font-body text-sm font-medium text-ink">
            <span>
              Know the DLC / circle rate?{" "}
              <span className="text-ink/50">— add it if higher</span>
            </span>
            <span
              aria-hidden
              className="text-gold transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-5 space-y-3">
            <InputField
              label="DLC valuation, if known"
              value={state.dlcValue}
              min={stampDutyBounds.dlcValue.min}
              max={stampDutyBounds.dlcValue.max}
              step={stampDutyBounds.dlcValue.step}
              prefix="₹"
              onChange={(v) => patch({ dlcValue: v })}
            />
            <p className="font-body text-xs leading-relaxed text-ink/45">
              Stamp duty is charged on whichever is higher: your transaction
              value or the government-notified DLC (District Level Committee)
              rate for your plot. Leave this at ₹0 if you don&apos;t know it —
              we&apos;ll use your transaction value.
            </p>
          </div>
        </details>

        <p className="font-body text-xs leading-relaxed text-ink/45">
          Rajasthan gives a lower duty rate to a sole female buyer, and a
          lower rate still to an SC/ST or BPL female buyer, as a policy
          incentive — that&apos;s why buyer category changes the total.
        </p>
      </div>

      {/* ---- Result (right) ---- */}
      <div className="md:col-span-7">
        <div className="md:sticky md:top-24">
          <ResultCard eyebrow="Estimated government charges">
            <div>
              <p
                className="tab-num font-heading leading-none text-gold"
                style={{ fontSize: "clamp(40px, 7vw, 68px)" }}
              >
                {inr(result.govtCharges)}
              </p>
              <p className="font-body mt-2 text-sm text-cream/60">
                duty + labour cess + registration · {result.buyerCategoryLabel}
              </p>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-cream/15 pt-6 sm:grid-cols-3">
              <Stat
                label={`Stamp duty (${result.dutyRatePercent}%)`}
                value={inr(result.duty)}
                dot="cream"
              />
              <Stat
                label={`Labour cess (${result.cessRatePercent}% of duty)`}
                value={inr(result.cess)}
                dot="gold"
              />
              <Stat
                label={`Registration (${result.registrationRatePercent}%)`}
                value={inr(result.registration)}
              />
            </dl>

            <p className="font-body text-cream/70 mt-5 text-sm leading-relaxed">
              That&apos;s{" "}
              <span className="text-cream">
                {result.allInPercent.toFixed(2)}%
              </span>{" "}
              of the{" "}
              {result.dlcOverrideActive ? "DLC valuation" : "transaction value"}{" "}
              on top of the price — total outlay ≈{" "}
              <span className="text-cream">
                {inrCompact(result.totalOutlay)}
              </span>
              .
            </p>

            {result.dlcOverrideActive ? (
              <div className="mt-5 rounded-xl bg-gold/15 p-4">
                <p className="font-body text-sm text-cream">
                  Your DLC valuation of{" "}
                  <span className="font-medium text-gold">
                    {inrCompact(Math.max(0, state.dlcValue))}
                  </span>{" "}
                  is higher than your entered transaction value of{" "}
                  <span className="font-medium text-gold">
                    {inrCompact(Math.max(0, state.transactionValue))}
                  </span>{" "}
                  — duty, cess and registration are computed on the higher
                  DLC figure, not the price you entered.
                </p>
              </div>
            ) : null}

            {/* Provenance line (AD-6) — never a silent constant. */}
            <div className="mt-6 rounded-xl bg-gold/15 p-4">
              <p className="font-body text-sm text-cream">
                Rates used: duty{" "}
                <span className="font-medium text-gold">
                  {result.dutyRatePercent}%
                </span>{" "}
                · cess{" "}
                <span className="font-medium text-gold">
                  {result.cessRatePercent}%
                </span>{" "}
                of duty · registration{" "}
                <span className="font-medium text-gold">
                  {result.registrationRatePercent}%
                </span>
              </p>
              <p className="font-body mt-1 text-xs text-cream/60">
                As of {result.dutyRateAsOf} · Source: {result.dutyRateSource}
              </p>
            </div>

            <p className="font-body text-cream/45 mt-5 text-xs leading-relaxed">
              Estimate only. This tool does not know your plot&apos;s actual
              DLC/circle rate — confirm the exact figure with your
              Sub-Registrar or on the IGRS Rajasthan portal before relying on
              this number for a real transaction. Rates shift with state
              budgets; verify against the current official notification.
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
