import { useCallback, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { useScrollProgress } from "../hooks/useScroll";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionHeader from "./SectionHeader";

const FIRST_YEAR = 2019;

function ExperienceItem({ item, isCurrent, currentLabel, open, onToggle, nodeRef }) {
  const revealRef = useReveal();
  const panelId = useId();

  return (
    <div ref={revealRef} className="reveal group relative pl-10 md:pl-14">
      {/* node on the timeline; lights up once the scroll line reaches it */}
      <span
        ref={nodeRef}
        className="absolute left-0 top-5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-border bg-bg transition-[transform,border-color,box-shadow] duration-500 group-hover:scale-125 data-[reached]:border-blue data-[reached]:shadow-[0_0_0_4px_rgba(91,141,239,0.15)] md:left-0.5"
      >
        {isCurrent && <span className="status-dot h-1.5 w-1.5 rounded-full bg-blue" />}
      </span>

      <div className="-mx-4 mb-4 rounded-lg px-4 py-4 transition-colors duration-500 hover:bg-surface/60">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-start justify-between gap-4 text-left"
        >
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[12px] tracking-wide text-ink-dim">
                {item.period}
              </span>
              {isCurrent && (
                <span className="rounded-full border border-blue-dim bg-blue-dim/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-blue-soft">
                  {currentLabel}
                </span>
              )}
            </span>
            <span className="mt-2 block font-display text-xl font-medium text-ink md:text-2xl">
              {item.role}
            </span>
            <span className="mt-1 block font-mono text-[13px] text-blue-soft">{item.org}</span>
          </span>
          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-soft text-ink-dim transition-colors duration-300 group-hover:border-border group-hover:text-ink">
            <ChevronDown
              size={15}
              strokeWidth={1.75}
              className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        {/* grid-rows trick animates the height without measuring */}
        <div
          id={panelId}
          className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <ul className="max-w-2xl space-y-2.5 overflow-hidden" inert={!open}>
            {item.points.map((point, i) => (
              <li
                key={i}
                className={`flex gap-3 text-[14.5px] leading-relaxed text-ink-muted transition-[opacity,translate] duration-500 first:mt-4 ${
                  open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              >
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink-dim transition-colors duration-300 group-hover:bg-blue" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { language } = useLanguage();
  const { experience } = getContent(language);
  const listRef = useRef(null);
  const fillRef = useRef(null);
  const yearRef = useRef(null);
  const nodes = useRef([]);
  // The current role starts open; the rest open on demand.
  const [open, setOpen] = useState(() => new Set([0]));

  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  // Fill the timeline as the list passes the middle of the viewport, light
  // up the nodes it has reached and move the year counter along with it.
  useScrollProgress(
    useCallback(() => {
      const list = listRef.current;
      const fill = fillRef.current;
      if (!list || !fill) return;
      const rect = list.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      fill.style.transform = `scaleY(${p})`;

      nodes.current.forEach((node) => {
        if (!node) return;
        node.toggleAttribute("data-reached", node.getBoundingClientRect().top < anchor);
      });

      if (yearRef.current) {
        // The list runs newest → oldest, so the counter goes back in time.
        const now = new Date().getFullYear();
        yearRef.current.textContent = String(Math.round(now - p * (now - FIRST_YEAR)));
      }
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

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,48rem)_1fr]">
          <div ref={listRef} data-flash className="relative rounded-lg">
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
                open={open.has(i)}
                onToggle={() => toggle(i)}
                nodeRef={(el) => {
                  nodes.current[i] = el;
                }}
              />
            ))}
          </div>

          {/* year counter that follows the timeline (wide screens only) */}
          <div aria-hidden="true" className="hidden lg:block">
            <div className="sticky top-32 text-right">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim">
                {experience.yearLabel}
              </span>
              <span
                ref={yearRef}
                className="text-gradient mt-1 block font-display text-7xl font-semibold tabular-nums tracking-tight"
              >
                {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
