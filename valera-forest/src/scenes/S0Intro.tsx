import React from "react";
import { AbsoluteFill } from "remotion";
import { RedEyes } from "../characters/Creatures";
import { Bush, Forest } from "../env/Forest";
import { Pos, Stamp } from "../ui/Kit";
import { FONT, C } from "../theme";
import { pop } from "../anim";
import { ShotProps, hitF } from "./common";

export const S0Intro: React.FC<ShotProps> = ({ f, dur, beat }) => {
  const p = f / dur;
  const t = pop(f, 4, 10, 140);
  return (
    <AbsoluteFill>
      <Forest frame={f} pan={-0.6 + p * 1.2} />
      <Pos x={300} y={820} ox={260} oy={100} s={0.22}>
        <RedEyes frame={f} size={0.22} open={Math.min(1, f / 30)} />
      </Pos>
      <Pos x={860} y={900} ox={260} oy={100} s={0.16}>
        <RedEyes frame={f + 30} size={0.16} open={Math.min(1, Math.max(0, (f - 20) / 20))} />
      </Pos>
      <Bush frame={f} w={700} style={{ position: "absolute", left: -260, top: 1020 }} />
      <Bush frame={f} w={700} color="#132019" style={{ position: "absolute", left: 640, top: 1050 }} />
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center", transform: `scale(${t}) rotate(-3deg)` }}>
        <div style={{ fontFamily: FONT.russo, fontSize: 170, color: "#fff", lineHeight: 0.95, textShadow: `0 10px 0 ${C.red}, 0 18px 30px rgba(0,0,0,0.8)` }}>ЛЕС</div>
        <div style={{ fontFamily: FONT.russo, fontSize: 170, color: C.yellow, lineHeight: 0.95, textShadow: `0 10px 0 ${C.ink}, 0 18px 30px rgba(0,0,0,0.8)` }}>ВАЛЕРЫ</div>
      </div>
      <Stamp f={f} delay={hitF(beat)} text={"НЕХУЙ СЮДА\nХОДИТЬ"} y={1010} rot={-7} size={92} />
    </AbsoluteFill>
  );
};
