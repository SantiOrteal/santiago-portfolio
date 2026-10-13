// "Where is this technology used?" — derived from the content itself, so a
// new project tag or experience point shows up without extra wiring.

export const TECH_EVENT = "portfolio:tech";

/** Scrolls to "How I work" and asks it to open the usage panel for `tech`. */
export function focusTech(tech) {
  document.getElementById("skills")?.scrollIntoView();
  window.dispatchEvent(new CustomEvent(TECH_EVENT, { detail: { tech } }));
}

const escape = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Project titles and experience entries that mention `tech`. */
export function usageFor(tech, content) {
  const name = tech.toLowerCase();
  // "React" matches the tag "React 18", but "Java" never matches "JavaScript".
  const matchesTag = (tag) => {
    const t = tag.toLowerCase();
    return t === name || t.startsWith(`${name} `);
  };
  const mention = new RegExp(`(^|[^\\w])${escape(tech)}(?![\\w])`, "i");

  return {
    projects: content.projects.items.filter((p) => p.tags.some(matchesTag)).map((p) => p.title),
    experience: content.experience.items
      .filter((item) => item.points.some((point) => mention.test(point)))
      .map((item) => `${item.role} · ${item.org}`),
  };
}

/** Briefly outlines the element marked `data-flash` inside a section. */
export function flashSection(id) {
  const section = document.getElementById(id);
  const target = section?.querySelector("[data-flash]") ?? section;
  if (!target) return;
  target.classList.remove("flash-target");
  // Restart the animation even if it is still running.
  void target.offsetWidth;
  target.classList.add("flash-target");
  setTimeout(() => target.classList.remove("flash-target"), 1800);
}
