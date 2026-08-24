import React from "react";
import { AbsoluteFill } from "remotion";
import { CC, CFONT } from "../theme";
import { TornCard, Pin, RedString, Stamp } from "../components/Pieces";
import { Reveal } from "../components/Text";
import { SweetSpotChart } from "../components/SweetSpotChart";
import { SceneWrap } from "../components/SceneKit";

const Node: React.FC<{ x: number; y: number; label: string; sub?: string; seed: number; rot: number; color?: string }> = ({ x, y, label, sub, seed, rot, color = CC.paper }) => (
  <TornCard width={300} height={130} x={x} y={y} rotate={rot} seed={seed} color={color}>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: CFONT.heavy, fontSize: 30, color: CC.ink, letterSpacing: 1 }}>{label}</div>
      {sub && <div style={{ fontFamily: CFONT.stamp, fontSize: 17, color: CC.redDark, marginTop: 6 }}>{sub}</div>}
    </div>
  </TornCard>
);

// S3 — the fear-safe paradox + the inverted-U "sweet spot".
export const S3Paradox: React.FC = () => (
  <SceneWrap zoomFrom={1.04} zoomTo={1.0}>
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 120 }}>
        <Stamp color={CC.red} rotate={-5} size={26}>Finding 02</Stamp>
      </div>
      <div style={{ position: "absolute", left: 150, top: 175, width: 1200 }}>
        <Reveal text="Fear turns to thrill — through a paradox." delay={6} size={58} color={CC.bone} font={CFONT.display} />
      </div>

      {/* flow of nodes with red string */}
      <RedString x1={300} y1={430} x2={620} y2={430} sag={26} />
      <RedString x1={770} y1={430} x2={1090} y2={430} sag={26} />
      <Node x={150} y={370} label="AMYGDALA" sub="adrenaline ↑" seed={11} rot={-3} />
      <Pin x={290} y={360} color={CC.red} />
      <Node x={620} y={370} label="CORTEX" sub={'"you are safe"'} seed={12} rot={2} />
      <Pin x={760} y={360} color={CC.bone} />
      <Node x={1090} y={370} label="DOPAMINE" sub="→ the high" seed={13} rot={-2} color={CC.paperDark} />
      <Pin x={1230} y={360} color={CC.red} />

      {/* chart */}
      <div style={{ position: "absolute", left: 1150, top: 560 }}>
        <SweetSpotChart width={640} height={430} delay={30} />
      </div>
      <div style={{ position: "absolute", left: 150, top: 640, width: 900 }}>
        <Reveal text="Too little fear is boring." delay={44} size={44} color={CC.boneDim} font={CFONT.display} />
        <div style={{ height: 12 }} />
        <Reveal text="Too much is overwhelming." delay={52} size={44} color={CC.red} font={CFONT.display} />
        <div style={{ marginTop: 30, fontFamily: CFONT.stamp, fontSize: 22, color: CC.inkSoft, letterSpacing: 1 }}>
          ANDERSEN ET AL. · PSYCHOLOGICAL SCIENCE 2020
        </div>
      </div>
    </AbsoluteFill>
  </SceneWrap>
);
