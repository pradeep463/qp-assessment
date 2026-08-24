import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";
import { CaseDefs, Board, Grain, Flashes } from "../../crime/components/Atmosphere";
import { TornCard, Pin, RedString, Stamp } from "../../crime/components/Pieces";
import { Reveal } from "../../crime/components/Text";
import { ExcavationDiagram, PeopleGrid, SkullWoundDiagram, AccidentComparison } from "../diagrams/case1";
import { FieldNotes, FactTag } from "../components/CaseKit";

// Beat marks pulled from the real synthesized audio (src/episode1/timing.json,
// case===2, relative to that case's start) so this preview stays in sync with
// actual narration, exactly like the main episode's beat-driven timing.
const SEC = {
  excavation: 0.3,
  peopleGrid: 11.5,
  highlight: 24.6,
  wound1: 33.0,
  wound2: 36.0,
  comparisonIn: 43.0,
  comparisonResolve: 50.4,
};

const CARDS: { at: number; text: string }[] = [
  { at: 0.0, text: "ATAPUERCA, SPAIN · 1984" },
  { at: 11.3, text: "28 INDIVIDUALS" },
  { at: 24.4, text: "CRANIUM 17" },
  { at: 32.4, text: "2 WOUNDS · SAME SHAPE" },
  { at: 50.2, text: "NOT AN ACCIDENT" },
];

// A running "field notes" line beneath the fact tag — fills the right side
// with something that keeps changing (not just a static block of empty
// board) and adds a second, more narrative register alongside the terse
// fact tags.
const NOTES: { at: number; text: string }[] = [
  { at: 1.5, text: "A shaft, sealed for centuries." },
  { at: 13.0, text: "Thousands of years of burials, in one pit." },
  { at: 26.0, text: "One skull, reassembled from 52 fragments." },
  { at: 34.5, text: "Two blows. The same object, twice." },
  { at: 52.0, text: "Forensics doesn't guess. It measures." },
];

export const Case1Preview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  const stageOpacity = (start: number, end: number, out: number) =>
    interpolate(frame, [f(start), f(start) + 8, f(end) - 8, f(end)], [0, 1, 1, out === 1 ? 1 : 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const excavationOp = stageOpacity(SEC.excavation, SEC.peopleGrid, 0);
  const peopleOp = stageOpacity(SEC.peopleGrid, SEC.highlight + 3, 0);
  const skullOp = interpolate(frame, [f(SEC.highlight + 1), f(SEC.highlight + 4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const comparisonOp = interpolate(frame, [f(SEC.comparisonIn), f(SEC.comparisonIn) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cardBeats = CARDS.map((c) => ({ frame: f(c.at), card: c.text }));
  let activeCard: string | null = null;
  let activeIdx = -1;
  cardBeats.forEach((b, i) => {
    if (b.frame <= frame) {
      activeCard = b.card;
      activeIdx = i;
    }
  });

  const titleIn = spring({ frame, fps, config: { damping: 200, mass: 0.5, stiffness: 260 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0B09" }}>
      <CaseDefs />
      <Board />
      <Flashes at={cardBeats.map((b) => b.frame)} peak={0.14} />

      <TornCard width={170} height={140} x={-40} y={-35} rotate={-5} seed={15} color={CC.paperDark} />
      <TornCard width={150} height={150} x={1800} y={950} rotate={5} seed={16} color={CC.red} />

      {/* scatter accents — fills the board so the right side doesn't read
          as empty negative space, same "cluttered evidence wall" motif */}
      <TornCard width={90} height={90} x={1760} y={140} rotate={8} seed={31} color={CC.paperDark} />
      <TornCard width={110} height={80} x={1590} y={950} rotate={-6} seed={32} color={CC.red} />
      <Pin x={1795} y={128} color={CC.bone} size={22} />
      <Pin x={1625} y={938} color={CC.red} size={22} />

      {/* diagram zone: excavation -> people grid -> skull wounds -> comparison */}
      <TornCard width={560} height={560} x={110} y={300} rotate={-1.5} seed={20} color={CC.paper}>
        <AbsoluteFill style={{ padding: 60 }}>
          <div style={{ position: "absolute", inset: 60, opacity: excavationOp }}>
            <ExcavationDiagram appearAt={f(SEC.excavation) } width={440} height={440} />
          </div>
          <div style={{ position: "absolute", inset: 60, opacity: peopleOp }}>
            <PeopleGrid count={28} appearAt={f(SEC.peopleGrid)} width={440} height={300} highlightIndex={frame > f(SEC.highlight) ? 16 : undefined} />
          </div>
          <div style={{ position: "absolute", left: 60, top: 100, opacity: skullOp * (1 - comparisonOp * 0.85) }}>
            <SkullWoundDiagram width={300} wound1At={f(SEC.wound1)} wound2At={f(SEC.wound2)} />
          </div>
          <div style={{ position: "absolute", left: 30, top: 140, opacity: comparisonOp }}>
            <AccidentComparison appearAt={f(SEC.comparisonIn)} resolveAt={f(SEC.comparisonResolve)} width={470} height={170} />
          </div>
        </AbsoluteFill>
      </TornCard>
      <Pin x={370} y={288} color={CC.red} size={36} />

      <div style={{ position: "absolute", left: 130, top: 150 }}>
        <Stamp color={CC.red} rotate={-4} size={26}>CASE 01</Stamp>
      </div>

      <div style={{ position: "absolute", left: 740, top: 220, width: 1080, opacity: titleIn }}>
        <Reveal text="THE OLDEST MURDER" delay={0} size={78} color={CC.bone} font={CFONT.display} />
      </div>

      <RedString x1={670} y1={400} x2={800} y2={440} sag={16} />

      <div style={{ position: "absolute", left: 740, top: 400 }}>
        {activeCard && <FactTag key={activeIdx} text={activeCard} />}
      </div>

      <FieldNotes notes={NOTES} f={f} frame={frame} x={740} y={560} width={780} height={340} />

      <Grain />
      <Audio src={staticFile("case1-preview.mp3")} />
    </AbsoluteFill>
  );
};
