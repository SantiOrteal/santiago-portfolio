import { useEffect, useMemo, useState } from "react";
import { useTilt } from "../hooks/usePointer";

// Each line is a list of [tokenType, text] pairs so the typing effect can
// keep syntax colors while revealing one character at a time.
const buildCode = (role, focus) => [
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
  [["key", "  available"], ["op", ": "], ["kw", "true"], ["op", ","]],
  [["op", "};"]],
  [],
  [["kw", "export default "], ["fn", "ship"], ["op", "("], ["var", "santiago"], ["op", ");"]],
];

const colors = {
  kw: "text-violet",
  var: "text-ink",
  op: "text-ink-dim",
  key: "text-blue-soft",
  str: "text-mint",
  num: "text-[#f5b97a]",
  fn: "text-blue",
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
      parts.push({ type, text: slice });
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

export default function CodeWindow({ role, focus, labels }) {
  const tiltRef = useTilt(5);
  const code = useMemo(() => buildCode(role, focus), [role, focus]);
  const totalChars = countChars(code);
  const [typed, setTyped] = useState(() => (prefersReduced() ? Infinity : 0));
  const done = typed >= totalChars;
  const lines = sliceCode(code, typed);

  useEffect(() => {
    if (prefersReduced()) return;
    let raf;
    let start;
    const startDelay = 1100; // let the headline land first
    const charsPerSecond = 60;
    // `typed` only ever grows, so switching language never re-types text
    // that is already on screen; it just extends to the new length.
    const tick = (t) => {
      start ??= t;
      const elapsed = Math.max(0, t - start - startDelay);
      const next = Math.floor((elapsed / 1000) * charsPerSecond);
      setTyped((prev) => Math.max(prev, next));
      if (next < totalChars) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalChars]);

  return (
    <div className="fade-up relative [--d:500ms]">
      {/* soft glow behind the window */}
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-blue/20 via-violet/10 to-transparent blur-3xl" />

      <div
        ref={tiltRef}
        className="overflow-hidden rounded-xl border border-border bg-surface/80 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md will-change-transform"
      >
        <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2/60 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
          <span className="ml-3 font-mono text-[11px] text-ink-dim">
            santiago.config.ts
          </span>
          <span className="ml-auto rounded bg-blue-dim/60 px-1.5 py-0.5 font-mono text-[10px] text-blue-soft">
            TS
          </span>
        </div>

        <pre className="min-h-[268px] overflow-x-auto px-0 py-4 font-mono text-[12.5px] leading-[1.75]">
          {lines.map(({ parts, isCaretLine }, i) => (
            <div key={i} className="flex">
              <span className="w-10 shrink-0 select-none pr-4 text-right text-ink-dim/50">
                {i + 1}
              </span>
              <code>
                {parts.map((p, j) => (
                  <span key={j} className={colors[p.type]}>
                    {p.text}
                  </span>
                ))}
                {isCaretLine && (
                  <span className="caret -mb-0.5 ml-px inline-block h-[1.1em] w-[7px] translate-y-[2px] bg-blue" />
                )}
              </code>
            </div>
          ))}
        </pre>

        <div className="flex items-center justify-between border-t border-border-soft px-4 py-2.5 font-mono text-[11px]">
          <span className="flex items-center gap-2 text-ink-dim">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                done ? "bg-mint" : "bg-[#febc2e]"
              }`}
            />
            {done ? labels.compiled : labels.compiling}
          </span>
          <span
            className={`text-mint transition-opacity duration-500 ${
              done ? "opacity-100" : "opacity-0"
            }`}
          >
            ✓ {labels.errors}
          </span>
        </div>
      </div>
    </div>
  );
}
