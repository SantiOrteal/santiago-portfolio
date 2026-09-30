import { ArrowUpRight, ExternalLink, Hammer } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { useSpotlight } from "../hooks/usePointer";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import { GithubIcon } from "./BrandIcons";
import SectionHeader from "./SectionHeader";
import projectDashboard from "../assets/project-dashboard.svg";
import projectPulse from "../assets/project-pulse.svg";
import projectKit from "../assets/project-kit.svg";

const projectImages = [projectDashboard, projectPulse, projectKit];
const accents = ["#5b8def", "#9b87f5", "#6ee7b7", "#f5b97a"];

const realLink = (url) => (url && url !== "#" ? url : null);

// Generated cover for projects without an illustration or screenshot.
function GeneratedCover({ title, accent }) {
  const initials = title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

  return (
    <div className="relative h-full w-full bg-surface-2">
      <div
        className="absolute inset-0 opacity-[0.12] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        style={{
          backgroundImage: `linear-gradient(to right, ${accent} 1px, transparent 1px), linear-gradient(to bottom, ${accent} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(circle at 70% 30%, #000, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 70% 30%, #000, transparent 75%)",
        }}
      />
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
        style={{ background: accent }}
      />
      <span
        className="absolute bottom-3 left-5 font-display text-6xl font-semibold tracking-tighter opacity-25 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:opacity-45"
        style={{ color: accent }}
      >
        {initials}
      </span>
    </div>
  );
}

function ProjectCard({ project, index, labels }) {
  const revealRef = useReveal();
  const spotRef = useSpotlight();
  const accent = accents[index % accents.length];
  const isWip = project.status === "wip";
  const repo = realLink(project.repo);
  const demo = realLink(project.demo);
  const mainHref = demo || realLink(project.href) || repo;
  // WIP projects get the generated cover unless they bring their own image.
  const image = project.image || (!isWip && projectImages[index]);

  return (
    <article
      ref={revealRef}
      className="reveal h-full"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div
        ref={spotRef}
        className="spotlight group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5"
      >
        <div className="relative aspect-video overflow-hidden border-b border-border-soft">
          {image ? (
            <img
              src={image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          ) : (
            <GeneratedCover title={project.title} accent={accent} />
          )}
          {/* soft fade into the card body */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface/80 to-transparent" />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wide text-ink-dim">
              {project.kind}
            </span>
            {isWip ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f5b97a]/30 bg-[#f5b97a]/10 px-2.5 py-0.5 font-mono text-[10.5px] text-[#f5b97a]">
                <Hammer size={11} strokeWidth={2} />
                {labels.wipLabel}
              </span>
            ) : (
              mainHref && (
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border-soft text-ink-muted transition-colors duration-300 group-hover:border-blue-dim group-hover:text-blue">
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.75}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              )
            )}
          </div>

          <h3 className="font-display text-xl font-medium text-ink">
            {mainHref ? (
              // Stretched link: the whole card is clickable, inner links still work.
              <a
                href={mainHref}
                target="_blank"
                rel="noreferrer"
                className="after:absolute after:inset-0 after:z-0"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-muted">
            {project.description}
          </p>

          {isWip && typeof project.progress === "number" && (
            <div className="mt-5">
              <div className="mb-1.5 flex justify-between font-mono text-[10.5px] text-ink-dim">
                <span>{labels.progressLabel}</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-[#f5b97a] to-[#f59e7a] transition-transform delay-300 duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] [.reveal:not(.is-visible)_&]:scale-x-0"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          )}

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

            {(repo || demo) && (
              <div className="relative z-10 mt-4 flex gap-4 font-mono text-[12px]">
                {repo && (
                  <a
                    href={repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-blue"
                  >
                    <GithubIcon size={13} /> {labels.codeLabel}
                  </a>
                )}
                {demo && (
                  <a
                    href={demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-blue"
                  >
                    <ExternalLink size={13} strokeWidth={1.75} /> {labels.demoLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
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
        <SectionHeader index="03" label={projects.label} title={projects.heading} />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.items.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              labels={projects}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
