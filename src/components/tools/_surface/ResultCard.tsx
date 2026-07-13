// Presentational result frame shared by every tool (AD-8). Branded-light: navy
// surface, one gold accent lives inside via the hero value the tool passes in.

export function ResultCard({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-navy text-cream p-6 shadow-xl shadow-navy/25 md:p-8"
      style={{
        backgroundImage:
          "radial-gradient(120% 100% at 0% 0%, color-mix(in oklch, var(--color-gold) 10%, transparent), transparent 55%)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      {eyebrow ? <p className="eyebrow text-gold mb-5">{eyebrow}</p> : null}
      {children}
    </div>
  );
}
