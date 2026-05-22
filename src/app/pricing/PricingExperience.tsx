"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { PageMeta } from "@/components/layout/PageMeta";
import { Reveal } from "@/components/animation/Reveal";

type Cat = "films" | "photography" | "tours" | "websites";

const cats: { slug: Cat; label: string; from: string }[] = [
  { slug: "films", label: "Films", from: "₹85k" },
  { slug: "photography", label: "Photography", from: "₹45k" },
  { slug: "tours", label: "3D Tours", from: "₹65k" },
  { slug: "websites", label: "Websites", from: "₹1.2L" },
];

type Tier = {
  name: string;
  tagline: string;
  price: string;
  delivery: string;
  featured?: boolean;
};

const tiers: Record<Cat, Tier[]> = {
  films: [
    {
      name: "Starter",
      tagline: "One short film, fast.",
      price: "₹85,000",
      delivery: "7 days",
    },
    {
      name: "Signature",
      tagline: "Most builders pick this.",
      price: "₹1,75,000",
      delivery: "10 days",
      featured: true,
    },
    {
      name: "Flagship",
      tagline: "Launch-grade campaign.",
      price: "₹3,50,000+",
      delivery: "14 days",
    },
  ],
  photography: [
    {
      name: "Starter",
      tagline: "Half-day, key spaces.",
      price: "₹45,000",
      delivery: "5 days",
    },
    {
      name: "Signature",
      tagline: "Full property look.",
      price: "₹85,000",
      delivery: "7 days",
      featured: true,
    },
    {
      name: "Flagship",
      tagline: "Editorial campaign.",
      price: "₹1,50,000+",
      delivery: "10 days",
    },
  ],
  tours: [
    {
      name: "Single Space",
      tagline: "One flat or suite.",
      price: "₹65,000",
      delivery: "10 days",
    },
    {
      name: "Tower / Property",
      tagline: "Up to 5 unit types.",
      price: "₹2,25,000",
      delivery: "14 days",
      featured: true,
    },
    {
      name: "Hospitality",
      tagline: "Hotels, resorts, restaurants.",
      price: "₹3,50,000+",
      delivery: "21 days",
    },
  ],
  websites: [
    {
      name: "Lead Site",
      tagline: "5-page conversion site.",
      price: "₹1,20,000",
      delivery: "14 days",
    },
    {
      name: "Brand Site",
      tagline: "Editorial + booking.",
      price: "₹2,50,000",
      delivery: "21 days",
      featured: true,
    },
    {
      name: "Flagship Site",
      tagline: "Full brand experience.",
      price: "₹5,00,000+",
      delivery: "30 days",
    },
  ],
};

const matrix: Record<
  Cat,
  { feature: string; values: [string, string, string] }[]
