import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { useSpotlight } from "../hooks/usePointer";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionHeader from "./SectionHeader";
import ProjectModal from "./ProjectModal";
import { ProjectCover, WipBadge } from "./ProjectParts";

function ProjectCard({ project, index, labels, onOpen }) {
  const revealRef = useReveal();
  const spotRef = useSpotlight();
  const isWip = project.status === "wip";
  // Cards show the short summary; the full description lives in the modal.
  const summary = project.summary || [].concat(project.description)[0];

  return (
    <article
      ref={revealRef}
      className="reveal h-full"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div
        ref={spotRef}
        className="spotlight group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-blue"
      >
        <div className="relative aspect-video overflow-hidden border-b border-border-soft">
          <ProjectCover project={project} index={index} />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wide text-ink-dim">
              {project.kind}
            </span>
            {isWip && <WipBadge label={labels.wipLabel} />}
          </div>

          <h3 className="font-display text-xl font-medium text-ink">
            {/* Stretched button: the whole card opens the details modal. */}
            <button
              type="button"
              onClick={() => onOpen(index)}
              aria-haspopup="dialog"
              className="text-left outline-none after:absolute after:inset-0 after:z-0"
            >
              {project.title}
            </button>
          </h3>
          <p className="mt-2.5 line-clamp-3 text-[14.5px] leading-relaxed text-ink-muted">
            {summary}
          </p>

          <div className="mt-auto pt-6">
            <ul className="flex flex-wrap gap-2 border-t border-border-soft pt-5">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-ink-dim"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <span
              aria-hidden="true"
              className="mt-5 inline-flex items-center gap-1.5 font-mono text-[12px] text-blue-soft transition-colors duration-300 group-hover:text-ink"
            >
              {labels.detailsLabel}
              <ArrowRight
                size={13}
                strokeWidth={1.75}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const { language } = useLanguage();
  const { projects } = getContent(language);
  const [openIndex, setOpenIndex] = useState(null);
  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <section
      id="projects"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="03" label={projects.label} title={projects.heading} />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.items.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              labels={projects}
              onOpen={setOpenIndex}
            />
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <ProjectModal
          project={projects.items[openIndex]}
          index={openIndex}
          labels={projects}
          onClose={close}
        />
      )}
    </section>
  );
}
