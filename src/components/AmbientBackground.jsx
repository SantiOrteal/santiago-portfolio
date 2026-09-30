import { useEffect, useRef } from "react";

const GLOW_SIZE = 720;

/**
 * Fixed, full-page ambient background: a soft blue glow that eases toward
 * the pointer, plus two blobs that drift on their own so the page still
 * feels alive on touch devices or when the cursor is idle. Purely
 * decorative — sits behind all content and never intercepts clicks.
 *
 * Performance: the glows are radial gradients (no `filter: blur`) and move
 * only through `transform`, so the browser composites them on the GPU
 * instead of re-blurring a huge area on every frame.
 *
 * Static when the user has no fine pointer or prefers reduced motion.
 */
export default function AmbientBackground() {
  const glowRef = useRef(null);

  useEffect(() => {
    const node = glowRef.current;
    if (!node) return;

    const place = (x, y) => {
      node.style.transform = `translate3d(${x - GLOW_SIZE / 2}px, ${y - GLOW_SIZE / 2}px, 0)`;
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    const current = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.18 };
    place(current.x, current.y);
    if (prefersReduced || !hasFinePointer) return;

    const target = { ...current };
    let frame = null;
    let last = 0;

    const tick = (now) => {
      // Frame-rate independent easing: same feel at 60 Hz and 144 Hz.
      const dt = last ? Math.min(64, now - last) : 16.67;
      last = now;
      const k = 1 - Math.pow(1 - 0.14, dt / 16.67);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      place(current.x, current.y);

      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.5) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = null;
        last = 0;
      }
    };

    const handleMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (frame === null) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="background pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* trails the cursor */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 rounded-full will-change-transform"
        style={{
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          background:
            "radial-gradient(closest-side, rgba(91,141,239,0.2), rgba(91,141,239,0.07) 45%, transparent)",
        }}
      />
      {/* slow, independent drifts so the page breathes on its own */}
      <div
        className="absolute right-[-12%] top-[50%] h-[560px] w-[560px] animate-[ambient-drift_22s_ease-in-out_infinite] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(closest-side, rgba(91,141,239,0.08), transparent)",
        }}
      />
      <div
        className="absolute left-[-14%] top-[75%] h-[500px] w-[500px] animate-[ambient-drift_28s_ease-in-out_infinite_reverse] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(closest-side, rgba(155,135,245,0.07), transparent)",
        }}
      />
      {/* film grain: adds texture and hides gradient banding */}
      <div className="grain absolute inset-0" />
    </div>
  );
}
