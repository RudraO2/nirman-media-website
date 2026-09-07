// Presentational result frame shared by every tool (AD-8). The one dark
// surface in the tools' light app system — maximum hierarchy for the answer.

export function ResultCard({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-950 p-5 text-white shadow-lg ring-1 ring-white/10 sm:p-6 md:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
      {eyebrow ? (
        <p className="mb-4 font-body text-xs font-medium tracking-wide text-emerald-400 uppercase">
          {eyebrow}
        </p>
      ) : null}
      {children}
    </div>
  );
}