> = {
  films: [
    {
      feature: "Cut lengths",
      values: ["30s", "60s + 3 cutdowns", "90s + brand reel + 6 cutdowns"],
    },
    { feature: "Shoot length", values: ["Half day", "Full day", "Two days"] },
    {
      feature: "Locations",
      values: ["Single", "Single", "Multi-location"],
    },
    {
      feature: "Drone aerials",
      values: ["—", "Included", "Included"],
    },
    {
      feature: "Crew",
      values: ["Director + DOP", "Director + DOP + AC", "Full crew + grip"],
    },
    {
      feature: "Storyboard + script",
      values: ["—", "Optional", "Included"],
    },
    {
      feature: "Sound design",
      values: ["Library music", "Library + mix", "Custom + voiceover"],
    },
    {
      feature: "Vertical reel pack",
      values: ["—", "3 reels", "6 reels"],
    },
    {
      feature: "Raw footage release",
      values: ["—", "Add-on", "Add-on"],
    },
  ],
  photography: [
    { feature: "Edited stills", values: ["30", "60", "100+"] },
    { feature: "Shoot length", values: ["Half day", "Full day", "Two days"] },
    {
      feature: "Twilight shoot",
      values: ["—", "Included", "Included"],
    },
    {
      feature: "Talent / lifestyle",
      values: ["—", "—", "Included"],
    },
    {
      feature: "Hoarding plates",
      values: ["—", "—", "Included"],
    },
    {
      feature: "Print + web exports",
      values: ["Both", "Both", "Both"],
    },
    {
      feature: "Revisions",
      values: ["1 round", "2 rounds", "Unlimited"],
    },
    {
      feature: "RAW release",
      values: ["—", "Add-on", "Included"],
    },
  ],
  tours: [
    {
      feature: "Coverage",
      values: ["1 flat / suite", "5 unit types / 3 floors", "All public + 3 rooms"],
    },
    {
      feature: "Mobile-first scroll",
      values: ["✓", "✓", "✓"],
    },
    {
      feature: "Floorplans + hotspots",
      values: ["—", "Included", "Included"],
    },
    {
      feature: "Branded chapters",
      values: ["—", "—", "Included"],
    },
    {
      feature: "Analytics dashboard",
      values: ["Basic", "Basic", "Advanced"],
    },
    {
      feature: "VR-headset ready",
      values: ["—", "—", "Included"],
    },
    {
      feature: "Booking handoff",
      values: ["—", "Lead form", "Direct booking"],
    },
    {
      feature: "Revisions",
      values: ["1 round", "2 rounds", "Unlimited"],
    },
  ],
  websites: [
    { feature: "Pages", values: ["5", "Up to 10", "Unlimited"] },
    {
      feature: "CMS for self-edits",
      values: ["—", "✓", "✓"],
    },
    {
      feature: "Lead form + WhatsApp",
      values: ["✓", "✓", "✓"],
    },
    {
      feature: "Booking flow",
      values: ["—", "Included", "Custom IBE"],
    },
    {
      feature: "3D tour embed",
      values: ["—", "Optional", "Included"],
    },
    {
      feature: "Multi-language",
      values: ["—", "—", "Included"],
    },
    {
      feature: "SEO + analytics",
      values: ["Basic", "Standard", "Advanced + audit"],
    },
    {
      feature: "Hosting + maintenance",
      values: ["6 mo", "12 mo", "12 mo + a11y audit"],
    },
  ],
};

const addons = [
  { title: "Extra reel pack (10 verticals)", price: "₹35,000" },
  { title: "Twilight / blue-hour shoot", price: "₹25,000" },
  { title: "Drone aerial set", price: "₹20,000" },
  { title: "Rush delivery (50% time)", price: "+30%" },
  { title: "On-set styling + props", price: "₹18,000 / day" },
  { title: "Hindi voiceover + script", price: "₹12,000" },
];

const faqs = [
  {
    q: "Do you travel outside Jaipur?",
    a: "Yes. Travel + stay is billed at actuals. We've shot in Udaipur, Delhi NCR, Mumbai, Goa.",
  },
  {
    q: "How fast can you deliver?",
    a: "Most projects ship in 7–14 days. Rush delivery is +30%. Brief us early — we can plan around launch dates.",
  },
  {
    q: "What's the payment schedule?",
    a: "50% to lock dates, 25% on shoot day, 25% on final delivery. Bank transfer or UPI.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. Standard for unlaunched properties and restaurants. Send your template or use ours.",
  },
  {
    q: "Same team through the project?",
    a: "Yes. Same director, same editor, same colourist on your project end to end.",
  },
  {
    q: "Do you do social posting?",
    a: "We make the content. Posting + community management is handled by your team or a partner we recommend.",
  },
  {
    q: "Can we license raw footage?",
    a: "Yes. +25% of the project fee unlocks full raw + RAW stills release.",
  },
  {
    q: "What if I need just one quick reel?",
    a: "WhatsApp us. Single-day reel shoots from ₹30,000.",
  },
];

