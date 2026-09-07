import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { CrossPromo } from "./CrossPromo";
import { ChevronDownIcon } from "@/components/tools/_surface/icons";
import type { ToolMeta } from "@/lib/tools/types";

// The reusable chassis every tool rides (AD-3). Tools deliberately run a
// lighter, app-like visual system (white/zinc + emerald, sans-serif) than the
// site's editorial pages — utilities, not brochures. Provides the SEO landing
// structure (H1 + one-liner, tool above the fold, FAQ below with FAQPage
// JSON-LD) and the cross-promo strip. The interactive tool island is
// passed as {children}.

export function ToolShell({
  tool,
  children,
}: {
  tool: ToolMeta;
  children: React.ReactNode;
}) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.seo.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Header — compact utility chrome + the plain-words pitch. The tool
          itself is the page; this orients and says what the tool answers. */}
      <header className="border-b border-zinc-200 bg-white px-5 pt-20 pb-6 md:px-10 md:pt-24 md:pb-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex min-w-0 items-center gap-2 font-body text-xs text-zinc-500">
              <LogoMark size={20} className="shrink-0 rounded-sm" />
              <Link
                href="/tools"
                className="transition-colors hover:text-zinc-900"
              >
                All tools
              </Link>
              <span aria-hidden className="text-zinc-300">
                /
              </span>
              <span className="truncate text-zinc-400">{tool.title}</span>
            </div>
            <span
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 font-body text-[11px] font-medium text-zinc-500"
              title="Runs entirely in your browser — nothing is sent or stored"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Private — nothing stored
            </span>
          </div>
          <h1 className="font-body mt-5 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            {tool.seo.h1}
          </h1>
          <p className="font-body mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500 md:text-base">
            {tool.oneLiner}
          </p>
        </div>
      </header>

      {/* The tool itself — above the fold. */}
      <section className="bg-zinc-50 px-5 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-[1200px]">{children}</div>
      </section>

      {/* FAQ — the SEO body, as tappable accordions */}
      <section className="border-t border-zinc-200 bg-white px-5 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="font-body text-lg font-semibold tracking-tight text-zinc-900 md:text-xl">
            Questions people ask
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 border-y border-zinc-200">
            {tool.seo.faq.map((f) => (
              <details
                key={f.q}
                className="group py-4 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-body text-sm font-medium text-zinc-900 md:text-base">
                  {f.q}
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="font-body mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CrossPromo />
    </>
  );
}
