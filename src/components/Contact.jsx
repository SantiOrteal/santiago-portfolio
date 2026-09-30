import { useEffect, useRef, useState } from "react";
import { ArrowUp, Check, Copy, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { useReveal } from "../hooks/useReveal";
import { useMagnetic, useSpotlight } from "../hooks/usePointer";
import { getContent, profile } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import SectionHeader from "./SectionHeader";

function MagneticLink({ href, children }) {
  const ref = useMagnetic(0.2);
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2.5 rounded-md border border-border bg-surface/40 px-5 py-3.5 font-mono text-[13px] text-ink backdrop-blur-sm transition-colors duration-300 hover:border-blue hover:text-blue"
    >
      {children}
    </a>
  );
}

export default function Contact() {
  const revealRef = useReveal();
  const spotRef = useSpotlight();
  const copyRef = useMagnetic(0.12);
  const { language } = useLanguage();
  const { contact } = getContent(language);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (copyTimeoutRef.current !== null) {
        clearTimeout(copyTimeoutRef.current);
      }
    },
    []
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (copyTimeoutRef.current !== null) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        copyTimeoutRef.current = null;
      }, 2200);
    } catch {
      // clipboard no disponible; el correo sigue visible para copiarlo a mano
    }
  };

  return (
    <section id="contact" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="06" label={contact.label} />

        <div
          ref={spotRef}
          className="spotlight relative mt-10 overflow-hidden rounded-2xl border border-border bg-surface/50 p-8 md:p-14"
        >
          {/* decorative rings */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-dim/60 md:h-96 md:w-96"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 animate-[float-y_6s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-blue/25 to-violet/10 blur-2xl md:h-56 md:w-56"
          />

          <div ref={revealRef} className="reveal-stagger relative">
            <h2
              style={{ "--i": 0 }}
              className="text-balance max-w-2xl font-display text-3xl font-medium leading-tight text-ink md:text-5xl"
            >
              {contact.heading}
            </h2>
            <p
              style={{ "--i": 1 }}
              className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-muted md:text-base"
            >
              {contact.body}
            </p>

            <div
              style={{ "--i": 2 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <button
                ref={copyRef}
                type="button"
                onClick={handleCopy}
                aria-label={copied ? contact.copiedLabel : contact.copyLabel}
                className="group inline-flex items-center justify-center gap-3 rounded-md bg-blue px-5 py-3.5 font-mono text-[13px] font-medium text-bg shadow-[0_8px_30px_-8px_rgba(91,141,239,0.7)]"
              >
                <Mail size={16} strokeWidth={1.75} />
                <span className="truncate">{profile.email}</span>
                <span className="relative h-3.5 w-3.5">
                  <Copy
                    size={14}
                    strokeWidth={1.75}
                    className={`absolute inset-0 transition-all duration-300 ${
                      copied ? "scale-50 opacity-0" : "scale-100 opacity-100"
                    }`}
                  />
                  <Check
                    size={14}
                    strokeWidth={2.25}
                    className={`absolute inset-0 transition-all duration-300 ${
                      copied ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    }`}
                  />
                </span>
              </button>

              <MagneticLink href={profile.github}>
                <GithubIcon size={16} />
                {contact.githubLabel}
              </MagneticLink>
              <MagneticLink href={profile.linkedin}>
                <LinkedinIcon size={16} />
                {contact.linkedinLabel}
              </MagneticLink>
            </div>
          </div>
        </div>

        <footer className="mt-20 flex flex-col gap-4 border-t border-border-soft pt-8 font-mono text-[11px] text-ink-dim sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {profile.name} · {contact.madeWith}
          </span>
          <span className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="status-dot h-1.5 w-1.5 rounded-full bg-blue" />
              {profile.location}
            </span>
            <a
              href="#top"
              aria-label={contact.backToTop}
              className="group flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-blue hover:text-blue"
            >
              <ArrowUp
                size={14}
                strokeWidth={1.75}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </a>
          </span>
        </footer>
      </div>

      {/* toast */}
      <div aria-live="polite" className="sr-only">
        {copied ? contact.copiedLabel : ""}
      </div>
      {copied && (
        <div className="fixed bottom-6 left-1/2 z-50 flex animate-[toast-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both] items-center gap-2 rounded-full border border-border bg-surface-2/90 px-4 py-2.5 font-mono text-[12px] text-ink shadow-2xl backdrop-blur-md">
          <Check size={14} strokeWidth={2.25} className="text-mint" />
          {contact.copiedLabel}
        </div>
      )}
    </section>
  );
}
