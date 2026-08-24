import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";
import { TornCard, Pin, RedString, Stamp } from "../../crime/components/Pieces";
import { Reveal } from "../../crime/components/Text";
import { Flashes } from "../../crime/components/Atmosphere";
import { CASE_META } from "../theme";

type Beat = { frame: number; card: string | null };

// One "case file" segment: an icon card on the left, the case title, and a
// stack of short fact-tags that pop in as the narration actually reaches
// them (frame numbers come from the real synthesized audio, so it's always
// in sync). A slow continuous zoom + periodic flashes keep it alive even
// when a case runs 60-100+ seconds.
export const CaseScene: React.FC<{
  caseId: number;
  Icon: React.FC<{ size: number; color?: string }>;
  beats: Beat[];
}> = ({ caseId, Icon, beats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
  // frame in this (software-rendered, no GPU) environment. At ~19,000
  // frames for the full episode that turned a ~30min render into ~2.5hrs
  // for a barely-visible effect. Motion instead comes from the periodic
  // Flashes and each fact-tag popping in exactly when the narration reaches
  // it — real engagement, not a decorative background drift.
  const titleIn = spring({ frame, fps, config: { damping: 200, mass: 0.5, stiffness: 260 } });

  return (
    <AbsoluteFill>
      <Flashes at={cardBeats.map((b) => b.frame)} peak={0.14} />
      <AbsoluteFill>
        {/* corner accents */}
        <TornCard width={170} height={140} x={-40} y={-35} rotate={-5} seed={caseId * 7 + 1} color={CC.paperDark} />
        <TornCard width={150} height={150} x={1800} y={950} rotate={5} seed={caseId * 7 + 2} color={CC.red} />

        {/* icon card, left */}
        <TornCard width={520} height={520} x={130} y={330} rotate={-1.5} seed={caseId * 11} color={CC.paper}>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <Icon size={340} color={CC.ink} />
          </AbsoluteFill>
        </TornCard>
        <Pin x={370} y={318} color={CC.red} size={36} />

        {/* case index stamp */}
        <div style={{ position: "absolute", left: 130, top: 150 }}>
          <Stamp color={CC.red} rotate={-4} size={26}>{meta.label}</Stamp>
        </div>

        {/* title */}
        <div
          style={{
            position: "absolute",
            left: 760,
            top: 240,
            width: 1060,
            opacity: interpolate(titleIn, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(titleIn, [0, 1], [24, 0])}px)`,
          }}
        >
          <Reveal text={meta.title} delay={0} size={78} color={CC.bone} font={CFONT.display} />
        </div>

        {/* connecting string from icon card to the fact-tag zone */}
        <RedString x1={650} y1={430} x2={780} y2={470} sag={16} />

        {/* fact tag — pops/replaces as narration reaches each beat */}
        <div style={{ position: "absolute", left: 760, top: 430 }}>
          {activeCard && (
            <FactTag key={activeIdx} text={activeCard} />
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FactTag: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, mass: 0.5, stiffness: 200 } });
  return (
    <div
      style={{
        display: "inline-block",
        transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
        opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
        background: CC.red,
        color: CC.bone,
        fontFamily: CFONT.heavy,
        fontWeight: 900,
        fontSize: 34,
        letterSpacing: 1,
        padding: "14px 26px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
      }}
    >
      {text}
    </div>
  );
};
