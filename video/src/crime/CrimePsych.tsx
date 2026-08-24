import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { CaseDefs, Board, Grain, Flashes } from "./components/Atmosphere";
import { Voiceover, Captions } from "./components/Narration";
import { S1Hook } from "./scenes/S1Hook";
import { S2Curiosity } from "./scenes/S2Curiosity";
import { S3Paradox } from "./scenes/S3Paradox";
import { S4Audience } from "./scenes/S4Audience";
import { S5Craft } from "./scenes/S5Craft";
import { S6Ethics } from "./scenes/S6Ethics";

// 30s @ 30fps = 900 frames. Scenes cross-fade over one persistent evidence
// board; film grain + vignette sit on top of everything.
const SCENES = [
  { comp: S1Hook, from: 0, dur: 165 },
  { comp: S2Curiosity, from: 155, dur: 160 },
  { comp: S3Paradox, from: 305, dur: 190 },
  { comp: S4Audience, from: 485, dur: 140 },
  { comp: S5Craft, from: 615, dur: 175 },
  { comp: S6Ethics, from: 780, dur: 120 },
];

export const CrimePsych: React.FC<{ voiceover?: boolean; captions?: boolean }> = ({
  voiceover = false,
  captions = false,
}) => (
  <AbsoluteFill style={{ backgroundColor: "#0C0B09" }}>
    <CaseDefs />
    <Board />
    {SCENES.map((s, i) => {
      const Comp = s.comp;
      return (
        <Sequence key={i} from={s.from} durationInFrames={s.dur}>
          <Comp />
        </Sequence>
      );
    })}
    <Flashes at={SCENES.slice(1).map((s) => s.from + 8)} />
    <Grain />
    {captions && <Captions />}
    {voiceover && <Voiceover />}
  </AbsoluteFill>
);
