import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../theme";
import { ease, jitter, pop } from "../anim";

export const Pos: React.FC<{ x: number; y: number; ox: number; oy: number; s?: number; z?: number; children: React.ReactNode; rot?: number; style?: React.CSSProperties }> = ({
  x,
  y,
  ox,
  oy,
  s = 1,
  z,
  children,
  rot = 0,
  style,
}) => (
  <div style={{ position: "absolute", left: x - ox * s, top: y - oy * s, zIndex: z, transformOrigin: `${ox * s}px ${oy * s}px`, transform: rot ? `rotate(${rot}deg)` : undefined, ...style }}>
    {children}
  </div>
);

export const Polaroid: React.FC<{
  f: number;
  delay?: number;
  caption: string;
  captionColor?: string;
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  rot?: number;
  from?: "left" | "right" | "top";
  children: React.ReactNode;
  bg?: string;
  marker?: boolean;
}> = ({ f, delay = 0, caption, captionColor = "#2a2a2a", w = 760, h = 560, x = 540, y = 640, rot = -4, from = "right", children, bg = "#1a2030", marker = true }) => {
  const p = pop(f, delay, 11, 120);
  const dx = from === "left" ? -1200 : from === "right" ? 1200 : 0;
  const dy = from === "top" ? -1400 : 120;
  const tx = dx * (1 - p);
  const ty = dy * (1 - p);
  const r = rot + (1 - p) * (from === "left" ? -40 : 40);
  return (
    <div
      style={{
        position: "absolute",
        left: x - (w + 50) / 2,
        top: y - (h + 170) / 2,
        width: w + 50,
        height: h + 170,
        transform: `translate(${tx}px,${ty}px) rotate(${r}deg)`,
        background: "#efe9dc",
        borderRadius: 8,
        boxShadow: "0 24px 50px rgba(0,0,0,0.6), inset 0 0 40px rgba(120,100,70,0.18)",
        padding: 25,
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: w, height: h, background: bg, overflow: "hidden", position: "relative", boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)" }}>{children}</div>
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: marker ? FONT.marker : FONT.russo,
          fontWeight: 700,
          fontSize: marker ? 84 : 66,
          color: captionColor,
          lineHeight: 1,
          transform: "rotate(-1.5deg)",
        }}
      >
        {caption}
      </div>
      <div
        style={{
          position: "absolute",
          top: -26,
          left: "50%",
          width: 230,
          height: 58,
          marginLeft: -115,
          background: "rgba(232,224,196,0.82)",
          transform: "rotate(3deg)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          clipPath: "polygon(2% 0,98% 4%,100% 92%,96% 100%,3% 96%,0 8%)",
        }}
      />
    </div>
  );
};

export const Stamp: React.FC<{ f: number; text: string; delay?: number; x?: number; y?: number; rot?: number; size?: number; color?: string; sub?: string }> = ({
  f,
  text,
  delay = 0,
  x = 540,
  y = 420,
  rot = -8,
  size = 110,
  color = C.red,
  sub,
}) => {
  if (f < delay) return null;
  const l = f - delay;
  const s = l < 5 ? ease(l, 3, 0.92, 0, 4) : 0.92 + 0.08 * pop(l, 4, 7, 300);
  const o = ease(l, 0, 1, 0, 3);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o, zIndex: 50 }}>
      <div
        style={{
          border: `10px solid ${color}`,
          borderRadius: 18,
          padding: "10px 34px 14px",
          background: "rgba(20,8,10,0.35)",
          boxShadow: `0 0 0 5px rgba(0,0,0,0.25), 0 18px 40px rgba(0,0,0,0.5)`,
          textAlign: "center",
          maskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,0.75) 100%)",
        }}
      >
        <div style={{ fontFamily: FONT.russo, fontSize: size, color, lineHeight: 1.05, letterSpacing: 2, whiteSpace: "pre", textShadow: "0 0 2px rgba(0,0,0,0.4)" }}>{text}</div>
        {sub ? <div style={{ fontFamily: FONT.black, fontWeight: 900, fontSize: size * 0.32, color, letterSpacing: 4 }}>{sub}</div> : null}
      </div>
    </div>
  );
};

