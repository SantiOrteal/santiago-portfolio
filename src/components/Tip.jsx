import { useId } from "react";

/**
 * Small tooltip that opens on hover, keyboard focus or tap (tapping focuses
 * the trigger). Esc hides it by blurring the trigger.
 *
 * `as="span"` renders a focusable span instead of a button, for triggers
 * that sit inside other interactive elements.
 */
export default function Tip({ tip, children, className = "", align = "center", as = "button" }) {
  const id = useId();
  const Trigger = as;
  const position = {
    center: "left-1/2 -translate-x-1/2",
    left: "left-0",
    right: "right-0",
  }[align];

  return (
    <span className="group/tip relative inline-block">
      <Trigger
        {...(as === "button" ? { type: "button" } : { tabIndex: 0 })}
        aria-describedby={id}
        onKeyDown={(e) => e.key === "Escape" && e.currentTarget.blur()}
        className={className}
      >
        {children}
      </Trigger>
      <span
        role="tooltip"
        id={id}
        className={`pointer-events-none absolute bottom-full z-30 mb-2 w-max max-w-[min(16rem,75vw)] translate-y-1 rounded-md border border-border bg-surface-2 px-3 py-2 text-left font-body text-[12.5px] font-normal normal-case leading-snug tracking-normal text-ink-muted opacity-0 shadow-xl transition-[opacity,translate] duration-200 group-focus-within/tip:translate-y-0 group-focus-within/tip:opacity-100 group-hover/tip:translate-y-0 group-hover/tip:opacity-100 ${position}`}
      >
        {tip}
      </span>
    </span>
  );
}
