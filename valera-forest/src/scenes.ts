export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const WORDS_PER_SEC = 3;
export const LINE_PAD = 0.5;
export const REACTION_HOLD = 0.45;
export const MIN_BEAT = 1.6;
export const TRANSITION_FRAMES = 7;
export const CLOCK_MINUTE_EVERY = 6;

export type Speaker = "artem" | "alina" | "valera" | "monster" | "voice";
export type Transition = "cut" | "whip" | "whipUp" | "flash" | "zoom";
export type SceneId = "intro" | "forest" | "alina" | "valera" | "secret" | "battle" | "ending" | "after" | "finale";

export type Cue = { s: string; at?: number; vol?: number };

export type Line = {
  who: Speaker;
  text: string;
  name?: string;
  at?: number;
};

export type Beat = {
  shot: string;
  line?: Line;
  dur?: number;
  tr?: Transition;
  sfx?: Cue[];
  fear?: number;
  clock?: [string, string];
  hit?: number;
  shake?: number;
};

export type SceneDef = { id: SceneId; ambient: "night" | "tension" | "morning" | "room" | "none"; beats: Beat[] };

export const SPEAKERS: Record<Speaker, { name: string; color: string; tag: string; tagText: string }> = {
  artem: { name: "АРТЁМ", color: "#ffffff", tag: "#f2f2f5", tagText: "#15161c" },
  alina: { name: "АЛИНА", color: "#3d8bff", tag: "#1e6fd9", tagText: "#ffffff" },
  valera: { name: "ВАЛЕРА", color: "#ff4a45", tag: "#e53935", tagText: "#ffffff" },
  monster: { name: "ЧУДОВИЩЕ", color: "#b3161b", tag: "#6d0d10", tagText: "#ffd6d6" },
  voice: { name: "ГОЛОС", color: "#b3161b", tag: "#6d0d10", tagText: "#ffd6d6" },
};

