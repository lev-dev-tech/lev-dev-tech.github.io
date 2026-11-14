import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SCENE_RANGES, SFX_EVENTS, SHAKES, SceneId, TIMELINE, TRANSITION_FRAMES, TimedBeat } from "./scenes";
import { loadFonts } from "./fonts";
import { Hud, SeriesTag } from "./ui/Hud";
import { Subtitles } from "./ui/Subtitles";
import { ShotProps } from "./scenes/common";
import { S0Intro } from "./scenes/S0Intro";
import { S1Forest } from "./scenes/S1Forest";
import { S2Alina } from "./scenes/S2Alina";
import { S3Valera } from "./scenes/S3Valera";
import { S4Secret } from "./scenes/S4Secret";
import { S5Battle } from "./scenes/S5Battle";
import { S6Ending } from "./scenes/S6Ending";
import { S7After } from "./scenes/S7After";
import { S8Finale } from "./scenes/S8Finale";
import { hash, jitter } from "./anim";

loadFonts();

const SCENE_COMPONENTS: Record<SceneId, React.FC<ShotProps>> = {
  intro: S0Intro,
  forest: S1Forest,
  alina: S2Alina,
  valera: S3Valera,
  secret: S4Secret,
  battle: S5Battle,
  ending: S6Ending,
  after: S7After,
  finale: S8Finale,
};

const shakeAt = (frame: number) => {
  let x = 0;
  let y = 0;
  let r = 0;
  for (const s of SHAKES) {
    const d = frame - s.frame;
    if (d >= 0 && d < 16) {
      const k = s.amp * Math.pow(1 - d / 16, 2);
      x += jitter(frame, 1, k);
      y += jitter(frame, 2, k);
      r += jitter(frame, 3, k * 0.08);
    }
  }
  return { x, y, r };
};

