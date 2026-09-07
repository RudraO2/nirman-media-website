"use client";

// A small mutually-exclusive pill group (AD-8). The parent owns the state;
// clicking an already-active option still fires onChange so a parent may
// implement toggle-off (EMI does).

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  /** visible group label above the pills */
  label?: string;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <div className="space-y-2.5">
      {label ? (
        <p className="font-body text-sm text-zinc-600">{label}</p>
      ) : null}
      <div
        className="flex gap-1 rounded-xl border border-zinc-200 bg-zinc-100 p-1"
        role="group"
        aria-label={label}
      >
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={`flex-1 cursor-pointer rounded-lg px-3 py-2 font-body text-sm transition-colors duration-200 ${
                active
                  ? "bg-white font-medium text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
