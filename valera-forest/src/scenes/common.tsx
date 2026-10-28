import React from "react";
import { AbsoluteFill } from "remotion";
import { Character, Emotion, Pose, Who } from "../characters/Character";
import { Wolf, WolfPose } from "../characters/Creatures";
import { Forest, Mood } from "../env/Forest";
import { Pos } from "../ui/Kit";
import { FPS, TimedBeat } from "../scenes";
import { C, FONT } from "../theme";
import { hash } from "../anim";

export type ShotProps = { shot: string; f: number; dur: number; beat: TimedBeat };

export const hitF = (b: TimedBeat) => Math.round((b.hit ?? 0) * FPS);

export const cueF = (b: TimedBeat, name: string, fallback = 0) => {
  const c = (b.sfx ?? []).find((x) => x.s === name);
  return Math.round((c?.at ?? fallback) * FPS);
};

export const Hero: React.FC<{
  who: Who;
  x: number;
  y: number;
  s?: number;
  f: number;
  emotion?: Emotion;
  pose?: Pose;
  look?: number;
  lookY?: number;
  flip?: boolean;
  tremble?: number;
  redEyes?: boolean;
  swing?: number;
  dirty?: boolean;
  z?: number;
  style?: React.CSSProperties;
}> = ({ x, y, s = 1, z, style, ...rest }) => (
  <Pos x={x} y={y} ox={200} oy={600} s={s} z={z} style={style}>
    <Character size={s} frame={rest.f} {...rest} />
  </Pos>
);

export const FaceCam: React.FC<{
  who: Who;
  f: number;
  hx?: number;
  hy?: number;
  s?: number;
  emotion?: Emotion;
  pose?: Pose;
  look?: number;
  lookY?: number;
  tremble?: number;
  redEyes?: boolean;
  dirty?: boolean;
}> = ({ hx = 540, hy = 640, s = 2.8, ...rest }) => <Hero x={hx} y={hy + 436 * s} s={s} {...rest} />;

export const WolfAt: React.FC<{ x: number; y: number; s?: number; f: number; pose?: WolfPose; flip?: boolean; glow?: number; z?: number }> = ({ x, y, s = 1, f, pose, flip, glow, z }) => (
  <Pos x={x} y={y} ox={460} oy={560} s={s} z={z}>
    <Wolf size={s} frame={f} pose={pose} flip={flip} glow={glow} />
  </Pos>
);

export const BlurForest: React.FC<{ f: number; mood?: Mood; blur?: number; pan?: number; tint?: string }> = ({ f, mood = "night", blur = 10, pan = 0, tint }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ filter: `blur(${blur}px)`, transform: "scale(1.35) translateY(-120px)" }}>
      <Forest frame={f} mood={mood} pan={pan} />
    </AbsoluteFill>
    {tint ? <AbsoluteFill style={{ background: tint }} /> : null}
  </AbsoluteFill>
);

export const Burst: React.FC<{ f: number; color?: string; color2?: string; rays?: number; cx?: number; cy?: number }> = ({ f, color = "#2a0d10", color2 = "#140608", rays = 18, cx = 540, cy = 700 }) => (
  <AbsoluteFill style={{ background: color2 }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <g transform={`translate(${cx},${cy}) rotate(${f * 0.6})`}>
        {Array.from({ length: rays }).map((_, i) => {
          const a = (i / rays) * Math.PI * 2;
          const a2 = a + Math.PI / rays;
          return <path key={i} d={`M 0 0 L ${Math.cos(a) * 2400} ${Math.sin(a) * 2400} L ${Math.cos(a2) * 2400} ${Math.sin(a2) * 2400} Z`} fill={color} />;
        })}
      </g>
    </svg>
  </AbsoluteFill>
);

export const SpeedLines: React.FC<{ f: number; color?: string; cx?: number; cy?: number; opacity?: number }> = ({ f, color = "#fff", cx = 540, cy = 700, opacity = 0.25 }) => (
  <AbsoluteFill style={{ opacity }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      {Array.from({ length: 40 }).map((_, i) => {
        const a = hash(i + Math.floor(f / 2) * 0.13) * Math.PI * 2;
        const r1 = 420 + hash(i + 7) * 200;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r1}
            y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a) * 2000}
            y2={cy + Math.sin(a) * 2000}
            stroke={color}
            strokeWidth={4 + hash(i) * 10}
          />
        );
      })}
    </svg>
  </AbsoluteFill>
);

export const Onoma: React.FC<{ text: string; x: number; y: number; f: number; delay?: number; size?: number; color?: string; rot?: number }> = ({ text, x, y, f, delay = 0, size = 90, color = "#cfd8ea", rot = -6 }) => {
  if (f < delay) return null;
  const l = f - delay;
  const s = Math.min(1, l / 5) * (1 + 0.05 * Math.sin(l * 0.6));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot + Math.sin(l * 0.3) * 2}deg) scale(${s})`,
        fontFamily: FONT.russo,
        fontSize: size,
        color,
        letterSpacing: 4,
        textShadow: `0 6px 0 ${C.ink}, 0 0 20px rgba(0,0,0,0.8)`,
        whiteSpace: "nowrap",
        zIndex: 35,
      }}
    >
      {text}
    </div>
  );
};

export const Leaves: React.FC<{ f: number; start?: number; n?: number; cx?: number; cy?: number; color?: string; spread?: number }> = ({ f, start = 0, n = 16, cx = 540, cy = 900, color = "#2c4436", spread = 700 }) => {
  if (f < start) return null;
  const l = f - start;
  return (
    <AbsoluteFill style={{ zIndex: 36 }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {Array.from({ length: n }).map((_, i) => {
          const a = hash(i + 3) * Math.PI * 2;
          const v = 8 + hash(i + 5) * 16;
          const x = cx + Math.cos(a) * v * l * (spread / 700);
          const y = cy + Math.sin(a) * v * l * 0.7 + 0.6 * l * l;
          return <ellipse key={i} cx={x} cy={y} rx={16} ry={8} fill={i % 3 ? color : "#3c5a46"} stroke={C.ink} strokeWidth={3} transform={`rotate(${l * 20 + i * 40},${x},${y})`} opacity={Math.max(0, 1 - l / 40)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
