import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AtlasBookend } from "./atlas/AtlasBookend";
import { AtlasCaseScene } from "./atlas/AtlasCaseScene";
import { GeoPin } from "./atlas/MapBoard";
import { FingerprintDiagram } from "./diagrams/sampleFingerprint";
import { LafargeDiagram } from "./diagrams/lafargeDiagram";
import { StielowDiagram } from "./diagrams/stielowDiagram";
import { MeteskyDiagram } from "./diagrams/meteskyDiagram";
import { PitchforkDiagram } from "./diagrams/pitchforkDiagram";
import { FlaskIcon, FingerprintIcon, BulletIcon, ProfileIcon, DnaIcon } from "./atlas/evidenceIcons";
import { EVIDEO } from "./theme";
import timing from "./timing2.json";

const FPS = EVIDEO.fps;
const toFrame = (s: number) => Math.round(s * FPS);
export const TAIL_HOLD_SECONDS = 2.5;
export const episode2DurationInFrames = toFrame((timing as any).totalSeconds + TAIL_HOLD_SECONDS);

type TimingBeat = { i: number; case: number; card: string | null; text: string; start: number; end: number };

function groupByCase(beats: TimingBeat[]) {
  const groups: { case: number; beats: TimingBeat[] }[] = [];
  for (const b of beats) {
    const last = groups[groups.length - 1];
    if (last && last.case === b.case) last.beats.push(b);
    else groups.push({ case: b.case, beats: [b] });
  }
  return groups;
}

const YEARS = [1840, 1892, 1915, 1956, 1988];

// Real coordinates for all five cases — every case's pin is always visible
// on every map (only the current case's is "active"/zoomed), so the map
// reads as one continuous atlas rather than five disconnected shots.
const ALL_PINS: { lon: number; lat: number; label: string; year: number; labelBelow?: boolean }[] = [
  { lon: 1.65, lat: 45.35, label: "LE GLANDIER, FR. · 1840", year: 1840 },
  { lon: -58.74, lat: -38.55, label: "NECOCHEA, ARG. · 1892", year: 1892 },
  { lon: -78.33, lat: 43.28, label: "WEST SHELBY, NY · 1915", year: 1915 },
  { lon: -74.01, lat: 40.71, label: "NEW YORK, NY · 1956", year: 1956, labelBelow: true },
  { lon: -1.203, lat: 52.573, label: "LEICESTERSHIRE, UK · 1988", year: 1988 },
];

function pinsFor(activeYear: number): GeoPin[] {
  return ALL_PINS.map((p) => ({ lon: p.lon, lat: p.lat, label: p.label, active: p.year === activeYear, labelBelow: p.labelBelow }));
}

const FOCUS = { x: 1470, y: 540 };

