import { continueRender, delayRender, staticFile } from "remotion";

const faces: [string, string, string][] = [
  ["MontserratX", "montserrat-cyrillic-900-normal.woff2", "900"],
  ["MontserratX", "montserrat-latin-900-normal.woff2", "900"],
  ["MontserratX", "montserrat-cyrillic-800-normal.woff2", "800"],
  ["MontserratX", "montserrat-latin-800-normal.woff2", "800"],
  ["MontserratX", "montserrat-cyrillic-700-normal.woff2", "700"],
  ["MontserratX", "montserrat-latin-700-normal.woff2", "700"],
  ["RussoX", "russo-one-cyrillic-400-normal.woff2", "400"],
  ["RussoX", "russo-one-latin-400-normal.woff2", "400"],
  ["CaveatX", "caveat-cyrillic-700-normal.woff2", "700"],
  ["CaveatX", "caveat-latin-700-normal.woff2", "700"],
];

let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("fonts");
  Promise.all(
    faces.map(([family, file, weight]) => {
      const f = new FontFace(family, `url(${staticFile("fonts/" + file)}) format('woff2')`, { weight });
      document.fonts.add(f);
      return f.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};
