import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

// Fades scene content in/out and applies camera motion. `punch` does a fast
// slam-in (big -> settle in the first ~12 frames) for an arresting cold open;
// otherwise a continuous slow push keeps every scene alive (retention).
export const SceneWrap: React.FC<{
  fin?: number;
  fout?: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  punch?: boolean;
  children: React.ReactNode;
}> = ({ fin = 6, fout = 8, zoomFrom = 1.08, zoomTo = 1.0, panX = 0, panY = 0, punch = false, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, fin, durationInFrames - fout, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  let scale: number;
  if (punch) {
    // fast slam then a gentle continuing drift
    const slam = interpolate(frame, [0, 12], [1.28, 1.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
    const drift = interpolate(frame, [12, durationInFrames], [1.02, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    scale = frame < 12 ? slam : drift;
  } else {
    const t = interpolate(frame, [0, durationInFrames], [0, 1]);
    const ease = t * t * (3 - 2 * t);
    scale = zoomFrom + (zoomTo - zoomFrom) * ease;
  }
  const tt = interpolate(frame, [0, durationInFrames], [0, 1]);
  const x = panX * tt;
  const y = panY * tt;
  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${scale}) translate(${x}px, ${y}px)`, transformOrigin: "center" }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
