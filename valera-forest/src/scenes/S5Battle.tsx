import React from "react";
import { AbsoluteFill } from "remotion";
import { Monster, WolfFace } from "../characters/Creatures";
import { Forest, Smoke } from "../env/Forest";
import { Crystal, Seal, Vortex } from "../env/Places";
import { Check, FactPlate, Pos, SoundWaves, Stamp, Thought } from "../ui/Kit";
import { C } from "../theme";
import { ease, hash } from "../anim";
import { BlurForest, Burst, FaceCam, Hero, Onoma, ShotProps, SpeedLines, WolfAt, cueF, hitF } from "./common";

const Arena: React.FC<{ f: number; pan?: number; vortex?: number; seal?: number; crack?: number; children?: React.ReactNode }> = ({ f, pan = 0, vortex = 1, seal = 0.4, crack = 1, children }) => (
  <AbsoluteFill>
    <Forest frame={f} mood="deep" pan={pan} horizon={860} tint={vortex} />
    <Pos x={540} y={1040} ox={500} oy={200} s={1}>
      <Seal frame={f} size={1} power={seal} crack={crack} />
    </Pos>
    {vortex > 0 ? (
      <Pos x={540} y={1030} ox={500} oy={300} s={0.85}>
        <Vortex frame={f} size={0.85} open={vortex} />
      </Pos>
    ) : null}
    {children}
  </AbsoluteFill>
);

const Claws: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  if (f < at) return null;
  const l = Math.min(1, (f - at) / 5);
  const o = f - at > 20 ? Math.max(0, 1 - (f - at - 20) / 10) : 1;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: o, zIndex: 40 }}>
      {[0, 1, 2].map((i) => (
        <line key={i} x1={260 + i * 130} y1={300} x2={260 + i * 130 + 420 * l} y2={300 + 600 * l} stroke="#fff" strokeWidth={26 - i * 4} strokeLinecap="round" />
      ))}
      {[0, 1, 2].map((i) => (
        <line key={"r" + i} x1={260 + i * 130} y1={300} x2={260 + i * 130 + 420 * l} y2={300 + 600 * l} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
      ))}
    </svg>
  );
};

