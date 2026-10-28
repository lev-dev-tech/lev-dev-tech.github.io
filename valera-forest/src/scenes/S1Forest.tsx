import React from "react";
import { AbsoluteFill } from "remotion";
import { Squirrel } from "../characters/Creatures";
import { Bush, Forest, Fog } from "../env/Forest";
import { Badge, Hand, Icon, Phone, Polaroid, Pos, SoundWaves, Thought } from "../ui/Kit";
import { C, FONT } from "../theme";
import { ease } from "../anim";
import { T } from "../scenes";
import { BlurForest, Burst, FaceCam, Hero, Leaves, Onoma, ShotProps, SpeedLines, WolfAt, hitF } from "./common";

const Legs: React.FC<{ f: number }> = ({ f }) => (
  <svg width={300} height={300} viewBox="-150 -300 300 300" style={{ position: "absolute", left: 390, top: 700, zIndex: 2 }}>
    {[-1, 1].map((s) => (
      <g key={s} transform={`translate(${s * 40},0) rotate(${s * 14 + Math.sin(f * 0.9 + s) * 12})`}>
        <rect x={-24} y={-240} width={48} height={240} rx={20} fill="#2b3550" stroke={C.ink} strokeWidth={7} />
        <path d="M -32 -236 Q -34 -290 4 -288 Q 40 -286 36 -236 Z" fill="#e9e9ee" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
      </g>
    ))}
  </svg>
);

