import { useReveal } from "../hooks/useReveal";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionLabel from "./SectionLabel";
import avatarAbstract from "../assets/avatar-abstract.svg";

export default function About() {
  const revealRef = useReveal();
  const { language } = useLanguage();
  const { about } = getContent(language);

  return (
    <section
      id="about"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel>{about.label}</SectionLabel>

        <div
          ref={revealRef}
          className="reveal mt-10 grid grid-cols-1 gap-14 md:grid-cols-[1.3fr_1fr] md:gap-16"
        >
          <div className="space-y-6">
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
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

          <div className="space-y-5">
            <img
              src={avatarAbstract}
              alt="Abstract geometric profile illustration"
              className="w-full rounded-xl border border-border object-cover"
            />
            <div className="rounded-lg border border-border bg-surface p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-border-soft pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3a4152]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3a4152]" />
              <span className="h-2.5 w-2.5 rounded-full bg-blue-dim" />
              <span className="ml-2 font-mono text-[11px] text-ink-dim">
                {about.card.label}
              </span>
            </div>
            <dl className="space-y-3.5">
              {about.card.lines.map((line) => (
                <div
                  key={line.k}
                  className="flex items-baseline justify-between gap-4 font-mono text-[13px]"
                >
                  <dt className="text-ink-dim">{line.k}</dt>
                  <dd className="text-right text-blue-soft">{line.v}</dd>
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
