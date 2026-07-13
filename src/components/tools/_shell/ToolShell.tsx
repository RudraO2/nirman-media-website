import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { CrossPromo } from "./CrossPromo";
import type { ToolMeta } from "@/lib/tools/types";

// The reusable chassis every tool rides (AD-3). Branded-light: logo corner + one
// gold accent + site typography. It provides the SEO landing structure (H1, tool
// above the fold, explainer + FAQ below with FAQPage JSON-LD) and the cross-promo
// strip. The interactive tool island is passed as {children}.

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

      {/* Header — the "light brand": logo corner + eyebrow, tool title as H1 */}
      <header className="border-b border-line bg-cream px-6 pt-28 pb-10 md:px-10 md:pt-32 md:pb-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-6 flex items-center gap-2.5">
            <LogoMark size={26} className="rounded-sm" />
            <span className="eyebrow text-ink/50">Nirman Tools</span>
            <span aria-hidden className="text-line">
              /
            </span>
            <Link
              href="/tools"
              className="eyebrow text-ink/50 link-underline hover:text-ink"
            >
              All tools
            </Link>
            <span aria-hidden className="text-line ml-1">
              /
            </span>
            <span className="eyebrow text-ink/40" title="Runs entirely in your browser — nothing is sent or stored">
              Private — nothing stored
            </span>
          </div>
          <h1
            className="font-heading text-ink leading-[1.0]"
            style={{ fontSize: "clamp(30px, 4.5vw, 60px)" }}
          >
            {tool.seo.h1}
          </h1>
          <p className="font-body text-ink/70 mt-4 max-w-2xl text-base md:text-lg">
            {tool.oneLiner}
          </p>
        </div>
      </header>

      {/* The tool itself — above the fold. Tinted vs. the header/explainer to
          read as a distinct "workspace" without adding another border. */}
      <section className="bg-cream-warm/30 px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-[1280px]">{children}</div>
      </section>

      {/* Explainer + FAQ — the SEO body */}
      <section className="border-t border-line bg-cream px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow text-gold mb-3">Good to know</p>
            <h2
              className="font-heading text-ink leading-[1.05]"
              style={{ fontSize: "clamp(22px, 2.6vw, 34px)" }}
            >
              Questions people ask
            </h2>
          </div>
          <div className="md:col-span-8">
            <dl className="divide-y divide-line">
              {tool.seo.faq.map((f) => (
                <div key={f.q} className="py-5 first:pt-0">
                  <dt className="font-heading text-lg text-ink">{f.q}</dt>
                  <dd className="font-body text-ink/70 mt-2 leading-relaxed">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <CrossPromo />
    </>
  );
}
