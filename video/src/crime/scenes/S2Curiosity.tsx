import React from "react";
import { AbsoluteFill } from "remotion";
import { CC, CFONT } from "../theme";
import { TornCard, Pin, Stamp } from "../components/Pieces";
import { Reveal, Typewriter } from "../components/Text";
import { SceneWrap } from "../components/SceneKit";

// S2 — morbid curiosity is an adaptation, not a pathology.
export const S2Curiosity: React.FC = () => (
  <SceneWrap zoomFrom={1.0} zoomTo={1.06} panX={-16}>
    <AbsoluteFill>
      {/* suspect photo, left */}
      <TornCard width={520} height={620} x={150} y={230} rotate={-3} seed={5}>
        <div style={{ position: "absolute", inset: 34 }}>
          <div style={{ width: "100%", height: 420, background: CC.boardDeep, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <svg width="300" height="340" viewBox="0 0 160 180"><path d="M80 30 Q120 30 120 80 Q120 120 80 130 Q40 120 40 80 Q40 30 80 30 Z M20 180 Q20 130 80 128 Q140 130 140 180 Z" fill="#282019" /></svg>
          </div>
          <div style={{ marginTop: 20, fontFamily: CFONT.stamp, fontSize: 22, color: CC.inkSoft, letterSpacing: 3 }}>THE MINDS OF</div>
          <div style={{ fontFamily: CFONT.stamp, fontSize: 22, color: CC.red, letterSpacing: 3 }}>DANGEROUS PEOPLE</div>
        </div>
      </TornCard>
      <Pin x={400} y={218} color={CC.red} />

      {/* text, right */}
      <div style={{ position: "absolute", left: 780, top: 300, width: 980 }}>
        <Stamp color={CC.boneDim} rotate={-4} size={26}>Finding 01</Stamp>
        <div style={{ height: 34 }} />
        <Reveal text="It's not a flaw." delay={8} size={92} color={CC.bone} weight={700} />
        <Reveal text="It's an adaptation." delay={16} size={92} color={CC.red} weight={700} />
        <div style={{ marginTop: 34, width: 900 }}>
          <Typewriter
            text="Morbid curiosity is your brain running threat simulations — rehearsing real danger from a place of total safety."
            startAt={40}
            cps={40}
            size={34}
            color={CC.boneDim}
            font={CFONT.sans}
            weight={400}
            letterSpacing={0}
            cursor={false}
            style={{ lineHeight: 1.5 }}
          />
        </div>
        <div style={{ marginTop: 26, fontFamily: CFONT.display, fontStyle: "italic", fontSize: 26, color: CC.inkSoft }}>
          — Scrivner, Recreational Fear Lab
        </div>
      </div>
    </AbsoluteFill>
  </SceneWrap>
);
