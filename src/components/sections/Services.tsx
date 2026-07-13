"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Reveal } from "@/components/animation/Reveal";
import { services } from "@/lib/site";

const SLATS = 16;
const BG_COLOR = "#0F172A";
const PER_VH = 75;

const TRANS_HALF = 0.06;

const BG_IMGS: Record<string, string> = {
  films: "/gen/ind-real-estate-cover.webp",
  photography: "/gen/ind-restaurants-cover.webp",
  tours: "/gen/ind-hotels-cover.webp",
  websites: "/gen/ind-resorts-cover.webp",
};

export function Services() {
  const root = useRef<HTMLElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      // Pinned blinds section exists only in the desktop block; phones get
      // the static snap carousel and no ScrollTrigger.
      if (!window.matchMedia("(min-width: 768px)").matches) return;

      const N = services.length;
      const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

      const textNodes = Array.from(
        el.querySelectorAll<HTMLElement>("[data-text-slide]")
      );

      const bigStripGroups: HTMLElement[][] = [];
      for (let i = 0; i < N; i++) {
        bigStripGroups.push(
          Array.from(
            el.querySelectorAll<HTMLElement>(
              `[data-big-slide="${i}"] [data-strip]`
            )
          )
        );
      }

      const state = { p: 0 };
      gsap.to(state, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        onUpdate: () => {
          const p = state.p;

          if (progressFillRef.current) {
            progressFillRef.current.style.transform = `scaleY(${p})`;
          }

          for (let i = 0; i < N; i++) {
            let opacity = 1;
            if (i < N - 1) {
              const c = (i + 1) / N;
              const tOut = clamp01((p - (c - TRANS_HALF)) / (TRANS_HALF * 2));
              opacity = Math.min(opacity, 1 - tOut);
            }
            if (i > 0) {
              const c = i / N;
              const tIn = clamp01((p - (c - TRANS_HALF)) / (TRANS_HALF * 2));
              opacity = Math.min(opacity, tIn);
            }
            const node = textNodes.find(
              (n) => n.dataset.textSlide === String(i)
            );
            if (node) node.style.opacity = String(clamp01(opacity));
          }

          for (let i = 0; i < N - 1; i++) {
            const c = (i + 1) / N;
            const tp = clamp01((p - (c - TRANS_HALF)) / (TRANS_HALF * 2));
            const strips = bigStripGroups[i];
            const G = strips.length;
            for (let k = 0; k < G; k++) {
              const bladeProg = clamp01(
                (tp - (k / Math.max(1, G - 1)) * 0.4) / 0.6
              );
              strips[k].style.transform = `scaleY(${1 - bladeProg})`;
            }
          }
          const lastStrips = bigStripGroups[N - 1];
          for (const s of lastStrips) s.style.transform = "scaleY(1)";
        },
      });

      ScrollTrigger.refresh();
    },
    { scope: root }
  );

  const sectionVh = services.length * PER_VH + 20;
  const N = services.length;

  return (
    <section
      ref={root}
      id="services-preview"
      className="relative w-full text-cream"
      style={{ background: BG_COLOR }}
    >
      {/* ————— Desktop: pinned blinds transition ————— */}
      <div
        className="relative hidden md:block"
        style={{ height: `${sectionVh}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background:
                "radial-gradient(70% 60% at 80% 20%, rgba(200,161,75,0.18), transparent 60%)",
            }}
          />

          <div className="absolute top-9 left-10 z-10">
            <p className="eyebrow text-gold">Services</p>
          </div>
          <div className="absolute top-9 right-10 z-10 font-body text-xs text-cream/50">
            Scroll to explore
          </div>

          <div className="absolute inset-0 grid grid-cols-12 gap-16 px-16 pt-28 pb-24">
            <div className="col-span-5 relative flex items-center min-h-0">
              <div className="relative h-[60%] w-[2px] bg-cream/10 shrink-0">
                <div
                  ref={progressFillRef}
                  className="absolute inset-0 bg-gold origin-top"
                  style={{ transform: "scaleY(0)" }}
                />
              </div>

              <div className="relative ml-12 flex-1 h-[60%]">
                {services.map((s, i) => (
                  <div
                    key={s.slug}
                    data-text-slide={i}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
                    <p className="eyebrow text-gold mb-5">
                      {String(i + 1).padStart(2, "0")} / 0{services.length}
                    </p>
                    <h3
                      className="font-heading leading-[0.95] text-cream mb-5"
                      style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
                    >
                      {s.title}
                    </h3>
                    <p className="font-body text-cream/75 max-w-md text-lg leading-relaxed mb-7">
                      {s.short}
                    </p>
                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                      <div>
                        <p className="eyebrow text-cream/50 mb-1">Starts at</p>
                        <p className="font-heading text-3xl text-gold">
                          {s.startsAt}
                        </p>
                      </div>
                      <div>
                        <p className="eyebrow text-cream/50 mb-1">Delivery</p>
                        <p className="font-heading text-3xl text-cream">
                          {s.delivery}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-7 relative flex items-center justify-center min-h-0">
              <div className="relative h-[88%] w-full">
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {services.map((s, i) => (
                    <div
                      key={s.slug}
                      data-big-slide={i}
                      className="absolute inset-0"
                      style={{ zIndex: N - i }}
                    >
                      {/* Each slat is a window onto a full-container copy of
                          the image (object-cover), shifted up by the slat's
                          offset — the image crops like a normal cover image
                          instead of being squished to the container ratio. */}
                      {Array.from({ length: SLATS }).map((_, k) => (
                        <div
                          key={k}
                          data-strip
                          className="absolute left-0 right-0 overflow-hidden"
                          style={{
                            top: `${(k / SLATS) * 100}%`,
                            height: `${100 / SLATS}%`,
                            transform: "scaleY(1)",
                            transformOrigin: "top",
                          }}
                        >
                          <div
                            className="absolute left-0 right-0"
                            style={{
                              height: `${SLATS * 100}%`,
                              top: `${-k * 100}%`,
                            }}
                          >
                            <img
                              src={BG_IMGS[s.slug]}
                              alt={i === 0 && k === 0 ? s.title : ""}
                              aria-hidden={!(i === 0 && k === 0)}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl bg-gradient-to-t from-navy/40 via-transparent to-transparent pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ————— Mobile: light snap carousel, no pinning ————— */}
      <div className="md:hidden py-16 px-0">
        <div className="px-6 mb-8 flex items-end justify-between">
          <div>
            <Reveal as="p" className="eyebrow text-gold mb-3">
              Services
            </Reveal>
            <Reveal
              as="h2"
              delay={60}
              className="font-heading leading-[0.98] text-cream"
            >
              <span style={{ fontSize: "clamp(32px, 8vw, 44px)" }}>
                What we make.
              </span>
            </Reveal>
          </div>
          <p className="font-body text-[11px] text-cream/50 mb-1">
            Swipe →
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-2 scrollbar-none">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href="/services"
              className="snap-center shrink-0 w-[82%] max-w-[340px] rounded-2xl overflow-hidden bg-navy border border-cream/10"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={BG_IMGS[s.slug]}
                  alt={s.title}
                  fill
                  sizes="82vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
                <p className="absolute top-4 left-4 eyebrow text-gold">
                  {String(i + 1).padStart(2, "0")} / 0{services.length}
                </p>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-2xl text-cream mb-2">
                  {s.title}
                </h3>
                <p className="font-body text-sm text-cream/70 leading-relaxed mb-4">
                  {s.short}
                </p>
                <div className="flex items-baseline justify-between border-t border-cream/10 pt-4">
                  <div>
                    <p className="eyebrow text-cream/50 mb-0.5">Starts at</p>
                    <p className="font-heading text-xl text-gold">
                      {s.startsAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="eyebrow text-cream/50 mb-0.5">Delivery</p>
                    <p className="font-heading text-xl text-cream">
                      {s.delivery}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
