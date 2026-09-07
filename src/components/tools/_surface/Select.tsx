"use client";

import { ChevronDownIcon } from "./icons";

// A controlled select styled to match InputField's bordered box (AD-8).
// Generic on purpose — several tools reuse it (units, regions, categories).

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
      <label htmlFor={fieldId} className="font-body text-sm text-zinc-600">
        {label}
      </label>
      <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 transition-colors duration-200 hover:border-zinc-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:hover:border-emerald-500">
        <select
          id={fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent font-body text-base font-medium text-zinc-900 outline-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-zinc-400" />
      </div>
    </div>
  );
}
