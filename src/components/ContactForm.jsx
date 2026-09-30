import { useEffect, useId, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { isContactConfigured, sendMessage } from "../lib/sendMessage";
import { profile } from "../data/content";

const MAX_MESSAGE = 2000;
const MIN_FILL_MS = 2500; // real people take longer than this to fill a form
const REASONS = ["job", "freelance", "other"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const now = () => Date.now();

const empty = { name: "", email: "", reason: "job", message: "", company: "" };

function validate(values, t) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = t.errors.name;
  if (!EMAIL_RE.test(values.email.trim())) errors.email = t.errors.email;
  const len = values.message.trim().length;
  if (len < 10) errors.message = t.errors.messageShort;
  else if (len > MAX_MESSAGE) errors.message = t.errors.messageLong;
  return errors;
}

function Field({ id, label, error, children, hint }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">
          {label}
        </label>
        {hint}
      </div>
      {children}
      {/* grid-rows trick animates the error in and out without measuring */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          error ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <p id={`${id}-error`} className="overflow-hidden text-[12px] text-[#f5a3a3]">
          <span className="block pt-1.5">{error}</span>
        </p>
      </div>
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full rounded-md border bg-surface-2/70 px-3.5 py-2.5 text-[14.5px] text-ink placeholder:text-ink-dim/70 outline-none transition-[border-color,box-shadow,background-color] duration-300 focus:bg-surface-2 focus:shadow-[0_0_0_3px_rgba(91,141,239,0.18)] ${
    hasError ? "border-[#f5a3a3]/60 focus:border-[#f5a3a3]" : "border-border-soft hover:border-border focus:border-blue"
  }`;

function SuccessCheck() {
  // Circle and tick draw themselves via stroke-dashoffset.
  return (
    <svg viewBox="0 0 52 52" className="h-14 w-14" aria-hidden="true">
      <circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-mint/40 [stroke-dasharray:151] [stroke-dashoffset:151] animate-[draw_0.7s_cubic-bezier(0.65,0,0.35,1)_forwards]"
      />
      <path
        d="M15 27l7 7 15-15"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-mint [stroke-dasharray:36] [stroke-dashoffset:36] animate-[draw_0.45s_cubic-bezier(0.65,0,0.35,1)_0.55s_forwards]"
      />
    </svg>
  );
}

export default function ContactForm({ t, language }) {
  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    message: `${uid}-message`,
  };
  const formRef = useRef(null);
  const mountedAt = useRef(0);

  // Start the "time to fill" clock once the form is on screen.
  useEffect(() => {
    mountedAt.current = now();
  }, []);

  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error | mailto

  const errors = validate(values, t);
  const showError = (field) => (touched[field] || submitted) && errors[field];

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (status === "error") setStatus("idle");
  };
  const blur = (field) => () => setTouched((tch) => ({ ...tch, [field]: true }));

  const openMailto = () => {
    const subject = `Portafolio · ${t.reasons[values.reason]} · ${values.name.trim()}`;
    const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
    window.location.assign(`mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      // Move focus to the first invalid field so keyboard users land on it.
      const first = ["name", "email", "message"].find((f) => errors[f]);
      document.getElementById(ids[first])?.focus();
      return;
    }

    // Honeypot filled or submitted inhumanly fast: pretend it worked.
    if (values.company || now() - mountedAt.current < MIN_FILL_MS) {
      setStatus("success");
      return;
    }

    if (!isContactConfigured) {
      openMailto();
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      await sendMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        reason: values.reason,
        reasonLabel: t.reasons[values.reason],
        message: values.message.trim(),
        language,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(empty);
    setTouched({});
    setSubmitted(false);
    setStatus("idle");
    mountedAt.current = now();
  };

  if (status === "success" || status === "mailto") {
    return (
      <div
        role="status"
        className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-border-soft bg-surface-2/40 p-8 text-center animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
      >
        <SuccessCheck />
        <h3 className="mt-5 font-display text-2xl font-medium text-ink">
          {t.successTitle}
        </h3>
        <p className="mt-2 max-w-xs text-[14.5px] leading-relaxed text-ink-muted">
          {status === "mailto" ? t.mailtoNotice : t.successBody}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex items-center gap-2 font-mono text-[12px] text-blue-soft transition-colors hover:text-ink"
        >
          <RotateCcw size={13} strokeWidth={1.75} />
          {t.sendAnother}
        </button>
      </div>
    );
  }

  const sending = status === "sending";
  const length = values.message.trim().length;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      aria-busy={sending}
      className="relative rounded-xl border border-border-soft bg-surface-2/40 p-5 sm:p-6 md:p-7"
    >
      <h3 className="font-display text-xl font-medium text-ink">{t.title}</h3>
      <p className="mt-1 text-[13.5px] text-ink-dim">{t.subtitle}</p>

      <fieldset disabled={sending} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={ids.name} label={t.name} error={showError("name")}>
            <input
              id={ids.name}
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={update("name")}
              onBlur={blur("name")}
              placeholder={t.namePlaceholder}
              aria-invalid={Boolean(showError("name"))}
              aria-describedby={`${ids.name}-error`}
              className={inputClass(showError("name"))}
            />
          </Field>
          <Field id={ids.email} label={t.email} error={showError("email")}>
            <input
              id={ids.email}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={update("email")}
              onBlur={blur("email")}
              placeholder={t.emailPlaceholder}
              aria-invalid={Boolean(showError("email"))}
              aria-describedby={`${ids.email}-error`}
              className={inputClass(showError("email"))}
            />
          </Field>
        </div>

        <div role="radiogroup" aria-label={t.reason}>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-ink-dim">
            {t.reason}
          </span>
          <div className="flex flex-wrap gap-2">
            {REASONS.map((reason) => {
              const checked = values.reason === reason;
              return (
                <label
                  key={reason}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 font-mono text-[12px] transition-[color,border-color,background-color,transform] duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue active:scale-95 ${
                    checked
                      ? "border-blue bg-blue-dim/50 text-blue-soft"
                      : "border-border-soft text-ink-muted hover:border-border hover:text-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={checked}
                    onChange={update("reason")}
                    className="sr-only"
                  />
                  {t.reasons[reason]}
                </label>
              );
            })}
          </div>
        </div>

        <Field
          id={ids.message}
          label={t.message}
          error={showError("message")}
          hint={
            <span
              className={`font-mono text-[11px] tabular-nums transition-colors ${
                length > MAX_MESSAGE ? "text-[#f5a3a3]" : "text-ink-dim"
              }`}
            >
              {length}/{MAX_MESSAGE}
            </span>
          }
        >
          <textarea
            id={ids.message}
            name="message"
            rows={5}
            value={values.message}
            onChange={update("message")}
            onBlur={blur("message")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) formRef.current?.requestSubmit();
            }}
            placeholder={t.messagePlaceholder}
            aria-invalid={Boolean(showError("message"))}
            aria-describedby={`${ids.message}-error`}
            className={`${inputClass(showError("message"))} min-h-32 resize-y`}
          />
        </Field>

        {/* Honeypot: hidden from people and assistive tech, bots fill it in */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Company
            <input
              tabIndex={-1}
              autoComplete="off"
              name="company"
              value={values.company}
              onChange={update("company")}
            />
          </label>
        </div>
      </fieldset>

      {status === "error" && (
        <div
          role="alert"
          className="mt-5 flex gap-3 rounded-md border border-[#f5a3a3]/30 bg-[#f5a3a3]/10 p-3.5 text-[13px] leading-relaxed text-[#f5c4c4] animate-[fade-up_0.4s_cubic-bezier(0.16,1,0.3,1)_both]"
        >
          <AlertCircle size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          <p>
            <strong className="font-medium">{t.errorTitle}</strong> {t.errorBody}{" "}
            <a href={`mailto:${profile.email}`} className="underline underline-offset-2 hover:text-ink">
              {profile.email}
            </a>
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <span className="hidden font-mono text-[11px] text-ink-dim sm:inline">
          {t.shortcut}
        </span>
        <button
          type="submit"
          disabled={sending}
          className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-blue px-5 py-3 font-mono text-[13px] font-medium text-bg shadow-[0_8px_30px_-8px_rgba(91,141,239,0.7)] transition-[transform,opacity] duration-300 active:scale-[0.98] disabled:opacity-80 sm:w-auto"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          {sending ? (
            <>
              <Loader2 size={15} strokeWidth={2} className="relative animate-spin" />
              <span className="relative">{t.sending}</span>
            </>
          ) : (
            <>
              <span className="relative">{t.submit}</span>
              <ArrowRight
                size={15}
                strokeWidth={2}
                className="relative transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
