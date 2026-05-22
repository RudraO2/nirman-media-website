type Props = {
  index: string;
  label: string;
  caption?: string;
  tone?: "cream" | "navy";
};

export function PageMeta({ index, label, caption, tone = "cream" }: Props) {
  const onNavy = tone === "navy";
  return (
    <div
      className={`flex items-center justify-between gap-4 border-t pt-3 md:pt-4 ${
        onNavy ? "border-cream/15" : "border-line/70"
      }`}
    >
      <div className="flex items-baseline gap-3 md:gap-4">
        <span
          className={`eyebrow tab-num text-[10px] md:text-[11px] ${
            onNavy ? "text-gold" : "text-gold"
          }`}
        >
          {index}
        </span>
        <span
          className={`eyebrow text-[10px] md:text-[11px] ${
            onNavy ? "text-cream/60" : "text-ink/55"
          }`}
        >
          {label}
        </span>
      </div>
      {caption ? (
        <span
          className={`hidden sm:inline eyebrow text-[10px] md:text-[11px] truncate max-w-[60%] text-right ${
            onNavy ? "text-cream/55" : "text-ink/50"
          }`}
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
}
