import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { AC, AFONT } from "./theme";

// A brief "this really happened" insert — a real archival photo, framed like
// a physical print pinned to the dossier, cross-fading in and back out over
// the map/diagram rather than replacing the scene. Used sparingly (one or
// two per case) as a grounding beat, not as the primary visual.
export const ArchivalPhoto: React.FC<{
  src: string;
  caption: string;
  atSec: number;
  durationSec: number;
  side?: "left" | "right";
}> = ({ src, caption, atSec, durationSec, side = "right" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const start = f(atSec);
  const end = f(atSec + durationSec);
  const fadeIn = interpolate(frame, [start, start + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const fadeOut = interpolate(frame, [end - 14, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  if (opacity <= 0.001) return null;
  const rise = interpolate(frame, [start, start + 16], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          [side]: 90,
          bottom: 100,
          width: 300,
          opacity,
          transform: `translateY(${rise}px) rotate(${side === "right" ? 2.5 : -2.5}deg)`,
          background: "#F6F1E4",
          padding: "14px 14px 46px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ width: "100%", height: 220, overflow: "hidden", background: "#111" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.35) contrast(1.05)" }} />
        </div>
        <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, fontFamily: AFONT.stamp, fontSize: 13, letterSpacing: 1, color: AC.ink, textAlign: "center" }}>
          {caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};
