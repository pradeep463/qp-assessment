import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";
import { CC } from "../theme";

// Shared SVG filter defs for the case-file look: paper grain, heavy film
// grain, torn-edge displacement, and soft/hard shadows.
export const CaseDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="cgrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" result="n" />
        <feColorMatrix in="n" type="saturate" values="0" />
        <feComponentTransfer><feFuncA type="linear" slope="0.9" /></feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
      <filter id="cfibers">
        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.026" numOctaves={3} seed={11} result="n" />
        <feColorMatrix in="n" type="saturate" values="0" />
        <feComponentTransfer><feFuncA type="linear" slope="0.08" /></feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
      <filter id="cshadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000" floodOpacity="0.55" />
      </filter>
      <filter id="cshadowSm" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.6" />
      </filter>
    </defs>
  </svg>
);

// Dark, textured corkboard/paper backdrop with a deep vignette.
export const Board: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CC.board }}>
    <AbsoluteFill style={{ filter: "url(#cfibers)" }}>
      <div style={{ width: "100%", height: "100%", background: "#6b5a3a" }} />
    </AbsoluteFill>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 110% at 50% 42%, rgba(60,52,36,0.22), rgba(6,5,4,0.86) 100%)",
      }}
    />
  </AbsoluteFill>
);

// Quick pattern-interrupt flashes at scene cuts — a jolt that re-grabs the
// eye every few seconds (the doc's "re-hook"), driven by absolute frame.
export const Flashes: React.FC<{ at: number[]; color?: string; peak?: number }> = ({ at, color = "#EDE7D5", peak = 0.22 }) => {
  const frame = useCurrentFrame();
  let op = 0;
  for (const f of at) {
    op = Math.max(op, interpolate(frame, [f - 2, f, f + 4], [0, peak, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  }
  if (op <= 0.001) return null;
  return <AbsoluteFill style={{ background: color, opacity: op, pointerEvents: "none" }} />;
};

// Film grain + subtle bulb flicker, laid over everything for unease.
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  // flicker: mostly ~1, occasional dips
  const flick =
    0.9 + 0.1 * Math.sin(frame * 0.7) - (random(`f${Math.floor(frame / 2)}`) > 0.94 ? 0.14 : 0);
  return (
    <>
      <AbsoluteFill
        style={{
          background: `rgba(10,8,6,${interpolate(flick, [0.7, 1], [0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.5, pointerEvents: "none" }}>
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="#808080" filter="url(#cgrain)" />
        </svg>
      </AbsoluteFill>
      {/* moving scanline shimmer */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 3px)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />
    </>
  );
};
