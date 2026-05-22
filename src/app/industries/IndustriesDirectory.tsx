"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { industries } from "@/lib/industries";
import { PageMeta } from "@/components/layout/PageMeta";
import { Reveal } from "@/components/animation/Reveal";

export function IndustriesDirectory() {
  const [active, setActive] = useState(0);
  const current = industries[active];

  return (
    <>
      <section className="relative bg-cream pt-28 md:pt-32 pb-12 md:pb-16 px-6 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <PageMeta
            index="02 / 05"
            label="Industries"
            caption="5 spaces · 50+ projects · 4 cities"
          />
          <div className="mt-10 md:mt-14 grid grid-cols-12 gap-6 items-end">
            <Reveal
              as="div"
              className="col-span-12 md:col-span-8 flex items-baseline gap-4 md:gap-7"
            >
              <span className="font-heading-italic text-gold text-xl md:text-3xl whitespace-nowrap">
                An index of
              </span>
              <span
                className="font-heading text-ink leading-[0.88]"
                style={{ fontSize: "clamp(44px, 8.5vw, 124px)" }}
              >
                the rooms
              </span>
            </Reveal>
            <Reveal
              as="p"
              delay={140}
              className="col-span-12 md:col-span-4 font-body text-sm md:text-base text-ink/65 md:text-right md:pb-3 max-w-sm md:ml-auto"
            >
              Same lens. Same team. Different floor every shoot. Hover the index
              for a preview.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="hidden md:block bg-cream pb-20 md:pb-28 px-10">
        <div className="mx-auto max-w-[1280px] grid grid-cols-12 gap-8 border-t border-line pt-6">
          <ol className="col-span-5 flex flex-col">
            {industries.map((ind, i) => (
              <li key={ind.slug}>
                <Link
                  href={`/industries/${ind.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`group flex items-baseline gap-6 py-5 md:py-7 border-b border-line transition-colors cursor-pointer ${
                    active === i ? "text-ink" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  <span
                    className={`font-body text-sm tabular-nums transition-colors ${
                      active === i ? "text-gold" : "text-ink/35"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-heading leading-none flex-1"
                    style={{ fontSize: "clamp(36px, 4.5vw, 72px)" }}
                  >
                    {ind.label}
                  </span>
                  <span
                    aria-hidden
                    className={`font-heading text-3xl transition-all duration-300 ${
                      active === i
                        ? "text-gold translate-x-0 opacity-100"
                        : "text-ink/30 -translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="col-span-7 sticky top-28 self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-navy">
              {industries.map((ind, i) => (
                <div
                  key={ind.slug}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    active === i ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden={active !== i}
                >
                  <Image
                    src={ind.cover}
                    alt=""
                    fill
                    sizes="60vw"
                    priority={i === 0}
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-8 text-cream">
                <p className="eyebrow text-gold mb-3">
                  {String(active + 1).padStart(2, "0")} / Industry
                </p>
                <p className="font-heading-italic text-2xl md:text-3xl text-gold leading-tight max-w-md">
                  {current.tagline}
                </p>
                <p className="font-body text-cream/80 text-sm md:text-base mt-3 max-w-md">
                  {current.blurb}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {current.shoots.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="font-body text-xs bg-cream/12 backdrop-blur-md px-3 py-1.5 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <Stat
                eyebrow="Sample stat"
                value={current.stat.value}
                label={current.stat.label}
              />
              <Stat
                eyebrow="Deliverables"
                value={String(current.deliverables.length)}
                label="formats included"
              />
              <Stat
                eyebrow="Hook"
                value="—"
                label={current.hook}
                small
              />
            </div>
          </div>
        </div>
      </section>

      <section className="md:hidden bg-cream pb-16 px-0">
        <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory flex gap-4 px-6 pb-2">
          {industries.map((ind, i) => (
            <Link
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              className="group snap-center shrink-0 w-[78vw] max-w-[340px] relative aspect-[3/4] overflow-hidden rounded-2xl bg-navy cursor-pointer"
            >
              <Image
                src={ind.cover}
                alt={ind.label}
                fill
                sizes="80vw"
                priority={i === 0}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
                <p className="eyebrow text-gold mb-2">
                  {String(i + 1).padStart(2, "0")} / Industry
                </p>
                <h3 className="font-heading text-3xl leading-[0.95] mb-2">
                  {ind.label}
                </h3>
                <p className="font-heading-italic text-gold/95 text-base">
                  {ind.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <p className="px-6 mt-3 font-body text-xs text-ink/45">
          Swipe →
        </p>
      </section>

      <section className="px-6 md:px-10 py-20 md:py-28 bg-sand">
        <div className="mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <p className="eyebrow text-gold mb-5">How we work across rooms</p>
            <h2
              className="font-heading leading-[0.98] text-ink"
              style={{ fontSize: "clamp(32px, 5vw, 60px)" }}
            >
              Same studio.{" "}
              <em className="font-heading-italic text-gold">
                Different room.
              </em>
            </h2>
            <p className="font-body text-ink/65 mt-6 max-w-sm">
              The lens, the team, the standard — identical for a flat in
              Mansarovar and a suite in Udaipur. Only the floor changes.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 gap-3 md:gap-5">
            {industries.map((ind, i) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group relative flex items-center justify-between gap-4 bg-cream border border-line rounded-xl px-5 py-5 md:py-7 transition-[border-color,background-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-ink/55 hover:bg-cream-warm hover:shadow-[0_18px_36px_-22px_color-mix(in_oklch,var(--color-ink)_40%,transparent)] cursor-pointer"
              >
                <div className="flex items-baseline gap-3">
                  <span className="eyebrow tab-num text-[10px] text-ink/35 mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="eyebrow text-ink/45 mb-1">
                      {ind.deliverables.length} formats
                    </p>
                    <p className="font-heading text-2xl md:text-3xl text-ink">
                      {ind.label}
                    </p>
                  </div>
                </div>
                <span
                  aria-hidden
                  className="font-heading text-2xl text-ink/30 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-gold group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({
  eyebrow,
  value,
  label,
  small = false,
}: {
  eyebrow: string;
  value: string;
  label: string;
  small?: boolean;
}) {
  return (
    <div className="border-t border-line pt-4">
      <p className="eyebrow text-ink/45 mb-2">{eyebrow}</p>
      <p
        className={`font-heading text-ink ${
          small ? "text-base leading-tight" : "text-2xl md:text-3xl"
        }`}
      >
        {value}
      </p>
      <p className="font-body text-xs text-ink/55 mt-1">{label}</p>
    </div>
  );
}
