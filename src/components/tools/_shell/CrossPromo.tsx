import Link from "next/link";

// Cross-promo strip shown at the foot of every tool (AD-3/AD-8). Surfaces
// Nirman's services to the property-intent traffic the tools attract. Static
// for now; Phase 2 can point these at the CRM/LMS + broker products.

export function CrossPromo() {
  return (
    <section className="border-t border-zinc-200 bg-zinc-50 px-5 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-body text-xs font-medium tracking-wide text-emerald-600 uppercase">
          From Nirman Media
        </p>
        <h2 className="font-body mt-2 max-w-2xl text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
          Selling a property? We make the media that sells it faster.
        </h2>
        <p className="font-body mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
          Cinematic property films, magazine-grade stills, and 3D scrollytelling
          tours for builders and brokers across Jaipur & Rajasthan.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/industries/real-estate"
            className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-white transition-colors duration-200 hover:bg-emerald-600"
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
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-zinc-900 transition-colors duration-200 hover:border-emerald-500 hover:text-emerald-700"
          >
            <span className="font-body text-sm font-medium">See pricing</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
