import React, { useId } from "react";
import { C } from "../theme";
import { hash, jitter } from "../anim";

const RIM = "#34405e";
const FUR = "#0a0b0f";

const spiky = (cx: number, cy: number, rx: number, ry: number, n: number, spike: number, seed: number, from = 0, to = Math.PI * 2) => {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = from + ((to - from) * i) / n;
    const s = i % 2 === 0 ? 1 : 1 + spike * (0.6 + hash(seed + i) * 0.8);
    pts.push(`${(cx + Math.cos(a) * rx * s).toFixed(1)},${(cy + Math.sin(a) * ry * s).toFixed(1)}`);
  }
  return pts.join(" ");
};

export type WolfPose = "stand" | "growl" | "howl" | "pounce" | "run";

export const Wolf: React.FC<{ pose?: WolfPose; frame?: number; size?: number; flip?: boolean; glow?: number; style?: React.CSSProperties }> = ({
  pose = "stand",
  frame = 0,
  size = 1,
  flip,
  glow = 1,
  style,
}) => {
  const uid = useId().replace(/:/g, "");
  const breathe = Math.sin(frame * 0.12) * 4;
  const crouch = pose === "pounce" ? 50 : pose === "growl" ? 18 : 0;
  const headRot = pose === "howl" ? -38 : pose === "pounce" ? 12 : pose === "growl" ? 6 : 0;
  const run = pose === "run" ? Math.sin(frame * 0.6) : 0;
  const mouthOpen = pose === "growl" || pose === "pounce" ? 1 : pose === "howl" ? 0.8 : 0;
  const legs = [
    { x: -170, a: run * 30 },
    { x: -110, a: -run * 30 },
    { x: 150, a: -run * 30 },
    { x: 210, a: run * 30 },
  ];
  return (
    <svg viewBox="-460 -560 920 600" width={920 * size} height={600 * size} style={{ overflow: "visible", ...style }}>
      <defs>
        <filter id={`wg${uid}`} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <radialGradient id={`ws${uid}`}>
          <stop offset="0%" stopColor="#000" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={8} rx={360} ry={34} fill={`url(#ws${uid})`} />
      <g transform={`${flip ? "scale(-1,1)" : ""} translate(0,${crouch})`}>
        <g transform={`rotate(${-20 + run * 10 + Math.sin(frame * 0.1) * 6},280,-280)`}>
          <polygon points={spiky(380, -330, 120, 40, 22, 0.35, 5, Math.PI * 0.0, Math.PI * 2)} fill={FUR} stroke={RIM} strokeWidth={6} strokeLinejoin="round" />
        </g>
        {legs.map((l, i) => (
          <g key={i} transform={`translate(${l.x},-150) rotate(${l.a})`}>
            <path d={`M -30 0 L 30 0 L 22 ${140 - crouch * 0.8} L 36 ${150 - crouch * 0.8} L -30 ${150 - crouch * 0.8} L -22 ${140 - crouch * 0.8} Z`} fill={FUR} stroke={RIM} strokeWidth={6} strokeLinejoin="round" />
          </g>
        ))}
        <polygon points={spiky(20, -250 + breathe * 0.3, 280, 120 + breathe, 46, 0.12, 11)} fill={FUR} stroke={RIM} strokeWidth={7} strokeLinejoin="round" />
        <polygon points={spiky(-160, -300, 110, 120, 22, 0.2, 21)} fill={FUR} stroke={RIM} strokeWidth={6} strokeLinejoin="round" />
        <g transform={`translate(-250,-360) rotate(${headRot})`}>
          <polygon points="-40,-90 -10,-190 40,-90" fill={FUR} stroke={RIM} strokeWidth={7} strokeLinejoin="round" />
          <polygon points="20,-90 70,-180 90,-70" fill={FUR} stroke={RIM} strokeWidth={7} strokeLinejoin="round" />
          <polygon points="-30,-80 -12,-150 16,-86" fill="#2a1416" />
          <polygon points={spiky(10, 0, 115, 100, 30, 0.12, 31)} fill={FUR} stroke={RIM} strokeWidth={7} strokeLinejoin="round" />
          <path d={`M -60 -20 L -210 ${10} Q -230 30 -206 48 L -60 ${60}`} fill={FUR} stroke={RIM} strokeWidth={7} strokeLinejoin="round" />
          <ellipse cx={-212} cy={22} rx={20} ry={16} fill="#20242e" stroke={RIM} strokeWidth={4} />
          <g transform={`translate(-60,56) rotate(${-mouthOpen * 16},0,0)`}>
            <path d="M 0 0 L -150 -8 Q -160 12 -140 24 L 0 26 Z" fill={FUR} stroke={RIM} strokeWidth={6} strokeLinejoin="round" />
            {mouthOpen > 0
              ? [0, 1, 2, 3, 4].map((i) => <polygon key={i} points={`${-140 + i * 26},-6 ${-128 + i * 26},-6 ${-134 + i * 26},-24`} fill="#f2f2f2" />)
              : null}
          </g>
          {mouthOpen > 0 ? (
            <>
              <path d="M -60 40 L -200 40 L -60 70 Z" fill="#3a0b0e" />
              {[0, 1, 2, 3, 4].map((i) => (
                <polygon key={i} points={`${-190 + i * 26},38 ${-176 + i * 26},38 ${-183 + i * 26},62`} fill="#f2f2f2" />
              ))}
            </>
          ) : null}
          <g transform="translate(-40,-20)">
            <ellipse rx={30 * glow} ry={18 * glow} fill={C.red} opacity={0.75} filter={`url(#wg${uid})`} />
            <path d="M -26 -6 L 22 -14 L 14 8 L -20 8 Z" fill={C.red} />
            <circle cx={-2} cy={-2} r={4} fill="#ffd2d2" />
          </g>
          <g transform="translate(40,-22)">
            <ellipse rx={26 * glow} ry={16 * glow} fill={C.red} opacity={0.6} filter={`url(#wg${uid})`} />
            <path d="M -18 -10 L 22 -4 L 16 10 L -14 8 Z" fill={C.red} />
          </g>
        </g>
      </g>
    </svg>
  );
};

