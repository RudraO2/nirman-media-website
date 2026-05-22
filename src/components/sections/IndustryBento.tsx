"use client";
import { BentoCard } from "@/components/animation/BentoReveal";
import type { Industry } from "@/lib/industries";

export function IndustryBento({ industry }: { industry: Industry }) {
  return (
    <section className="bg-cream py-20 md:py-28 px-6 md:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16 items-end">
          <div className="md:col-span-7">
            <p className="eyebrow text-gold mb-4">The look</p>
            <h2
              className="font-heading leading-[0.98] text-ink"
              style={{ fontSize: "clamp(32px, 5vw, 72px)" }}
            >
              Every frame{" "}
              <em className="font-heading-italic text-gold">
                earns its place.
              </em>
            </h2>
          </div>
          <p className="md:col-span-5 font-body text-base md:text-lg text-ink/70">
            Scroll. Each tile slides in from a different angle — same way our
            shoots assemble. Planned, paced, intentional.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 md:auto-rows-[minmax(140px,auto)] gap-3 md:gap-5">
          {industry.bento.map((tile, i) => (
            <BentoCard
              key={`${industry.slug}-${i}`}
              tile={tile}
              index={i}
              imgPriority={i < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
