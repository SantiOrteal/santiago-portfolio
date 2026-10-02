import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SquareTerminal } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { getContent, profile } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import { useScrollProgress, useScrollSpy } from "../hooks/useScroll";
import { openTerminal, shortcutLabel } from "../lib/terminal";

const ids = ["about", "experience", "projects", "skills", "homelab", "contact"];

export default function Nav() {
  const { language, setLanguage } = useLanguage();
  const content = getContent(language);
  const links = ids.map((id) => ({ href: `#${id}`, id, label: content.nav[id] }));

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(ids);

  const progressRef = useRef(null);
  const navRef = useRef(null);
  const [pill, setPill] = useState(null);

  useScrollProgress(
    useCallback(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      setScrolled(window.scrollY > 12);
    }, [])
  );

  // Slide the highlight pill under the active link (re-measure on language
  // change because the labels change width).
  useLayoutEffect(() => {
    const el = navRef.current?.querySelector(`[data-id="${active}"]`);
    setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [active, language]);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-b border-border-soft bg-bg/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 md:px-10">
        <a
          href="#top"
          className="group font-display text-sm font-semibold tracking-[0.18em] text-ink"
        >
          SANTIAGO
          <span className="inline-block text-blue transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-150">
            .
          </span>
          ORTEGA
        </a>

        <nav
          ref={navRef}
          aria-label="Main"
          className="relative hidden items-center rounded-full border border-border-soft bg-surface/40 p-1 backdrop-blur-md lg:flex"
        >
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 rounded-full bg-surface-2 ring-1 ring-border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              left: pill?.left ?? 0,
              width: pill?.width ?? 0,
              opacity: pill ? 1 : 0,
            }}
          />
          {links.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                data-id={link.id}
                aria-current={isActive ? "true" : undefined}
                className={`relative rounded-full px-3.5 py-1.5 font-mono text-[12.5px] transition-colors duration-300 ${
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            onClick={openTerminal}
            aria-label={`${content.terminal.openLabel} (${shortcutLabel()})`}
            title={`${content.terminal.openLabel} · ${shortcutLabel()}`}
            className="text-ink-muted transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-blue"
          >
            <SquareTerminal size={18} strokeWidth={1.75} />
          </button>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub de Santiago Ortega"
            className="text-ink-muted transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-blue"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn de Santiago Ortega"
            className="text-ink-muted transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-blue"
          >
            <LinkedinIcon size={18} />
          </a>
          <LanguageSwitch language={language} setLanguage={setLanguage} />
        </div>

        {/* Hamburger that morphs into an X */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? content.nav.closeMenu : content.nav.openMenu}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="relative h-9 w-9 text-ink lg:hidden"
        >
          <span
            className={`absolute left-2 right-2 h-[1.5px] rounded bg-current transition-transform duration-300 ${
              open ? "top-1/2 rotate-45" : "top-[13px]"
            }`}
          />
          <span
            className={`absolute left-2 right-2 top-1/2 h-[1.5px] rounded bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-2 right-2 h-[1.5px] rounded bg-current transition-transform duration-300 ${
              open ? "top-1/2 -rotate-45" : "bottom-[13px]"
            }`}
          />
        </button>
      </div>

      {/* Mobile menu: grid-rows trick animates height without measuring */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <nav aria-label="Mobile" className="overflow-hidden" inert={!open}>
          <div className="flex flex-col gap-1 border-t border-border-soft px-6 py-5">
            {links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between py-2.5 font-display text-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                } ${active === link.id ? "text-ink" : "text-ink-muted"}`}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                {link.label}
                <span className="font-mono text-[11px] text-ink-dim">
                  0{i + 1}
                </span>
              </a>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-border-soft pt-5">
              <div className="flex gap-5">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openTerminal();
                  }}
                  aria-label={content.terminal.openLabel}
                  className="text-ink-muted hover:text-blue"
                >
                  <SquareTerminal size={20} strokeWidth={1.75} />
                </button>
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
          </div>
        </nav>
      </div>

      {/* Reading progress */}
      <div
        ref={progressRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-gradient-to-r from-blue via-violet to-blue-soft"
        style={{ transform: "scaleX(0)" }}
      />
    </header>
  );
}

function LanguageSwitch({ language, setLanguage }) {
  // Segmented control with a thumb that slides between the two options.
  const isEn = language === "en";
  return (
    <div
      role="group"
      aria-label="Language selector"
      className="relative grid grid-cols-2 rounded-full border border-border-soft bg-surface/40 p-0.5 font-mono text-[11px]"
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-blue-dim transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isEn ? "translate-x-full" : "translate-x-0"
        }`}
      />
      <button
        type="button"
        onClick={() => setLanguage("es-MX")}
        aria-pressed={!isEn}
        className={`relative px-2.5 py-1 transition-colors duration-300 ${
          !isEn ? "text-blue-soft" : "text-ink-dim hover:text-ink"
        }`}
      >
        ES-MX
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={isEn}
        className={`relative px-2.5 py-1 transition-colors duration-300 ${
          isEn ? "text-blue-soft" : "text-ink-dim hover:text-ink"
        }`}
      >
        EN
      </button>
    </div>
  );
}
