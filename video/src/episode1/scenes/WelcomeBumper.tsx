import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";
import { CaseDefs, Board, Grain } from "../../crime/components/Atmosphere";
import { TornCard, Pin } from "../../crime/components/Pieces";

// Very short branded bumper — a fast logo sting before the hook. Kept under
// 5s on purpose: nothing should delay the actual hook by more than a beat.
export const WelcomeBumper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = interpolate(frame, [0, 10], [1.4, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const s = spring({ frame, fps, config: { damping: 200, mass: 0.5, stiffness: 260 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0B09" }}>
      <CaseDefs />
      <Board />
      <AbsoluteFill style={{ transform: `scale(${slam})`, transformOrigin: "center" }}>
        <TornCard width={1200} height={260} x={360} y={410} rotate={-1} seed={3}>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ opacity: interpolate(s, [0, 1], [0, 1]), textAlign: "center" }}>
              <div style={{ fontFamily: CFONT.display, fontWeight: 800, fontSize: 96, color: CC.ink, letterSpacing: 2 }}>
                CIPHERSTUDIOS
              </div>
              <div style={{ fontFamily: CFONT.stamp, fontSize: 26, color: CC.redDark, letterSpacing: 6, marginTop: 8 }}>
                CASE FILES IN CRIME &amp; HORROR
              </div>
            </div>
          </AbsoluteFill>
        </TornCard>
        <Pin x={330} y={396} color={CC.red} size={34} />
        <Pin x={1490} y={396} color={CC.bone} size={30} />
      </AbsoluteFill>
      <Grain />
      <Audio src={staticFile("welcome.mp3")} />
    </AbsoluteFill>
  );
};
