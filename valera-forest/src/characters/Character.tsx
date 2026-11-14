import React, { useId } from "react";
import { C } from "../theme";
import { hash, jitter } from "../anim";

export type Who = "artem" | "alina" | "valera";
export type Emotion =
  | "neutral"
  | "scared"
  | "panic"
  | "sarcastic"
  | "eyeroll"
  | "tired"
  | "angry"
  | "serious"
  | "shocked"
  | "determined"
  | "happy"
  | "cry"
  | "blink"
  | "smug";
export type Pose = "stand" | "point" | "armsUp" | "pocket" | "phone" | "smash" | "run" | "walk" | "cower" | "paper" | "shrug" | "sit" | "fist";

type Props = {
  who: Who;
  emotion?: Emotion;
  pose?: Pose;
  frame?: number;
  look?: number;
  lookY?: number;
  flip?: boolean;
  tremble?: number;
  redEyes?: boolean;
  swing?: number;
  dirty?: boolean;
  size?: number;
  style?: React.CSSProperties;
};

type Look = { hair: string; hairHi: string; top: string; topShade: string; pants: string; shoe: string; accent: string };

const LOOKS: Record<Who, Look> = {
  artem: { hair: "#f4f4f7", hairHi: "#ffffff", top: "#2a2d37", topShade: "#191b22", pants: "#2b3550", shoe: "#e9e9ee", accent: "#ffffff" },
  alina: { hair: C.blue, hairHi: "#4d93f0", top: "#2b2f3d", topShade: "#1d2029", pants: "#1b1d25", shoe: "#3a2a26", accent: C.red },
  valera: { hair: "#16171d", hairHi: "#3a4157", top: "#2e4a3a", topShade: "#20352a", pants: "#24262e", shoe: "#4a3424", accent: "#8b5a2b" },
};

const SW = 7;

type ArmDef = [number, number];
const POSES: Record<Pose, { l: ArmDef; r: ArmDef; legs: [number, number]; crouch?: number }> = {
  stand: { l: [8, 6], r: [8, 6], legs: [4, 4] },
  point: { l: [8, 4], r: [95, 92], legs: [4, 6] },
  armsUp: { l: [150, 175], r: [150, 175], legs: [10, 10] },
  pocket: { l: [12, -20], r: [12, -20], legs: [3, 3] },
  phone: { l: [8, 4], r: [12, -75], legs: [4, 4] },
  smash: { l: [20, 10], r: [165, 190], legs: [8, 12] },
  run: { l: [50, 80], r: [-30, 30], legs: [25, -20] },
  walk: { l: [10, 5], r: [10, 5], legs: [0, 0] },
  cower: { l: [140, 210], r: [140, 210], legs: [14, 14], crouch: 40 },
  paper: { l: [18, -60], r: [18, -60], legs: [4, 4] },
  shrug: { l: [40, 150], r: [40, 150], legs: [4, 4] },
  sit: { l: [20, -30], r: [10, -70], legs: [60, 60], crouch: 70 },
  fist: { l: [20, -40], r: [60, 150], legs: [8, 8] },
};

const Arm: React.FC<{ x: number; side: 1 | -1; a: ArmDef; color: string; shade: string; item?: React.ReactNode }> = ({ x, side, a, color, shade, item }) => {
  const up = 82;
  const fo = 78;
  const r1 = side * a[0];
  const r2 = side * (a[1] - a[0]);
  return (
    <g transform={`translate(${x},-300) rotate(${-r1})`}>
      <rect x={-21} y={-14} width={42} height={up + 14} rx={21} fill={color} stroke={C.ink} strokeWidth={SW} />
      <g transform={`translate(0,${up}) rotate(${-r2})`}>
        <rect x={-19} y={-12} width={38} height={fo + 12} rx={19} fill={color} stroke={C.ink} strokeWidth={SW} />
        <rect x={-19} y={fo - 18} width={38} height={14} fill={shade} opacity={0.55} />
        <circle cx={0} cy={fo + 8} r={21} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
        {item ? <g transform={`translate(0,${fo + 8})`}>{item}</g> : null}
      </g>
    </g>
  );
};

