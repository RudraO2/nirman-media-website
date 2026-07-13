import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";
import { ScrollFillText } from "@/components/animation/ScrollFillText";
import { Reveal } from "@/components/animation/Reveal";
import { PageMeta } from "@/components/layout/PageMeta";
import { site, trustStats } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/about/" },
  title: "About — Nirman Media",
  description:
    "Jaipur-based media studio. A trained eye, premium finish, and brand-speed delivery for hotels, resorts, restaurants, gyms, real estate.",
};

const pillars = [
  {
    n: "01",
    t: "Light first.",
    b: "Composition follows what the sun is doing that hour. Schedules bend around it. So does the brand.",
  },
  {
    n: "02",
    t: "Edit ruthless.",
    b: "Every cut earns its second. If a frame doesn't move someone to call, it doesn't ship.",
  },
  {
    n: "03",
    t: "Deliver early.",
    b: "Launch on Friday? You see the film Wednesday. Padding is a luxury we don't believe in.",
  },
];

const timeline = [
  { year: "2021", body: "Studio founded in Jaipur. First builder client signed in week two." },
  { year: "2022", body: "Expanded to hospitality. Aurum Hotel launched. +120% direct bookings." },
  { year: "2023", body: "3D scrolly tours introduced. First property sold out in 18 days." },
  { year: "2024", body: "50+ projects shipped across 4 cities. Restaurant + gym verticals added." },
  { year: "Today", body: "Same standard. Bigger room. Still 7-day delivery." },
];

