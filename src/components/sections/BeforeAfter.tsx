"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";

export function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setPct(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    };
    const onUp = () => (dragging.current = false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <section className="bg-sand py-24 md:py-32 px-6 md:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 md:mb-14 items-end">
          <Reveal as="div" className="md:col-span-7">
            <p className="eyebrow text-gold mb-4">The difference</p>
            <h2
              className="font-heading leading-[0.98] text-ink"
              style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}
            >
              Same room.{" "}
              <em className="font-heading-italic text-gold">Our eye.</em>
            </h2>
          </Reveal>
          <Reveal
            as="div"
            delay={120}
            className="md:col-span-5 text-ink/70 font-body"
          >
            <p className="text-base md:text-lg leading-relaxed">
              Light, line, mood — every frame shot and shaped so your space
              looks like a feature film. Drag the handle to compare.
            </p>
          </Reveal>
        </div>

        <div
          ref={ref}
          className="relative w-full aspect-[16/10] md:aspect-[16/8] overflow-hidden rounded-2xl select-none cursor-ew-resize bg-navy touch-none"
          style={{ touchAction: "none" }}
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            const rect = e.currentTarget.getBoundingClientRect();
            setPct(((e.clientX - rect.left) / rect.width) * 100);
          }}
        >
          <div className="absolute inset-0">
            <Image
              src="/gen/after.webp"
              alt="Finished photo by Nirman Media"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <span className="absolute top-4 right-4 md:top-5 md:right-5 bg-gold text-ink font-body text-xs font-medium px-3 py-1.5 rounded-full">
              Nirman
            </span>
          </div>
          <div
            className="absolute inset-0 grayscale-[0.45] brightness-90 contrast-90"
            style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
          >
            <Image
              src="/gen/before.webp"
              alt="Original phone photo"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <span className="absolute top-4 left-4 md:top-5 md:left-5 bg-cream/90 text-ink font-body text-xs font-medium px-3 py-1.5 rounded-full">
              Phone shot
            </span>
          </div>
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-gold pointer-events-none"
            style={{ left: `${pct}%`, transform: "translateX(-1px)" }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gold flex items-center justify-center text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polyline points="15 18 9 12 15 6" />
                <polyline points="9 6 15 12 9 18" transform="translate(6 0)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