export const SCENES: SceneDef[] = [
  {
    id: "intro",
    ambient: "night",
    beats: [
      { shot: "title", dur: 3.6, tr: "cut", hit: 1.1, shake: 18, clock: ["НОЧЬ", "23:47"], fear: 5, sfx: [{ s: "howl", at: 0, vol: 0.35 }, { s: "hit", at: 1.1 }] },
    ],
  },
  {
    id: "forest",
    ambient: "night",
    beats: [
      { shot: "walkWide", dur: 3.2, tr: "flash", fear: 10, sfx: [{ s: "creak", at: 0.3, vol: 0.8 }, { s: "whoosh", at: 0, vol: 0.4 }] },
      { shot: "badgeArtem", dur: 2.6, tr: "whip", fear: 15, hit: 0.3, sfx: [{ s: "whoosh", at: 0 }, { s: "pop", at: 0.3 }] },
      { shot: "artemClose", tr: "cut", line: { who: "artem", text: "Так, *нахрена* я вообще сюда *попёрся?*" } },
      { shot: "bushVoice", tr: "whip", fear: 35, line: { who: "voice", name: "КУСТЫ", text: "*ТЫРЫ-ПЫРЫ…* *РАСТОПЫРЫ…*", at: 0.4 }, sfx: [{ s: "rustle", at: 0 }, { s: "whisper", at: 0.4 }] },
      { shot: "thought", dur: 2.4, tr: "cut", fear: 45, sfx: [{ s: "rustle", at: 0.5, vol: 0.6 }] },
      { shot: "fall", dur: 2.2, tr: "whip", fear: 55, hit: 0.5, shake: 14, sfx: [{ s: "whoosh", at: 0.2 }, { s: "thud", at: 0.5 }, { s: "rustle", at: 0.55 }] },
      { shot: "squirrel", dur: 1.7, tr: "zoom", fear: 72, hit: 0, shake: 26, sfx: [{ s: "screech", at: 0 }, { s: "hit", at: 0, vol: 0.7 }] },
      { shot: "squirrelPolaroid", tr: "cut", hit: 0.1, shake: 16, line: { who: "artem", text: "ДАЖЕ *БЕЛКА* ТУТ *ЕБАНУТАЯ!*" }, sfx: [{ s: "whoosh", at: 0 }, { s: "screech", at: 1.2, vol: 0.35 }] },
      { shot: "howl", dur: 3.2, tr: "flash", fear: 86, hit: 0.3, shake: 12, sfx: [{ s: "howl", at: 0.1 }] },
      { shot: "phoneOff", dur: 2.6, tr: "whip", fear: 90, hit: 1.2, sfx: [{ s: "powerOff", at: 1.1 }] },
      { shot: "artemDoom", tr: "cut", line: { who: "artem", text: "Всё, *пиздец.* Я отсюда *не выйду…*" } },
      { shot: "fogAlina", dur: 3.0, tr: "flash", clock: ["НОЧЬ", "23:58"], sfx: [{ s: "whoosh", at: 0.6, vol: 0.5 }, { s: "creak", at: 0, vol: 0.4 }] },
    ],
  },
  {
    id: "alina",
    ambient: "night",
    beats: [
      { shot: "artemShock", tr: "zoom", hit: 0, shake: 14, fear: 92, line: { who: "artem", text: "*АЛИНА?!* ЧТО ТЫ ТУТ *ДЕЛАЕШЬ?!*" } },
      { shot: "alinaBadge", tr: "whip", fear: 60, hit: 0.2, line: { who: "alina", text: "*Гуляю.* А ты чего *орёшь?*", at: 0.3 }, sfx: [{ s: "pop", at: 0.2 }] },
      { shot: "twoShotPoint", tr: "cut", fear: 65, line: { who: "artem", text: "ТУТ КТО-ТО *СТРАННЫЕ ЗВУКИ* ИЗДАЁТ!" }, sfx: [{ s: "rustle", at: 1.6, vol: 0.4 }] },
      { shot: "alinaSmirk", tr: "whip", line: { who: "alina", text: "Может, это *ты?*" } },
      { shot: "maniacPolaroid", tr: "flash", hit: 1.2, shake: 10, line: { who: "artem", text: "ДА Я ТЕБЕ ПОХОЖ НА *ЛЕСНОГО МАНЬЯКА?!*" }, sfx: [{ s: "whoosh", at: 0 }, { s: "hit", at: 1.2, vol: 0.6 }] },
      { shot: "phoneVideo", dur: 3.4, tr: "whipUp", fear: 70, sfx: [{ s: "whoosh", at: 0 }, { s: "screech", at: 1.0, vol: 0.3 }, { s: "laugh", at: 1.6, vol: 0.5 }] },
      { shot: "artemDelete", tr: "zoom", hit: 0, shake: 18, line: { who: "artem", text: "*УДАЛИ ЭТО!*" } },
      { shot: "sentStamp", tr: "cut", hit: 1.3, shake: 14, line: { who: "alina", text: "Уже *отправила* друзьям." }, sfx: [{ s: "ding", at: 0.6 }, { s: "hit", at: 1.3 }] },
      { shot: "howlFreeze", dur: 3.0, tr: "flash", fear: 88, hit: 0.2, shake: 10, sfx: [{ s: "howl", at: 0 }] },
      { shot: "walkTogether", dur: 3.0, tr: "whip", clock: ["НОЧЬ", "00:13"], sfx: [{ s: "creak", at: 0.5, vol: 0.6 }, { s: "rustle", at: 2.2, vol: 0.5 }] },
    ],
  },
  {
    id: "valera",
    ambient: "tension",
    beats: [
      { shot: "wolfBurst", dur: 1.9, tr: "zoom", fear: 100, hit: 0, shake: 30, sfx: [{ s: "hit", at: 0 }, { s: "growl", at: 0 }, { s: "rustle", at: 0 }] },
      { shot: "wolfApproach", dur: 3.2, tr: "cut", fear: 100, sfx: [{ s: "growl", at: 0.2, vol: 0.9 }] },
      { shot: "artemCry", tr: "whip", line: { who: "artem", text: "Алин, если *выживем,* я больше *никогда* не выйду из дома." }, sfx: [{ s: "growl", at: 0.5, vol: 0.4 }] },
      { shot: "wolfPounce", dur: 1.6, tr: "cut", hit: 0.9, shake: 16, sfx: [{ s: "growl", at: 0 }, { s: "poof", at: 0.8 }] },
      { shot: "smoke", dur: 2.6, tr: "flash", fear: 60, sfx: [{ s: "poof", at: 0, vol: 0.6 }, { s: "pop", at: 1.6 }] },
      { shot: "valeraIntro", tr: "cut", line: { who: "valera", text: "Не бойтесь. Я *Валера,* *хранитель леса* нахуй." } },
      { shot: "artemWhat", tr: "zoom", hit: 0, shake: 8, line: { who: "artem", text: "*Чего?!*" } },
      { shot: "valeraThreat", tr: "flash", fear: 85, hit: 1.2, shake: 22, line: { who: "valera", text: "ЕЩЁ РАЗ СЮДА ЗАЙДЁТЕ — *УБЬЮ ВАС ВСЕХ* НАХУЙ!" }, sfx: [{ s: "growl", at: 0, vol: 0.5 }, { s: "hit", at: 1.2 }] },
      { shot: "alinaProtest", tr: "whip", line: { who: "alina", text: "Мы просто *гуляем!*" } },
      { shot: "valeraDontCare", tr: "zoom", hit: 0.3, shake: 18, line: { who: "valera", text: "А МНЕ *ПОХУЙ!*" }, sfx: [{ s: "hit", at: 0.3 }] },
      { shot: "quake", dur: 2.6, tr: "cut", fear: 80, hit: 0, shake: 40, sfx: [{ s: "rumble", at: 0 }] },
      { shot: "voice", tr: "flash", fear: 88, line: { who: "voice", text: "Хранитель… твоя *защита слабеет…*", at: 0.3 }, sfx: [{ s: "demon", at: 0.2 }, { s: "rumble", at: 0, vol: 0.4 }] },
      { shot: "valeraSerious", tr: "whip", clock: ["НОЧЬ", "00:31"], line: { who: "valera", text: "*Блять…* Только не *сейчас.*" } },
    ],
  },
  {
    id: "secret",
    ambient: "tension",
    beats: [
      { shot: "fact1", tr: "whip", fear: 85, line: { who: "valera", text: "Под лесом запечатано *древнее чудовище.*" }, sfx: [{ s: "whoosh", at: 0 }, { s: "check", at: 2.2 }] },
      { shot: "fact2", tr: "cut", fear: 88, line: { who: "valera", text: "Оно *жрёт страх.*" }, sfx: [{ s: "whoosh", at: 0 }, { s: "check", at: 1.3 }] },
      { shot: "fact3", tr: "cut", line: { who: "valera", text: "Печать *рушится.* Не восстановим — *лесу конец.*" }, sfx: [{ s: "whoosh", at: 0 }, { s: "rumble", at: 0.4, vol: 0.4 }, { s: "check", at: 2.6 }] },
      { shot: "alinaWhy", tr: "whip", line: { who: "alina", text: "А мы тут *при чём?*" } },
      { shot: "valeraBlame", tr: "cut", fear: 95, hit: 2.2, shake: 10, line: { who: "valera", text: "Потому что вы притащили сюда *столько страха,* что оно уже *просыпается!*" }, sfx: [{ s: "rumble", at: 2.0, vol: 0.5 }] },
      { shot: "artemGuilty", tr: "zoom", line: { who: "artem", text: "То есть я *сам виноват?!*" } },
      { shot: "dishStamp", tr: "flash", hit: 1.4, shake: 22, line: { who: "valera", text: "ПОЗДРАВЛЯЮ, ТЫ ЕГО *ЛЮБИМОЕ БЛЮДО!*" }, sfx: [{ s: "whoosh", at: 0 }, { s: "hit", at: 1.4 }] },
      { shot: "route", dur: 3.2, tr: "whipUp", clock: ["НОЧЬ", "01:10"], sfx: [{ s: "whoosh", at: 0 }, { s: "pop", at: 2.4 }] },
      { shot: "sanctuary", dur: 2.8, tr: "flash", sfx: [{ s: "chime", at: 0.4, vol: 0.6 }] },
    ],
  },
  {
    id: "battle",
    ambient: "tension",
    beats: [
      { shot: "vortex", dur: 3.0, tr: "cut", fear: 95, hit: 0.2, shake: 12, sfx: [{ s: "rumble", at: 0 }, { s: "riser", at: 0.4 }] },
      { shot: "monsterReveal", dur: 2.2, tr: "zoom", fear: 100, hit: 0, shake: 34, sfx: [{ s: "hit", at: 0 }, { s: "demon", at: 0.2 }] },
      { shot: "monsterTalk", tr: "cut", hit: 0.3, shake: 16, line: { who: "monster", text: "ХРАНИТЕЛЬ, ТЫ НЕ *ОСТАНОВИШЬ МЕНЯ!*" }, sfx: [{ s: "demon", at: 0 }] },
      { shot: "valeraTransform", dur: 2.6, tr: "flash", hit: 1.2, shake: 20, sfx: [{ s: "poof", at: 0.5 }, { s: "growl", at: 1.2 }, { s: "hit", at: 1.2, vol: 0.6 }] },
      { shot: "wolfCommand", tr: "whip", hit: 0.2, shake: 10, line: { who: "valera", text: "*АРТЁМ!* *АЛИНА!* РАЗБЕЙТЕ *КРИСТАЛЛЫ* ВОКРУГ СВЯТИЛИЩА!" }, sfx: [{ s: "growl", at: 2.5, vol: 0.5 }] },
      { shot: "alinaSmash", dur: 2.6, tr: "whip", hit: 1.0, shake: 20, sfx: [{ s: "whoosh", at: 0.6 }, { s: "shatter", at: 1.0 }, { s: "check", at: 1.6 }] },
      { shot: "artemFear", dur: 3.0, tr: "cut", fear: 100, sfx: [{ s: "demon", at: 0.6, vol: 0.4 }] },
      { shot: "artemBrave", tr: "zoom", fear: 40, hit: 0.2, shake: 12, line: { who: "artem", text: "Да пошло ты *нахрен!*" } },
      { shot: "artemSmash", dur: 2.4, tr: "whip", fear: 25, hit: 0.7, shake: 30, sfx: [{ s: "whoosh", at: 0.4 }, { s: "shatter", at: 0.7 }, { s: "chime", at: 0.9 }] },
      { shot: "sealFlash", dur: 2.2, tr: "flash", fear: 20, sfx: [{ s: "chime", at: 0 }, { s: "demon", at: 0.5, vol: 0.5 }] },
      { shot: "finalStrike", tr: "whip", hit: 1.6, shake: 34, line: { who: "valera", text: "ЭТО ТЕБЕ ЗА *МОИ ДЕРЕВЬЯ,* *СУКА!*" }, sfx: [{ s: "growl", at: 0 }, { s: "hit", at: 1.6 }, { s: "poof", at: 1.7 }] },
      { shot: "victory", dur: 2.6, tr: "flash", fear: 0, hit: 0.4, shake: 18, clock: ["НОЧЬ", "04:30"], sfx: [{ s: "hit", at: 0.4 }, { s: "victory", at: 0.5 }] },
      { shot: "alinaWin", tr: "cut", fear: 0, line: { who: "alina", text: "Мы *победили!*" } },
      { shot: "valeraTired", tr: "whip", line: { who: "valera", text: "Кто это *«мы»?!* Я тут чуть *не сдох!*" } },
    ],
  },
  {
    id: "ending",
    ambient: "morning",
    beats: [
      { shot: "morningWalk", dur: 3.0, tr: "flash", fear: 0, clock: ["УТРО", "06:12"], sfx: [{ s: "whoosh", at: 0, vol: 0.4 }] },
      { shot: "artemNever", tr: "cut", line: { who: "artem", text: "Всё. Больше *никогда в жизни* не пойду в лес." } },
      { shot: "alinaAgree", tr: "whip", line: { who: "alina", text: "*Согласна.*" } },
      { shot: "valeraPeek", dur: 2.0, tr: "zoom", fear: 30, hit: 0.3, shake: 10, sfx: [{ s: "rustle", at: 0 }, { s: "pop", at: 0.3 }] },
      { shot: "document", dur: 3.8, tr: "whipUp", hit: 2.2, shake: 16, sfx: [{ s: "whoosh", at: 0 }, { s: "hit", at: 2.2 }] },
      { shot: "alinaPrinted", tr: "cut", line: { who: "alina", text: "Ты серьёзно это *распечатал?*" } },
      { shot: "valeraProud", tr: "whip", line: { who: "valera", text: "Всю ночь *не спал,* между прочим!" } },
      { shot: "growlRun", dur: 3.0, tr: "flash", fear: 70, hit: 0.8, shake: 18, sfx: [{ s: "poof", at: 0.2 }, { s: "growl", at: 0.8 }, { s: "whoosh", at: 1.6 }] },
      { shot: "stumpPhone", tr: "whip", fear: 0, line: { who: "valera", text: "Наконец-то *тишина,* нахуй.", at: 0.4 } },
      { shot: "message", dur: 3.0, tr: "whipUp", sfx: [{ s: "ding", at: 0.5 }] },
      { shot: "valeraLookUp", dur: 2.0, tr: "cut", sfx: [{ s: "riser", at: 0, vol: 0.4 }] },
      { shot: "valeraWhat", tr: "zoom", hit: 0, shake: 26, line: { who: "valera", text: "*ЧТО?!*" }, sfx: [{ s: "hit", at: 0 }] },
    ],
  },
  {
    id: "after",
    ambient: "room",
    beats: [
      { shot: "afterCard", dur: 1.8, tr: "flash", clock: ["НОЧЬ", "23:58"], hit: 0.2, sfx: [{ s: "hit", at: 0.2, vol: 0.6 }] },
      { shot: "blanket", tr: "cut", fear: 5, line: { who: "artem", text: "Наконец-то я в *безопасности…*", at: 0.5 } },
      { shot: "underBed", tr: "whip", fear: 60, line: { who: "voice", name: "ПОД КРОВАТЬЮ", text: "*ТЫРЫ-ПЫРЫ…*", at: 0.4 }, sfx: [{ s: "whisper", at: 0.4 }] },
      { shot: "eyes", dur: 1.6, tr: "zoom", fear: 100, hit: 0, shake: 30, sfx: [{ s: "hit", at: 0 }, { s: "growl", at: 0 }] },
      { shot: "valeraBed", tr: "cut", hit: 0.2, shake: 22, line: { who: "valera", text: "Я ЖЕ СКАЗАЛ, *НЕХУЙ В ЛЕС ХОДИТЬ!*" }, sfx: [{ s: "growl", at: 0, vol: 0.6 }] },
      { shot: "scream", tr: "zoom", hit: 0, shake: 40, line: { who: "artem", text: "*АААААААА!*" }, sfx: [{ s: "scream", at: 0 }] },
    ],
  },
  {
    id: "finale",
    ambient: "none",
    beats: [{ shot: "end", dur: 5.0, tr: "flash", hit: 1.4, shake: 10, sfx: [{ s: "rec", at: 0.2 }, { s: "hit", at: 1.4 }, { s: "riser", at: 2.6, vol: 0.4 }] }],
  },
];

