import type { Metadata } from "next";
import { PricingExperience } from "./PricingExperience";

export const metadata: Metadata = {
  title: "Pricing — Nirman Media",
  description:
    "Transparent pricing for brand films, photography, 3D tours and websites. Starts from ₹45,000. Delivery in 5–14 days.",
};

export default function PricingPage() {
  return <PricingExperience />;
}
