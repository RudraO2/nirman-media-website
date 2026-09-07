"use client";

import { PlusIcon } from "./icons";

// The progressive-disclosure box every tool uses for optional inputs and
// long tables (AD-8). `printExpand` applies the print-safe variant: only the
// toggle icon is hidden in print (the heading text stays), and collapsed
// content is forced visible so "Download PDF" never silently omits the
// inputs behind a printed result. The matching @media print rules live in
// globals.css, keyed off data-print-expand.

type Props = {
  label: string;
  /** dimmed trailing part of the summary line, e.g. "— see what you save" */
  sub?: string;
  /** "light" for the white controls deck, "dark" for inside a ResultCard */
  tone?: "light" | "dark";
  /** force content into print output even while collapsed on screen */
  printExpand?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  children: React.ReactNode;
};

export function Disclosure({
  label,
  sub,
  tone = "light",
  printExpand,
  open,
  onToggle,
  children,
}: Props) {
  const surface =
    tone === "light"
      ? "rounded-xl border border-zinc-200 bg-zinc-50"
      : "rounded-xl border border-white/10";
  const text = tone === "light" ? "text-zinc-900" : "text-zinc-200";
  const subText = tone === "light" ? "text-zinc-500" : "text-zinc-500";

  return (
    <details
      className={`group ${surface} p-4 [&_summary::-webkit-details-marker]:hidden`}
      data-print-expand={printExpand ? "" : undefined}
      open={open}
      onToggle={
        onToggle ? (e) => onToggle(e.currentTarget.open) : undefined
      }
    >
      <summary
        className={`flex cursor-pointer items-center justify-between gap-3 font-body text-sm font-medium ${text}`}
      >
        <span>
          {label} {sub ? <span className={subText}>{sub}</span> : null}
        </span>
        <PlusIcon className="disclosure-icon h-4 w-4 shrink-0 text-emerald-500 transition-transform duration-200 group-open:rotate-45" />
      </summary>
      <div className="disclosure-body mt-5">{children}</div>
    </details>
  );
}
