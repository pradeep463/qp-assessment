import React from "react";
import { AbsoluteFill } from "remotion";
import { CC, CFONT } from "../theme";
import { TornCard, Pin, RedString, Stamp, Redacted } from "../components/Pieces";
import { Typewriter, Reveal } from "../components/Text";
import { SceneWrap } from "../components/SceneKit";

// S1 — the hook. Evidence board assembles; open the loop in the first seconds.
export const S1Hook: React.FC = () => (
  <SceneWrap punch fin={3}>
    <AbsoluteFill>
      {/* pinned evidence around the edges */}
      <RedString x1={360} y1={300} x2={760} y2={430} sag={40} />
      <RedString x1={760} y1={430} x2={1250} y2={300} sag={40} />

      <TornCard width={300} height={330} x={230} y={250} rotate={-5} seed={3}>
        {/* redacted "suspect" photo */}
        <div style={{ position: "absolute", inset: 20 }}>
          <div style={{ width: "100%", height: 220, background: CC.boardDeep, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <svg width="160" height="180" viewBox="0 0 160 180"><path d="M80 30 Q120 30 120 80 Q120 120 80 130 Q40 120 40 80 Q40 30 80 30 Z M20 180 Q20 130 80 128 Q140 130 140 180 Z" fill="#26221b" /></svg>
          </div>
          <div style={{ marginTop: 12 }}>
            <Redacted width={240} height={24} reveal={0}><div /></Redacted>
          </div>
          <div style={{ marginTop: 8, fontFamily: CFONT.stamp, fontSize: 16, color: CC.inkSoft, letterSpacing: 2 }}>SUBJECT — CLASSIFIED</div>
        </div>
      </TornCard>
      <Pin x={370} y={238} color={CC.red} />

      <TornCard width={260} height={150} x={1160} y={250} rotate={4} seed={7}>
        <div style={{ position: "absolute", inset: 18, fontFamily: CFONT.stamp, color: CC.ink, fontSize: 18, lineHeight: 1.5 }}>
          EXHIBIT A<br />motive: unknown<br />witnesses: 0
        </div>
      </TornCard>
      <Pin x={1280} y={240} color={CC.bone} />

      {/* headline block */}
      <div style={{ position: "absolute", left: 300, top: 640, width: 1340 }}>
        <div style={{ marginBottom: 22, display: "flex", gap: 20, alignItems: "center" }}>
          <Stamp color={CC.red} rotate={-6}>Case File</Stamp>
          <Typewriter text="> why can't you look away?" startAt={4} cps={34} size={30} color={CC.redBright} />
        </div>
        <Reveal text="WHY WE CAN'T" delay={5} size={130} color={CC.bone} weight={700} letterSpacing={-1} />
        <Reveal text="LOOK AWAY" delay={10} size={130} color={CC.red} weight={700} letterSpacing={-1} />
        <div style={{ marginTop: 20 }}>
          <Reveal text="The psychology of crime & horror." delay={22} size={40} color={CC.boneDim} font={CFONT.display} style={{ fontStyle: "italic" }} />
        </div>
      </div>
    </AbsoluteFill>
  </SceneWrap>
);
