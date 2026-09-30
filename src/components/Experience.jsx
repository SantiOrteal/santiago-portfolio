import { useCallback, useRef } from "react";
import { useReveal } from "../hooks/useReveal";
import { useScrollProgress } from "../hooks/useScroll";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionHeader from "./SectionHeader";

function ExperienceItem({ item, isCurrent, currentLabel }) {
  const revealRef = useReveal();
  return (
    <div ref={revealRef} className="reveal group relative pl-10 md:pl-14">
      {/* node on the timeline */}
      <span className="absolute left-0 top-5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-blue bg-bg transition-transform duration-500 group-hover:scale-125 md:left-0.5">
        {isCurrent && <span className="status-dot h-1.5 w-1.5 rounded-full bg-blue" />}
      </span>

      <div className="-mx-4 mb-4 rounded-lg px-4 py-4 transition-colors duration-500 hover:bg-surface/60">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[12px] tracking-wide text-ink-dim">
            {item.period}
          </span>
          {isCurrent && (
            <span className="rounded-full border border-blue-dim bg-blue-dim/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-blue-soft">
              {currentLabel}
            </span>
          )}
        </div>
        <h3 className="mt-2 font-display text-xl font-medium text-ink md:text-2xl">
          {item.role}
        </h3>
        <p className="mt-1 font-mono text-[13px] text-blue-soft">{item.org}</p>
        <ul className="mt-4 max-w-2xl space-y-2.5">
          {item.points.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 text-[14.5px] leading-relaxed text-ink-muted"
            >
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink-dim transition-colors duration-300 group-hover:bg-blue" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Experience() {
  const { language } = useLanguage();
  const { experience } = getContent(language);
  const listRef = useRef(null);
  const fillRef = useRef(null);

  // Fill the timeline as the list passes the middle of the viewport.
  useScrollProgress(
    useCallback(() => {
      const list = listRef.current;
      const fill = fillRef.current;
      if (!list || !fill) return;
      const rect = list.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      fill.style.transform = `scaleY(${p})`;
    }, [])
  );

  return (
    <section
      id="experience"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="02"
          label={experience.label}
          title={experience.heading}
        />

        <div ref={listRef} className="relative mt-14 max-w-3xl">
          <span className="absolute left-[7px] top-6 bottom-10 w-px bg-border md:left-[9px]" />
          <span
            ref={fillRef}
            className="absolute left-[7px] top-6 bottom-10 w-px origin-top bg-gradient-to-b from-blue via-violet to-blue-soft md:left-[9px]"
            style={{ transform: "scaleY(0)" }}
          />
          {experience.items.map((item, i) => (
            <ExperienceItem
              key={item.period}
              item={item}
              isCurrent={i === 0}
              currentLabel={experience.currentLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
