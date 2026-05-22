import type { Metadata } from "next";
import { ServicesExperience } from "./ServicesExperience";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Services — Nirman Media",
  description:
    "Brand films, photography, 3D scrolly tours, and websites. Pricing, delivery times, and what's included.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesExperience />
      <CTA />
    </>
  );
}
