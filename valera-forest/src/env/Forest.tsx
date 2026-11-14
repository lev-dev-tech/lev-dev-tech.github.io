import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";
import { hash, jitter } from "../anim";

export type Mood = "night" | "deep" | "morning";

const PAL: Record<Mood, { sky: [string, string, string]; far: string; mid: string; near: string; ground: string; path: string; fog: string; fogOp: number; rim: string; moon: boolean }> = {
  night: { sky: ["#090b10", "#111726", "#1b2338"], far: "#172036", mid: "#1b2a2d", near: "#0d1214", ground: "#10151b", path: "#1a2029", fog: "#c9d6ea", fogOp: 0.09, rim: "#2a3a52", moon: true },
  deep: { sky: ["#07070b", "#140b12", "#2a0e16"], far: "#1a1420", mid: "#1a1c22", near: "#0a0b0e", ground: "#0e0c10", path: "#1b141a", fog: "#e2a0a8", fogOp: 0.07, rim: "#4a1a24", moon: false },
  morning: { sky: ["#36557a", "#c98a6a", "#f6c27e"], far: "#5d6f80", mid: "#3d5447", near: "#273229", ground: "#4b5638", path: "#6b6a48", fog: "#fff1dc", fogOp: 0.28, rim: "#7d8f70", moon: false },
};

const pine = (x: number, base: number, h: number, w: number, tiers = 4) => {
  let d = "";
  for (let i = 0; i < tiers; i++) {
    const top = base - h + (h / tiers) * i * 0.85;
    const bot = top + h / tiers + h * 0.18;
    const ww = w * (0.45 + (i / tiers) * 0.65);
    d += `M ${x} ${top} L ${x + ww} ${bot} L ${x + ww * 0.35} ${bot - 8} L ${x - ww * 0.35} ${bot - 8} L ${x - ww} ${bot} Z `;
  }
  d += `M ${x - w * 0.08} ${base - 20} L ${x + w * 0.08} ${base - 20} L ${x + w * 0.08} ${base + 30} L ${x - w * 0.08} ${base + 30} Z`;
  return d;
};

const Layer: React.FC<{ shift: number; children: React.ReactNode; y?: number }> = ({ shift, children, y = 0 }) => (
  <g transform={`translate(${shift},${y})`}>{children}</g>
);

export const Fog: React.FC<{ frame: number; color: string; opacity: number; y: number; seed: number; speed?: number }> = ({ frame, color, opacity, y, seed, speed = 0.6 }) => {
  const id = useId().replace(/:/g, "");
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={`fg${id}`}>
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="55%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => {
        const x = ((frame * speed * (1 + i * 0.3) + hash(seed + i) * 1600) % 2200) - 600;
        return <ellipse key={i} cx={x} cy={y + (i % 2) * 40} rx={620 + i * 60} ry={130 + (i % 3) * 30} fill={`url(#fg${id})`} />;
      })}
    </g>
  );
};

