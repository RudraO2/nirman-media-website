"use client";

// A plain labeled numeric field for values that don't need a slider
// (e.g. a prepayment amount). Shares the surface look with <Slider>.

type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  id?: string;
};

export function InputField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
  id,
}: Props) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="font-body text-sm text-zinc-600">
        {label}
      </label>
      <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 transition-colors duration-200 hover:border-zinc-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:hover:border-emerald-500">
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
            if (!Number.isNaN(v)) {
              let next = v;
              if (min !== undefined) next = Math.max(min, next);
              if (max !== undefined) next = Math.min(max, next);
              onChange(next);
            }
          }}
          className="tab-num w-full bg-transparent font-body text-base font-medium text-zinc-900 outline-none"
        />
        {suffix ? (
          <span className="font-body text-sm text-zinc-400">{suffix}</span>
        ) : null}
      </div>
    </div>
  );
}
