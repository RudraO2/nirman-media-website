"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { Industry } from "@/lib/industries";

export function IndustryHero({ industry }: { industry: Industry }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const img = el.querySelector<HTMLElement>("[data-hero-img]");
      const wrap = el.querySelector<HTMLElement>("[data-hero-wrap]");
      const stripes = el.querySelectorAll<HTMLElement>("[data-hero-stripe]");
      const rises = el.querySelectorAll<HTMLElement>("[data-hero-rise]");

      if (img && wrap) {
        gsap.set(wrap, { xPercent: 60, opacity: 0 });
        gsap.set(img, { scale: 1.2 });
        gsap.to(wrap, {
          xPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          delay: 0.3,
        });
        gsap.to(img, {
          scale: 1,
          duration: 2.2,
          ease: "expo.out",
          delay: 0.3,
        });
      }

      gsap.fromTo(
        stripes,
        { xPercent: 100, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.07,
          ease: "expo.out",
          delay: 0.5,
        }
      );

      gsap.fromTo(
        rises,
        { yPercent: 50, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.15,
        }
      );

      if (img) {
        gsap.to(img, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative bg-navy text-cream pt-28 md:pt-36 pb-16 md:pb-24 px-6 md:px-10 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 30%, rgba(200,161,75,0.35), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-end">
        <div className="md:col-span-7">
          <p data-hero-rise className="eyebrow text-gold mb-5">
            Industry · {industry.label}
          </p>
          <h1
            data-hero-rise
            className="font-heading leading-[0.95]"
            style={{ fontSize: "clamp(48px, 9vw, 152px)" }}
          >
            {industry.name}
          </h1>
          <p
            data-hero-rise
            className="font-heading-italic text-xl md:text-3xl text-gold mt-5 leading-tight max-w-2xl"
          >
            {industry.tagline}
          </p>
          <p
            data-hero-rise
            className="font-body text-base md:text-lg text-cream/75 mt-5 max-w-xl"
          >
            {industry.blurb}
          </p>

          <div data-hero-rise className="mt-8 flex flex-wrap gap-2">
            {industry.shoots.map((s) => (
              <span
                key={s}
                className="font-body text-xs border border-cream/25 px-3.5 py-1.5 rounded-full text-cream/85"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-5">
          <div
            data-hero-wrap
            className="relative aspect-[4/5] overflow-hidden rounded-2xl will-change-transform"
          >
            <div data-hero-img className="absolute inset-0 will-change-transform">
              <Image
                src={industry.cover}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
            </div>

            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: 5 }).map((_, k) => (
                <div
                  key={k}
                  data-hero-stripe
                  className="absolute right-0 bg-gold/35"
                  style={{
                    top: `${k * 20}%`,
                    height: "2px",
                    width: `${50 - k * 6}%`,
                  }}
                />
              ))}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-cream gap-3">
              <span className="font-body text-xs bg-navy/55 backdrop-blur-md px-3 py-1.5 rounded-full">
                {industry.label}
              </span>
              <span className="font-heading-italic text-sm md:text-base text-gold text-right">
                {industry.hook}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
