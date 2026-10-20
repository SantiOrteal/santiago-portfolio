import { useEffect, useRef, useState } from "react";
import { Activity, ArrowDownRight, LayoutDashboard, Rocket, Workflow, X } from "lucide-react";
import { useSpotlight } from "../hooks/usePointer";
import { useReveal } from "../hooks/useReveal";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import { fill } from "../lib/bit";
import { TECH_EVENT, flashSection, usageFor } from "../lib/tech";
import SectionHeader from "./SectionHeader";
import SkillVisual from "./SkillVisuals";

const icons = [LayoutDashboard, Activity, Rocket, Workflow];
const AUTOPLAY_MS = 7000;

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Usage({ tech, content, labels, onClose }) {
  const { projects, experience } = usageFor(tech, content);
  const groups = [
    [labels.inProjects, projects],
    [labels.inExperience, experience],
  ].filter(([, list]) => list.length > 0);

  return (
    <div className="bit-pop mt-5 rounded-md border border-blue-dim bg-bg/40 p-4 [transform-origin:top_left]">
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

/**
 * "How I work": a list of strengths on one side and a large panel on the
 * other with an animated illustration, the tech used and the evidence.
 * The list advances on its own while the section is on screen; hovering,
 * focusing or choosing anything stops it so people can read in peace.
 */
export default function Skills() {
  const { language } = useLanguage();
  const content = getContent(language);
  const { skills } = content;
  const items = skills.items;

  const [active, setActive] = useState(0);
  const [tech, setTech] = useState(null); // open usage panel
  const [autoplay, setAutoplay] = useState(() => !prefersReduced());
  const [inView, setInView] = useState(false);
  const [hold, setHold] = useState(false); // hover or keyboard focus inside
  const [pulse, setPulse] = useState(false);
  const sectionRef = useRef(null);
  const revealRef = useReveal();
  const spotRef = useSpotlight();
  const pulseTimer = useRef(null);

  // Only auto-advance while the section is actually visible.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const select = (i) => {
    setAutoplay(false);
    setTech(null);
    setActive(i);
  };

  // A technology clicked in the marquee opens its usage panel here.
  useEffect(() => {
    const onTech = (e) => {
      const index = items.findIndex((item) => item.tech.includes(e.detail.tech));
      if (index < 0) return;
      setAutoplay(false);
      setActive(index);
      setTech(e.detail.tech);
      setPulse(true);
      clearTimeout(pulseTimer.current);
      pulseTimer.current = setTimeout(() => setPulse(false), 1800);
    };
    window.addEventListener(TECH_EVENT, onTech);
    return () => window.removeEventListener(TECH_EVENT, onTech);
  }, [items]);

  useEffect(() => () => clearTimeout(pulseTimer.current), []);

  // On phones the list is a horizontal row: keep the active tab in view.
  const listRef = useRef(null);
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.children[active];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft - list.offsetLeft - 24, behavior: prefersReduced() ? "auto" : "smooth" });
  }, [active]);

  const onTabKey = (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + items.length) % items.length;
    select(next);
    e.currentTarget.parentElement.children[next]?.focus();
  };

  const running = autoplay && inView && !hold;
  const item = items[active];
  const Icon = icons[active % icons.length];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="04" label={skills.label} title={skills.heading} />

        <div
          ref={revealRef}
          onPointerEnter={() => setHold(true)}
          onPointerLeave={() => setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHold(false)}
          className="reveal mt-12 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.45fr)] lg:gap-6"
        >
          {/* strengths list: vertical on desktop, a swipeable row on phones */}
          <div
            ref={listRef}
            role="tablist"
            aria-label={skills.label}
            aria-orientation="vertical"
            className="-mx-6 flex snap-x gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {items.map((strength, i) => {
              const selected = i === active;
              return (
                <button
                  key={strength.title}
                  type="button"
                  role="tab"
                  id={`skill-tab-${i}`}
                  aria-selected={selected}
                  aria-controls="skill-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={onTabKey}
                  className={`group relative w-[78%] shrink-0 snap-start overflow-hidden rounded-lg border p-5 text-left transition-[border-color,background-color,transform] duration-500 sm:w-[46%] lg:w-auto ${
                    selected
                      ? "border-blue/50 bg-surface"
                      : "border-border-soft bg-surface/30 hover:border-border hover:bg-surface/60 lg:hover:translate-x-1"
                  }`}
                >
                  <span className="flex items-baseline gap-4">
                    <span
                      className={`font-mono text-[12px] transition-colors duration-300 ${
                        selected ? "text-blue-soft" : "text-ink-dim"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-[17px] font-medium leading-snug transition-colors duration-300 ${
                        selected ? "text-ink" : "text-ink-muted group-hover:text-ink"
                      }`}
                    >
                      {strength.title}
                    </span>
                  </span>
                  <span className="mt-1.5 block pl-9 font-mono text-[11px] text-ink-dim">
                    {strength.evidence}
                  </span>

                  {/* autoplay progress; finishing it moves to the next strength */}
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-border-soft/60">
                    {selected && autoplay && (
                      <span
                        key={active}
                        onAnimationEnd={() => setActive((a) => (a + 1) % items.length)}
                        className="block h-full origin-left bg-gradient-to-r from-blue to-violet"
                        style={{
                          animation: `sv-autoplay ${AUTOPLAY_MS}ms linear forwards`,
                          animationPlayState: running ? "running" : "paused",
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* selected strength */}
          <div
            ref={spotRef}
            role="tabpanel"
            id="skill-panel"
            aria-labelledby={`skill-tab-${active}`}
            className={`spotlight relative overflow-hidden rounded-xl border border-border bg-surface ${
              pulse ? "flash-target" : ""
            }`}
          >
            <div key={active} className="sv-swap">
              {/* illustration on a blueprint grid */}
              <div className="relative h-48 border-b border-border-soft bg-bg/40 md:h-64">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #5b8def 1px, transparent 1px), linear-gradient(to bottom, #5b8def 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-6 right-4 font-display text-[7rem] font-semibold leading-none text-transparent [-webkit-text-stroke:1px_rgba(91,141,239,0.25)]"
                >
                  {String(active + 1).padStart(2, "0")}
                </span>
                <div aria-hidden="true" className="relative h-full px-3 py-2">
                  <SkillVisual index={active} />
                </div>
              </div>

              <div className="p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-blue-dim bg-blue-dim/30 text-blue-soft">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display text-xl font-medium text-ink md:text-2xl">{item.title}</h3>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{item.description}</p>

                {/* each chip opens "where I use it" */}
                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.tech.map((name, i) => {
                    const open = tech === name;
                    return (
                      <li key={name} className="sv-chip" style={{ animationDelay: `${120 + i * 45}ms` }}>
                        <button
                          type="button"
                          aria-expanded={open}
                          onClick={() => {
                            setAutoplay(false);
                            setTech(open ? null : name);
                          }}
                          className={`rounded-full border px-3 py-1.5 font-mono text-[12px] transition-[color,border-color,background-color,transform] duration-300 hover:-translate-y-0.5 active:scale-95 ${
                            open
                              ? "border-blue bg-blue-dim/50 text-blue-soft"
                              : "border-border-soft bg-surface-2 text-ink-muted hover:border-blue-dim hover:text-blue-soft"
                          }`}
                        >
                          {name}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {tech && (
                  <Usage key={tech} tech={tech} content={content} labels={skills} onClose={() => setTech(null)} />
                )}

                {/* where a recruiter can verify this strength on the page */}
                <a
                  href={`#${item.target}`}
                  onClick={() => setTimeout(() => flashSection(item.target), 650)}
                  className="group/proof mt-6 flex items-center justify-between gap-3 border-t border-border-soft pt-5 font-mono text-[12px]"
                >
                  <span className="text-ink-dim">
                    <span className="uppercase tracking-wider">{skills.evidenceLabel}</span>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
