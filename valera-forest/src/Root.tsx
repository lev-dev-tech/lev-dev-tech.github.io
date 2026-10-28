import React from "react";
import { Composition } from "remotion";
import { Episode } from "./Episode";
import { Sheet } from "./Sheet";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./scenes";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Episode" component={Episode} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Sheet" component={Sheet} durationInFrames={60} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
