"use client";

import { num } from "@/lib/tools/format";

// The core tool control (AD-8): a label, a synced numeric field, and a range
// slider that edit ONE value. Slider for feel, field for precision — per the UX
// contract. Recompute is driven by the parent's onChange; there is no submit.

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
  /** small helper under the label, e.g. formatted lakh/crore value */
  hint?: string;
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
  id,
}: Props) {
  const fieldId = id ?? `slider-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2.5">
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={fieldId} className="font-body text-sm text-ink/70">
          {label}
        </label>
        <div className="flex items-center gap-1.5 rounded-lg border border-line bg-cream px-2.5 py-1.5 transition-colors focus-within:border-gold focus-within:bg-cream-warm/40 focus-within:ring-2 focus-within:ring-gold/20">
          {prefix ? (
            <span className="font-body text-sm text-ink/55">{prefix}</span>
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
            className="tab-num w-28 bg-transparent text-right font-body text-base font-medium text-ink outline-none"
          />
          {suffix ? (
            <span className="font-body text-sm text-ink/55">{suffix}</span>
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

      {hint ? (
        <p className="tab-num font-body text-xs text-ink/45">{hint}</p>
      ) : (
        <p className="tab-num font-body text-xs text-ink/40">
          {num(min)}
          {prefix === "₹" ? "" : ""} – {num(max)}
        </p>
      )}
    </div>
  );
}
