export default function SectionLabel({ children, index }) {
  return (
    <div className="flex items-center gap-3">
      {index && (
        <span className="font-mono text-[12px] text-ink-dim">{index}</span>
      )}
      <span className="h-px w-8 bg-gradient-to-r from-blue to-blue-dim" />
      <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-blue-soft">
        {children}
      </span>
    </div>
  );
}