const BeatView: React.FC<{ beat: TimedBeat }> = ({ beat }) => {
  const f = useCurrentFrame();
  const Comp = SCENE_COMPONENTS[beat.scene];
  const p = f / beat.frames;
  const dir = beat.index % 2 === 0 ? 1 : -1;
  const ken = 1.02 + 0.06 * p;
  const kx = dir * (p - 0.5) * 30;
  const ky = (p - 0.5) * -14;
  const t = Math.min(1, f / TRANSITION_FRAMES);
  const e = 1 - Math.pow(1 - t, 3);
  let tr = "";
  let blur = 0;
  if (f < TRANSITION_FRAMES) {
    if (beat.tr === "whip") {
      tr = `translateX(${(1 - e) * 1080 * dir}px)`;
      blur = (1 - e) * 26;
    } else if (beat.tr === "whipUp") {
      tr = `translateY(${(1 - e) * 1500}px)`;
      blur = (1 - e) * 22;
    } else if (beat.tr === "zoom") {
      tr = `scale(${1 + (1 - e) * 0.7})`;
      blur = (1 - e) * 16;
    }
  }
  return (
    <AbsoluteFill style={{ transform: tr, filter: blur > 0.5 ? `blur(${blur}px)` : undefined, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${ken}) translate(${kx}px,${ky}px)` }}>
        <Comp shot={beat.shot} f={f} dur={beat.frames} beat={beat} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TransitionFx: React.FC = () => {
  const frame = useCurrentFrame();
  const b = TIMELINE.find((x) => frame >= x.from && frame < x.from + x.frames);
  if (!b) return null;
  const l = frame - b.from;
  if (l >= TRANSITION_FRAMES + 2) return null;
  if (b.tr === "flash" || b.tr === "zoom") {
    const o = interpolate(l, [0, TRANSITION_FRAMES + 2], [b.tr === "flash" ? 1 : 0.6, 0], { extrapolateRight: "clamp" });
    return <AbsoluteFill style={{ background: "#fff", opacity: o }} />;
  }
  if (b.tr === "whip" || b.tr === "whipUp") {
    const o = interpolate(l, [0, TRANSITION_FRAMES], [0.45, 0], { extrapolateRight: "clamp" });
    const vertical = b.tr === "whipUp";
    return (
      <AbsoluteFill style={{ opacity: o }}>
        <svg width={1080} height={1920}>
          {Array.from({ length: 26 }).map((_, i) =>
            vertical ? (
              <rect key={i} x={hash(i + l) * 1080} y={0} width={4 + hash(i) * 14} height={1920} fill="#fff" opacity={0.5} />
            ) : (
              <rect key={i} x={0} y={hash(i + l) * 1920} width={1080} height={4 + hash(i) * 14} fill="#fff" opacity={0.5} />
            ),
          )}
        </svg>
      </AbsoluteFill>
    );
  }
  return null;
};

const Atmosphere: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = SCENE_RANGES.find((s) => frame >= s.from && frame < s.to);
  const flickerAllowed = scene && scene.ambient !== "morning";
  const n = hash(Math.floor(frame / 2) * 1.37);
  const flick = flickerAllowed ? (n > 0.965 ? 0.32 : n > 0.9 ? 0.1 : 0) : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,6,9,0) 0%, rgba(5,6,9,0) 54%, rgba(5,6,9,0.55) 64%, rgba(5,6,9,0.9) 78%, rgba(5,6,9,0.97) 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 38%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: flick }} />
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const gx = Math.floor(hash(frame * 3.1) * 512);
  const gy = Math.floor(hash(frame * 7.7) * 512);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: 0.06,
        backgroundImage: `url(${staticFile("grain.png")})`,
        backgroundRepeat: "repeat",
        backgroundPosition: `${gx}px ${gy}px`,
      }}
    />
  );
};

const AMBIENT_VOL: Record<string, number> = { night: 0.32, tension: 0.4, morning: 0.35, room: 0.3 };

const Sound: React.FC = () => (
  <>
    {SCENE_RANGES.filter((s) => s.ambient !== "none").map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} name={`amb-${s.id}`}>
        <Audio
          src={staticFile(`audio/sfx/ambient_${s.ambient}.wav`)}
          loop
          volume={(f) => interpolate(f, [0, 12, s.to - s.from - 12, s.to - s.from], [0, AMBIENT_VOL[s.ambient], AMBIENT_VOL[s.ambient], 0], { extrapolateRight: "clamp" })}
        />
      </Sequence>
    ))}
    {SFX_EVENTS.map((e, i) => (
      <Sequence key={i} from={e.frame} durationInFrames={150} name={`sfx-${e.name}`}>
        <Audio src={staticFile(`audio/sfx/${e.name}.wav`)} volume={0.85 * e.vol} />
      </Sequence>
    ))}
  </>
);

export const Episode: React.FC = () => {
  const frame = useCurrentFrame();
  const s = shakeAt(frame);
  const tagVis = interpolate(frame, [0, 10, 200, 220], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0d0f14" }}>
      <AbsoluteFill style={{ transform: `translate(${s.x}px,${s.y}px) rotate(${s.r}deg) scale(${1 + (Math.abs(s.x) > 0 ? 0.03 : 0)})` }}>
        {TIMELINE.map((b) => (
          <Sequence key={b.index} from={b.from} durationInFrames={b.frames} name={`${b.scene}:${b.shot}`}>
            <BeatView beat={b} />
          </Sequence>
        ))}
      </AbsoluteFill>
      <Atmosphere />
      <Grain />
      <Hud hideSticker={frame >= SCENE_RANGES[SCENE_RANGES.length - 1].from} />
      <SeriesTag visible={tagVis} />
      <AbsoluteFill style={{ transform: `translate(${s.x * 0.5}px,${s.y * 0.5}px)` }}>
        <Subtitles />
      </AbsoluteFill>
      <TransitionFx />
      <Sound />
    </AbsoluteFill>
  );
};
