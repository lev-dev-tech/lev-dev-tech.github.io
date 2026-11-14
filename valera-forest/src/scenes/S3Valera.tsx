import React from "react";
import { AbsoluteFill } from "remotion";
import { RedEyes, WolfFace } from "../characters/Creatures";
import { Bush, Forest, Smoke } from "../env/Forest";
import { Badge, Icon, Pos, SoundWaves, Stamp } from "../ui/Kit";
import { C } from "../theme";
import { ease, jitter } from "../anim";
import { BlurForest, Burst, FaceCam, Hero, Leaves, ShotProps, SpeedLines, WolfAt, hitF } from "./common";

const Cracks: React.FC<{ f: number; amount: number }> = ({ f, amount }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="crackGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
    </defs>
    {[
      "M 540 1000 L 470 1060 L 500 1120 L 380 1200 L 330 1320",
      "M 540 1000 L 620 1050 L 600 1110 L 720 1180 L 820 1240",
      "M 540 1000 L 560 1100 L 520 1200 L 560 1330",
      "M 470 1060 L 300 1080 L 200 1140",
    ].map((d, i) => (
      <g key={i} opacity={amount}>
        <path d={d} stroke={C.red} strokeWidth={30} fill="none" filter="url(#crackGlow)" opacity={0.6 + 0.4 * Math.sin(f * 0.4 + i)} />
        <path d={d} stroke="#ff8a6a" strokeWidth={9} fill="none" strokeLinejoin="round" />
      </g>
    ))}
  </svg>
);

