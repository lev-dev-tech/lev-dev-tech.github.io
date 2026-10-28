import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";
import { hash } from "../anim";

export const Bedroom: React.FC<{ frame: number; pan?: number; dark?: number; children?: React.ReactNode }> = ({ frame, pan = 0, dark = 0, children }) => {
  const id = useId().replace(/:/g, "");
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id={`w${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10141f" />
            <stop offset="100%" stopColor="#1a2133" />
          </linearGradient>
          <radialGradient id={`mg${id}`} cx="0.5" cy="0.3">
            <stop offset="0%" stopColor="#9fb6e8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#9fb6e8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform={`translate(${pan * 30},0)`}>
          <rect x={-100} y={-100} width={1280} height={1300} fill={`url(#w${id})`} />
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={-100 + i * 150} y={-100} width={6} height={1300} fill="#0c0f18" opacity={0.6} />
          ))}
          <ellipse cx={720} cy={700} rx={500} ry={600} fill={`url(#mg${id})`} />
          <rect x={560} y={260} width={330} height={420} rx={10} fill="#0a1326" stroke="#2a3550" strokeWidth={14} />
          <circle cx={780} cy={370} r={56} fill="#e8e3cf" />
          <circle cx={760} cy={356} r={10} fill="#cfc8b2" />
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={i} cx={590 + hash(i) * 280} cy={290 + hash(i + 9) * 340} r={2 + hash(i + 3) * 2} fill="#dfe6ff" opacity={0.6} />
          ))}
          <line x1={725} y1={260} x2={725} y2={680} stroke="#2a3550" strokeWidth={12} />
          <line x1={560} y1={470} x2={890} y2={470} stroke="#2a3550" strokeWidth={12} />
          <path d={`M 520 230 Q ${560 + Math.sin(frame * 0.05) * 8} 470 540 720 L 600 720 Q 610 470 590 230 Z`} fill="#1e3e7a" stroke={C.ink} strokeWidth={6} />
          <path d={`M 930 230 Q ${890 + Math.sin(frame * 0.05 + 1) * 8} 470 910 720 L 850 720 Q 840 470 860 230 Z`} fill="#1e3e7a" stroke={C.ink} strokeWidth={6} />
          <rect x={500} y={216} width={460} height={20} rx={10} fill="#3a2a1c" />
          <rect x={90} y={300} width={180} height={240} fill="#c9c2ae" stroke={C.ink} strokeWidth={6} transform="rotate(-4,180,420)" />
          <path d="M 120 470 L 170 360 L 210 420 L 240 380 L 250 480 Z" fill="#2c3e50" transform="rotate(-4,180,420)" />
          <rect x={-100} y={1120} width={1280} height={900} fill="#0d1018" />
          <rect x={-100} y={1110} width={1280} height={16} fill="#232838" />
        </g>
        <g transform={`translate(${pan * 60},0)`}>
          <rect x={60} y={720} width={60} height={440} rx={8} fill="#4a3325" stroke={C.ink} strokeWidth={8} />
          <rect x={960} y={860} width={50} height={300} rx={8} fill="#4a3325" stroke={C.ink} strokeWidth={8} />
          <rect x={80} y={940} width={920} height={60} rx={10} fill="#5b3f2e" stroke={C.ink} strokeWidth={8} />
          <rect x={90} y={1000} width={900} height={150} fill="#030305" />
          <rect x={100} y={880} width={890} height={70} rx={20} fill="#d8dbe6" stroke={C.ink} strokeWidth={7} />
          <path d="M 120 760 Q 140 720 220 720 L 330 730 Q 360 760 340 800 L 140 810 Q 112 800 120 760 Z" fill="#f1f1f6" stroke={C.ink} strokeWidth={7} />
        </g>
      </svg>
      {children}
      {dark ? <AbsoluteFill style={{ background: "#000", opacity: dark }} /> : null}
    </AbsoluteFill>
  );
};

export const Blanket: React.FC<{ frame: number; tremble?: number; w?: number; style?: React.CSSProperties }> = ({ frame, tremble = 0, w = 820, style }) => {
  const t = Math.sin(frame * 1.7) * tremble;
  return (
    <svg viewBox="-410 -260 820 300" width={w} height={(w * 300) / 820} style={{ overflow: "visible", ...style }}>
      <path
        d={`M -400 20 Q -380 ${-160 + t} -200 ${-200 - t} Q -60 ${-240 + t} 80 ${-170 - t} Q 260 ${-120 + t} 380 ${-150} Q 420 -60 400 20 Z`}
        fill={C.blue}
        stroke={C.ink}
        strokeWidth={8}
        strokeLinejoin="round"
      />
      {[-300, -160, -20, 120, 260].map((x, i) => (
        <path key={i} d={`M ${x} ${-150 + (i % 2) * 20} L ${x + 20} 10`} stroke="#165bb3" strokeWidth={8} strokeLinecap="round" />
      ))}
      <path d={`M -400 20 L 400 20`} stroke={C.ink} strokeWidth={8} />
    </svg>
  );
};

