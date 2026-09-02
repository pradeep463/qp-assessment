import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { CaseDefs, Board, Grain } from "../crime/components/Atmosphere";
import { CaseScene } from "./scenes/CaseScene";
import { FingerprintDiagram } from "./diagrams/sampleFingerprint";
import { EVIDEO } from "./theme";
import timing from "./timingSample.json";

const FPS = EVIDEO.fps;
const toFrame = (s: number) => Math.round(s * FPS);
export const TAIL_HOLD_SECONDS = 2.2;
export const sampleDurationInFrames = toFrame((timing as any).totalSeconds + TAIL_HOLD_SECONDS);

// Cue seconds re-derived from the current timingSample.json beats after the
// narration was re-split for pacing (was 5 beats, now 6) — these are stale
// the moment beats.json or generate_episode.py's --gap/--speed change, since
// they're hand-read off the printed synth log, not computed from the file.
const Diagram: React.FC<{ width: number; height: number }> = (p) => (
  <FingerprintDiagram {...p} printBAt={17.3} minutiaeAt={19.0} matchAt={25.5} />
);

const fieldNotes = [
  { at: 0.3, text: "Necochea's police had just built the world's first working fingerprint file." },
  { at: 17.3, text: "In 1903 Argentina became the first country to rely on fingerprints alone for identification." },
];

export const Sample: React.FC = () => {
  const beats = (timing as any).beats.map((b: any) => ({ frame: toFrame(b.start), card: b.card }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0B09" }}>
      <CaseDefs />
      <Board />
      <CaseScene
        caseId={2}
        Diagram={Diagram}
        fieldNotes={fieldNotes}
        beats={beats}
        metaOverride={{ title: "THE FIRST FINGERPRINT", label: "CASE 02" }}
      />
      <Grain />
      <Audio src={staticFile("sample-voiceover.mp3")} />
    </AbsoluteFill>
  );
};
