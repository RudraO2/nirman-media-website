"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  projects,
  categoryFilters,
  industryFilters,
  type ProjectCategory,
  type ProjectIndustry,
} from "@/lib/projects";
import { Reveal } from "@/components/animation/Reveal";

export function WorkGrid() {
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const [industry, setIndustry] = useState<ProjectIndustry | "all">("all");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (industry === "all" || p.industry === industry)
      ),
    [category, industry]
  );

  return (
    <>
      <section className="pt-36 pb-14 md:pt-44 md:pb-20 px-6 md:px-10 bg-cream">
        <div className="mx-auto max-w-[1500px]">
          <Reveal as="p" className="font-display text-xs tracking-[0.3em] uppercase text-gold mb-6">
            Selected Work
          </Reveal>
          <Reveal
            as="h1"
            delay={80}
            className="font-display font-medium tracking-[-0.02em] leading-[0.92] text-navy-deep max-w-5xl"
          >
            <span style={{ fontSize: "clamp(48px, 9vw, 160px)" }} className="block">
              The rooms <em className="font-serif italic font-light">we made</em> move.
            </span>
          </Reveal>

          <Reveal delay={180} className="mt-12 md:mt-16 space-y-4">
            <div className="flex flex-wrap gap-2">
              {industryFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setIndustry(f.value)}
                  className={`font-display text-xs md:text-sm tracking-[0.16em] uppercase px-5 py-2.5 rounded-full border transition-colors ${
                    industry === f.value
                      ? "bg-navy-deep text-cream border-navy-deep"
                      : "border-navy-deep/25 text-navy-deep hover:border-navy-deep"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setCategory(f.value)}
                  className={`font-display text-[10px] md:text-xs tracking-[0.18em] uppercase px-4 py-2 rounded-full border transition-colors ${
                    category === f.value
                      ? "bg-gold text-navy-deep border-gold"
                      : "border-navy-deep/15 text-navy-deep/75 hover:border-navy-deep/50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-32 px-6 md:px-10 bg-cream">
        <div className="mx-auto max-w-[1500px] grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
          {filtered.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className="group block reveal-up is-in transition-[transform,opacity]"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div
                className={`relative overflow-hidden rounded-2xl bg-navy-deep ${
                  i % 2 === 0 ? "aspect-[4/5]" : "aspect-[5/6]"
                }`}
              >
                <Image
                  src={p.cover}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/15 to-transparent" />

                <div className="absolute inset-x-0 top-0 p-5 md:p-6 flex items-start justify-between gap-3">
                  <span className="font-display text-[10px] tracking-[0.28em] uppercase bg-cream/15 backdrop-blur-md text-cream px-3 py-1.5 rounded-full">
                    {p.industryLabel}
                  </span>
                  <span className="font-display text-[10px] tracking-[0.25em] uppercase bg-cream/15 backdrop-blur-md text-cream px-3 py-1.5 rounded-full">
                    View →
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-cream">
                  <p className="font-display text-[11px] tracking-[0.3em] uppercase text-gold mb-2">
                    {p.categoryLabel}
                  </p>
                  <h2 className="font-display text-2xl md:text-4xl font-medium mb-1">{p.name}</h2>
                  <p className="font-body text-cream/70 text-sm">
                    {p.builder} · {p.location}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="md:col-span-2 py-32 text-center">
              <p className="font-serif italic text-3xl text-navy-deep/60">
                No work for that combination yet. Try another filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