const Leg: React.FC<{ x: number; a: number; color: string; shoe: string; len: number }> = ({ x, a, color, shoe, len }) => (
  <g transform={`translate(${x},-150) rotate(${a})`}>
    <rect x={-24} y={-10} width={48} height={len + 10} rx={20} fill={color} stroke={C.ink} strokeWidth={SW} />
    <path d={`M -30 ${len - 6} Q -30 ${len - 26} 0 ${len - 24} Q 34 ${len - 24} 38 ${len + 4} L -30 ${len + 8} Z`} fill={shoe} stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" />
  </g>
);

const HairBack: React.FC<{ who: Who; l: Look }> = ({ who, l }) => {
  if (who === "alina")
    return (
      <g fill={l.hair} stroke={C.ink} strokeWidth={SW} strokeLinejoin="round">
        <path d="M -112 -30 C -130 50 -126 130 -104 178 Q -86 190 -64 176 C -74 130 -70 80 -60 40 L -40 -20 Z" />
        <path d="M 112 -30 C 130 50 126 130 104 178 Q 86 190 64 176 C 74 130 70 80 60 40 L 40 -20 Z" />
      </g>
    );
  if (who === "artem")
    return (
      <g fill={l.hair} stroke={C.ink} strokeWidth={SW} strokeLinejoin="round">
        <path d="M -98 20 Q -106 90 -86 146 Q -80 116 -70 128 Q -66 102 -54 108 L -50 50 Z" />
        <path d="M 98 20 Q 106 90 86 146 Q 80 116 70 128 Q 66 102 54 108 L 50 50 Z" />
      </g>
    );
  return null;
};

