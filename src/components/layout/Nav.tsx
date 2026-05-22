"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoLockup } from "@/components/ui/Logo";
import { nav, site } from "@/lib/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-[background-color,backdrop-filter,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "bg-cream/82 backdrop-blur-md shadow-[0_1px_0_color-mix(in_oklch,var(--color-ink)_8%,transparent)]"
            : "bg-transparent"
        }`}
      >
        <div
          className={`mx-auto max-w-[1280px] flex items-center justify-between px-5 md:px-10 transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled ? "h-14 md:h-16" : "h-16 md:h-20"
          }`}
        >
          <LogoLockup />

          <nav
            className="hidden md:flex items-center gap-0.5"
            aria-label="Primary"
          >
            {nav.map((n) => {
              const active = isActive(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`group relative font-body text-[13px] tracking-[0.05em] px-3.5 py-2 transition-colors ${
                    active ? "text-ink" : "text-ink/65 hover:text-ink"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="relative inline-block">
                    {n.label}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute -bottom-1 left-0 right-0 h-px origin-right scale-x-0 transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100 ${
                        active ? "bg-gold scale-x-100 origin-left" : "bg-current"
                      }`}
                    />
                  </span>
                </Link>
              );
            })}
            <Link
              href="/#contact"
              className="ml-3 group inline-flex items-center gap-2 font-body text-[13px] tracking-[0.05em] bg-ink text-cream pl-5 pr-4 py-2.5 rounded-full hover:bg-gold hover:text-ink transition-colors"
            >
              <span>Get a Quote</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </nav>

          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden inline-flex flex-col items-center justify-center gap-[5px] p-3 -mr-2 cursor-pointer"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`block h-[1.5px] w-6 bg-ink transition-transform duration-300 ${
                open ? "translate-y-[6.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-6 bg-ink transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-6 bg-ink transition-transform duration-300 ${
                open ? "-translate-y-[6.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <div
        className={`md:hidden fixed inset-0 z-30 bg-cream transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="pt-24 px-6 pb-10 h-full flex flex-col">
          <p className="eyebrow text-ink/40 mb-3">Menu</p>
          <nav className="flex flex-col" aria-label="Mobile">
            {nav.map((n, i) => {
              const active = isActive(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline justify-between gap-4 py-4 border-b border-line/60"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="eyebrow text-gold tab-num text-[10px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-heading text-[34px] leading-none text-ink">
                      {n.label}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`font-heading text-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 ${
                      active ? "text-gold" : "text-ink/30 group-hover:text-gold"
                    }`}
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3 pt-8">
            <a
              href={site.whatsappLink}
              target="_blank"
              rel="noopener"
              className="group flex items-center justify-between gap-3 bg-ink text-cream px-5 py-4 rounded-full font-body text-sm"
              onClick={() => setOpen(false)}
            >
              <span>WhatsApp us</span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href={`tel:${site.phoneRaw}`}
              className="group flex items-center justify-between gap-3 border border-ink/20 px-5 py-4 rounded-full font-body text-sm"
              onClick={() => setOpen(false)}
            >
              <span>Call {site.phone}</span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
