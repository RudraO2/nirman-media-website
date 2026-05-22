"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function ScrollFillText({
  children,
  className = "",
  baseAlpha = 0.22,
  start = "top 75%",
  end = "top 25%",
}: {
  children: string;
  className?: string;
  baseAlpha?: number;
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const words = el.querySelectorAll<HTMLSpanElement>("[data-fw]");
      gsap.fromTo(
        words,
        { opacity: baseAlpha },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: 0.8,
          },
        }
      );
    },
    { scope: ref, dependencies: [baseAlpha, start, end] }
  );

  const tokens = children.split(/(\s+)/);

  return (
    <p ref={ref} className={className}>
      {tokens.map((t, i) =>
        /^\s+$/.test(t) ? (
          <span key={i}>{t}</span>
        ) : (
          <span key={i} data-fw className="inline-block" style={{ opacity: baseAlpha }}>
            {t}
          </span>
        )
      )}
    </p>
  );
}
