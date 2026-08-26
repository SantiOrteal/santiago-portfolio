import { useReveal } from "../hooks/useReveal";
import { skillGroups } from "../data/content";
import SectionLabel from "./SectionLabel";

function SkillGroup({ group, index }) {
  const revealRef = useReveal();
  return (
    <div
      ref={revealRef}
      className="reveal rounded-lg border border-border bg-surface p-6 transition-colors duration-300 hover:border-blue-dim"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-medium text-ink">
          {group.title}
        </h3>
        <span className="font-mono text-[11px] text-ink-dim">
          {group.note}
        </span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-border-soft bg-surface-2 px-3 py-1.5 font-mono text-[12.5px] text-ink-muted"
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel>Habilidades técnicas</SectionLabel>

        <h2 className="text-balance mt-6 max-w-2xl font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
          Un stack pensado para construir y para entender qué pasa en
          producción.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {skillGroups.map((group, i) => (
            <SkillGroup key={group.title} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