export const Episode2: React.FC<{ voiceover?: boolean }> = ({ voiceover = true }) => {
  const groups = groupByCase((timing as any).beats as TimingBeat[]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0B09" }}>
      {groups.map((g, gi) => {
        const startFrame = toFrame(g.beats[0].start);
        const nextStartFrame = gi + 1 < groups.length ? toFrame(groups[gi + 1].beats[0].start) : episode2DurationInFrames;
        const durationInFrames = Math.max(1, nextStartFrame - startFrame);
        const caseStartSec = g.beats[0].start;
        const cardBeats = g.beats.map((b) => ({ frame: toFrame(b.start) - startFrame, card: b.card }));
        const bookendLines = g.beats.map((b) => ({ frame: toFrame(b.start) - startFrame, text: b.text, card: b.card ?? undefined }));
        const at = (absSec: number) => absSec - caseStartSec;

        let content: React.ReactNode;

        if (g.case === 0) {
          content = <AtlasBookend pins={pinsFor(-1)} lines={bookendLines} years={YEARS} activeYear={1840} />;
        } else if (g.case === 1) {
          content = <AtlasBookend pins={pinsFor(-1)} lines={bookendLines} years={YEARS} activeYear={1840} />;
        } else if (g.case === 2) {
          content = (
            <AtlasCaseScene
              dossierLabel="FIELD DOSSIER — 001"
              title="The First Poison Test"
              Diagram={(p) => <LafargeDiagram {...p} stainAt={at(49.936)} convictedAt={at(59.773)} disputedAt={at(68.073)} />}
              pins={pinsFor(1840)}
              focus={FOCUS}
              cardBeats={cardBeats}
              years={YEARS}
              activeYear={1840}
              revealAt={at(59.773)}
              EvidenceIcon={FlaskIcon}
              archivalPhotos={[
                { src: "archival-marsh-apparatus.jpg", caption: "THE ACTUAL APPARATUS, C. 1840", atSec: 5, durationSec: 7, side: "left" },
                { src: "archival-lafarge-portrait.jpg", caption: "MARIE LAFARGE, 1840", atSec: at(57.773), durationSec: 8, side: "right" },
              ]}
            />
          );
        } else if (g.case === 3) {
          content = (
            <AtlasCaseScene
              dossierLabel="FIELD DOSSIER — 002"
              title="The First Fingerprint"
              Diagram={(p) => <FingerprintDiagram {...p} printBAt={at(89.744)} minutiaeAt={at(89.744) + 1.6} matchAt={at(98.239)} />}
              pins={pinsFor(1892)}
              focus={FOCUS}
              cardBeats={cardBeats}
              years={YEARS}
              activeYear={1892}
              fromPin={{ lon: ALL_PINS[0].lon, lat: ALL_PINS[0].lat }}
              revealAt={at(98.239)}
              EvidenceIcon={FingerprintIcon}
            />
          );
        } else if (g.case === 4) {
          content = (
            <AtlasCaseScene
              dossierLabel="FIELD DOSSIER — 003"
              title="The Test That Freed Him"
              Diagram={(p) => <StielowDiagram {...p} compareAt={at(111.031)} matchAt={at(124.645)} />}
              pins={pinsFor(1915)}
              focus={FOCUS}
              cardBeats={cardBeats}
              years={YEARS}
              activeYear={1915}
              fromPin={{ lon: ALL_PINS[1].lon, lat: ALL_PINS[1].lat }}
              revealAt={at(124.645)}
              EvidenceIcon={BulletIcon}
              archivalPhotos={[
                { src: "archival-goddard-photo.jpg", caption: "CALVIN GODDARD", atSec: 5, durationSec: 7, side: "left" },
              ]}
            />
          );
        } else if (g.case === 5) {
          content = (
            <AtlasCaseScene
              dossierLabel="FIELD DOSSIER — 004"
              title="The First Profile"
              Diagram={(p) => <MeteskyDiagram {...p} traitsAt={at(149.071)} suitAt={at(157.457)} matchAt={at(163.667)} />}
              pins={pinsFor(1956)}
              focus={FOCUS}
              cardBeats={cardBeats}
              years={YEARS}
              activeYear={1956}
              fromPin={{ lon: ALL_PINS[2].lon, lat: ALL_PINS[2].lat }}
              revealAt={at(163.667)}
              EvidenceIcon={ProfileIcon}
              archivalPhotos={[
                { src: "archival-metesky-photo.jpg", caption: "GEORGE METESKY, CAPTURED 1957", atSec: at(165.667), durationSec: 8, side: "right" },
              ]}
            />
          );
        } else if (g.case === 6) {
          content = (
            <AtlasCaseScene
              dossierLabel="FIELD DOSSIER — 005"
              title="The Test He Tried to Cheat"
              Diagram={(p) => <PitchforkDiagram {...p} exonerateAt={at(177.142)} matchAt={at(189.647)} />}
              pins={pinsFor(1988)}
              focus={FOCUS}
              cardBeats={cardBeats}
              years={YEARS}
              activeYear={1988}
              fromPin={{ lon: ALL_PINS[3].lon, lat: ALL_PINS[3].lat }}
              revealAt={at(189.647)}
              EvidenceIcon={DnaIcon}
              archivalPhotos={[
                { src: "archival-jeffreys-photo.jpg", caption: "SIR ALEC JEFFREYS", atSec: 5, durationSec: 7, side: "left" },
                { src: "archival-dna-autoradiograph.jpg", caption: "THE FIRST GENETIC FINGERPRINT, 1984", atSec: at(187.647), durationSec: 8, side: "right" },
              ]}
            />
          );
        } else {
          content = <AtlasBookend pins={pinsFor(-1)} lines={bookendLines} years={YEARS} activeYear={1988} />;
        }

        return (
          <Sequence key={gi} from={startFrame} durationInFrames={durationInFrames}>
            {content}
          </Sequence>
        );
      })}

      {voiceover && <Audio src={staticFile("episode2-voiceover.mp3")} />}
    </AbsoluteFill>
  );
};
