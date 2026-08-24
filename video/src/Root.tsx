import React from "react";
import { Composition } from "remotion";
import { AiExplainer } from "./AiExplainer";
import { CrimePsych } from "./crime/CrimePsych";
import { Episode1, episode1DurationInFrames } from "./episode1/Episode1";
import { WelcomeBumper } from "./episode1/scenes/WelcomeBumper";
import { Outro } from "./episode1/scenes/Outro";
import { Thumbnail } from "./episode1/Thumbnail";
import { VIDEO } from "./theme";
import { CVIDEO } from "./crime/theme";
import { EVIDEO } from "./episode1/theme";
import bookends from "./episode1/bookends-timing.json";

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
    <Composition
      id="WelcomeBumper"
      component={WelcomeBumper}
      durationInFrames={Math.round((bookends as any).welcome.totalSeconds * EVIDEO.fps)}
      fps={EVIDEO.fps}
      width={EVIDEO.width}
      height={EVIDEO.height}
    />
    <Composition
      id="Outro"
      component={Outro}
      durationInFrames={Math.round((bookends as any).outro.totalSeconds * EVIDEO.fps)}
      fps={EVIDEO.fps}
      width={EVIDEO.width}
      height={EVIDEO.height}
    />
    <Composition
      id="Thumbnail"
      component={Thumbnail}
      durationInFrames={1}
      fps={EVIDEO.fps}
      width={1280}
      height={720}
    />
  </>
);
