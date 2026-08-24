import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";
import { TornCard, Pin, RedString, Stamp } from "../../crime/components/Pieces";
import { Reveal } from "../../crime/components/Text";
import { Flashes } from "../../crime/components/Atmosphere";
import { CASE_META } from "../theme";
import { FieldNotes, FactTag } from "../components/CaseKit";

type Beat = { frame: number; card: string | null };
type FieldNote = { at: number; text: string };
type DiagramProps = { width: number; height: number };

// One "case file" segment: an animated diagram sequence on the left (built
// per-case in src/episode1/diagrams — an excavation, an arrow strike, a
// balance scale, a poison cup, a sickle lineup, whatever fits that case's
// evidence), the case title, a stack of short fact-tags that pop in as the
// narration actually reaches them, and a "field notes" card with a slower
// narrative line so the right side of the board never reads as empty.
export const CaseScene: React.FC<{
  caseId: number;
  Diagram: React.FC<DiagramProps>;
  fieldNotes: FieldNote[];
  beats: Beat[];
}> = ({ caseId, Diagram, fieldNotes, beats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const meta = CASE_META[caseId];

  const cardBeats = beats.filter((b) => b.card);
  let activeCard: string | null = null;
  let activeIdx = -1;
  for (let i = 0; i < cardBeats.length; i++) {
    if (cardBeats[i].frame <= frame) {
      activeCard = cardBeats[i].card;
      activeIdx = i;
    }
  }
  // NOTE: no continuous camera zoom here — a CSS transform:scale on this
  // full-viewport, many-child subtree is expensive to recomposite every
  // frame in this (software-rendered, no GPU) environment. Motion instead
  // comes from the diagram's own staged reveals, the periodic Flashes, and
  // each fact-tag popping in exactly when the narration reaches it.
  const titleIn = spring({ frame, fps, config: { damping: 200, mass: 0.5, stiffness: 260 } });

  return (
    <AbsoluteFill>
      <Flashes at={cardBeats.map((b) => b.frame)} peak={0.14} />
      <AbsoluteFill>
        {/* corner accents */}
        <TornCard width={170} height={140} x={-40} y={-35} rotate={-5} seed={caseId * 7 + 1} color={CC.paperDark} />
        <TornCard width={150} height={150} x={1800} y={950} rotate={5} seed={caseId * 7 + 2} color={CC.red} />

        {/* scatter accents — keeps the right side of the board from
            reading as empty negative space */}
        <TornCard width={90} height={90} x={1760} y={140} rotate={8} seed={caseId * 7 + 3} color={CC.paperDark} />
        <TornCard width={110} height={80} x={1590} y={950} rotate={-6} seed={caseId * 7 + 4} color={CC.red} />
        <Pin x={1795} y={128} color={CC.bone} size={22} />
        <Pin x={1625} y={938} color={CC.red} size={22} />

        {/* diagram card, left */}
        <TornCard width={560} height={560} x={110} y={300} rotate={-1.5} seed={caseId * 11} color={CC.paper}>
          <AbsoluteFill style={{ padding: 60 }}>
            <Diagram width={440} height={440} />
          </AbsoluteFill>
        </TornCard>
        <Pin x={370} y={288} color={CC.red} size={36} />

        {/* case index stamp */}
        <div style={{ position: "absolute", left: 130, top: 150 }}>
          <Stamp color={CC.red} rotate={-4} size={26}>{meta.label}</Stamp>
        </div>

        {/* title */}
        <div
          style={{
            position: "absolute",
            left: 740,
            top: 220,
            width: 1080,
            opacity: interpolate(titleIn, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(titleIn, [0, 1], [24, 0])}px)`,
          }}
        >
          <Reveal text={meta.title} delay={0} size={78} color={CC.bone} font={CFONT.display} />
        </div>

        {/* connecting string from diagram card to the fact-tag zone */}
        <RedString x1={670} y1={400} x2={800} y2={440} sag={16} />

        {/* fact tag — pops/replaces as narration reaches each beat */}
        <div style={{ position: "absolute", left: 740, top: 400 }}>
          {activeCard && <FactTag key={activeIdx} text={activeCard} />}
        </div>

        <FieldNotes notes={fieldNotes} f={f} frame={frame} x={740} y={560} width={780} height={340} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
