"use client";
import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { Reveal } from "@/components/animation/Reveal";

export function CTA() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  return (
    <section
      id="contact"
      className="relative bg-navy text-cream py-24 md:py-32 px-6 md:px-10 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(60% 60% at 18% 30%, rgba(200,161,75,0.35), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        <Reveal as="div" className="md:col-span-6">
          <p className="eyebrow text-gold mb-5">Book a shoot</p>
          <h2
            className="font-heading leading-[0.98]"
            style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
          >
            Your next launch{" "}
            <em className="font-heading-italic text-gold">deserves</em> this.
          </h2>
          <p className="font-body text-cream/75 max-w-md mt-6 text-base md:text-lg">
            One quick form. We reply in 24 hours with a quote and a sample reel
            from your category.
          </p>

          <div className="mt-9 space-y-3">
            <a
              href={site.whatsappLink}
              target="_blank"
              rel="noopener"
              className="group flex items-center justify-between gap-4 bg-gold text-ink px-6 py-4 rounded-full hover:bg-cream transition-colors cursor-pointer"
            >
              <span className="font-body text-sm font-medium">
                WhatsApp us now
              </span>
              <span
                aria-hidden
                className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href={`tel:${site.phoneRaw}`}
              className="group flex items-center justify-between gap-4 border border-cream/25 px-6 py-4 rounded-full hover:border-gold hover:text-gold transition-colors cursor-pointer"
            >
              <span className="font-body text-sm font-medium tab-num">
                Call {site.phone}
              </span>
              <span
                aria-hidden
                className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <Link
              href="/pricing"
              className="group flex items-center justify-between gap-4 text-cream/85 px-6 py-3 rounded-full hover:text-gold transition-colors cursor-pointer"
            >
              <span className="font-body text-sm">See pricing first</span>
              <span
                aria-hidden
                className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 max-w-md font-body text-sm">
            <div>
              <p className="eyebrow text-cream/45 mb-1">Address</p>
              <p className="text-cream/85">{site.address}</p>
            </div>
            <div>
              <p className="eyebrow text-cream/45 mb-1">Hours</p>
              <p className="text-cream/85">{site.hours}</p>
            </div>
          </div>
        </Reveal>

        <Reveal as="div" delay={120} className="md:col-span-6">
          <form
            className="bg-cream/[0.05] border border-cream/15 rounded-2xl p-6 md:p-9 backdrop-blur-sm"
            onSubmit={(e) => {
              e.preventDefault();
              setSending(true);
              setTimeout(() => {
                setSending(false);
                setSent(true);
              }, 700);
            }}
          >
            <p className="eyebrow text-gold mb-6">Request a quote</p>

            {sent ? (
              <div className="py-12 text-center">
                <p className="font-heading-italic text-3xl md:text-4xl text-gold mb-3">
                  Thank you.
                </p>
                <p className="font-body text-cream/75">
                  We&apos;ll reach out within 24 hours.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <Field label="Your name" name="name" required />
                <Field
                  label="Phone (WhatsApp)"
                  name="phone"
                  type="tel"
                  required
                />
                <Field label="Brand name & location" name="project" />
                <Select
                  label="Industry"
                  name="industry"
                  options={[
                    "Real Estate",
                    "Hotel",
                    "Resort",
                    "Restaurant",
                    "Gym / Fitness",
                    "Other",
                  ]}
                />
                <Select
                  label="What do you need?"
                  name="type"
                  options={[
                    "Brand Film",
                    "Photography",
                    "3D Scrolly Tour",
                    "Website",
                    "Reel Pack",
                    "All of the above",
                  ]}
                />
                <Select
                  label="Budget range"
                  name="budget"
                  options={[
                    "Under ₹50,000",
                    "₹50,000 – ₹1,00,000",
                    "₹1,00,000 – ₹3,00,000",
                    "₹3,00,000+",
                    "Not sure yet",
                  ]}
                />

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gold text-ink font-body text-sm font-medium py-4 rounded-full hover:bg-cream transition-colors disabled:opacity-60 cursor-pointer mt-2"
                >
                  {sending ? "Sending…" : "Send request"}
                </button>
                <p className="font-body text-xs text-cream/55 text-center">
                  Reply in 24 hours · No spam · No commitment
                </p>
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="font-body text-xs text-cream/70 mb-2 block"
      >
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        className="w-full bg-transparent border-b border-cream/30 py-3 focus:outline-none focus:border-gold font-body text-cream placeholder:text-cream/30"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="font-body text-xs text-cream/70 mb-2 block"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        className="w-full bg-transparent border-b border-cream/30 py-3 focus:outline-none focus:border-gold font-body text-cream"
      >
        {options.map((opt) => (
          <option key={opt} className="text-ink">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
