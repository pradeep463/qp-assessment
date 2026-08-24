import React from "react";
import { interpolate } from "remotion";
import { useStageHelpers } from "../components/CaseKit";
import { ExcavationDiagram, PeopleGrid, SkullWoundDiagram, AccidentComparison, YearCounter, DisputedMark } from "./case1";
import { MountainScene, ArrowStrikeDiagram, DefensiveWoundDiagram, ColdCaseStamp } from "./case3";
import { TabletReveal, ScaleDiagram, OffenseList, GavelStrike } from "./case4";
import { PlantVialDiagram, PoisonAttempts, TallyDiagram } from "./case5";
import { PeopleGrid as StudentsGrid } from "./case1";
import { BookReveal, SickleLineup, ForensicConfirm } from "./case6";

type DiagramProps = { width: number; height: number };

// Case 01 — Atapuerca / "the oldest murder." Excavation shaft -> the 28
// individuals populating in -> Cranium 17's two wounds -> the accident vs.
// intentional comparison -> the 430,000-year scale resolving into the
// species name -> the honest "disputed" beat.
export const Case2Diagram: React.FC<DiagramProps> = ({ width, height }) => {
  const { frame, f, stageOpacity } = useStageHelpers();
  const excavationOp = stageOpacity(0.3, 11.3);
  const peopleOp = stageOpacity(11.3, 24.4);
  const skullOp = stageOpacity(24.4, 50.2);
  const comparisonOp = stageOpacity(50.2, 61.2);
  const yearsOp = stageOpacity(61.2, 87.5, true);
  const disputedOp = interpolate(frame, [f(87.5), f(87.5) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width, height }}>
      <div style={{ position: "absolute", inset: 0, opacity: excavationOp }}>
        <ExcavationDiagram appearAt={f(0.3)} width={width} height={height} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: peopleOp }}>
        <PeopleGrid count={28} appearAt={f(11.3)} width={width} height={height * 0.72} highlightIndex={frame > f(19.5) ? 16 : undefined} />
      </div>
      <div style={{ position: "absolute", left: 0, top: height * 0.06, opacity: skullOp * (1 - comparisonOp) * (1 - yearsOp) }}>
        <SkullWoundDiagram width={width * 0.6} wound1At={f(28)} wound2At={f(32.4)} />
      </div>
      <div style={{ position: "absolute", left: 0, top: height * 0.28, opacity: comparisonOp * (1 - yearsOp) }}>
        <AccidentComparison appearAt={f(50.2)} resolveAt={f(57)} width={width} height={height * 0.34} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: yearsOp * (1 - disputedOp) }}>
        <YearCounter
          width={width}
          height={height}
          appearAt={f(61.2)}
          target={430000}
          countLabel="YEARS OLD"
          subAt={f(73.4)}
          subLabel="Homo heidelbergensis"
        />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: disputedOp }}>
        <DisputedMark width={width} height={height} appearAt={f(87.5)} />
      </div>
    </div>
  );
};

// Case 02 — Ötzi / "the oldest cold case." A frozen mountain scene ticking
// to 5,300 years -> the arrow striking from behind -> the defensive hand
// wound -> the case-folder stamped OPEN.
export const Case3Diagram: React.FC<DiagramProps> = ({ width, height }) => {
  const { frame, f, stageOpacity } = useStageHelpers();
  const mountainOp = stageOpacity(0.3, 28.5);
  const arrowOp = stageOpacity(28.5, 58.6);
  const woundOp = stageOpacity(58.6, 77.8);
  const stampOp = interpolate(frame, [f(77.8), f(77.8) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width, height }}>
      <div style={{ position: "absolute", inset: 0, opacity: mountainOp }}>
        <MountainScene appearAt={f(0.3)} ageAt={f(8.4)} width={width} height={height} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: arrowOp }}>
        <ArrowStrikeDiagram width={width} height={height} arrowAt={f(28.5)} impactAt={f(38.7)} />
      </div>
      <div style={{ position: "absolute", left: width * 0.26, top: 0, opacity: woundOp * (1 - stampOp) }}>
        <DefensiveWoundDiagram width={width * 0.48} height={height} appearAt={f(58.6)} />
      </div>
      <div style={{ position: "absolute", left: width * 0.24, top: height * 0.16, opacity: stampOp }}>
        <ColdCaseStamp width={width * 0.52} height={height * 0.6} appearAt={f(77.8)} />
      </div>
    </div>
  );
};

