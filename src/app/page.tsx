import { HeroParallax } from "@/components/hero/HeroParallax";
import { Services } from "@/components/sections/Services";
import { Industries } from "@/components/sections/Industries";
import { Featured } from "@/components/sections/Featured";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { TourTeaser } from "@/components/sections/TourTeaser";
import { Process } from "@/components/sections/Process";
import { WhyNirman } from "@/components/sections/WhyNirman";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <HeroParallax />
      <Services />
      <Industries />
      <Featured />
      <BeforeAfter />
      <TourTeaser />
      <Process />
      <WhyNirman />
      <CTA />
    </>
  );
}
