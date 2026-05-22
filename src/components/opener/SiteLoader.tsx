"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";

const FIRST = "Nirman";
const SECOND = "Media";

// Small image sized to roughly match wordmark cap-height. Same 16:9 aspect as final hero.
const BASE_H = 140;
const BASE_W = (BASE_H * 16) / 9; // 248.9 → 249

export function SiteLoader() {
  const root = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          document.documentElement.style.overflow = prevHtmlOverflow;
          document.body.style.overflow = prevBodyOverflow;
          requestAnimationFrame(() => setHidden(true));
        },
      });

      tl
        .set("[data-loader]", { autoAlpha: 1 })
        .set("[data-loader-char]", {
          yPercent: 80,
          opacity: 0,
          filter: "blur(10px)",
          rotate: () => gsap.utils.random(-4, 4),
          scale: 0.92,
        })
        // Image element starts as a thin vertical line — scaleX tiny, scaleY moderate.
        // transform-origin: center → grows from centre.
        .set("[data-loader-image]", {
          scaleX: 0.004,
          scaleY: 0.55,
          opacity: 1,
        })
        .set("[data-loader-word-1]", { xPercent: 0, opacity: 1 })
        .set("[data-loader-word-2]", { xPercent: 0, opacity: 1 })

        // 0.0–0.15s: cream hold
        .to({}, { duration: 0.15 })

        // 0.35–1.35s: letters fragment-assemble in Instrument Serif italic
        .to("[data-loader-char]", {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          rotate: 0,
          scale: 1,
          duration: 1.0,
          stagger: { each: 0.04, from: "random" },
          ease: "expo.out",
        })

        // 1.35–1.85s: hold wordmark
        .to({}, { duration: 0.5 })

        // PHASE 2 — 1.85–2.55s: line → small 16:9 image (cap-height sized).
        // Words slide apart slightly to make room. Opacity stays at 1.
        .to("[data-loader-image]", {
          scaleX: 1,
          scaleY: 1,
          duration: 0.7,
          ease: "power3.inOut",
        })
        .to(
          "[data-loader-word-1]",
          { xPercent: -14, duration: 0.7, ease: "power3.inOut" },
          "<"
        )
        .to(
          "[data-loader-word-2]",
          { xPercent: 14, duration: 0.7, ease: "power3.inOut" },
          "<"
        )

        // brief beat so the small image registers
        .to({}, { duration: 0.18 })

        // PHASE 3 — small image scales to fullscreen.
        // Image is stacked ABOVE the words, so they're occluded naturally as it grows over them.
        .to("[data-loader-image]", {
          scaleX: () =>
            Math.max(window.innerWidth / BASE_W, window.innerHeight / BASE_H) * 1.05,
          scaleY: () =>
            Math.max(window.innerWidth / BASE_W, window.innerHeight / BASE_H) * 1.05,
          duration: 1.3,
          ease: "power3.inOut",
        })

        // brief fullscreen hold
        .to({}, { duration: 0.1 })

        // fade loader away, hero revealed beneath
        .to(el, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" });

      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
      };
    },
    { scope: root }
  );

  if (hidden) return null;

  return (
    <div
      ref={root}
      data-loader
      className="fixed inset-0 z-[100] bg-cream overflow-hidden"
      aria-hidden
    >
      {/* Wordmark — renders FIRST so image stacks above it. As image scales up, words get
          occluded naturally. */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center px-6">
        <div
          data-loader-word-1
          className="font-heading text-navy-deep leading-none will-change-transform"
          style={{
            fontSize: "clamp(48px, 9vw, 144px)",
            marginRight: "clamp(48px, 7vw, 96px)",
          }}
        >
          <Chars text={FIRST} />
        </div>
        <div
          data-loader-word-2
          className="font-heading text-gold leading-none will-change-transform"
          style={{
            fontSize: "clamp(48px, 9vw, 144px)",
            marginLeft: "clamp(48px, 7vw, 96px)",
          }}
        >
          <Chars text={SECOND} />
        </div>
      </div>

      {/* Hero image — sits ABOVE the wordmark. Grows from a hairline into a small 16:9 image,
          then scales up to fullscreen, covering the words as it expands. */}
      <div
        data-loader-image
        className="absolute top-1/2 z-[2] will-change-transform"
        style={{
          width: BASE_W,
          height: BASE_H,
          left: "calc(50% + 32px)",
          marginLeft: -BASE_W / 2,
          marginTop: -BASE_H / 2,
          transformOrigin: "center center",
          transform: "scaleX(0.004) scaleY(0.55)",
        }}
      >
        <Image
          src="/hero/hero-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

function Chars({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {text.split("").map((c, i) => (
        <span key={i} className="inline-block overflow-visible">
          <span data-loader-char className="inline-block">
            {c === " " ? " " : c}
          </span>
        </span>
      ))}
    </span>
  );
}
