"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/lib/projects";

type Setter = (v: number) => void;

export function WorkScrolly() {
  const root = useRef<HTMLElement>(null);
  const leftLayers = useRef<(HTMLDivElement | null)[]>([]);
  const rightLayers = useRef<(HTMLDivElement | null)[]>([]);
  const barLayers = useRef<(HTMLButtonElement | null)[]>([]);
  const settersRef = useRef<{
    left: Setter[];
    right: Setter[];
    bar: Setter[];
  }>({ left: [], right: [], bar: [] });

  // Click overlay refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayLeftBgRef = useRef<HTMLDivElement>(null);
  const overlayImgRef = useRef<HTMLDivElement>(null);
  const overlayFrameRef = useRef<HTMLDivElement>(null);
  const overlayLocYearRef = useRef<HTMLDivElement>(null);
  const overlayCaptionRef = useRef<HTMLParagraphElement>(null);
  const overlayBigTitleRef = useRef<HTMLDivElement>(null);
  const overlayShutterRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const N = projects.length;
  const exitingRef = useRef(false);
  const [active, setActive] = useState(0);
  const [exit, setExit] = useState<(typeof projects)[number] | null>(null);

  useEffect(() => {
    settersRef.current.left = leftLayers.current.map((el) =>
      el ? (gsap.quickSetter(el, "y", "vh") as Setter) : (() => {})
    );
    settersRef.current.right = rightLayers.current.map((el) =>
      el ? (gsap.quickSetter(el, "y", "vh") as Setter) : (() => {})
    );
    settersRef.current.bar = barLayers.current.map((el) =>
      el ? (gsap.quickSetter(el, "y", "%") as Setter) : (() => {})
    );
    for (let i = 0; i < N; i++) {
      settersRef.current.left[i]?.(0);
      settersRef.current.right[i]?.(0);
      settersRef.current.bar[i]?.(0);
    }
  }, [N]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const state = { p: 0 };
      let lastActive = 0;

      gsap.to(state, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
        onUpdate: () => {
          if (exitingRef.current) return;
          const p = state.p;
          const cursor = p * (N - 1);

          const lSet = settersRef.current.left;
          const rSet = settersRef.current.right;
          const bSet = settersRef.current.bar;

          for (let i = 0; i < N; i++) {
            const raw = cursor - i;
            const shift = raw <= 0 ? 0 : raw >= 1 ? 1 : raw;
            lSet[i]?.(shift * 110);
            rSet[i]?.(-shift * 110);
            bSet[i]?.(-shift * 110);
          }

          const idx = Math.min(N - 1, Math.max(0, Math.round(cursor)));
          if (idx !== lastActive) {
            lastActive = idx;
            setActive(idx);
          }
        },
      });

      ScrollTrigger.refresh();
    },
    { scope: root }
  );

  useEffect(
    () => () => {
      window.__lenis?.start();
    },
    []
  );

  const open = (idx: number) => {
    if (exitingRef.current) return;
    exitingRef.current = true;

    const p = projects[idx];
    setExit(p);
    window.__lenis?.stop();

    // Wait two RAFs so overlay JSX mounts before tweening
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const overlay = overlayRef.current;
        const leftBg = overlayLeftBgRef.current;
        const img = overlayImgRef.current;
        const frame = overlayFrameRef.current;
        const lyr = overlayLocYearRef.current;
        const cap = overlayCaptionRef.current;
        const bt = overlayBigTitleRef.current;
        const shutter = overlayShutterRef.current;
        const bar = barLayers.current[idx];

        if (!overlay || !img) {
          router.push(`/work/${p.slug}`);
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => router.push(`/work/${p.slug}`),
        });

        // Reveal overlay container instantly
        tl.set(overlay, { autoAlpha: 1 });

        // Push the current bar up out of frame
        if (bar)
          tl.to(
            bar,
            { y: "-130%", duration: 0.55, ease: "expo.inOut" },
            0
          );

        // Left bg accent fades in beneath the image
        if (leftBg)
          tl.fromTo(
            leftBg,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.55, ease: "power2.inOut" },
            0
          );

        // Left image: full bleed → small framed square upper-left of left half
        tl.fromTo(
          img,
          {
            top: "0%",
            left: "0%",
            width: "100%",
            height: "100%",
          },
          {
            top: "22%",
            left: "18%",
            width: "32%",
            height: "44%",
            duration: 0.8,
            ease: "expo.inOut",
          },
          0
        );

        // Bordered frame outline pops late
        if (frame)
          tl.fromTo(
            frame,
            { opacity: 0 },
            { opacity: 1, duration: 0.35, ease: "power2.out" },
            0.5
          );

        // Right shutter: comes DOWN from top to cover right half
        if (shutter)
          tl.fromTo(
            shutter,
            { yPercent: -101 },
            { yPercent: 0, duration: 0.7, ease: "expo.inOut" },
            0
          );

        // Text reveals
        if (lyr)
          tl.fromTo(
            lyr,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
            0.45
          );
        if (cap)
          tl.fromTo(
            cap,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
            0.55
          );
        if (bt)
          tl.fromTo(
            bt,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" },
            0.6
          );

        // Hold fully-down shutter while user reads the card
        tl.to({}, { duration: 0.3 });

        // Right shutter retracts UP — back away from up
        if (shutter)
          tl.to(
            shutter,
            { yPercent: -101, duration: 0.7, ease: "expo.inOut" },
            ">"
          );

        // Tiny settle before nav
        tl.to({}, { duration: 0.15 });
      })
    );
  };

  return (
    <section
      ref={root}
      className="relative w-full bg-cream"
      style={{ height: `${(N + 0.6) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-cream">
        {/* Two columns of stacked layers; topmost slides off, layer behind reveals */}
        <div className="absolute inset-0 grid grid-cols-2">
          <div className="relative h-screen overflow-hidden">
            {projects.map((p, i) => (
              <div
                key={`L-${p.slug}`}
                ref={(el) => {
                  leftLayers.current[i] = el;
                }}
                className="absolute inset-0 overflow-hidden will-change-transform"
                style={{ zIndex: N - i }}
              >
                <Image
                  src={p.leftImg}
                  alt={p.name}
                  fill
                  sizes="50vw"
                  priority={i < 2}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-navy-deep/12" />
              </div>
            ))}
          </div>
          <div className="relative h-screen overflow-hidden">
            {projects.map((p, i) => (
              <div
                key={`R-${p.slug}`}
                ref={(el) => {
                  rightLayers.current[i] = el;
                }}
                className="absolute inset-0 overflow-hidden will-change-transform"
                style={{ zIndex: N - i }}
              >
                <Image
                  src={p.rightImg}
                  alt=""
                  fill
                  sizes="50vw"
                  priority={i < 2}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-navy-deep/12" />
              </div>
            ))}
          </div>
        </div>

        {/* Vertical seam */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px bg-cream/30 z-20"
        />

        {/* Top counters */}
        <div className="absolute top-28 left-6 md:left-10 z-30 font-display text-[11px] tracking-[0.32em] uppercase text-cream mix-blend-difference">
          Selected Work · {String(active + 1).padStart(2, "0")} /{" "}
          {String(N).padStart(2, "0")}
        </div>
        <div className="absolute top-28 right-6 md:right-10 z-30 font-display text-[11px] tracking-[0.32em] uppercase text-cream mix-blend-difference">
          Scroll · Click bar to open
        </div>

        {/* Center label bar — stacked layers, top slides up */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(760px,86vw)] z-30">
          <div
            className="relative rounded-md overflow-hidden shadow-[0_22px_50px_-22px_rgba(15,22,38,0.45)]"
            style={{ height: "clamp(96px, 11vh, 124px)" }}
          >
            {projects.map((p, i) => (
              <button
                key={`B-${p.slug}`}
                ref={(el) => {
                  barLayers.current[i] = el;
                }}
                onClick={() => open(i)}
                aria-label={`Open ${p.name}`}
                className="absolute inset-0 text-left cursor-pointer group will-change-transform overflow-hidden"
                style={{
                  zIndex: N - i,
                  backgroundColor: p.accent,
                  color: p.accentInk,
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 flex items-center justify-center font-display font-bold tracking-[-0.04em] opacity-[0.08] select-none"
                  style={{ fontSize: "clamp(48px, 8vw, 116px)" }}
                >
                  NM
                </span>
                <div className="relative h-full px-5 md:px-8 grid grid-cols-12 items-center gap-3 md:gap-6">
                  <div className="col-span-7 min-w-0">
                    <div className="font-display font-medium text-2xl md:text-4xl tracking-[-0.01em] leading-[1.05] truncate">
                      {p.name}
                    </div>
                    <div className="font-body text-xs md:text-sm leading-[1.3] opacity-85 mt-1 truncate">
                      {p.location}
                    </div>
                  </div>
                  <div className="col-span-4 min-w-0 text-right">
                    <div className="font-display text-[10px] md:text-xs tracking-[0.2em] uppercase leading-[1.3]">
                      {p.industryLabel}
                    </div>
                    <div className="font-body text-[11px] md:text-sm leading-[1.3] opacity-85">
                      {p.year}
                    </div>
                  </div>
                  <div className="col-span-1 text-right font-display text-lg md:text-2xl shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-center font-display text-[10px] tracking-[0.32em] uppercase text-cream mix-blend-difference">
            Click bar to open
          </p>
        </div>

        {/* CLICK OVERLAY — mounts when exit set */}
        {exit && (
          <div
            ref={overlayRef}
            className="absolute inset-0 z-50 invisible opacity-0"
          >
            <div className="absolute inset-0 grid grid-cols-2">
              {/* LEFT half */}
              <div className="relative overflow-hidden">
                {/* Accent bg behind everything on left */}
                <div
                  ref={overlayLeftBgRef}
                  className="absolute inset-0"
                  style={{ backgroundColor: exit.accent }}
                />

                {/* Shrinking image — animates top/left/width/height */}
                <div
                  ref={overlayImgRef}
                  className="absolute will-change-[top,left,width,height]"
                  style={{
                    top: "0%",
                    left: "0%",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={exit.leftImg}
                      alt=""
                      fill
                      sizes="50vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Frame outline */}
                  <div
                    ref={overlayFrameRef}
                    className="absolute -inset-[6px] border-2 pointer-events-none"
                    style={{
                      borderColor: exit.accentInk,
                      opacity: 0,
                    }}
                  />
                </div>

                {/* location · year header above small frame */}
                <div
                  ref={overlayLocYearRef}
                  className="absolute will-change-transform flex items-center justify-between font-body text-xs md:text-sm"
                  style={{
                    top: "16%",
                    left: "18%",
                    width: "32%",
                    color: exit.accentInk,
                  }}
                >
                  <span>{exit.location}</span>
                  <span>{exit.year}</span>
                </div>

                {/* caption below small frame */}
                <p
                  ref={overlayCaptionRef}
                  className="absolute will-change-transform font-body text-xs md:text-sm leading-relaxed text-center"
                  style={{
                    top: "70%",
                    left: "18%",
                    width: "32%",
                    color: exit.accentInk,
                  }}
                >
                  {exit.industryLabel} · {exit.categoryLabel}
                </p>

                {/* Big project name lower-left */}
                <div
                  ref={overlayBigTitleRef}
                  className="absolute will-change-transform"
                  style={{
                    left: "6%",
                    bottom: "6%",
                    right: "6%",
                    color: exit.accentInk,
                  }}
                >
                  <h2
                    className="font-display font-bold tracking-[-0.04em] leading-[0.86]"
                    style={{ fontSize: "clamp(56px, 11vw, 180px)" }}
                  >
                    {exit.name}
                  </h2>
                </div>
              </div>

              {/* RIGHT half — shutter slides down from top, then retracts up */}
              <div className="relative overflow-hidden">
                <div
                  ref={overlayShutterRef}
                  className="absolute inset-0 will-change-transform"
                  style={{ backgroundColor: exit.accent }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
