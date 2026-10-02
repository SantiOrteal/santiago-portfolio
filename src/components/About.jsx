import { useReveal } from "../hooks/useReveal";
import { useSpotlight } from "../hooks/usePointer";
import { useCountUp } from "../hooks/useCountUp";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionHeader from "./SectionHeader";

function Stat({ value, suffix = "", label }) {
  const [ref, current] = useCountUp(value);
  return (
    <div ref={ref} className="px-4 py-5 first:pl-0 last:pr-0">
      <div className="font-display text-3xl font-semibold tabular-nums text-ink md:text-4xl">
        {current}
        <span className="text-gradient">{suffix}</span>
      </div>
      <p className="mt-1.5 font-mono text-[11px] leading-snug text-ink-dim">
        {label}
      </p>
    </div>
  );
}

export default function About() {
  const textRef = useReveal();
  const asideRef = useReveal();
  const spotRef = useSpotlight();
  const { language } = useLanguage();
  const { about, skills, homelab } = getContent(language);

  // Numbers come straight from the content so they never drift out of date.
  const years = new Date().getFullYear() - 2019;
  const techCount = new Set(skills.items.flatMap((item) => item.tech)).size;
  const serviceCount = homelab.groups.reduce((n, g) => n + g.services.length, 0);

  return (
    <section
      id="about"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="01" label={about.label} />

        <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div ref={textRef} className="reveal-stagger space-y-6">
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                style={{ "--i": i }}
                className={
                  i === 0
                    ? "text-balance text-xl leading-relaxed text-ink md:text-2xl"
                    : "max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-base"
                }
              >
                {p}
              </p>
            ))}
          </div>

          <aside
            ref={asideRef}
            className="reveal-stagger self-start lg:sticky lg:top-28"
          >
            <div style={{ "--i": 0 }}>
              <div
                ref={spotRef}
                className="spotlight rounded-lg border border-border bg-surface p-6"
              >
                <div className="mb-5 flex items-center gap-2 border-b border-border-soft pb-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3a4152]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3a4152]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-dim" />
                  <span className="ml-2 font-mono text-[11px] text-ink-dim">
                    ~ $ {about.card.label}
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-mint">
                    <span className="status-dot h-1.5 w-1.5 rounded-full bg-mint" />
                    online
                  </span>
                </div>
                <dl className="space-y-3.5">
                  {about.card.lines.map((line) => (
                    <div
                      key={line.k}
                      className="group flex items-baseline justify-between gap-4 font-mono text-[13px]"
                    >
                      <dt className="text-ink-dim transition-colors duration-300 group-hover:text-ink-muted">
                        {line.k}
                      </dt>
                      <span className="mb-1 flex-1 border-b border-dashed border-border-soft" />
                      <dd className="text-right text-blue-soft transition-colors duration-300 group-hover:text-ink">
                        {line.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div
              style={{ "--i": 1 }}
              className="mt-5 grid grid-cols-3 divide-x divide-border-soft border-y border-border-soft"
            >
              <Stat value={years} suffix="+" label={about.stats.years} />
              <Stat value={techCount} label={about.stats.tech} />
              <Stat value={serviceCount} label={about.stats.services} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
