import type { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";
import { IndustriesDirectory } from "./IndustriesDirectory";

export const metadata: Metadata = {
  title: "Industries — Nirman Media",
  description:
    "Films, photos, 3D tours, and websites for real estate, hotels, resorts, restaurants, and gyms.",
};

export default function IndustriesIndex() {
  return (
    <>
      <IndustriesDirectory />
      <CTA />
    </>
  );
}
