import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const root = path.resolve(".");
const outDir = process.argv[2] ?? path.join(root, "out", "stills");
const only = process.argv[3] ? process.argv[3].split(",") : null;
fs.mkdirSync(outDir, { recursive: true });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const comp = await selectComposition({ serveUrl, id: "Episode", browserExecutable });
const frames = JSON.parse(process.env.FRAMES ?? "[]");
for (const [name, frame] of frames) {
  if (only && !only.some((o) => name.includes(o))) continue;
  await renderStill({ serveUrl, composition: comp, frame, output: path.join(outDir, `${name}.png`), browserExecutable, imageFormat: "png", scale: 0.5 });
  console.log("still", name, frame);
}
