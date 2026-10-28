import React from "react";
import { AbsoluteFill } from "remotion";
import { Monster } from "../characters/Creatures";
import { Forest } from "../env/Forest";
import { Crystal, Seal } from "../env/Places";
import { Check, FactPlate, Polaroid, Pos, Stamp } from "../ui/Kit";
import { C, FONT } from "../theme";
import { ease, hash, pop } from "../anim";
import { BlurForest, FaceCam, Hero, ShotProps, cueF, hitF } from "./common";

const Underground: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ background: "#0c0a0d" }}>
    <svg width={760} height={640} style={{ position: "absolute", inset: 0 }}>
      <rect width={760} height={170} fill="#141a2a" />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M ${i * 66 + 20} 40 L ${i * 66 + 52} 160 L ${i * 66 - 12} 160 Z`} fill="#1b2a2d" />
      ))}
      <rect y={160} width={760} height={480} fill="#2a1f19" />
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={hash(i) * 760} cy={180 + hash(i + 9) * 450} r={3 + hash(i + 2) * 8} fill="#3a2c22" />
      ))}
      <ellipse cx={380} cy={440} rx={300} ry={170} fill="#070608" />
      <path d="M 90 440 L 160 440 M 600 440 L 680 440" stroke="#6b7080" strokeWidth={10} strokeDasharray="20 10" />
    </svg>
    {children}
  </AbsoluteFill>
);

export const S4Secret: React.FC<ShotProps> = ({ shot, f, dur, beat }) => {
  const p = f / dur;
  const h = hitF(beat);
  switch (shot) {
    case "fact1":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="deep" blur={14} tint="rgba(0,0,0,0.45)" />
          <FactPlate f={f} n={1} text="ПОД ЛЕСОМ — ЧУДОВИЩЕ" y={390} />
          <Polaroid f={f} delay={3} caption="ДРЕВНЕЕ ЗЛО" captionColor={C.red} y={715} w={700} h={460} rot={-3}>
            <Underground f={f}>
              <Pos x={380} y={450} ox={520} oy={520} s={0.32}>
                <Monster frame={f} size={0.32} rage={0.2} />
              </Pos>
            </Underground>
          </Polaroid>
          <Check f={f} delay={cueF(beat, "check")} x={900} y={500} />
        </AbsoluteFill>
      );
    case "fact2": {
      const faces = Array.from({ length: 6 }).map((_, i) => {
        const t = ((f * 0.03 + i / 6) % 1);
        const a = i * 1.05 + t * 4;
        const r = (1 - t) * 320;
        return { x: 380 + Math.cos(a) * r, y: 330 + Math.sin(a) * r * 0.7, s: 1 - t * 0.7 };
      });
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="deep" blur={14} tint="rgba(0,0,0,0.45)" />
          <FactPlate f={f} n={2} text="ЖРЁТ СТРАХ" y={390} />
          <Polaroid f={f} delay={3} caption="МЕНЮ: СТРАХ" captionColor={C.red} y={715} w={700} h={460} rot={3} from="left" bg="#0b0709">
            <Pos x={380} y={340} ox={520} oy={520} s={0.55}>
              <Monster frame={f} size={0.55} rage={1.2} />
            </Pos>
            {faces.map((q, i) => (
              <div key={i} style={{ position: "absolute", left: q.x - 34, top: q.y - 34, width: 68, height: 68, borderRadius: 34, background: "#fff", border: `5px solid ${C.ink}`, transform: `scale(${q.s})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.black, fontWeight: 900, fontSize: 40 }}>
                😱
              </div>
            ))}
          </Polaroid>
          <Check f={f} delay={cueF(beat, "check")} x={900} y={500} />
        </AbsoluteFill>
      );
    }
    case "fact3":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="deep" blur={14} tint="rgba(0,0,0,0.45)" />
          <FactPlate f={f} n={3} text="ПЕЧАТЬ РУШИТСЯ" y={390} />
          <Polaroid f={f} delay={3} caption="ЛЕСУ КОНЕЦ?" captionColor={C.red} y={715} w={700} h={460} rot={-2} bg="#0c0d12">
            <Pos x={350} y={300} ox={500} oy={200} s={0.7}>
              <Seal frame={f} size={0.7} power={0.5 + 0.5 * Math.abs(Math.sin(f * 0.25))} crack={ease(f, 0, 1, 10, 40)} />
            </Pos>
          </Polaroid>
          <Check f={f} delay={cueF(beat, "check")} x={900} y={500} />
        </AbsoluteFill>
      );
    case "alinaWhy":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="deep" blur={6} />
          <Hero who="alina" x={540} y={1450} s={1.55} f={f} pose="shrug" emotion="sarcastic" />
        </AbsoluteFill>
      );
    case "valeraBlame":
      return (
        <AbsoluteFill>
          <Forest frame={f} mood="deep" pan={-0.2 + p * 0.3} />
          <Hero who="valera" x={250} y={1210} s={1.1} f={f} pose="point" emotion="angry" redEyes={f >= h} />
          <Hero who="artem" x={680} y={1210} s={1.05} f={f} emotion={f < h ? "scared" : "panic"} look={-0.8} tremble={f >= h ? 4 : 1} />
          <Hero who="alina" x={900} y={1250} s={0.85} f={f} emotion="eyeroll" pose="pocket" />
        </AbsoluteFill>
      );
    case "artemGuilty":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="deep" blur={12} />
          <FaceCam who="artem" f={f} s={2.52} hy={640 + 60} emotion="shocked" look={-0.3} />
        </AbsoluteFill>
      );
    case "dishStamp":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="deep" blur={14} tint="rgba(0,0,0,0.4)" />
          <Polaroid f={f} caption="БЛЮДО ДНЯ" captionColor={C.red} y={610} w={720} h={540} rot={-4} bg="#3a1418">
            <svg width={720} height={620} style={{ position: "absolute", inset: 0 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <rect key={i} x={(i % 4) * 180} y={Math.floor(i / 4) * 180 + (i % 2) * 0} width={90} height={620} fill="#4a1a1f" />
              ))}
              <ellipse cx={360} cy={520} rx={330} ry={80} fill="#f4f4f7" stroke={C.ink} strokeWidth={9} />
              <ellipse cx={360} cy={510} rx={250} ry={54} fill="#dfe1e8" />
              <path d="M 30 230 L 30 520 M 10 230 L 10 320 M 50 230 L 50 320" stroke="#c9ced8" strokeWidth={14} strokeLinecap="round" />
              <path d="M 690 230 Q 720 360 690 520" stroke="#c9ced8" strokeWidth={22} strokeLinecap="round" fill="none" />
            </svg>
            <Hero who="artem" x={360} y={560} s={0.8} f={f} pose="sit" emotion="panic" />
            <div style={{ position: "absolute", left: 300, top: 210, width: 120, height: 40, background: "#fff", border: `5px solid ${C.ink}`, borderRadius: "0 0 40px 40px" }} />
          </Polaroid>
          <Stamp f={f} delay={h} text={"ЛЮБИМОЕ\nБЛЮДО"} x={560} y={700} rot={-10} size={84} />
        </AbsoluteFill>
      );
    case "route": {
      const draw = ease(f, 0, 1, 8, dur - 20);
      const len = 1400;
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="deep" blur={14} tint="rgba(0,0,0,0.45)" />
          <div style={{ position: "absolute", left: 90, top: 380, width: 900, height: 700, borderRadius: 40, background: "#11151d", border: "4px solid #2b3142", boxShadow: "0 30px 60px rgba(0,0,0,0.7)", overflow: "hidden", transform: `translateY(${(1 - pop(f, 0, 12, 140)) * 600}px)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "26px 34px", fontFamily: FONT.black, fontWeight: 900, fontSize: 34, color: "#fff" }}>
              <span>📍 МАРШРУТ</span>
              <span style={{ color: "#8f97ab" }}>01:10</span>
            </div>
            <svg width={900} height={480} style={{ position: "absolute", top: 100 }}>
              <rect width={900} height={480} fill="#16231f" />
              {Array.from({ length: 60 }).map((_, i) => (
                <path key={i} d={`M ${hash(i) * 900} ${hash(i + 4) * 540} l 18 34 l -36 0 Z`} fill="#203a2e" />
              ))}
              <path d="M 120 460 C 260 420 220 260 400 260 C 560 260 520 120 760 110" stroke="#2c3a33" strokeWidth={40} fill="none" strokeLinecap="round" />
              <path d="M 120 460 C 260 420 220 260 400 260 C 560 260 520 120 760 110" stroke={C.yellow} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
              <circle cx={120} cy={460} r={24} fill={C.blue} stroke="#fff" strokeWidth={6} />
              <g transform={`translate(760,110) scale(${pop(f, dur - 26, 9, 200)})`}>
                <circle r={46} fill={C.red} opacity={0.3} />
                <path d="M 0 30 C -40 -10 -30 -50 0 -50 C 30 -50 40 -10 0 30 Z" fill={C.red} stroke="#fff" strokeWidth={5} />
              </g>
            </svg>
            <div style={{ position: "absolute", bottom: 26, left: 34, right: 34, display: "flex", justifyContent: "space-between", fontFamily: FONT.black, fontWeight: 900, fontSize: 40, color: "#fff" }}>
              <span>⛩ СВЯТИЛИЩЕ</span>
              <span style={{ color: C.yellow }}>3 КМ</span>
            </div>
          </div>
        </AbsoluteFill>
      );
    }
    case "sanctuary":
      return (
        <AbsoluteFill>
          <Forest frame={f} mood="deep" pan={0.3 - p * 0.4} horizon={860} />
          <Pos x={540} y={1060} ox={500} oy={200} s={1}>
            <Seal frame={f} size={1} power={0.6 + 0.3 * Math.sin(f * 0.2)} crack={0.6} />
          </Pos>
          <Pos x={170} y={1000} ox={200} oy={380} s={0.8}>
            <Crystal size={0.8} glow={0.8 + 0.2 * Math.sin(f * 0.3)} />
          </Pos>
          <Pos x={910} y={1000} ox={200} oy={380} s={0.8}>
            <Crystal size={0.8} glow={0.8 + 0.2 * Math.sin(f * 0.3 + 1)} />
          </Pos>
          <Hero who="alina" x={400} y={1300} s={0.75} f={f} pose="walk" emotion="shocked" />
          <Hero who="valera" x={560} y={1320} s={0.78} f={f + 5} pose="walk" emotion="serious" />
          <Hero who="artem" x={720} y={1310} s={0.75} f={f + 11} pose="walk" emotion="scared" tremble={2} />
        </AbsoluteFill>
      );
    default:
      return null;
  }
};
