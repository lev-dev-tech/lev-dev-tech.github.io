const mod = await import(process.argv[2]);
const pick = process.argv[3] ?? "beat";
const out = [];
if (pick === "scene") {
  for (const r of mod.SCENE_RANGES) {
    const beats = mod.TIMELINE.filter((b) => b.scene === r.id);
    beats.forEach((b, i) => out.push([`${r.id}_${String(i).padStart(2, "0")}_${b.shot}`, b.from + Math.floor(b.frames * 0.7)]));
  }
} else {
  mod.TIMELINE.forEach((b) => out.push([`${String(b.index).padStart(3, "0")}_${b.scene}_${b.shot}`, b.from + Math.floor(b.frames * 0.7)]));
}
console.log(JSON.stringify(out));
console.error("total frames", mod.TOTAL_FRAMES, "sec", (mod.TOTAL_FRAMES / 30).toFixed(1), "beats", mod.TIMELINE.length);
