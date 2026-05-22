"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Reveal } from "@/components/animation/Reveal";

const VIDEO_SRC = "/tour/tour-scrub.mp4";
const POSTER_SRC = "/tour/tour-poster.jpg";

export function TourTeaser() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(8);
  const lastSeekRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      durationRef.current = v.duration || 8;
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
      const scrolly = el.querySelector<HTMLElement>("[data-tour-scrolly]");
      if (!scrolly) return;

      const state = { p: 0 };
      gsap.to(state, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: scrolly,
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
        },
      });

      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section ref={root} className="relative bg-navy-deep text-cream">
      <div className="px-6 md:px-10 pt-20 md:pt-28 pb-10 mx-auto max-w-[1500px]">
        <Reveal as="p" className="font-display text-xs tracking-[0.3em] uppercase text-gold mb-4">
          3D Scrollytelling
        </Reveal>
        <Reveal
          as="h2"
          delay={80}
          className="font-display font-medium tracking-[-0.02em] leading-[0.95] max-w-3xl"
        >
          <span style={{ fontSize: "clamp(36px, 6vw, 88px)" }} className="block">
            Walk the space. <em className="font-serif italic font-light">By scrolling.</em>
          </span>
        </Reveal>
        <Reveal as="p" delay={160} className="font-body text-cream/75 max-w-xl mt-6">
          Flats, suites, lobbies, studios — your audience experiences the room right on your site. No appointment. No download.
        </Reveal>
      </div>

      <div data-tour-scrolly className="relative w-full h-[450vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-navy-deep">
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
        </div>
      </div>
    </section>
  );
}
