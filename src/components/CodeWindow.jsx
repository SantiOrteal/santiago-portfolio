import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useTilt } from "../hooks/usePointer";
import { emitBit } from "../lib/bit";

// Each line is a list of [tokenType, text] pairs so the typing effect can
// keep syntax colors while revealing one character at a time. The
// "toggle" token is the clickable `available` value.
const buildConfig = (role, focus, available) => [
  [["kw", "const "], ["var", "santiago"], ["op", " = {"]],
  [["key", "  role"], ["op", ": "], ["str", `"${role}"`], ["op", ","]],
  [["key", "  since"], ["op", ": "], ["num", "2019"], ["op", ","]],
  [
    ["key", "  stack"],
    ["op", ": ["],
    ["str", '"React"'],
    ["op", ", "],
    ["str", '"TypeScript"'],
    ["op", ", "],
    ["str", '"Node.js"'],
    ["op", "],"],
  ],
  [["key", "  focus"], ["op", ": "], ["str", `"${focus}"`], ["op", ","]],
  [["key", "  available"], ["op", ": "], ["toggle", String(available)], ["op", ","]],
  [["op", "};"]],
  [],
  [["kw", "export default "], ["fn", "ship"], ["op", "("], ["var", "santiago"], ["op", ");"]],
];

// Tech names are the same in both languages, so stack.json is static.
const STACK = [
  ["frontend", ["React", "TypeScript", "Tailwind CSS"]],
  ["backend", ["Node.js", "Java", "Spring Boot"]],
  ["ops", ["Docker", "Linux", "Cloudflare"]],
  ["observability", ["Dynatrace", "Kibana"]],
];
const buildStack = () => [
  [["op", "{"]],
  ...STACK.map(([key, items], i) => [
    ["key", `  "${key}"`],
    ["op", ": ["],
    ...items.flatMap((item, j) => [
      ["str", `"${item}"`],
      ...(j < items.length - 1 ? [["op", ", "]] : []),
    ]),
    ["op", i < STACK.length - 1 ? "]," : "]"],
  ]),
  [["op", "}"]],
];

// homelab.yml comes from the Homelab section, one key per group.
const YAML_KEYS = ["infra", "automation", "selfhosted"];
const buildHomelab = (groups) => [
  [["key", "homelab"], ["op", ":"]],
  ...groups.flatMap((group, i) => [
    [["key", `  ${YAML_KEYS[i] ?? `group${i + 1}`}`], ["op", ":"]],
    ...group.services.map((service) => [["op", "    - "], ["str", service]]),
  ]),
];

const TABS = [
  { file: "santiago.config.ts", badge: "TS" },
  { file: "stack.json", badge: "JSON" },
  { file: "homelab.yml", badge: "YAML" },
];

const colors = {
  kw: "text-violet",
  var: "text-ink",
  op: "text-ink-dim",
  key: "text-blue-soft",
  str: "text-mint",
  num: "text-[#f5b97a]",
  fn: "text-blue",
  toggle: "text-violet",
};

const countChars = (code) =>
  code.reduce(
    (sum, line) => sum + line.reduce((s, [, t]) => s + t.length, 0) + 1,
    0
  );

