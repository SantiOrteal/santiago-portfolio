// Small animated illustrations for "How I work", one per strength, in the
// same order as skills.items in content.js. Pure SVG + CSS (the sv-*
// keyframes in index.css), so they cost nothing when off screen and the
// global reduced-motion rule freezes them.

const mono = { fontFamily: "var(--font-mono)" };

/** 01 · Interfaces for real operations: a data table being worked through. */
function TableVisual() {
  const rows = [0, 1, 2, 3, 4];
  const status = ["fill-mint", "fill-[#f5b97a]", "fill-mint", "fill-blue", "fill-mint"];
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      <rect x="16" y="14" width="288" height="20" rx="5" className="fill-surface-2" />
      <rect x="26" y="22" width="44" height="4" rx="2" className="fill-ink-dim/70" />
      <path d="M76 21l3 4 3-4" className="sv-sort fill-none stroke-blue-soft" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="128" y="22" width="40" height="4" rx="2" className="fill-ink-dim/50" />
      <rect x="250" y="22" width="34" height="4" rx="2" className="fill-ink-dim/50" />

      {/* highlight that walks down the rows */}
      <rect x="16" y="40" width="288" height="22" rx="5" className="sv-scan fill-blue/15 stroke-blue/60" strokeWidth="1" />

      {rows.map((i) => (
        <g key={i}>
          <rect x="16" y={40 + i * 25} width="288" height="22" rx="5" className="fill-none stroke-border-soft" strokeWidth="1" />
          <rect x="26" y={49 + i * 25} width={52 + ((i * 17) % 36)} height="4" rx="2" className="fill-ink-muted/60" />
          <rect x="128" y={49 + i * 25} width={30 + ((i * 11) % 24)} height="4" rx="2" className="fill-ink-dim/50" />
          <rect
            x="250"
            y={46 + i * 25}
            width="36"
            height="10"
            rx="5"
            className={`sv-pill ${status[i]} opacity-70`}
            style={{ animationDelay: `${i * 0.45}s` }}
          />
        </g>
      ))}
    </svg>
  );
}

/** 02 · Production diagnostics: latency with a spike and the logs that explain it. */
function TraceVisual() {
  const logs = [
    ["GET /orders 200", "fill-ink-muted"],
    ["GET /stock  200", "fill-ink-muted"],
    ["WARN slow query", "fill-[#f5b97a]"],
    ["trace 7f3a  ✓ fix", "fill-mint"],
  ];
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      {[40, 75, 110, 145].map((y) => (
        <line key={y} x1="16" x2="196" y1={y} y2={y} className="stroke-border-soft" strokeDasharray="2 4" />
      ))}
      <polyline
        points="16,128 36,122 56,126 76,116 96,120 116,44 136,114 156,118 176,108 196,112"
        className="sv-draw fill-none stroke-blue"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="116" cy="44" r="4" className="fill-[#f5a3a3]" />
      <circle cx="116" cy="44" r="4" className="sv-ping fill-none stroke-[#f5a3a3]" strokeWidth="1.5" />
      <text x="124" y="40" fontSize="8" className="fill-[#f5a3a3]" style={mono}>
        p95 1.8s
      </text>

      <rect x="208" y="20" width="96" height="130" rx="6" className="fill-surface-2 stroke-border-soft" />
      <circle cx="218" cy="30" r="2" className="fill-mint" />
      <text x="224" y="33" fontSize="7" className="fill-ink-dim" style={mono}>
        logs
      </text>
      {logs.map(([line, tone], i) => (
        <text
          key={line}
          x="216"
          y={58 + i * 24}
          fontSize="7.5"
          className={`sv-log ${tone}`}
          style={{ ...mono, animationDelay: `${0.4 + i * 0.7}s` }}
        >
          {line}
        </text>
      ))}
    </svg>
  );
}

/** 03 · From idea to deployment: a build travelling down the pipeline. */
function PipelineVisual() {
  const stages = [
    ["idea", "✦"],
    ["code", "</>"],
    ["build", "▣"],
    ["deploy", "▲"],
  ];
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      <line x1="40" x2="280" y1="80" y2="80" className="stroke-border" strokeWidth="2" />
      <line x1="40" x2="280" y1="80" y2="80" className="sv-progress stroke-blue" strokeWidth="2" />
      {stages.map(([label, glyph], i) => (
        <g key={label}>
          <circle cx={40 + i * 80} cy="80" r="17" className="fill-surface-2 stroke-border" strokeWidth="1.5" />
          <circle
            cx={40 + i * 80}
            cy="80"
            r="17"
            className="sv-stage fill-blue/15 stroke-blue"
            strokeWidth="1.5"
            style={{ animationDelay: `${i * 1.05}s` }}
          />
          <text x={40 + i * 80} y="84" fontSize="10" textAnchor="middle" className="fill-blue-soft" style={mono}>
            {glyph}
          </text>
          <text x={40 + i * 80} y="118" fontSize="9" textAnchor="middle" className="fill-ink-dim" style={mono}>
            {label}
          </text>
        </g>
      ))}
      <circle cx="40" cy="80" r="4" className="sv-travel fill-mint" />
      <g className="sv-live">
        <rect x="252" y="36" width="56" height="18" rx="9" className="fill-mint/15 stroke-mint/60" />
        <text x="280" y="48" fontSize="8.5" textAnchor="middle" className="fill-mint" style={mono}>
          ✓ live
        </text>
      </g>
    </svg>
  );
}

/** 04 · Automation and integrations: events flowing through n8n. */
function FlowVisual() {
  const edges = [
    "M76 45 C 110 45, 110 85, 126 85",
    "M76 125 C 110 125, 110 85, 126 85",
    "M194 85 C 214 85, 214 45, 244 45",
    "M194 85 C 214 85, 214 125, 244 125",
  ];
  const nodes = [
    [12, 33, "form"],
    [12, 113, "sensor"],
    [244, 33, "email"],
    [244, 113, "MQTT"],
  ];
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      {edges.map((d, i) => (
        <g key={d}>
          <path d={d} className="fill-none stroke-border" strokeWidth="1.5" />
          <path
            d={d}
            className="sv-flow fill-none stroke-blue"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ animationDelay: `${(i % 2) * 0.6 + (i > 1 ? 1.1 : 0)}s` }}
          />
        </g>
      ))}
      {nodes.map(([x, y, label]) => (
        <g key={label}>
          <rect x={x} y={y} width="64" height="24" rx="6" className="fill-surface-2 stroke-border" />
          <text x={x + 32} y={y + 15.5} fontSize="9" textAnchor="middle" className="fill-ink-muted" style={mono}>
            {label}
          </text>
        </g>
      ))}
      <rect x="126" y="67" width="68" height="36" rx="9" className="fill-blue/15 stroke-blue" strokeWidth="1.5" />
      <rect x="126" y="67" width="68" height="36" rx="9" className="sv-hub fill-none stroke-blue" strokeWidth="1.5" />
      <text x="160" y="89" fontSize="11" fontWeight="600" textAnchor="middle" className="fill-blue-soft" style={mono}>
        n8n
      </text>
    </svg>
  );
}

const visuals = [TableVisual, TraceVisual, PipelineVisual, FlowVisual];

export default function SkillVisual({ index }) {
  const Visual = visuals[index % visuals.length];
  return <Visual />;
}
