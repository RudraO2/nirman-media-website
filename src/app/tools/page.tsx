import type { Metadata } from "next";
import Link from "next/link";
import { liveTools, plannedTools } from "@/lib/tools/registry";
import type { ToolCategory, ToolMeta } from "@/lib/tools/types";
import { SITE_URL } from "@/lib/site";

const TITLE = "Free Property Tools — Nirman Media";
const DESCRIPTION =
  "Free, fast calculators for Indian real estate & vastu — EMI, area conversion, stamp duty and more. Built for buyers, sellers and brokers in Jaipur & Rajasthan.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/hero/hero-poster.jpg", width: 1280, height: 720 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const categoryLabel: Record<ToolCategory, string> = {
  finance: "Money",
  land: "Land & area",
  legal: "Legal & tax",
  vastu: "Vastu",
};

const BASE = SITE_URL;

export default function ToolsIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE}/tools/` },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: liveTools.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.title,
          url: `${BASE}/tools/${t.slug}/`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="border-b border-zinc-200 bg-white px-5 pt-24 pb-10 md:px-10 md:pt-28 md:pb-12">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-body text-xs font-medium tracking-wide text-emerald-600 uppercase">
            Nirman Tools
          </p>
          <h1 className="font-body mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            Free property calculators
          </h1>
          <p className="font-body mt-3 max-w-xl text-sm leading-relaxed text-zinc-500 md:text-base">
            Answer the money questions before you sign anything — your EMI,
            what the government charges, what a plot really measures, whether
            renting beats buying. Built for Jaipur & Rajasthan.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              `${liveTools.length} tools, all free`,
              "No sign-up",
              "Works on your phone",
              "Private — runs in your browser",
            ].map((chip) => (
              <span
                key={chip}
                className="font-body rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="bg-zinc-50 px-5 py-8 md:px-10 md:py-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveTools.map((tool) => (
              <LiveCard key={tool.slug} tool={tool} />
            ))}
            {plannedTools.map((tool) => (
              <PlannedCard key={tool.slug} tool={tool} />
            ))}
          </div>

          <div className="mt-10 border-t border-zinc-200 pt-6">
            <p className="font-body text-sm text-zinc-500">
              Buying in Jaipur? Read{" "}
              <Link
                href="/blog/how-to-buy-flat-in-jaipur-step-by-step"
                className="font-medium text-emerald-600 hover:underline"
              >
                the step-by-step flat-buying guide
              </Link>{" "}
              or{" "}
              <Link
                href="/blog/best-localities-to-buy-flat-in-jaipur"
                className="font-medium text-emerald-600 hover:underline"
              >
                the best localities to buy in
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function LiveCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md md:p-6"
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors duration-200 group-hover:bg-emerald-100">
            <ToolIcon slug={tool.slug} className="h-5 w-5" />
          </span>
          <span className="font-body rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500">
            {categoryLabel[tool.category] ?? tool.category}
          </span>
        </div>
        <h2 className="font-body text-base font-semibold tracking-tight text-zinc-900 md:text-lg">
          {tool.title}
        </h2>
        <p className="font-body mt-1.5 text-sm leading-relaxed text-zinc-500">
          {tool.oneLiner}
        </p>
      </div>
      <span className="arrow-link font-body mt-5 text-sm font-medium text-emerald-600">
        Open <span data-arrow>→</span>
      </span>
    </Link>
  );
}

function PlannedCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 transition-colors duration-200 hover:border-zinc-400 md:p-6"
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
            <ToolIcon slug={tool.slug} className="h-5 w-5" />
          </span>
          <span className="font-body rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
            Coming soon
          </span>
        </div>
        <h2 className="font-body text-base font-semibold tracking-tight text-zinc-600 md:text-lg">
          {tool.title}
        </h2>
        <p className="font-body mt-1.5 text-sm leading-relaxed text-zinc-400">
          {tool.oneLiner}
        </p>
      </div>
    </Link>
  );
}

// Hand-drawn SVG icons, one per tool — no icon library, uniform 24×24 stroke
// grammar. Falls back to a generic coin for any future tool without a
// bespoke icon.
function ToolIcon({ slug, className }: { slug: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    // house + coin — a home loan
    emi: (
      <>
        <path d="M4 11.5 12 4.5l8 7M6.5 9.75V19.5h11V9.75" />
        <circle cx="12" cy="14" r="2.6" />
      </>
    ),
    // survey grid
    "area-converter": (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
        <path d="M3.5 9.5h17M3.5 15h17M9.5 3.5v17M15 3.5v17" />
      </>
    ),
    // rubber stamp
    "stamp-duty-rj": (
      <>
        <path d="M9 9.5a3 3 0 1 1 6 0c0 2.1-1.2 2.6-1.2 4.5H10.2C10.2 12.1 9 11.6 9 9.5Z" />
        <path d="M6.5 17h11M5.5 20.5h13v-2a1.5 1.5 0 0 0-1.5-1.5H7a1.5 1.5 0 0 0-1.5 1.5v2Z" />
      </>
    ),
    // opposing arrows — the trade-off
    "rent-vs-buy": (
      <>
        <path d="M4 8.5h13.5l-3.25-3.25M20 15.5H6.5l3.25 3.25" />
      </>
    ),
    // house + percent — what the asset returns
    "rental-yield": (
      <>
        <path d="M4 11 12 4l8 7M6.5 9.25V19.5h11V9.25" />
        <path d="m14.4 11.6-4.8 5.3" />
        <circle cx="10" cy="12.2" r="1.15" />
        <circle cx="14.4" cy="16.4" r="1.15" />
      </>
    ),
    // gauge — how much you qualify for
    "loan-eligibility": (
      <>
        <path d="M4 16.5a8 8 0 0 1 16 0" />
        <path d="M12 16.5 15.8 11" />
        <circle cx="12" cy="16.5" r="1.4" />
        <path d="M4 20h16" />
      </>
    ),
    // price tag — the commission on the deal
    brokerage: (
      <>
        <path d="M12.5 3.5h7a1 1 0 0 1 1 1v7L12 20 4 12l8.5-8.5Z" />
        <circle cx="16.25" cy="7.75" r="1.4" />
      </>
    ),
    // municipal receipt
    "property-tax": (
      <>
        <path d="M6.5 3.5h11v17l-1.833-1.4-1.834 1.4L12 19.1l-1.833 1.4-1.834-1.4L6.5 20.5v-17Z" />
        <path d="M9.5 8.25h5M9.5 11.75h5" />
      </>
    ),
    // compass star — directions
    "vastu-score": (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 3.5 13.6 10.4 20.5 12 13.6 13.6 12 20.5 10.4 13.6 3.5 12 10.4 10.4Z" />
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
      {icons[slug] ?? (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v10M9.25 9.4c0-1.32 1.23-2.4 2.75-2.4s2.75 1.08 2.75 2.4c0 3.2-5.5 1.87-5.5 5.07 0 1.32 1.23 2.4 2.75 2.4s2.75-1.08 2.75-2.4" />
        </>
      )}
    </svg>
  );
}
