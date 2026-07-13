"use client";

// A controlled select styled to match InputField's bordered box (AD-8). New
// shared chassis primitive — stamp-duty-rj's state selector and vastu's
// direction picker reuse this later, so keep it generic (no area-specific
// logic here).

type Option = { value: string; label: string };

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  id?: string;
};

export function Select({ label, value, onChange, options, id }: Props) {
  const fieldId =
    id ??
    `select-${label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`;
  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="font-body text-sm text-ink/70">
        {label}
      </label>
      <div className="flex items-center gap-1.5 rounded-lg border border-line bg-cream px-3 py-2.5 transition-colors focus-within:border-gold focus-within:bg-cream-warm/40 focus-within:ring-2 focus-within:ring-gold/20">
        <select
          id={fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent font-body text-base font-medium text-ink outline-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span aria-hidden className="text-ink/40 text-xs">
          ▾
        </span>
      </div>
    </div>
  );
}
