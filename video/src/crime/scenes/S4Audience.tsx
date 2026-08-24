import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../theme";
import { Stamp } from "../components/Pieces";
import { Reveal } from "../components/Text";
import { SceneWrap } from "../components/SceneKit";

const Stat: React.FC<{ target: number; label: string; delay: number; color: string; h: number }> = ({ target, label, delay, color, h }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 12, mass: 0.6, stiffness: 140 } });
  const val = Math.round(interpolate(p, [0, 1], [0, target]));
  const barH = interpolate(p, [0, 1], [0, h]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: 460 }}>
      <div style={{ fontFamily: CFONT.heavy, fontSize: 110, color, lineHeight: 1 }}>{val}%</div>
      <div style={{ width: 150, height: barH, background: color, marginTop: 18, boxShadow: "0 8px 18px rgba(0,0,0,0.5)" }} />
      <div style={{ fontFamily: CFONT.stamp, fontSize: 26, color: CC.boneDim, marginTop: 16, letterSpacing: 2 }}>{label}</div>
    </div>
  );
};

// S4 — who is really watching, and why.
export const S4Audience: React.FC = () => (
  <SceneWrap zoomFrom={1.0} zoomTo={1.05}>
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 130 }}>
        <Stamp color={CC.boneDim} rotate={-4} size={26}>Finding 03</Stamp>
      </div>
      <div style={{ position: "absolute", left: 150, top: 190, width: 1100 }}>
        <Reveal text="Who's really watching?" delay={6} size={72} color={CC.bone} font={CFONT.display} />
      </div>

      <div style={{ position: "absolute", left: 200, top: 360, display: "flex", gap: 120, alignItems: "flex-end" }}>
        <Stat target={44} label="WOMEN" delay={20} color={CC.red} h={300} />
        <Stat target={23} label="MEN" delay={30} color={CC.boneDim} h={157} />
      </div>

      <div style={{ position: "absolute", left: 780, top: 430, width: 980 }}>
        <Reveal text="Women follow true crime nearly twice as often as men." delay={40} size={46} color={CC.bone} font={CFONT.display} lineHeight={1.2} />
        <div style={{ marginTop: 26 }}>
          <Reveal text="Not morbid — learning to survive." delay={54} size={40} color={CC.red} font={CFONT.display} style={{ fontStyle: "italic" }} />
        </div>
        <div style={{ marginTop: 30, fontFamily: CFONT.stamp, fontSize: 22, color: CC.inkSoft, letterSpacing: 1 }}>
          PEW RESEARCH CENTER · 2023
        </div>
      </div>
    </AbsoluteFill>
  </SceneWrap>
);
