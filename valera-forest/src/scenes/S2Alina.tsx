import React from "react";
import { AbsoluteFill } from "remotion";
import { Squirrel } from "../characters/Creatures";
import { Bush, Forest } from "../env/Forest";
import { Badge, Hand, Icon, Phone, Polaroid, Pos, Stamp } from "../ui/Kit";
import { C, FONT } from "../theme";
import { ease, pop } from "../anim";
import { BlurForest, FaceCam, Hero, Onoma, ShotProps, WolfAt, cueF, hitF } from "./common";

export const S2Alina: React.FC<ShotProps> = ({ shot, f, dur, beat }) => {
  const p = f / dur;
  const h = hitF(beat);
  switch (shot) {
    case "artemShock":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={12} />
          <FaceCam who="artem" f={f} s={2.52} hy={640 + 60} emotion="shocked" look={0.8} />
        </AbsoluteFill>
      );
    case "alinaBadge":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={5} pan={0.3 - p * 0.4} />
          <Hero who="alina" x={540} y={1450} s={1.55} f={f} pose="pocket" emotion={p < 0.5 ? "neutral" : "sarcastic"} look={-0.3} />
          <Badge f={f} delay={h} title="АЛИНА" sub="САРКАЗМ" color={C.blue} icon={Icon.smirk} rot={3} />
        </AbsoluteFill>
      );
    case "twoShotPoint":
      return (
        <AbsoluteFill>
          <Forest frame={f} pan={0.3 - p * 0.3} />
          <Bush frame={f} shake={6} w={560} style={{ position: "absolute", left: 640, top: 820 }} />
          <Hero who="alina" x={260} y={1180} s={1.05} f={f} pose="pocket" emotion="eyeroll" />
          <Hero who="artem" x={600} y={1200} s={1.1} f={f} pose="point" emotion="panic" look={1} />
          <Onoma text="?!" x={880} y={700} f={f} delay={8} size={120} color={C.yellow} />
        </AbsoluteFill>
      );
    case "alinaSmirk":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={12} pan={0.4} />
          <FaceCam who="alina" f={f} s={2.44} hy={640 + 60} emotion={p < 0.45 ? "sarcastic" : "smug"} look={-0.4} />
        </AbsoluteFill>
      );
    case "maniacPolaroid":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={14} tint="rgba(0,0,0,0.35)" />
          <Polaroid f={f} caption="ЛЕСНОЙ МАНЬЯК?" captionColor={C.red} y={630} rot={4} from="left">
            <Forest frame={f} pan={0.2} />
            <Hero who="artem" x={380} y={760} s={1.1} f={f} pose="armsUp" emotion="panic" />
            <Bush frame={f} w={760} style={{ position: "absolute", left: 0, top: 470 }} />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ position: "absolute", left: 300 + i * 38, top: 100 + (i % 2) * 24, width: 44, height: 22, borderRadius: "50%", background: "#3c5a46", border: `4px solid ${C.ink}`, transform: `rotate(${i * 50}deg)` }} />
            ))}
          </Polaroid>
          <Stamp f={f} delay={h} text="ПОХОЖ" x={700} y={420} rot={12} size={110} />
        </AbsoluteFill>
      );
    case "phoneVideo": {
      const vt = Math.min(1, f / (dur - 10));
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={14} tint="rgba(0,0,0,0.4)" />
          <div style={{ position: "absolute", left: 230, top: 260, transform: "rotate(5deg)" }}>
            <Phone w={600} h={980} time="00:04">
              <div style={{ position: "absolute", inset: 0, background: "#000" }}>
                <div style={{ position: "absolute", left: 0, top: 90, width: 600, height: 620, overflow: "hidden" }}>
                  <div style={{ transform: "scale(0.56)", transformOrigin: "0 0", width: 1080, height: 1920, position: "absolute", top: -260, left: -24 }}>
                    <Forest frame={f} pan={0} />
                    {f < 30 ? (
                      <Hero who="artem" x={560} y={1150} s={1.1} f={f} pose="walk" emotion="scared" />
                    ) : (
                      <>
                        <Hero who="artem" x={400} y={1150} s={1.1} f={f} pose="armsUp" emotion="panic" />
                        <Pos x={800} y={1150} ox={260} oy={520} s={0.7}>
                          <Squirrel frame={f} size={0.7} />
                        </Pos>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ position: "absolute", left: 30, right: 30, top: 730, height: 10, borderRadius: 5, background: "#333" }}>
                  <div style={{ width: `${vt * 100}%`, height: "100%", background: C.red, borderRadius: 5 }} />
                </div>
                <div style={{ position: "absolute", left: 30, top: 770, fontFamily: FONT.black, fontWeight: 900, fontSize: 34, color: "#fff" }}>@alina_les</div>
                <div style={{ position: "absolute", left: 30, top: 816, fontFamily: FONT.black, fontWeight: 700, fontSize: 28, color: "#c9cbd3" }}>артём vs белка 😂😂😂</div>
                <div style={{ position: "absolute", right: 30, top: 770, fontFamily: FONT.black, fontWeight: 900, fontSize: 34, color: C.red }}>♥ {Math.round(120 + f * 11)}</div>
              </div>
            </Phone>
          </div>
          <Hand sleeve="#2b2f3d" style={{ left: 330, top: 960, transform: "rotate(5deg)" }} />
          <Onoma text="ХА-ХА" x={230} y={420} f={f} delay={cueF(beat, "laugh")} size={84} color={C.blue} rot={-12} />
        </AbsoluteFill>
      );
    }
    case "artemDelete":
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={12} tint="rgba(60,0,0,0.25)" />
          <FaceCam who="artem" f={f} s={2.61} hy={640 + 60} emotion="panic" tremble={3} />
        </AbsoluteFill>
      );
    case "sentStamp": {
      const bub = pop(f, cueF(beat, "ding"), 10, 200);
      return (
        <AbsoluteFill>
          <BlurForest f={f} blur={14} tint="rgba(0,0,0,0.4)" />
          <div style={{ position: "absolute", left: 240, top: 240, transform: "rotate(-4deg)" }}>
            <Phone w={600} h={980} time="00:05" light>
              <div style={{ position: "absolute", top: 70, left: 0, right: 0, height: 110, background: "#fff", borderBottom: "2px solid #e3e5ec", display: "flex", alignItems: "center", gap: 18, padding: "0 28px" }}>
                <div style={{ width: 70, height: 70, borderRadius: 35, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.black, fontWeight: 900, fontSize: 30 }}>12</div>
                <div>
                  <div style={{ fontFamily: FONT.black, fontWeight: 900, fontSize: 32, color: "#15161c" }}>ДРУЗЬЯ 🔥</div>
                  <div style={{ fontFamily: FONT.black, fontWeight: 700, fontSize: 24, color: "#6b7080" }}>12 участников</div>
                </div>
              </div>
              <div style={{ position: "absolute", right: 24, top: 260, width: 380, transform: `scale(${bub})`, transformOrigin: "100% 0" }}>
                <div style={{ background: C.blue, borderRadius: "28px 28px 6px 28px", padding: 14 }}>
                  <div style={{ height: 220, borderRadius: 18, background: "#0d1426", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, color: "#fff" }}>▶</div>
                  <div style={{ fontFamily: FONT.black, fontWeight: 800, fontSize: 28, color: "#fff", marginTop: 10 }}>смотрите кто испугался белки 😂</div>
                  <div style={{ fontFamily: FONT.black, fontWeight: 700, fontSize: 22, color: "#cfe0ff", textAlign: "right" }}>00:05 ✓✓</div>
                </div>
              </div>
              <div style={{ position: "absolute", left: 24, top: 640, width: 300, transform: `scale(${pop(f, cueF(beat, "ding") + 14, 10, 200)})`, transformOrigin: "0 0" }}>
                <div style={{ background: "#fff", borderRadius: "28px 28px 28px 6px", padding: "14px 20px", fontFamily: FONT.black, fontWeight: 800, fontSize: 28, color: "#15161c", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  АХАХАХ 💀💀
                </div>
              </div>
            </Phone>
          </div>
          <Stamp f={f} delay={h} text="ОТПРАВЛЕНО" x={540} y={880} rot={-10} size={74} />
        </AbsoluteFill>
      );
    }
    case "howlFreeze":
      return (
        <AbsoluteFill>
          <Forest frame={f} pan={0} moonY={420} />
          <WolfAt x={790} y={520} s={0.3} f={f} pose="howl" flip />
          <Onoma text="АУУУУУ!" x={540} y={600} f={f} delay={h} size={130} color="#dfe6ff" rot={-5} />
          <Hero who="alina" x={330} y={1200} s={1.1} f={f} emotion="shocked" look={0.6} />
          <Hero who="artem" x={720} y={1210} s={1.1} f={f} emotion="panic" tremble={4} look={0.4} />
        </AbsoluteFill>
      );
    case "walkTogether": {
      const x = ease(f, 0, 1, 0, dur);
      return (
        <AbsoluteFill>
          <Forest frame={f} pan={0.6 - p * 1.2} />
          <Hero who="alina" x={300 + x * 260} y={1100} s={0.72} f={f} pose="walk" emotion="neutral" />
          <Hero who="artem" x={170 + x * 260} y={1130} s={0.72} f={f + 9} pose="walk" emotion="scared" look={-0.8} tremble={1.5} />
          <Bush frame={f} w={700} style={{ position: "absolute", left: 620, top: 1060 }} />
        </AbsoluteFill>
      );
    }
    default:
      return null;
  }
};
