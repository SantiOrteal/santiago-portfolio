import { useEffect, useRef } from "react";

const DEFAULT_OPTIONS = {
  threshold: 0.15,
  rootMargin: "0px 0px -40px 0px",
};

/**
 * Adds the `is-visible` class to the element once it scrolls into view.
 * Pairs with the `.reveal` utility defined in index.css.
 * Respects prefers-reduced-motion by revealing immediately.
 */
export function useReveal(options = DEFAULT_OPTIONS) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      options
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