export const S5Battle: React.FC<ShotProps> = ({ shot, f, dur, beat }) => {
  const p = f / dur;
  const h = hitF(beat);
  switch (shot) {
    case "vortex":
      return (
        <Arena f={f} vortex={ease(f, 0.1, 1, 0, dur)} pan={0}>
          {Array.from({ length: 14 }).map((_, i) => {
            const a = hash(i) * Math.PI * 2 + f * 0.05;
            const r = 500 - ((f * 6 + hash(i + 3) * 500) % 500);
            return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * r, top: 1000 + Math.sin(a) * r * 0.4, width: 26, height: 18, background: "#2c3a33", border: `3px solid ${C.ink}`, borderRadius: 6, transform: `rotate(${f * 10 + i * 30}deg)` }} />;
          })}
          <Hero who="alina" x={180} y={1350} s={0.8} f={f} emotion="shocked" tremble={2} />
          <Hero who="valera" x={540} y={1380} s={0.85} f={f} emotion="serious" />
          <Hero who="artem" x={900} y={1360} s={0.8} f={f} emotion="panic" pose="cower" tremble={5} />
        </Arena>
      );
    case "monsterReveal": {
      const rise = ease(f, 0, 1, 0, 20);
      const z = ease(f, 0.5, 1, 0, 8);
      return (
        <Arena f={f} vortex={1}>
          <SpeedLines f={f} color={C.red} opacity={0.25} cy={700} />
          <Pos x={540} y={1100 - rise * 380} ox={520} oy={520} s={1.05}>
            <div style={{ transform: `scale(${z})` }}>
              <Monster frame={f} size={1.05} rage={1.4} />
            </div>
          </Pos>
        </Arena>
      );
    }
    case "monsterTalk":
      return (
        <AbsoluteFill>
          <Burst f={f} color="#22060a" color2="#0a0305" />
          <Pos x={540} y={720} ox={520} oy={520} s={1.15}>
            <Monster frame={f} size={1.15} rage={1 + Math.abs(Math.sin(f * 0.4))} />
          </Pos>
          <SoundWaves f={f} x={-20} y={520} scale={1.1} />
          <SoundWaves f={f} x={800} y={520} scale={1.1} flip />
        </AbsoluteFill>
      );
    case "valeraTransform": {
      const sm = ease(f, 0, 1, 12, h + 26);
      return (
        <Arena f={f} vortex={1}>
          {f < h ? <Hero who="valera" x={540} y={1300} s={1.3} f={f} emotion="angry" redEyes pose="fist" /> : <WolfAt x={540} y={1260} s={1.05} f={f} pose="growl" />}
          {f >= 12 ? (
            <Pos x={540} y={1000} ox={500} oy={500} s={1.5}>
              <Smoke progress={sm} size={1.5} />
            </Pos>
          ) : null}
          <Onoma text="РРРР!" x={760} y={560} f={f} delay={h} size={120} color={C.red} rot={8} />
        </Arena>
      );
    }
    case "wolfCommand":
      return (
        <Arena f={f} vortex={1}>
          <Pos x={820} y={620} ox={520} oy={520} s={0.6}>
            <Monster frame={f} size={0.6} rage={1.2} />
          </Pos>
          <WolfAt x={430} y={1260} s={1.0} f={f} pose="growl" flip />
          <Hero who="alina" x={130} y={1420} s={0.7} f={f} emotion="determined" />
          <Hero who="artem" x={960} y={1430} s={0.7} f={f} emotion="panic" tremble={4} />
        </Arena>
      );
    case "alinaSmash": {
      const sw = ease(f, 0, 1, h - 8, h);
      const br = ease(f, 0, 1, h, h + 20);
      return (
        <Arena f={f} vortex={1} pan={0.3}>
          <FactPlate f={f} n={1} text="КРИСТАЛЛ" y={390} />
          <Pos x={640} y={1180} ox={200} oy={380} s={1.2}>
            <Crystal size={1.2} broken={f >= h ? Math.max(0.06, br) : 0} />
          </Pos>
          <Hero who="alina" x={340} y={1300} s={1.25} f={f} pose="smash" swing={-sw * 120} emotion="determined" />
          <Check f={f} delay={cueF(beat, "check")} x={760} y={390} size={84} />
          <Onoma text="ДЗЫНЬ!" x={760} y={700} f={f} delay={h} size={110} color="#9fd8ff" rot={-8} />
        </Arena>
      );
    }
    case "artemFear":
      return (
        <Arena f={f} vortex={0.9} pan={-0.3}>
          <Pos x={720} y={1180} ox={200} oy={380} s={1.1}>
            <Crystal size={1.1} />
          </Pos>
          <Hero who="artem" x={340} y={1330} s={1.3} f={f} pose="cower" emotion="panic" tremble={6} />
          <Thought f={f} delay={6} text="МАМОЧКИ…" x={360} y={500} w={440} tail="left" />
        </Arena>
      );
    case "artemBrave":
      return (
        <AbsoluteFill>
          <Burst f={f} color="#3b2a08" color2="#120d04" />
          <SpeedLines f={f} color={C.yellow} opacity={0.3} />
          <FaceCam who="artem" f={f} s={2.52} hy={640 + 60} emotion="determined" />
        </AbsoluteFill>
      );
    case "artemSmash": {
      const sw = ease(f, 0, 1, h - 8, h);
      const br = ease(f, 0, 1, h, h + 20);
      return (
        <Arena f={f} vortex={1} seal={f >= h ? 1 : 0.4}>
          <FactPlate f={f} n={2} text="КРИСТАЛЛ" y={390} />
          <Pos x={440} y={1180} ox={200} oy={380} s={1.2}>
            <Crystal size={1.2} broken={f >= h ? Math.max(0.06, br) : 0} />
          </Pos>
          <Hero who="artem" x={740} y={1300} s={1.25} f={f} pose="smash" swing={-sw * 120} emotion="determined" flip />
          {f >= h + 6 ? <Check f={f} delay={h + 6} x={760} y={390} size={84} /> : null}
          <Onoma text="ДЗЫНЬ!" x={320} y={700} f={f} delay={h} size={110} color="#9fd8ff" rot={8} />
        </Arena>
      );
    }
    case "sealFlash": {
      const fade = ease(f, 0, 1, 6, dur);
      return (
        <Arena f={f} vortex={1 - fade} seal={1} crack={1 - fade}>
          <Pos x={540} y={700} ox={520} oy={520} s={0.9}>
            <Monster frame={f} size={0.9} fade={fade * 0.8} rage={2} />
          </Pos>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <polygon key={i} points={`${540 + (i - 5) * 30},1040 ${540 + (i - 5) * 200 - 40},0 ${540 + (i - 5) * 200 + 40},0`} fill="#9fd8ff" opacity={0.12 + 0.1 * Math.sin(f * 0.5 + i)} />
            ))}
          </svg>
        </Arena>
      );
    }
    case "finalStrike": {
      const lunge = ease(f, 0, 1, h - 12, h);
      return (
        <AbsoluteFill>
          <Burst f={f} color="#2a0608" color2="#0b0304" />
          <Pos x={540} y={640} ox={520} oy={520} s={0.95}>
            <Monster frame={f} size={0.95} fade={ease(f, 0, 0.9, h, dur)} rage={2} />
          </Pos>
          <Pos x={540} y={1300 - lunge * 400} ox={400} oy={420} s={0.8 + lunge * 0.5}>
            <WolfFace frame={f} size={0.8 + lunge * 0.5} />
          </Pos>
          <Claws f={f} at={h} />
        </AbsoluteFill>
      );
    }
    case "victory":
      return (
        <AbsoluteFill>
          <Forest frame={f} mood="night" pan={0} horizon={860} />
          <Pos x={540} y={1040} ox={500} oy={200} s={1}>
            <Seal frame={f} size={1} power={1} />
          </Pos>
          {Array.from({ length: 30 }).map((_, i) => {
            const y = 1100 - ((f * (3 + hash(i) * 4) + hash(i + 1) * 900) % 900);
            return <div key={i} style={{ position: "absolute", left: hash(i + 7) * 1080, top: y, width: 10, height: 10, borderRadius: 5, background: "#9fd8ff", boxShadow: "0 0 16px #9fd8ff", opacity: 0.8 }} />;
          })}
          <Hero who="alina" x={280} y={1320} s={0.9} f={f} emotion="happy" pose="armsUp" />
          <Hero who="valera" x={560} y={1330} s={0.95} f={f} emotion="tired" dirty />
          <Hero who="artem" x={820} y={1320} s={0.9} f={f} emotion="happy" />
          <Stamp f={f} delay={h} text="ПОБЕДА" x={540} y={520} rot={-8} size={140} color="#2ecc5a" />
        </AbsoluteFill>
      );
    case "alinaWin":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={6} />
          <Hero who="alina" x={540} y={1450} s={1.55} f={f} pose="armsUp" emotion="happy" />
        </AbsoluteFill>
      );
    case "valeraTired":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={6} />
          <Hero who="valera" x={540} y={1450} s={1.55} f={f} pose={p < 0.5 ? "point" : "shrug"} emotion={p < 0.5 ? "angry" : "tired"} dirty />
          <div style={{ position: "absolute", left: 640, top: 560, width: 40, height: 60, opacity: 0.6, background: "#555", borderRadius: "50%", filter: "blur(6px)", transform: `translateY(${-(f % 30) * 3}px)` }} />
        </AbsoluteFill>
      );
    default:
      return null;
  }
};
