import { useReveal } from "../hooks/useReveal";
import { experience } from "../data/content";
import SectionLabel from "./SectionLabel";

function ExperienceItem({ item, isLast }) {
  const revealRef = useReveal();
  return (
    <div ref={revealRef} className="reveal relative pl-10 md:pl-12">
      {!isLast && (
        <span className="absolute left-[7px] top-4 h-full w-px bg-border md:left-[9px]" />
      )}
      <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-blue bg-bg md:h-4.5 md:w-4.5" />

      <div className="pb-14 last:pb-0">
        <span className="font-mono text-[12px] tracking-wide text-ink-dim">
          {item.period}
        </span>
        <h3 className="mt-2 font-display text-xl font-medium text-ink md:text-2xl">
          {item.role}
        </h3>
        <p className="mt-1 font-mono text-[13px] text-blue-soft">
          {item.org}
        </p>
        <ul className="mt-4 max-w-2xl space-y-2.5">
          {item.points.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 text-[14.5px] leading-relaxed text-ink-muted"
            >
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink-dim" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel>Experiencia</SectionLabel>

        <h2 className="text-balance mt-6 max-w-2xl font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
          De los primeros pasos en React a sostener operaciones reales.
        </h2>

        <div className="mt-14 max-w-3xl">
          {experience.map((item, i) => (
            <ExperienceItem
              key={item.period}
              item={item}
              isLast={i === experience.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