export const WolfFace: React.FC<{ frame?: number; size?: number; open?: number; style?: React.CSSProperties }> = ({ frame = 0, size = 1, open = 1, style }) => {
  const uid = useId().replace(/:/g, "");
  const snarl = Math.sin(frame * 0.5) * 3;
  return (
    <svg viewBox="-400 -420 800 800" width={800 * size} height={800 * size} style={{ overflow: "visible", ...style }}>
      <defs>
        <filter id={`fg${uid}`} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      <polygon points="-250,-120 -190,-400 -70,-180" fill={FUR} stroke={RIM} strokeWidth={9} strokeLinejoin="round" />
      <polygon points="250,-120 190,-400 70,-180" fill={FUR} stroke={RIM} strokeWidth={9} strokeLinejoin="round" />
      <polygon points="-200,-150 -180,-320 -110,-180" fill="#2a1416" />
      <polygon points="200,-150 180,-320 110,-180" fill="#2a1416" />
      <polygon points={spiky(0, 0, 300, 280, 50, 0.13, 3)} fill={FUR} stroke={RIM} strokeWidth={9} strokeLinejoin="round" />
      <path d="M -140 60 Q 0 -20 140 60 L 120 230 Q 0 300 -120 230 Z" fill="#14161d" stroke={RIM} strokeWidth={8} strokeLinejoin="round" />
      <ellipse cx={0} cy={70} rx={56} ry={36} fill="#2a2e3a" stroke={RIM} strokeWidth={6} />
      <path d={`M -120 ${150 + snarl} Q 0 ${110 + snarl} 120 ${150 + snarl} L 100 ${150 + open * 110} Q 0 ${180 + open * 110} -100 ${150 + open * 110} Z`} fill="#3a0b0e" stroke={RIM} strokeWidth={6} strokeLinejoin="round" />
      {[-90, -50, -10, 30, 70].map((x, i) => (
        <polygon key={i} points={`${x},${140 + snarl} ${x + 30},${140 + snarl} ${x + 15},${(i === 0 || i === 4 ? 210 : 175) + snarl}`} fill="#f4f4f4" stroke={C.ink} strokeWidth={3} />
      ))}
      {[-80, -40, 0, 40].map((x, i) => (
        <polygon key={i} points={`${x},${150 + open * 108} ${x + 30},${150 + open * 108} ${x + 15},${116 + open * 100}`} fill="#f4f4f4" stroke={C.ink} strokeWidth={3} />
      ))}
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * 110},-60)`}>
          <ellipse rx={80} ry={50} fill={C.red} opacity={0.8} filter={`url(#fg${uid})`} />
          <path d={`M ${-s * 60} -24 L ${s * 60} 4 L ${s * 40} 30 L ${-s * 50} 20 Z`} fill={C.red} stroke="#ff8a80" strokeWidth={3} strokeLinejoin="round" />
          <ellipse cx={s * 4} cy={6} rx={6} ry={16} fill="#1a0003" />
        </g>
      ))}
      <path d="M -200 -150 L -50 -100" stroke={RIM} strokeWidth={10} strokeLinecap="round" />
      <path d="M 200 -150 L 50 -100" stroke={RIM} strokeWidth={10} strokeLinecap="round" />
    </svg>
  );
};

