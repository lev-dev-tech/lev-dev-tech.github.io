import React from "react";
import { AbsoluteFill } from "remotion";
import { Forest, Smoke, Stump } from "../env/Forest";
import { Hand, Phone, Pos } from "../ui/Kit";
import { C, FONT } from "../theme";
import { ease, pop } from "../anim";
import { T } from "../scenes";
import { BlurForest, Burst, FaceCam, Hero, Onoma, ShotProps, WolfAt, hitF } from "./common";

const Paper: React.FC<{ f: number; stampAt: number; w?: number }> = ({ f, stampAt, w = 820 }) => {
  const s = f >= stampAt ? (f - stampAt < 4 ? ease(f - stampAt, 2.4, 1, 0, 4) : 1) : 0;
  return (
    <div style={{ width: w, height: w * 1.25, background: "#f6f2e6", borderRadius: 6, boxShadow: "0 30px 60px rgba(0,0,0,0.5)", position: "relative", padding: "60px 60px", boxSizing: "border-box", fontFamily: FONT.black, color: "#1d1d22" }}>
      <div style={{ position: "absolute", inset: 18, border: "3px solid #c9bfa6" }} />
      <div style={{ fontWeight: 900, fontSize: 34, color: "#7b725e", textAlign: "center", letterSpacing: 6 }}>ПРИКАЗ № 1</div>
      <div style={{ fontWeight: 900, fontSize: 70, textAlign: "center", lineHeight: 1.05, marginTop: 30, color: C.red }}>ПОСЕЩЕНИЕ ЛЕСА ЗАПРЕЩЕНО</div>
      <div style={{ height: 6, background: "#1d1d22", margin: "34px 0" }} />
      {["Совсем.", "Даже днём.", "Даже за грибами.", "Даже «просто погулять»."].map((t, i) => (
        <div key={i} style={{ fontWeight: 700, fontSize: 40, marginBottom: 12 }}>
          {i + 1}. {t}
        </div>
      ))}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 90 }}>
        <div style={{ fontWeight: 800, fontSize: 30, color: "#7b725e" }}>ПОДПИСЬ:</div>
        <div style={{ fontWeight: 900, fontSize: 40, lineHeight: 1.1 }}>ВАЛЕРА, ХРАНИТЕЛЬ ЛЕСА НАХУЙ</div>
        <svg width={320} height={90} viewBox="0 0 320 90" style={{ marginTop: 6 }}>
          <path
            d="M 10 60 C 40 10 60 80 90 40 S 130 10 150 50 S 200 80 220 30 S 280 60 310 20"
            stroke="#1e3e9a"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={600}
            strokeDashoffset={600 * (1 - ease(f, 0, 1, 10, stampAt - 6))}
          />
        </svg>
      </div>
      {s > 0 ? (
        <div style={{ position: "absolute", right: 50, top: 400, width: 240, height: 240, borderRadius: 130, border: `10px solid ${C.red}`, transform: `scale(${s}) rotate(-14deg)`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: C.red, fontFamily: FONT.russo, fontSize: 34, lineHeight: 1.1, opacity: 0.88 }}>
          <div style={{ position: "absolute", inset: 14, borderRadius: 120, border: `4px solid ${C.red}` }} />
          ХРАНИТЕЛЬ
          <br />
          ЛЕСА
          <br />
          🐺
        </div>
      ) : null}
    </div>
  );
};

