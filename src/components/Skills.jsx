import { Code2, Database, Activity } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { useSpotlight } from "../hooks/usePointer";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionHeader from "./SectionHeader";

const icons = [Code2, Database, Activity];

function SkillGroup({ group, index }) {
  const revealRef = useReveal();
  const spotRef = useSpotlight();
  const Icon = icons[index % icons.length];

  return (
    <div
      ref={revealRef}
      className="reveal h-full"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div
        ref={spotRef}
        className="spotlight group h-full rounded-lg border border-border bg-surface p-6 transition-transform duration-500 hover:-translate-y-1"
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border-soft bg-surface-2 text-blue-soft transition-[color,transform] duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:text-blue">
            <Icon size={17} strokeWidth={1.75} />
          </span>
          <span className="font-mono text-[11px] text-ink-dim">
            {String(group.skills.length).padStart(2, "0")} tools
          </span>
        </div>
        <h3 className="font-display text-lg font-medium text-ink">
          {group.title}
        </h3>
        <p className="mt-1 font-mono text-[11px] text-ink-dim">{group.note}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {group.skills.map((skill) => (
            <li
              key={skill}
              className="cursor-default rounded-full border border-border-soft bg-surface-2 px-3 py-1.5 font-mono text-[12.5px] text-ink-muted transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-blue-dim hover:text-blue-soft"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Skills() {
  const { language } = useLanguage();
  const { skills } = getContent(language);
  return (
    <section
      id="skills"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="04" label={skills.label} title={skills.heading} />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {skills.groups.map((group, i) => (
            <SkillGroup key={group.title} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
