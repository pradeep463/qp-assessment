import React from "react";
import { Composition } from "remotion";
import { AiExplainer } from "./AiExplainer";
import { VIDEO } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="AiExplainer"
    component={AiExplainer}
    durationInFrames={VIDEO.durationInFrames}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