const HairFront: React.FC<{ who: Who; l: Look }> = ({ who, l }) => {
  if (who === "artem")
    return (
      <g>
        <path
          d="M -114 52 C -130 -50 -80 -136 2 -136 C 84 -136 132 -50 114 52 Q 106 30 98 66 Q 92 20 80 0 Q 76 -20 66 -26 Q 62 -10 54 -6 Q 48 -24 40 -36 Q 32 -16 22 -12 Q 18 -30 8 -40 Q 2 -12 -8 -4 Q -12 -34 -22 -40 Q -30 -18 -42 -10 Q -44 -26 -54 -32 Q -62 -10 -70 -2 Q -76 -16 -82 -10 Q -92 20 -98 64 Q -104 30 -114 52 Z"
          fill={l.hair}
          stroke={C.ink}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
        <path d="M -60 -100 C -30 -118 30 -118 62 -98" stroke="#d9dbe3" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M -40 -76 Q -34 -56 -36 -30 M 4 -82 Q 6 -60 0 -30 M 44 -74 Q 40 -52 44 -30 M -80 -44 Q -86 -10 -90 30 M 82 -44 Q 90 -10 94 32" stroke="#d2d5de" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    );
  if (who === "valera")
    return (
      <g>
        <path
          d="M -106 14 C -120 -40 -100 -96 -60 -116 L -48 -136 L -26 -120 L -4 -140 L 18 -122 L 44 -134 L 56 -112 C 96 -96 120 -50 104 18 C 98 -6 90 -20 80 -26 L 86 4 C 66 -6 52 -22 44 -40 C 24 -16 0 -6 -26 -4 L -14 -26 C -40 -18 -66 -10 -86 6 L -80 -18 C -92 -10 -100 0 -106 14 Z"
          fill={l.hair}
          stroke={C.ink}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
        <path
          d="M -106 14 C -120 -40 -100 -96 -60 -116 L -48 -136 L -26 -120 L -4 -140 L 18 -122 L 44 -134 L 56 -112 C 96 -96 120 -50 104 18"
          fill="none"
          stroke={l.hairHi}
          strokeWidth={4}
          strokeLinejoin="round"
          transform="translate(0,6) scale(0.94)"
        />
        <path d="M -50 -86 C -20 -100 20 -100 46 -88" stroke={l.hairHi} strokeWidth={7} fill="none" strokeLinecap="round" />
      </g>
    );
  return (
    <g>
      <path
        d="M -110 6 C -118 -70 -64 -126 2 -126 C 70 -126 120 -72 110 6 C 100 -18 92 -30 84 -36 L 74 -18 L 62 -40 L 46 -22 L 32 -44 L 14 -24 L 0 -46 L -16 -24 L -32 -44 L -48 -22 L -62 -40 L -76 -18 L -86 -36 C -96 -24 -104 -10 -110 6 Z"
        fill={l.hair}
        stroke={C.ink}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d="M -44 -100 C -14 -112 26 -112 52 -98" stroke={l.hairHi} strokeWidth={8} fill="none" strokeLinecap="round" />
      <circle cx={78} cy={-70} r={11} fill={C.red} stroke={C.ink} strokeWidth={5} />
    </g>
  );
};

const BrowShape: React.FC<{ x: number; y: number; rot: number; w?: number; h?: number }> = ({ x, y, rot, w = 30, h = 10 }) => (
  <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={C.ink} transform={`rotate(${rot},${x},${y})`} />
);

const CLOSED_EYES: Emotion[] = ["blink", "smug"];
const OPEN_MOUTH: Emotion[] = ["panic", "shocked", "happy", "cry", "scared", "determined", "angry"];

const Makeup: React.FC<{ e: Emotion; lx: number }> = ({ e, lx }) => {
  const ex = 36;
  const ey = 4;
  const mx = lx * 0.9;
  const cx = lx * 0.75;
  const wide = e === "panic" || e === "shocked" || e === "scared" ? 1.5 : 1;
  return (
    <g>
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={s * ex + cx} cy={ey - 16 * wide} rx={17} ry={7} fill="#a98bd8" opacity={0.28} />
          {!CLOSED_EYES.includes(e) ? (
            <g stroke={C.ink} strokeWidth={4} strokeLinecap="round" fill="none">
              <path d={`M ${s * (ex + 12 * wide) + cx} ${ey - 4 * wide} L ${s * (ex + 24 * wide) + cx} ${ey - 13 * wide}`} />
              <path d={`M ${s * (ex + 5 * wide) + cx} ${ey - 11 * wide} L ${s * (ex + 13 * wide) + cx} ${ey - 21 * wide}`} />
            </g>
          ) : (
            <path d={`M ${s * (ex + 12) + lx} ${ey + 3} L ${s * (ex + 20) + lx} ${ey - 4}`} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
          )}
        </g>
      ))}
      {!OPEN_MOUTH.includes(e) ? <ellipse cx={mx} cy={58} rx={15} ry={7} fill="#d8667a" opacity={0.55} /> : null}
    </g>
  );
};

const Face: React.FC<{ e: Emotion; lx: number; ly: number; frame: number; redEyes?: boolean; who: Who }> = (props) => (
  <g>
    <FaceBase {...props} />
    {props.who === "alina" ? <Makeup e={props.e} lx={props.lx} /> : null}
  </g>
);

