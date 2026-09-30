export default function BlueprintBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Grid moves one full cell per loop so the restart is invisible.
          will-change keeps it on its own GPU layer: sub-pixel movement
          stays smooth instead of snapping pixel by pixel. */}
      <div
        className="bg-grid-drift absolute -inset-x-16 -inset-y-16 opacity-[0.05] will-change-transform"
        style={{
          backgroundImage:
            "linear-gradient(to right, #5b8def 1px, transparent 1px), linear-gradient(to bottom, #5b8def 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        className="absolute left-1/2 top-1/3 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(91,141,239,0.12), transparent)",
        }}
      />
    </div>
  );
}
