export default function BlueprintBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="bg-grid-drift absolute -inset-x-10 -inset-y-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #5b8def 1px, transparent 1px), linear-gradient(to bottom, #5b8def 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue/10 blur-[120px]" />
    </div>
  );
}
