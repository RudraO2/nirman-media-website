import type { Metadata } from "next";
import { WorkScrolly } from "./WorkScrolly";

export const metadata: Metadata = {
  alternates: { canonical: "/work/" },
  title: "Work — Nirman Media",
  description: "Selected films, photography, 3D tours, and websites — hotels, resorts, restaurants, gyms, and real estate.",
};

export default function WorkPage() {
  return <WorkScrolly />;
}
