import type { Metadata } from "next";
import { PricingExperience } from "./PricingExperience";
import { SITE_URL } from "@/lib/site";

const TITLE = "Pricing — Nirman Media";
const DESCRIPTION =
  "Transparent pricing for brand films, photography, 3D tours and websites. Starts from ₹45,000. Delivery in 5–14 days.";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing/" },
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
    { "@type": "ListItem", position: 2, name: "Pricing", item: `${BASE}/pricing/` },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PricingExperience />
    </>
  );
}
