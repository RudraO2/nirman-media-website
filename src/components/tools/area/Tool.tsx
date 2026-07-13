"use client";

import { useMemo, useState } from "react";
import { compute } from "@/lib/tools/area/compute";
import { areaSchema, areaDefaults, areaBounds } from "@/lib/tools/area/schema";
import {
  AREA_UNIT_IDS,
  bighaRegions,
  type AreaUnit,
  type AreaRegionId,
} from "@/lib/tools/area/data";
import { useToolState } from "@/lib/tools/useToolState";
import { numDecimal } from "@/lib/tools/format";
import { InputField } from "@/components/tools/_surface/InputField";
import { Select } from "@/components/tools/_surface/Select";
import { ResultCard } from "@/components/tools/_surface/ResultCard";

const unitLabels: Record<AreaUnit, string> = {
  sqft: "Square feet (sq ft)",
  gaj: "Gaj / sq yard",
  sqm: "Square metre (sq m)",
  acre: "Acre",
  hectare: "Hectare",
  cent: "Cent",
  guntha: "Guntha",
  ground: "Ground (Tamil Nadu)",
  bigha: "Bigha",
  biswa: "Biswa",
  marla: "Marla",
  kanal: "Kanal",
};

const unitShort: Record<AreaUnit, string> = {
  sqft: "sq ft",
  gaj: "gaj",
  sqm: "sq m",
  acre: "acre",
  hectare: "ha",
  cent: "cent",
  guntha: "guntha",
  ground: "ground",
  bigha: "bigha",
  biswa: "biswa",
  marla: "marla",
  kanal: "kanal",
};

const unitOptions = AREA_UNIT_IDS.map((u) => ({
  value: u,
  label: unitLabels[u],
}));

const regionOptions = bighaRegions.map((r) => ({ value: r.id, label: r.label }));

export function AreaTool() {
  const [state, patch] = useToolState(areaSchema, areaDefaults);
  const result = useMemo(() => compute(state), [state]);

  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-10">
      {/* ---- Controls (left) ---- */}
      <div className="space-y-7 md:col-span-5">
        <InputField
          label="Value"
          value={state.value}
          min={areaBounds.value.min}
          max={areaBounds.value.max}
          step={areaBounds.value.step}
          onChange={(v) => patch({ value: v })}
        />
        <Select
          label="Convert from"
          value={state.fromUnit}
          options={unitOptions}
          onChange={(v) => patch({ fromUnit: v as AreaUnit })}
        />
        <Select
          label="Region (for bigha / biswa)"
          value={state.region}
          options={regionOptions}
          onChange={(v) => patch({ region: v as AreaRegionId })}
        />

        {result.isNorthIndiaUnit ? (
          <p className="rounded-xl border border-gold/30 bg-gold/10 p-4 font-body text-sm leading-relaxed text-ink/70">
            <span className="font-medium text-ink">North India convention.</span>{" "}
            Marla and kanal follow the Punjab/Haryana measure — this figure is
            not native to Rajasthan and is not a region-verified value the way
            bigha is.
          </p>
        ) : null}

        <p className="font-body text-xs leading-relaxed text-ink/45">
          Bigha has no national standard. Fixed units (sq ft, gaj, sq m, acre,
          hectare, cent, guntha, ground) are the same everywhere; bigha and
          biswa change with the region you pick above.
        </p>
      </div>

      {/* ---- Result (right) ---- */}
      <div className="md:col-span-7">
        <div className="md:sticky md:top-24">
          <ResultCard eyebrow="Converted area">
            <div>
              <p
                className="tab-num font-heading leading-none text-gold"
                style={{ fontSize: "clamp(36px, 6.5vw, 60px)" }}
              >
                {numDecimal(result.sqft)}{" "}
                <span className="text-[0.4em] font-body text-cream/60">
                  sq ft
                </span>
              </p>
              <p className="font-body mt-2 text-sm text-cream/60">
                {numDecimal(state.value)} {unitShort[state.fromUnit]} converted
              </p>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-cream/15 pt-6 sm:grid-cols-3">
              {AREA_UNIT_IDS.map((u) => (
                <div key={u}>
                  <dt className="font-body flex items-center gap-1.5 text-xs text-cream/55">
                    {u === state.fromUnit ? (
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 rounded-full bg-gold"
                      />
                    ) : null}
                    {unitLabels[u]}
                    {u === "marla" || u === "kanal" ? (
                      <span
                        aria-hidden
                        title="North India convention — not a Rajasthan-verified figure"
                        className="text-cream/40"
                      >
                        †
                      </span>
                    ) : null}
                  </dt>
                  <dd className="tab-num font-heading mt-1 text-lg text-cream">
                    {numDecimal(result.units[u])}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="font-body mt-3 text-[11px] leading-relaxed text-cream/40">
              † Marla/kanal follow the North India (Punjab/Haryana) convention
              — not a region-verified figure the way bigha is.
            </p>

            {/* Provenance line (AD-6) — never a silent constant. */}
            <div className="mt-6 rounded-xl bg-gold/15 p-4">
              <p className="font-body text-sm text-cream">
                Active bigha basis:{" "}
                <span className="font-medium text-gold">
                  {numDecimal(result.activeBigha.bighaSqFt)} sq ft
                </span>{" "}
                ({result.activeBigha.regionLabel}) · 1 biswa ={" "}
                <span className="font-medium text-gold">
                  {numDecimal(result.activeBigha.biswaSqFt)} sq ft
                </span>
              </p>
              <p className="font-body mt-1 text-xs text-cream/60">
                As of {result.activeBigha.asOf} · Source:{" "}
                {result.activeBigha.source}
              </p>
            </div>

            <ResultActions />
          </ResultCard>
        </div>
      </div>
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
