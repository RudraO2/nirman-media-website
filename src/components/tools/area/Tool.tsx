"use client";

import { useMemo } from "react";
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
import { ResultActions } from "@/components/tools/_surface/ResultActions";
import { ToolLayout } from "@/components/tools/_surface/ToolLayout";

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
    <ToolLayout
      controls={
        <>
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
            <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 font-body text-sm leading-relaxed text-zinc-600">
              <span className="font-medium text-zinc-900">
                North India convention.
              </span>{" "}
              Marla and kanal follow the Punjab/Haryana measure — this figure is
              not native to Rajasthan and is not a region-verified value the way
              bigha is.
            </p>
          ) : null}

          <p className="font-body text-xs leading-relaxed text-zinc-500">
            Bigha has no national standard. Fixed units (sq ft, gaj, sq m, acre,
            hectare, cent, guntha, ground) are the same everywhere; bigha and
            biswa change with the region you pick above.
          </p>
        </>
      }
      result={
        <ResultCard eyebrow="Converted area">
          <div>
            <p
              className="tab-num font-body font-semibold leading-none tracking-tight text-emerald-400"
              style={{ fontSize: "clamp(32px, 7vw, 52px)" }}
            >
              {numDecimal(result.sqft)}{" "}
              <span className="text-[0.42em] font-normal text-zinc-400">
                sq ft
              </span>
            </p>
            <p className="font-body mt-2 text-sm text-zinc-400">
              {numDecimal(state.value)} {unitShort[state.fromUnit]} converted
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5 sm:grid-cols-3">
            {AREA_UNIT_IDS.map((u) => (
              <div key={u}>
                <dt className="font-body flex items-center gap-1.5 text-xs text-zinc-400">
                  {u === state.fromUnit ? (
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
                    />
                  ) : null}
                  {unitLabels[u]}
                  {u === "marla" || u === "kanal" ? (
                    <span
                      aria-hidden
                      title="North India convention — not a Rajasthan-verified figure"
                      className="text-zinc-500"
                    >
                      †
                    </span>
                  ) : null}
                </dt>
                <dd className="tab-num font-body mt-1 text-lg font-semibold text-white">
                  {numDecimal(result.units[u])}
                </dd>
              </div>
            ))}
          </dl>
          <p className="font-body mt-3 text-[11px] leading-relaxed text-zinc-500">
            † Marla/kanal follow the North India (Punjab/Haryana) convention
            — not a region-verified figure the way bigha is.
          </p>

          {/* Provenance line (AD-6) — never a silent constant. */}
          <div className="mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
            <p className="font-body text-sm text-zinc-200">
              Active bigha basis:{" "}
              <span className="font-medium text-emerald-300">
                {numDecimal(result.activeBigha.bighaSqFt)} sq ft
              </span>{" "}
              ({result.activeBigha.regionLabel}) · 1 biswa ={" "}
              <span className="font-medium text-emerald-300">
                {numDecimal(result.activeBigha.biswaSqFt)} sq ft
              </span>
            </p>
            <p className="font-body mt-1 text-xs text-zinc-400">
              As of {result.activeBigha.asOf} · Source:{" "}
              {result.activeBigha.source}
            </p>
          </div>

          <ResultActions />
        </ResultCard>
      }
    />
  );
}
