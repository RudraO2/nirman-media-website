"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const VIDEO_SRC = "/hero/hero-scrub.mp4";
const POSTER_SRC = "/hero/hero-poster.jpg";

// Title morph windows in video-time (seconds).
const MORPH1 = 8.0;
const MORPH2 = 16.0;
const MORPH_W = 0.4;

// Loader peel finishes around ~5s — sync first title fall just after.
const TITLE_A_DELAY = 5.0;

export function HeroParallax() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(26);
  const lastSeekRef = useRef(0);
  const titleARef = useRef<HTMLHeadingElement>(null);
  const titleBRef = useRef<HTMLHeadingElement>(null);
  const titleCRef = useRef<HTMLHeadingElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      durationRef.current = v.duration || 26;
      setReady(true);
    };
    if (v.readyState >= 1 && v.duration > 0) onMeta();
    else v.addEventListener("loadedmetadata", onMeta, { once: true });
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const buildFall = (title: HTMLHeadingElement | null) => {
        if (!title) return null;
        const chars = title.querySelectorAll<HTMLElement>("[data-char]");
        gsap.set(chars, {
          yPercent: -130,
          opacity: 0,
          filter: "blur(10px)",
          rotate: () => gsap.utils.random(-6, 6),
        });
        const tl = gsap.timeline({ paused: true });
        tl.to(chars, {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          rotate: 0,
          duration: 0.45,
          stagger: 0.025,
          ease: "expo.out",
        });
        return tl;
      };

      const tlA = buildFall(titleARef.current);
      const tlB = buildFall(titleBRef.current);
      const tlC = buildFall(titleCRef.current);

      if (tlA) gsap.delayedCall(TITLE_A_DELAY, () => tlA.restart());

      const playedB = { v: false };
      const playedC = { v: false };

      const state = { p: 0 };
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
          const v = videoRef.current;
          const dur = durationRef.current;
          if (!v || dur <= 0) return;

          const tSec = state.p * dur;
          if (Math.abs(tSec - lastSeekRef.current) > 0.016) {
            v.currentTime = tSec;
            lastSeekRef.current = tSec;
          }

          const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
          const t1 = clamp01((tSec - (MORPH1 - MORPH_W)) / (2 * MORPH_W));
          const t2 = clamp01((tSec - (MORPH2 - MORPH_W)) / (2 * MORPH_W));
          if (titleARef.current) titleARef.current.style.opacity = String(1 - t1);
          if (titleBRef.current) titleBRef.current.style.opacity = String(t1 - t2);
          if (titleCRef.current) titleCRef.current.style.opacity = String(t2);

          if (!playedB.v && tSec >= MORPH1 - MORPH_W * 1.5) {
            tlB?.restart();
            playedB.v = true;
          } else if (playedB.v && tSec < MORPH1 - 1.0) {
            playedB.v = false;
          }

          if (!playedC.v && tSec >= MORPH2 - MORPH_W * 1.5) {
            tlC?.restart();
            playedC.v = true;
          } else if (playedC.v && tSec < MORPH2 - 1.0) {
            playedC.v = false;
          }
        },
      });

      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section
      ref={root}
      className="relative h-[1275vh] w-full bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />

        <FallingTitle
          forwardRef={titleARef}
          text="Make Them Stop."
          initialOpacity={1}
        />
        <FallingTitle
          forwardRef={titleBRef}
          text="Make Them Feel."
          initialOpacity={0}
        />
        <FallingTitle
          forwardRef={titleCRef}
          text="Make Them Book."
          initialOpacity={0}
        />
      </div>
    </section>
  );
}

function FallingTitle({
  forwardRef,
  text,
  initialOpacity,
}: {
  forwardRef: React.RefObject<HTMLHeadingElement | null>;
  text: string;
  initialOpacity: number;
}) {
  return (
    <h1
      ref={forwardRef}
      aria-hidden
      className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 z-10 font-heading font-bold text-white text-center leading-none will-change-transform pointer-events-none drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)] whitespace-nowrap"
      style={{ fontSize: "clamp(48px, 9vw, 144px)", opacity: initialOpacity }}
    >
      {text.split("").map((ch, i) => (
        <span key={i} className="inline-block overflow-visible">
          <span data-char className="inline-block">
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </h1>
  );
}
