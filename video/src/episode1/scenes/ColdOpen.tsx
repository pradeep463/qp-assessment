import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";
import { TornCard, Pin, RedString, Stamp } from "../../crime/components/Pieces";
import { Reveal } from "../../crime/components/Text";
import { Flashes } from "../../crime/components/Atmosphere";
import { SkullIcon, IcemanIcon, TabletIcon, VialIcon, SickleIcon } from "../icons";

const ICONS = [SkullIcon, IcemanIcon, TabletIcon, VialIcon, SickleIcon];

// Fast slam-in cold open: five case icons snap onto the board, connected by
// red string, then the title lands hard. Mirrors the punchy hook used on
// the channel's first video (retention: land the promise in <1s).
export const ColdOpen: React.FC<{ titleFrame: number }> = ({ titleFrame }) => {
  const frame = useCurrentFrame();
  const slam = interpolate(frame, [0, 14], [1.3, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  const positions = [
    { x: 180, y: 120 },
    { x: 560, y: 90 },
    { x: 960, y: 130 },
    { x: 1340, y: 90 },
    { x: 1680, y: 130 },
  ];

  return (
    <AbsoluteFill>
      <Flashes at={[0, titleFrame]} peak={0.3} />
      <AbsoluteFill style={{ transform: `scale(${slam})`, transformOrigin: "center" }}>
        {positions.map((p, i) => {
          const Icon = ICONS[i];
          const appear = interpolate(frame, [i * 4, i * 4 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ opacity: appear, transform: `scale(${interpolate(appear, [0, 1], [0.6, 1])})` }}>
              <TornCard width={200} height={200} x={p.x} y={p.y} rotate={(i - 2) * 4} seed={i + 1}>
                <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
                  <Icon size={130} color={CC.ink} />
                </AbsoluteFill>
              </TornCard>
              <Pin x={p.x + 80} y={p.y - 14} color={i % 2 === 0 ? CC.red : CC.bone} size={30} />
            </div>
          );
        })}
        <RedString x1={280} y1={220} x2={660} y2={190} sag={20} />
        <RedString x1={660} y1={190} x2={1060} y2={230} sag={20} />
        <RedString x1={1060} y1={230} x2={1440} y2={190} sag={20} />
        <RedString x1={1440} y1={190} x2={1780} y2={230} sag={20} />

        <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <Stamp color={CC.red} rotate={-5} size={30}>Case File 001</Stamp>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Reveal text="THE FIRST CRIMES" delay={titleFrame} size={150} color={CC.bone} weight={800} font={CFONT.display} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Reveal text="CipherStudios" delay={titleFrame + 8} size={44} color={CC.red} font={CFONT.stamp} letterSpacing={4} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