const FaceBase: React.FC<{ e: Emotion; lx: number; ly: number; frame: number; redEyes?: boolean; who: Who }> = ({ e, lx, ly, frame, redEyes, who }) => {
  const Brow: React.FC<{ x: number; y: number; rot: number; w?: number }> = (b) => <BrowShape {...b} h={who === "alina" ? 6 : 10} w={(b.w ?? 30) * (who === "alina" ? 1.1 : 1)} />;
  const ex = 36;
  const ey = 4;
  const eyeColor = redEyes ? C.red : C.ink;
  const glow = redEyes ? <circle r={20} fill={C.red} opacity={0.35} filter="url(#glowRed)" /> : null;
  const dot = (x: number, r = 10) => (
    <g transform={`translate(${x + lx},${ey + ly})`}>
      {glow}
      <circle r={r} fill={eyeColor} />
      <circle cx={-3} cy={-3} r={3} fill="#fff" opacity={redEyes ? 0.9 : 0.8} />
    </g>
  );
  const big = (x: number, r: number, pr: number, px = 0, py = 0) => (
    <g transform={`translate(${x + lx * 0.6},${ey})`}>
      <circle r={r} fill="#fff" stroke={C.ink} strokeWidth={5} />
      <circle cx={px + lx * 0.5} cy={py + ly} r={pr} fill={eyeColor} />
      <circle cx={px + lx * 0.5 - pr * 0.35} cy={py + ly - pr * 0.35} r={pr * 0.3} fill="#fff" />
    </g>
  );
  const lid = (x: number, r: number, pr: number, close: number, py = 0) => (
    <g transform={`translate(${x + lx * 0.6},${ey})`}>
      <circle r={r} fill="#fff" stroke={C.ink} strokeWidth={5} />
      <circle cx={lx * 0.5} cy={py + ly} r={pr} fill={eyeColor} />
      <path d={`M ${-r - 3} ${-r * close + r * 0.15} L ${r + 3} ${-r * close + r * 0.15} L ${r + 3} ${-r - 6} L ${-r - 3} ${-r - 6} Z`} fill={C.skin} />
      <line x1={-r - 2} x2={r + 2} y1={-r * close + r * 0.15} y2={-r * close + r * 0.15} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
  const closed = (x: number) => <path d={`M ${x + lx - 13} ${ey + 2} Q ${x + lx} ${ey + 10} ${x + lx + 13} ${ey + 2}`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
  const mx = lx * 0.9;
  const nose = <path d={`M ${mx - 6} 30 Q ${mx} 38 ${mx + 6} 30`} stroke={C.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />;
  const blush =
    who === "alina" ? (
      <g opacity={0.3}>
        <ellipse cx={-60 + lx} cy={34} rx={16} ry={9} fill="#ff7b7b" />
        <ellipse cx={60 + lx} cy={34} rx={16} ry={9} fill="#ff7b7b" />
      </g>
    ) : null;
  const shake = e === "panic" ? jitter(frame, 3, 3) : 0;
  const sweat = (
    <path d="M 92 -40 Q 104 -18 98 -6 Q 88 2 82 -10 Q 80 -22 92 -40 Z" fill="#9fd4ff" stroke={C.ink} strokeWidth={4} />
  );
  const tears = (
    <g>
      <path d={`M ${-ex + lx} 22 C ${-ex + lx - 8} 50 ${-ex + lx + 8} 70 ${-ex + lx - 4} ${92 + (frame % 20)}`} stroke="#7cc4ff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.9} />
      <path d={`M ${ex + lx} 22 C ${ex + lx + 8} 50 ${ex + lx - 8} 70 ${ex + lx + 4} ${92 + ((frame + 10) % 20)}`} stroke="#7cc4ff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.9} />
    </g>
  );
  switch (e) {
    case "blink":
      return (
        <g>
          {blush}
          {closed(-ex)}
          {closed(ex)}
          <Brow x={-ex + lx} y={-26} rot={0} />
          <Brow x={ex + lx} y={-26} rot={0} />
          {nose}
          <path d={`M ${mx - 14} 54 L ${mx + 14} 54`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    case "scared":
      return (
        <g>
          {blush}
          {big(-ex, 21, 8)}
          {big(ex, 21, 8)}
          <Brow x={-ex + lx} y={-34} rot={14} />
          <Brow x={ex + lx} y={-34} rot={-14} />
          {nose}
          <ellipse cx={mx} cy={60} rx={12} ry={15} fill={C.ink} />
          {sweat}
        </g>
      );
    case "panic":
      return (
        <g transform={`translate(${shake},0)`}>
          {blush}
          {big(-ex - 4, 28, 5, jitter(frame, 1, 2), jitter(frame, 2, 2))}
          {big(ex + 4, 28, 5, jitter(frame, 4, 2), jitter(frame, 5, 2))}
          <Brow x={-ex + lx - 4} y={-42} rot={22} />
          <Brow x={ex + lx + 4} y={-42} rot={-22} />
          <path d={`M ${mx - 30} 48 Q ${mx} 40 ${mx + 30} 48 Q ${mx + 26} 92 ${mx} 92 Q ${mx - 26} 92 ${mx - 30} 48 Z`} fill="#5a1418" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
          <path d={`M ${mx - 24} 50 L ${mx + 24} 50 L ${mx + 20} 60 L ${mx - 20} 60 Z`} fill="#fff" />
          <ellipse cx={mx} cy={82} rx={14} ry={7} fill="#e56b6b" />
          {sweat}
          <g transform="translate(-26,0)">{sweat}</g>
        </g>
      );
    case "shocked":
      return (
        <g>
          {blush}
          {big(-ex, 24, 9)}
          {big(ex, 24, 9)}
          <Brow x={-ex + lx} y={-40} rot={6} />
          <Brow x={ex + lx} y={-40} rot={-6} />
          {nose}
          <ellipse cx={mx} cy={64} rx={18} ry={22} fill="#5a1418" stroke={C.ink} strokeWidth={6} />
        </g>
      );
    case "sarcastic":
      return (
        <g>
          {blush}
          {lid(-ex, 17, 8, 0.15)}
          {lid(ex, 17, 8, 0.15)}
          <Brow x={-ex + lx} y={-26} rot={-4} />
          <Brow x={ex + lx} y={-40} rot={-14} />
          {nose}
          <path d={`M ${mx - 20} 58 Q ${mx + 4} 62 ${mx + 22} 48`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    case "smug":
      return (
        <g>
          {blush}
          {closed(-ex)}
          {closed(ex)}
          <Brow x={-ex + lx} y={-30} rot={-8} />
          <Brow x={ex + lx} y={-30} rot={8} />
          {nose}
          <path d={`M ${mx - 24} 50 Q ${mx} 72 ${mx + 26} 46`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    case "eyeroll":
      return (
        <g>
          {blush}
          {lid(-ex, 18, 8, -0.1, -10)}
          {lid(ex, 18, 8, -0.1, -10)}
          <Brow x={-ex + lx} y={-36} rot={-6} />
          <Brow x={ex + lx} y={-36} rot={6} />
          {nose}
          <path d={`M ${mx - 18} 56 L ${mx + 18} 54`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    case "tired":
      return (
        <g>
          {lid(-ex, 17, 7, 0.0, 4)}
          {lid(ex, 17, 7, 0.0, 4)}
          <path d={`M ${-ex + lx - 14} 30 Q ${-ex + lx} 36 ${-ex + lx + 14} 30`} stroke={C.skinShade} strokeWidth={5} fill="none" />
          <path d={`M ${ex + lx - 14} 30 Q ${ex + lx} 36 ${ex + lx + 14} 30`} stroke={C.skinShade} strokeWidth={5} fill="none" />
          <Brow x={-ex + lx} y={-26} rot={10} />
          <Brow x={ex + lx} y={-26} rot={-10} />
          <path d={`M ${mx - 18} 62 Q ${mx} 54 ${mx + 18} 62`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
          {sweat}
        </g>
      );
    case "angry":
      return (
        <g>
          {dot(-ex, 11)}
          {dot(ex, 11)}
          <Brow x={-ex + lx + 2} y={-22} rot={24} w={36} />
          <Brow x={ex + lx - 2} y={-22} rot={-24} w={36} />
          {nose}
          <rect x={mx - 30} y={46} width={60} height={26} rx={8} fill="#fff" stroke={C.ink} strokeWidth={6} />
          <line x1={mx - 30} x2={mx + 30} y1={59} y2={59} stroke={C.ink} strokeWidth={4} />
          {[-15, 0, 15].map((d) => (
            <line key={d} x1={mx + d} x2={mx + d} y1={46} y2={72} stroke={C.ink} strokeWidth={4} />
          ))}
        </g>
      );
    case "serious":
      return (
        <g>
          {dot(-ex, 10)}
          {dot(ex, 10)}
          <Brow x={-ex + lx} y={-20} rot={10} w={34} />
          <Brow x={ex + lx} y={-20} rot={-10} w={34} />
          {nose}
          <path d={`M ${mx - 16} 58 L ${mx + 16} 58`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
        </g>
      );
    case "determined":
      return (
        <g>
          {dot(-ex, 11)}
          {dot(ex, 11)}
          <Brow x={-ex + lx} y={-22} rot={18} w={36} />
          <Brow x={ex + lx} y={-22} rot={-18} w={36} />
          {nose}
          <path d={`M ${mx - 24} 50 L ${mx + 24} 50 Q ${mx + 20} 70 ${mx} 70 Q ${mx - 20} 70 ${mx - 24} 50 Z`} fill="#fff" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
          {sweat}
        </g>
      );
    case "happy":
      return (
        <g>
          {blush}
          <path d={`M ${-ex + lx - 14} 8 Q ${-ex + lx} -10 ${-ex + lx + 14} 8`} stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d={`M ${ex + lx - 14} 8 Q ${ex + lx} -10 ${ex + lx + 14} 8`} stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
          <Brow x={-ex + lx} y={-32} rot={-6} />
          <Brow x={ex + lx} y={-32} rot={6} />
          {nose}
          <path d={`M ${mx - 30} 46 Q ${mx} 50 ${mx + 30} 46 Q ${mx + 24} 84 ${mx} 84 Q ${mx - 24} 84 ${mx - 30} 46 Z`} fill="#5a1418" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
          <path d={`M ${mx - 26} 48 L ${mx + 26} 48 L ${mx + 22} 58 L ${mx - 22} 58 Z`} fill="#fff" />
        </g>
      );
    case "cry":
      return (
        <g>
          {lid(-ex, 18, 8, 0.05, 2)}
          {lid(ex, 18, 8, 0.05, 2)}
          <Brow x={-ex + lx} y={-32} rot={20} />
          <Brow x={ex + lx} y={-32} rot={-20} />
          <path d={`M ${mx - 28} 78 Q ${mx} 40 ${mx + 28} 78 Q ${mx} 64 ${mx - 28} 78 Z`} fill="#5a1418" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
          {tears}
        </g>
      );
    default:
      return (
        <g>
          {blush}
          {dot(-ex)}
          {dot(ex)}
          <Brow x={-ex + lx} y={-28} rot={0} />
          <Brow x={ex + lx} y={-28} rot={0} />
          {nose}
          <path d={`M ${mx - 14} 56 Q ${mx} 62 ${mx + 14} 56`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
  }
};

const Torso: React.FC<{ who: Who; l: Look; dirty?: boolean }> = ({ who, l, dirty }) => (
  <g>
    {who === "alina" ? (
      <path d="M -66 -318 Q -46 -250 -54 -196 Q -66 -170 -64 -150 L 64 -150 Q 66 -170 54 -196 Q 46 -250 66 -318 Q 0 -336 -66 -318 Z" fill={l.top} stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" />
    ) : (
      <path d="M -78 -318 Q -84 -230 -76 -150 L 76 -150 Q 84 -230 78 -318 Q 0 -340 -78 -318 Z" fill={l.top} stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" />
    )}
    <path d="M 30 -326 Q 74 -322 78 -318 Q 84 -230 76 -150 L 40 -150 Q 52 -240 30 -326 Z" fill={l.topShade} opacity={0.6} />
    {who === "artem" ? (
      <g>
        <path d="M -52 -330 Q 0 -300 52 -330 Q 0 -350 -52 -330 Z" fill={l.topShade} stroke={C.ink} strokeWidth={6} />
        <line x1={-14} y1={-312} x2={-18} y2={-262} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
        <line x1={14} y1={-312} x2={18} y2={-262} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={-318} x2={0} y2={-152} stroke="#8a90a0" strokeWidth={5} />
        <circle cx={0} cy={-240} r={9} fill="none" stroke="#8a90a0" strokeWidth={4} />
        <path d="M -56 -206 L -36 -176 M 56 -206 L 36 -176" stroke={l.topShade} strokeWidth={6} strokeLinecap="round" />
        <path d="M -78 -318 Q -84 -230 -76 -150" stroke="#3c404d" strokeWidth={4} fill="none" transform="translate(6,0)" />
      </g>
    ) : null}
    {who === "alina" ? (
      <g>
        <line x1={0} y1={-310} x2={0} y2={-152} stroke={C.ink} strokeWidth={5} />
        <path d="M -60 -330 Q 0 -296 60 -330 L 52 -300 Q 0 -276 -52 -300 Z" fill={C.red} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
        <path d="M 22 -296 L 40 -220 L 14 -226 Z" fill={C.red} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      </g>
    ) : null}
    {who === "valera" ? (
      <g>
        <path d="M -70 -330 L -30 -330 L 0 -286 L 30 -330 L 70 -330 L 62 -300 L 0 -262 L -62 -300 Z" fill="#5b4a3a" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
        <rect x={-78} y={-186} width={156} height={20} fill="#3a2a1c" stroke={C.ink} strokeWidth={5} />
        <rect x={-14} y={-190} width={28} height={28} rx={4} fill="#c9a24a" stroke={C.ink} strokeWidth={5} />
        <path d="M -18 -258 L -8 -232 L 2 -258" fill="#f0f0f0" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 30 -248 L 58 -248 L 58 -220 L 30 -220 Z" fill={l.topShade} stroke={C.ink} strokeWidth={5} />
      </g>
    ) : null}
    {dirty ? (
      <g opacity={0.75}>
        <circle cx={-34} cy={-250} r={14} fill="#3b2d22" />
        <circle cx={22} cy={-196} r={10} fill="#3b2d22" />
        <path d="M 50 -290 L 30 -260 L 44 -262 L 26 -232" stroke={C.ink} strokeWidth={5} fill="none" />
      </g>
    ) : null}
  </g>
);

export const Character: React.FC<Props> = ({
  who,
  emotion = "neutral",
  pose = "stand",
  frame = 0,
  look = 0,
  lookY = 0,
  flip,
  tremble = 0,
  redEyes,
  swing = 0,
  dirty,
  size = 1,
  style,
}) => {
  const uid = useId().replace(/:/g, "");
  const l = LOOKS[who];
  const p = POSES[pose];
  const blinkCycle = (frame + Math.floor(hash(who.length * 7) * 60)) % 100;
  const autoBlink = blinkCycle < 4 && emotion !== "panic" && emotion !== "shocked" && emotion !== "scared";
  const e: Emotion = autoBlink && (emotion === "neutral" || emotion === "serious" || emotion === "sarcastic" || emotion === "determined" || emotion === "angry") ? "blink" : emotion;
  const walking = pose === "walk" || pose === "run";
  const speed = pose === "run" ? 0.55 : 0.28;
  const ph = Math.sin(frame * speed);
  const legA: [number, number] = walking ? [ph * (pose === "run" ? 34 : 18), -ph * (pose === "run" ? 34 : 18)] : p.legs;
  const armL: ArmDef = walking ? [p.l[0] - ph * 26, p.l[1] - ph * 30] : [p.l[0] + swing * 0.2, p.l[1]];
  const armR: ArmDef = walking ? [p.r[0] + ph * 26, p.r[1] + ph * 30] : [p.r[0] + swing, p.r[1] + swing];
  const bob = walking ? -Math.abs(Math.cos(frame * speed)) * (pose === "run" ? 18 : 8) : Math.sin(frame * 0.08) * 2;
  const crouch = p.crouch ?? 0;
  const tx = tremble ? jitter(frame, 11, tremble) : 0;
  const ty = tremble ? jitter(frame, 17, tremble * 0.5) : 0;
  const lean = pose === "run" ? 8 : 0;
  const legLen = 140 - (pose === "sit" ? 40 : 0);
  const phoneItem = (
    <g transform="rotate(75)">
      <rect x={-26} y={-48} width={52} height={92} rx={10} fill="#1b1e27" stroke={C.ink} strokeWidth={6} />
      <rect x={-19} y={-38} width={38} height={70} rx={5} fill="#7fb8ff" opacity={0.85} />
    </g>
  );
  const rockItem = (
    <g transform="rotate(-15)">
      <path d="M -26 -4 L -14 -36 L 18 -40 L 32 -8 L 12 16 L -18 14 Z" fill="#7d8594" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -10 -26 L 10 -28" stroke="#a4abb8" strokeWidth={5} strokeLinecap="round" />
    </g>
  );
  const rItem = pose === "phone" ? phoneItem : pose === "smash" ? rockItem : undefined;
  const armsOver = armR[0] > 110 || armL[0] > 110;
  const shoulder = who === "alina" ? 60 : 70;
  const neckLen = who === "alina" ? 18 : 0;
  const arms = (
    <>
      <Arm x={-shoulder} side={-1} a={armL} color={l.top} shade={l.topShade} />
      <Arm x={shoulder} side={1} a={armR} color={l.top} shade={l.topShade} item={rItem} />
    </>
  );
  return (
    <svg viewBox="-200 -600 400 640" width={400 * size} height={640 * size} style={{ overflow: "visible", ...style }}>
      <defs>
        <filter id="glowRed" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <radialGradient id={`sh${uid}`}>
          <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`hc${uid}`}>
          <circle cx={0} cy={0} r={100} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={6} rx={140} ry={26} fill={`url(#sh${uid})`} />
      <g transform={`translate(${tx},${ty + bob}) ${flip ? "scale(-1,1)" : ""} rotate(${lean},0,-150)`}>
        <g transform={`translate(0,${crouch})`}>
          {pose !== "sit" ? (
            <>
              <Leg x={-34} a={legA[0]} color={l.pants} shoe={l.shoe} len={legLen - crouch * 0.6} />
              <Leg x={34} a={-legA[1]} color={l.pants} shoe={l.shoe} len={legLen - crouch * 0.6} />
            </>
          ) : (
            <>
              <rect x={-60} y={-160} width={50} height={110} rx={22} fill={l.pants} stroke={C.ink} strokeWidth={SW} />
              <rect x={10} y={-160} width={50} height={110} rx={22} fill={l.pants} stroke={C.ink} strokeWidth={SW} />
              <ellipse cx={-36} cy={-48} rx={34} ry={18} fill={l.shoe} stroke={C.ink} strokeWidth={SW} />
              <ellipse cx={36} cy={-48} rx={34} ry={18} fill={l.shoe} stroke={C.ink} strokeWidth={SW} />
            </>
          )}
          <Torso who={who} l={l} dirty={dirty} />
          {!armsOver ? arms : null}
          <g transform={`translate(${look * 6},${-436 - neckLen + lookY * 4})`}>
            <HairBack who={who} l={l} />
            {who === "alina" ? (
              <g>
                <rect x={-20} y={70} width={40} height={70} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
                <rect x={-17} y={96} width={34} height={14} fill={C.skinShade} opacity={0.45} />
              </g>
            ) : (
              <rect x={-26} y={70} width={52} height={40} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
            )}
            <circle cx={-98 + look * 4} cy={10} r={20} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
            <circle cx={98 + look * 4} cy={10} r={20} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
            <circle cx={0} cy={0} r={100} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
            {who === "alina" ? (
              <g fill={C.red} stroke={C.ink} strokeWidth={4}>
                <circle cx={-101 + look * 4} cy={40} r={8} />
                <circle cx={101 + look * 4} cy={40} r={8} />
              </g>
            ) : null}
            <g clipPath={`url(#hc${uid})`}>
              <circle cx={-38} cy={-38} r={112} fill="none" stroke={C.skinShade} strokeWidth={30} opacity={0.35} />
            </g>
            <Face e={e} lx={look * 18} ly={lookY * 10} frame={frame} redEyes={redEyes} who={who} />
            <HairFront who={who} l={l} />
          </g>
          {armsOver ? arms : null}
        </g>
      </g>
    </svg>
  );
};