export const Squirrel: React.FC<{ frame?: number; size?: number; style?: React.CSSProperties; crazy?: number }> = ({ frame = 0, size = 1, style, crazy = 1 }) => {
  const tw = jitter(frame, 9, 4 * crazy);
  const fur = "#b8622b";
  const furD = "#8a4519";
  return (
    <svg viewBox="-260 -520 520 540" width={520 * size} height={540 * size} style={{ overflow: "visible", ...style }}>
      <path d="M 60 -40 C 260 -60 280 -300 170 -400 C 120 -440 60 -420 80 -360 C 170 -320 170 -180 40 -150 Z" fill={furD} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 110 -330 C 170 -280 160 -200 90 -170" stroke={fur} strokeWidth={16} fill="none" strokeLinecap="round" />
      <g transform={`translate(${tw},0) rotate(${jitter(frame, 4, 5 * crazy)},0,-200)`}>
        <ellipse cx={0} cy={-120} rx={100} ry={120} fill={fur} stroke={C.ink} strokeWidth={8} />
        <ellipse cx={0} cy={-100} rx={60} ry={84} fill="#f0c89a" />
        <ellipse cx={-50} cy={-10} rx={36} ry={20} fill={furD} stroke={C.ink} strokeWidth={7} />
        <ellipse cx={50} cy={-10} rx={36} ry={20} fill={furD} stroke={C.ink} strokeWidth={7} />
        <circle cx={-46} cy={-170} r={24} fill={fur} stroke={C.ink} strokeWidth={7} />
        <circle cx={46} cy={-170} r={24} fill={fur} stroke={C.ink} strokeWidth={7} />
        <g transform="translate(0,-320)">
          <polygon points="-90,-60 -70,-150 -30,-80" fill={fur} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
          <polygon points="90,-60 70,-150 30,-80" fill={fur} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
          <path d="M -72 -140 L -80 -170 M -70 -140 L -60 -172 M 72 -140 L 80 -170 M 70 -140 L 60 -172" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
          <ellipse cx={0} cy={0} rx={120} ry={104} fill={fur} stroke={C.ink} strokeWidth={8} />
          <ellipse cx={0} cy={40} rx={66} ry={52} fill="#f0c89a" />
          <circle cx={-48} cy={-18} r={44 + Math.sin(frame * 0.9) * 3 * crazy} fill="#fff" stroke={C.ink} strokeWidth={7} />
          <circle cx={52} cy={-14} r={34} fill="#fff" stroke={C.ink} strokeWidth={7} />
          <circle cx={-48 + jitter(frame, 1, 9 * crazy)} cy={-18 + jitter(frame, 2, 9 * crazy)} r={7} fill={C.ink} />
          <circle cx={52 + jitter(frame, 3, 6 * crazy)} cy={-14 + jitter(frame, 5, 6 * crazy)} r={13} fill={C.ink} />
          <path d="M -86 -74 L -16 -54" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
          <path d="M 90 -60 L 26 -64" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
          <ellipse cx={0} cy={20} rx={16} ry={11} fill={C.ink} />
          <path d="M -40 44 Q 0 30 40 44 Q 30 76 0 76 Q -30 76 -40 44 Z" fill="#5a1418" stroke={C.ink} strokeWidth={6} />
          <rect x={-16} y={38} width={15} height={30} rx={3} fill="#fff" stroke={C.ink} strokeWidth={4} />
          <rect x={1} y={38} width={15} height={30} rx={3} fill="#fff" stroke={C.ink} strokeWidth={4} />
          <path d="M -120 20 L -170 10 M -120 34 L -172 40 M 120 20 L 170 10 M 120 34 L 172 40" stroke="#d9d9d9" strokeWidth={4} strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};

export const Monster: React.FC<{ frame?: number; size?: number; fade?: number; rage?: number; style?: React.CSSProperties }> = ({ frame = 0, size = 1, fade = 0, rage = 1, style }) => {
  const uid = useId().replace(/:/g, "");
  const n = 64;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 330 + Math.sin(a * 5 + frame * 0.12) * 26 + Math.sin(a * 9 - frame * 0.2) * 14 + (Math.sin(a) > 0.3 ? 120 : 0) * Math.max(0, Math.sin(a));
    pts.push(`${(Math.cos(a) * r * 0.9).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  const eyes = [
    [-120, -120, 34], [110, -130, 40], [0, -210, 26], [-210, -20, 22], [210, -30, 24], [-60, -20, 18], [60, -40, 20], [-160, -220, 16],
    [170, -230, 18], [0, -90, 14], [-250, -140, 14], [250, -150, 15], [-90, 60, 12], [100, 50, 13],
  ];
  const tendrils = Array.from({ length: 9 }).map((_, i) => {
    const bx = -320 + i * 80;
    const w = Math.sin(frame * 0.15 + i) * 40;
    return `M ${bx} 200 C ${bx + w} 320 ${bx - w} 420 ${bx + w * 1.5} ${520 + (i % 3) * 30}`;
  });
  return (
    <svg viewBox="-520 -520 1040 1080" width={1040 * size} height={1080 * size} style={{ overflow: "visible", opacity: 1 - fade, ...style }}>
      <defs>
        <filter id={`mg${uid}`} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={`mb${uid}`}>
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <radialGradient id={`mr${uid}`}>
          <stop offset="0%" stopColor="#1a0306" />
          <stop offset="80%" stopColor="#050507" />
        </radialGradient>
      </defs>
      <polygon points={pts.join(" ")} fill="#000" opacity={0.6} filter={`url(#mb${uid})`} transform="scale(1.12)" />
      {tendrils.map((d, i) => (
        <path key={i} d={d} stroke="#050507" strokeWidth={46 - (i % 3) * 8} fill="none" strokeLinecap="round" />
      ))}
      <polygon points={pts.join(" ")} fill={`url(#mr${uid})`} stroke="#3a0a10" strokeWidth={6} />
      <g transform={`translate(${jitter(frame, 8, 4 * rage)},${jitter(frame, 9, 4 * rage)})`}>
        <path d={`M -170 120 Q 0 ${60 - rage * 10} 170 120 L 130 ${200 + rage * 40} Q 0 ${250 + rage * 50} -130 ${200 + rage * 40} Z`} fill="#2a0005" stroke="#5a0b12" strokeWidth={6} />
        {Array.from({ length: 9 }).map((_, i) => (
          <polygon key={i} points={`${-150 + i * 34},${110 + Math.abs(i - 4) * 4} ${-130 + i * 34},${110 + Math.abs(i - 4) * 4} ${-140 + i * 34},${150 + (i % 2) * 20}`} fill="#d9d2c4" />
        ))}
        {eyes.map(([x, y, r], i) => {
          const blink = (frame + i * 13) % 90 < 4 ? 0.1 : 1;
          return (
            <g key={i} transform={`translate(${x},${y})`}>
              <ellipse rx={r * 1.8} ry={r * 1.4 * blink} fill={C.red} opacity={0.6} filter={`url(#mg${uid})`} />
              <ellipse rx={r} ry={r * 0.75 * blink} fill={C.red} stroke="#ff8a80" strokeWidth={3} />
              <ellipse rx={r * 0.18} ry={r * 0.6 * blink} fill="#1a0003" />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export const RedEyes: React.FC<{ frame?: number; size?: number; open?: number; style?: React.CSSProperties }> = ({ frame = 0, size = 1, open = 1, style }) => {
  const uid = useId().replace(/:/g, "");
  const b = (frame % 70) < 3 ? 0.1 : 1;
  return (
    <svg viewBox="-260 -100 520 200" width={520 * size} height={200 * size} style={{ overflow: "visible", ...style }}>
      <defs>
        <filter id={`re${uid}`} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * 120},0)`}>
          <ellipse rx={90} ry={60 * open * b} fill={C.red} opacity={0.7} filter={`url(#re${uid})`} />
          <path d={`M ${-s * 70} -24 L ${s * 66} 0 L ${s * 46} ${30 * open * b} L ${-s * 56} ${22 * open * b} Z`} fill={C.red} stroke="#ff8a80" strokeWidth={3} strokeLinejoin="round" />
          <ellipse cx={s * 4} cy={4} rx={6} ry={16 * open * b} fill="#1a0003" />
        </g>
      ))}
    </svg>
  );
};
