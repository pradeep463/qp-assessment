import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CaseDefs } from "../crime/components/Atmosphere";
import { TornCard } from "../crime/components/Pieces";
import { MapBoard, GeoPin } from "./atlas/MapBoard";
import { TimelineRibbon } from "./atlas/TimelineRibbon";
import { AC, AFONT } from "./atlas/theme";
import { FingerprintDiagram } from "./diagrams/sampleFingerprint";
import { EVIDEO } from "./theme";
import timing from "./timingSample.json";

const FPS = EVIDEO.fps;
const toFrame = (s: number) => Math.round(s * FPS);
const TAIL_HOLD_SECONDS = 2.2;
export const atlasSampleDurationInFrames = toFrame((timing as any).totalSeconds + TAIL_HOLD_SECONDS);

// Real coordinates — the map itself is a real Natural Earth projection, so
// these place the pins on the actual country, not an eyeballed position.
const PINS: GeoPin[] = [
  { lon: -58.74, lat: -38.55, label: "NECOCHEA, ARG. · 1892", active: true },
  { lon: -78.33, lat: 43.28, label: "WEST SHELBY, NY · 1915" },
  { lon: -1.13, lat: 52.63, label: "LEICESTERSHIRE, UK · 1988" },
];

const Dossier: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const beats = (timing as any).beats as { start: number; card: string | null; text: string }[];

  const cardBeats = beats.filter((b) => b.card);
  let activeCard: string | null = null;
  let activeIdx = -1;
  cardBeats.forEach((b, i) => {
    if (f(b.start) <= frame) { activeCard = b.card; activeIdx = i; }
  });

  const cardIn = spring({ frame: frame - f(0.6), fps, config: { damping: 18, mass: 0.8 } });
  const factIn = spring({ frame, fps, config: { damping: 14, mass: 0.5, stiffness: 200 } });

  return (
    <div style={{ position: "absolute", left: 130, top: 90, width: 900, height: 840, opacity: interpolate(cardIn, [0, 1], [0, 1]), transform: `translateY(${interpolate(cardIn, [0, 1], [24, 0])}px)` }}>
      <TornCard width={900} height={840} x={0} y={0} rotate={-0.6} seed={12} color={AC.vellum} amp={14}>
        <div style={{ padding: "56px 60px" }}>
          <div style={{ display: "inline-block", fontFamily: AFONT.stamp, fontSize: 20, letterSpacing: 3, color: AC.waxDeep, borderBottom: `2px solid ${AC.waxDeep}`, paddingBottom: 6, marginBottom: 26 }}>
            FIELD DOSSIER — 001
          </div>
          <div style={{ fontFamily: AFONT.display, fontSize: 56, color: AC.ink, lineHeight: 1.12, marginBottom: 30 }}>
            The First Fingerprint
          </div>
          <div style={{ height: 1, background: AC.inkFaint, opacity: 0.3, marginBottom: 30 }} />
          <FingerprintDiagram width={780} height={480} printBAt={17.3} minutiaeAt={19.0} matchAt={25.5} />
          <div style={{ marginTop: 24, minHeight: 70 }}>
            {activeCard && (
              <div
                key={activeIdx}
                style={{
                  display: "inline-block",
                  transform: `translateY(${interpolate(factIn, [0, 1], [18, 0])}px)`,
                  opacity: interpolate(factIn, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
                  background: AC.wax,
                  color: AC.vellum,
                  fontFamily: AFONT.heavy,
                  fontWeight: 900,
                  fontSize: 26,
                  letterSpacing: 1,
                  padding: "12px 22px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
                }}
              >
                {activeCard}
              </div>
            )}
          </div>
        </div>
      </TornCard>
    </div>
  );
};

export const AtlasSample: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: AC.parch }}>
    <CaseDefs />
    {/* dossier card occupies x:130-1030, so focus the zoom on the visible strip to its right */}
    <MapBoard pins={PINS} zoomInAt={0.2} focus={{ x: 1470, y: 540 }} />
    <Dossier />
    <TimelineRibbon years={[1840, 1892, 1915, 1956, 1988]} activeYear={1892} />
    <Audio src={staticFile("sample-voiceover.mp3")} />
  </AbsoluteFill>
);
