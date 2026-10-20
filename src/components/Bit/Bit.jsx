import { useEffect, useEffectEvent, useRef, useState } from "react";
import { X } from "lucide-react";
import { getContent, profile } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";
import { useScrollSpy } from "../../hooks/useScroll";
import { BIT_EVENT, BIT_SECTIONS, BIT_STATE_EVENT, MINIMIZED_KEY, fill, storage } from "../../lib/bit";
import { openTerminal } from "../../lib/terminal";
import BitFace from "./BitFace";

const ENTER_DELAY_MS = 2500;
const GREET_DELAY_MS = 900;
const SLEEP_AFTER_MS = 30000;
const QUIET_GAP_MS = 5000; // minimum time between unprompted comments
const GREETED_KEY = "bit-greeted";
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

// How long a reaction shows on Bit's face before going back to idle.
const MOOD_MS = { talking: 1800, happy: 2400, sad: 3500, dance: 3200, listening: 4000 };

const media = (q) => window.matchMedia(q).matches;
const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView();

function Bubble({ message, closeLabel, onClose, onAction }) {
  return (
    <div
      key={message.id}
      className="bit-pop pointer-events-auto absolute bottom-full right-0 mb-3 w-[min(19rem,calc(100vw-2rem))] rounded-xl border border-border bg-surface-2/95 p-4 pr-9 text-[13.5px] leading-relaxed text-ink shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-md"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md text-ink-dim transition-colors hover:bg-surface hover:text-ink"
      >
        <X size={13} strokeWidth={1.75} />
      </button>
      <p>{message.text}</p>
      {message.actions?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {message.actions.map((item, i) => (
            <button
              key={item.action}
              type="button"
              onClick={() => onAction(item.action)}
              className={`rounded-full px-3 py-1 font-mono text-[11.5px] transition-colors duration-300 ${
                i === 0
                  ? "bg-blue text-bg hover:bg-blue-soft"
                  : "border border-border text-ink-muted hover:border-blue hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      {/* tail pointing at Bit */}
      <span className="absolute -bottom-[7px] right-9 h-3 w-3 rotate-45 border-b border-r border-border bg-surface-2" />
    </div>
  );
}

function Menu({ items, label, onSelect, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.querySelector("button")?.focus();
  }, []);

  const onKeyDown = (e) => {
    const buttons = [...ref.current.querySelectorAll("button")];
    const i = buttons.indexOf(document.activeElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      buttons[(i + step + buttons.length) % buttons.length]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose(true);
    }
  };

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="bit-pop pointer-events-auto absolute bottom-full right-0 mb-3 w-60 overflow-hidden rounded-xl border border-border bg-surface-2/95 p-1.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-md"
    >
      {items.map((item) => (
        <button
          key={item.action}
          type="button"
          role="menuitem"
          onClick={() => onSelect(item.action)}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left font-mono text-[12.5px] text-ink-muted outline-none transition-colors hover:bg-surface hover:text-ink focus-visible:bg-surface focus-visible:text-ink"
        >
          <span className="text-blue-soft" aria-hidden="true">
            ›
          </span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Bit, the site's scripted mascot. No AI: everything it says lives in
 * content.js. It comments on each section once, runs a guided tour, reacts
 * to events sent with `emitBit()` and falls asleep when left alone.
 *
 * Bubble and menu buttons carry an action name instead of a callback, so
 * every behavior goes through `runAction`.
 */
export default function Bit() {
  const { language } = useLanguage();
  const script = getContent(language).bit;

  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(() => storage.get("localStorage", MINIMIZED_KEY) === "1");
  const [mood, setMood] = useState("idle");
  const [message, setMessage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // Phones get Bit as a quiet button: no unprompted bubbles over the content.
  const [chatty] = useState(() => media("(min-width: 768px)"));

  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const timers = useRef({});
  const tour = useRef(null); // index of the current tour stop, or null
  const seen = useRef(new Set());
  const lastSaid = useRef(0);
  const factIndex = useRef(0);

  const later = (name, fn, ms) => {
    clearTimeout(timers.current[name]);
    timers.current[name] = setTimeout(fn, ms);
  };

  const isBusy = () => menuOpen || tour.current !== null;

  const react = (nextMood) => {
    setMood(nextMood);
    if (MOOD_MS[nextMood]) later("mood", () => setMood("idle"), MOOD_MS[nextMood]);
  };

  /** Shows a bubble. Bubbles with buttons stay longer so people can answer. */
  const say = (text, { mood: nextMood = "talking", actions, ms } = {}) => {
    lastSaid.current = Date.now();
    setMenuOpen(false); // whatever Bit says takes over the menu
    setMessage({ id: lastSaid.current, text, actions });
    react(nextMood);
    const duration = ms ?? (actions ? 15000 : Math.min(9000, 3500 + text.length * 45));
    later("message", () => setMessage(null), duration);
  };

  const dismiss = () => {
    tour.current = null;
    clearTimeout(timers.current.message);
    setMessage(null);
  };

  const tourStep = (i) => {
    if (i >= BIT_SECTIONS.length) {
      tour.current = null;
      say(script.tourDone, { mood: "happy", ms: 9000 });
      return;
    }
    const id = BIT_SECTIONS[i];
    tour.current = i;
    seen.current.add(id);
    scrollToSection(id);
    const isLast = i === BIT_SECTIONS.length - 1;
    say(script.tour[id], {
      ms: 30000,
      actions: [
        { label: isLast ? script.finish : script.next, action: "tour-next" },
        { label: script.exitTour, action: "dismiss" },
      ],
    });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      say(script.say.copied, { mood: "happy" });
    } catch {
      say(fill(script.say.copyFailed, { email: profile.email }), { mood: "sad" });
    }
  };

  const runAction = (action) => {
    switch (action) {
      case "tour-start":
        return tourStep(0);
      case "tour-next":
        return tourStep((tour.current ?? -1) + 1);
      case "tour-no":
        return say(script.tourNoReply);
      case "dismiss":
        return dismiss();
      case "projects":
        scrollToSection("projects");
        return say(script.say.projects, { mood: "happy" });
      case "contact":
        tour.current = null;
        scrollToSection("contact");
        return say(script.say.contact, { mood: "happy" });
      case "copy":
        return copyEmail();
      case "terminal":
        dismiss();
        return openTerminal();
      case "fact":
        say(script.facts[factIndex.current % script.facts.length], { ms: 9000 });
        factIndex.current += 1;
        return;
      case "minimize":
        dismiss();
        setMinimized(true);
        return storage.set("localStorage", MINIMIZED_KEY, "1");
      case "dance":
        setMinimized(false);
        return say(script.say.dance, { mood: "dance", ms: 3200 });
      default:
    }
  };

  // --- menu ---------------------------------------------------------------
  const closeMenu = (restoreFocus) => {
    setMenuOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  };

  const toggleMenu = () => {
    if (menuOpen) return closeMenu(false);
    tour.current = null;
    clearTimeout(timers.current.message);
    setMessage(null);
    if (mood === "sleeping") setMood("idle");
    setMenuOpen(true);
  };

  // --- entrance and greeting --------------------------------------------
  const greet = useEffectEvent(() => {
    if (!chatty || minimized || storage.get("sessionStorage", GREETED_KEY)) return;
    storage.set("sessionStorage", GREETED_KEY, "1");
    say(script.greeting, {
      mood: "happy",
      actions: [
        { label: script.tourYes, action: "tour-start" },
        { label: script.tourNo, action: "tour-no" },
      ],
    });
  });

  useEffect(() => {
    const all = timers.current;
    const enter = setTimeout(() => setVisible(true), ENTER_DELAY_MS);
    const hello = setTimeout(greet, ENTER_DELAY_MS + GREET_DELAY_MS);
    return () => {
      clearTimeout(enter);
      clearTimeout(hello);
      Object.values(all).forEach(clearTimeout);
    };
  }, []);

  // --- one comment per section, the first time it is reached ------------
  const active = useScrollSpy(BIT_SECTIONS);

  const commentOn = useEffectEvent((id) => {
    if (!visible || minimized || !chatty || isBusy() || seen.current.has(id)) return;
    if (Date.now() - lastSaid.current < QUIET_GAP_MS) return;
    seen.current.add(id);
    say(script.sections[id]);
  });

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => commentOn(active), 700);
    return () => clearTimeout(timer);
  }, [active]);

  // --- events from the rest of the page (emitBit) and the Konami code ----
  const onBitEvent = useEffectEvent(({ type, title, tech }) => {
    if (type === "dance") return runAction("dance");
    if (type === "open-menu") {
      setMinimized(false);
      storage.set("localStorage", MINIMIZED_KEY, "0");
      if (!menuOpen) toggleMenu();
      return;
    }
    if (minimized) return;

    // On phones Bit only changes its face; no bubbles over the content.
    const comment = (text, opts = {}) => (chatty ? say(text, opts) : react(opts.mood ?? "talking"));

    switch (type) {
      case "copied":
        return react("happy");
      case "listening":
        if (mood === "idle" || mood === "listening") react("listening");
        return;
      case "sending":
        clearTimeout(timers.current.mood);
        return setMood("thinking");
      case "sent":
        return comment(script.say.sent, { mood: "happy" });
      case "mailto":
        return comment(script.say.mailto, { mood: "happy" });
      case "error":
        return comment(script.say.sendError, {
          mood: "sad",
          actions: [{ label: script.copyAction, action: "copy" }],
        });
      case "run":
        return comment(script.say.run, { mood: "happy" });
      case "unavailable":
        return comment(script.say.unavailable, { mood: "sad", ms: 4500 });
      case "pinged":
        return comment(script.say.pinged, { mood: "happy" });
      case "tech":
        if (!isBusy()) comment(fill(script.say.tech, { tech }));
        return;
      case "project": {
        if (!title || isBusy()) return;
        const lines = script.project;
        return comment(fill(lines[Math.floor(Math.random() * lines.length)], { title }), {
          mood: "happy",
          actions: [{ label: script.menu.contact, action: "contact" }],
        });
      }
      default:
    }
  });

  useEffect(() => {
    const onEvent = (e) => onBitEvent(e.detail);
    let pos = 0;
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea, [contenteditable]")) return;
      pos = e.key === KONAMI[pos] ? pos + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        onBitEvent({ type: "dance" });
      }
    };
    window.addEventListener(BIT_EVENT, onEvent);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(BIT_EVENT, onEvent);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Let the nav know whether Bit is hidden.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(BIT_STATE_EVENT, { detail: { minimized } }));
  }, [minimized]);

  // --- falls asleep when nobody moves, wakes up on any activity ----------
  const nap = useEffectEvent(() => {
    later("sleep", () => {
      if (isBusy()) return; // the next bit of activity schedules another nap
      setMessage(null);
      setMood("sleeping");
    }, SLEEP_AFTER_MS);
  });

  const wake = useEffectEvent(() => {
    if (mood === "sleeping") {
      setMood("idle");
      if (chatty && !minimized) say(script.say.wake, { mood: "happy" });
    }
    nap();
  });

  useEffect(() => {
    let last = 0;
    const onActivity = () => {
      const now = Date.now();
      if (now - last < 250) return; // pointermove fires a lot
      last = now;
      wake();
    };
    const events = ["pointermove", "pointerdown", "keydown", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));
    nap();
    return () => events.forEach((ev) => window.removeEventListener(ev, onActivity));
  }, []);

  // --- eyes follow the cursor (a CSS transition does the smoothing) ------
  useEffect(() => {
    const node = rootRef.current;
    if (!node || !media("(pointer: fine)") || media("(prefers-reduced-motion: reduce)")) return;
    let frame = null;
    let point = null;
    const update = () => {
      frame = null;
      const rect = node.getBoundingClientRect();
      const dx = point.x - (rect.left + rect.width / 2);
      const dy = point.y - (rect.top + rect.height * 0.4);
      const len = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, len / 300);
      node.style.setProperty("--ex", `${((dx / len) * 3.5 * reach).toFixed(2)}px`);
      node.style.setProperty("--ey", `${((dy / len) * 2.5 * reach).toFixed(2)}px`);
    };
    const onMove = (e) => {
      point = { x: e.clientX, y: e.clientY };
      if (frame === null) frame = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [visible, minimized]);

  // Click outside closes the menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setMenuOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [menuOpen]);

  const restore = () => {
    setMinimized(false);
    storage.set("localStorage", MINIMIZED_KEY, "0");
    say(script.say.back, { mood: "happy" });
  };

  const menuItems = ["tour-start", "projects", "contact", "copy", "terminal", "fact", "minimize"].map(
    (action) => ({ action, label: script.menu[action === "tour-start" ? "tour" : action] })
  );

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end md:bottom-6 md:right-6"
    >
      {/* screen readers hear what Bit says without having to find the bubble */}
      <div aria-live="polite" className="sr-only">
        {message?.text}
      </div>

      {minimized ? (
        <button
          type="button"
          onClick={restore}
          aria-label={script.restoreLabel}
          className="bit-pop pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-surface-2/90 px-3.5 py-2 font-mono text-[12px] text-ink-muted shadow-xl backdrop-blur-md transition-colors hover:border-blue hover:text-ink"
        >
          <span className="status-dot h-1.5 w-1.5 rounded-full bg-blue" />
          {script.name}
        </button>
      ) : (
        <div className="relative">
          {menuOpen ? (
            <Menu
              items={menuItems}
              label={script.menuLabel}
              onClose={closeMenu}
              onSelect={(action) => {
                closeMenu(false);
                runAction(action);
              }}
            />
          ) : (
            message && (
              <Bubble message={message} closeLabel={script.closeBubble} onClose={dismiss} onAction={runAction} />
            )
          )}

          <button
            ref={buttonRef}
            type="button"
            onClick={toggleMenu}
            aria-label={script.buttonLabel}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            // the frosted backdrop keeps Bit readable over text and images
            className="bit-enter bit-button pointer-events-auto block h-[74px] w-[64px] rounded-[22px] border border-blue/45 bg-surface/90 px-1.5 pb-1 pt-2 shadow-[0_14px_40px_-12px_rgba(0,0,0,0.75),0_0_28px_-6px_rgba(91,141,239,0.55)] outline-offset-4 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-blue hover:shadow-[0_14px_40px_-12px_rgba(0,0,0,0.75),0_0_36px_-4px_rgba(91,141,239,0.7)] md:h-[98px] md:w-[86px] md:px-2 md:pb-1.5 md:pt-3"
          >
            <BitFace mood={mood} />
          </button>
        </div>
      )}
    </div>
  );
}
