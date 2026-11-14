import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, SPEAKERS, Speaker, TIMELINE, TimedBeat, WORDS_PER_SEC, T } from "../scenes";
import { FONT } from "../theme";
import { jitter, pop } from "../anim";

type Word = { text: string; key: boolean; counts: boolean };
type Chunk = { words: Word[]; start: number; end: number };

const SUB_Y = 1170;

export const parseWords = (text: string): Word[] => {
  const out: Word[] = [];
  let inKey = false;
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    let w = raw;
    let key = inKey;
    if (w.startsWith("*")) {
      key = true;
      inKey = true;
      w = w.slice(1);
    }
    if (w.endsWith("*")) {
      w = w.slice(0, -1);
      inKey = false;
    }
    out.push({ text: w, key, counts: /[\p{L}\d]/u.test(w) });
  }
  return out;
};

export const chunkLine = (b: TimedBeat): Chunk[] => {
  const words = parseWords(b.line!.text);
  const groups: Word[][] = [];
  let cur: Word[] = [];
  const len = (g: Word[]) => g.reduce((a, w) => a + w.text.length + 1, 0);
  words.forEach((w) => {
    if (!w.counts && cur.length) {
      cur.push(w);
      return;
    }
    const counted = cur.filter((x) => x.counts).length;
    if (cur.length && (counted >= 3 || len(cur) + w.text.length > 15)) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
    if (/[.,!?…—»]$/.test(w.text)) {
      groups.push(cur);
      cur = [];
    }
  });
  if (cur.length) groups.push(cur);
  const perWord = FPS / WORDS_PER_SEC;
  let idx = 0;
  const chunks: Chunk[] = groups.map((g) => {
    const start = b.lineFrom + Math.round(idx * perWord);
    idx += g.filter((w) => w.counts).length;
    return { words: g, start, end: 0 };
  });
  chunks.forEach((c, i) => {
    c.end = i < chunks.length - 1 ? chunks[i + 1].start : b.from + b.frames - 1;
  });
  return chunks;
};

const LINES = TIMELINE.filter((b) => b.line).map((b) => ({ beat: b, chunks: chunkLine(b) }));

const isCaps = (t: string) => {
  const letters = t.replace(/[^\p{L}]/gu, "");
  return letters.length > 0 && letters === letters.toUpperCase();
};

const Waves: React.FC<{ frame: number; side: 1 | -1; color: string }> = ({ frame, side, color }) => (
  <svg width={150} height={160} viewBox="0 0 150 160" style={{ position: "absolute", top: -30, [side === -1 ? "left" : "right"]: -150, transform: side === -1 ? "scaleX(-1)" : undefined } as React.CSSProperties}>
    {[0, 1, 2].map((i) => {
      let d = "";
      for (let x = 0; x <= 120; x += 6) {
        const y = 40 + i * 38 + Math.sin(x * 0.12 + frame * 0.5 + i * 1.7) * (10 + i * 3);
        d += `${x === 0 ? "M" : "L"} ${x + 20} ${y} `;
      }
      return <path key={i} d={d} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85 - i * 0.2} />;
    })}
  </svg>
);

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const active = LINES.find((l) => frame >= l.beat.lineFrom && frame < l.beat.from + l.beat.frames);
  if (!active) return null;
  const chunk = active.chunks.find((c) => frame >= c.start && frame < c.end) ?? (frame >= active.chunks[active.chunks.length - 1].start ? active.chunks[active.chunks.length - 1] : null);
  const line = active.beat.line!;
  const who: Speaker = line.who;
  const sp = SPEAKERS[who];
  const name = line.name ?? sp.name;
  const evil = who === "monster" || who === "voice";
  const caps = isCaps(line.text);
  const tagPop = pop(frame - active.beat.lineFrom, 0, 11, 200);
  const tagEl = (
    <div
      style={{
        position: "absolute",
        top: SUB_Y - 118,
        left: "50%",
        transform: `translateX(-50%) scale(${tagPop}) rotate(-2deg)`,
        background: sp.tag,
        color: sp.tagText,
        fontFamily: FONT.black,
        fontWeight: 900,
        fontSize: 30,
        letterSpacing: 2,
        padding: "6px 18px",
        borderRadius: 10,
        boxShadow: "0 6px 0 rgba(0,0,0,0.45)",
        border: evil ? "3px solid #e53935" : "3px solid rgba(0,0,0,0.25)",
      }}
    >
      {name}
    </div>
  );
  if (!chunk) return <AbsoluteFill>{tagEl}</AbsoluteFill>;
  const local = frame - chunk.start;
  const p = pop(local, 0, 8, 260);
  const scale = 0.55 + 0.45 * p;
  const text = chunk.words.map((w) => w.text).join(" ");
  const chars = text.length;
  const base = caps ? 132 : 108;
  const size = Math.min(base, 960 / (chars * 0.74));
  const shakeAmp = caps ? Math.max(3, 14 * Math.max(0, 1 - local / (T.subtitlePop * FPS * 2))) : 0;
  const sx = shakeAmp ? jitter(frame, 5, shakeAmp) : 0;
  const sy = shakeAmp ? jitter(frame, 6, shakeAmp * 0.6) : 0;
  const rot = caps ? jitter(Math.floor(frame / 2), 7, 1.5) : 0;
  return (
    <AbsoluteFill>
      {tagEl}
      <div
        style={{
          position: "absolute",
          top: SUB_Y,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "center",
          transform: `translate(${sx}px, ${sy - size / 2}px) scale(${scale}) rotate(${rot}deg)`,
        }}
      >
        <div style={{ position: "relative", whiteSpace: "nowrap" }}>
          {evil ? <Waves frame={frame} side={-1} color="#b3161b" /> : null}
          {evil ? <Waves frame={frame} side={1} color="#b3161b" /> : null}
          {chunk.words.map((w, i) => {
            const color = w.key ? sp.color : evil ? "#7a0f13" : "#d3d6de";
            const wy = evil ? jitter(frame + i * 7, 9, 5) : 0;
            const shadow = evil
              ? `3px 0 0 rgba(0,255,255,0.35), -3px 0 0 rgba(255,0,60,0.6), 0 6px 0 #000, 0 0 24px rgba(229,57,53,0.7), 0 0 4px #000`
              : who === "artem" && w.key
                ? "0 7px 0 rgba(0,0,0,0.75), 0 0 26px rgba(255,255,255,0.45), 0 0 4px #000"
                : "0 7px 0 rgba(0,0,0,0.75), 0 0 18px rgba(0,0,0,0.8), 0 0 4px #000";
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontFamily: FONT.black,
                  fontWeight: 900,
                  fontSize: size,
                  lineHeight: 1,
                  color,
                  textTransform: "uppercase",
                  letterSpacing: -1,
                  textShadow: shadow,
                  marginRight: i < chunk.words.length - 1 ? size * 0.25 : 0,
                  transform: `translateY(${wy}px) skewX(${evil ? jitter(frame, i + 3, 4) : 0}deg)`,
                  WebkitTextStroke: evil && w.key ? "2px #ff8a80" : undefined,
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

