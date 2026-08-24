import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { CC, CFONT } from "../theme";
import voscript from "../voscript.json";

// Plays the human voiceover track, if one has been placed at
// public/voiceover.mp3. Rendered only when the `voiceover` prop is true so the
// base (silent) render never fails on a missing file.
export const Voiceover: React.FC = () => (
  <Audio src={staticFile("voiceover.mp3")} />
);

// Optional burned-in captions synced to the same script that drives the VO.
// Kept subtle and low on the frame so it never fights the scene typography.
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lines = voscript.lines;
  let current: { start: number; text: string } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const next = lines[i + 1];
    const end = next ? next.start : voscript.total;
    if (t >= lines[i].start && t < end) {
      current = lines[i];
      break;
    }
  }
  if (!current) return null;
  const local = t - current.start;
  const opacity = interpolate(local, [0, 0.18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 54, pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: 1500,
          textAlign: "center",
          fontFamily: CFONT.sans,
          fontSize: 40,
          fontWeight: 600,
          color: CC.bone,
          background: "rgba(8,7,6,0.62)",
          padding: "12px 28px",
          borderRadius: 8,
          opacity,
          textShadow: "0 2px 6px rgba(0,0,0,0.8)",
        }}
      >
        {current.text}
      </div>
    </AbsoluteFill>
  );
};
