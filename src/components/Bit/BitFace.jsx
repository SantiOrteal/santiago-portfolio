// Bit's body as inline SVG. The mood changes the eyes, mouth, LED color and
// which CSS animation runs (see the "Bit" block in index.css). The eyes are
// shifted with --ex / --ey, which Bit.jsx updates as the cursor moves.

const led = {
  idle: "fill-blue",
  talking: "fill-blue",
  listening: "fill-blue-soft",
  thinking: "fill-violet",
  happy: "fill-mint",
  dance: "fill-mint",
  sad: "fill-[#f5a3a3]",
  sleeping: "fill-ink-dim",
};

function Eyes({ mood }) {
  if (mood === "happy" || mood === "dance") {
    // ^ ^
    return (
      <g className="stroke-blue-soft" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M27.5 39l3.5-4 3.5 4" />
        <path d="M45.5 39l3.5-4 3.5 4" />
      </g>
    );
  }
  if (mood === "sleeping") {
    return (
      <g className="stroke-ink-dim" strokeWidth="2.5" strokeLinecap="round">
        <path d="M28 38h6M46 38h6" />
      </g>
    );
  }
  const sad = mood === "sad";
  const big = mood === "listening";
  return (
    <g className="bit-eyes fill-blue-soft">
      <rect x={big ? 27 : 28} y={big ? 32 : sad ? 35 : 33} width={big ? 8 : 6} height={big ? 10 : sad ? 6 : 8} rx="2" />
      <rect x={big ? 45 : 46} y={big ? 32 : sad ? 35 : 33} width={big ? 8 : 6} height={big ? 10 : sad ? 6 : 8} rx="2" />
    </g>
  );
}

function Mouth({ mood }) {
  const common = { fill: "none", strokeWidth: 2, strokeLinecap: "round", className: "stroke-blue-soft/80" };
  if (mood === "happy" || mood === "dance") return <path d="M35 45q5 4 10 0" {...common} />;
  if (mood === "sad") return <path d="M35 48q5 -3.5 10 0" {...common} />;
  if (mood === "sleeping") return <path d="M38 47h4" {...common} />;
  if (mood === "talking") return <rect x="36" y="44.5" width="8" height="3" rx="1.5" className="bit-mouth fill-blue-soft/80" />;
  if (mood === "thinking") return <path d="M36 46.5h3m3 0h2" {...common} />;
  return <path d="M36 46h8" {...common} />;
}

export default function BitFace({ mood }) {
  return (
    <svg viewBox="0 0 80 96" className={`bit-svg bit-${mood} h-full w-full overflow-visible`} aria-hidden="true">
      <ellipse cx="40" cy="92" rx="17" ry="2.5" className="bit-shadow fill-black/40" />

      <g className="bit-body">
        {/* antenna */}
        <path d="M40 18V10" strokeWidth="2" strokeLinecap="round" className="stroke-border" />
        <circle cx="40" cy="7" r="3.5" className={`bit-led transition-[fill] duration-300 ${led[mood] ?? led.idle}`} />

        {/* arms sit behind the torso */}
        <rect x="13" y="63" width="8" height="15" rx="4" className="bit-arm-l fill-surface-2 stroke-border" strokeWidth="1.5" />
        <rect x="59" y="63" width="8" height="15" rx="4" className="bit-arm-r fill-surface-2 stroke-border" strokeWidth="1.5" />

        {/* torso */}
        <rect x="35" y="56" width="10" height="6" rx="2" className="fill-border-soft" />
        <rect x="21" y="61" width="38" height="24" rx="9" className="fill-surface-2 stroke-border" strokeWidth="1.5" />
        <circle cx="40" cy="73" r="3" className={`transition-[fill] duration-300 ${led[mood] ?? led.idle} opacity-70`} />

        {/* head + ears */}
        <rect x="6" y="30" width="7" height="14" rx="3" className="fill-border-soft" />
        <rect x="67" y="30" width="7" height="14" rx="3" className="fill-border-soft" />
        <rect x="11" y="17" width="58" height="41" rx="13" className="fill-surface-2 stroke-border" strokeWidth="1.5" />

        {/* screen with the face */}
        <rect x="17" y="23" width="46" height="29" rx="8" className="fill-[#0b0f16] stroke-blue-dim" strokeWidth="1.5" />
        <g className="bit-face">
          <Eyes mood={mood} />
          <Mouth mood={mood} />
        </g>
      </g>

      {mood === "sleeping" && (
        <g className="bit-zz fill-ink-dim font-mono" fontSize="9" fontWeight="600">
          <text x="64" y="16">z</text>
          <text x="71" y="8" fontSize="7">z</text>
        </g>
      )}
    </svg>
  );
}
