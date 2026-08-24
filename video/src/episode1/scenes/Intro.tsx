import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";
import { TornCard, Stamp } from "../../crime/components/Pieces";
import { Reveal } from "../../crime/components/Text";
import { SkullIcon, IcemanIcon, TabletIcon, VialIcon, SickleIcon } from "../icons";

const ICONS = [SkullIcon, IcemanIcon, TabletIcon, VialIcon, SickleIcon];
const DEFAULT_LABELS = ["MURDER", "COLD CASE", "LAW", "SERIAL KILLER", "FORENSICS"];

// Sets up the promise of the episode: five firsts, previewed as a row of
// case cards, then a short credibility beat ("sources, not legend").
export const Intro: React.FC<{
  cardFrame: number;
  welcomeFrame: number;
  heading?: string;
  labels?: string[];
  sourcesNotLegend?: string;
}> = ({ cardFrame, welcomeFrame, heading = "5 FIRSTS.", labels = DEFAULT_LABELS, sourcesNotLegend = "Sources, not legend" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}>
        <Reveal text={heading} size={100} color={CC.bone} font={CFONT.display} style={{ justifyContent: "center" }} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 280, display: "flex", justifyContent: "center", gap: 48 }}>
        {ICONS.map((Icon, i) => {
          const s = spring({ frame: frame - cardFrame - i * 6, fps, config: { damping: 16, mass: 0.6, stiffness: 150 } });
          return (
            <div key={i} style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`, textAlign: "center" }}>
              <TornCard width={220} height={220} x={0} y={0} rotate={(i - 2) * 2} seed={i + 20}>
                <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
                  <Icon size={140} color={CC.ink} />
                </AbsoluteFill>
              </TornCard>
              <div style={{ marginTop: 250, fontFamily: CFONT.stamp, fontSize: 20, color: CC.boneDim, letterSpacing: 2 }}>
                {labels[i]}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 130, textAlign: "center" }}>
        <div style={{ opacity: interpolate(frame, [welcomeFrame, welcomeFrame + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Stamp color={CC.boneDim} rotate={-3} size={26}>{sourcesNotLegend}</Stamp>
        </div>
      </div>
    </AbsoluteFill>
  );
};
