"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    window.__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    // Lazy media loading above pinned sections shifts layout after
    // ScrollTrigger measures — refresh (debounced) when body height changes,
    // otherwise pins snap instead of locking. Body height never changes
    // mid-scroll, so this can't fire during a scrub.
    let refreshTimer: number | undefined;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      window.clearTimeout(refreshTimer);
      cancelAnimationFrame(id);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