export const Crystal: React.FC<{ broken?: number; glow?: number; size?: number; style?: React.CSSProperties; color?: string }> = ({ broken = 0, glow = 1, size = 1, style, color = "#6fc3ff" }) => {
  const id = useId().replace(/:/g, "");
  const shards = Array.from({ length: 12 }).map((_, i) => {
    const a = hash(i + 4) * Math.PI * 2;
    const d = broken * (120 + hash(i) * 200);
    return { x: Math.cos(a) * d, y: Math.sin(a) * d - 140 + broken * broken * 120, r: hash(i + 2) * 360 * broken, s: 14 + hash(i + 8) * 26 };
  });
  return (
    <svg viewBox="-200 -380 400 420" width={400 * size} height={420 * size} style={{ overflow: "visible", ...style }}>
      <defs>
        <filter id={`cg${id}`} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
      </defs>
      <path d="M -110 0 L -90 -60 L 90 -60 L 110 0 Z" fill="#3a4150" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
      <rect x={-100} y={-74} width={200} height={20} rx={6} fill="#4c5466" stroke={C.ink} strokeWidth={6} />
      {broken < 0.05 ? (
        <g>
          <ellipse cx={0} cy={-180} rx={110} ry={150} fill={color} opacity={0.35 * glow} filter={`url(#cg${id})`} />
          <polygon points="0,-330 60,-210 40,-80 -40,-80 -60,-210" fill={color} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
          <polygon points="0,-330 20,-210 0,-80 -40,-80 -60,-210" fill="#ffffff" opacity={0.35} />
          <polygon points="60,-210 40,-80 0,-80 20,-210" fill={C.blue} opacity={0.5} />
          <polygon points="-90,-180 -60,-120 -70,-80 -100,-80 -110,-130" fill={color} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
          <polygon points="90,-170 110,-130 100,-80 70,-80 64,-120" fill={color} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
        </g>
      ) : (
        <g>
          <ellipse cx={0} cy={-160} rx={200 * broken + 60} ry={200 * broken + 60} fill="#ffffff" opacity={Math.max(0, 0.8 - broken)} filter={`url(#cg${id})`} />
          {shards.map((s, i) => (
            <polygon key={i} points={`0,${-s.s} ${s.s * 0.6},0 0,${s.s} ${-s.s * 0.6},0`} fill={color} stroke={C.ink} strokeWidth={4} transform={`translate(${s.x},${s.y}) rotate(${s.r})`} opacity={Math.max(0, 1.2 - broken)} />
          ))}
          <polygon points="-40,-80 -20,-110 10,-96 40,-80" fill={color} stroke={C.ink} strokeWidth={5} />
        </g>
      )}
    </svg>
  );
};

export const Seal: React.FC<{ frame: number; power?: number; crack?: number; size?: number; style?: React.CSSProperties; color?: string }> = ({ frame, power = 1, crack = 0, size = 1, style, color = "#6fc3ff" }) => {
  const id = useId().replace(/:/g, "");
  const runes = Array.from({ length: 12 }).map((_, i) => i);
  return (
    <svg viewBox="-500 -200 1000 400" width={1000 * size} height={400 * size} style={{ overflow: "visible", ...style }}>
      <defs>
        <filter id={`sg${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <ellipse rx={470} ry={170} fill="#15171e" stroke="#2a3040" strokeWidth={10} />
      <g opacity={power}>
        <ellipse rx={400} ry={140} fill="none" stroke={color} strokeWidth={22} opacity={0.5} filter={`url(#sg${id})`} />
        <ellipse rx={400} ry={140} fill="none" stroke={color} strokeWidth={6} />
        <ellipse rx={300} ry={104} fill="none" stroke={color} strokeWidth={4} strokeDasharray="30 18" strokeDashoffset={frame * 2} />
        {runes.map((i) => {
          const a = (i / 12) * Math.PI * 2 + frame * 0.01;
          return (
            <text key={i} x={Math.cos(a) * 350} y={Math.sin(a) * 122 + 12} fill={color} fontSize={40} fontWeight={900} textAnchor="middle" fontFamily="serif">
              {"ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ"[i]}
            </text>
          );
        })}
        <polygon points="0,-90 80,40 -80,40" fill="none" stroke={color} strokeWidth={6} transform="scale(1,0.7)" />
      </g>
      {crack > 0 ? (
        <g stroke={C.red} strokeWidth={8} fill="none" strokeLinecap="round" opacity={crack}>
          <path d="M -60 -20 L -140 30 L -200 10 L -290 70" />
          <path d="M 40 10 L 120 -40 L 190 -20 L 260 -80" />
          <path d="M 0 0 L 20 90 L -30 140" />
        </g>
      ) : null}
    </svg>
  );
};

export const Vortex: React.FC<{ frame: number; size?: number; open?: number; style?: React.CSSProperties }> = ({ frame, size = 1, open = 1, style }) => {
  const id = useId().replace(/:/g, "");
  const arms = Array.from({ length: 7 }).map((_, k) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const a = k * ((Math.PI * 2) / 7) + t * 5 + frame * 0.09;
      const r = t * 430;
      pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r * 0.5).toFixed(1)}`);
    }
    return pts.join(" ");
  });
  return (
    <svg viewBox="-500 -300 1000 600" width={1000 * size} height={600 * size} style={{ overflow: "visible", ...style }}>
      <defs>
        <radialGradient id={`vg${id}`}>
          <stop offset="0%" stopColor="#000" />
          <stop offset="55%" stopColor="#0a0306" />
          <stop offset="80%" stopColor="#5a0b14" />
          <stop offset="100%" stopColor="#e53935" stopOpacity="0" />
        </radialGradient>
        <filter id={`vb${id}`}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <g transform={`scale(${open})`}>
        <ellipse rx={470} ry={240} fill={`url(#vg${id})`} />
        {arms.map((p, i) => (
          <polyline key={i} points={p} fill="none" stroke={i % 2 ? "#8e1116" : "#1a0508"} strokeWidth={i % 2 ? 8 : 26} strokeLinecap="round" filter={i % 2 ? `url(#vb${id})` : undefined} />
        ))}
        <ellipse rx={120} ry={60} fill="#000" />
      </g>
    </svg>
  );
};

export const Room: React.FC<{ children?: React.ReactNode; color?: string }> = ({ children, color = C.bg }) => <AbsoluteFill style={{ background: color }}>{children}</AbsoluteFill>;
