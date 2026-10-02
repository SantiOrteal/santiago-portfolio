import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { getContent, profile } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import { OPEN_EVENT, complete, rich, runCommand } from "../lib/terminal";

const EXIT_MS = 300; // matches the modal exit animations in index.css
const PROMPT = "santiago@portfolio:~$";

const tones = {
  accent: "text-blue-soft",
  muted: "text-ink-dim",
  ok: "text-mint",
  err: "text-[#f5a3a3]",
  key: "text-ink font-medium",
  warn: "text-[#f5b97a]",
};

const welcomeLines = (t) => [
  { kind: "out", segs: rich(t.welcome) },
  { kind: "out", segs: [{ t: t.keysHint, c: "muted" }] },
];

function Line({ line }) {
  if (line.kind === "input") {
    return (
      <div className="flex gap-2">
        <span className="shrink-0 text-mint">{PROMPT}</span>
        <span className="break-all text-ink">{line.text}</span>
      </div>
    );
  }
  return (
    <div className="whitespace-pre-wrap break-words">
      {line.segs.map((seg, i) =>
        seg.href ? (
          <a
            key={i}
            href={seg.href}
            target="_blank"
            rel="noreferrer"
            className="text-blue-soft underline decoration-blue-dim underline-offset-2 hover:text-ink"
          >
            {seg.t}
          </a>
        ) : (
          <span key={i} className={tones[seg.c] || "text-ink-muted"}>
            {seg.t}
          </span>
        )
      )}
    </div>
  );
}

function TerminalDialog({ t, lines, onSubmit, history, onClose }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const [value, setValue] = useState("");
  const [cursor, setCursor] = useState(history.length); // position in history
  const [suggestions, setSuggestions] = useState([]);
  const inputId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    dialog.showModal();
    inputRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(onClose, EXIT_MS);
    return () => clearTimeout(timer);
  }, [closing, onClose]);

  // Keep the newest output in view.
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, suggestions]);

  const requestClose = () => setClosing(true);

  const submit = (e) => {
    e.preventDefault();
    const wantsClose = onSubmit(value);
    setValue("");
    setSuggestions([]);
    setCursor(history.length + (value.trim() ? 1 : 0));
    if (wantsClose) requestClose();
  };

  const onKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const result = complete(value);
      if (result.value) {
        setValue(result.value);
        setSuggestions([]);
      } else {
        setSuggestions(result.options);
      }
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown" && history.length) {
      e.preventDefault();
      const next = Math.min(history.length, cursor + 1);
      setCursor(next);
      setValue(history[next] ?? "");
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      onSubmit("clear");
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Terminal"
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      className={`fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-ink backdrop:bg-transparent ${
        closing ? "is-closing" : ""
      }`}
    >
      <div
        aria-hidden="true"
        onClick={requestClose}
        className="modal-backdrop absolute inset-0 bg-bg/60 backdrop-blur-sm"
      />

      <div className="pointer-events-none relative flex h-full items-end justify-center sm:items-start sm:p-6 sm:pt-[12vh]">
        <div className="modal-panel pointer-events-auto flex w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-[#0b0f16]/95 font-mono text-[13px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)] sm:max-w-2xl sm:rounded-xl">
          {/* title bar */}
          <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2/70 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
            <span className="ml-3 truncate text-[11px] text-ink-dim">santiago@portfolio: ~</span>
            <button
              type="button"
              onClick={requestClose}
              aria-label={t.closeLabel}
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-ink-dim transition-colors hover:bg-surface hover:text-ink"
            >
              <X size={14} strokeWidth={1.75} />
            </button>
          </div>

          {/* output; clicking anywhere focuses the prompt */}
          <div
            ref={outputRef}
            role="log"
            aria-live="polite"
            onClick={() => inputRef.current?.focus()}
            className="h-[min(55svh,420px)] space-y-1 overflow-y-auto overscroll-contain px-4 py-4 leading-relaxed [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin]"
          >
            {lines.map((line, i) => (
              <Line key={i} line={line} />
            ))}
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-x-4 text-ink-dim">
                {suggestions.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            )}

            <form onSubmit={submit} className="flex items-center gap-2 pt-1">
              <label htmlFor={inputId} className="shrink-0 text-mint">
                {PROMPT}
                <span className="sr-only"> {t.inputLabel}</span>
              </label>
              <input
                ref={inputRef}
                id={inputId}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setSuggestions([]);
                }}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="send"
                // the prompt and caret already show focus; skip the global ring
                style={{ outline: "none" }}
                className="min-w-0 flex-1 bg-transparent text-ink caret-blue"
              />
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
}

/**
 * Hidden terminal: opens with Ctrl/⌘ + K or via `openTerminal()`. The
 * session (output and history) survives closing and reopening.
 */
export default function Terminal() {
  const { language, setLanguage } = useLanguage();
  const content = getContent(language);
  const t = { ...content.terminal, closeLabel: content.projects.closeLabel };

  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState(() => welcomeLines(t));
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  /** Runs a command; returns true when the terminal should close. */
  const handleSubmit = (raw) => {
    const echo = { kind: "input", text: raw };
    if (raw.trim()) setHistory((h) => [...h, raw.trim()]);
    const { lines: output, action } = runCommand(raw, { c: content, profile });

    switch (action?.type) {
      case "clear":
        setLines([]);
        return false;
      case "exit":
        return true;
      case "copy":
        navigator.clipboard
          .writeText(action.text)
          .then(() => [{ t: t.copied.replace("{email}", action.text), c: "ok" }])
          .catch(() => [{ t: t.copyFailed.replace("{email}", action.text), c: "warn" }])
          .then((segs) => setLines((l) => [...l, { kind: "out", segs }]));
        break;
      case "open":
        window.open(action.url, "_blank", "noopener,noreferrer");
        break;
      case "lang":
        setLanguage(action.value);
        break;
      case "goto":
        // Let the exit animation finish, then scroll.
        setTimeout(() => {
          document.getElementById(action.id)?.scrollIntoView({ behavior: "smooth" });
        }, EXIT_MS + 20);
        setLines((l) => [...l, echo, ...output]);
        return true;
      default:
        break;
    }
    setLines((l) => [...l, echo, ...output]);
    return false;
  };

  return open ? (
    <TerminalDialog
      t={t}
      lines={lines}
      history={history}
      onSubmit={handleSubmit}
      onClose={close}
    />
  ) : null;
}
