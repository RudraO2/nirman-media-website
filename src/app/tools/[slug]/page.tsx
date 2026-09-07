import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { tools, toolBySlug, liveTools } from "@/lib/tools/registry";
import { toolComponents } from "@/components/tools/registry";
import { ToolShell } from "@/components/tools/_shell/ToolShell";
import { SITE_URL } from "@/lib/site";

// One dynamic route renders every tool (AD-3), mirroring industries/[slug].
export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolBySlug(slug);
  if (!tool) return { title: "Tool not found — Nirman Media" };
  const isLive = liveTools.some((t) => t.slug === tool.slug);
  return {
    title: `${tool.seo.h1} — Nirman Media`,
    description: tool.seo.description,
    alternates: { canonical: `/tools/${tool.slug}/` },
    robots: isLive ? undefined : { index: false, follow: true },
  };
}

const BASE = SITE_URL;

const applicationCategoryFor = (category: (typeof tools)[number]["category"]) =>
  category === "finance" ? "FinanceApplication" : "UtilitiesApplication";

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = toolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = toolComponents[tool.slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: tool.seo.h1,
        url: `${BASE}/tools/${tool.slug}/`,
        applicationCategory: applicationCategoryFor(tool.category),
        operatingSystem: "Any (web-based)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        description: tool.seo.description,
      },
      ...(tool.seo.faq.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: tool.seo.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE}/tools/` },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.title,
            item: `${BASE}/tools/${tool.slug}/`,
          },
        ],
      },
    ],
  };

  return (
    <ToolShell tool={tool}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {ToolComponent ? (
        // Suspense is required: the tool reads URL state via useSearchParams,
        // which fails the static-export build without a boundary here.
        <Suspense
          fallback={
            <div className="py-24 text-center font-body text-zinc-400">
              Loading calculator…
            </div>
          }
        >
          <ToolComponent />
        </Suspense>
      ) : (
        <p className="py-24 text-center font-body text-zinc-500">
          This tool is coming soon.
        </p>
      )}
    </ToolShell>
  );
}
