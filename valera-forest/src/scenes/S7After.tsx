import React from "react";
import { AbsoluteFill } from "remotion";
import { RedEyes } from "../characters/Creatures";
import { Blanket, Bedroom } from "../env/Places";
import { Pos, SoundWaves } from "../ui/Kit";
import { C, FONT } from "../theme";
import { ease, pop } from "../anim";
import { Burst, FaceCam, Hero, ShotProps, SpeedLines } from "./common";

const InBed: React.FC<{ f: number; emotion: "smug" | "scared" | "panic" | "tired"; tremble?: number }> = ({ f, emotion, tremble = 0 }) => (
  <>
    <Hero who="artem" x={560} y={1220} s={1.2} f={f} emotion={emotion} tremble={tremble} look={emotion === "scared" ? 0.4 : 0} lookY={emotion === "scared" ? 1 : 0} />
    <Pos x={560} y={1060} ox={410} oy={260} s={1.05}>
      <Blanket frame={f} tremble={tremble * 3} w={820 * 1.05} />
    </Pos>
  </>
);

export const S7After: React.FC<ShotProps> = ({ shot, f, dur }) => {
  const p = f / dur;
  switch (shot) {
    case "afterCard":
      return (
        <AbsoluteFill style={{ background: "#07080b", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `scale(${pop(f, 4, 10, 180)}) rotate(-3deg)`, textAlign: "center" }}>
            <div style={{ fontFamily: FONT.russo, fontSize: 120, color: "#fff", lineHeight: 1 }}>ПОСЛЕ</div>
            <div style={{ fontFamily: FONT.russo, fontSize: 120, color: C.red, lineHeight: 1 }}>ТИТРОВ</div>
            <div style={{ height: 12, background: C.red, marginTop: 20, width: `${ease(f, 0, 100, 6, 20)}%` }} />
          </div>
        </AbsoluteFill>
      );
    case "blanket":
      return (
        <Bedroom frame={f} pan={-0.3 + p * 0.4}>
          <InBed f={f} emotion={p < 0.3 ? "tired" : "smug"} />
        </Bedroom>
      );
    case "underBed":
      return (
        <Bedroom frame={f} pan={0.2}>
          <InBed f={f} emotion="scared" tremble={2} />
          <SoundWaves f={f} x={120} y={1000} scale={0.8} />
          <SoundWaves f={f} x={760} y={1000} scale={0.8} flip />
        </Bedroom>
      );
    case "eyes": {
      const z = ease(f, 0.4, 1.3, 0, 6) + p * 0.2;
      return (
        <AbsoluteFill style={{ background: "#000" }}>
          <SpeedLines f={f} color={C.red} opacity={0.25} />
          <Pos x={540} y={760} ox={260} oy={100} s={1.8}>
            <div style={{ transform: `scale(${z})` }}>
              <RedEyes frame={f} size={1.8} />
            </div>
          </Pos>
        </AbsoluteFill>
      );
    }
    case "valeraBed":
      return (
        <Bedroom frame={f} pan={0} dark={0}>
          <AbsoluteFill style={{ background: "rgba(40,0,0,0.35)" }} />
          <FaceCam who="valera" f={f} s={2.09} hy={720 + 60} emotion="angry" redEyes tremble={2} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 1040, height: 900, background: "#0d1018" }} />
          <div style={{ position: "absolute", left: 60, right: 60, top: 1010, height: 50, borderRadius: 10, background: "#5b3f2e", border: `8px solid ${C.ink}` }} />
        </Bedroom>
      );
    case "scream":
      return (
        <AbsoluteFill>
          <Burst f={f} color="#3a0a0e" color2="#130406" rays={22} />
          <SpeedLines f={f} opacity={0.35} />
          <FaceCam who="artem" f={f} s={2.87} hy={640 + 60} emotion="panic" tremble={8} />
        </AbsoluteFill>
      );
    default:
      return null;
  }
};
