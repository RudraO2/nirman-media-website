"use client";

import { inrCompact, num } from "@/lib/tools/format";

// The core tool control (AD-8): a label, a synced numeric field, and a range
// slider that edit ONE value. Slider for feel, field for precision — per the
// UX contract. Optional one-tap `presets` chips remove the "what do I even
// drag this to?" problem for money fields on phones. Recompute is driven by
// the parent's onChange; there is no submit.

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  /** rendered before the numeric field, e.g. "₹" */
  prefix?: string;
  /** rendered after the numeric field, e.g. "%" or "years" */
  suffix?: string;
  /** small helper under the track, e.g. formatted lakh/crore value */
  hint?: string;
  /** one-tap common values shown as chips under the track */
  presets?: number[];
  id?: string;
};

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix,
  suffix,
  hint,
  presets,
  id,
}: Props) {
  const fieldId = id ?? `slider-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const pct = ((value - min) / (max - min)) * 100;

  // Money bounds read as ₹5 L / ₹5 Cr; everything else as plain numbers.
  const fmt = (n: number) =>
    prefix === "₹" ? inrCompact(n) : `${num(n)}${suffix ? ` ${suffix}` : ""}`;

  return (
    <div className="space-y-2.5">
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={fieldId} className="font-body text-sm text-zinc-600">
          {label}
        </label>
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 transition-colors duration-200 hover:border-zinc-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:hover:border-emerald-500">
          {prefix ? (
            <span className="font-body text-sm text-zinc-400">{prefix}</span>
          ) : null}
          <input
            id={fieldId}
            type="number"
            inputMode="decimal"
            value={Number.isFinite(value) ? value : ""}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isNaN(v)) onChange(clamp(v));
            }}
            className="tab-num w-28 bg-transparent text-right font-body text-base font-medium text-zinc-900 outline-none"
          />
          {suffix ? (
            <span className="font-body text-sm text-zinc-400">{suffix}</span>
          ) : null}
        </div>
      </div>

      <input
        type="range"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="tool-range w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />

      <div className="tab-num flex items-baseline justify-between font-body text-xs text-zinc-400">
        <span className={hint ? "text-zinc-500" : undefined}>
          {hint ?? fmt(min)}
        </span>
        <span>{fmt(max)}</span>
      </div>

      {presets && presets.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {presets.map((p) => {
            const active = value === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onChange(clamp(p))}
                className={`cursor-pointer rounded-full border px-2.5 py-1 font-body text-xs transition-colors duration-200 ${
                  active
                    ? "border-emerald-500 bg-emerald-500 font-medium text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400 hover:text-zinc-900"
                }`}
              >
                {fmt(p)}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