export const Badge: React.FC<{ f: number; delay?: number; title: string; sub: string; color: string; icon: React.ReactNode; x?: number; y?: number; rot?: number }> = ({
  f,
  delay = 0,
  title,
  sub,
  color,
  icon,
  x = 500,
  y = 440,
  rot = -3,
}) => {
  const p = pop(f, delay, 10, 200);
  if (f < delay) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${p}) rotate(${rot}deg)`, zIndex: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#f4f1ea", borderRadius: 26, padding: "14px 30px 14px 16px", boxShadow: "0 14px 30px rgba(0,0,0,0.55)", border: `6px solid ${color}` }}>
        <div style={{ width: 96, height: 96, borderRadius: 48, background: color, display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #15161c" }}>{icon}</div>
        <div>
          <div style={{ fontFamily: FONT.black, fontWeight: 900, fontSize: 52, color: "#15161c", lineHeight: 1 }}>{title}</div>
          <div style={{ fontFamily: FONT.black, fontWeight: 900, fontSize: 40, color, lineHeight: 1.1, letterSpacing: 1 }}>{sub}</div>
        </div>
      </div>
    </div>
  );
};

export const Thought: React.FC<{ f: number; delay?: number; text: string; x: number; y: number; w?: number; color?: string; tail?: "left" | "right" }> = ({
  f,
  delay = 0,
  text,
  x,
  y,
  w = 460,
  color = "#15161c",
  tail = "left",
}) => {
  const p = pop(f, delay, 9, 170);
  if (f < delay) return null;
  const bob = Math.sin(f * 0.1) * 6;
  const tx = tail === "left" ? -1 : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, transform: `translate(-50%,-50%) scale(${p})`, zIndex: 40 }}>
      <svg width={w + 80} height={w * 0.62 + 120} viewBox={`-40 -20 ${w + 80} ${w * 0.62 + 120}`} style={{ overflow: "visible", position: "absolute", left: -40, top: -20 }}>
        {[
          [0.18, 0.2, 0.2], [0.42, 0.08, 0.22], [0.68, 0.1, 0.21], [0.86, 0.3, 0.18], [0.8, 0.52, 0.19], [0.55, 0.6, 0.22], [0.28, 0.58, 0.2], [0.1, 0.42, 0.17],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx * w} cy={cy * w * 0.62 + 20} r={r * w * 0.62} fill="#fff" stroke={C.ink} strokeWidth={7} />
        ))}
        <ellipse cx={w / 2} cy={w * 0.31 + 20} rx={w * 0.42} ry={w * 0.24} fill="#fff" />
        <circle cx={w / 2 + tx * w * 0.38} cy={w * 0.62 + 50} r={22} fill="#fff" stroke={C.ink} strokeWidth={6} />
        <circle cx={w / 2 + tx * w * 0.46} cy={w * 0.62 + 92} r={13} fill="#fff" stroke={C.ink} strokeWidth={5} />
      </svg>
      <div
        style={{
          position: "relative",
          width: w,
          height: w * 0.62 + 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: FONT.black,
          fontWeight: 900,
          fontSize: 58,
          lineHeight: 1.05,
          color,
          padding: "0 60px",
          boxSizing: "border-box",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Check: React.FC<{ f: number; delay: number; x: number; y: number; size?: number }> = ({ f, delay, x, y, size = 110 }) => {
  if (f < delay) return null;
  const p = pop(f, delay, 8, 260);
  const dash = ease(f, 120, 0, delay + 2, delay + 9);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${p})`, zIndex: 60 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={46} fill="#2ecc5a" stroke="#fff" strokeWidth={7} />
        <path d="M 27 52 L 44 68 L 74 34" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={120} strokeDashoffset={dash} />
      </svg>
    </div>
  );
};

export const FactPlate: React.FC<{ f: number; n: number; text: string; delay?: number; y?: number }> = ({ f, n, text, delay = 0, y = 300 }) => {
  const p = pop(f, delay, 12, 180);
  return (
    <div style={{ position: "absolute", left: 540, top: y, transform: `translate(-50%,-50%) translateY(${(1 - p) * -200}px) rotate(-1.5deg)`, opacity: Math.min(1, p * 1.5), zIndex: 45 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#efe9dc", padding: "14px 30px", borderRadius: 10, boxShadow: "0 12px 26px rgba(0,0,0,0.55)", whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: FONT.black, fontWeight: 900, fontSize: 52, color: C.red }}>{n}.</div>
        <div style={{ fontFamily: FONT.black, fontWeight: 900, fontSize: 46, color: "#15161c", letterSpacing: 0.5 }}>{text}</div>
      </div>
    </div>
  );
};

export const Phone: React.FC<{ children: React.ReactNode; w?: number; h?: number; time?: string; light?: boolean; style?: React.CSSProperties }> = ({ children, w = 560, h = 1000, time = "23:52", light, style }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 70,
      background: "#0b0c10",
      border: "10px solid #2a2e3a",
      boxShadow: "0 30px 60px rgba(0,0,0,0.7), inset 0 0 0 4px #000",
      padding: 18,
      boxSizing: "border-box",
      position: "relative",
      ...style,
    }}
  >
    <div style={{ width: "100%", height: "100%", borderRadius: 52, overflow: "hidden", background: light ? "#f3f4f8" : "#141822", position: "relative" }}>
      <div style={{ position: "absolute", top: 16, left: 34, right: 34, display: "flex", justifyContent: "space-between", fontFamily: FONT.black, fontWeight: 800, fontSize: 28, color: light ? "#15161c" : "#fff", zIndex: 5 }}>
        <span>{time}</span>
        <span style={{ width: 110, height: 34, borderRadius: 17, background: "#000", marginTop: -4 }} />
        <span>●●● ▮</span>
      </div>
      {children}
    </div>
  </div>
);

