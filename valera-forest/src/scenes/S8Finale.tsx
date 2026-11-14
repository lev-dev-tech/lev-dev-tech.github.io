import React from "react";
import { AbsoluteFill } from "remotion";
import { RedEyes } from "../characters/Creatures";
import { Forest } from "../env/Forest";
import { Pos, Viewfinder } from "../ui/Kit";
import { C, FONT } from "../theme";
import { ease, pop } from "../anim";
import { T } from "../scenes";
import { ShotProps } from "./common";

export const S8Finale: React.FC<ShotProps> = ({ f }) => {
  const a = Math.round(T.endTitleAt * 30);
  const b = Math.round(T.endPillAt * 30);
  return (
    <AbsoluteFill style={{ background: "#050608" }}>
      <AbsoluteFill style={{ opacity: 0.35, filter: "blur(3px)" }}>
        <Forest frame={f} pan={0} hideMoon />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.2), rgba(0,0,0,0.9) 75%)" }} />
      <Pos x={540} y={1000} ox={260} oy={100} s={0.5}>
        <RedEyes frame={f} size={0.5} open={ease(f, 0, 1, 40, 60)} />
      </Pos>
      <Viewfinder f={f} />
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", opacity: ease(f, 0, 1, a - 8, a), fontFamily: FONT.black, fontWeight: 900, fontSize: 46, color: "#9aa3b8", letterSpacing: 12 }}>ЛЕС ВАЛЕРЫ</div>
      <div style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(f, a, 10, 160)})` }}>
        <div style={{ fontFamily: FONT.russo, fontSize: 116, color: "#fff", lineHeight: 1.02, textShadow: "0 8px 0 #000" }}>
          КОНЕЦ
          <br />
          ПЕРВОЙ
          <br />
          СЕРИИ
        </div>
      </div>
      <div style={{ position: "absolute", top: 1040, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${pop(f, b, 8, 220)})` }}>
        <div style={{ background: C.red, color: "#fff", fontFamily: FONT.black, fontWeight: 900, fontSize: 64, padding: "16px 56px", borderRadius: 60, boxShadow: "0 0 40px rgba(229,57,53,0.6)", letterSpacing: 3 }}>СЕРИЯ 2 ▶</div>
      </div>
    </AbsoluteFill>
  );
};
