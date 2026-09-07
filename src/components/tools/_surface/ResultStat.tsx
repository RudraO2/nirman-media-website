// The labeled figure used inside every ResultCard's stat grid (AD-8).
// Dark-surface only: it assumes the zinc-950 card behind it.

export function ResultStat({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  dot?: "accent" | "plain";
}) {
  return (
    <div>
      <dt className="font-body flex items-center gap-1.5 text-xs text-zinc-400">
        {dot ? (
          <span
            aria-hidden
            className={`inline-block h-2 w-2 rounded-full ${
              dot === "accent" ? "bg-emerald-400" : "bg-white/70"
            }`}
          />
        ) : null}
        {label}
      </dt>
      <dd className="tab-num font-body mt-1 text-lg font-semibold text-white">
        {value}
      </dd>
    </div>
  );
}
