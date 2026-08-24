import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC } from "../../crime/theme";
import { RedString, Pin } from "../../crime/components/Pieces";
import { Flashes } from "../../crime/components/Atmosphere";

// A brief connective beat between cases. No on-screen text (the narration
// carries it — this channel doesn't caption dialogue); instead the upcoming
// case's icon materializes ghost-like on the board, center frame, so there's
// still visual motion synced to the real narration timing.
export const Transition: React.FC<{
  NextIcon: React.FC<{ size: number; color?: string }>;
  beatFrames: number[];
}> = ({ NextIcon, beatFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 22, mass: 1 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Flashes at={beatFrames} peak={0.1} />
      <div
        style={{
          opacity: interpolate(s, [0, 1], [0, 0.5]),
          transform: `scale(${interpolate(s, [0, 1], [0.7, 1.05])})`,
        }}
      >
        <NextIcon size={320} color={CC.boneDim} />
      </div>
      <RedString x1={760} y1={540} x2={1160} y2={540} sag={0} />
      <Pin x={745} y={528} color={CC.red} size={26} />
      <Pin x={1145} y={528} color={CC.bone} size={26} />
    </AbsoluteFill>
  );
};
