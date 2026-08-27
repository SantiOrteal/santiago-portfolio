import { ArrowUpRight } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionLabel from "./SectionLabel";
import projectDashboard from "../assets/project-dashboard.svg";
import projectPulse from "../assets/project-pulse.svg";
import projectKit from "../assets/project-kit.svg";

const projectImages = [projectDashboard, projectPulse, projectKit];

function ProjectCard({ project, index }) {
  const revealRef = useReveal();
  return (
    <a
      ref={revealRef}
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className="reveal group flex flex-col rounded-lg border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-dim"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <img
        src={projectImages[index]}
        alt=""
        aria-hidden="true"
        className="mb-6 aspect-video w-full rounded-md border border-border-soft object-cover"
      />
      <div className="mb-6 flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink-dim">
          {project.kind}
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border-soft text-ink-muted transition-colors duration-200 group-hover:border-blue-dim group-hover:text-blue">
          <ArrowUpRight
            size={14}
            strokeWidth={1.75}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>

      <h3 className="font-display text-xl font-medium text-ink">
        {project.title}
      </h3>
      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-muted">
        {project.description}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2 border-t border-border-soft pt-5">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-ink-dim"
          >
            {tag}
          </li>
        ))}
      </ul>
    </a>
  );
}

export default function Projects() {
  const { language } = useLanguage();
  const { projects } = getContent(language);
  return (
    <section
      id="projects"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel>{projects.label}</SectionLabel>

        <h2 className="text-balance mt-6 max-w-2xl font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
          {projects.heading}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {projects.items.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
