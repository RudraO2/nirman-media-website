import Link from "next/link";
import { LogoLockup } from "@/components/ui/Logo";
import { site, nav } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-navy text-cream pt-20 md:pt-28 pb-10 px-6 md:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10">
          <div className="md:col-span-5">
            <p className="eyebrow text-cream/55 mb-5">Get in touch</p>
            <h2 className="font-heading text-4xl md:text-5xl leading-[1.05] text-cream max-w-md">
              Premium brands{" "}
              <em className="font-heading-italic text-gold">deserve</em> premium
              media.
            </h2>
            <p className="font-body text-cream/65 max-w-md mt-5">
              Reply in 24 hours with a quote and a sample reel from your
              category.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={site.whatsappLink}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-3 bg-gold text-ink px-6 py-3.5 rounded-full font-body text-sm hover:bg-cream transition-colors"
              >
                <span>WhatsApp us</span>
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <a
                href={`tel:${site.phoneRaw}`}
                className="group inline-flex items-center gap-3 border border-cream/30 text-cream px-6 py-3.5 rounded-full font-body text-sm hover:border-gold hover:text-gold transition-colors"
              >
                <span>Call us</span>
                <span
                  aria-hidden
                  className="inline-block opacity-0 -translate-x-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-x-0"
                >
                  →
                </span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="eyebrow text-cream/55 mb-5">Explore</p>
            <ul className="space-y-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="link-underline font-body text-cream/85 hover:text-gold transition-colors"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-cream/55 mb-5">Reach us</p>
            <ul className="space-y-3 text-cream/85">
              <li>
                <a
                  href={`tel:${site.phoneRaw}`}
                  className="link-underline hover:text-gold transition-colors font-body tab-num"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline hover:text-gold transition-colors font-body break-all"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener"
                  className="link-underline hover:text-gold transition-colors font-body"
                >
                  Instagram
                </a>
              </li>
              <li className="text-cream/65 text-sm font-body pt-1">
                {site.address}
              </li>
              <li className="text-cream/55 text-xs font-body">{site.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 md:mt-20 pt-6 border-t border-cream/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <LogoLockup tone="cream" />
          <p className="text-xs text-cream/55 font-body">
            © {new Date().getFullYear()} Nirman Media. Built in Jaipur.
          </p>
        </div>
      </div>
    </footer>
  );
}
