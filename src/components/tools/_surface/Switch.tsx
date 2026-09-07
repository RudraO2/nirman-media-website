"use client";

// A labeled on/off switch row (AD-8). A real switch reads state at a glance;
// the description line carries the state-specific copy.

type Props = {
  label: string;
  /** state-dependent line under the label */
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
};

export function Switch({ label, description, checked, onChange, id }: Props) {
  const fieldId =
    id ??
    `switch-${label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`;
  return (
    <button
      type="button"
      id={fieldId}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 text-left transition-colors duration-200 ${
        checked
          ? "border-emerald-500/60 bg-emerald-50"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <span className="min-w-0">
        <span className="block font-body text-sm font-medium text-zinc-900">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block font-body text-xs leading-relaxed text-zinc-500">
            {description}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-emerald-500" : "bg-zinc-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
