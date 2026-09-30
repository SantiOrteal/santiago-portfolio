import { useReveal } from "../hooks/useReveal";
import { useSpotlight } from "../hooks/usePointer";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionHeader from "./SectionHeader";
import profilePic from "../assets/profile.jpg";

export default function About() {
  const textRef = useReveal();
  const cardRevealRef = useReveal();
  const spotRef = useSpotlight();
  const { language } = useLanguage();
  const { about } = getContent(language);

  return (
    <section
      id="about"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="01" label={about.label} />

        <div ref={textRef} className="reveal-stagger mt-10 max-w-4xl space-y-6">
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

        <div
          ref={cardRevealRef}
          className="reveal-stagger mt-16 grid items-start gap-10 border-t border-border-soft pt-10 md:grid-cols-[180px_minmax(0,520px)] md:gap-14"
        >
          <div style={{ "--i": 0 }} className="flex justify-center md:justify-start">
            <div className="group relative w-full max-w-36 md:max-w-44">
              {/* gradient ring that lights up on hover */}
              <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-blue via-violet to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative overflow-hidden rounded-xl bg-bg">
                <img
                  src={profilePic}
                  alt="Profile picture"
                  className="w-full object-cover grayscale-[35%] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
            </div>
          </div>

          <div style={{ "--i": 1 }} className="md:mt-1">
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
        </div>
      </div>
    </section>
  );
}
