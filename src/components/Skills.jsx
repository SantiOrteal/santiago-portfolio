import { Activity, ArrowDownRight, LayoutDashboard, Rocket, Workflow } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { useSpotlight } from "../hooks/usePointer";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionHeader from "./SectionHeader";

const icons = [LayoutDashboard, Activity, Rocket, Workflow];

function Strength({ item, index, evidenceLabel }) {
  const revealRef = useReveal();
  const spotRef = useSpotlight();
  const Icon = icons[index % icons.length];

  return (
    <div
      ref={revealRef}
      className="reveal h-full"
      style={{ transitionDelay: `${(index % 2) * 90}ms` }}
    >
      <article
        ref={spotRef}
        className="spotlight group flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-transform duration-500 hover:-translate-y-1 md:p-7"
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border-soft bg-surface-2 text-blue-soft transition-[color,transform] duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:text-blue">
            <Icon size={18} strokeWidth={1.75} />
          </span>
          <span className="font-mono text-[11px] text-ink-dim">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="font-display text-xl font-medium text-ink">{item.title}</h3>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-muted">
          {item.description}
        </p>

        <ul className="mb-6 mt-5 flex flex-wrap gap-2">
          {item.tech.map((tech) => (
            <li
              key={tech}
              className="cursor-default rounded-full border border-border-soft bg-surface-2 px-3 py-1.5 font-mono text-[12px] text-ink-muted transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-blue-dim hover:text-blue-soft"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Where a recruiter can verify this strength on the page */}
        <a
          href={`#${item.target}`}
          className="group/proof mt-auto flex items-center justify-between gap-3 border-t border-border-soft pt-5 font-mono text-[12px] transition-colors duration-300"
        >
          <span className="text-ink-dim">
            <span className="uppercase tracking-wider">{evidenceLabel}</span>
            <span className="mx-2 text-border">·</span>
            <span className="text-blue-soft transition-colors group-hover/proof:text-ink">
              {item.evidence}
            </span>
          </span>
          <ArrowDownRight
            size={15}
            strokeWidth={1.75}
            className="shrink-0 text-ink-dim transition-[color,transform] duration-300 group-hover/proof:translate-x-0.5 group-hover/proof:translate-y-0.5 group-hover/proof:text-blue"
          />
        </a>
      </article>
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

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {skills.items.map((item, i) => (
            <Strength
              key={item.title}
              item={item}
              index={i}
              evidenceLabel={skills.evidenceLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
