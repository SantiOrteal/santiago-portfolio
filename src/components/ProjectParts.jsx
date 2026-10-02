import { Hammer } from "lucide-react";
import { accentFor, coverImageFor } from "../lib/projects";

// Generated cover for projects without a screenshot or registered image.
function GeneratedCover({ title, accent, large }) {
  // "BuenFinPromo" -> "BFP", "Warehouse Ops Dashboard" -> "WOD"
  const initials = title
    .split(/\s+|(?=[A-Z][a-z])/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

  return (
    <div className="relative h-full w-full bg-surface-2">
      <div
        className="absolute inset-0 opacity-[0.12] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        style={{
          backgroundImage: `linear-gradient(to right, ${accent} 1px, transparent 1px), linear-gradient(to bottom, ${accent} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(circle at 70% 30%, #000, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 70% 30%, #000, transparent 75%)",
        }}
      />
      <div
        className="absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-40 transition-opacity duration-700 group-hover:opacity-70"
        style={{ background: `radial-gradient(closest-side, ${accent}, transparent)` }}
      />
      <span
        className={`absolute bottom-3 left-5 font-display font-semibold tracking-tighter opacity-25 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:opacity-45 ${
          large ? "text-8xl" : "text-6xl"
        }`}
        style={{ color: accent }}
      >
        {initials}
      </span>
    </div>
  );
}

/** Screenshot first, then a named cover image, otherwise a generated cover. */
export function ProjectCover({ project, index, large = false }) {
  const image = coverImageFor(project);
  if (!image) {
    return <GeneratedCover title={project.title} accent={accentFor(index)} large={large} />;
  }
  return (
    <img
      src={image}
      alt=""
      aria-hidden="true"
      loading={large ? "eager" : "lazy"}
      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
    />
  );
}

export function WipBadge({ label }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#f5b97a]/30 bg-[#f5b97a]/10 px-2.5 py-0.5 font-mono text-[10.5px] text-[#f5b97a]">
      <Hammer size={11} strokeWidth={2} />
      {label}
    </span>
  );
}
