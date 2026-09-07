import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, postBySlug } from "@/lib/blog";
import { industryBySlug } from "@/lib/industries";
import { site, founder, SITE_URL } from "@/lib/site";
import { CTA } from "@/components/sections/CTA";

const BASE = SITE_URL;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return { title: "Not found — Nirman Media" };
  const languages: Record<string, string> = {};
  if (post.pairSlug) {
    const self = post.lang === "hi" ? "hi-IN" : "en-IN";
    const other = post.lang === "hi" ? "en-IN" : "hi-IN";
    const enSlug = post.lang === "hi" ? post.pairSlug : post.slug;
    languages[self] = `/blog/${post.slug}/`;
    languages[other] = `/blog/${post.pairSlug}/`;
    languages["x-default"] = `/blog/${enSlug}/`;
  }
  return {
    title: `${post.title} — Nirman Media`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}/`,
      ...(post.pairSlug ? { languages } : {}),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.cover }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const related = post.relatedIndustry
    ? industryBySlug(post.relatedIndustry)
    : undefined;
  const pair = post.pairSlug ? postBySlug(post.pairSlug) : undefined;
  const others = posts
    .filter((p) => p.slug !== post.slug && p.slug !== post.pairSlug)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        image: `${BASE}${post.cover}`,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: post.lang === "hi" ? "hi-IN" : "en-IN",
        mainEntityOfPage: `${BASE}/blog/${post.slug}/`,
        author: {
          "@type": "Person",
          name: founder.name,
          url: `${BASE}/about/`,
          sameAs: founder.sameAs,
        },
        publisher: {
          "@type": "Organization",
          name: site.name,
          url: BASE,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog/` },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `${BASE}/blog/${post.slug}/`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-cream" lang={post.lang === "hi" ? "hi" : "en"}>
        <header className="pt-28 md:pt-36 pb-10 md:pb-14 px-6 md:px-10">
          <div className="mx-auto max-w-[900px]">
            <div className="flex items-center justify-between gap-4 mb-8">
              <Link
                href="/blog"
                className="font-body text-xs text-ink/60 hover:text-gold transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span aria-hidden>←</span>{" "}
                {post.lang === "hi" ? "सभी लेख" : "All articles"}
              </Link>
              {pair && (
                <Link
                  href={`/blog/${pair.slug}`}
                  lang={pair.lang === "hi" ? "hi" : "en"}
                  className="font-body text-xs border border-ink/20 text-ink px-4 py-2 rounded-full hover:bg-ink hover:text-cream transition-colors cursor-pointer"
                >
                  {post.lang === "hi"
                    ? "Read in English"
                    : "हिंदी में पढ़ें"}
                </Link>
              )}
            </div>
            <p className="eyebrow text-gold mb-4">
              By {founder.name} · {fmt(post.date)} · {post.readMinutes} min read
            </p>
            <h1
              className="font-heading leading-[1.0] text-ink"
              style={{ fontSize: "clamp(34px, 5.4vw, 72px)" }}
            >
              {post.title}
            </h1>
          </div>
        </header>

        <div className="px-6 md:px-10 pb-12">
          <div className="mx-auto max-w-[1100px] relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={post.cover}
              alt={post.coverAlt}
              fill
              preload
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="px-6 md:px-10 pb-16 md:pb-20">
          <div className="mx-auto max-w-[720px]">
            {post.intro.map((p, i) => (
              <p
                key={i}
                className="font-body text-lg md:text-xl text-ink/85 leading-relaxed mb-6 first:font-medium"
              >
                {p}
              </p>
            ))}

            {post.sections.map((s) => (
              <section key={s.h2} className="mt-12">
                <h2 className="font-heading text-2xl md:text-4xl text-ink leading-tight mb-5">
                  {s.h2}
                </h2>
                {s.body.map((b, i) => (
                  <p
                    key={i}
                    className="font-body text-base md:text-lg text-ink/75 leading-relaxed mb-5"
                  >
                    {b}
                  </p>
                ))}
                {s.list && (
                  <ul className="my-6 space-y-3">
                    {s.list.map((li, i) => (
                      <li
                        key={i}
                        className="font-body text-base md:text-lg text-ink/80 leading-relaxed pl-6 relative"
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-[0.72em] w-2.5 h-[2px] bg-gold"
                        />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section className="mt-14 border-t border-ink/15 pt-10">
              <h2 className="font-heading text-2xl md:text-4xl text-ink leading-tight mb-7">
                Frequently asked questions
              </h2>
              <dl className="space-y-7">
                {post.faq.map((f) => (
                  <div key={f.q}>
                    <dt className="font-heading text-lg md:text-xl text-ink mb-2">
                      {f.q}
                    </dt>
                    <dd className="font-body text-base text-ink/70 leading-relaxed">
                      {f.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="mt-12 flex flex-wrap gap-3">
              <a
                href={site.whatsappLink}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-3 bg-ink text-cream px-6 py-3.5 rounded-full font-body text-sm hover:bg-gold hover:text-ink transition-colors cursor-pointer"
              >
                <span>Get a quote on WhatsApp</span>
                <span aria-hidden>→</span>
              </a>
              {related && (
                <Link
                  href={`/industries/${related.slug}`}
                  className="inline-flex items-center gap-2 border border-ink/20 text-ink px-6 py-3.5 rounded-full font-body text-sm hover:bg-ink hover:text-cream transition-colors cursor-pointer"
                >
                  How we shoot {related.label.toLowerCase()} →
                </Link>
              )}
              {post.relatedIndustry === "real-estate" && (
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 border border-ink/20 text-ink px-6 py-3.5 rounded-full font-body text-sm hover:bg-ink hover:text-cream transition-colors cursor-pointer"
                >
                  {post.lang === "hi"
                    ? "मुफ़्त प्रॉपर्टी कैलकुलेटर"
                    : "Free property calculators"}{" "}
                  →
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 pb-24">
          <div className="mx-auto max-w-[1100px]">
            <p className="eyebrow text-gold mb-6">Keep reading</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-2xl overflow-hidden bg-sand cursor-pointer"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={p.cover}
                      alt={p.coverAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6">
                    <p className="eyebrow text-ink/45 mb-2">
                      {fmt(p.date)} · {p.readMinutes} min read
                    </p>
                    <h3 className="font-heading text-xl md:text-2xl leading-snug text-ink">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>

      <CTA />
    </>
  );
}