const team = [
  { name: "—", role: "Founder · Director", img: "/gen/about-1.webp" },
  { name: "—", role: "Cinematographer", img: "/gen/about-2.webp" },
  { name: "—", role: "Editor + Colourist", img: "/gen/about-3.webp" },
  { name: "—", role: "Producer", img: "/gen/about-4.webp" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative w-full h-[88vh] min-h-[560px] md:min-h-[680px] overflow-hidden bg-navy text-cream">
        <Image
          src="/gen/about-1.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/30 to-navy/85" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-10 pb-12 md:pb-16">
          <div className="mx-auto max-w-[1280px] w-full">
            <div className="grid grid-cols-12 gap-6 md:gap-8 items-end">
              <div className="col-span-12 md:col-span-8">
                <p className="eyebrow text-gold mb-5">A studio in Jaipur</p>
                <h1
                  className="font-heading leading-[0.9]"
                  style={{ fontSize: "clamp(48px, 9vw, 156px)" }}
                >
                  We shoot{" "}
                  <em className="font-heading-italic text-gold">
                    for rooms
                  </em>{" "}
                  that need to sell.
                </h1>
              </div>
              <div className="col-span-12 md:col-span-4 md:pb-2">
                <p className="font-body text-base md:text-lg text-cream/80 max-w-sm">
                  Five spaces. One standard. Built in Jaipur. Trusted from
                  Mansarovar to Marina Bay.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-24 md:top-28 right-6 md:right-10 hidden md:block">
          <p className="eyebrow text-cream/55 text-right">Est. 2021 · Jaipur</p>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <PageMeta index="05 / 05" label="About · Manifesto" caption="The studio · On every brief" />
          <div className="mt-12 md:mt-16 grid grid-cols-12 gap-10 md:gap-16 items-start">
            <div className="col-span-12 md:col-span-8 md:col-start-2">
              <p className="eyebrow text-gold mb-5">Our take</p>
              <ScrollFillText
                className="font-heading-italic text-ink leading-[1.05]"
                baseAlpha={0.32}
              >
                {
                  "Premium isn’t a filter. It’s a decision made before the shutter fires — about light, about edit, about what stays out of the frame."
                }
              </ScrollFillText>
            </div>
            <div className="col-span-12 md:col-span-2 md:col-start-11 md:pt-4">
              <p className="font-body text-sm text-ink/55 leading-relaxed">
                The studio, on every brief
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow text-gold mb-5">By the numbers</p>
            <h2
              className="font-heading leading-[0.98] text-ink"
              style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}
            >
              Quietly{" "}
              <em className="font-heading-italic text-gold">prolific.</em>
            </h2>
            <p className="font-body text-ink/65 mt-5 max-w-sm">
              We work small, ship fast, repeat. No agency layers. No account
              managers between you and the camera.
            </p>
          </div>
          <dl className="col-span-12 md:col-span-7 grid grid-cols-2 gap-px bg-ink/10 rounded-2xl overflow-hidden">
            {trustStats.map((s) => (
              <div
                key={s.label}
                className="bg-cream p-6 md:p-8 flex flex-col gap-3"
              >
                <dt className="eyebrow text-ink/45">{s.label}</dt>
                <dd
                  className="font-heading text-ink leading-none"
                  style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-navy text-cream px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-end mb-12 md:mb-16">
            <div className="col-span-12 md:col-span-7">
              <p className="eyebrow text-gold mb-5">How we work</p>
              <h2
                className="font-heading leading-[0.98]"
                style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
              >
                Three rules{" "}
                <em className="font-heading-italic text-gold">
                  we don&apos;t bend.
                </em>
              </h2>
            </div>
          </div>

          <ol className="border-t border-cream/15">
            {pillars.map((p) => (
              <li
                key={p.n}
                className="grid grid-cols-12 gap-4 md:gap-10 py-8 md:py-10 border-b border-cream/15 items-start"
              >
                <span className="col-span-2 md:col-span-1 eyebrow text-gold pt-2">
                  {p.n}
                </span>
                <h3
                  className="col-span-10 md:col-span-5 font-heading leading-[1.02]"
                  style={{ fontSize: "clamp(24px, 3vw, 44px)" }}
                >
                  {p.t}
                </h3>
                <p className="col-span-12 md:col-span-6 font-body text-base md:text-lg text-cream/75 leading-relaxed">
                  {p.b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16 items-end">
            <div className="col-span-12 md:col-span-7">
              <p className="eyebrow text-gold mb-4">Studio timeline</p>
              <h2
                className="font-heading leading-[0.98] text-ink"
                style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}
              >
                Four years.{" "}
                <em className="font-heading-italic text-gold">One standard.</em>
              </h2>
            </div>
            <p className="col-span-12 md:col-span-5 font-body text-sm text-ink/55 md:text-right">
              Founded in Jaipur. Still answering our own WhatsApp.
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
            {timeline.map((t, i) => (
              <li
                key={t.year}
                className={`group relative rounded-2xl p-5 md:p-6 min-h-[180px] flex flex-col justify-between transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 ${
                  i === timeline.length - 1
                    ? "bg-navy text-cream hover:shadow-[0_30px_60px_-30px_color-mix(in_oklch,var(--color-navy)_70%,transparent)]"
                    : "bg-sand text-ink hover:shadow-[0_20px_40px_-24px_color-mix(in_oklch,var(--color-ink)_45%,transparent)]"
                }`}
              >
                <p
                  className={`eyebrow flex items-center justify-between ${
                    i === timeline.length - 1 ? "text-gold" : "text-ink/45"
                  }`}
                >
                  <span>{t.year}</span>
                  <span
                    aria-hidden
                    className={`tab-num text-[10px] ${
                      i === timeline.length - 1 ? "text-cream/40" : "text-ink/30"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </p>
                <p
                  className={`font-body text-sm md:text-base leading-relaxed ${
                    i === timeline.length - 1 ? "text-cream/85" : "text-ink/75"
                  }`}
                >
                  {t.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-sand px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16 items-end">
            <div className="col-span-12 md:col-span-7">
              <p className="eyebrow text-gold mb-4">Behind the lens</p>
              <h2
                className="font-heading leading-[0.98] text-ink"
                style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}
              >
                The team{" "}
                <em className="font-heading-italic text-gold">on every shoot.</em>
              </h2>
            </div>
            <p className="col-span-12 md:col-span-5 font-body text-sm text-ink/55 md:text-right">
              Same faces, every project. No swapping crew mid-shoot.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-3 md:gap-5">
            {team.map((m, i) => (
              <article
                key={i}
                className={`group relative overflow-hidden rounded-2xl bg-navy ${
                  i === 0
                    ? "col-span-12 md:col-span-6 aspect-[5/4]"
                    : "col-span-6 md:col-span-2 aspect-[4/5]"
                }`}
              >
                <Image
                  src={m.img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent transition-opacity duration-500 group-hover:from-navy/90" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-cream">
                  <p className="eyebrow text-gold mb-1">{m.role}</p>
                  <p className="font-heading text-xl md:text-2xl text-cream">
                    {m.name}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] grid grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow text-gold mb-5">Contact us</p>
            <h2
              className="font-heading leading-[0.98] text-ink"
              style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}
            >
              Let&apos;s{" "}
              <em className="font-heading-italic text-gold">talk.</em>
            </h2>
            <p className="font-body text-ink/70 mt-5 max-w-sm">
              Bring a moodboard or a phone-shot reference — we&apos;ll sketch
              the shot list together.
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 max-w-sm">
              <div>
                <dt className="eyebrow text-ink/45 mb-1">Hours</dt>
                <dd className="font-body text-sm text-ink">{site.hours}</dd>
              </div>
              <div>
                <dt className="eyebrow text-ink/45 mb-1">Call</dt>
                <dd>
                  <a
                    href={`tel:${site.phoneRaw}`}
                    className="font-body text-sm text-ink hover:text-gold"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ink/45 mb-1">Email</dt>
                <dd>
                  <a
                    href={`mailto:${site.email}`}
                    className="font-body text-sm text-ink hover:text-gold break-all"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={site.whatsappLink}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-3 bg-ink text-cream px-6 py-3.5 rounded-full font-body text-sm hover:bg-gold hover:text-ink transition-colors cursor-pointer"
              >
                <span>WhatsApp us</span>
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-2 border border-ink/20 text-ink px-6 py-3.5 rounded-full font-body text-sm hover:bg-ink hover:text-cream hover:border-ink transition-colors cursor-pointer"
              >
                <span>See pricing</span>
                <span
                  aria-hidden
                  className="inline-block opacity-0 -translate-x-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-x-0"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-navy">
                <Image
                  src="/gen/about-2.webp"
                  alt=""
                  fill
                  sizes="40vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-navy mt-10">
                <Image
                  src="/gen/about-3.webp"
                  alt=""
                  fill
                  sizes="40vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
