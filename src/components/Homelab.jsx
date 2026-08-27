import { useReveal } from "../hooks/useReveal";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionLabel from "./SectionLabel";

function HomelabGroup({ group, index }) {
  const revealRef = useReveal();

  return (
    <article
      ref={revealRef}
      className="reveal rounded-lg border border-border bg-surface p-6 transition-colors duration-300 hover:border-blue-dim"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <h3 className="font-display text-lg font-medium text-ink">
        {group.title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
        {group.description}
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {group.services.map((service) => (
          <li
            key={service}
            className="rounded-full border border-border-soft bg-surface-2 px-3 py-1.5 font-mono text-[12.5px] text-ink-muted"
          >
            {service}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Homelab() {
  const { language } = useLanguage();
  const { homelab } = getContent(language);
  const revealRef = useReveal();

  return (
    <section
      id="homelab"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel>{homelab.label}</SectionLabel>

        <div ref={revealRef} className="reveal mt-6 max-w-3xl">
          <h2 className="text-balance font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
            {homelab.heading}
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-muted md:text-base">
            {homelab.intro}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {homelab.groups.map((group, index) => (
            <HomelabGroup key={group.title} group={group} index={index} />
          ))}
        </div>

        <p className="mt-10 max-w-3xl border-l-2 border-blue-dim pl-5 text-[15px] leading-relaxed text-blue-soft md:text-base">
          {homelab.outro}
        </p>
      </div>
    </section>
  );
}
