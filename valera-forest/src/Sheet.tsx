import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Character, Emotion, Pose, Who } from "./characters/Character";

const rows: [Who, Emotion, Pose][] = [
  ["artem", "neutral", "stand"],
  ["artem", "panic", "armsUp"],
  ["artem", "scared", "point"],
  ["alina", "neutral", "stand"],
  ["alina", "sarcastic", "pocket"],
  ["alina", "happy", "armsUp"],
];

export const Sheet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0d0f14", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
      {rows.map(([w, e, p], i) => (
        <div key={i} style={{ width: 360, height: 480, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
          <Character who={w} emotion={e} pose={p} frame={f + 50} size={0.7} />
        </div>
      ))}
      <div style={{ width: 540, height: 960, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 10, top: 60 }}>
          <Character who="artem" emotion="neutral" frame={f + 50} size={1.3} />
        </div>
      </div>
      <div style={{ width: 540, height: 960, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 10, top: 60 }}>
          <Character who="alina" emotion="smug" frame={f + 50} size={1.3} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
