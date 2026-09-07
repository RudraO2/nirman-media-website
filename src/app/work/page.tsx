import type { Metadata } from "next";
import { WorkScrolly } from "./WorkScrolly";
import { SITE_URL } from "@/lib/site";

const TITLE = "Work — Nirman Media";
const DESCRIPTION =
  "Selected films, photography, 3D tours, and websites — hotels, resorts, restaurants, gyms, and real estate.";

export const metadata: Metadata = {
  alternates: { canonical: "/work/" },
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
    { "@type": "ListItem", position: 2, name: "Work", item: `${BASE}/work/` },
  ],
};

export default function WorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <WorkScrolly />
    </>
  );
}
