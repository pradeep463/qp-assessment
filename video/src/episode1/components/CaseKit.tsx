import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";
import { TornCard } from "../../crime/components/Pieces";

// Shared timing helpers for per-case diagram compositions: `f` converts a
// case-relative second offset to a frame, and `stageOpacity` crossfades a
// visual stage in/out around [start, end] (used to sequence several small
// diagrams within one case's runtime without any manual frame math at each
// call site).
export function useStageHelpers() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const stageOpacity = (start: number, end: number, keepAfter = false) =>
    interpolate(frame, [f(start), f(start) + 8, f(end) - 8, f(end)], [0, 1, 1, keepAfter ? 1 : 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  return { frame, fps, f, stageOpacity };
}

// A lined index-card that fills the empty board area with a slower,
// narrative "field notes" line, replacing one line at a time via a small
// crossfade so it doesn't compete with the terse fact tags above it.
export const FieldNotes: React.FC<{
  notes: { at: number; text: string }[];
  f: (s: number) => number;
  frame: number;
  x: number;
  y: number;
  width: number;
  height: number;
}> = ({ notes, f, frame, x, y, width, height }) => {
  const { fps } = useVideoConfig();
  let active = notes[0];
  let idx = 0;
  notes.forEach((n, i) => {
    if (f(n.at) <= frame) {
      active = n;
      idx = i;
    }
  });
  const s = spring({ frame: frame - f(active.at), fps, config: { damping: 18, mass: 0.6 } });

  return (
    <TornCard width={width} height={height} x={x} y={y} rotate={1.2} seed={40} color={CC.paper}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <line x1={0} y1={height * 0.22} x2={width} y2={height * 0.22} stroke={CC.red} strokeWidth={2.4} opacity={0.55} />
        {Array.from({ length: 5 }).map((_, i) => {
          const yy = height * 0.22 + (i + 1) * (height * 0.62) / 5;
          return <line key={i} x1={width * 0.06} y1={yy} x2={width * 0.94} y2={yy} stroke={CC.paperDark} strokeWidth={1.6} opacity={0.5} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 44, top: 26, fontFamily: CFONT.stamp, fontSize: 18, color: CC.redDark, letterSpacing: 2 }}>
        FIELD NOTES
      </div>
      <div
        key={idx}
        style={{
          position: "absolute",
          left: 44,
          top: height * 0.34,
          width: width - 88,
          opacity: interpolate(s, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px)`,
          fontFamily: CFONT.display,
          fontStyle: "italic",
          fontSize: 32,
          color: CC.inkSoft,
          lineHeight: 1.3,
        }}
      >
        {active.text}
      </div>
    </TornCard>
  );
};

export const FactTag: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, mass: 0.5, stiffness: 200 } });
  return (
    <div
      style={{
        display: "inline-block",
        transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
        opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
        background: CC.red,
        color: CC.bone,
        fontFamily: CFONT.heavy,
        fontWeight: 900,
        fontSize: 34,
        letterSpacing: 1,
        padding: "14px 26px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
      }}
    >
      {text}
    </div>
  );
};
