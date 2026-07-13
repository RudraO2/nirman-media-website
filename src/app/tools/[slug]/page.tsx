import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { tools, toolBySlug, liveTools } from "@/lib/tools/registry";
import { toolComponents } from "@/components/tools/registry";
import { ToolShell } from "@/components/tools/_shell/ToolShell";

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
    alternates: { canonical: `/tools/${tool.slug}` },
    robots: isLive ? undefined : { index: false, follow: true },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = toolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = toolComponents[tool.slug];

  return (
    <ToolShell tool={tool}>
      {ToolComponent ? (
        // Suspense is required: the tool reads URL state via useSearchParams,
        // which fails the static-export build without a boundary here.
        <Suspense
          fallback={
            <div className="py-24 text-center font-body text-ink/40">
              Loading calculator…
            </div>
          }
        >
          <ToolComponent />
        </Suspense>
      ) : (
        <p className="py-24 text-center font-body text-ink/50">
          This tool is coming soon.
        </p>
      )}
    </ToolShell>
  );
}
