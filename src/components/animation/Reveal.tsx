"use client";
import { createElement, useEffect, useRef } from "react";

type Tag = "div" | "section" | "h1" | "h2" | "h3" | "p" | "li" | "span";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: Tag;
  threshold?: number;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const t = window.setTimeout(() => el.classList.add("is-in"), delay);
            obs.disconnect();
            return () => window.clearTimeout(t);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, threshold]);

  return createElement(
    as,
    {
      ref: ref as React.Ref<HTMLElement>,
      className: `reveal-up ${className}`,
    },
    children
  );
}
