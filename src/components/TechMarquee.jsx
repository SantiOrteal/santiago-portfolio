import { useEffect, useRef } from "react";
import { getContent, marquee } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import { emitBit } from "../lib/bit";
import { focusTech } from "../lib/tech";

/**
 * Speeds the strip up while the page scrolls and eases it back to its
 * normal pace, through the Web Animations API (no re-renders).
 */
function useScrollBoost(trackRef) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = track.getAnimations()[0];
    if (!animation) return;

    let lastY = window.scrollY;
    let rate = 1;
    let boost = 1;
    let frame = null;

    const tick = () => {
      boost += (1 - boost) * 0.05; // the push fades out
      rate += (boost - rate) * 0.12; // and the strip follows smoothly
      animation.playbackRate = rate;
      frame = rate > 1.01 || boost > 1.01 ? requestAnimationFrame(tick) : null;
      if (frame === null) animation.playbackRate = 1;
    };
    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      boost = Math.min(6, Math.max(boost, 1 + dy / 12));
      frame ??= requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [trackRef]);
}

export default function TechMarquee() {
  const { language } = useLanguage();
  const { marqueeLabel } = getContent(language);
  const trackRef = useRef(null);
  useScrollBoost(trackRef);
  // The list is rendered twice so translating by -50% loops seamlessly.
  const items = [...marquee, ...marquee];

  const pick = (tech) => {
    focusTech(tech);
    emitBit("tech", { tech });
  };

  return (
    <div
      aria-label={marqueeLabel}
      className="marquee mask-fade-x overflow-hidden border-b border-border-soft py-6"
    >
      <ul ref={trackRef} className="marquee-track flex w-max items-center gap-10">
        {items.map((tech, i) => {
          const isCopy = i >= marquee.length;
          return (
            <li
              key={i}
              aria-hidden={isCopy ? "true" : undefined}
              className="flex items-center gap-10"
            >
              {/* clicking a technology shows where it's used in "How I work" */}
              <button
                type="button"
                tabIndex={isCopy ? -1 : undefined}
                onClick={() => pick(tech)}
                className="font-display text-lg font-medium text-ink-dim transition-colors duration-300 hover:text-ink focus-visible:text-ink md:text-xl"
              >
                {tech}
              </button>
              <span className="h-1 w-1 rounded-full bg-blue-dim" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
