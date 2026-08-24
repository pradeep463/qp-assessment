import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

// Slow "Ken Burns" camera move applied to a whole scene, echoing the
// continuous pan/zoom across the collage in the reference footage.
export const Camera: React.FC<{
  from: { scale: number; x: number; y: number };
  to: { scale: number; x: number; y: number };
  duration: number;
  children: React.ReactNode;
}> = ({ from, to, duration, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ease = t * t * (3 - 2 * t); // smoothstep
  const scale = from.scale + (to.scale - from.scale) * ease;
  const x = from.x + (to.x - from.x) * ease;
  const y = from.y + (to.y - from.y) * ease;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translate(${x}px, ${y}px)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
