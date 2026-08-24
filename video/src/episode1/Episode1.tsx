import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CaseDefs, Board, Grain } from "../crime/components/Atmosphere";
import { CASE_ICONS } from "./icons";
import { ColdOpen } from "./scenes/ColdOpen";
import { Intro } from "./scenes/Intro";
import { CaseScene } from "./scenes/CaseScene";
import { Transition } from "./scenes/Transition";
import { Close } from "./scenes/Close";
import { EVIDEO, CASE_META_HI } from "./theme";
import { CASE_DIAGRAMS, CASE_FIELD_NOTES, CASE_FIELD_NOTES_HI } from "./diagrams/compose";
import { TRANSITION_HOOKS_HI, COLD_OPEN_TEXT_HI, INTRO_TEXT_HI, CLOSE_TEXT_HI } from "./text.hi";
import timing from "./timing.json";
import timingHi from "./timing.hi.json";

// Short, non-verbatim teaser for the case a transition bridges into — the
// narration itself carries the actual transition line, so this is a
// distinct 2-4 word cue (Signaling, not a caption of the audio).
const TRANSITION_HOOKS: Record<number, string> = {
  3: "A VICTIM WITH A FACE",
  4: "THE FIRST WRITTEN LAW",
  5: "ROME'S SERIAL POISONER",
  6: "A FLY BREAKS THE CASE",
};

const FPS = EVIDEO.fps;
const toFrame = (s: number) => Math.round(s * FPS);

type TimingBeat = { i: number; case: number; bridgeTo: number | null; card: string | null; text: string; start: number; end: number };

function groupByCase(beats: TimingBeat[]) {
  const groups: { case: number; beats: TimingBeat[] }[] = [];
  for (const b of beats) {
    const last = groups[groups.length - 1];
    if (last && last.case === b.case) last.beats.push(b);
    else groups.push({ case: b.case, beats: [b] });
  }
  return groups;
}

export const TAIL_HOLD_SECONDS = 2.5;

export const episode1DurationInFrames = toFrame((timing as any).totalSeconds + TAIL_HOLD_SECONDS);
export const episode1HindiDurationInFrames = toFrame((timingHi as any).totalSeconds + TAIL_HOLD_SECONDS);

export const Episode1: React.FC<{ voiceover?: boolean; lang?: "en" | "hi" }> = ({ voiceover = true, lang = "en" }) => {
  const isHi = lang === "hi";
  const activeTiming = isHi ? timingHi : timing;
  const groups = groupByCase((activeTiming as any).beats as TimingBeat[]);
  const totalDurationInFrames = isHi ? episode1HindiDurationInFrames : episode1DurationInFrames;
  const fieldNotes = isHi ? CASE_FIELD_NOTES_HI : CASE_FIELD_NOTES;
  const transitionHooks = isHi ? TRANSITION_HOOKS_HI : TRANSITION_HOOKS;
  const caseMeta = isHi ? CASE_META_HI : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0B09" }}>
      <CaseDefs />
      <Board />

      {groups.map((g, gi) => {
        const startFrame = toFrame(g.beats[0].start);
        const nextStartFrame = gi + 1 < groups.length ? toFrame(groups[gi + 1].beats[0].start) : totalDurationInFrames;
        const durationInFrames = Math.max(1, nextStartFrame - startFrame);
        const localBeats = g.beats.map((b) => ({ frame: toFrame(b.start) - startFrame, card: b.card }));

        let content: React.ReactNode;
        if (g.case === 0) {
          content = isHi ? (
            <ColdOpen titleFrame={localBeats[2]?.frame ?? 0} caseFileLabel={COLD_OPEN_TEXT_HI.caseFileLabel} title={COLD_OPEN_TEXT_HI.title} />
          ) : (
            <ColdOpen titleFrame={localBeats[2]?.frame ?? 0} />
          );
        } else if (g.case === 1) {
          const cardFrame = localBeats[1]?.frame ?? 0;
          const welcomeFrame = localBeats[3]?.frame ?? localBeats[localBeats.length - 1].frame;
          content = isHi ? (
            <Intro
              cardFrame={cardFrame}
              welcomeFrame={welcomeFrame}
              heading={INTRO_TEXT_HI.heading}
              labels={INTRO_TEXT_HI.labels}
              sourcesNotLegend={INTRO_TEXT_HI.sourcesNotLegend}
            />
          ) : (
            <Intro cardFrame={cardFrame} welcomeFrame={welcomeFrame} />
          );
        } else if (g.case === 7) {
          content = isHi ? (
            <Close
              beats={localBeats}
              line1={CLOSE_TEXT_HI.line1}
              line2={CLOSE_TEXT_HI.line2}
              subscribeText={CLOSE_TEXT_HI.subscribe}
              caseClosedText={CLOSE_TEXT_HI.caseClosed}
            />
          ) : (
            <Close beats={localBeats} />
          );
        } else if (g.case < 0) {
          const bridgeTo = g.beats[0].bridgeTo ?? -g.case;
          content = (
            <Transition
              NextIcon={CASE_ICONS[bridgeTo]}
              beatFrames={localBeats.map((b) => b.frame)}
              hook={transitionHooks[bridgeTo]}
            />
          );
        } else {
          content = (
            <CaseScene
              caseId={g.case}
              Diagram={CASE_DIAGRAMS[g.case]}
              fieldNotes={fieldNotes[g.case]}
              beats={localBeats}
              metaOverride={caseMeta?.[g.case]}
            />
          );
        }

        return (
          <Sequence key={gi} from={startFrame} durationInFrames={durationInFrames}>
            {content}
          </Sequence>
        );
      })}

      <Grain />
      {voiceover && <Audio src={staticFile(isHi ? "episode1-voiceover-hi.mp3" : "episode1-voiceover.mp3")} />}
    </AbsoluteFill>
  );
};
