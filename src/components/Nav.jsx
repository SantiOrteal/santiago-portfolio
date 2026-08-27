import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { getContent, profile } from "../data/content";
import { useLanguage } from "../context/LanguageContext";

export default function Nav() {
  const { language, setLanguage } = useLanguage();
  const content = getContent(language);
  const links = [
    { href: "#about", label: content.nav.about },
    { href: "#skills", label: content.nav.skills },
    { href: "#homelab", label: content.nav.homelab },
    { href: "#experience", label: content.nav.experience },
    { href: "#projects", label: content.nav.projects },
    { href: "#contact", label: content.nav.contact },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isScrolledRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const nextScrolled = window.scrollY > 12;
      if (nextScrolled === isScrolledRef.current) return;

      isScrolledRef.current = nextScrolled;
      setScrolled(nextScrolled);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-bg/85 backdrop-blur-md border-b border-border-soft"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#top"
          className="font-display text-sm font-semibold tracking-[0.18em] text-ink"
        >
          SANTIAGO<span className="text-blue">.</span>ORTEGA
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[13px] text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub de Santiago Ortega"
            className="text-ink-muted transition-colors hover:text-blue"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn de Santiago Ortega"
            className="text-ink-muted transition-colors hover:text-blue"
          >
            <LinkedinIcon size={18} />
          </a>
          <LanguageSwitch language={language} setLanguage={setLanguage} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? content.nav.closeMenu : content.nav.openMenu}
          aria-expanded={open}
          className="text-ink md:hidden"
        >
          {open ? (
            <X size={22} strokeWidth={1.75} />
          ) : (
            <Menu size={22} strokeWidth={1.75} />
          )}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border-soft bg-bg px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-mono text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-5 pt-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub de Santiago Ortega"
                className="text-ink-muted hover:text-blue"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn de Santiago Ortega"
                className="text-ink-muted hover:text-blue"
              >
                <LinkedinIcon size={20} />
              </a>
            </div>
            <LanguageSwitch language={language} setLanguage={setLanguage} />
          </div>
        </nav>
      )}
    </header>
  );
}

function LanguageSwitch({ language, setLanguage }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[11px]" aria-label="Language selector">
      <button type="button" onClick={() => setLanguage("es-MX")} className={language === "es-MX" ? "text-blue" : "text-ink-dim transition-colors hover:text-ink"}>
        ES-MX
      </button>
      <span className="text-border">/</span>
      <button type="button" onClick={() => setLanguage("en")} className={language === "en" ? "text-blue" : "text-ink-dim transition-colors hover:text-ink"}>
        EN
      </button>
    </div>
  );
}
