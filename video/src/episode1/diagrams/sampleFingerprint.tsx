import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";

// Loop-pattern fingerprint ridges (a real loop, not concentric circles —
// ridges enter from the lower-left, curve around a core, exit the same
// side), built from nested open Bezier paths at increasing offsets.
const ridgePaths = [
  "M -34,40 C -40,10 -30,-24 -2,-34 C 24,-43 44,-24 42,4 C 40,26 22,38 6,34",
  "M -28,36 C -34,10 -25,-18 -1,-27 C 21,-35 38,-19 37,3 C 35,22 20,32 7,29",
  "M -22,32 C -27,10 -20,-13 0,-21 C 18,-28 32,-14 31,3 C 30,18 18,27 8,24",
  "M -16,28 C -20,10 -15,-8 1,-15 C 15,-21 26,-9 25,3 C 24,14 16,21 9,19",
  "M -10,23 C -13,10 -9,-3 1,-9 C 11,-13 19,-4 19,3 C 18,10 13,15 10,14",
  "M -4,17 C -6,9 -3,2 2,-1 C 8,-4 12,1 12,4",
];
// delta (the small triangular ridge-convergence below the loop)
const deltaPath = "M 4,30 L -6,44 L 14,44 Z";

const Print: React.FC<{
  cx: number; cy: number; r: number; fill: string; ridgeColor: string;
  drawIn: number; // 0..1
}> = ({ cx, cy, r, fill, ridgeColor, drawIn }) => {
  const visibleCount = Math.ceil(interpolate(drawIn, [0, 1], [0, ridgePaths.length]));
  return (
    <g transform={`translate(${cx} ${cy})`} opacity={interpolate(drawIn, [0, 0.15], [0, 1], { extrapolateRight: "clamp" })}>
      <circle r={r} fill={fill} stroke="#8a7d5c" strokeWidth={1.4} filter="url(#cshadowSm)" />
      <g fill="none" stroke={ridgeColor} strokeWidth={2.2} strokeLinecap="round">
        {ridgePaths.slice(0, visibleCount).map((d, i) => (
          <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={i === visibleCount - 1 ? interpolate(drawIn, [0, 1], [1, 0]) : 0} />
        ))}
      </g>
      <path d={deltaPath} fill="none" stroke={ridgeColor} strokeWidth={1.8} opacity={visibleCount >= ridgePaths.length ? 0.85 : 0} />
    </g>
  );
};

// A real minutia glyph — bifurcation (a ridge forking in two), the actual
// mark examiners use, rather than a generic dot.
const Bifurcation: React.FC<{ x: number; y: number; color: string; s: number; label: string; labelDx: number; labelDy: number }> = ({ x, y, color, s, label, labelDx, labelDy }) => (
  <g transform={`translate(${x} ${y})`} opacity={s} style={{ transformOrigin: `${x}px ${y}px` }}>
    <path d="M 0,10 L 0,2 M 0,2 L -6,-4 M 0,2 L 6,-3" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <text x={labelDx} y={labelDy} fontFamily={CFONT.stamp} fontSize={17} fill={color}>{label}</text>
  </g>
);

export const FingerprintDiagram: React.FC<{
  width: number; height: number;
  printBAt: number; minutiaeAt: number; matchAt: number;
}> = ({ width, height, printBAt, minutiaeAt, matchAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  const drawA = spring({ frame: frame - f(0.3), fps, config: { damping: 18, mass: 0.8 } });
  const drawB = spring({ frame: frame - f(printBAt), fps, config: { damping: 18, mass: 0.8 } });
  const minutiaeS = spring({ frame: frame - f(minutiaeAt), fps, config: { damping: 14, mass: 0.5, stiffness: 220 } });
  const matchS = spring({ frame: frame - f(matchAt), fps, config: { damping: 16, mass: 0.6 } });
  const linesOn = interpolate(matchS, [0, 1], [0, 1]);

  // Prints sit far enough apart (210 units, radius 62 -> 86 units of clear
  // gap between circle edges) that each caption's own width can't reach the
  // other print's zone — the earlier version placed them only 150 apart
  // with ~18-character captions, which collided regardless of the width/
  // height this component was scaled to render at.
  const PX_A = 115, PX_B = 335, R = 62;

  return (
    <svg width={width} height={height} viewBox="0 0 450 300" style={{ overflow: "visible" }}>
      <Print cx={PX_A} cy={95} r={R} fill={CC.paperDark} ridgeColor={CC.inkSoft} drawIn={drawA} />
      {drawA > 0.6 && (
        <text x={PX_A} y={172} textAnchor="middle" fontFamily={CFONT.stamp} fontSize={13} fill={CC.inkSoft} letterSpacing={0.5}
          opacity={interpolate(drawA, [0.6, 1], [0, 1], { extrapolateRight: "clamp" })}>
          DOORFRAME
        </text>
      )}

      <Print cx={PX_B} cy={95} r={R} fill={CC.paper} ridgeColor={CC.red} drawIn={drawB} />
      {drawB > 0.6 && (
        <text x={PX_B} y={172} textAnchor="middle" fontFamily={CFONT.stamp} fontSize={13} fill={CC.redDark} letterSpacing={0.5}
          opacity={interpolate(drawB, [0.6, 1], [0, 1], { extrapolateRight: "clamp" })}>
          ROJAS' THUMB
        </text>
      )}

      {/* three matching minutiae, called out on both prints together */}
      <Bifurcation x={PX_A - 14} y={95 + 2} color={CC.red} s={minutiaeS} label="1" labelDx={-30} labelDy={-6} />
      <Bifurcation x={PX_A + 16} y={95 - 9} color={CC.red} s={minutiaeS} label="2" labelDx={22} labelDy={-14} />
      <Bifurcation x={PX_A + 4} y={95 + 31} color={CC.red} s={minutiaeS} label="3" labelDx={16} labelDy={8} />
      <Bifurcation x={PX_B - 14} y={95 + 2} color={CC.red} s={minutiaeS} label="1" labelDx={-30} labelDy={-6} />
      <Bifurcation x={PX_B + 16} y={95 - 9} color={CC.red} s={minutiaeS} label="2" labelDx={22} labelDy={-14} />
      <Bifurcation x={PX_B + 4} y={95 + 31} color={CC.red} s={minutiaeS} label="3" labelDx={16} labelDy={8} />

      <g stroke={CC.red} strokeWidth={1.4} strokeDasharray="1 4" opacity={linesOn * 0.85}>
        <line x1={PX_A + R} y1={83} x2={PX_B - R} y2={83} />
        <line x1={PX_A + R} y1={104} x2={PX_B - R} y2={104} />
        <line x1={PX_A + R} y1={126} x2={PX_B - R} y2={126} />
      </g>

      {matchS > 0.15 && (
        <g transform={`translate(${(PX_A + PX_B) / 2} 235) scale(${interpolate(matchS, [0, 1], [0.6, 1])}) rotate(-3)`} opacity={interpolate(matchS, [0, 0.4], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={-70} y={-24} width={140} height={44} fill="none" stroke={CC.red} strokeWidth={4} />
          <text x={0} y={6} textAnchor="middle" fontFamily={CFONT.heavy} fontWeight={900} fontSize={26} fill={CC.red} letterSpacing={3}>
            MATCH
          </text>
        </g>
      )}
    </svg>
  );
};