export const Forest: React.FC<{ frame: number; mood?: Mood; pan?: number; moonY?: number; horizon?: number; hideMoon?: boolean; children?: React.ReactNode; tint?: number }> = ({
  frame,
  mood = "night",
  pan = 0,
  moonY = 330,
  horizon = 940,
  hideMoon,
  children,
  tint = 0,
}) => {
  const id = useId().replace(/:/g, "");
  const p = PAL[mood];
  const far = Array.from({ length: 22 }).map((_, i) => pine(-200 + i * 75 + hash(i) * 30, horizon - 10 + hash(i + 3) * 20, 180 + hash(i + 9) * 120, 60 + hash(i + 1) * 20));
  const mid = Array.from({ length: 11 }).map((_, i) => pine(-240 + i * 160 + hash(i + 40) * 60, horizon + 50 + hash(i + 43) * 30, 400 + hash(i + 49) * 220, 120 + hash(i + 41) * 40, 5));
  const stars = Array.from({ length: 70 }).map((_, i) => ({ x: hash(i + 100) * 1300 - 110, y: hash(i + 200) * 700, r: 1 + hash(i + 300) * 2.5, tw: 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.05 + i)) }));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.sky[0]} />
            <stop offset="35%" stopColor={p.sky[1]} />
            <stop offset="55%" stopColor={p.sky[2]} />
            <stop offset="100%" stopColor={p.ground} />
          </linearGradient>
          <radialGradient id={`moon${id}`}>
            <stop offset="0%" stopColor="#f6f1dc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f6f1dc" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`sun${id}`}>
            <stop offset="0%" stopColor="#fff2c4" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#ffd27a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffb35a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`gr${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.ground} />
            <stop offset="100%" stopColor="#07080b" />
          </linearGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={2400} fill={`url(#sky${id})`} />
        {mood !== "morning" ? (
          <Layer shift={pan * 10}>
            {stars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#dfe6ff" opacity={s.tw * (mood === "deep" ? 0.3 : 0.7)} />
            ))}
          </Layer>
        ) : null}
        {p.moon && !hideMoon ? (
          <Layer shift={pan * 18}>
            <circle cx={790} cy={moonY} r={260} fill={`url(#moon${id})`} />
            <circle cx={790} cy={moonY} r={92} fill="#efeadb" />
            <circle cx={760} cy={moonY - 20} r={18} fill="#d8d2c0" />
            <circle cx={820} cy={moonY + 26} r={12} fill="#d8d2c0" />
            <circle cx={800} cy={moonY - 40} r={8} fill="#d8d2c0" />
          </Layer>
        ) : null}
        {mood === "morning" ? (
          <Layer shift={pan * 18}>
            <circle cx={540} cy={horizon - 60} r={420} fill={`url(#sun${id})`} />
            <circle cx={540} cy={horizon - 40} r={90} fill="#fff1c9" opacity={0.95} />
          </Layer>
        ) : null}
        {mood === "deep" ? <rect x={-200} y={horizon - 400} width={1480} height={500} fill="#e53935" opacity={0.08 + tint * 0.2} /> : null}
        <Layer shift={pan * 40}>
          {far.map((d, i) => (
            <path key={i} d={d} fill={p.far} />
          ))}
        </Layer>
        <Fog frame={frame} color={p.fog} opacity={p.fogOp * 1.4} y={horizon - 40} seed={1} />
        <Layer shift={pan * 80}>
          {mid.map((d, i) => (
            <path key={i} d={d} fill={p.mid} stroke={p.rim} strokeWidth={3} strokeLinejoin="round" opacity={0.95} />
          ))}
        </Layer>
        <rect x={-200} y={horizon + 60} width={1480} height={1400} fill={`url(#gr${id})`} />
        <Layer shift={pan * 110}>
          <path d={`M 300 ${horizon + 70} Q 540 ${horizon + 50} 780 ${horizon + 70} L 1220 1500 L -140 1500 Z`} fill={p.path} opacity={0.6} />
          {Array.from({ length: 14 }).map((_, i) => (
            <ellipse key={i} cx={hash(i + 500) * 1300 - 100} cy={horizon + 120 + hash(i + 600) * 300} rx={20 + hash(i) * 30} ry={6 + hash(i) * 6} fill="#000" opacity={0.25} />
          ))}
        </Layer>
        <Fog frame={frame} color={p.fog} opacity={p.fogOp} y={horizon + 120} seed={7} speed={1} />
        <Layer shift={pan * 160}>
          <path d="M -60 -100 L 90 -100 Q 120 600 110 1300 L -60 1300 Z" fill={p.near} stroke={p.rim} strokeWidth={5} />
          <path d="M 60 200 Q 80 400 70 600 M 30 700 Q 50 900 40 1100" stroke={p.rim} strokeWidth={4} fill="none" opacity={0.6} />
          <path d="M 100 380 Q 220 330 300 360 L 290 380 Q 200 360 104 410 Z" fill={p.near} stroke={p.rim} strokeWidth={4} />
          <path d="M 1010 -100 L 1180 -100 L 1180 1300 L 985 1300 Q 970 600 1010 -100 Z" fill={p.near} stroke={p.rim} strokeWidth={5} />
          <path d="M 1040 300 Q 1030 500 1045 700" stroke={p.rim} strokeWidth={4} fill="none" opacity={0.6} />
          <path d="M 1000 520 Q 900 470 820 500 L 830 520 Q 910 500 996 560 Z" fill={p.near} stroke={p.rim} strokeWidth={4} />
        </Layer>
      </svg>
      {children}
    </AbsoluteFill>
  );
};