export function PricingExperience() {
  const [cat, setCat] = useState<Cat>("films");
  const [stuck, setStuck] = useState(false);
  const list = tiers[cat];
  const mtx = matrix[cat];

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <section className="relative bg-cream pt-28 md:pt-32 pb-14 md:pb-20 px-6 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <PageMeta
            index="04 / 05"
            label="Pricing"
            caption="GST inclusive · Mix services · 24h response"
          />
          <div className="mt-10 md:mt-14 grid grid-cols-12 gap-8 items-end">
            <Reveal as="div" className="col-span-12 md:col-span-7">
              <div className="flex items-baseline gap-3 md:gap-5 flex-wrap">
                <span
                  className="font-heading-italic text-gold whitespace-nowrap"
                  style={{ fontSize: "clamp(22px, 3vw, 40px)" }}
                >
                  Honest numbers.
                </span>
                <span
                  className="font-heading text-ink leading-[0.88]"
                  style={{ fontSize: "clamp(44px, 7.5vw, 112px)" }}
                >
                  No surprises.
                </span>
              </div>
              <p className="mt-7 font-body text-base md:text-lg text-ink/70 max-w-2xl leading-relaxed">
                Pick a service. See three tiers. Compare every line. All
                prices include GST. Mix services for a custom bundle.
              </p>
            </Reveal>

            <Reveal as="div" delay={140} className="col-span-12 md:col-span-5 md:pb-2">
              <div className="bg-navy text-cream rounded-2xl p-5 md:p-6 shadow-[0_30px_60px_-30px_color-mix(in_oklch,var(--color-navy)_70%,transparent)]">
                <p className="eyebrow text-gold mb-4">Not sure?</p>
                <p className="font-heading text-xl md:text-2xl leading-snug mb-5">
                  Tell us the room, the deadline, the budget. We&apos;ll send a
                  bundle quote in 24h.
                </p>
                <a
                  href={site.whatsappLink}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex items-center justify-between gap-3 w-full bg-gold text-ink px-4 py-3 rounded-full font-body text-sm hover:bg-cream transition-colors cursor-pointer"
                >
                  <span>WhatsApp for custom quote</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sticky top-16 md:top-20 z-30 bg-cream/90 backdrop-blur-md border-y border-line">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10 overflow-x-auto no-scrollbar">
          <ul className="flex gap-1 md:gap-2 py-2 min-w-max">
            {cats.map((c, i) => (
              <li key={c.slug}>
                <button
                  onClick={() => setCat(c.slug)}
                  className={`flex items-center gap-3 px-4 md:px-5 py-2.5 rounded-full font-body text-sm transition-colors cursor-pointer ${
                    cat === c.slug
                      ? "bg-ink text-cream"
                      : "text-ink/65 hover:text-ink hover:bg-mist/60"
                  }`}
                  aria-pressed={cat === c.slug}
                >
                  <span
                    className={`tabular-nums text-xs ${
                      cat === c.slug ? "text-gold" : "text-ink/40"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{c.label}</span>
                  <span
                    className={`text-xs ${
                      cat === c.slug ? "text-cream/65" : "text-ink/45"
                    }`}
                  >
                    from {c.from}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-10 py-12 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:items-stretch">
            {list.map((t) => (
              <article
                key={t.name}
                className={`group relative rounded-2xl p-6 md:p-8 flex flex-col transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  t.featured
                    ? "bg-navy text-cream md:-mt-4 md:mb-0 shadow-[0_30px_60px_-20px_color-mix(in_oklch,var(--color-navy)_55%,transparent)] hover:-translate-y-1"
                    : "bg-cream border border-line text-ink hover:-translate-y-1 hover:border-ink/45 hover:shadow-[0_24px_50px_-30px_color-mix(in_oklch,var(--color-ink)_45%,transparent)]"
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-6 bg-gold text-ink eyebrow px-3 py-1 rounded-full">
                    Most picked
                  </span>
                )}

                <div className="mb-6">
                  <p
                    className={`eyebrow mb-2 ${
                      t.featured ? "text-gold" : "text-ink/55"
                    }`}
                  >
                    {t.name}
                  </p>
                  <h3
                    className={`font-heading-italic text-xl md:text-2xl ${
                      t.featured ? "text-cream" : "text-ink"
                    }`}
                  >
                    {t.tagline}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className={`font-heading text-4xl md:text-5xl ${
                      t.featured ? "text-gold" : "text-ink"
                    }`}
                  >
                    {t.price}
                  </span>
                </div>
                <p
                  className={`font-body text-sm ${
                    t.featured ? "text-cream/65" : "text-ink/55"
                  }`}
                >
                  Delivery in {t.delivery}
                </p>

                <a
                  href={site.whatsappLink}
                  target="_blank"
                  rel="noopener"
                  className={`mt-auto pt-8 inline-flex items-center justify-between gap-3 font-body text-sm cursor-pointer ${
                    t.featured ? "text-gold" : "text-ink"
                  }`}
                >
                  <span className="relative">
                    {t.featured ? "Pick this tier" : `Start with ${t.name}`}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-0 right-0 -bottom-1 h-px scale-x-0 origin-right bg-current transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100"
                    />
                  </span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand px-6 md:px-10 py-16 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8 md:mb-12">
            <div>
              <p className="eyebrow text-gold mb-3">
                Full comparison · {cats.find((c) => c.slug === cat)?.label}
              </p>
              <h2
                className="font-heading leading-[0.98] text-ink"
                style={{ fontSize: "clamp(28px, 4.5vw, 52px)" }}
              >
                Every line, side by side.
              </h2>
            </div>
            <p className="font-body text-sm text-ink/55 max-w-xs">
              Switch the toggle above to compare other services.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-line bg-cream">
            <div className="hidden md:grid grid-cols-[1.4fr_repeat(3,1fr)] border-b border-line">
              <div className="p-5 eyebrow text-ink/55">Included</div>
              {list.map((t) => (
                <div
                  key={t.name}
                  className={`p-5 border-l border-line ${
                    t.featured ? "bg-navy text-cream" : "text-ink"
                  }`}
                >
                  <p
                    className={`eyebrow mb-1 ${
                      t.featured ? "text-gold" : "text-ink/55"
                    }`}
                  >
                    {t.name}
                  </p>
                  <p
                    className={`font-heading text-2xl ${
                      t.featured ? "text-gold" : "text-ink"
                    }`}
                  >
                    {t.price}
                  </p>
                </div>
              ))}
            </div>
            <div className="hidden md:block">
              {mtx.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-[1.4fr_repeat(3,1fr)] border-b border-line last:border-b-0 ${
                    i % 2 === 1 ? "bg-mist/40" : ""
                  }`}
                >
                  <div className="p-5 font-body text-sm text-ink/85">
                    {row.feature}
                  </div>
                  {row.values.map((v, vi) => {
                    const isFeatured = list[vi].featured;
                    const filled = v && v !== "—";
                    return (
                      <div
                        key={vi}
                        className={`p-5 font-body text-sm border-l border-line ${
                          isFeatured
                            ? "bg-navy/[0.04]"
                            : ""
                        } ${filled ? "text-ink" : "text-ink/35"}`}
                      >
                        {v}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="md:hidden divide-y divide-line">
              {mtx.map((row) => (
                <details key={row.feature} className="group">
                  <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none">
                    <p className="font-body text-sm text-ink/85">
                      {row.feature}
                    </p>
                    <span
                      aria-hidden
                      className="text-gold text-xl transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 grid grid-cols-3 gap-3">
                    {row.values.map((v, vi) => (
                      <div key={vi}>
                        <p className="eyebrow text-ink/45 mb-1">
                          {list[vi].name}
                        </p>
                        <p
                          className={`font-body text-sm ${
                            v && v !== "—" ? "text-ink" : "text-ink/35"
                          }`}
                        >
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy text-cream px-6 md:px-10 py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow text-gold mb-4">Add-ons</p>
            <h2
              className="font-heading leading-[0.98]"
              style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
            >
              Bolt-ons{" "}
              <em className="font-heading-italic text-gold">for any tier.</em>
            </h2>
            <p className="font-body text-cream/65 text-sm mt-5 max-w-xs">
              Slot any of these into your project quote. No surprise invoices.
            </p>
          </div>
          <ul className="col-span-12 md:col-span-8 divide-y divide-cream/15 border-y border-cream/15">
            {addons.map((a, i) => (
              <li
                key={a.title}
                className="group flex items-baseline justify-between gap-4 py-4 md:py-5 transition-colors hover:bg-cream/[0.03] -mx-2 px-2 rounded-md"
              >
                <span className="flex items-baseline gap-4">
                  <span className="eyebrow text-cream/35 tab-num text-[10px] w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body text-sm md:text-base text-cream/85 group-hover:text-cream transition-colors">
                    {a.title}
                  </span>
                </span>
                <span className="font-heading text-lg md:text-2xl text-gold whitespace-nowrap tab-num">
                  {a.price}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-10 py-20 md:py-28" id="faq">
        <div className="mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="eyebrow text-gold mb-4">FAQ</p>
            <h2
              className="font-heading leading-[0.98] text-ink"
              style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
            >
              Questions builders ask{" "}
              <em className="font-heading-italic text-gold">first.</em>
            </h2>
            <p className="font-body text-ink/65 text-sm mt-5 max-w-xs">
              Anything missing? WhatsApp us — we reply faster than email.
            </p>
            <a
              href={site.whatsappLink}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex items-center gap-2 bg-ink text-cream px-5 py-3 rounded-full font-body text-sm hover:bg-gold hover:text-ink transition-colors cursor-pointer"
            >
              WhatsApp us
            </a>
          </div>

          <div className="md:col-span-8">
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((f, i) => (
                <details key={i} className="group py-5">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <h3 className="font-heading text-lg md:text-2xl text-ink transition-colors group-hover:text-gold">
                      <span className="eyebrow tab-num text-[10px] text-ink/35 mr-3 align-middle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {f.q}
                    </h3>
                    <span
                      aria-hidden
                      className="font-heading text-2xl text-gold transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 font-body text-base text-ink/70 max-w-2xl leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand px-6 md:px-10 py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] text-center">
          <p className="eyebrow text-gold mb-4">Ready when you are</p>
          <h2
            className="font-heading leading-[0.98] text-ink max-w-4xl mx-auto"
            style={{ fontSize: "clamp(36px, 6vw, 88px)" }}
          >
            Talk today.{" "}
            <em className="font-heading-italic text-gold">Shoot next week.</em>
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={site.whatsappLink}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-3 bg-ink text-cream px-7 py-4 rounded-full font-body text-sm hover:bg-gold hover:text-ink transition-colors cursor-pointer"
            >
              <span>WhatsApp us now</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href={`tel:${site.phoneRaw}`}
              className="group inline-flex items-center gap-3 border border-ink/25 text-ink px-7 py-4 rounded-full font-body text-sm hover:bg-ink hover:text-cream hover:border-ink transition-colors cursor-pointer"
            >
              <span>Call {site.phone}</span>
              <span
                aria-hidden
                className="inline-block opacity-0 -translate-x-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-x-0"
              >
                →
              </span>
            </a>
            <Link
              href="/#contact"
              className="link-underline inline-flex items-center gap-2 text-ink/70 px-3 py-4 font-body text-sm hover:text-gold transition-colors cursor-pointer"
            >
              Send a brief
            </Link>
          </div>
        </div>
      </section>

      <div
        className={`fixed left-0 right-0 bottom-0 z-40 md:hidden transition-transform duration-300 ${
          stuck ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-3 mb-3 bg-ink/95 text-cream backdrop-blur-md rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)]">
          <div className="min-w-0">
            <p className="eyebrow text-gold mb-0.5">
              {cats.find((c) => c.slug === cat)?.label}
            </p>
            <p className="font-body text-sm text-cream truncate">
              from{" "}
              {tiers[cat].find((t) => t.featured)?.price ??
                tiers[cat][0].price}{" "}
              · {tiers[cat].find((t) => t.featured)?.delivery ?? "—"}
            </p>
          </div>
          <a
            href={site.whatsappLink}
            target="_blank"
            rel="noopener"
            className="shrink-0 bg-gold text-ink px-4 py-2.5 rounded-full font-body text-sm cursor-pointer"
          >
            Get quote
          </a>
        </div>
      </div>
    </>
  );
}
