import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { posts } from "@/lib/blog";
import { Reveal } from "@/components/animation/Reveal";
import { CTA } from "@/components/sections/CTA";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — Nirman Media",
  description:
    "Guides on real estate videography, hotel photography, 3D tours and restaurant media in Jaipur — pricing, process, and what actually converts.",
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: "Blog — Nirman Media",
    description:
      "Field guides on films, photography and 3D tours for spaces that need to sell.",
    type: "website",
    images: [{ url: "/hero/hero-poster.jpg", width: 1280, height: 720 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Nirman Media",
    description:
      "Field guides on films, photography and 3D tours for spaces that need to sell.",
  },
};

const BASE = SITE_URL;
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog/` },
  ],
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  // Lead with the newest English article; Hindi pairs sit in the grid.
  const lead = sorted.find((p) => p.lang !== "hi") ?? sorted[0];
  const rest = sorted.filter((p) => p.slug !== lead.slug);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="bg-cream pt-28 md:pt-36 pb-16 md:pb-20 px-6 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <Reveal as="p" className="eyebrow text-gold mb-4">
            Field notes
          </Reveal>
          <Reveal
            as="h1"
            delay={80}
            className="font-heading leading-[0.95] text-ink max-w-4xl"
          >
            <span style={{ fontSize: "clamp(40px, 7vw, 104px)" }} className="block">
              What we&apos;ve learned{" "}
              <em className="font-heading-italic text-gold">on set.</em>
            </span>
          </Reveal>
          <Reveal
            as="p"
            delay={140}
            className="font-body text-ink/70 max-w-xl mt-6 text-base md:text-lg"
          >
            Pricing, process and honest advice on films, photography and 3D
            tours — from shoots across Jaipur&apos;s hotels, restaurants and
            construction sites.
          </Reveal>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-10 pb-24 md:pb-32">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href={`/blog/${lead.slug}`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center rounded-2xl overflow-hidden bg-navy text-cream mb-10 md:mb-14 cursor-pointer"
          >
            <div className="relative md:col-span-7 aspect-[16/10] md:aspect-[16/11]">
              <Image
                src={lead.cover}
                alt={lead.coverAlt}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
              />
            </div>
            <div className="md:col-span-5 p-6 md:p-10 md:pr-14">
              <p className="eyebrow text-gold mb-4">
                {fmt(lead.date)} · {lead.readMinutes} min read
              </p>
              <h2
                className="font-heading leading-[1.02] mb-4"
                style={{ fontSize: "clamp(26px, 3vw, 44px)" }}
              >
                {lead.title}
              </h2>
              <p className="font-body text-cream/70 text-sm md:text-base leading-relaxed mb-6">
                {lead.description}
              </p>
              <span className="font-body text-sm text-gold">
                Read the guide{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </div>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-2xl overflow-hidden bg-sand cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={p.cover}
                    alt={p.coverAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                  />
                </div>
                <div
                  className="p-6 flex flex-col gap-3 flex-1"
                  lang={p.lang === "hi" ? "hi" : "en"}
                >
                  <p className="eyebrow text-ink/45 flex items-center gap-2">
                    <span>
                      {fmt(p.date)} · {p.readMinutes} min read
                    </span>
                    {p.lang === "hi" && (
                      <span className="bg-gold/15 text-gold px-2 py-0.5 rounded-full text-[10px] tracking-normal">
                        हिंदी
                      </span>
                    )}
                  </p>
                  <h2 className="font-heading text-xl md:text-2xl leading-snug text-ink">
                    {p.title}
                  </h2>
                  <p className="font-body text-sm text-ink/65 leading-relaxed">
                    {p.description}
                  </p>
                  <span className="font-body text-sm text-gold mt-auto pt-2">
                    Read{" "}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
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
