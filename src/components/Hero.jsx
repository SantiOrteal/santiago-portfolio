import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero } from "../data/content";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden border-b border-border-soft px-6 pt-28 pb-20 md:px-10"
    >
      {/* fondo tipo "blueprint": grid muy sutil + resplandor azul */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="bg-grid-drift absolute -inset-x-10 -inset-y-10 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #5b8def 1px, transparent 1px), linear-gradient(to bottom, #5b8def 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/60 px-4 py-1.5">
          <span className="status-dot h-1.5 w-1.5 rounded-full bg-blue" />
          <span className="font-mono text-[12px] tracking-wide text-ink">
            {hero.eyebrow}
          </span>
        </div>

        <h1
          className="font-display text-balance max-w-4xl font-semibold leading-[1.05] tracking-tight text-ink"
          style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
        >
          {hero.headline}
        </h1>

        <p className="mt-8 max-w-xl text-balance text-base leading-relaxed text-ink-muted md:text-lg">
          {hero.subline}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-md bg-blue px-5 py-3 font-mono text-[13px] font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5"
          >
            Ver proyectos
            <ArrowUpRight
              size={15}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-[13px] font-medium text-ink transition-colors duration-200 hover:border-blue hover:text-blue"
          >
            Contactar
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border-soft pt-6 font-mono text-[12px] text-ink">
          {hero.meta.map((item, i) => (
            <span key={item} className="flex items-center gap-6">
              {item}
              {i < hero.meta.length - 1 && (
                <span className="hidden h-1 w-1 rounded-full bg-ink-dim sm:block" />
              )}
            </span>
          ))}
        </div>
      </div>

      <a
        href="#about"
        aria-label="Ir a la sección Sobre mí"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 rounded-full border border-border bg-surface/70 p-2.5 text-ink-muted backdrop-blur-sm transition-colors hover:border-blue hover:text-blue md:block"
      >
        <ArrowDown size={16} strokeWidth={1.5} />
      </a>
    </section>
  );
}
