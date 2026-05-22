import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { WhatsAppFAB } from "@/components/ui/WhatsAppFAB";
import { SiteLoader } from "@/components/opener/SiteLoader";

const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading-src",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body-src",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nirman Media — Premium Films, Photography, 3D Tours & Websites",
  description:
    "Jaipur-based media studio for brands that live by first impressions. Films, photography, 3D scrollytelling tours, and websites for real estate, hotels, resorts, restaurants, and gyms.",
  metadataBase: new URL("https://nirman.media"),
  openGraph: {
    title: "Nirman Media — Premium Brand Media",
    description:
      "Make them stop. Make them feel. Make them book. Films, photos, 3D tours and sites for hotels, resorts, restaurants, gyms, real estate.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable}`}
    >
      <body className="bg-cream text-ink">
        <link
          rel="preload"
          as="image"
          href="/hero/hero-poster.jpg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="video"
          href="/hero/hero-scrub.mp4"
          type="video/mp4"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Nirman Media",
              description:
                "Media studio in Jaipur — films, photography, 3D scrollytelling tours and websites for real estate, hotels, resorts, restaurants and gyms.",
              url: "https://nirman.media",
              areaServed: { "@type": "City", name: "Jaipur" },
              address: { "@type": "PostalAddress", addressLocality: "Jaipur", addressCountry: "IN" },
              priceRange: "$$$",
              serviceType: [
                "Brand Film Production",
                "Commercial Photography",
                "3D Scrollytelling Tours",
                "Website Design",
                "Hospitality Media",
                "Real Estate Media",
                "Restaurant Media",
                "Gym & Fitness Media",
              ],
            }),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-ink focus:text-cream focus:px-4 focus:py-2 focus:rounded-md"
        >
          Skip to content
        </a>
        <SiteLoader />
        <ScrollProgress />
        <SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
        <WhatsAppFAB />
      </body>
    </html>
  );
}
