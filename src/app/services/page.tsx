import type { Metadata } from "next";
import { ServicesExperience } from "./ServicesExperience";
import { CTA } from "@/components/sections/CTA";
import { SITE_URL } from "@/lib/site";

const TITLE = "Services — Nirman Media";
const DESCRIPTION =
  "Brand films, photography, 3D scrolly tours, and websites. Pricing, delivery times, and what's included.";

export const metadata: Metadata = {
  alternates: { canonical: "/services/" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/hero/hero-poster.jpg", width: 1280, height: 720 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const BASE = SITE_URL;
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
    { "@type": "ListItem", position: 2, name: "Services", item: `${BASE}/services/` },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ServicesExperience />
      <CTA />
    </>
  );
}
