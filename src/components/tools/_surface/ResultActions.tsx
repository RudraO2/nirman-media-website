"use client";

import { useState } from "react";
import { CheckIcon, DownloadIcon, LinkIcon } from "./icons";

// The action row at the foot of every ResultCard (AD-8): print-to-PDF and
// copy-link. Dark-surface only.

export function ResultActions() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-6 flex flex-wrap gap-2.5 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 font-body text-sm font-medium text-zinc-950 transition-colors duration-200 hover:bg-emerald-400"
      >
        <DownloadIcon className="h-4 w-4" />
        Download PDF
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {
            /* clipboard unavailable — no-op */
          }
        }}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-body text-sm text-white transition-colors duration-200 hover:border-emerald-400 hover:text-emerald-400"
      >
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4 text-emerald-400" />
            Link copied
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            Share
          </>
        )}
      </button>
    </div>
  );
}
