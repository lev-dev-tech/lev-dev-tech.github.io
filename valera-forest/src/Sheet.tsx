import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Monster, RedEyes, Squirrel, Wolf, WolfFace } from "./characters/Creatures";

export const Sheet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#3a4050" }}>
      <div style={{ position: "absolute", left: 60, top: 40 }}><Wolf pose="growl" frame={f} size={1} /></div>
      <div style={{ position: "absolute", left: 60, top: 520 }}><Wolf pose="howl" frame={f} size={0.5} /></div>
      <div style={{ position: "absolute", left: 560, top: 560 }}><Squirrel frame={f} size={0.7} /></div>
      <div style={{ position: "absolute", left: 0, top: 900 }}><WolfFace frame={f} size={0.6} /></div>
      <div style={{ position: "absolute", left: 480, top: 900 }}><Monster frame={f} size={0.55} /></div>
      <div style={{ position: "absolute", left: 100, top: 1650 }}><RedEyes frame={f} size={1} /></div>
    </AbsoluteFill>
  );
};