export const countWords = (text: string) => text.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;

export const lineSeconds = (text: string) => countWords(text) / WORDS_PER_SEC + LINE_PAD;

export type TimedBeat = Beat & {
  scene: SceneId;
  index: number;
  sceneIndex: number;
  from: number;
  frames: number;
  lineFrom: number;
  lineFrames: number;
};

const sec = (s: number) => Math.round(s * FPS);

export const TIMELINE: TimedBeat[] = (() => {
  const out: TimedBeat[] = [];
  let cursor = 0;
  SCENES.forEach((scene, sceneIndex) => {
    scene.beats.forEach((b) => {
      const lead = b.line?.at ?? 0;
      const lineLen = b.line ? lineSeconds(b.line.text) : 0;
      const len = b.dur ?? Math.max(MIN_BEAT, lead + lineLen + REACTION_HOLD);
      const frames = sec(len);
      out.push({
        ...b,
        scene: scene.id,
        index: out.length,
        sceneIndex,
        from: cursor,
        frames,
        lineFrom: cursor + sec(lead),
        lineFrames: sec(lineLen),
      });
      cursor += frames;
    });
  });
  return out;
})();

export const TOTAL_FRAMES = TIMELINE.reduce((a, b) => a + b.frames, 0);

export const SCENE_RANGES = SCENES.map((s) => {
  const beats = TIMELINE.filter((b) => b.scene === s.id);
  return { id: s.id, ambient: s.ambient, from: beats[0].from, to: beats[beats.length - 1].from + beats[beats.length - 1].frames };
});

