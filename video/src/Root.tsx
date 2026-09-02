import React from "react";
import { Composition } from "remotion";
import { AiExplainer } from "./AiExplainer";
import { CrimePsych } from "./crime/CrimePsych";
import { Episode1, episode1DurationInFrames, episode1HindiDurationInFrames } from "./episode1/Episode1";
import { WelcomeBumper } from "./episode1/scenes/WelcomeBumper";
import { Outro } from "./episode1/scenes/Outro";
import { Thumbnail } from "./episode1/Thumbnail";
import { Case1Preview } from "./episode1/preview/Case1Preview";
import { Sample, sampleDurationInFrames } from "./episode1/Sample";
import { AtlasSample, atlasSampleDurationInFrames } from "./episode1/AtlasSample";
import { Episode2, episode2DurationInFrames } from "./episode1/Episode2";
import { CipherSample } from "./episode1/cipher/CipherSample";
import { Thumbnail2 } from "./episode1/atlas/Thumbnail2";
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
      defaultProps={{ voiceover: true, lang: "en" }}
    />
    <Composition
      id="Episode1Hindi"
      component={Episode1}
      durationInFrames={episode1HindiDurationInFrames}
      fps={EVIDEO.fps}
      width={EVIDEO.width}
      height={EVIDEO.height}
      defaultProps={{ voiceover: true, lang: "hi" }}
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
    <Composition
      id="Sample30s"
      component={Sample}
      durationInFrames={sampleDurationInFrames}
      fps={EVIDEO.fps}
      width={EVIDEO.width}
      height={EVIDEO.height}
    />
    <Composition
      id="AtlasSample30s"
      component={AtlasSample}
      durationInFrames={atlasSampleDurationInFrames}
      fps={EVIDEO.fps}
      width={EVIDEO.width}
      height={EVIDEO.height}
    />
    <Composition
      id="Episode2"
      component={Episode2}
      durationInFrames={episode2DurationInFrames}
      fps={EVIDEO.fps}
      width={EVIDEO.width}
      height={EVIDEO.height}
      defaultProps={{ voiceover: true }}
    />
    <Composition
      id="Thumbnail2"
      component={Thumbnail2}
      durationInFrames={1}
      fps={EVIDEO.fps}
      width={1280}
      height={720}
    />
    <Composition
      id="CipherSample"
      component={CipherSample}
      durationInFrames={Math.round(18 * EVIDEO.fps)}
      fps={EVIDEO.fps}
      width={EVIDEO.width}
      height={EVIDEO.height}
    />
    <Composition
      id="Case1Preview"
      component={Case1Preview}
      durationInFrames={Math.round(61.0 * EVIDEO.fps)}
      fps={EVIDEO.fps}
      width={EVIDEO.width}
      height={EVIDEO.height}
    />
  </>
);
