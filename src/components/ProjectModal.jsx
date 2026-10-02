import { useEffect, useId, useRef, useState } from "react";
import { ExternalLink, Info, X } from "lucide-react";
import { GithubIcon } from "./BrandIcons";
import { ProjectCover, WipBadge } from "./ProjectParts";
import { coverImageFor, realLink } from "../lib/projects";

const EXIT_MS = 300; // longest exit animation in index.css (sheet-out)

/**
 * Project details in a native <dialog>: focus trapping, Esc and the top
 * layer come for free. Mounted only while open; closing plays the exit
 * animation first and then calls `onClose`.
 */
export default function ProjectModal({ project, index, labels, onClose }) {
  const dialogRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const titleId = useId();

  const isWip = project.status === "wip";
  const repo = realLink(project.repo);
  const demo = realLink(project.demo) || realLink(project.href);
  const paragraphs = [].concat(project.description);

  useEffect(() => {
    const dialog = dialogRef.current;
    // Remember who opened the modal so focus can go back there.
    const opener = document.activeElement;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  // Wait for the exit animation, then unmount.
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(onClose, EXIT_MS);
    return () => clearTimeout(timer);
  }, [closing, onClose]);

  const requestClose = () => setClosing(true);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // Esc fires "cancel": run our exit animation instead of closing instantly.
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      className={`fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-ink backdrop:bg-transparent ${
        closing ? "is-closing" : ""
      }`}
    >
      {/* clicking the dimmed area closes the modal */}
      <div
        aria-hidden="true"
        onClick={requestClose}
        className="modal-backdrop absolute inset-0 bg-bg/70 backdrop-blur-sm"
      />

      <div className="pointer-events-none relative flex h-full items-end justify-center sm:items-center sm:p-6">
        <article className="modal-panel pointer-events-auto relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-surface shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] sm:max-h-[88svh] sm:max-w-2xl sm:rounded-2xl">
          <button
            type="button"
            onClick={requestClose}
            aria-label={labels.closeLabel}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg/70 text-ink-muted backdrop-blur-md transition-[color,border-color,transform] duration-300 hover:rotate-90 hover:border-blue hover:text-ink"
          >
            <X size={16} strokeWidth={1.75} />
          </button>

          <div className="overflow-y-auto overscroll-contain [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin]">
            {/* grab handle hint on phones */}
            <div className="absolute left-1/2 top-2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-ink/30 sm:hidden" />

            {/* real images keep their ratio; generated covers stay short */}
            <div
              className={`relative overflow-hidden border-b border-border-soft ${
                coverImageFor(project) ? "aspect-[1200/630]" : "h-36 sm:h-44"
              }`}
            >
              <ProjectCover project={project} index={index} large />
            </div>

            <div className="p-6 md:p-8">
              <div className="fade-up flex flex-wrap items-center justify-between gap-3 [--d:120ms]">
                <span className="font-mono text-[11px] uppercase tracking-wide text-ink-dim">
                  {project.kind}
                </span>
                {isWip && <WipBadge label={labels.wipLabel} />}
              </div>

              <h2
                id={titleId}
                className="fade-up mt-3 font-display text-2xl font-medium leading-tight text-ink md:text-3xl [--d:180ms]"
              >
                {project.title}
              </h2>

              <section className="fade-up mt-7 [--d:240ms]">
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-blue-soft">
                  {labels.aboutLabel}
                </h3>
                <div className="space-y-3.5">
                  {paragraphs.map((text, i) => (
                    <p key={i} className="text-[15px] leading-relaxed text-ink-muted">
                      {text}
                    </p>
                  ))}
                </div>

                {project.note && (
                  <p className="mt-5 flex gap-2.5 rounded-md border border-border-soft bg-surface-2/60 p-3.5 text-[12.5px] leading-relaxed text-ink-dim">
                    <Info size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-blue-soft" aria-hidden="true" />
                    <span>{project.note}</span>
                  </p>
                )}

                {isWip && typeof project.progress === "number" && (
                  <div className="mt-5">
                    <div className="mb-1.5 flex justify-between font-mono text-[10.5px] text-ink-dim">
                      <span>{labels.progressLabel}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#f5b97a] to-[#f59e7a]"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className="fade-up mt-7 [--d:300ms]">
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-blue-soft">
                  {labels.techLabel}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border-soft bg-surface-2 px-3 py-1.5 font-mono text-[12px] text-ink-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </section>

              {(repo || demo) && (
                <div className="fade-up mt-8 flex flex-wrap gap-3 border-t border-border-soft pt-6 [--d:360ms]">
                  {demo && (
                    <a
                      href={demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-blue px-4 py-2.5 font-mono text-[12.5px] font-medium text-bg transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <ExternalLink size={14} strokeWidth={2} />
                      {labels.demoLabel}
                    </a>
                  )}
                  {repo && (
                    <a
                      href={repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-mono text-[12.5px] text-ink transition-colors duration-300 hover:border-blue hover:text-blue"
                    >
                      <GithubIcon size={14} />
                      {labels.codeLabel}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </dialog>
  );
}
