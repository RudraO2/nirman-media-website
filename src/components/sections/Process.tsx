import { ScrollFillText } from "@/components/animation/ScrollFillText";

const steps = [
  {
    no: "01",
    title: "Brief",
    timing: "30 min call",
    body: "Tell us the brand, the room, the audience, the deadline. We listen, take notes, send a quote.",
  },
  {
    no: "02",
    title: "Shoot",
    timing: "1–2 days on site",
    body: "On your floor — flat, suite, kitchen, gym. Camera, drone, light. Every frame planned in advance.",
  },
  {
    no: "03",
    title: "Craft",
    timing: "3–4 days editing",
    body: "Colour, grade, finish. Magazine-grade output. Sound design + reels cut for every aspect ratio.",
  },
  {
    no: "04",
    title: "Deliver",
    timing: "Final files",
    body: "Web, print, reels, all aspect ratios. Drive folder you can hand to anyone, anytime.",
  },
];

export function Process() {
  return (
    <section className="bg-navy text-cream py-24 md:py-32 px-6 md:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end mb-14 md:mb-20">
          <div className="md:col-span-7">
            <p className="eyebrow text-gold mb-5">The process</p>
            <ScrollFillText
              className="font-heading leading-[0.98] text-cream max-w-[18ch]"
              baseAlpha={0.32}
            >
              {"Simple to start. Cinematic to finish."}
            </ScrollFillText>
          </div>
          <p className="md:col-span-5 font-body text-cream/70 text-base md:text-lg">
            Most projects ship in 7 days. We move fast because we plan twice and
            shoot once.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-cream/10 rounded-2xl overflow-hidden">
          {steps.map((s) => (
            <div
              key={s.no}
              className="bg-navy p-7 md:p-8 flex flex-col gap-4"
            >
              <div className="flex items-baseline justify-between">
                <p className="eyebrow text-gold">{s.no}</p>
                <p className="font-body text-[11px] text-cream/55">
                  {s.timing}
                </p>
              </div>
              <h3 className="font-heading text-3xl md:text-4xl text-cream">
                {s.title}
              </h3>
              <p className="font-body text-cream/70 leading-relaxed text-sm md:text-base">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
