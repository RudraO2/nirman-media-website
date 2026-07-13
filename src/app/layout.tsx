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
  alternates: { canonical: "/" },
  keywords: [
    "real estate videography Jaipur",
    "hotel photography Jaipur",
    "3D virtual tour real estate",
    "restaurant photography Jaipur",
    "brand film production Jaipur",
    "property video shoot",
  ],
  openGraph: {
    title: "Nirman Media — Premium Brand Media",
    description:
      "Make them stop. Make them feel. Make them book. Films, photos, 3D tours and sites for hotels, resorts, restaurants, gyms, real estate.",
    type: "website",
    locale: "en_IN",
    siteName: "Nirman Media",
    images: [{ url: "/hero/hero-poster.jpg", width: 1280, height: 720 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nirman Media — Premium Brand Media",
    description:
      "Films, photography, 3D scrollytelling tours and websites for spaces that need to sell. Jaipur, India.",
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
        {/* Scrub video is desktop-only; media query keeps phones from
            downloading it. */}
        <link
          rel="preload"
          as="video"
          href="/hero/hero-scrub.mp4"
          type="video/mp4"
          media="(min-width: 768px)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://nirman.media/#org",
                  name: "Nirman Media",
                  alternateName: "Nirman Media Jaipur",
                  url: "https://nirman.media",
                  email: "hello@nirman.media",
                  telephone: "+91 99999 99999",
                  sameAs: ["https://instagram.com/nirman.media"],
                  foundingDate: "2021",
                  slogan: "Make them stop. Make them feel. Make them book.",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://nirman.media/#website",
                  url: "https://nirman.media",
                  name: "Nirman Media",
                  publisher: { "@id": "https://nirman.media/#org" },
                  inLanguage: "en-IN",
                },
                {
                  "@type": "ProfessionalService",
                  "@id": "https://nirman.media/#service",
                  name: "Nirman Media",
                  description:
                    "Media studio in Jaipur — cinematic brand films, commercial photography, 3D scrollytelling tours and websites for real estate, hotels, resorts, restaurants and gyms. Most projects delivered in 7 days.",
                  url: "https://nirman.media",
                  parentOrganization: { "@id": "https://nirman.media/#org" },
                  areaServed: [
                    { "@type": "City", name: "Jaipur" },
                    { "@type": "State", name: "Rajasthan" },
                    { "@type": "Country", name: "India" },
                  ],
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Jaipur",
                    addressRegion: "Rajasthan",
                    addressCountry: "IN",
                  },
                  priceRange: "₹₹₹",
                  openingHours: "Mo-Sa 10:00-20:00",
                  knowsAbout: [
                    "Real estate videography",
                    "Hotel photography",
                    "3D virtual tours",
                    "Restaurant photography",
                    "Drone videography",
                    "Brand websites",
                  ],
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Services",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: { "@type": "Service", name: "Brand Films" },
                        priceSpecification: {
                          "@type": "PriceSpecification",
                          price: 85000,
                          priceCurrency: "INR",
                          description: "Starting price",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: { "@type": "Service", name: "Commercial Photography" },
                        priceSpecification: {
                          "@type": "PriceSpecification",
                          price: 45000,
                          priceCurrency: "INR",
                          description: "Starting price",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: { "@type": "Service", name: "3D Scrollytelling Tours" },
                        priceSpecification: {
                          "@type": "PriceSpecification",
                          price: 65000,
                          priceCurrency: "INR",
                          description: "Starting price",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: { "@type": "Service", name: "Brand Websites" },
                        priceSpecification: {
                          "@type": "PriceSpecification",
                          price: 120000,
                          priceCurrency: "INR",
                          description: "Starting price",
                        },
                      },
                    ],
                  },
                },
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
