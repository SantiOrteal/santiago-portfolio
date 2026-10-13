import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { useSpotlight } from "../hooks/usePointer";
import { useCountUp } from "../hooks/useCountUp";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionHeader from "./SectionHeader";
import Tip from "./Tip";

function Stat({ value, suffix = "", label, hint, align }) {
  const [ref, current] = useCountUp(value);
  return (
    <div ref={ref} className="px-4 py-5 first:pl-0 last:pr-0">
      {/* the hint explains where the number comes from */}
      <Tip
        tip={hint}
        as="span"
        align={align}
        className="block cursor-help rounded-sm text-left outline-offset-4"
      >
        <span className="block font-display text-3xl font-semibold tabular-nums text-ink md:text-4xl">
          {current}
          <span className="text-gradient">{suffix}</span>
        </span>
        <span className="mt-1.5 block font-mono text-[11px] leading-snug text-ink-dim underline decoration-border decoration-dotted underline-offset-4">
          {label}
        </span>
      </Tip>
    </div>
  );
}

/** Wraps glossary terms found in `text` with a tooltip. */
function withGlossary(text, glossary) {
  const terms = Object.keys(glossary);
  if (!terms.length) return text;
  const lookup = Object.fromEntries(terms.map((t) => [t.toLowerCase(), glossary[t]]));
  const escape = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${terms.map(escape).join("|")})`, "gi");
  return text.split(pattern).map((part, i) =>
    lookup[part.toLowerCase()] ? (
      <Tip
        key={i}
        tip={lookup[part.toLowerCase()]}
        className="cursor-help underline decoration-blue-dim decoration-dotted underline-offset-4 transition-colors hover:text-ink hover:decoration-blue"
      >
        {part}
      </Tip>
    ) : (
      part
    )
  );
}

function WhoamiLine({ line, open, onToggle }) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-baseline justify-between gap-4 text-left font-mono text-[13px]"
      >
        <span className="flex items-center gap-1.5 text-ink-dim transition-colors duration-300 group-hover:text-ink-muted">
          <ChevronDown
            size={12}
            strokeWidth={2}
            className={`shrink-0 transition-transform duration-300 ${open ? "rotate-0 text-blue-soft" : "-rotate-90"}`}
          />
          {line.k}
        </span>
        <span className="mb-1 flex-1 border-b border-dashed border-border-soft" />
        <span className="text-right text-blue-soft transition-colors duration-300 group-hover:text-ink">
          {line.v}
        </span>
      </button>
      {/* grid-rows trick animates the detail without measuring */}
      <div
        className={`grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <p className="overflow-hidden pl-[18px] text-[12.5px] leading-relaxed text-ink-muted">
          <span className="block pt-1.5">
            <span className="text-mint">→ </span>
            {line.d}
          </span>
        </p>
      </div>
    </li>
  );
}

export default function About() {
  const textRef = useReveal();
  const asideRef = useReveal();
  const spotRef = useSpotlight();
  const [openLine, setOpenLine] = useState(null);
  const { language } = useLanguage();
  const { about, skills, homelab } = getContent(language);

  // Numbers come straight from the content so they never drift out of date.
  const years = new Date().getFullYear() - 2019;
  const techCount = new Set(skills.items.flatMap((item) => item.tech)).size;
  const serviceCount = homelab.groups.reduce((n, g) => n + g.services.length, 0);

  return (
    <section
      id="about"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="01" label={about.label} />

        <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div ref={textRef} className="reveal-stagger space-y-6">
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
                {withGlossary(p, about.glossary)}
              </p>
            ))}
          </div>

          <aside
            ref={asideRef}
            className="reveal-stagger self-start lg:sticky lg:top-28"
          >
            <div style={{ "--i": 0 }}>
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
                  <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-mint">
                    <span className="status-dot h-1.5 w-1.5 rounded-full bg-mint" />
                    online
                  </span>
                </div>
                <ul className="space-y-3.5">
                  {about.card.lines.map((line) => (
                    <WhoamiLine
                      key={line.k}
                      line={line}
                      open={openLine === line.k}
                      onToggle={() => setOpenLine(openLine === line.k ? null : line.k)}
                    />
                  ))}
                </ul>
              </div>
            </div>

            <div
              style={{ "--i": 1 }}
              className="mt-5 grid grid-cols-3 divide-x divide-border-soft border-y border-border-soft"
            >
              <Stat value={years} suffix="+" label={about.stats.years} hint={about.statsHint.years} align="left" />
              <Stat value={techCount} label={about.stats.tech} hint={about.statsHint.tech} />
              <Stat value={serviceCount} label={about.stats.services} hint={about.statsHint.services} align="right" />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
