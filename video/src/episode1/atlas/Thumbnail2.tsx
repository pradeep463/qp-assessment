import React from "react";
import { AbsoluteFill } from "remotion";
import { LAND_D, project } from "./MapBoard";
import { AC, AFONT } from "./theme";
import { FingerprintIcon } from "./evidenceIcons";

// Static 1280x720 YouTube thumbnail for Episode 2, built from the same real
// map data and palette as the episode itself — unlike Episode 1's corkboard
// thumbnail, this one should look like what's actually inside, since Episode
// 2's format (Case Atlas) is a different visual identity from Episode 1.
const PINS: [number, number][] = [
  [1.65, 45.35], // Le Glandier, FR
  [-58.74, -38.55], // Necochea, ARG
  [-78.33, 43.28], // West Shelby, NY
  [-74.01, 40.71], // New York, NY
  [-1.203, 52.573], // Leicestershire, UK
];

export const Thumbnail2: React.FC = () => {
  const pins = PINS.map(([lon, lat]) => project(lon, lat));

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #ECE1C2, ${AC.parch} 42%, ${AC.parchDeep})` }}>
      {/* rendered at the same native 1920x1080 pixel space project() already
          uses (no viewBox rescale), then CSS-scaled down to the 1280x720
          thumbnail — guarantees the map matches how it actually looks in
          the episode itself, pixel-for-pixel, rather than an independent
          (and, first attempt, wrong) approximation */}
      <div style={{ position: "absolute", inset: 0, width: 1920, height: 1080, transform: "scale(0.6667)", transformOrigin: "top left" }}>
        <svg width={1920} height={1080}>
          <path d={LAND_D} fill={AC.land} stroke={AC.landLine} strokeWidth={1.4} opacity={0.85} />
          {pins.map((p, i) => (
            <g key={i} transform={`translate(${p[0]} ${p[1]})`}>
              <circle r={13} fill={AC.wax} stroke={AC.ink} strokeWidth={2} style={{ filter: "drop-shadow(0 4px 5px rgba(0,0,0,0.4))" }} />
              <circle r={4.5} fill={AC.vellum} />
            </g>
          ))}
        </svg>
      </div>

      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(43,32,19,0.55) 0%, rgba(43,32,19,0.15) 48%, transparent 62%)" }} />

      <div style={{ position: "absolute", left: 64, top: 90, fontFamily: AFONT.stamp, fontSize: 26, letterSpacing: 3, color: AC.waxDeep, borderBottom: `2px solid ${AC.waxDeep}`, paddingBottom: 8 }}>
        CASE FILE 002
      </div>

      <div style={{ position: "absolute", left: 60, top: 150, width: 760 }}>
        <div style={{ fontFamily: AFONT.display, fontWeight: 800, fontSize: 118, color: AC.ink, lineHeight: 0.98, textShadow: "0 3px 0 rgba(255,255,255,0.25)" }}>
          THE FIRST
        </div>
        <div style={{ fontFamily: AFONT.display, fontWeight: 800, fontSize: 118, color: AC.wax, lineHeight: 0.98 }}>
          DETECTIVES
        </div>
      </div>

      <div style={{ position: "absolute", left: 64, top: 470, fontFamily: AFONT.stamp, fontSize: 32, letterSpacing: 3, color: AC.inkFaint }}>
        5 CASES. 148 YEARS.
      </div>

      <div style={{ position: "absolute", left: 64, bottom: 130, background: AC.wax, color: AC.vellum, fontFamily: AFONT.heavy, fontWeight: 900, fontSize: 26, letterSpacing: 1, padding: "12px 22px", boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }}>
        HOW SCIENCE CAUGHT A KILLER
      </div>

      <div style={{ position: "absolute", right: 90, bottom: 90, opacity: 0.9 }}>
        <div style={{ background: AC.vellum, border: `2px solid ${AC.ink}`, borderRadius: "50%", width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 28px rgba(0,0,0,0.4)" }}>
          <svg width={92} height={92} viewBox="-16 -16 32 32">
            <FingerprintIcon size={30} color={AC.ink} />
          </svg>
        </div>
      </div>

      <div style={{ position: "absolute", right: 44, top: 40, fontFamily: AFONT.stamp, fontSize: 24, color: AC.inkFaint, letterSpacing: 4 }}>
        CIPHERSTUDIOS TC
      </div>
    </AbsoluteFill>
  );
};
