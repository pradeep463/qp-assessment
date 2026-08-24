import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

// Fades scene content in/out and applies a slow camera drift, so the whole
// piece feels like one continuous move across an evidence board.
export const SceneWrap: React.FC<{
  fin?: number;
  fout?: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  children: React.ReactNode;
}> = ({ fin = 10, fout = 10, zoomFrom = 1.06, zoomTo = 1.0, panX = 0, panY = 0, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, fin, durationInFrames - fout, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const t = interpolate(frame, [0, durationInFrames], [0, 1]);
  const ease = t * t * (3 - 2 * t);
  const scale = zoomFrom + (zoomTo - zoomFrom) * ease;
  const x = panX * ease;
  const y = panY * ease;
  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${scale}) translate(${x}px, ${y}px)`, transformOrigin: "center" }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
