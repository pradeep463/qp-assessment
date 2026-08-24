import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../theme";
import { Stamp } from "../components/Pieces";
import { Reveal } from "../components/Text";
import { SceneWrap } from "../components/SceneKit";

const Beat: React.FC<{ n: string; head: string; sub: string; delay: number }> = ({ n, head, sub, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.7 } });
  return (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-start", marginBottom: 44, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)` }}>
      <div style={{ fontFamily: CFONT.heavy, fontSize: 64, color: CC.red, lineHeight: 0.9, minWidth: 90 }}>{n}</div>
      <div>
        <div style={{ fontFamily: CFONT.display, fontSize: 54, color: CC.bone, lineHeight: 1.05 }}>{head}</div>
        <div style={{ fontFamily: CFONT.sans, fontSize: 30, color: CC.boneDim, marginTop: 8 }}>{sub}</div>
      </div>
    </div>
  );
};

// S5 — the transferable craft principles.
export const S5Craft: React.FC = () => (
  <SceneWrap zoomFrom={1.05} zoomTo={1.0}>
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 120 }}>
        <Stamp color={CC.red} rotate={-5} size={28}>The Craft</Stamp>
      </div>
      <div style={{ position: "absolute", left: 150, top: 185, width: 1200 }}>
        <Reveal text="How the fear is built." delay={6} size={60} color={CC.bone} font={CFONT.display} />
      </div>
      <div style={{ position: "absolute", left: 170, top: 360, width: 1600 }}>
        <Beat n="01" head="Suspense beats surprise." sub="Show the audience the bomb — then let it tick." delay={18} />
        <Beat n="02" head="Sound scares more than the image." sub="Dissonance, infrasound, and weaponised silence." delay={30} />
        <Beat n="03" head="Open a loop — then close it." sub="Every question you raise, you must answer." delay={42} />
      </div>
    </AbsoluteFill>
  </SceneWrap>
);
