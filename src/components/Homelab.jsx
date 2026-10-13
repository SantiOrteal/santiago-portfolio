import { useEffect, useRef, useState } from "react";
import { Activity, Check, Database, Network, Workflow } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { useSpotlight } from "../hooks/usePointer";
import { getContent } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import { emitBit, fill } from "../lib/bit";
import SectionLabel from "./SectionLabel";
import Tip from "./Tip";
import homelabStack from "../assets/homelab-stack.svg";

const groupIcons = [Network, Workflow, Database];
const PING_STEP_MS = 170;
const PING_HOLD_MS = 4500; // how long the ✓ marks stay after a ping

/** LED for one service: idle blink, being pinged, or answered. */
function Led({ state, delay }) {
  if (state === "ok") {
    return (
      <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-mint/15 text-mint" aria-hidden="true">
        <Check size={9} strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="flex h-3 w-3 shrink-0 items-center justify-center" aria-hidden="true">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          state === "pinging"
            ? "scale-150 bg-blue shadow-[0_0_8px_rgba(91,141,239,0.9)]"
            : "led-blink bg-mint/70 shadow-[0_0_6px_rgba(110,231,183,0.6)]"
        } transition-transform duration-200`}
        style={{ animationDelay: delay }}
      />
    </span>
  );
}

function HomelabGroup({ group, index, offset, notes, ledState }) {
  const Icon = groupIcons[index];
  const spotRef = useSpotlight();

  return (
    // Outer div takes the stagger reveal; the article keeps its own hover transition.
    <div style={{ "--i": index }}>
      <article
        ref={spotRef}
        className="spotlight group h-full rounded-lg border border-border-soft bg-surface/40 p-5 transition-[border-color,translate] duration-500 hover:-translate-y-1 hover:border-border"
      >
        <div className="flex items-center gap-3">
          <Icon
            size={18}
            strokeWidth={1.75}
            className="text-blue transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"
            aria-hidden="true"
          />
          <h3 className="font-display text-lg font-medium text-ink">
            {group.title}
          </h3>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
          {group.description}
        </p>
        <ul className="mt-5 space-y-2.5">
          {group.services.map((service, i) => (
            <li key={service} className="flex items-center gap-2 font-mono text-[12px] text-ink-muted">
              {/* status LED, like a service running on the rack */}
              <Led state={ledState(offset + i)} delay={`${((offset + i) * 0.37) % 3}s`} />
              {notes[service] ? (
                <Tip
                  tip={notes[service]}
                  align="left"
                  className="text-left underline decoration-border decoration-dotted underline-offset-4 transition-colors hover:text-ink hover:decoration-blue-soft"
                >
                  {service}
                </Tip>
              ) : (
                <span>{service}</span>
              )}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

export default function Homelab() {
  const { language } = useLanguage();
  const { homelab } = getContent(language);
  const revealRef = useReveal();
  const imageRef = useReveal();
  const groupsRef = useReveal();

  // Ping walks through every service once, like a tiny health check.
  const total = homelab.groups.reduce((n, g) => n + g.services.length, 0);
  const [checked, setChecked] = useState(-1); // -1 = idle, total = all answered
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const running = checked >= 0 && checked < total;
  const finished = checked === total;

  const ping = () => {
    if (running) return;
    const step = (n) => {
      setChecked(n);
      if (n < total) {
        timer.current = setTimeout(() => step(n + 1), PING_STEP_MS);
      } else {
        emitBit("pinged");
        timer.current = setTimeout(() => setChecked(-1), PING_HOLD_MS);
      }
    };
    step(0);
  };

  const ledState = (i) => (checked < 0 ? "idle" : i < checked ? "ok" : i === checked ? "pinging" : "idle");
  const offsets = homelab.groups.map((_, g) =>
    homelab.groups.slice(0, g).reduce((n, group) => n + group.services.length, 0)
  );

  return (
    <section
      id="homelab"
      className="border-b border-border-soft px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="05">{homelab.label}</SectionLabel>

        <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1fr_0.72fr] lg:gap-16">
          <div ref={revealRef} className="reveal-stagger max-w-3xl">
            <h2
              style={{ "--i": 0 }}
              className="text-balance font-display text-3xl font-medium leading-tight text-ink md:text-4xl"
            >
              {homelab.heading}
            </h2>
            <p
              style={{ "--i": 1 }}
              className="mt-5 text-[15px] leading-relaxed text-ink-muted md:text-base"
            >
              {homelab.intro}
            </p>
          </div>

          <div ref={imageRef} className="reveal [transition-delay:150ms]">
            <img
              src={homelabStack}
              alt="Abstract server rack representing a personal homelab"
              className="w-full max-h-44 animate-[float-y_7s_ease-in-out_infinite] rounded-xl border border-border object-contain opacity-95"
            />
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-end gap-4">
          <span aria-live="polite" className="font-mono text-[11px] text-ink-dim">
            {running && homelab.pinging}
            {finished && (
              <span className="text-mint">✓ {fill(homelab.pingDone, { ok: total, total })}</span>
            )}
          </span>
          <button
            type="button"
            onClick={ping}
            disabled={running}
            className="group inline-flex items-center gap-2 rounded-md border border-border bg-surface/40 px-3.5 py-2 font-mono text-[12px] text-ink-muted transition-colors duration-300 hover:border-mint/60 hover:text-mint disabled:opacity-60"
          >
            <Activity size={14} strokeWidth={1.75} className={running ? "animate-pulse text-mint" : ""} />
            {homelab.ping}
          </button>
        </div>

        <div
          ref={groupsRef}
          className="reveal-stagger mt-5 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {homelab.groups.map((group, index) => (
            <HomelabGroup
              key={group.title}
              group={group}
              index={index}
              offset={offsets[index]}
              notes={homelab.serviceNotes}
              ledState={ledState}
            />
          ))}
        </div>

        <p className="mt-12 max-w-3xl border-t border-border-soft pt-6 text-[15px] leading-relaxed text-blue-soft md:text-base">
          {homelab.outro}
        </p>
      </div>
    </section>
  );
}
