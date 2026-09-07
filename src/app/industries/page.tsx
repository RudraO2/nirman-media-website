import type { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";
import { IndustriesDirectory } from "./IndustriesDirectory";
import { SITE_URL } from "@/lib/site";

const TITLE = "Industries — Nirman Media";
const DESCRIPTION =
  "Films, photos, 3D tours, and websites for real estate, hotels, resorts, restaurants, and gyms.";

export const metadata: Metadata = {
  alternates: { canonical: "/industries/" },
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
    { "@type": "ListItem", position: 2, name: "Industries", item: `${BASE}/industries/` },
  ],
};

export default function IndustriesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <IndustriesDirectory />
      <CTA />
    </>
  );
}
