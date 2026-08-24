import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate, random } from "remotion";
import { CC } from "../theme";

// Shared SVG filter defs — just the drop shadows. Grain/fiber texture used
// to be procedural feTurbulence filters, but those are recomputed by Chrome
// on every single frame even though the noise itself never changes (no
// per-frame seed), which made a multi-minute video render for hours. They
// are now baked once into public/tex-*.png and tiled via CSS instead —
// same look, no per-frame cost.
export const CaseDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
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
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile("tex-fiber.png")})`,
        backgroundRepeat: "repeat",
        backgroundSize: "512px 512px",
        opacity: 0.5,
      }}
    />
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
  // Old-CRT-style flicker: a slow ambient "breathe" (multi-second period,
  // low amplitude) plus a rare, brief bulb-glitch every few seconds that
  // ramps smoothly rather than snapping — not the fast strobe a per-2-frame
  // random check produces.
  const breathe = 0.05 + 0.035 * Math.sin(frame * 0.045) + 0.02 * Math.sin(frame * 0.011 + 2);
  const glitchSeed = Math.floor(frame / 70);
  const glitchRoll = random(`glitch${glitchSeed}`);
  const glitchLocal = frame % 70;
  const glitchWindow = glitchRoll > 0.82 ? interpolate(glitchLocal, [0, 3, 7], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const darkness = Math.min(0.22, breathe + glitchWindow * 0.14);

  // a faint horizontal band that rolls slowly down the frame, like an old
  // set's vertical-hold drifting — very subtle, never fully opaque
  const rollY = ((frame * 1.6) % 1200) - 100;

  return (
    <>
      <AbsoluteFill
        style={{
          background: `rgba(10,8,6,${darkness})`,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)`,
          transform: `translateY(${rollY}px)`,
          height: 220,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("tex-grain.png")})`,
          backgroundRepeat: "repeat",
          backgroundSize: "512px 512px",
          mixBlendMode: "overlay",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      {/* static scanlines */}
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