export const Bush: React.FC<{ frame: number; shake?: number; color?: string; rim?: string; w?: number; style?: React.CSSProperties; eyes?: boolean }> = ({
  frame,
  shake = 0,
  color = "#16231f",
  rim = "#2c4436",
  w = 520,
  style,
  eyes,
}) => {
  const blobs = [
    [-170, -60, 110], [-60, -130, 140], [80, -120, 130], [190, -50, 100], [0, -40, 150], [-230, 0, 70], [240, 10, 70],
  ];
  const r = shake ? jitter(frame, 2, shake) : 0;
  return (
    <svg viewBox="-280 -280 560 300" width={w} height={(w * 300) / 560} style={{ overflow: "visible", ...style }}>
      <g transform={`rotate(${r * 0.6},0,0) translate(${r},0)`}>
        {blobs.map(([x, y, s], i) => (
          <circle key={i} cx={x} cy={y} r={s} fill={color} stroke={rim} strokeWidth={6} />
        ))}
        {blobs.map(([x, y, s], i) => (
          <circle key={"i" + i} cx={x - s * 0.2} cy={y - s * 0.25} r={s * 0.5} fill="#ffffff" opacity={0.03} />
        ))}
        <rect x={-280} y={0} width={560} height={40} fill={color} />
        {eyes ? (
          <g>
            <circle cx={-40} cy={-90} r={14} fill="#ffe14d" />
            <circle cx={30} cy={-92} r={10} fill="#ffe14d" />
            <circle cx={-40 + jitter(frame, 3, 3)} cy={-90} r={5} fill={C.ink} />
            <circle cx={30 + jitter(frame, 4, 3)} cy={-92} r={4} fill={C.ink} />
          </g>
        ) : null}
      </g>
    </svg>
  );
};

export const Smoke: React.FC<{ progress: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ progress, size = 1, color = "#272a33", style }) => {
  const puffs = Array.from({ length: 26 }).map((_, i) => {
    const a = hash(i + 1) * Math.PI * 2;
    const d = (0.2 + hash(i + 7) * 0.8) * 320 * Math.min(1, progress * 1.6);
    const r = (60 + hash(i + 3) * 90) * (0.4 + Math.min(1, progress * 2)) * (progress > 0.7 ? 1 + (progress - 0.7) * 1.2 : 1);
    return { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.8 - progress * 120 * hash(i + 9), r };
  });
  const op = progress < 0.75 ? 1 : 1 - (progress - 0.75) / 0.25;
  return (
    <svg viewBox="-500 -500 1000 1000" width={1000 * size} height={1000 * size} style={{ overflow: "visible", opacity: op, filter: "blur(5px)", ...style }}>
      {puffs.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={i % 3 === 0 ? "#3a3e4a" : color} />
      ))}
    </svg>
  );
};

export const Stump: React.FC<{ w?: number; style?: React.CSSProperties }> = ({ w = 360, style }) => (
  <svg viewBox="-180 -160 360 180" width={w} height={(w * 180) / 360} style={{ overflow: "visible", ...style }}>
    <path d="M -140 -110 L -150 10 L 150 10 L 140 -110 Z" fill="#6b4a30" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <ellipse cx={0} cy={-110} rx={140} ry={38} fill="#c9a06a" stroke={C.ink} strokeWidth={7} />
    <ellipse cx={0} cy={-110} rx={90} ry={22} fill="none" stroke="#9c7444" strokeWidth={5} />
    <ellipse cx={0} cy={-110} rx={40} ry={10} fill="none" stroke="#9c7444" strokeWidth={5} />
    <path d="M -100 -70 L -96 -10 M -40 -60 L -40 0 M 60 -64 L 64 0" stroke="#4c3220" strokeWidth={5} />
  </svg>
);