export const S3Valera: React.FC<ShotProps> = ({ shot, f, dur, beat }) => {
  const p = f / dur;
  const h = hitF(beat);
  switch (shot) {
    case "wolfBurst": {
      const z = ease(f, 0.35, 1.25, 0, 7) + p * 0.1;
      return (
        <AbsoluteFill>
          <Burst f={f} color="#3a0a0e" color2="#120406" />
          <SpeedLines f={f} opacity={0.3} />
          <Pos x={540} y={720} ox={400} oy={420} s={1.2}>
            <div style={{ transform: `scale(${z})`, transformOrigin: "50% 50%" }}>
              <WolfFace frame={f} size={1.2} />
            </div>
          </Pos>
          <Leaves f={f} start={0} n={24} cx={540} cy={800} spread={1100} />
        </AbsoluteFill>
      );
    }
    case "wolfApproach":
      return (
        <AbsoluteFill>
          <Forest frame={f} mood="deep" pan={-0.2 + p * 0.2} />
          <WolfAt x={260 + p * 180} y={1130} s={0.85} f={f} pose="growl" flip />
          <Hero who="alina" x={760} y={1150} s={0.78} f={f} emotion="shocked" look={-0.8} />
          <Hero who="artem" x={930} y={1180} s={0.78} f={f} pose="cower" emotion="panic" tremble={4} />
          <Bush frame={f} w={600} color="#0f1512" style={{ position: "absolute", left: -200, top: 1080 }} />
        </AbsoluteFill>
      );
    case "artemCry":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="deep" blur={10} />
          <Pos x={280} y={420} ox={260} oy={100} s={0.5}>
            <RedEyes frame={f} size={0.5} />
          </Pos>
          <FaceCam who="artem" f={f} s={2.44} hy={660 + 60} emotion="cry" tremble={2.5} />
        </AbsoluteFill>
      );
    case "wolfPounce": {
      const leap = ease(f, 0, 1, h - 10, h + 4);
      return (
        <AbsoluteFill>
          <Forest frame={f} mood="deep" pan={0} />
          <WolfAt x={440 + leap * 120} y={1130 - leap * 260} s={0.95 + leap * 0.5} f={f} pose="pounce" />
          {f >= h - 3 ? (
            <Pos x={540} y={800} ox={500} oy={500} s={1.6}>
              <Smoke progress={ease(f, 0, 0.5, h - 3, dur)} size={1.6} />
            </Pos>
          ) : null}
        </AbsoluteFill>
      );
    }
    case "smoke": {
      const sp = ease(f, 0.5, 1, 0, dur - 6);
      return (
        <AbsoluteFill>
          <Forest frame={f} mood="night" pan={0} />
          <Hero who="valera" x={540} y={1180} s={1.1} f={f} emotion={p < 0.6 ? "angry" : "neutral"} redEyes={p < 0.6} />
          <Pos x={540} y={800} ox={500} oy={500} s={1.6}>
            <Smoke progress={sp} size={1.6} />
          </Pos>
        </AbsoluteFill>
      );
    }
    case "valeraIntro":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={5} pan={0.4 - p * 0.5} />
          <Hero who="valera" x={540} y={1450} s={1.55} f={f} emotion={p < 0.5 ? "neutral" : "smug"} pose={p < 0.5 ? "stand" : "fist"} />
          <Badge f={f} delay={8} title="ВАЛЕРА" sub="ХРАНИТЕЛЬ ЛЕСА" color={C.red} icon={Icon.tree} rot={-2} />
        </AbsoluteFill>
      );
    case "artemWhat":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={12} />
          <FaceCam who="artem" f={f} s={2.52} hy={640 + 60} emotion={f % 40 < 3 ? "blink" : "shocked"} />
        </AbsoluteFill>
      );
    case "valeraThreat":
      return (
        <AbsoluteFill>
          <Burst f={f} color="#3a0a0e" color2="#150507" />
          <FaceCam who="valera" f={f} s={2.9} hy={660} emotion="angry" redEyes tremble={f >= h ? 2 : 0} />
          <Stamp f={f} delay={h} text={"НЕХУЙ СЮДА\nХОДИТЬ"} x={510} y={520} rot={-9} size={74} />
        </AbsoluteFill>
      );
    case "alinaProtest":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={6} />
          <Hero who="alina" x={540} y={1450} s={1.55} f={f} pose="shrug" emotion={p < 0.5 ? "neutral" : "sarcastic"} />
        </AbsoluteFill>
      );
    case "valeraDontCare":
      return (
        <AbsoluteFill>
          <Burst f={f} color="#2a1012" color2="#100608" />
          <Hero who="valera" x={540} y={1460} s={1.6} f={f} pose="shrug" emotion="angry" redEyes />
        </AbsoluteFill>
      );
    case "quake": {
      const a = 8 + 6 * Math.sin(f * 0.3);
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${jitter(f, 3, a)}px,${jitter(f, 4, a)}px)` }}>
            <Forest frame={f} mood="deep" pan={0} tint={ease(f, 0, 1, 0, dur)} />
          </div>
          <Cracks f={f} amount={ease(f, 0, 1, 4, 30)} />
          <Hero who="alina" x={300} y={1150} s={0.85} f={f} emotion="scared" tremble={5} />
          <Hero who="valera" x={560} y={1160} s={0.9} f={f} emotion="serious" tremble={3} />
          <Hero who="artem" x={820} y={1170} s={0.85} f={f} pose="armsUp" emotion="panic" tremble={6} />
        </AbsoluteFill>
      );
    }
    case "voice":
      return (
        <AbsoluteFill style={{ background: "#07070a" }}>
          <Forest frame={f} mood="deep" pan={0} tint={1} />
          <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)" }} />
          <Cracks f={f} amount={1} />
          <Pos x={540} y={1050} ox={260} oy={100} s={1.2}>
            <RedEyes frame={f} size={1.2} open={0.3 + 0.2 * Math.sin(f * 0.1)} />
          </Pos>
          <SoundWaves f={f} x={40} y={500} scale={1.2} />
          <SoundWaves f={f} x={730} y={500} scale={1.2} flip />
        </AbsoluteFill>
      );
    case "valeraSerious":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="deep" blur={12} tint="rgba(120,0,10,0.18)" />
          <FaceCam who="valera" f={f} s={2.52} hy={640 + 60} emotion={p < 0.4 ? "tired" : "serious"} lookY={p < 0.4 ? 1 : 0} />
        </AbsoluteFill>
      );
    default:
      return null;
  }
};
