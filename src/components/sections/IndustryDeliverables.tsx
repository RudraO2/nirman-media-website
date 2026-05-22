"use client";
import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { Industry } from "@/lib/industries";

export function IndustryDeliverables({ industry }: { industry: Industry }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const rows = el.querySelectorAll<HTMLElement>("[data-deliv-row]");
      rows.forEach((row, i) => {
        const dir = i % 2 === 0 ? -80 : 80;
        gsap.fromTo(
          row,
          { xPercent: dir, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            ease: "expo.out",
            duration: 1,
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              end: "top 55%",
              scrub: 0.6,
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="bg-navy text-cream py-20 md:py-28 px-6 md:px-10 overflow-hidden"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12 md:mb-16">
          <div className="md:col-span-5">
            <p className="eyebrow text-gold mb-5">What you get</p>
            <h2
              className="font-heading leading-[0.98]"
              style={{ fontSize: "clamp(32px, 5vw, 72px)" }}
            >
              Built for{" "}
              <em className="font-heading-italic text-gold">
                {industry.label.toLowerCase()}.
              </em>
            </h2>
          </div>
          <p className="md:col-span-7 font-body text-base md:text-lg text-cream/75 md:pl-8">
            One studio, every format. Films, stills, reels, and sites — all
            shot, graded, and delivered to a single premium standard.
          </p>
        </div>

        <div className="border-t border-cream/15">
          {industry.deliverables.map((d, i) => (
            <div
              key={d.title}
              data-deliv-row
              className="grid grid-cols-12 gap-4 md:gap-10 py-8 md:py-12 border-b border-cream/15 items-baseline"
            >
              <span className="col-span-2 md:col-span-1 eyebrow text-gold">
                0{i + 1}
              </span>
              <h3 className="col-span-10 md:col-span-5 font-heading text-2xl md:text-4xl leading-[1.02]">
                {d.title}
              </h3>
              <p className="col-span-12 md:col-span-6 font-body text-base md:text-lg text-cream/75 leading-relaxed">
                {d.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <p className="eyebrow text-cream/55 mb-3">Result</p>
            <p
              className="font-heading-italic text-gold leading-tight"
              style={{ fontSize: "clamp(32px, 5vw, 76px)" }}
            >
              {industry.stat.value}
            </p>
            <p className="font-body text-cream/65 mt-2">
              {industry.stat.label}
            </p>
          </div>
          <div className="md:col-span-5 flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2 border border-cream/25 px-5 py-3 rounded-full font-body text-sm hover:border-gold hover:text-gold transition-colors cursor-pointer"
            >
              <span>See pricing</span>
              <span
                aria-hidden
                className="inline-block opacity-0 -translate-x-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-x-0"
              >
                →
              </span>
            </Link>
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 bg-gold text-ink px-5 py-3 rounded-full font-body text-sm hover:bg-cream transition-colors cursor-pointer"
            >
              <span>Request a quote</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
