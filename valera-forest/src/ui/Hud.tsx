import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CLOCK_KEYS, CLOCK_MINUTE_EVERY, FEAR_KEYS, FPS } from "../scenes";
import { C, FONT } from "../theme";
import { jitter, pop } from "../anim";

const clockAt = (frame: number) => {
  let k = CLOCK_KEYS[0];
  for (const c of CLOCK_KEYS) if (c.frame <= frame) k = c;
  const [h, m] = k.time.split(":").map(Number);
  const add = Math.floor((frame - k.frame) / (CLOCK_MINUTE_EVERY * FPS));
  const total = (h * 60 + m + Math.max(0, add)) % 1440;
  return { label: k.label, time: `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`, since: frame - k.frame };
};

const fearAt = (frame: number) => {
  let prev = 0;
  let cur = FEAR_KEYS[0]?.value ?? 0;
  let since = 9999;
  for (const k of FEAR_KEYS) {
    if (k.frame <= frame) {
      prev = cur;
      cur = k.value;
      since = frame - k.frame;
    }
  }
  const s = pop(since, 0, 14, 160);
  const value = Math.round(prev + (cur - prev) * Math.min(1, s));
  return { value, jump: cur - prev, since };
};

export const TimePill: React.FC = () => {
  const frame = useCurrentFrame();
  const c = clockAt(frame);
  const p = c.since < 20 ? pop(c.since, 0, 10, 220) : 1;
  const morning = c.label === "УТРО";
  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: "50%",
        transform: `translateX(-50%) scale(${0.85 + 0.15 * p})`,
        background: morning ? "rgba(255,244,222,0.92)" : "rgba(14,16,22,0.88)",
        border: `3px solid ${morning ? "#e9c88f" : "#2b3142"}`,
        borderRadius: 22,
        padding: "10px 34px 8px",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ fontFamily: FONT.black, fontWeight: 900, fontSize: 38, letterSpacing: 2, color: morning ? "#2a2116" : "#fff", lineHeight: 1 }}>{c.label}</div>
      <div style={{ fontFamily: FONT.black, fontWeight: 700, fontSize: 26, color: morning ? "#6b5a3e" : "#9aa3b8", letterSpacing: 3, lineHeight: 1.2 }}>{c.time}</div>
    </div>
  );
};

export const FearSticker: React.FC = () => {
  const frame = useCurrentFrame();
  const f = fearAt(frame);
  const big = Math.abs(f.jump) >= 15 && f.since < 18;
  const sx = big ? jitter(frame, 1, 9) : 0;
  const sy = big ? jitter(frame, 2, 7) : 0;
  const sc = big ? 1 + 0.18 * Math.max(0, 1 - f.since / 18) : 1;
  const hot = f.value >= 80;
  const bar = Math.max(0, Math.min(100, f.value));
  const barColor = f.value >= 80 ? C.red : f.value >= 45 ? C.yellow : "#5ee27a";
  return (
    <div style={{ position: "absolute", top: 120, right: 38, transform: `translate(${sx}px,${sy}px) rotate(${3 + (big ? jitter(frame, 3, 3) : 0)}deg) scale(${sc})`, transformOrigin: "50% 0%" }}>
      <div
        style={{
          width: 300,
          background: hot ? "linear-gradient(180deg,#2a7cf0,#1556b8)" : "linear-gradient(180deg,#2a7cf0,#1e6fd9)",
          borderRadius: 14,
          padding: "14px 18px 16px",
          boxShadow: hot ? "0 10px 30px rgba(229,57,53,0.55), 0 0 0 4px rgba(229,57,53,0.6)" : "0 10px 26px rgba(0,0,0,0.55)",
          border: "3px solid #0f3f8a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT.black, fontWeight: 900, fontSize: 24, color: "#dbe9ff", letterSpacing: 2 }}>
          <svg width={28} height={28} viewBox="0 0 28 28">
            <circle cx={14} cy={14} r={12} fill="#fff" />
            <circle cx={10} cy={12} r={2.5} fill={C.ink} />
            <circle cx={18} cy={12} r={2.5} fill={C.ink} />
            <ellipse cx={14} cy={20} rx={4} ry={3} fill={C.ink} />
          </svg>
          СТРАХ
          <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: 5, background: "#0e2c63", border: "2px solid #9cc3ff" }} />
        </div>
        <div style={{ fontFamily: FONT.black, fontWeight: 900, fontSize: 84, color: "#fff", lineHeight: 1, marginTop: 4, textShadow: "0 4px 0 #0f3f8a" }}>{f.value}%</div>
        <div style={{ marginTop: 10, height: 18, borderRadius: 9, background: "#0e2c63", overflow: "hidden", border: "2px solid #0b2552" }}>
          <div style={{ width: `${bar}%`, height: "100%", background: barColor, borderRadius: 9 }} />
        </div>
      </div>
      <svg width={70} height={120} viewBox="0 0 70 120" style={{ position: "absolute", left: -18, top: -58 }}>
        <path d="M 22 110 L 22 20 Q 22 6 35 6 Q 48 6 48 20 L 48 90 Q 48 100 40 100 Q 32 100 32 90 L 32 30" fill="none" stroke="#c9ced8" strokeWidth={7} strokeLinecap="round" />
        <path d="M 22 110 L 22 20 Q 22 6 35 6 Q 48 6 48 20 L 48 90" fill="none" stroke="#8d94a3" strokeWidth={3} strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const SeriesTag: React.FC<{ visible: number }> = ({ visible }) =>
  visible > 0 ? (
    <div
      style={{
        position: "absolute",
        top: 176,
        left: 40,
        background: C.red,
        color: "#fff",
        fontFamily: FONT.black,
        fontWeight: 900,
        fontSize: 26,
        padding: "8px 18px",
        borderRadius: 10,
        letterSpacing: 1.5,
        opacity: visible,
        boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
      }}
    >
      ЛЕС ВАЛЕРЫ · СЕРИЯ 1
    </div>
  ) : null;

export const Hud: React.FC<{ hideSticker?: boolean }> = ({ hideSticker }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <TimePill />
    {!hideSticker ? <FearSticker /> : null}
  </AbsoluteFill>
);
