// The two-panel workspace every tool renders into (AD-8). Tools deliberately
// run a lighter, app-like visual system (white/zinc + emerald) than the
// site's editorial pages — they're utilities, not brochures. On phones the
// RESULT comes first so the answer is visible immediately; inputs follow.

export function ToolLayout({
  controls,
  controlsLabel = "Your numbers",
  result,
}: {
  controls: React.ReactNode;
  /** small label at the top of the input deck */
  controlsLabel?: string;
  result: React.ReactNode;
}) {
  return (
    <div className="grid items-start gap-5 md:grid-cols-12 md:gap-6">
      <div className="order-2 rounded-2xl border border-zinc-200 bg-white p-5 md:order-1 md:col-span-5 md:p-6">
        <p className="mb-5 font-body text-xs font-medium tracking-wide text-zinc-400 uppercase">
          {controlsLabel}
        </p>
        <div className="space-y-6">{controls}</div>
      </div>
      <div className="order-1 md:order-2 md:col-span-7">
        <div className="md:sticky md:top-24">{result}</div>
      </div>
    </div>
  );
}
