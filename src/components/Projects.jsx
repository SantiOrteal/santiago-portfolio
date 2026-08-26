import { ArrowUpRight } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { projects } from "../data/content";
import SectionLabel from "./SectionLabel";

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
  return (
    <section
      id="projects"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel>Proyectos destacados</SectionLabel>

        <h2 className="text-balance mt-6 max-w-2xl font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
          Proyectos personales para seguir aprendiendo fuera del día a día.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
