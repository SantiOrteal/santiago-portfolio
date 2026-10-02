import projectDreambox from "../assets/project-dreambox.png";

// Cover images referenced by name from content.js (`cover: "dreambox"`)
const covers = { dreambox: projectDreambox };
const accents = ["#5b8def", "#9b87f5", "#6ee7b7", "#f5b97a"];

/** Screenshot first, then a named cover image; null means "generate one". */
export const coverImageFor = (project) => project.image || covers[project.cover] || null;

/** Accent color for a project's generated cover, by its position. */
export const accentFor = (index) => accents[index % accents.length];

/** Treats "#" and empty values as "no link". */
export const realLink = (url) => (url && url !== "#" ? url : null);
