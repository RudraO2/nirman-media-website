import Link from "next/link";

// Cross-promo strip shown at the foot of every tool (AD-3/AD-8). Surfaces
// Nirman's services to the property-intent traffic the tools attract. Static
// for now; Phase 2 can point these at the CRM/LMS + broker products.

export function CrossPromo() {
  return (
    <section className="border-t border-line bg-cream-warm px-6 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-[1280px]">
        <p className="eyebrow text-gold mb-4">From Nirman Media</p>
        <h2
          className="font-heading text-ink leading-[1.02] max-w-2xl"
          style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
        >
          Selling a property? We make the media that sells it faster.
        </h2>
        <p className="font-body text-ink/70 mt-4 max-w-xl">
          Cinematic property films, magazine-grade stills, and 3D scrollytelling
          tours for builders and brokers across Jaipur & Rajasthan.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/industries/real-estate"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-cream transition-colors hover:bg-gold hover:text-ink"
          >
            <span className="font-body text-sm font-medium">
              Real estate media
            </span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-ink transition-colors hover:border-gold hover:text-gold"
          >
            <span className="font-body text-sm font-medium">See pricing</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
