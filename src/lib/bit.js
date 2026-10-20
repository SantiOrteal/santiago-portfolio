// Event bus for Bit, the mascot. Any part of the page can tell Bit that
// something happened without importing the component:
//
//   emitBit("copied")                     → copied the email
//   emitBit("project", { title })         → closed a project's details
//   emitBit("dance")                      → easter egg
//   emitBit("listening" | "sending" | "sent" | "error" | "mailto") → contact form
//   emitBit("run" | "unavailable")        → hero code window
//   emitBit("pinged")                     → homelab health check
//   emitBit("tech", { tech })             → clicked a technology
//   emitBit("open-menu")                  → open Bit's menu (restores it if hidden)
//
// Same pattern as `openTerminal()` in lib/terminal.js.

export const BIT_EVENT = "portfolio:bit";

/** Bit announces whether it is hidden, so the nav can offer to bring it back. */
export const BIT_STATE_EVENT = "portfolio:bit-state";
export const MINIMIZED_KEY = "bit-minimized";

export const emitBit = (type, detail = {}) =>
  window.dispatchEvent(new CustomEvent(BIT_EVENT, { detail: { type, ...detail } }));

/** Sections Bit comments on, in page order (also the tour route). */
export const BIT_SECTIONS = ["about", "experience", "projects", "skills", "homelab", "contact"];

/** Fills "{name}" placeholders in a script line. */
export const fill = (str, vars = {}) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

// Storage can throw in private windows or with blocked site data.
export const storage = {
  get(store, key) {
    try {
      return window[store].getItem(key);
    } catch {
      return null;
    }
  },
  set(store, key, value) {
    try {
      window[store].setItem(key, value);
    } catch {
      // not critical: Bit just forgets
    }
  },
};