// Cut the code off after `typed` characters, keeping token colors.
function sliceCode(code, typed) {
  let remaining = typed;
  let caretPlaced = false;
  return code.map((line, li) => {
    const parts = [];
    for (const [type, text] of line) {
      if (remaining <= 0) break;
      const slice = text.slice(0, remaining);
      remaining -= slice.length;
      parts.push({ type, text: slice, full: slice === text });
    }
    // The caret sits on the first line that isn't fully typed yet.
    const isCaretLine = !caretPlaced && (remaining <= 0 || li === code.length - 1);
    if (isCaretLine) caretPlaced = true;
    remaining -= 1; // newline
    return { parts, isCaretLine };
  });
}

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CodeWindow({ role, focus, homelab, labels }) {
  const tiltRef = useTilt(5);
  const [tab, setTab] = useState(0);
  const [available, setAvailable] = useState(true);
  const [run, setRun] = useState("idle"); // idle | running | shipped
  const firstRun = useRef(true);

  const code = [buildConfig(role, focus, available), buildStack(), buildHomelab(homelab)][tab];
  const totalChars = countChars(code);
  const [typed, setTyped] = useState(() => (prefersReduced() ? Infinity : 0));
  const done = typed >= totalChars;
  const lines = sliceCode(code, typed);

  useEffect(() => {
    if (prefersReduced()) return;
    let raf;
    let start;
    // The first file waits for the headline; later tabs type faster.
    const startDelay = firstRun.current ? 1100 : 0;
    const charsPerSecond = firstRun.current ? 60 : 160;
    // `typed` only ever grows, so switching language never re-types text
    // that is already on screen; it just extends to the new length.
    const tick = (t) => {
      start ??= t;
      const elapsed = Math.max(0, t - start - startDelay);
      const next = Math.floor((elapsed / 1000) * charsPerSecond);
      setTyped((prev) => Math.max(prev, next));
      if (next < totalChars) raf = requestAnimationFrame(tick);
      else firstRun.current = false;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalChars, tab]);

  // Reset timers on unmount.
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const after = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  const switchTab = (next) => {
    if (next === tab) return;
    firstRun.current = false;
    setTyped(prefersReduced() ? Infinity : 0);
    setTab(next);
  };

  const onTabKey = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (tab + step + TABS.length) % TABS.length;
    switchTab(next);
    e.currentTarget.parentElement.children[next]?.focus();
  };

  const runCode = () => {
    if (run === "running") return;
    setRun("running");
    after(700, () => {
      setRun("shipped");
      document.getElementById("projects")?.scrollIntoView();
      emitBit("run");
    });
    after(3200, () => setRun("idle"));
  };

  // Santiago is always available: the toggle flips and comes right back.
  const toggleAvailable = () => {
    if (!available) return;
    setAvailable(false);
    emitBit("unavailable");
    after(1600, () => setAvailable(true));
  };

  const status =
    run === "running" ? labels.running : run === "shipped" ? labels.shipped : done ? labels.compiled : labels.compiling;

  return (
    <div className="fade-up relative [--d:500ms]">
      {/* soft glow behind the window */}
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-blue/20 via-violet/10 to-transparent blur-3xl" />

      <div
        ref={tiltRef}
        className="overflow-hidden rounded-xl border border-border bg-surface/80 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md will-change-transform"
      >
        <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2/60 pl-4 pr-3">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#28c840]/80" />

          <div
            role="tablist"
            aria-label={labels.tabsLabel}
            className="ml-2 flex min-w-0 overflow-x-auto [scrollbar-width:none]"
          >
            {TABS.map((t, i) => (
              <button
                key={t.file}
                type="button"
                role="tab"
                aria-selected={tab === i}
                tabIndex={tab === i ? 0 : -1}
                onClick={() => switchTab(i)}
                onKeyDown={onTabKey}
                className={`relative shrink-0 px-2.5 py-3 font-mono text-[11px] transition-colors duration-300 ${
                  tab === i ? "text-ink" : "text-ink-dim hover:text-ink-muted"
                }`}
              >
                {t.file}
                <span
                  className={`absolute inset-x-2 bottom-0 h-px bg-blue transition-transform duration-300 ${
                    tab === i ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            ))}
          </div>

          <span className="ml-auto shrink-0 rounded bg-blue-dim/60 px-1.5 py-0.5 font-mono text-[10px] text-blue-soft">
            {TABS[tab].badge}
          </span>
        </div>

        <pre
          role="tabpanel"
          aria-label={TABS[tab].file}
          className="min-h-[268px] overflow-x-auto px-0 py-4 font-mono text-[12.5px] leading-[1.75]"
        >
          {lines.map(({ parts, isCaretLine }, i) => (
            <div key={i} className="flex">
              <span className="w-10 shrink-0 select-none pr-4 text-right text-ink-dim/50">
                {i + 1}
              </span>
              <code>
                {parts.map((p, j) =>
                  p.type === "toggle" && p.full ? (
                    <button
                      key={j}
                      type="button"
                      onClick={toggleAvailable}
                      aria-pressed={available}
                      className={`rounded px-0.5 underline decoration-dotted underline-offset-4 transition-colors duration-300 ${
                        available ? "text-violet hover:bg-violet/15" : "bg-[#f5a3a3]/15 text-[#f5a3a3]"
                      }`}
                    >
                      {p.text}
                    </button>
                  ) : (
                    <span key={j} className={colors[p.type]}>
                      {p.text}
                    </span>
                  )
                )}
                {isCaretLine && (
                  <span className="caret -mb-0.5 ml-px inline-block h-[1.1em] w-[7px] translate-y-[2px] bg-blue" />
                )}
              </code>
            </div>
          ))}
        </pre>

        <div className="flex items-center justify-between gap-3 border-t border-border-soft px-4 py-2.5 font-mono text-[11px]">
          <span className="flex items-center gap-2 text-ink-dim" aria-live="polite">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                run === "running" ? "bg-violet" : done ? "bg-mint" : "bg-[#febc2e]"
              }`}
            />
            {status}
          </span>
          <span
            className={`flex items-center gap-3 transition-opacity duration-500 ${
              done ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <span className="hidden text-mint sm:inline">✓ {labels.errors}</span>
            <button
              type="button"
              onClick={runCode}
              disabled={!done || run === "running"}
              className="group inline-flex items-center gap-1.5 rounded border border-border-soft px-2 py-1 text-mint transition-colors duration-300 hover:border-mint/50 hover:bg-mint/10 disabled:opacity-60"
            >
              <Play size={11} strokeWidth={2.25} className="transition-transform duration-300 group-hover:scale-110" />
              {labels.run}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
