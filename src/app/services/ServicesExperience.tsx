"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/lib/site";
import { PageMeta } from "@/components/layout/PageMeta";
import { Reveal } from "@/components/animation/Reveal";

type ServiceSlug = (typeof services)[number]["slug"];

const detail: Record<
  ServiceSlug,
  {
    points: string[];
    img: string;
    image2?: string;
    use: string;
    proof: string;
  }
> = {
  films: {
    points: [
      "30s, 60s, 90s cuts",
      "Drone + ground rig",
      "Music + colour grade",
      "Reels for every aspect ratio",
    ],
    img: "/gen/proj-skyline-residences-cover.webp",
    image2: "/gen/proj-skyline-residences-alt.webp",
    use: "For launches, hoarding QR, OTAs, Instagram, builder reels.",
    proof: "Sold 32 flats in 18 days — Skyline Residences",
  },
  photography: {
    points: [
      "Editorial + hoarding stills",
      "Twilight + day shoots",
      "Lifestyle + architecture + plates",
      "Print + web exports",
    ],
    img: "/gen/ind-restaurants-cover.webp",
    image2: "/gen/proj-bistro-maharaj-cover.webp",
    use: "For listings, menus, brochures, social grid, brand decks.",
    proof: "3× reservations post-launch — Bistro Maharaj",
  },
  tours: {
    points: [
      "Full space walkthrough",
      "Mobile-first vertical option",
      "Embed on any site",
      "Analytics-ready",
    ],
    img: "/gen/proj-the-pinnacle-cover.webp",
    image2: "/gen/ind-hotels-cover.webp",
    use: "For pre-launch property + suite previews + restaurant walk-ins.",
    proof: "+120% direct bookings — The Aurum Hotel",
  },
  websites: {
    points: [
      "Conversion-tuned design",
      "Booking / lead form / WhatsApp",
      "Menu, plans, project pages, SEO",
      "Hosted, fast, secure",
    ],
    img: "/gen/ind-hotels-cover.webp",
    image2: "/gen/proj-atrium-cover.webp",
    use: "When OTA fees hurt, when phone calls dry up, when sales need a stage.",
    proof: "+60% memberships in Q1 — Iron Den",
  },
};

const matrix = [
  {
    label: "Cinematic film",
    keys: { films: "✓ Full", photography: "—", tours: "—", websites: "Embed" },
  },
  {
    label: "Editorial stills",
    keys: {
      films: "Frames",
      photography: "✓ Full",
      tours: "—",
      websites: "Embed",
    },
  },
  {
    label: "Reel pack",
    keys: { films: "✓ Full", photography: "Add-on", tours: "—", websites: "—" },
  },
  {
    label: "3D scrolly tour",
    keys: { films: "—", photography: "—", tours: "✓ Full", websites: "Embed" },
  },
  {
    label: "Drone aerials",
    keys: {
      films: "✓ Full",
      photography: "Add-on",
      tours: "—",
      websites: "—",
    },
  },
  {
    label: "Brand site",
    keys: {
      films: "—",
      photography: "—",
      tours: "Hosted",
      websites: "✓ Full",
    },
  },
  {
    label: "WhatsApp + lead form",
    keys: { films: "—", photography: "—", tours: "—", websites: "✓ Full" },
  },
  {
    label: "Source files released",
    keys: {
      films: "Add-on",
      photography: "Add-on",
      tours: "Hosted",
      websites: "✓ Full",
    },
  },
];

