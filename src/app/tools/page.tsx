import type { Metadata } from "next";
import Link from "next/link";
import { liveTools, plannedTools, tools } from "@/lib/tools/registry";
import type { ToolCategory, ToolMeta } from "@/lib/tools/types";

export const metadata: Metadata = {
  title: "Free Property Tools — Nirman Media",
  description:
    "Free, fast calculators for Indian real estate & vastu — EMI, area conversion, stamp duty and more. Built for buyers, sellers and brokers in Jaipur & Rajasthan.",
  alternates: { canonical: "/tools" },
};

const categoryLabel: Record<ToolCategory, string> = {
  finance: "Money",
  land: "Land & area",
  vastu: "Vastu",
  legal: "Legal & tax",
};

export default function ToolsIndexPage() {
  return (
    <>
      <header className="border-b border-line bg-cream px-6 pt-28 pb-12 md:px-10 md:pt-32 md:pb-16">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow text-gold mb-4">Nirman Tools</p>
          <h1
            className="font-heading text-ink leading-[1.0] max-w-3xl"
            style={{ fontSize: "clamp(34px, 5vw, 68px)" }}
          >
            Free property tools, done properly.
          </h1>
          <p className="font-body text-ink/70 mt-5 max-w-2xl text-base md:text-lg">
            Fast, accurate calculators for Indian real estate & vastu — built for
            Jaipur & Rajasthan, free to use, no sign-up.
          </p>

          {/* Trust strip — cheap, honest credibility signal (no fake badges) */}
          <ul className="mt-9 flex flex-wrap gap-x-10 gap-y-3">
            <li className="flex items-baseline gap-2">
              <span className="tab-num font-heading text-ink text-2xl">
                {liveTools.length}
              </span>
              <span className="font-body text-ink/55 text-sm">live now</span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="tab-num font-heading text-ink text-2xl">
                {tools.length}
              </span>
              <span className="font-body text-ink/55 text-sm">in the catalog</span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="font-heading text-ink text-2xl">Free</span>
              <span className="font-body text-ink/55 text-sm">no sign-up, ever</span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="font-heading text-ink text-2xl">Private</span>
              <span className="font-body text-ink/55 text-sm">
                runs in your browser — nothing sent, nothing stored
              </span>
            </li>
          </ul>
        </div>
      </header>

      <section className="bg-cream px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveTools.map((tool) => (
              <LiveCard
                key={tool.slug}
                tool={tool}
                featured={liveTools.length === 1}
              />
            ))}
            {plannedTools.map((tool) => (
              <PlannedCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function LiveCard({ tool, featured }: { tool: ToolMeta; featured?: boolean }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group flex flex-col justify-between rounded-2xl border border-line bg-cream-warm/40 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md md:p-7 ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <div>
        <div className="mb-5 flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/12 text-gold">
            <CategoryIcon category={tool.category} className="h-5 w-5" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 font-body text-[11px] font-medium tracking-wide text-ink/70">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            Live
          </span>
        </div>
        <p className="eyebrow text-gold mb-3">
          {categoryLabel[tool.category] ?? tool.category}
        </p>
        <h2
          className="font-heading text-ink leading-tight"
          style={{ fontSize: featured ? "clamp(22px, 2.4vw, 30px)" : "22px" }}
        >
          {tool.title}
        </h2>
        <p className="font-body text-ink/65 mt-3 max-w-md text-sm leading-relaxed">
          {tool.oneLiner}
        </p>
      </div>
      <span className="arrow-link mt-6 font-body text-sm font-medium text-ink group-hover:text-gold">
        Open tool <span data-arrow>→</span>
      </span>
    </Link>
  );
}

function PlannedCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-dashed border-line/80 bg-cream p-6 transition-colors hover:border-ink/30 md:p-7"
    >
      <div>
        <div className="mb-5 flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink/5 text-ink/35">
            <CategoryIcon category={tool.category} className="h-5 w-5" />
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 font-body text-[11px] font-medium tracking-wide text-ink/40">
            Coming soon
          </span>
        </div>
        <p className="eyebrow text-ink/35 mb-3">
          {categoryLabel[tool.category] ?? tool.category}
        </p>
        <h2 className="font-heading text-ink/70 text-xl leading-tight">
          {tool.title}
        </h2>
        <p className="font-body text-ink/45 mt-3 text-sm leading-relaxed">
          {tool.oneLiner}
        </p>
      </div>
    </Link>
  );
}

// Hand-drawn SVG icons, one per registry category — no icon library, matches
// the house style set by the EMI donut. Uniform 24x24 stroke grammar.
function CategoryIcon({
  category,
  className,
}: {
  category: ToolCategory;
  className?: string;
}) {
  const paths: Record<ToolCategory, React.ReactNode> = {
    finance: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v10M9.25 9.4c0-1.32 1.23-2.4 2.75-2.4s2.75 1.08 2.75 2.4c0 3.2-5.5 1.87-5.5 5.07 0 1.32 1.23 2.4 2.75 2.4s2.75-1.08 2.75-2.4" />
      </>
    ),
    land: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
        <path d="M3.5 9.5h17M3.5 15h17M9.5 3.5v17M15 3.5v17" />
      </>
    ),
    vastu: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 3.5 13.6 10.4 20.5 12 13.6 13.6 12 20.5 10.4 13.6 3.5 12 10.4 10.4Z" />
      </>
    ),
    legal: (
      <>
        <path d="M12 3.5v17M7 6.5h10M4.5 11l2.5-5 2.5 5a2.5 2.5 0 0 1-5 0ZM14.5 11l2.5-5 2.5 5a2.5 2.5 0 0 1-5 0Z" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[category]}
    </svg>
  );
}
