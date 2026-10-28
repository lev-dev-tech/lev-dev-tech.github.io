import { interpolate, spring } from "remotion";
import { FPS } from "./scenes";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export const pop = (frame: number, delay = 0, damping = 9, stiffness = 180) =>
  spring({ frame: frame - delay, fps: FPS, config: { damping, stiffness, mass: 0.7 } });

export const ease = (frame: number, from: number, to: number, a: number, b: number) =>
  b <= a ? (frame >= a ? to : from) : interpolate(frame, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const wobble = (frame: number, seed: number, speed = 0.15) =>
  Math.sin(frame * speed + seed) * 0.6 + Math.sin(frame * speed * 2.3 + seed * 1.7) * 0.4;

export const jitter = (frame: number, seed: number, amp: number) => (hash(frame * 13.37 + seed) - 0.5) * 2 * amp;

export const sec = (s: number) => Math.round(s * FPS);
