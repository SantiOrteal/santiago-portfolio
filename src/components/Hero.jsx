import { ArrowUpRight } from "lucide-react";
import { getContent, profile } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import { useMagnetic, useSpotlight } from "../hooks/usePointer";
import CodeWindow from "./CodeWindow";

function Headline({ text, accent }) {
  // Split into words so each one can slide up from behind its own mask.
  const accentStart = accent ? text.indexOf(accent) : -1;
  const base = (accentStart >= 0 ? text.slice(0, accentStart) : text)
    .trim()
    .split(" ");
  const accentWords = accentStart >= 0 ? accent.split(" ") : [];

  let i = 0;
  const word = (w, className = "") => (
    <span key={i} className="word-mask">
      <span className="word" style={{ "--i": i++ }}>
        {/* gradient lives on an inner span: both use `animation` */}
        <span className={className}>{w}</span>
      </span>
      &nbsp;
    </span>
  );

  return (
    <h1
      className="font-display max-w-3xl font-semibold leading-[1.05] tracking-tight text-ink"
      style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.4rem)" }}
      aria-label={text}
    >
      {/* key forces the intro to replay when the language changes */}
      <span aria-hidden="true" key={text}>
        {base.map((w) => word(w))}
        {accentWords.map((w) => word(w, "text-gradient"))}
      </span>
    </h1>
  );
}

export default function Hero() {
  const { language } = useLanguage();
  const { hero } = getContent(language);
  const spotRef = useSpotlight();
  const ctaRef = useMagnetic(0.3);

  return (
    <section
      id="top"
      ref={spotRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-border-soft px-6 pt-28 pb-24 md:px-10"
    >
      {/* brighter blueprint grid that only shows around the cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(157,184,242,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(157,184,242,0.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(260px circle at var(--mx, -100%) var(--my, -100%), #000, transparent)",
          WebkitMaskImage:
            "radial-gradient(260px circle at var(--mx, -100%) var(--my, -100%), #000, transparent)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        <div>
          <div className="fade-up mb-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/60 px-4 py-1.5 backdrop-blur-sm">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-mint" />
            <span className="font-mono text-[12px] tracking-wide text-ink">
              {hero.eyebrow}
            </span>
          </div>

          <Headline text={hero.headline} accent={hero.headlineAccent} />

          <p
            className="fade-up mt-8 max-w-xl text-balance text-base leading-relaxed text-ink-muted md:text-lg"
            style={{ "--d": "650ms" }}
          >
            {hero.subline}
          </p>

          <div
            className="fade-up mt-10 flex flex-wrap items-center gap-4"
            style={{ "--d": "800ms" }}
          >
            <a
              ref={ctaRef}
              href="#projects"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-blue px-5 py-3 font-mono text-[13px] font-medium text-bg shadow-[0_8px_30px_-8px_rgba(91,141,239,0.7)]"
            >
              {/* shine sweep on hover */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">{hero.projectsCta}</span>
              <ArrowUpRight
                size={15}
                strokeWidth={2}
                className="relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/40 px-5 py-3 font-mono text-[13px] font-medium text-ink backdrop-blur-sm transition-colors duration-300 hover:border-blue hover:text-blue"
            >
              {hero.contactCta}
            </a>
          </div>

          <div
            className="fade-up mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border-soft pt-6 font-mono text-[12px] text-ink"
            style={{ "--d": "950ms" }}
          >
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

        <CodeWindow
          role={profile.role}
          focus={hero.codeFocus}
          labels={{
            compiling: hero.compiling,
            compiled: hero.compiled,
            errors: hero.errors,
          }}
        />
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
        <a
          href="#about"
          aria-label={hero.scrollLabel}
          className="fade-up flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim transition-colors hover:text-blue-soft"
          style={{ "--d": "1300ms" }}
        >
          scroll
          <span className="relative h-10 w-px overflow-hidden bg-border">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-blue" />
          </span>
        </a>
      </div>
    </section>
  );
}
