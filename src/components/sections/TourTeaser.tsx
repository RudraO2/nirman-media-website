"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/animation/Reveal";

const VIDEO_SRC = "/tour/tour-scrub.mp4";
const POSTER_SRC = "/tour/tour-poster.jpg";

export function TourTeaser() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const durationRef = useRef(8);
  const lastSeekRef = useRef(0);
  // Desktop-only scrub; video isn't even mounted until the section nears the
  // viewport, and never on phones (they get the static poster block).
  const [mountVideo, setMountVideo] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const el = root.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMountVideo(true);
          obs.disconnect();
        }
      },
      { rootMargin: "100%" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!mountVideo) return;
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      durationRef.current = v.duration || 8;
      setReady(true);
    };
    if (v.readyState >= 1 && v.duration > 0) onMeta();
    else v.addEventListener("loadedmetadata", onMeta, { once: true });
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, [mountVideo]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (!window.matchMedia("(min-width: 768px)").matches) return;
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
          let tSec = state.p * dur;
          // Never seek past what's buffered — a seek into un-downloaded
          // video stalls the decoder and stutters the whole scroll.
          const buf = v.buffered;
          if (buf.length) {
            tSec = Math.min(tSec, Math.max(0, buf.end(buf.length - 1) - 0.05));
          }
          if (Math.abs(tSec - lastSeekRef.current) > 0.016) {
            v.currentTime = tSec;
            lastSeekRef.current = tSec;
          }
        },
      });
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

      {/* Desktop: scroll-scrubbed walkthrough */}
      <div data-tour-scrolly className="relative w-full h-[450vh] hidden md:block">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-navy-deep">
          <Image
            src={POSTER_SRC}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="object-cover"
          />
          {mountVideo && (
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: ready ? 1 : 0 }}
              aria-hidden
            />
          )}
        </div>
      </div>

      {/* Mobile: single static frame, zero video download */}
      <div className="md:hidden px-6 pb-16">
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl">
          <Image
            src={POSTER_SRC}
            alt="3D tour walkthrough preview"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 right-5 font-body text-sm text-cream/85">
            Best experienced on a bigger screen — the full tour walks the room
            as you scroll.
          </p>
        </div>
      </div>
    </section>
  );
}
