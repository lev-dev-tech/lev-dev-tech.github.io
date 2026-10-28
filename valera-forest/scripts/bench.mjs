import path from "node:path";
import os from "node:os";
import { bundle } from "@remotion/bundler";
import { renderFrames, selectComposition } from "@remotion/renderer";

const root = path.resolve(".");
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const comp = await selectComposition({ serveUrl, id: "Episode", browserExecutable });
const ranges = JSON.parse(process.argv[2]);
const outputDir = path.join(os.tmpdir(), "valera-bench");
for (const [a, b] of ranges) {
  const t = Date.now();
  await renderFrames({
    serveUrl,
    composition: comp,
    frameRange: [a, b],
    outputDir,
    imageFormat: "jpeg",
    browserExecutable,
    concurrency: 4,
    onStart: () => {},
    onFrameUpdate: () => {},
    chromiumOptions: { gl: process.env.GL === "default" ? null : (process.env.GL ?? "swangle") },
  });
  console.log(`frames ${a}-${b}: ${((Date.now() - t) / (b - a + 1)).toFixed(0)} ms/frame`);
}
