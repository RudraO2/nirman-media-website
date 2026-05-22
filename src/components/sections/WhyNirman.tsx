import { ScrollFillText } from "@/components/animation/ScrollFillText";
import { trustStats } from "@/lib/site";

const reasons = [
  {
    title: "Premium finish, every time.",
    body: "Every frame held to a magazine-grade standard. No shortcuts, no filler — same standard for a 1 BHK flat as for a 5-star suite.",
  },
  {
    title: "Same-week delivery.",
    body: "Tight deadlines, launches, season campaigns. Most projects ship in 7 days. We don't ghost.",
  },
  {
    title: "One studio, every format.",
    body: "Films, photos, reels, 3D tours, websites. One team. One look. Hoarding to Instagram — same file, every aspect ratio.",
  },
];

export function WhyNirman() {
  return (
    <section className="bg-cream py-24 md:py-32 px-6 md:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="eyebrow text-gold mb-5">Why Nirman</p>
            <h2
              className="font-heading leading-[0.98] text-ink"
              style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
            >
              Built for{" "}
              <em className="font-heading-italic text-gold">brands.</em>
            </h2>

            <dl className="mt-10 grid grid-cols-2 gap-4 md:gap-6 max-w-md">
              {trustStats.map((s) => (
                <div
                  key={s.label}
                  className="border-t border-line pt-3"
                >
                  <dt className="font-heading text-2xl md:text-3xl text-ink">
                    {s.value}
                  </dt>
                  <dd className="font-body text-xs md:text-sm text-ink/55 mt-1">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-7 space-y-10 md:space-y-12">
            {reasons.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 md:gap-6 items-start border-t border-line pt-7"
              >
                <span className="col-span-2 md:col-span-1 eyebrow text-ink/45">
                  0{i + 1}
                </span>
                <div className="col-span-10 md:col-span-11">
                  <h3 className="font-heading text-2xl md:text-3xl text-ink mb-3">
                    {r.title}
                  </h3>
                  {i === 1 ? (
                    <ScrollFillText
                      className="font-body text-base md:text-lg text-ink/85 leading-relaxed max-w-2xl"
                      baseAlpha={0.45}
                    >
                      {r.body}
                    </ScrollFillText>
                  ) : (
                    <p className="font-body text-base md:text-lg text-ink/75 leading-relaxed max-w-2xl">
                      {r.body}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
