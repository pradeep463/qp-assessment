import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";
import { RedString, Pin } from "../../crime/components/Pieces";
import { Flashes } from "../../crime/components/Atmosphere";

// A brief connective beat between cases. The narration carries the actual
// transition line (this channel doesn't caption dialogue), so the on-screen
// "hook" here is deliberately NOT a transcript of it — a short, non-verbatim
// teaser (2-4 words) for what's coming, per the Signaling Principle (short
// keyword cues help, unlike duplicating spoken text word-for-word). Each
// case-to-case boundary is its own retention risk, so this also gives the
// board a fresh beat of motion instead of just an icon fading in.
export const Transition: React.FC<{
  NextIcon: React.FC<{ size: number; color?: string }>;
  beatFrames: number[];
  hook: string;
}> = ({ NextIcon, beatFrames, hook }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 22, mass: 1 } });
  const hookIn = spring({ frame: frame - 12, fps, config: { damping: 16, mass: 0.6 } });

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

      <div
        style={{
          position: "absolute",
          top: 700,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(hookIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(hookIn, [0, 1], [14, 0])}px)`,
          fontFamily: CFONT.stamp,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 5,
          color: CC.red,
          textTransform: "uppercase",
        }}
      >
        {hook}
      </div>
    </AbsoluteFill>
  );
};
