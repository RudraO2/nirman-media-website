"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/animation/Reveal";
import { industries } from "@/lib/industries";

type Card = {
  slug: string;
  label: string;
  tagline: string;
  cover: string;
  span: string;
  ratio: string;
  from: "left" | "right" | "top" | "bottom";
  no: string;
};

const RATIO_CLASS: Record<string, string> = {
  "16x9": "aspect-[16/9]",
  "4x5": "aspect-[4/5]",
  "3x2": "aspect-[3/2]",
  "1x1": "aspect-square",
  "9x16": "aspect-[9/16]",
  "5x1": "aspect-[5/1]",
};

const FROM_MAP = {
  right: { xPercent: 40, yPercent: 0 },
  left: { xPercent: -40, yPercent: 0 },
  top: { xPercent: 0, yPercent: -40 },
  bottom: { xPercent: 0, yPercent: 40 },
};

const cards: Card[] = [
  {
    slug: "real-estate",
    label: industries[0].label,
    tagline: industries[0].tagline,
    cover: industries[0].cover,
    span: "md:col-span-8 md:row-span-2",
    ratio: "16x9",
    from: "right",
    no: "01",
  },
  {
    slug: "hotels",
    label: industries[1].label,
    tagline: industries[1].tagline,
    cover: industries[1].cover,
    span: "md:col-span-4",
    ratio: "4x5",
    from: "top",
    no: "02",
  },
  {
    slug: "resorts",
    label: industries[2].label,
    tagline: industries[2].tagline,
    cover: industries[2].cover,
    span: "md:col-span-4",
    ratio: "4x5",
    from: "bottom",
    no: "03",
  },
  {
    slug: "restaurants",
    label: industries[3].label,
    tagline: industries[3].tagline,
    cover: industries[3].cover,
    span: "md:col-span-6",
    ratio: "3x2",
    from: "left",
    no: "04",
  },
  {
    slug: "gyms",
    label: industries[4].label,
    tagline: industries[4].tagline,
    cover: industries[4].cover,
    span: "md:col-span-6",
    ratio: "3x2",
    from: "right",
    no: "05",
  },
];

export function Industries() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      el.querySelectorAll<HTMLElement>("[data-bento]").forEach((card) => {
        const dir = (card.dataset.bento as keyof typeof FROM_MAP) || "right";
        const img = card.querySelector<HTMLElement>("[data-bento-img]");
        const overlay = card.querySelectorAll<HTMLElement>("[data-bento-rise]");
        const f = FROM_MAP[dir];

        if (img) {
          gsap.set(card, { opacity: 0 });
          gsap.set(img, {
            xPercent: f.xPercent,
            yPercent: f.yPercent,
            scale: 1.06,
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "top 45%",
              scrub: 0.5,
            },
          });
          tl.to(card, { opacity: 1, duration: 0.25, ease: "none" }, 0);
          tl.to(
            img,
            {
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              ease: "power3.out",
              duration: 1,
            },
            0
          );
        }

        if (overlay.length) {
          gsap.fromTo(
            overlay,
            { yPercent: 30, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.06,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 70%" },
            }
          );
        }
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="industries"
      className="relative bg-cream py-24 md:py-32 px-6 md:px-10"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 mb-14 md:mb-20 items-end">
          <Reveal as="div" className="md:col-span-7">
            <p className="eyebrow text-gold mb-5">We shoot for</p>
            <h2
              className="font-heading leading-[0.98] text-ink"
              style={{ fontSize: "clamp(36px, 6vw, 84px)" }}
            >
              Brands that live by{" "}
              <em className="font-heading-italic text-gold">
                first impressions.
              </em>
            </h2>
          </Reveal>
          <Reveal
            as="div"
            delay={120}
            className="md:col-span-5 font-body text-base md:text-lg text-ink/70"
          >
            <p>
              Real estate is where we began. Today we make films, photos, 3D
              tours and websites for any space that has to look as good on a
              phone as it does in person.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 md:auto-rows-[minmax(180px,auto)] gap-3 md:gap-5">
          {cards.map((c) => {
            const ratio = RATIO_CLASS[c.ratio] ?? "aspect-[3/2]";
            return (
              <Link
                key={c.slug}
                href={`/industries/${c.slug}`}
                data-bento={c.from}
                className={`group relative block overflow-hidden rounded-2xl bg-navy cursor-pointer ${c.span}`}
              >
                <div
                  className={`relative w-full aspect-[4/5] sm:aspect-square md:${ratio}`}
                >
                  <div
                    data-bento-img
                    className="absolute inset-0 will-change-transform"
                  >
                    <Image
                      src={c.cover}
                      alt={c.label}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent" />

                  <div className="absolute inset-x-0 top-0 p-5 md:p-6 flex items-start justify-between text-cream">
                    <p
                      data-bento-rise
                      className="eyebrow text-gold"
                    >
                      {c.no} · Industry
                    </p>
                    <span
                      data-bento-rise
                      className="font-body text-[11px] tracking-[0.04em] bg-cream/15 backdrop-blur-md px-3 py-1 rounded-full"
                    >
                      View →
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-cream">
                    <h3
                      data-bento-rise
                      className="font-heading leading-[0.98] mb-2"
                      style={{ fontSize: "clamp(26px, 3.4vw, 52px)" }}
                    >
                      {c.label}
                    </h3>
                    <p
                      data-bento-rise
                      className="font-heading-italic text-gold/95 text-base md:text-lg"
                    >
                      {c.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
