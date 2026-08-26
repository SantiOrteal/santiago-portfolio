export default function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-blue-dim" />
      <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-blue-soft">
        {children}
      </span>
    </div>
  );
}
