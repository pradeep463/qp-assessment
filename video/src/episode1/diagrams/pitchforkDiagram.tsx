import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";

// An autoradiograph-style DNA gel: dense, uneven bands per lane (a real DNA
// fingerprint reads as a smudgy barcode, not a handful of clean bars) with
// amber brackets marking the bands that line up between the crime-scene
// lane and the suspect's.
const bandSets: Record<string, { y: number; h: number; op: number }[]> = {
  scene: [
    { y: 10, h: 3.4, op: 0.9 }, { y: 20, h: 5.5, op: 0.95 }, { y: 33, h: 3, op: 0.55 },
    { y: 46, h: 6, op: 0.95 }, { y: 60, h: 3.2, op: 0.7 }, { y: 72, h: 2, op: 0.5 },
  ],
  victim: [
    { y: 6, h: 3.2, op: 0.8 }, { y: 18, h: 4, op: 0.7 }, { y: 30, h: 5.5, op: 0.9 },
    { y: 44, h: 3, op: 0.6 }, { y: 58, h: 3.5, op: 0.75 }, { y: 70, h: 2.2, op: 0.5 },
  ],
  pitchfork: [
    { y: 10, h: 3.4, op: 0.9 }, { y: 20, h: 5.5, op: 0.95 }, { y: 33, h: 3, op: 0.5 },
    { y: 46, h: 6, op: 0.95 }, { y: 62, h: 2.4, op: 0.6 }, { y: 72, h: 2, op: 0.5 },
  ],
};

const Lane: React.FC<{ x: number; label: string; bands: { y: number; h: number; op: number }[]; opacity: number }> = ({ x, label, bands, opacity }) => (
  <g opacity={opacity}>
    <text x={x + 21} y={-6} textAnchor="middle" fontFamily={CFONT.stamp} fontSize={11} fill={CC.boneDim}>{label}</text>
    {bands.map((b, i) => (
      <rect key={i} x={x} y={b.y} width={42} height={b.h} fill={CC.bone} opacity={b.op} />
    ))}
  </g>
);

export const PitchforkDiagram: React.FC<{
  width: number; height: number;
  exonerateAt: number; matchAt: number;
}> = ({ width, height, exonerateAt, matchAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  const gelIn = spring({ frame: frame - f(0.3), fps, config: { damping: 18, mass: 0.8 } });
  const victimIn = interpolate(frame, [f(exonerateAt), f(exonerateAt) + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pitchforkIn = interpolate(frame, [f(matchAt), f(matchAt) + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bracketS = interpolate(frame, [f(matchAt) + 10, f(matchAt) + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg width={width} height={height} viewBox="0 0 340 220" style={{ overflow: "visible" }}>
      <rect x={-10} y={-30} width={360} height={190} fill="#100E0B" opacity={gelIn} />
      <g transform="translate(30 20)" opacity={gelIn}>
        <Lane x={0} label="SCENE" bands={bandSets.scene} opacity={1} />
      </g>
      <g transform="translate(120 20)">
        <Lane x={0} label="VICTIM" bands={bandSets.victim} opacity={victimIn} />
      </g>
      <g transform="translate(210 20)">
        <Lane x={0} label="PITCHFORK" bands={bandSets.pitchfork} opacity={pitchforkIn} />
      </g>

      <g stroke={CC.amber} strokeWidth={1.2} opacity={bracketS * 0.9}>
        <line x1={30 + 42} y1={30} x2={210} y2={30} />
        <line x1={30 + 42} y1={40} x2={210} y2={40} />
        <line x1={30 + 42} y1={66} x2={210} y2={66} />
      </g>

      {bracketS > 0.3 && (
        <text x={170} y={185} textAnchor="middle" fontFamily={CFONT.display} fontStyle="italic" fontSize={18} fill={CC.amber}
          opacity={interpolate(bracketS, [0.3, 1], [0, 1], { extrapolateLeft: "clamp" })}>
          same man. two crime scenes.
        </text>
      )}
    </svg>
  );
};
