import { Database, Network, Workflow } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionLabel from "./SectionLabel";
import homelabStack from "../assets/homelab-stack.svg";

const groupIcons = [Network, Workflow, Database];

function HomelabGroup({ group, index }) {
  const Icon = groupIcons[index];

  return (
    <article
      className="border-t border-border-soft pt-5"
    >
      <div className="flex items-center gap-3">
        <Icon size={18} strokeWidth={1.75} className="text-blue" aria-hidden="true" />
        <h3 className="font-display text-lg font-medium text-ink">
          {group.title}
        </h3>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
        {group.description}
      </p>
      <ul className="mt-5 space-y-2.5">
        {group.services.map((service) => (
          <li key={service} className="flex items-center gap-2 font-mono text-[12px] text-ink-muted">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-dim" aria-hidden="true" />
            <span>{service}</span>
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

        <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1fr_0.72fr] lg:gap-16">
          <div ref={revealRef} className="reveal max-w-3xl">
            <h2 className="text-balance font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
              {homelab.heading}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-muted md:text-base">
              {homelab.intro}
            </p>
          </div>

          <img
            src={homelabStack}
            alt="Abstract server rack representing a personal homelab"
            className="w-full max-h-44 rounded-xl border border-border object-contain opacity-95"
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {homelab.groups.map((group, index) => (
            <HomelabGroup key={group.title} group={group} index={index} />
          ))}
        </div>

        <p className="mt-12 max-w-3xl border-t border-border-soft pt-6 text-[15px] leading-relaxed text-blue-soft md:text-base">
          {homelab.outro}
        </p>
      </div>
    </section>
  );
}
