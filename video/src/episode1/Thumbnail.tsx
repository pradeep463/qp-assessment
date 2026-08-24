import React from "react";
import { AbsoluteFill } from "remotion";
import { CC, CFONT } from "../crime/theme";
import { CaseDefs, Board } from "../crime/components/Atmosphere";
import { TornCard, Pin, RedString, Stamp } from "../crime/components/Pieces";
import { SkullIcon } from "./icons";

// Static 1280x720 YouTube thumbnail. High contrast, one dramatic image,
// minimal text (per the channel's own retention research: 3-4 words, an
// emotive focal point, high contrast beats a specific hue).
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0C0B09" }}>
    <CaseDefs />
    <Board />

    <TornCard width={430} height={430} x={70} y={140} rotate={-3} seed={9}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <SkullIcon size={300} color={CC.ink} />
      </AbsoluteFill>
    </TornCard>
    <Pin x={260} y={122} color={CC.red} size={46} />

    <RedString x1={500} y1={340} x2={640} y2={300} sag={16} />

    <div style={{ position: "absolute", left: 640, top: 130 }}>
      <Stamp color={CC.red} rotate={-4} size={30}>Case File 001</Stamp>
    </div>

    <div style={{ position: "absolute", left: 636, top: 210, width: 610 }}>
      <div style={{ fontFamily: CFONT.display, fontWeight: 800, fontSize: 108, color: CC.bone, lineHeight: 0.98 }}>
        THE FIRST
      </div>
      <div style={{ fontFamily: CFONT.display, fontWeight: 800, fontSize: 108, color: CC.red, lineHeight: 0.98 }}>
        CRIMES
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        left: 636,
        top: 540,
        fontFamily: CFONT.stamp,
        fontSize: 30,
        color: CC.boneDim,
        letterSpacing: 3,
      }}
    >
      430,000 YEARS OF EVIDENCE
    </div>

    <div
      style={{
        position: "absolute",
        right: 40,
        bottom: 28,
        fontFamily: CFONT.stamp,
        fontSize: 26,
        color: CC.inkSoft,
        letterSpacing: 4,
      }}
    >
      CIPHERSTUDIOS TC
    </div>
  </AbsoluteFill>
);