export const SHAKES = TIMELINE.filter((b) => b.shake).map((b) => ({ frame: b.from + sec(b.hit ?? 0), amp: b.shake as number }));

export const FEAR_KEYS = (() => {
  const keys: { frame: number; value: number }[] = [];
  TIMELINE.forEach((b) => {
    if (b.fear !== undefined) keys.push({ frame: b.from + sec(b.hit ?? 0), value: b.fear });
  });
  return keys;
})();

export const CLOCK_KEYS = TIMELINE.filter((b) => b.clock).map((b) => ({ frame: b.from, label: b.clock![0], time: b.clock![1] }));

export const SFX_EVENTS = TIMELINE.flatMap((b) => (b.sfx ?? []).map((c) => ({ frame: b.from + sec(c.at ?? 0), name: c.s, vol: c.vol ?? 1 })));

export const SFX_FILES = [
  "howl", "hit", "creak", "whoosh", "pop", "rustle", "whisper", "thud", "screech", "powerOff", "laugh", "ding", "growl", "poof",
  "rumble", "demon", "check", "chime", "riser", "shatter", "victory", "scream", "rec",
] as const;

export const AMBIENT_FILES = ["night", "tension", "morning", "room"] as const;

export const T = {
  stampIn: 0.0,
  polaroidSettle: 0.55,
  smokeCover: 0.45,
  transformAt: 0.45,
  checkAfter: 0.75,
  docStamp: 2.2,
  phoneOffAt: 1.2,
  messageAt: 0.5,
  smashAt: 1.0,
  artemSmashAt: 0.7,
  monsterFadeStart: 0.2,
  recBlink: 0.5,
  endTitleAt: 0.6,
  endPillAt: 1.4,
  subtitlePop: 0.18,
};
