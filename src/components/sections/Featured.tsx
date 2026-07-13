"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/animation/Reveal";

const projects = [
  {
    no: "01",
    slug: "the-aurum-hotel",
    name: "The Aurum Hotel",
    place: "Jaipur",
    industry: "Hotels",
    stat: "+120%",
    statLabel: "direct bookings",
    type: "Brand Film + Website",
    img: "/gen/ind-hotels-cover.webp",
  },
  {
    no: "02",
    slug: "skyline-residences",
    name: "Skyline Residences",
    place: "Mansarovar",
    industry: "Real Estate",
    stat: "32 flats",
    statLabel: "sold in 18 days",
    type: "Property Film + 3D Tour",
    img: "/gen/ind-real-estate-cover.webp",
  },
  {
    no: "03",
    slug: "bistro-maharaj",
    name: "Bistro Maharaj",
    place: "Jaipur",
    industry: "Restaurants",
    stat: "3×",
    statLabel: "reservations post-launch",
    type: "Menu Photography + Reels",
    img: "/gen/ind-restaurants-cover.webp",
  },
];

export function Featured() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.utils.toArray<HTMLElement>("[data-feat-card]").forEach((card) => {
        const img = card.querySelector("[data-feat-img]");
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.1, yPercent: -6 },
            {
              scale: 1,
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );
        }
        gsap.fromTo(
          card.querySelectorAll("[data-feat-rise]"),
          { yPercent: 24, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 75%" },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bg-cream py-20 md:py-28">
      <div className="px-6 md:px-10 mx-auto max-w-[1280px] mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <Reveal as="p" className="eyebrow text-gold mb-4">
            Featured work
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="font-heading leading-[0.98] text-ink max-w-3xl"
          >
            <span
              style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}
              className="block"
            >
              Rooms we made{" "}
              <em className="font-heading-italic text-gold">unforgettable.</em>
            </span>
          </Reveal>
        </div>
        <Reveal as="div" delay={140}>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-body text-sm border border-ink/20 text-ink px-5 py-3 rounded-full hover:bg-ink hover:text-cream transition-colors"
          >
            See all work <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>

      <div className="px-6 md:px-10 mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {projects.map((p, i) => (
          <Link
            key={p.no}
            href={`/work/${p.slug}`}
            data-feat-card
            className={`group relative overflow-hidden rounded-2xl bg-navy text-cream cursor-pointer ${
              i === 0 ? "md:col-span-8 md:row-span-2 md:h-full" : "md:col-span-4"
            }`}
          >
            {/* The side cards' 4/5 ratio sets the row heights; the big card
                fills its 2-row cell exactly so image and grid never mismatch. */}
            <div
              className={`relative w-full ${
                i === 0
                  ? "aspect-[16/11] md:aspect-auto md:h-full"
                  : "aspect-[4/5]"
              }`}
            >
              <div
                data-feat-img
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent" />

              <div className="absolute inset-x-0 top-0 p-5 md:p-7 flex items-start justify-between">
                <p data-feat-rise className="eyebrow text-gold">
                  {p.no} · {p.industry}
                </p>
                <span
                  data-feat-rise
                  className="font-body text-[11px] tracking-[0.04em] bg-cream/15 backdrop-blur-md px-3 py-1 rounded-full"
                >
                  View →
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                <h3
                  data-feat-rise
                  className="font-heading leading-[0.98] mb-1.5"
                  style={{ fontSize: "clamp(28px, 3.4vw, 52px)" }}
                >
                  {p.name}
                </h3>
                <p
                  data-feat-rise
                  className="font-body text-cream/70 text-sm mb-4"
                >
                  {p.type} · {p.place}
                </p>
                <div
                  data-feat-rise
                  className="flex items-baseline gap-2 border-t border-cream/15 pt-4"
                >
                  <p className="font-heading-italic text-gold text-2xl md:text-3xl">
                    {p.stat}
                  </p>
                  <p className="font-body text-cream/70 text-sm">
                    {p.statLabel}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
