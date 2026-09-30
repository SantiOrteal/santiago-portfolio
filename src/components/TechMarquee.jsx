import { getContent, marquee } from "../data/content";
import { useLanguage } from "../context/LanguageContext";

export default function TechMarquee() {
  const { language } = useLanguage();
  const { marqueeLabel } = getContent(language);
  // The list is rendered twice so translating by -50% loops seamlessly.
  const items = [...marquee, ...marquee];

  return (
    <div
      aria-label={marqueeLabel}
      className="marquee mask-fade-x overflow-hidden border-b border-border-soft py-6"
    >
      <ul className="marquee-track flex w-max items-center gap-10">
        {items.map((tech, i) => (
          <li
            key={i}
            aria-hidden={i >= marquee.length ? "true" : undefined}
            className="flex items-center gap-10 font-display text-lg font-medium text-ink-dim transition-colors duration-300 hover:text-ink md:text-xl"
          >
            {tech}
            <span className="h-1 w-1 rounded-full bg-blue-dim" />
          </li>
        ))}
      </ul>
    </div>
  );
}
