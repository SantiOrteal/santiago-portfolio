// Command engine for the hidden terminal (Ctrl/⌘ + K).
// Pure functions: they return lines to print plus an optional action for
// the UI to perform (copy, open a link, scroll, switch language…).
//
// A line is { kind: "input" | "out", segs: [{ t, c?, href? }] } where `c` is
// a tone: accent | muted | ok | err | key | warn.

import { getContent } from "../data/content";

export const OPEN_EVENT = "portfolio:terminal";
export const openTerminal = () => window.dispatchEvent(new Event(OPEN_EVENT));

/** "⌘K" on Apple devices, "Ctrl K" everywhere else. */
export const shortcutLabel = () =>
  /Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "⌘K" : "Ctrl K";

export const COMMANDS = [
  "help",
  "whoami",
  "skills",
  "projects",
  "experience",
  "homelab",
  "contact",
  "email",
  "github",
  "linkedin",
  "goto",
  "lang",
  "clear",
  "exit",
];
const ALIASES = { ls: "help", cd: "goto", cls: "clear", quit: "exit", man: "help" };
export const SECTIONS = ["top", "about", "experience", "projects", "skills", "homelab", "contact"];
const LANGS = { es: "es-MX", "es-mx": "es-MX", en: "en" };

const fill = (str, vars = {}) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

/** Turns "text with `code`" into segments, highlighting the code parts. */
export function rich(str, tone) {
  return str
    .split(/(`[^`]+`)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("`") ? { t: part.slice(1, -1), c: "accent" } : { t: part, c: tone }
    );
}

const out = (...segs) => ({ kind: "out", segs });
const text = (t, c) => out({ t, c });
const blank = () => out({ t: " " });

const handlers = {
  help(_, { c }) {
    const t = c.terminal;
    return [
      text(t.helpTitle, "muted"),
      ...COMMANDS.map((cmd) => out({ t: cmd.padEnd(12), c: "accent" }, { t: t.help[cmd], c: "muted" })),
    ];
  },

  whoami(_, { c, profile }) {
    return [
      out({ t: profile.name, c: "key" }, { t: `  ·  ${profile.role}` }),
      ...c.about.card.lines.map((l) => out({ t: `${l.k.padEnd(12)}`, c: "muted" }, { t: l.v })),
      out({ t: c.terminal.location.padEnd(12), c: "muted" }, { t: profile.location }),
    ];
  },

  skills(_, { c }) {
    return c.skills.items.flatMap((item, i) => [
      ...(i ? [blank()] : []),
      out({ t: "▸ ", c: "accent" }, { t: item.title, c: "key" }),
      text(`  ${item.tech.join(" · ")}`, "muted"),
    ]);
  },

  projects(_, { c }) {
    const t = c.terminal;
    return [
      ...c.projects.items.flatMap((p, i) => [
        ...(i ? [blank()] : []),
        out(
          { t: "▸ ", c: "accent" },
          { t: p.title, c: "key" },
          ...(p.status === "wip" ? [{ t: `  [${t.wip}]`, c: "warn" }] : [])
        ),
        text(`  ${p.summary || [].concat(p.description)[0]}`, "muted"),
      ]),
      blank(),
      out(...rich(t.projectsHint, "muted")),
    ];
  },

  experience(_, { c }) {
    return c.experience.items.map((item) =>
      out(
        { t: item.period.padEnd(18), c: "muted" },
        { t: item.role, c: "key" },
        { t: `  @ ${item.org}` }
      )
    );
  },

  homelab(_, { c }) {
    return c.homelab.groups.flatMap((g, i) => [
      ...(i ? [blank()] : []),
      out({ t: "▸ ", c: "accent" }, { t: g.title, c: "key" }),
      text(`  ${g.services.join(" · ")}`, "muted"),
    ]);
  },

  contact(_, { c, profile }) {
    return [
      out({ t: "email".padEnd(12), c: "muted" }, { t: profile.email, href: `mailto:${profile.email}` }),
      out({ t: "github".padEnd(12), c: "muted" }, { t: profile.github, href: profile.github }),
      out({ t: "linkedin".padEnd(12), c: "muted" }, { t: profile.linkedin, href: profile.linkedin }),
      blank(),
      out(...rich(`\`email\` → ${c.terminal.help.email}`, "muted")),
    ];
  },

  email(_, { profile }) {
    return { lines: [], action: { type: "copy", text: profile.email } };
  },

  github(_, { c, profile }) {
    return {
      lines: [text(fill(c.terminal.opening, { target: "GitHub" }), "muted")],
      action: { type: "open", url: profile.github },
    };
  },

  linkedin(_, { c, profile }) {
    return {
      lines: [text(fill(c.terminal.opening, { target: "LinkedIn" }), "muted")],
      action: { type: "open", url: profile.linkedin },
    };
  },

  goto([section], { c }) {
    const id = section?.replace(/^#/, "").toLowerCase();
    if (!SECTIONS.includes(id)) {
      return [text(fill(c.terminal.gotoUsage, { sections: SECTIONS.join(" | ") }), "err")];
    }
    return {
      lines: [text(fill(c.terminal.going, { section: id }), "ok")],
      action: { type: "goto", id },
    };
  },

  lang([value], { c }) {
    const next = LANGS[value?.toLowerCase()];
    if (!next) return [text(c.terminal.langUsage, "err")];
    // Confirm in the language being switched to.
    return {
      lines: [text(getContent(next).terminal.langChanged, "ok")],
      action: { type: "lang", value: next },
    };
  },

  clear() {
    return { lines: [], action: { type: "clear" } };
  },

  exit() {
    return { lines: [], action: { type: "exit" } };
  },

  sudo(args, { c, profile }) {
    if (args.join(" ").toLowerCase().includes("hire")) {
      return [out(...rich(fill(c.terminal.sudoHire, { email: profile.email }), "ok"))];
    }
    return [text(c.terminal.sudo, "warn")];
  },
};

/**
 * Runs one command line.
 * @returns {{ lines: object[], action?: object }}
 */
export function runCommand(raw, ctx) {
  const [name = "", ...args] = raw.trim().split(/\s+/);
  const cmd = ALIASES[name.toLowerCase()] || name.toLowerCase();
  if (!cmd) return { lines: [] };

  const handler = handlers[cmd];
  if (!handler) {
    return { lines: [out(...rich(fill(ctx.c.terminal.notFound, { cmd: name }), "err"))] };
  }
  const result = handler(args, ctx);
  return Array.isArray(result) ? { lines: result } : result;
}

/**
 * Tab completion. Returns the completed input, or the list of candidates
 * when the prefix is ambiguous.
 */
export function complete(input) {
  const parts = input.trimStart().split(/\s+/);
  const pick = (options, prefix) => options.filter((o) => o.startsWith(prefix.toLowerCase()));

  if (parts.length <= 1) {
    const matches = pick(COMMANDS, parts[0] || "");
    return matches.length === 1 ? { value: `${matches[0]} ` } : { options: matches };
  }

  const [cmd, arg = ""] = parts;
  const argOptions = { goto: SECTIONS, cd: SECTIONS, lang: ["es", "en"] }[cmd.toLowerCase()];
  if (!argOptions) return { options: [] };
  const matches = pick(argOptions, arg);
  return matches.length === 1 ? { value: `${cmd} ${matches[0]}` } : { options: matches };
}
