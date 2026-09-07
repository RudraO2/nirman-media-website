import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { industries } from "@/lib/industries";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Not found" };
  return {
    title: `${project.name} — Nirman Media`,
    description: `${project.categoryLabel} for ${project.builder} at ${project.location}. ${project.summary}`,
    alternates: { canonical: `/work/${project.slug}/` },
  };
}

const BASE = SITE_URL;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const industry = industries.find((i) => i.slug === project.industry);
  const galleryThumbs = (industry?.bento.slice(0, 4) ?? []).map((t) => t.src);
  const nextIdx =
    (projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length;
  const next = projects[nextIdx];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Work", item: `${BASE}/work/` },
      {
        "@type": "ListItem",
        position: 3,
        name: project.name,
        item: `${BASE}/work/${project.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="pt-28 md:pt-36 pb-12 px-6 md:px-10 bg-cream">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href="/work"
            className="font-body text-xs text-ink/60 hover:text-gold transition-colors inline-flex items-center gap-2 mb-10 cursor-pointer"
          >
            <span aria-hidden>←</span> All work
          </Link>

          <p className="eyebrow text-gold mb-4">{project.categoryLabel}</p>
          <h1
            className="font-heading leading-[0.95] text-ink"
            style={{ fontSize: "clamp(40px, 7vw, 120px)" }}
          >
            {project.name}
          </h1>
          <p className="font-body text-base md:text-lg text-ink/70 mt-5">
            {project.builder} · {project.location} · {project.year}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="mx-auto max-w-[1280px] relative overflow-hidden rounded-2xl aspect-[16/9]">
          <Image
            src={project.cover}
            alt={project.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20 md:pb-28 bg-cream">
        <div className="mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
            <p className="eyebrow text-gold mb-3">The brief</p>
            <h2 className="font-heading-italic text-2xl md:text-4xl leading-tight text-ink">
              {project.summary}
            </h2>
          </div>

          <div className="md:col-span-6 md:col-start-7 space-y-10">
            <div className="border-t border-ink/20 pt-6">
              <p className="eyebrow text-ink/55 mb-2">Result</p>
              <p className="font-heading text-3xl md:text-5xl text-gold">
                {project.stat}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {galleryThumbs.map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl aspect-[4/5] bg-navy"
                >
                  <Image
                    src={src}
                    alt={`${project.name} — ${project.categoryLabel} gallery still`}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 bg-cream">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow text-gold mb-5">Next project</p>
          <Link
            href={`/work/${next.slug}`}
            className="group relative block overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[16/7] bg-navy cursor-pointer"
          >
            <Image
              src={next.cover}
              alt={next.name}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-cream">
              <p className="eyebrow text-gold mb-2">{next.industryLabel}</p>
              <h3
                className="font-heading leading-[0.98]"
                style={{ fontSize: "clamp(32px, 5vw, 72px)" }}
              >
                {next.name}
                <span className="text-gold ml-3" aria-hidden>
                  →
                </span>
              </h3>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
