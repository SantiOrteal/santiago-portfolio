import { useEffect, useRef } from "react";

/**
 * Fixed, full-page ambient background: a soft blue glow that eases toward
 * the pointer position, plus a second, slower blob that drifts on its own
 * so the page still feels alive without a mouse (touch devices) or when
 * the cursor is idle. Purely decorative — sits behind all content and
 * never intercepts clicks.
 *
 * Disabled (replaced by a static glow) when the user has no fine pointer
 * or prefers reduced motion, so it never fights accessibility settings.
 */
export default function AmbientBackground() {
  const glowRef = useRef(null);
  const target = useRef({ x: 0.5, y: 0.35 });
  const current = useRef({ x: 0.5, y: 0.35 });
  const frame = useRef(null);

  useEffect(() => {
    const node = glowRef.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (prefersReduced || !hasFinePointer) {
      // Static, gentle placement — no animation loop, no listeners.
      node.style.setProperty("--glow-x", "62%");
      node.style.setProperty("--glow-y", "18%");
      return;
    }

    const updateGlow = () => {
      node.style.setProperty("--glow-x", `${current.current.x * 100}%`);
      node.style.setProperty("--glow-y", `${current.current.y * 100}%`);
    };

    const handleMove = (e) => {
      target.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
      if (frame.current === null) frame.current = requestAnimationFrame(tick);
    };

    const tick = () => {
      // Ease current position toward target — smooth trailing motion.
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;
      updateGlow();

      const remainingDistance = Math.max(
        Math.abs(target.current.x - current.current.x),
        Math.abs(target.current.y - current.current.y)
      );

      if (remainingDistance > 0.001) {
        frame.current = requestAnimationFrame(tick);
      } else {
        current.current = { ...target.current };
        updateGlow();
        frame.current = null;
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
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
        className="absolute h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22] blur-[100px]"
        style={{
          left: "var(--glow-x, 50%)",
          top: "var(--glow-y, 35%)",
          background: "#5b8def",
        }}
      />
      {/* slow, independent ambient drift so the page breathes on its own */}
      <div className="absolute right-[-10%] top-[55%] h-[440px] w-[440px] animate-[ambient-drift_26s_ease-in-out_infinite] rounded-full bg-blue/[0.05] blur-[130px]" />
      <div className="absolute left-[-12%] top-[80%] h-[380px] w-[380px] animate-[ambient-drift_34s_ease-in-out_infinite_reverse] rounded-full bg-violet/[0.05] blur-[130px]" />
      {/* film grain: adds texture and hides gradient banding */}
      <div className="grain absolute inset-0" />
    </div>
  );
}
