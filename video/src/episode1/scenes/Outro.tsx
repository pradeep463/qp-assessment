import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";
import { CaseDefs, Board, Grain, Flashes } from "../../crime/components/Atmosphere";
import { TornCard, Pin, Stamp } from "../../crime/components/Pieces";
import { Reveal } from "../../crime/components/Text";
import { LikeIcon, SubscribeIcon, ShareIcon } from "../outroIcons";
import bookends from "../bookends-timing.json";

const toFrame = (s: number, fps: number) => Math.round(s * fps);

const ACTIONS = [
  { Icon: LikeIcon, label: "LIKE" },
  { Icon: SubscribeIcon, label: "SUBSCRIBE" },
  { Icon: ShareIcon, label: "SHARE" },
];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = (bookends as any).outro.lines as { start: number; end: number; text: string }[];
  const f = (i: number) => toFrame(lines[i].start, fps);

  const rowIn = spring({ frame: frame - f(1), fps, config: { damping: 14, mass: 0.6 } });
  const weeklyIn = spring({ frame: frame - f(2), fps, config: { damping: 14, mass: 0.6 } });
  const seeYouIn = spring({ frame: frame - f(3), fps, config: { damping: 14, mass: 0.6 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0B09" }}>
      <CaseDefs />
      <Board />
      <Flashes at={[f(0), f(1), f(2), f(3)]} peak={0.16} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}>
        <Reveal text="THANKS FOR WATCHING." delay={f(0)} size={70} color={CC.bone} font={CFONT.display} style={{ justifyContent: "center" }} />
      </div>

      {ACTIONS.map(({ Icon, label }, i) => {
        const cardX = 560 + i * 320;
        const cardY = 330;
        return (
          <div
            key={i}
            style={{
              opacity: rowIn,
              transform: `translateY(${interpolate(rowIn, [0, 1], [40, 0])}px)`,
            }}
          >
            <TornCard width={220} height={220} x={cardX} y={cardY} rotate={(i - 1) * 3} seed={i + 60}>
              <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
                <Icon size={110} color={CC.ink} />
              </AbsoluteFill>
            </TornCard>
            <Pin x={cardX + 90} y={cardY - 14} color={CC.red} size={28} />
            <div
              style={{
                position: "absolute",
                left: cardX,
                top: cardY + 232,
                width: 220,
                textAlign: "center",
                fontFamily: CFONT.stamp,
                fontSize: 24,
                color: CC.boneDim,
                letterSpacing: 3,
              }}
            >
              {label}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 700,
          textAlign: "center",
          opacity: weeklyIn,
        }}
      >
        <Stamp color={CC.red} rotate={-3} size={28}>New case files weekly</Stamp>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 800,
          textAlign: "center",
          opacity: seeYouIn,
          transform: `translateY(${interpolate(seeYouIn, [0, 1], [20, 0])}px)`,
        }}
      >
        <div style={{ fontFamily: CFONT.display, fontStyle: "italic", fontSize: 38, color: CC.boneDim }}>
          See you in the next one.
        </div>
        <div style={{ marginTop: 20, fontFamily: CFONT.stamp, fontSize: 22, color: CC.inkSoft, letterSpacing: 4 }}>
          CIPHERSTUDIOS TC
        </div>
      </div>

      <Grain />
      <Audio src={staticFile("outro.mp3")} />
    </AbsoluteFill>
  );
};
