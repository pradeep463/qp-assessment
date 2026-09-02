import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CaseDefs } from "../../crime/components/Atmosphere";
import { MapBoard, GeoPin } from "./MapBoard";
import { TimelineRibbon } from "./TimelineRibbon";
import { AC, AFONT } from "./theme";

type Line = { frame: number; text: string; card?: string };

// Used for the cold open, intro, and close — a wide, unzoomed map (no active
// pin, so MapBoard's push-in never triggers) with large kinetic lines
// popping in on beat, over a readability scrim so text holds up against the
// map underneath it.
export const AtlasBookend: React.FC<{
  pins: GeoPin[];
  lines: Line[];
  activeYear: number;
  years: number[];
}> = ({ pins, lines, activeYear, years }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let active: Line | null = null;
  let idx = -1;
  lines.forEach((l, i) => {
    if (l.frame <= frame) { active = l; idx = i; }
  });
  const s = spring({ frame: active ? frame - active.frame : 0, fps, config: { damping: 16, mass: 0.6 } });

  return (
    <AbsoluteFill style={{ backgroundColor: AC.parch }}>
      <CaseDefs />
      <MapBoard pins={pins} zoomInAt={9999} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(43,32,19,0.15), rgba(43,32,19,0.55) 55%, rgba(43,32,19,0.15))" }} />
      <AbsoluteFill style={{ background: AC.wax, opacity: interpolate(frame, [0, 2, 10], [0, 0.16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), pointerEvents: "none" }} />

      {active && (
        <div key={idx} style={{ position: "absolute", left: 160, right: 160, top: 380, display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)` }}>
          <div style={{ fontFamily: AFONT.display, fontSize: 46, color: AC.vellum, lineHeight: 1.3, textAlign: "center", textShadow: "0 4px 18px rgba(0,0,0,0.55)" }}>
            {active.text}
          </div>
          {active.card && (
            <div style={{ marginTop: 44, fontFamily: AFONT.heavy, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: AC.vellum, background: AC.wax, padding: "14px 30px", boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }}>
              {active.card}
            </div>
          )}
        </div>
      )}

      <TimelineRibbon years={years} activeYear={activeYear} />
    </AbsoluteFill>
  );
};
