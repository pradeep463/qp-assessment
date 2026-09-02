import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { MapBoard, GeoPin } from "./MapBoard";
import { TimelineRibbon } from "./TimelineRibbon";
import { ArchivalPhoto } from "./ArchivalPhoto";
import { AC, AFONT } from "./theme";

type DiagramProps = { width: number; height: number };
type CardBeat = { frame: number; card: string | null };
type ArchivalPhotoSpec = { src: string; caption: string; atSec: number; durationSec: number; side?: "left" | "right" };

// Full-bleed redesign: the parchment dossier card is gone. The map fills the
// whole frame and the diagram floats directly on it at real scale — a scene,
// not a slide. Text is down to two things: a title caption and one fact-tag
// pill, both floating with a shadow instead of living inside a text-heavy
// card. The field note is cut entirely — it was flavor text competing for
// attention with everything else.
export const AtlasCaseScene: React.FC<{
  dossierLabel: string;
  title: string;
  Diagram: React.FC<DiagramProps>;
  pins: GeoPin[];
  focus: { x: number; y: number };
  cardBeats: CardBeat[];
  years: number[];
  activeYear: number;
  fromPin?: { lon: number; lat: number };
  revealAt?: number;
  EvidenceIcon?: React.FC<{ size: number; color: string }>;
  archivalPhotos?: ArchivalPhotoSpec[];
}> = ({ dossierLabel, title, Diagram, pins, focus, cardBeats, years, activeYear, fromPin, revealAt, EvidenceIcon, archivalPhotos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let activeCard: string | null = null;
  let activeIdx = -1;
  cardBeats.forEach((b, i) => {
    if (b.card && b.frame <= frame) { activeCard = b.card; activeIdx = i; }
  });

  const diagramIn = spring({ frame: frame - Math.round(fps * 0.5), fps, config: { damping: 18, mass: 0.8 } });
  const factIn = spring({ frame, fps, config: { damping: 14, mass: 0.5, stiffness: 200 } });
  // A slow, continuous idle drift on the whole diagram group — cheap (one
  // sine feeding a translateY on one already-composited group), but it's
  // the difference between the illustration reading as "alive" versus a
  // static image sitting on top of the map.
  const drift = Math.sin(frame * 0.045) * 6;

  const titleWords = title.split(" ");

  return (
    <AbsoluteFill style={{ backgroundColor: AC.parch }}>
      {/* Only the active pin keeps its label — with the diagram floating
          nearby, an inactive pin's label drifting underneath it would be
          unreadable clutter. Bookend scenes have no overlay in the way, so
          they keep every label. */}
      <MapBoard
        pins={pins.map((p) => (p.active ? p : { ...p, label: "" }))}
        zoomInAt={0.2}
        focus={focus}
        fromPin={fromPin}
        revealAt={revealAt}
        EvidenceIcon={EvidenceIcon}
      />

      {/* a quick punch-in at the very start of the case, marking the cut */}
      <AbsoluteFill style={{ background: AC.wax, opacity: interpolate(frame, [0, 2, 10], [0, 0.16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), pointerEvents: "none" }} />

      {/* small corner case-file tag — keeps the "field dossier" identity
          without a card's worth of chrome around it */}
      <div style={{ position: "absolute", left: 56, top: 44, fontFamily: AFONT.stamp, fontSize: 17, letterSpacing: 3, color: AC.waxDeep, opacity: interpolate(diagramIn, [0, 1], [0, 0.9]) }}>
        {dossierLabel}
      </div>

      {/* title as a floating caption, no card header behind it */}
      <div style={{ position: "absolute", left: 56, top: 78, maxWidth: 760, fontFamily: AFONT.display, fontSize: 58, color: AC.ink, lineHeight: 1.08, textShadow: `0 3px 0 ${AC.vellum}, 0 10px 22px rgba(43,32,19,0.35)` }}>
        {titleWords.map((w, i) => {
          const ws = spring({ frame: frame - i * 3, fps, config: { damping: 16, mass: 0.5, stiffness: 210 } });
          return (
            <span key={i} style={{ display: "inline-block", marginRight: 16, opacity: interpolate(ws, [0, 1], [0, 1]), transform: `translateY(${interpolate(ws, [0, 1], [22, 0])}px)` }}>
              {w}
            </span>
          );
        })}
      </div>

      {/* the diagram itself, at real scale, floating directly on the map —
          the halo filter (defined once, inline, since this is the only
          place that needs a *light* glow rather than the dark cshadow the
          rest of the atlas uses) is what keeps ink-line art legible against
          the map's mid-tone land color without boxing it in a card. */}
      <svg width={0} height={0}>
        <defs>
          <filter id="diagramHalo" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={AC.vellum} floodOpacity="0.9" />
            <feDropShadow dx="0" dy="0" stdDeviation="22" floodColor={AC.vellum} floodOpacity="0.55" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 230,
          width: 860,
          height: 620,
          opacity: interpolate(diagramIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(diagramIn, [0, 1], [26, drift])}px) scale(${interpolate(diagramIn, [0, 1], [0.92, 1])})`,
          filter: "url(#diagramHalo)",
        }}
      >
        <Diagram width={860} height={620} />
      </div>

      {/* one fact-tag pill, floating — the only other text on screen besides
          the title */}
      {activeCard && (
        <div
          key={activeIdx}
          style={{
            position: "absolute",
            left: 70,
            top: 870,
            transform: `translateY(${interpolate(factIn, [0, 1], [18, 0])}px)`,
            opacity: interpolate(factIn, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
            background: AC.wax,
            color: AC.vellum,
            fontFamily: AFONT.heavy,
            fontWeight: 900,
            fontSize: 27,
            letterSpacing: 1,
            padding: "14px 26px",
            boxShadow: "0 10px 24px rgba(0,0,0,0.4)",
          }}
        >
          {activeCard}
        </div>
      )}

      {archivalPhotos?.map((p, i) => <ArchivalPhoto key={i} {...p} />)}

      <TimelineRibbon years={years} activeYear={activeYear} />
    </AbsoluteFill>
  );
};