export const S1Forest: React.FC<ShotProps> = ({ shot, f, dur, beat }) => {
  const p = f / dur;
  const h = hitF(beat);
  switch (shot) {
    case "walkWide":
      return (
        <AbsoluteFill>
          <Forest frame={f} pan={0.5 - p} />
          <Hero who="artem" x={380 + p * 220} y={1110} s={0.72} f={f} pose="walk" emotion="scared" look={Math.sin(f * 0.07)} />
          <Bush frame={f} w={640} style={{ position: "absolute", left: -240, top: 1060 }} />
          <Bush frame={f} w={600} color="#132019" style={{ position: "absolute", left: 700, top: 1080 }} />
          <Onoma text="*скрип*" x={230} y={560} f={f} delay={10} size={64} color="#9fb0c8" rot={-12} />
        </AbsoluteFill>
      );
    case "badgeArtem":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={5} pan={p - 0.5} />
          <Hero who="artem" x={540} y={1440} s={1.55} f={f} emotion="scared" look={Math.sin(f * 0.12) * 0.9} tremble={1.5} />
          <Badge f={f} delay={h} title="АРТЁМ" sub="ТРУС" color={C.yellow} icon={Icon.scared} />
        </AbsoluteFill>
      );
    case "artemClose":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={12} />
          <FaceCam who="artem" f={f} s={2.52} hy={620 + 60} emotion={p < 0.55 ? "eyeroll" : "scared"} look={p < 0.55 ? 0 : -0.8} />
        </AbsoluteFill>
      );
    case "bushVoice":
      return (
        <AbsoluteFill>
          <Forest frame={f} pan={0.2} />
          <Bush frame={f} shake={10} w={900} eyes style={{ position: "absolute", left: 90, top: 640 }} />
          <SoundWaves f={f} x={20} y={560} />
          <SoundWaves f={f} x={800} y={560} flip />
          <Hero who="artem" x={860} y={1180} s={0.8} f={f} emotion="scared" look={-1} tremble={3} />
          <Fog frame={f} color="#c9d6ea" opacity={0.12} y={1000} seed={3} />
        </AbsoluteFill>
      );
    case "thought":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={6} pan={-0.2} />
          <Hero who="artem" x={560} y={1420} s={1.5} f={f} emotion="panic" pose="cower" tremble={3} />
          <Thought f={f} delay={4} text="ЭТО КТО?!" x={330} y={420} w={420} />
        </AbsoluteFill>
      );
    case "fall": {
      const fly = ease(f, 0, 1, 0, h);
      return (
        <AbsoluteFill>
          <Forest frame={f} pan={-0.3} />
          {f < h ? (
            <Hero who="artem" x={540 - fly * 40} y={1100 - Math.sin(fly * Math.PI) * 180 + fly * 60} s={0.95} f={f} emotion="panic" pose="armsUp" style={{ transform: `rotate(${-fly * 160}deg)`, transformOrigin: "50% 60%" }} />
          ) : (
            <Legs f={f} />
          )}
          <Bush frame={f} shake={f >= h ? Math.max(0, 14 - (f - h) * 0.3) : 0} w={820} style={{ position: "absolute", left: 130, top: 820, zIndex: 3 }} />
          <Leaves f={f} start={h} cx={540} cy={880} />
          <Onoma text="БАМ!" x={800} y={600} f={f} delay={h} size={120} color={C.yellow} rot={10} />
        </AbsoluteFill>
      );
    }
    case "squirrel": {
      const z = ease(f, 0.4, 1.15, 0, 6) + p * 0.15;
      return (
        <AbsoluteFill>
          <Burst f={f} color="#3b2410" color2="#1a0f08" />
          <SpeedLines f={f} opacity={0.35} />
          <Pos x={540} y={1150} ox={260} oy={520} s={1.6}>
            <div style={{ transform: `scale(${z})`, transformOrigin: "50% 90%" }}>
              <Squirrel frame={f} size={1.6} crazy={1.6} />
            </div>
          </Pos>
          <Onoma text="ИИИИ!" x={300} y={420} f={f} delay={2} size={110} color={C.yellow} rot={-14} />
        </AbsoluteFill>
      );
    }
    case "squirrelPolaroid":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={14} tint="rgba(0,0,0,0.35)" />
          <Polaroid f={f} caption="ЕБАНУТАЯ" captionColor={C.red} y={630} rot={-5} bg="#1b2230">
            <Forest frame={f} pan={0} />
            <Pos x={380} y={600} ox={260} oy={520} s={0.95}>
              <Squirrel frame={f} size={0.95} crazy={1.2} />
            </Pos>
          </Polaroid>
          <Hero who="artem" x={890} y={1250} s={0.85} f={f} emotion="panic" pose="armsUp" />
        </AbsoluteFill>
      );
    case "howl": {
      const ring = (f % 24) / 24;
      return (
        <AbsoluteFill>
          <Forest frame={f} pan={0} moonY={640} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            {[0, 1, 2].map((i) => {
              const r = ((ring + i / 3) % 1) * 600 + 120;
              return <circle key={i} cx={790} cy={640} r={r} fill="none" stroke="#dfe6ff" strokeWidth={6} opacity={(1 - r / 720) * 0.5} />;
            })}
            <path d="M 420 860 Q 700 700 1100 760 L 1100 1000 L 420 1000 Z" fill="#06070a" />
          </svg>
          <WolfAt x={800} y={790} s={0.55} f={f} pose="howl" flip />
          <Onoma text="АУУУУУ!" x={420} y={430} f={f} delay={h} size={120} color="#dfe6ff" rot={-8} />
          <Hero who="artem" x={230} y={1210} s={0.9} f={f} emotion="panic" tremble={4} look={1} />
        </AbsoluteFill>
      );
    }
    case "phoneOff": {
      const off = f >= Math.round(T.phoneOffAt * 30);
      const flick = off && f < Math.round(T.phoneOffAt * 30) + 8 && f % 2 === 0;
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={14} tint="rgba(0,0,0,0.4)" />
          <div style={{ position: "absolute", left: 250, top: 300, transform: `rotate(-6deg) translateY(${Math.sin(f * 0.3) * 4}px)` }}>
            <Phone w={560} h={920} time="23:56">
              {!off || flick ? (
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#1c2a4a,#0d1426)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 120 }}>
                  <div style={{ fontFamily: FONT.black, fontWeight: 900, fontSize: 130, color: "#fff" }}>23:56</div>
                  <div style={{ fontFamily: FONT.black, fontWeight: 800, fontSize: 36, color: "#9fb0c8" }}>НЕТ СЕТИ</div>
                  <div style={{ marginTop: 120, width: 220, height: 100, border: "8px solid #fff", borderRadius: 18, position: "relative" }}>
                    <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 18, background: C.red, borderRadius: 6, opacity: Math.floor(f / 6) % 2 ? 1 : 0.3 }} />
                    <div style={{ position: "absolute", right: -26, top: 28, width: 16, height: 30, background: "#fff", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontFamily: FONT.black, fontWeight: 900, fontSize: 64, color: C.red, marginTop: 20 }}>1%</div>
                </div>
              ) : (
                <div style={{ position: "absolute", inset: 0, background: "#000" }} />
              )}
            </Phone>
          </div>
          <Hand style={{ left: 330, top: 760, transform: "rotate(-6deg)" }} />
          {off ? <Onoma text="ВЫКЛ." x={540} y={1150} f={f} delay={Math.round(T.phoneOffAt * 30)} size={100} color={C.red} rot={-4} /> : null}
        </AbsoluteFill>
      );
    }
    case "artemDoom":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={12} tint="rgba(5,8,20,0.45)" />
          <FaceCam who="artem" f={f} s={2.44} hy={640 + 60} emotion={p < 0.4 ? "tired" : "cry"} />
        </AbsoluteFill>
      );
    case "fogAlina": {
      const reveal = ease(f, 0, 1, 10, dur - 15);
      return (
        <AbsoluteFill>
          <Forest frame={f} pan={-0.2 + p * 0.3} />
          <Fog frame={f * 2} color="#c9d6ea" opacity={0.35 * (1 - reveal * 0.6)} y={850} seed={8} />
          <Hero who="alina" x={600} y={1100} s={0.9 + reveal * 0.15} f={f} pose="pocket" emotion="neutral" style={{ filter: `brightness(${0.08 + reveal * 0.92})`, opacity: 0.3 + reveal * 0.7 }} />
          <Fog frame={f * 2 + 300} color="#c9d6ea" opacity={0.3 * (1 - reveal * 0.5)} y={1000} seed={2} />
          <Hero who="artem" x={170} y={1300} s={1.1} f={f} emotion="scared" look={1} tremble={2} />
        </AbsoluteFill>
      );
    }
    default:
      return null;
  }
};