export function ServicesExperience() {
  const [active, setActive] = useState<ServiceSlug>("films");
  const idx = services.findIndex((s) => s.slug === active);
  const s = services[idx];
  const d = detail[active];

  return (
    <>
      <section className="relative bg-cream pt-28 md:pt-32 pb-14 md:pb-20 px-6 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <PageMeta
            index="03 / 05"
            label="Services"
            caption="One studio · Four crafts · Seven-day delivery"
          />
          <div className="mt-10 md:mt-14 grid grid-cols-12 gap-6 md:gap-10 items-end">
            <Reveal as="div" className="col-span-12 md:col-span-8">
              <div className="flex items-baseline gap-3 md:gap-5 flex-wrap">
                <span
                  className="font-heading-italic text-gold whitespace-nowrap"
                  style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
                >
                  One studio,
                </span>
                <span
                  className="font-heading text-ink leading-[0.88]"
                  style={{ fontSize: "clamp(44px, 7.5vw, 108px)" }}
                >
                  four crafts.
                </span>
              </div>
            </Reveal>
            <Reveal
              as="p"
              delay={120}
              className="col-span-12 md:col-span-4 font-body text-sm md:text-base text-ink/65 md:text-right md:pb-3 max-w-sm md:ml-auto"
            >
              Pick one. Pick all. We work as a single team — same director, same
              colourist, same standard.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sticky top-16 md:top-20 z-30 bg-cream/85 backdrop-blur-md border-y border-line">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10 overflow-x-auto no-scrollbar">
          <ul className="flex gap-1 md:gap-2 py-2 min-w-max">
            {services.map((sv, i) => (
              <li key={sv.slug}>
                <button
                  onClick={() => setActive(sv.slug as ServiceSlug)}
                  className={`flex items-center gap-3 px-4 md:px-5 py-2.5 rounded-full font-body text-sm transition-colors cursor-pointer ${
                    active === sv.slug
                      ? "bg-ink text-cream"
                      : "text-ink/65 hover:text-ink hover:bg-mist/60"
                  }`}
                  aria-pressed={active === sv.slug}
                >
                  <span
                    className={`tabular-nums text-xs ${
                      active === sv.slug ? "text-gold" : "text-ink/40"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{sv.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-10 py-12 md:py-20">
        <div className="mx-auto max-w-[1280px] grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-5 md:order-2">
            <div className="grid grid-cols-5 grid-rows-6 gap-3 md:gap-4 h-full min-h-[420px] md:min-h-[600px]">
              <div className="group col-span-3 row-span-4 relative overflow-hidden rounded-2xl bg-navy">
                <Image
                  key={`${active}-1`}
                  src={d.img}
                  alt={`${services[idx].title} — Nirman Media`}
                  fill
                  sizes="(max-width: 768px) 60vw, 35vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="group col-span-2 row-span-3 col-start-4 relative overflow-hidden rounded-2xl bg-navy">
                {d.image2 && (
                  <Image
                    key={`${active}-2`}
                    src={d.image2}
                    alt={`${services[idx].title} — Nirman Media, detail`}
                    fill
                    sizes="(max-width: 768px) 40vw, 20vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="col-span-2 row-span-3 col-start-4 row-start-4 bg-navy text-cream rounded-2xl p-5 md:p-6 flex flex-col justify-between">
                <div>
                  <p className="eyebrow text-gold mb-2">Use for</p>
                  <p className="font-body text-sm text-cream/85 leading-relaxed">
                    {d.use}
                  </p>
                </div>
                <p className="font-heading-italic text-gold text-sm md:text-base">
                  {d.proof}
                </p>
              </div>
              <div className="col-span-3 row-span-2 row-start-5 bg-sand rounded-2xl p-5 md:p-6 flex items-center">
                <p className="font-heading-italic text-ink text-xl md:text-2xl leading-tight">
                  &ldquo;{s.short}&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 md:order-1 flex flex-col">
            <p className="eyebrow text-gold mb-4">
              0{idx + 1} of 0{services.length} · Service
            </p>
            <h2
              className="font-heading leading-[0.92] text-ink"
              style={{ fontSize: "clamp(44px, 7vw, 120px)" }}
            >
              {s.title.split(" ").map((w, i) => (
                <span key={i} className="block">
                  {w}
                </span>
              ))}
            </h2>

            <p className="font-body text-base md:text-lg text-ink/75 mt-7 max-w-md">
              {s.desc}
            </p>

            <div className="mt-9 grid grid-cols-2 gap-6 max-w-md">
              <div className="border-t border-line pt-4">
                <p className="eyebrow text-ink/45 mb-2">Starts at</p>
                <p className="font-heading text-3xl md:text-4xl text-gold">
                  {s.startsAt}
                </p>
              </div>
              <div className="border-t border-line pt-4">
                <p className="eyebrow text-ink/45 mb-2">Delivery</p>
                <p className="font-heading text-3xl md:text-4xl text-ink">
                  {s.delivery}
                </p>
              </div>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              {d.points.map((pt) => (
                <li
                  key={pt}
                  className="flex items-start gap-3 font-body text-sm md:text-base text-ink/80 border-t border-line pt-3"
                >
                  <span className="text-gold mt-1.5" aria-hidden>
                    ●
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={site.whatsappLink}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-3 bg-ink text-cream px-6 py-3.5 rounded-full font-body text-sm hover:bg-gold hover:text-ink transition-colors cursor-pointer"
              >
                <span>WhatsApp a quote</span>
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
        </div>
      </section>

      <section className="bg-navy text-cream px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-12 gap-6 mb-10 md:mb-14 items-end">
            <div className="col-span-12 md:col-span-7">
              <p className="eyebrow text-gold mb-4">What sits in each tier</p>
              <h2
                className="font-heading leading-[0.98]"
                style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
              >
                Pick a service.{" "}
                <em className="font-heading-italic text-gold">
                  See what&apos;s inside.
                </em>
              </h2>
            </div>
            <p className="col-span-12 md:col-span-5 font-body text-sm md:text-base text-cream/65">
              Most clients combine 2 or 3 services. Mix the rows you need —
              we&apos;ll price the bundle in one quote.
            </p>
          </div>

          <div className="border border-cream/10 rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-[1.4fr_repeat(4,1fr)] bg-cream/[0.04] border-b border-cream/10">
              <div className="p-5 eyebrow text-cream/55">Deliverable</div>
              {services.map((sv) => (
                <button
                  key={sv.slug}
                  onClick={() => setActive(sv.slug as ServiceSlug)}
                  className={`p-5 text-left font-body text-sm border-l border-cream/10 transition-colors cursor-pointer ${
                    active === sv.slug
                      ? "text-gold bg-cream/[0.05]"
                      : "text-cream/85 hover:text-cream"
                  }`}
                >
                  <p className="eyebrow text-cream/40 mb-1">0{services.findIndex(x=>x.slug===sv.slug)+1}</p>
                  {sv.title}
                </button>
              ))}
            </div>
            <div className="hidden md:block">
              {matrix.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1.4fr_repeat(4,1fr)] border-b border-cream/10 last:border-b-0 ${
                    i % 2 === 0 ? "bg-transparent" : "bg-cream/[0.02]"
                  }`}
                >
                  <div className="p-5 font-body text-sm text-cream/85">
                    {row.label}
                  </div>
                  {services.map((sv) => {
                    const v = row.keys[sv.slug as keyof typeof row.keys];
                    const full = v.startsWith("✓");
                    return (
                      <div
                        key={sv.slug}
                        className={`p-5 font-body text-sm border-l border-cream/10 ${
                          active === sv.slug
                            ? "bg-cream/[0.05]"
                            : ""
                        } ${full ? "text-gold font-medium" : "text-cream/55"}`}
                      >
                        {v}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="md:hidden divide-y divide-cream/10">
              <div className="p-5 bg-cream/[0.04] eyebrow text-cream/55">
                Showing: {s.title}
              </div>
              {matrix.map((row) => {
                const v = row.keys[active as keyof typeof row.keys];
                const full = v.startsWith("✓");
                return (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <p className="font-body text-sm text-cream/85">
                      {row.label}
                    </p>
                    <p
                      className={`font-body text-sm whitespace-nowrap ${
                        full ? "text-gold font-medium" : "text-cream/55"
                      }`}
                    >
                      {v}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow text-gold mb-4">How a project flows</p>
            <h2
              className="font-heading leading-[0.98] text-ink"
              style={{ fontSize: "clamp(32px, 5vw, 60px)" }}
            >
              4 steps. 7 days. One team.
            </h2>
            <p className="font-body text-ink/65 mt-5 max-w-sm">
              From brief to delivery in a single working week. No back-and-forth
              chains, no missing files at midnight.
            </p>
            <Link
              href="/#contact"
              className="group mt-6 inline-flex items-center gap-2 bg-ink text-cream px-6 py-3.5 rounded-full font-body text-sm hover:bg-gold hover:text-ink transition-colors cursor-pointer"
            >
              <span>Send a brief</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
          <ol className="col-span-12 md:col-span-7 grid grid-cols-2 gap-3 md:gap-4">
            {[
              { n: "01", t: "Brief", v: "30-min call" },
              { n: "02", t: "Shoot", v: "1–2 days" },
              { n: "03", t: "Craft", v: "3–4 days" },
              { n: "04", t: "Deliver", v: "Day 7" },
            ].map((step) => (
              <li
                key={step.n}
                className="group bg-sand rounded-2xl p-5 md:p-6 flex flex-col justify-between min-h-[140px] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_color-mix(in_oklch,var(--color-ink)_45%,transparent)]"
              >
                <span className="eyebrow text-gold tab-num">{step.n}</span>
                <div>
                  <p className="font-heading text-2xl md:text-3xl text-ink">
                    {step.t}
                  </p>
                  <p className="font-body text-xs md:text-sm text-ink/55 mt-1">
                    {step.v}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
