import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { useReveal } from "../hooks/useReveal";
import { contact, profile } from "../data/content";
import SectionLabel from "./SectionLabel";

export default function Contact() {
  const revealRef = useReveal();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard no disponible; el correo sigue visible para copiarlo a mano
    }
  };

  return (
    <section id="contact" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>Contacto</SectionLabel>

        <div ref={revealRef} className="reveal mt-10">
          <h2 className="text-balance max-w-2xl font-display text-3xl font-medium leading-tight text-ink md:text-5xl">
            {contact.heading}
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-muted md:text-base">
            {contact.body}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={handleCopy}
              className="group inline-flex items-center gap-3 rounded-md border border-border bg-surface px-5 py-3.5 font-mono text-[13px] text-ink transition-colors duration-200 hover:border-blue"
            >
              <Mail size={16} strokeWidth={1.75} className="text-blue" />
              {profile.email}
              {copied ? (
                <Check size={14} strokeWidth={2} className="text-blue" />
              ) : (
                <Copy
                  size={14}
                  strokeWidth={1.75}
                  className="text-ink-muted transition-colors group-hover:text-blue-soft"
                />
              )}
            </button>

            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-md border border-border px-5 py-3.5 font-mono text-[13px] text-ink transition-colors duration-200 hover:border-blue hover:text-blue"
            >
              <GithubIcon size={16} />
              GitHub
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-md border border-border px-5 py-3.5 font-mono text-[13px] text-ink transition-colors duration-200 hover:border-blue hover:text-blue"
            >
              <LinkedinIcon size={16} />
              LinkedIn
            </a>
          </div>
        </div>

        <footer className="mt-24 flex flex-col gap-3 border-t border-border-soft pt-8 font-mono text-[11px] text-ink-dim sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span className="flex items-center gap-2">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-blue" />
            {profile.location}
          </span>
        </footer>
      </div>
    </section>
  );
}
