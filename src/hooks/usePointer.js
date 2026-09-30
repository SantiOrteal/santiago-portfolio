import { useEffect, useRef } from "react";

const canHover = () =>
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Writes the pointer position (relative to the element) into --mx / --my
 * so CSS can draw a spotlight that follows the cursor. Pairs with `.spotlight`.
 */
export function useSpotlight() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !canHover()) return;

    // Pointer events can fire faster than the screen refreshes; write the
    // CSS variables at most once per frame.
    let frame = null;
    let last = null;
    const flush = () => {
      frame = null;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--mx", `${last.clientX - rect.left}px`);
      node.style.setProperty("--my", `${last.clientY - rect.top}px`);
    };
    const onMove = (e) => {
      last = e;
      if (frame === null) frame = requestAnimationFrame(flush);
    };
    node.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      node.removeEventListener("pointermove", onMove);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

/**
 * Pulls the element slightly toward the cursor while hovered and springs
 * back on leave — a "magnetic" button.
 */
export function useMagnetic(strength = 0.25) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !canHover()) return;

    node.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";

    const onMove = (e) => {
      const rect = node.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onLeave = () => {
      node.style.transform = "";
    };

    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return ref;
}

/**
 * Subtle 3D tilt toward the cursor. `max` is the maximum rotation in degrees.
 */
export function useTilt(max = 6) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !canHover()) return;

    node.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";

    const onMove = (e) => {
      const rect = node.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      node.style.transform = `perspective(1000px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`;
    };
    const onLeave = () => {
      node.style.transform = "";
    };

    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return ref;
}
