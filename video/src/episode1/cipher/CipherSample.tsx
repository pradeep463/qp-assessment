import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { project, LAND_D } from "../atlas/MapBoard";
import { LafargeDiagram } from "../diagrams/lafargeDiagram";
import { CT, CFONT } from "./theme";

// "Cold Case Terminal" theme sample — the same Lafarge case, real geography,
// reframed as a forensic case-management terminal instead of a parchment
// map: a cursor drives the zoom, a search field types the location, a data
// panel streams case facts, and a confidence bar loads to the verdict.
// Every beat below is frame-driven (interpolate/spring against useCurrentFrame),
// not CSS-loop animation, so it renders deterministically like the rest of
// the project — this file is a standalone proof-of-concept, not yet wired
// into Episode2.
const PIN = project(1.65, 45.35); // Le Glandier, France

const SEARCH_TEXT = "le glandier, fr";

const PANEL_ROWS: { label: string; value: string; hot?: boolean }[] = [
  { label: "SUBJECT", value: "Marie Lafarge" },
  { label: "METHOD", value: "Arsenic, Marsh test" },
  { label: "YEAR", value: "1840" },
  { label: "STATUS", value: "MATCH FOUND", hot: true },
];

export const CipherSample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  // Cursor glide: from a bottom-left start point to the pin's screen
  // position, holding at both ends so the motion itself reads clearly.
  const cursorStart: [number, number] = [width * 0.14, height * 0.78];
  const cursorGlide = interpolate(frame, [f(1.6), f(3.4)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cursorX = interpolate(cursorGlide, [0, 1], [cursorStart[0], PIN[0]]);
  const cursorY = interpolate(cursorGlide, [0, 1], [cursorStart[1], PIN[1]]);
  const clickFrame = f(3.4);
  const clickT = frame - clickFrame;
  const rippleOpacity = clickT >= 0 && clickT < 20 ? interpolate(clickT, [0, 20], [0.9, 0]) : 0;
  const rippleScale = clickT >= 0 && clickT < 20 ? interpolate(clickT, [0, 20], [0.4, 2.6]) : 0.4;

  // Typed search field, character by character, starting right as the click lands.
  const typeProgress = interpolate(frame, [clickFrame + 4, clickFrame + 4 + f(1.6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const typedChars = Math.round(typeProgress * SEARCH_TEXT.length);
  const searchShown = SEARCH_TEXT.slice(0, typedChars);

  // Pin ring pulse, only once the click has landed.
  const pinPulse = clickT >= 0 ? Math.exp(-clickT / 40) * Math.sin((clickT / 60) * Math.PI * 3) : 0;

  // Data panel rows, staggered spring-in starting once the search finishes typing.
  const panelStart = clickFrame + 4 + f(1.6) + f(0.3);

  // Confidence bar: fills after the panel rows have landed.
  const barStart = panelStart + f(1.5);
  const barProgress = interpolate(frame, [barStart, barStart + f(1.3)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const confidencePct = Math.round(barProgress * 94);

  const stampFrame = barStart + f(1.3) + f(0.2);
  const stampS = spring({ frame: frame - stampFrame, fps, config: { damping: 12, mass: 0.5 } });

  // Push in on the pin once it's found — a real camera move, not a static
  // wide shot sitting still for the rest of the scene. The cursor's job is
  // done once it triggers this, so it fades rather than trying to track
  // through the zoom transform.
  const zoomStart = clickFrame + f(0.2);
  const zoomDur = f(1.8);
  const zoomT = interpolate(frame, [zoomStart, zoomStart + zoomDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const mapScale = interpolate(zoomT, [0, 1], [1, 2.3]);
  const mapFocus = { x: width * 0.36, y: height * 0.5 };
  const mapTx = interpolate(zoomT, [0, 1], [0, mapFocus.x - PIN[0]]);
  const mapTy = interpolate(zoomT, [0, 1], [0, mapFocus.y - PIN[1]]);
  const cursorFade = interpolate(frame, [zoomStart, zoomStart + 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Scene change: once the verdict has landed, wipe from the map into the
  // actual evidence — the diagram that explains *why* the match was found,
  // not just that it was. A bright scan-bar sweep sells the cut as the
  // terminal switching views, not a hard jump cut.
  const wipeStart = stampFrame + f(0.8);
  const wipeDur = f(0.6);
  const wipeT = interpolate(frame, [wipeStart, wipeStart + wipeDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mapViewOpacity = interpolate(frame, [wipeStart, wipeStart + wipeDur * 0.7], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const evidenceStartSec = (wipeStart + wipeDur) / fps;
  const evidenceIn = spring({ frame: frame - (wipeStart + wipeDur), fps, config: { damping: 18, mass: 0.7 } });
  const stainAt = evidenceStartSec + 0.4;
  const convictedAt = evidenceStartSec + 2.1;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 130% at 30% 20%, #0F231C 0%, ${CT.bg} 70%)`, fontFamily: CFONT.sans }}>
      {/* grid */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.6 }}>
        {Array.from({ length: Math.ceil(width / 40) }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={height} stroke={CT.grid} strokeWidth={1} />
        ))}
        {Array.from({ length: Math.ceil(height / 40) }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 40} x2={width} y2={i * 40} stroke={CT.grid} strokeWidth={1} />
        ))}
      </svg>

      {/* map — zooms in on the pin once it's found, fades out into the evidence view */}
      <div style={{ position: "absolute", inset: 0, opacity: mapViewOpacity, transform: `translate(${mapTx}px, ${mapTy}px) scale(${mapScale})`, transformOrigin: `${PIN[0]}px ${PIN[1]}px` }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={LAND_D} fill={CT.land} stroke={CT.landLine} strokeWidth={1} />
          <line x1={cursorStart[0]} y1={cursorStart[1]} x2={PIN[0]} y2={PIN[1]} stroke={CT.accentDim} strokeWidth={1.5} strokeDasharray="5 5" opacity={0.6} />
          <circle cx={PIN[0]} cy={PIN[1]} r={20 + pinPulse * 14} fill="none" stroke={CT.amber} strokeWidth={1.5} opacity={clickT >= 0 ? Math.max(0, 0.5 - clickT / 90) : 0} />
          <circle cx={PIN[0]} cy={PIN[1]} r={7} fill={CT.amber} style={{ filter: `drop-shadow(0 0 10px ${CT.amber})` }} />
          <text x={PIN[0] - 10} y={PIN[1] - 20} fontFamily={CFONT.mono} fontSize={17} fill={CT.ink} letterSpacing={0.5}>
            LE GLANDIER, FR · 1840
          </text>
        </svg>
      </div>

      {/* evidence view — the actual diagram, recolored toward the terminal
          palette via a filter rather than forking the component, so the
          real Marsh-test illustration (already verified against reference
          material earlier in this project) stays the single source of truth */}
      <div
        style={{
          position: "absolute",
          left: "4%",
          top: "20%",
          width: "62%",
          height: "60%",
          opacity: interpolate(evidenceIn, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(evidenceIn, [0, 1], [24, 0])}px)`,
          filter: "grayscale(1) sepia(1) hue-rotate(70deg) saturate(3) brightness(1.15) drop-shadow(0 0 22px rgba(69,255,160,0.15))",
        }}
      >
        <LafargeDiagram width={780} height={560} stainAt={stainAt} convictedAt={convictedAt} disputedAt={convictedAt + 900} />
      </div>

      {/* scan-bar wipe marking the cut from map view to evidence view */}
      {wipeT > 0 && wipeT < 1 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${wipeT * 130 - 15}%`,
            width: "18%",
            background: `linear-gradient(90deg, transparent, ${CT.accent}, transparent)`,
            opacity: 0.85,
            zIndex: 50,
            pointerEvents: "none",
          }}
        />
      )}

      {/* title block — the eyebrow label crossfades from the dossier tag to
          the evidence tag in place, rather than stacking a second line, so
          the scene-change doesn't leave overlapping text behind */}
      <div style={{ position: "absolute", left: "4%", top: "16%", maxWidth: "44%" }}>
        <div style={{ position: "relative", height: 20, marginBottom: 8 }}>
          <div style={{ position: "absolute", fontFamily: CFONT.mono, fontSize: 15, letterSpacing: 3, color: CT.accent, opacity: 1 - interpolate(evidenceIn, [0, 1], [0, 1]) }}>FIELD DOSSIER — 001</div>
          <div style={{ position: "absolute", fontFamily: CFONT.mono, fontSize: 15, letterSpacing: 3, color: CT.accent, opacity: interpolate(evidenceIn, [0, 1], [0, 1]) }}>EVIDENCE — THE MARSH TEST</div>
        </div>
        <div style={{ fontFamily: CFONT.sans, fontWeight: 600, fontSize: 42, color: CT.ink, lineHeight: 1.15, textShadow: "0 2px 18px rgba(0,0,0,0.7)" }}>
          The First Poison Test
        </div>
      </div>

      {/* simulated cursor + click ripple — fades once it's done its job of triggering the zoom */}
      <div style={{ position: "absolute", left: cursorX, top: cursorY, width: 22, height: 22, opacity: cursorFade, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))" }}>
        <svg viewBox="0 0 24 24" width={22} height={22}>
          <path d="M4 2 L4 20 L9 15.5 L12.5 22 L15 20.5 L11.5 14 L18 13.5 Z" fill="#EDEDED" stroke={CT.bg} strokeWidth={1} />
        </svg>
      </div>
      {rippleOpacity > 0 && (
        <div style={{ position: "absolute", left: PIN[0] - 5, top: PIN[1] - 5, width: 10, height: 10, borderRadius: "50%", border: `2px solid ${CT.accent}`, opacity: rippleOpacity * cursorFade, transform: `scale(${rippleScale})` }} />
      )}

      {/* top chrome bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "9%", display: "flex", alignItems: "center", gap: 14, padding: "0 3%", background: "linear-gradient(180deg, #0D1D17, #0A1712)", borderBottom: `1px solid ${CT.panelLine}`, fontFamily: CFONT.mono, fontSize: 16 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: CT.panelLine }} />)}
        </div>
        <div style={{ color: CT.inkDim, letterSpacing: 0.5 }}>
          cipher://<span style={{ color: CT.accent }}>case-archive</span>/1840-lafarge
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: "#081310", border: `1px solid ${CT.panelLine}`, borderRadius: 3, padding: "6px 12px", color: CT.ink, minWidth: "32%" }}>
          <span style={{ color: CT.inkDim }}>⌕</span>
          <span>{searchShown}</span>
          {typedChars < SEARCH_TEXT.length && <span style={{ display: "inline-block", width: 8, height: 16, background: CT.accent, opacity: Math.sin(frame * 0.5) > 0 ? 1 : 0 }} />}
        </div>
      </div>

      {/* right data panel */}
      <div style={{ position: "absolute", top: "9%", right: 0, bottom: "12%", width: "26%", background: "linear-gradient(180deg, #0C1B15, #08130F)", borderLeft: `1px solid ${CT.panelLine}`, padding: "4% 5%", display: "flex", flexDirection: "column", gap: 16 }}>
        {PANEL_ROWS.map((row, i) => {
          const rowS = spring({ frame: frame - (panelStart + i * f(0.35)), fps, config: { damping: 16, mass: 0.5 } });
          return (
            <div key={row.label} style={{ opacity: interpolate(rowS, [0, 1], [0, 1]), transform: `translateY(${interpolate(rowS, [0, 1], [10, 0])}px)`, fontFamily: CFONT.mono, fontSize: 14, color: CT.inkDim }}>
              {row.label}
              <div style={{ color: row.hot ? CT.amber : CT.ink, fontSize: 16, marginTop: 2 }}>{row.value}</div>
            </div>
          );
        })}
        <div
          style={{
            marginTop: "auto",
            border: `1px solid ${CT.red}`,
            color: CT.red,
            fontFamily: CFONT.mono,
            fontWeight: 700,
            letterSpacing: 2,
            fontSize: 15,
            padding: "8px 10px",
            textAlign: "center",
            borderRadius: 2,
            opacity: interpolate(stampS, [0, 1], [0, 1]),
            transform: `scale(${interpolate(stampS, [0, 1], [1.5, 1])})`,
          }}
        >
          CONVICTED
        </div>
      </div>

      {/* bottom status bar */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "12%", background: "#081310", borderTop: `1px solid ${CT.panelLine}`, display: "flex", alignItems: "center", gap: 24, padding: "0 3%", fontFamily: CFONT.mono, fontSize: 16, color: CT.inkDim }}>
        <div style={{ whiteSpace: "nowrap", letterSpacing: 1.5 }}>MATCH CONFIDENCE</div>
        <div style={{ flex: 1, height: 8, background: CT.panelLine, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${barProgress * 94}%`, background: `linear-gradient(90deg, ${CT.accentDim}, ${CT.accent})` }} />
        </div>
        <div style={{ fontVariantNumeric: "tabular-nums", width: 60, textAlign: "right", color: CT.accent }}>{confidencePct}%</div>
      </div>
    </AbsoluteFill>
  );
};