export const S6Ending: React.FC<ShotProps> = ({ shot, f, dur, beat }) => {
  const p = f / dur;
  const h = hitF(beat);
  switch (shot) {
    case "morningWalk":
      return (
        <AbsoluteFill>
          <Forest frame={f} mood="morning" pan={0.4 - p * 0.8} />
          <Hero who="alina" x={420 + p * 160} y={1150} s={0.8} f={f} pose="walk" emotion="tired" />
          <Hero who="artem" x={620 + p * 160} y={1170} s={0.8} f={f + 7} pose="walk" emotion="tired" dirty />
        </AbsoluteFill>
      );
    case "artemNever":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="morning" blur={6} />
          <Hero who="artem" x={540} y={1450} s={1.55} f={f} emotion={p < 0.5 ? "tired" : "serious"} dirty pose={p < 0.5 ? "stand" : "fist"} />
        </AbsoluteFill>
      );
    case "alinaAgree":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="morning" blur={12} />
          <FaceCam who="alina" f={f} s={2.44} hy={640 + 60} emotion={f % 24 < 8 ? "blink" : "tired"} lookY={f % 24 < 8 ? 0.6 : 0} />
        </AbsoluteFill>
      );
    case "valeraPeek": {
      const out = pop(f, h, 10, 180);
      return (
        <AbsoluteFill>
          <Forest frame={f} mood="morning" pan={0} />
          <Hero who="valera" x={760 + out * 120} y={1280} s={1.3} f={f} emotion="smug" pose="paper" />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <path d="M 560 -100 L 780 -100 Q 800 600 790 1500 L 560 1500 Q 580 600 560 -100 Z" fill="#4a3a2a" stroke={C.ink} strokeWidth={8} />
            <path d="M 620 200 Q 640 500 625 800 M 700 400 Q 720 700 705 1000" stroke="#33261a" strokeWidth={8} fill="none" />
          </svg>
          <Hero who="alina" x={180} y={1300} s={0.9} f={f} emotion="shocked" look={1} />
          <Hero who="artem" x={380} y={1310} s={0.9} f={f} emotion="panic" look={1} tremble={3} />
        </AbsoluteFill>
      );
    }
    case "document":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="morning" blur={14} tint="rgba(0,0,0,0.25)" />
          <div style={{ position: "absolute", left: 130, top: 250, transform: `rotate(-3deg) translateY(${(1 - pop(f, 0, 12, 140)) * 900}px)` }}>
            <Paper f={f} stampAt={h} />
          </div>
        </AbsoluteFill>
      );
    case "alinaPrinted":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="morning" blur={6} />
          <Hero who="alina" x={600} y={1450} s={1.55} f={f} pose="pocket" emotion="eyeroll" />
          <div style={{ position: "absolute", left: 60, top: 340, transform: `rotate(-10deg) scale(${0.42 * pop(f, 0, 10, 160)})`, transformOrigin: "0 0" }}>
            <Paper f={200} stampAt={0} />
          </div>
        </AbsoluteFill>
      );
    case "valeraProud":
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="morning" blur={12} />
          <FaceCam who="valera" f={f} s={2.44} hy={640 + 60} emotion={p < 0.5 ? "smug" : "tired"} />
        </AbsoluteFill>
      );
    case "growlRun": {
      const wolf = f >= h - 6;
      const run = ease(f, 0, 1, h, dur);
      return (
        <AbsoluteFill>
          <Forest frame={f} mood="morning" pan={0} />
          {wolf ? <WolfAt x={680} y={1230} s={0.95} f={f} pose="growl" /> : <Hero who="valera" x={760} y={1250} s={1.1} f={f} emotion="angry" redEyes />}
          {f < h + 10 ? (
            <Pos x={760} y={1000} ox={500} oy={500} s={1.2}>
              <Smoke progress={ease(f, 0, 1, 4, h + 10)} size={1.2} />
            </Pos>
          ) : null}
          <Hero who="artem" x={340 - run * 700} y={1260} s={0.95} f={f} pose={f < h ? "stand" : "run"} emotion="panic" flip />
          <Hero who="alina" x={180 - run * 700} y={1250} s={0.95} f={f + 4} pose={f < h ? "stand" : "run"} emotion="scared" flip />
          {f >= h ? (
            <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
              {[0, 1, 2, 3].map((i) => (
                <circle key={i} cx={420 - run * 700 + i * 50} cy={1250 - i * 10} r={30 + i * 12 + ((f + i * 5) % 10)} fill="#d8c8a6" opacity={0.6 - i * 0.12} />
              ))}
            </svg>
          ) : null}
          <Onoma text="РРРР!" x={780} y={600} f={f} delay={h} size={130} color={C.red} rot={6} />
        </AbsoluteFill>
      );
    }
    case "stumpPhone":
      return (
        <AbsoluteFill>
          <Forest frame={f} mood="morning" pan={0.2 - p * 0.3} />
          <Pos x={540} y={1300} ox={180} oy={160} s={1.2}>
            <Stump w={360 * 1.2} />
          </Pos>
          <Hero who="valera" x={540} y={1180} s={1.2} f={f} pose="sit" emotion={p < 0.5 ? "blink" : "smug"} />
          <div style={{ position: "absolute", left: 470, top: 860, width: 90, height: 150, borderRadius: 16, background: "#1b1e27", border: `6px solid ${C.ink}`, transform: "rotate(-8deg)" }}>
            <div style={{ position: "absolute", inset: 8, borderRadius: 8, background: "#7fb8ff" }} />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 200 + i * 300, top: 420 + Math.sin(f * 0.1 + i) * 20, fontSize: 50 }}>🐦</div>
          ))}
        </AbsoluteFill>
      );
    case "message": {
      const at = Math.round(T.messageAt * 30);
      const n = pop(f, at, 10, 200);
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="morning" blur={14} tint="rgba(0,0,0,0.2)" />
          <div style={{ position: "absolute", left: 240, top: 260, transform: "rotate(-4deg)" }}>
            <Phone w={600} h={980} time="06:41">
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#2b6b3a,#18301f)" }}>
                <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: FONT.black, fontWeight: 900, fontSize: 40, color: "#fff" }}>🌲 ЛЕСНАЯ ФЕРМА 🌲</div>
                <div style={{ position: "absolute", top: 220, left: 60, right: 60, height: 360, borderRadius: 30, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 140 }}>🍄</div>
              </div>
              <div style={{ position: "absolute", top: 80, left: 20, right: 20, transform: `translateY(${(1 - n) * -260}px)`, background: "rgba(245,246,250,0.97)", borderRadius: 30, padding: "20px 24px", boxShadow: "0 16px 30px rgba(0,0,0,0.4)", zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 32, background: C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.black, fontWeight: 900, fontSize: 32 }}>А</div>
                  <div style={{ fontFamily: FONT.black, fontWeight: 900, fontSize: 32, color: "#15161c" }}>Алина 💙</div>
                  <div style={{ marginLeft: "auto", fontFamily: FONT.black, fontWeight: 700, fontSize: 24, color: "#7b8090" }}>сейчас</div>
                </div>
                <div style={{ fontFamily: FONT.black, fontWeight: 800, fontSize: 38, color: "#15161c", marginTop: 12, lineHeight: 1.15 }}>Завтра снова придём гулять 😈</div>
              </div>
            </Phone>
          </div>
          <Hand sleeve="#2e4a3a" style={{ left: 340, top: 960, transform: "rotate(-4deg)" }} />
        </AbsoluteFill>
      );
    }
    case "valeraLookUp": {
      const up = ease(f, 1, 0, 0, dur - 10);
      return (
        <AbsoluteFill>
          <BlurForest f={f} mood="morning" blur={12} />
          <FaceCam who="valera" f={f} s={2.9} hy={660 + up * 60} emotion={up > 0.15 ? "neutral" : "shocked"} lookY={up * 1.5} />
        </AbsoluteFill>
      );
    }
    case "valeraWhat":
      return (
        <AbsoluteFill>
          <Burst f={f} color="#f5b81c" color2="#e0901a" />
          <FaceCam who="valera" f={f} s={2.78} hy={660 + 60} emotion="shocked" tremble={3} />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ position: "absolute", left: 140 + i * 230 + f * (i % 2 ? 6 : -6), top: 300 - f * 8 - i * 30, fontSize: 60 }}>🐦</div>
          ))}
          <Onoma text="!!!" x={220} y={440} f={f} delay={0} size={140} color={C.red} rot={10} />
        </AbsoluteFill>
      );
    default:
      return null;
  }
};
