// The hero figure at the top of a ResultCard (AD-8) — one place for the
// number's type scale. Sans-serif + tabular: reads as an app, not an editorial.

const sizes = {
  lg: "clamp(36px, 8vw, 56px)",
  md: "clamp(30px, 6vw, 44px)",
} as const;

export function ResultValue({
  value,
  caption,
  size = "lg",
  tone = "accent",
}: {
  value: React.ReactNode;
  /** small line under the figure, e.g. "per month" */
  caption?: React.ReactNode;
  size?: keyof typeof sizes;
  tone?: "accent" | "plain";
}) {
  return (
    <div>
      <p
        className={`tab-num font-body font-semibold leading-none tracking-tight ${
          tone === "accent" ? "text-emerald-400" : "text-white"
        }`}
        style={{ fontSize: sizes[size] }}
      >
        {value}
      </p>
      {caption ? (
        <p className="font-body mt-2 text-sm text-zinc-400">{caption}</p>
      ) : null}
    </div>
  );
}
