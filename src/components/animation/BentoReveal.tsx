"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { BentoDir, BentoTile } from "@/lib/industries";

const FROM_MAP: Record<BentoDir, { xPercent: number; yPercent: number; rotate?: number }> = {
  right: { xPercent: 60, yPercent: 0, rotate: 0.8 },
  left: { xPercent: -60, yPercent: 0, rotate: -0.8 },
  top: { xPercent: 0, yPercent: -55, rotate: 0 },
  bottom: { xPercent: 0, yPercent: 55, rotate: 0 },
};

const RATIO_CLASS: Record<string, string> = {
  "16x9": "aspect-[16/9]",
  "4x5": "aspect-[4/5]",
  "3x2": "aspect-[3/2]",
  "1x1": "aspect-square",
  "9x16": "aspect-[9/16]",
  "5x1": "aspect-[5/1]",
};

export function BentoCard({
  tile,
  href,
  index = 0,
  showCaption = true,
  imgPriority = false,
}: {
  tile: BentoTile;
  href?: string;
  index?: number;
  showCaption?: boolean;
  imgPriority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = ref.current;
      const inner = innerRef.current;
      if (!wrap || !inner) return;

      const f = FROM_MAP[tile.from];

      gsap.set(wrap, { opacity: 0 });
      gsap.set(inner, {
        xPercent: f.xPercent,
        yPercent: f.yPercent,
        rotate: f.rotate ?? 0,
        scale: 1.06,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top 88%",
          end: "top 45%",
          scrub: 0.55,
        },
      });
      tl.to(wrap, { opacity: 1, duration: 0.3, ease: "none" }, 0);
      tl.to(
        inner,
        {
          xPercent: 0,
          yPercent: 0,
          rotate: 0,
          scale: 1,
          ease: "power3.out",
          duration: 1,
        },
        0
      );
    },
    { scope: ref, dependencies: [tile.from] }
  );

  const ratio = RATIO_CLASS[tile.ratio] ?? "aspect-[3/2]";
  const Wrapper: React.ElementType = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group relative block ${tile.span} overflow-hidden rounded-xl md:rounded-2xl bg-navy-deep`}
    >
      <div ref={ref} className={`relative w-full ${ratio} overflow-hidden`}>
        <div
          ref={innerRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: "center center" }}
        >
          <Image
            src={tile.src}
            alt={tile.tag}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={imgPriority && index < 2}
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
          />
        </div>

        {showCaption && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/65 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 text-cream">
              <p className="font-display text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gold mb-1">
                {tile.tag}
              </p>
              {tile.caption && (
                <p className="font-body text-xs md:text-sm text-cream/80">
                  {tile.caption}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
}