// Case 03 — Code of Ur-Nammu / "the first law." A clay tablet being carved
// -> a balance scale showing punishment scaled to the crime -> the short
// list of what was actually capital -> a single gavel strike.
export const Case4Diagram: React.FC<DiagramProps> = ({ width, height }) => {
  const { frame, f, stageOpacity } = useStageHelpers();
  const tabletOp = stageOpacity(0.0, 22.5);
  const scaleOp = stageOpacity(22.5, 34.2);
  const offenseOp = stageOpacity(34.2, 53.5, true);
  const gavelOp = interpolate(frame, [f(53.5), f(53.5) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width, height }}>
      <div style={{ position: "absolute", inset: 0, opacity: tabletOp }}>
        <TabletReveal width={width} height={height} appearAt={f(0.0)} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: scaleOp }}>
        <ScaleDiagram width={width} height={height} appearAt={f(22.5)} />
      </div>
      <div style={{ position: "absolute", left: width * 0.06, top: height * 0.1, width: width * 0.88, opacity: offenseOp * (1 - gavelOp) }}>
        <OffenseList width={width * 0.88} height={height * 0.8} appearAt={f(34.2)} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: gavelOp }}>
        <GavelStrike width={width} height={height} appearAt={f(53.5)} />
      </div>
    </div>
  );
};

// Case 04 — Locusta / "the first serial killer." A plant-and-vial reveal
// -> the two poisoning attempts -> the poison school (a students grid,
// reusing the same populate-one-at-a-time visual from Case 01) -> a
// growing victim tally.
export const Case5Diagram: React.FC<DiagramProps> = ({ width, height }) => {
  const { frame, f, stageOpacity } = useStageHelpers();
  const plantOp = stageOpacity(0.0, 17.1);
  const attemptsOp = stageOpacity(17.1, 46.1);
  const schoolOp = stageOpacity(46.1, 65.8);
  const tallyOp = interpolate(frame, [f(65.8), f(65.8) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width, height }}>
      <div style={{ position: "absolute", inset: 0, opacity: plantOp }}>
        <PlantVialDiagram width={width} height={height} appearAt={f(0.0)} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: attemptsOp }}>
        <PoisonAttempts width={width} height={height * 0.7} attempt1At={f(17.1)} attempt2At={f(28.1)} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: schoolOp * (1 - tallyOp) }}>
        <StudentsGrid count={12} appearAt={f(46.1)} width={width} height={height * 0.78} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: tallyOp }}>
        <TallyDiagram width={width} height={height} appearAt={f(65.8)} count={3} />
      </div>
    </div>
  );
};

// Case 05 — Song Ci / "the first forensic scientist." The Washing Away of
// Wrongs opening -> the sickle lineup with flies converging on the guilty
// blade -> a closing confirmation mark.
export const Case6Diagram: React.FC<DiagramProps> = ({ width, height }) => {
  const { frame, f, stageOpacity } = useStageHelpers();
  const bookOp = stageOpacity(0.0, 23.9);
  const sickleOp = stageOpacity(23.9, 59.6, true);
  const confirmOp = interpolate(frame, [f(59.6), f(59.6) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width, height }}>
      <div style={{ position: "absolute", inset: 0, opacity: bookOp }}>
        <BookReveal width={width} height={height} appearAt={f(0.0)} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: sickleOp * (1 - confirmOp) }}>
        <SickleLineup width={width} height={height} appearAt={f(23.9)} guiltyIndex={4} flyAt={f(44.6)} />
      </div>
      <div style={{ position: "absolute", left: width * 0.28, top: height * 0.24, opacity: confirmOp }}>
        <ForensicConfirm width={width * 0.44} height={height * 0.44} appearAt={f(59.6)} />
      </div>
    </div>
  );
};

export const CASE_DIAGRAMS: Record<number, React.FC<DiagramProps>> = {
  2: Case2Diagram,
  3: Case3Diagram,
  4: Case4Diagram,
  5: Case5Diagram,
  6: Case6Diagram,
};

