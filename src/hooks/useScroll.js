import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing the upper third of the
 * viewport, so the nav can highlight where the reader is.
 */
export function useScrollSpy(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join(",");

  useEffect(() => {
    const sections = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

/**
 * Calls `onProgress` with a 0–1 value on every animation frame where the
 * page scrolled. Writes go straight to the DOM, so no React re-renders.
 */
export function useScrollProgress(onProgress) {
  useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      onProgress();
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [onProgress]);
}
