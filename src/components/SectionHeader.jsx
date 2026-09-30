import { useReveal } from "../hooks/useReveal";
import SectionLabel from "./SectionLabel";

/** Numbered section label + optional heading, revealed together on scroll. */
export default function SectionHeader({ index, label, title }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal-stagger">
      <div style={{ "--i": 0 }}>
        <SectionLabel index={index}>{label}</SectionLabel>
      </div>
      {title && (
        <h2
          style={{ "--i": 1 }}
          className="text-balance mt-6 max-w-2xl font-display text-3xl font-medium leading-tight text-ink md:text-4xl"
        >
          {title}
        </h2>
      )}
    </div>
  );
}
