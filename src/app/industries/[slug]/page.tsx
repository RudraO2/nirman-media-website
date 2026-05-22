import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { industries, industryBySlug } from "@/lib/industries";
import { IndustryHero } from "@/components/sections/IndustryHero";
import { IndustryBento } from "@/components/sections/IndustryBento";
import { IndustryDeliverables } from "@/components/sections/IndustryDeliverables";
import { CTA } from "@/components/sections/CTA";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) return { title: "Not found — Nirman Media" };
  return {
    title: `${industry.name} — Nirman Media`,
    description: `${industry.tagline} ${industry.blurb}`,
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) notFound();

  const others = industries.filter((i) => i.slug !== industry.slug);

  return (
    <>
      <IndustryHero industry={industry} />
      <IndustryBento industry={industry} />
      <IndustryDeliverables industry={industry} />

      <section className="bg-cream py-20 md:py-28 px-6 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow text-gold mb-5">Also for</p>
          <h3
            className="font-heading leading-[0.98] text-ink mb-10 md:mb-14 max-w-3xl"
            style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
          >
            Other rooms we shoot.
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/industries/${o.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-navy cursor-pointer"
              >
                <Image
                  src={o.cover}
                  alt={o.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-cream">
                  <p className="eyebrow text-gold mb-1">Industry</p>
                  <h4 className="font-heading text-xl md:text-2xl leading-tight">
                    {o.label}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