// Narrative "field notes" one-liners — a second, slower register that fills
// the board without repeating the terse fact tags or the verbatim
// narration (Redundancy Principle: don't duplicate audio as on-screen
// text). Times are seconds relative to each case's start.
export const CASE_FIELD_NOTES: Record<number, { at: number; text: string }[]> = {
  2: [
    { at: 1.5, text: "A shaft, sealed for centuries." },
    { at: 13.0, text: "Thousands of years of burials, in one pit." },
    { at: 26.0, text: "One skull, reassembled from 52 fragments." },
    { at: 34.5, text: "Two blows. The same object, twice." },
    { at: 52.0, text: "Forensics doesn't guess. It measures." },
    { at: 63.0, text: "Older than our own species." },
    { at: 88.0, text: "Not every expert agrees. That's the honest part." },
  ],
  3: [
    { at: 1.5, text: "The ice kept him better than any morgue." },
    { at: 9.0, text: "Skin, organs, even his last meal." },
    { at: 29.5, text: "An X-ray found what an autopsy missed." },
    { at: 39.5, text: "One arrow. No warning." },
    { at: 59.5, text: "His hand tells a story from days earlier." },
    { at: 78.5, text: "Full file. Known weapon. No suspect." },
  ],
  4: [
    { at: 1.0, text: "Written down, so no one could argue what the rule was." },
    { at: 23.0, text: "Not every wrong was worth a life." },
    { at: 35.0, text: "But some were, and the code said so plainly." },
    { at: 54.0, text: "The first time a society defined a crime in advance." },
  ],
  5: [
    { at: 1.0, text: "She knew exactly how much was too much." },
    { at: 18.0, text: "The first dose taught her something. She used it." },
    { at: 47.0, text: "An empire's most protected killer ran a classroom." },
    { at: 66.5, text: "Repeatable method. Multiple victims. No court." },
  ],
  6: [
    { at: 1.0, text: "Seven centuries before crime labs, a coroner wrote the book." },
    { at: 25.0, text: "Every blade looked identical. He knew one wasn't." },
    { at: 45.5, text: "What a cloth wipes clean, a fly can still smell." },
    { at: 60.5, text: "No torture. No witness. Just a detail he missed." },
  ],
};

// Hindi field notes — same case-relative timings as the English set (a
// small, deliberate simplification: Hindi narration runs longer per case,
// so these drift a little relative to the actual Hindi beat timestamps,
// but the fact-tag cards and case/transition durations that matter most for
// audio sync are driven directly from timing.hi.json, not from these).
export const CASE_FIELD_NOTES_HI: Record<number, { at: number; text: string }[]> = {
  2: [
    { at: 1.5, text: "सदियों से बंद एक गड्ढा।" },
    { at: 13.0, text: "हज़ारों सालों की कब्रें, एक ही गड्ढे में।" },
    { at: 26.0, text: "एक खोपड़ी, बावन टुकड़ों से जोड़ी गई।" },
    { at: 34.5, text: "दो वार। एक ही चीज़, दो बार।" },
    { at: 52.0, text: "फोरेंसिक अंदाज़ा नहीं लगाता। नापता है।" },
    { at: 63.0, text: "हमारी अपनी प्रजाति से भी पुराना।" },
    { at: 88.0, text: "हर विशेषज्ञ सहमत नहीं। यही ईमानदार सच है।" },
  ],
  3: [
    { at: 1.5, text: "बर्फ़ ने उसे किसी मुर्दाघर से बेहतर सुरक्षित रखा।" },
    { at: 9.0, text: "त्वचा, अंग, यहाँ तक कि आखिरी भोजन भी।" },
    { at: 29.5, text: "एक्स-रे ने वह पाया, जो पोस्टमार्टम से छूट गया।" },
    { at: 39.5, text: "एक तीर। कोई चेतावनी नहीं।" },
    { at: 59.5, text: "उसका हाथ, कुछ दिन पहले की कहानी बताता है।" },
    { at: 78.5, text: "पूरी फ़ाइल। ज्ञात हथियार। कोई संदिग्ध नहीं।" },
  ],
  4: [
    { at: 1.0, text: "लिखा गया, ताकि कोई नियम पर बहस न कर सके।" },
    { at: 23.0, text: "हर गलती जान लेने लायक नहीं थी।" },
    { at: 35.0, text: "पर कुछ थीं, और संहिता ने साफ़ कहा।" },
    { at: 54.0, text: "पहली बार, समाज ने अपराध को पहले से परिभाषित किया।" },
  ],
  5: [
    { at: 1.0, text: "उसे पता था, कितना ज़्यादा है।" },
    { at: 18.0, text: "पहली खुराक ने उसे कुछ सिखाया। उसने इस्तेमाल किया।" },
    { at: 47.0, text: "साम्राज्य की सबसे सुरक्षित हत्यारी, एक क्लासरूम चलाती थी।" },
    { at: 66.5, text: "दोहराया गया तरीका। कई पीड़ित। कोई अदालत नहीं।" },
  ],
  6: [
    { at: 1.0, text: "क्राइम लैब से सात सदियों पहले, एक कोरोनर ने किताब लिखी।" },
    { at: 25.0, text: "हर ब्लेड एक जैसा दिखता था। वह जानता था, एक अलग है।" },
    { at: 45.5, text: "जो कपड़ा पोंछकर साफ़ कर दे, मक्खी फिर भी सूंघ लेती है।" },
    { at: 60.5, text: "कोई यातना नहीं। कोई गवाह नहीं। बस एक चूक, जो उससे छूट गई।" },
  ],
};
