import { useEffect, useRef, useState } from "react";
import { Activity, ArrowDownRight, LayoutDashboard, Rocket, Workflow, X } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { useSpotlight } from "../hooks/usePointer";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import { fill } from "../lib/bit";
import { TECH_EVENT, flashSection, usageFor } from "../lib/tech";
import SectionHeader from "./SectionHeader";

const icons = [LayoutDashboard, Activity, Rocket, Workflow];

function Usage({ tech, content, labels, onClose }) {
  const { projects, experience } = usageFor(tech, content);
  const groups = [
    [labels.inProjects, projects],
    [labels.inExperience, experience],
  ].filter(([, list]) => list.length > 0);

  return (
    <div className="bit-pop mb-6 rounded-md border border-blue-dim bg-bg/40 p-4 [transform-origin:top_left]">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-blue-soft">
          {fill(labels.usedIn, { tech })}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={labels.closeUsage}
          className="-m-1 flex h-6 w-6 shrink-0 items-center justify-center rounded text-ink-dim transition-colors hover:text-ink"
        >
          <X size={13} strokeWidth={1.75} />
        </button>
      </div>
      {groups.length === 0 ? (
        <p className="mt-2 text-[13.5px] text-ink-muted">{labels.usedElsewhere}</p>
      ) : (
        <dl className="mt-3 space-y-2.5">
          {groups.map(([label, list]) => (
            <div key={label}>
              <dt className="font-mono text-[10.5px] uppercase tracking-wider text-ink-dim">{label}</dt>
              {list.map((entry) => (
                <dd key={entry} className="mt-1 flex gap-2 text-[13.5px] text-ink-muted">
                  <span className="text-blue-soft" aria-hidden="true">›</span>
                  {entry}
                </dd>
              ))}
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function Strength({ item, index, labels, content, selected, onSelect, pulse }) {
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
        className={`spotlight group flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-transform duration-500 hover:-translate-y-1 md:p-7 ${
          pulse ? "flash-target" : ""
        }`}
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

        {/* each chip opens "where I use it" */}
        <ul className="mb-5 mt-5 flex flex-wrap gap-2">
          {item.tech.map((tech) => {
            const active = selected === tech;
            return (
              <li key={tech}>
                <button
                  type="button"
                  aria-expanded={active}
                  onClick={() => onSelect(active ? null : tech)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[12px] transition-[color,border-color,background-color,transform] duration-300 hover:-translate-y-0.5 active:scale-95 ${
                    active
                      ? "border-blue bg-blue-dim/50 text-blue-soft"
                      : "border-border-soft bg-surface-2 text-ink-muted hover:border-blue-dim hover:text-blue-soft"
                  }`}
                >
                  {tech}
                </button>
              </li>
            );
          })}
        </ul>

        {selected && (
          <Usage key={selected} tech={selected} content={content} labels={labels} onClose={() => onSelect(null)} />
        )}

        {/* Where a recruiter can verify this strength on the page */}
        <a
          href={`#${item.target}`}
          onClick={() => setTimeout(() => flashSection(item.target), 650)}
          className="group/proof mt-auto flex items-center justify-between gap-3 border-t border-border-soft pt-5 font-mono text-[12px] transition-colors duration-300"
        >
          <span className="text-ink-dim">
            <span className="uppercase tracking-wider">{labels.evidenceLabel}</span>
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
  const content = getContent(language);
  const { skills } = content;
  // Only one usage panel open at a time across all cards.
  const [selected, setSelected] = useState(null); // { index, tech }
  const [pulse, setPulse] = useState(null);
  const pulseTimer = useRef(null);

  // A technology clicked in the marquee opens its panel here.
  useEffect(() => {
    const onTech = (e) => {
      const { tech } = e.detail;
      const index = skills.items.findIndex((item) => item.tech.includes(tech));
      if (index < 0) return;
      setSelected({ index, tech });
      setPulse(index);
      clearTimeout(pulseTimer.current);
      pulseTimer.current = setTimeout(() => setPulse(null), 1800);
    };
    window.addEventListener(TECH_EVENT, onTech);
    return () => window.removeEventListener(TECH_EVENT, onTech);
  }, [skills]);

  useEffect(() => () => clearTimeout(pulseTimer.current), []);

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
              labels={skills}
              content={content}
              pulse={pulse === i}
              selected={selected?.index === i ? selected.tech : null}
              onSelect={(tech) => setSelected(tech ? { index: i, tech } : null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
