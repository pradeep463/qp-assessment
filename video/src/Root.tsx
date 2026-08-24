import React from "react";
import { Composition } from "remotion";
import { AiExplainer } from "./AiExplainer";
import { CrimePsych } from "./crime/CrimePsych";
import { Episode1, episode1DurationInFrames } from "./episode1/Episode1";
import { VIDEO } from "./theme";
import { CVIDEO } from "./crime/theme";
import { EVIDEO } from "./episode1/theme";

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
    <Composition
      id="Episode1"
      component={Episode1}
      durationInFrames={episode1DurationInFrames}
      fps={EVIDEO.fps}
      width={EVIDEO.width}
      height={EVIDEO.height}
      defaultProps={{ voiceover: true }}
    />
  </>
);