export const Hand: React.FC<{ style?: React.CSSProperties; sleeve?: string }> = ({ style, sleeve = "#2a2d37" }) => (
  <svg width={420} height={520} viewBox="0 0 420 520" style={{ position: "absolute", ...style }}>
    <path d="M 150 520 L 170 300 L 330 300 L 360 520 Z" fill={sleeve} stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
    <path d="M 160 330 L 340 330" stroke={C.ink} strokeWidth={7} />
    <path d="M 150 300 Q 110 170 170 120 L 340 120 Q 380 200 340 300 Z" fill={C.skin} stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={250} y={40 + i * 56} width={110} height={52} rx={26} fill={C.skin} stroke={C.ink} strokeWidth={8} />
    ))}
    <path d="M 160 200 Q 90 140 110 90 Q 130 60 170 110 L 200 180" fill={C.skin} stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
  </svg>
);

export const SoundWaves: React.FC<{ f: number; x: number; y: number; color?: string; flip?: boolean; scale?: number }> = ({ f, x, y, color = "#b3161b", flip, scale = 1 }) => (
  <svg width={260 * scale} height={220 * scale} viewBox="0 0 260 220" style={{ position: "absolute", left: x, top: y, transform: flip ? "scaleX(-1)" : undefined, zIndex: 30 }}>
    {[0, 1, 2, 3].map((i) => {
      let d = "";
      for (let k = 0; k <= 200; k += 8) {
        const yy = 30 + i * 50 + Math.sin(k * 0.08 + f * 0.45 + i * 1.3) * (14 + i * 2) * Math.sin((k / 200) * Math.PI);
        d += `${k === 0 ? "M" : "L"} ${k + 30} ${yy} `;
      }
      return <path key={i} d={d} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.9 - i * 0.15} />;
    })}
  </svg>
);

export const Viewfinder: React.FC<{ f: number; inset?: number; color?: string }> = ({ f, inset = 60, color = "#fff" }) => {
  const corner = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 110, height: 110, ...s }} />;
  const b = `8px solid ${color}`;
  return (
    <AbsoluteFill style={{ zIndex: 70 }}>
      {corner({ left: inset, top: inset + 200, borderLeft: b, borderTop: b })}
      {corner({ right: inset, top: inset + 200, borderRight: b, borderTop: b })}
      {corner({ left: inset, bottom: inset + 520, borderLeft: b, borderBottom: b })}
      {corner({ right: inset, bottom: inset + 520, borderRight: b, borderBottom: b })}
      <div style={{ position: "absolute", left: inset + 40, top: inset + 236, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT.black, fontWeight: 900, fontSize: 46, color: "#fff" }}>
        <div style={{ width: 34, height: 34, borderRadius: 17, background: C.red, opacity: Math.floor(f / 15) % 2 ? 0.25 : 1, boxShadow: "0 0 20px #e53935" }} />
        REC
      </div>
      <div style={{ position: "absolute", right: inset + 40, top: inset + 240, fontFamily: FONT.black, fontWeight: 700, fontSize: 34, color: "#cfd3dc" }}>
        00:{String(Math.floor(f / 30) + 13).padStart(2, "0")}:{String(f % 30).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

export const Flash: React.FC<{ f: number; at: number; len?: number; color?: string; max?: number }> = ({ f, at, len = 8, color = "#fff", max = 1 }) => {
  const o = f >= at && f < at + len ? max * (1 - (f - at) / len) : 0;
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, zIndex: 80 }} />;
};

export const Shaker: React.FC<{ f: number; amp: number; children: React.ReactNode }> = ({ f, amp, children }) => (
  <AbsoluteFill style={{ transform: `translate(${jitter(f, 1, amp)}px,${jitter(f, 2, amp)}px)` }}>{children}</AbsoluteFill>
);

export const Icon = {
  scared: (
    <svg width={70} height={70} viewBox="0 0 70 70">
      <circle cx={35} cy={35} r={30} fill="#fff" stroke={C.ink} strokeWidth={5} />
      <circle cx={24} cy={30} r={8} fill="#fff" stroke={C.ink} strokeWidth={4} />
      <circle cx={46} cy={30} r={8} fill="#fff" stroke={C.ink} strokeWidth={4} />
      <circle cx={24} cy={31} r={3} fill={C.ink} />
      <circle cx={46} cy={31} r={3} fill={C.ink} />
      <ellipse cx={35} cy={50} rx={7} ry={8} fill={C.ink} />
    </svg>
  ),
  smirk: (
    <svg width={70} height={70} viewBox="0 0 70 70">
      <circle cx={35} cy={35} r={30} fill="#fff" stroke={C.ink} strokeWidth={5} />
      <path d="M 18 30 L 30 30 M 40 28 L 52 26" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
      <path d="M 22 48 Q 38 52 50 40" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
    </svg>
  ),
  tree: (
    <svg width={70} height={70} viewBox="0 0 70 70">
      <path d="M 35 6 L 56 34 L 46 34 L 60 52 L 10 52 L 24 34 L 14 34 Z" fill="#fff" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
      <rect x={30} y={52} width={10} height={12} fill="#fff" stroke={C.ink} strokeWidth={4} />
    </svg>
  ),
};
