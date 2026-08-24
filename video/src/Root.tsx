import React from "react";
import { Composition } from "remotion";
import { AiExplainer } from "./AiExplainer";
import { CrimePsych } from "./crime/CrimePsych";
import { VIDEO } from "./theme";
import { CVIDEO } from "./crime/theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AiExplainer"
      component={AiExplainer}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="CrimePsych"
      component={CrimePsych}
      durationInFrames={CVIDEO.durationInFrames}
      fps={CVIDEO.fps}
      width={CVIDEO.width}
      height={CVIDEO.height}
      defaultProps={{ voiceover: false, captions: false }}
    />
  </>
);
