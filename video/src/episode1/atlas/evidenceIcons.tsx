import React from "react";

// Small, map-scale evidence icons for each case's reveal-beat ping (see
// MapBoard's EvidenceIcon prop). Built from plain shapes and straight/
// quadratic/cubic path segments only — no hand-derived SVG arc (`A`)
// commands, which is what produced the earlier degenerate/self-intersecting
// pin geometry. Each icon is centered on (0,0) and sized to roughly fill a
// `size`-px box so callers can drop them straight into a fixed-radius badge.

export type EvidenceIconProps = { size: number; color: string };

export const FlaskIcon: React.FC<EvidenceIconProps> = ({ size, color }) => {
  const s = size / 30;
  return (
    <g transform={`scale(${s})`}>
      <line x1={-3} y1={-13} x2={-3} y2={-4} stroke={color} strokeWidth={2} />
      <line x1={3} y1={-13} x2={3} y2={-4} stroke={color} strokeWidth={2} />
      <line x1={-5} y1={-13} x2={5} y2={-13} stroke={color} strokeWidth={2} />
      <path d="M -3,-4 L -9,9 Q -9,13 -5,13 L 5,13 Q 9,13 9,9 L 3,-4 Z" fill="none" stroke={color} strokeWidth={2} />
      <circle cx={-2} cy={7} r={1.6} fill={color} opacity={0.8} />
      <circle cx={2} cy={3} r={1.2} fill={color} opacity={0.6} />
    </g>
  );
};

export const FingerprintIcon: React.FC<EvidenceIconProps> = ({ size, color }) => {
  const s = size / 30;
  return (
    <g transform={`scale(${s})`} fill="none" stroke={color} strokeWidth={1.6}>
      <ellipse cx={0} cy={1} rx={11} ry={13} />
      <ellipse cx={0} cy={1} rx={7.5} ry={9.5} />
      <ellipse cx={0} cy={1} rx={4} ry={6} />
      <circle cx={0} cy={1} r={1.2} fill={color} stroke="none" />
    </g>
  );
};

export const BulletIcon: React.FC<EvidenceIconProps> = ({ size, color }) => {
  const s = size / 30;
  return (
    <g transform={`scale(${s})`}>
      <rect x={-5} y={-2} width={10} height={16} rx={1} fill={color} />
      <path d="M -5,-2 L 0,-13 L 5,-2 Z" fill={color} />
      <line x1={-5} y1={4} x2={5} y2={4} stroke="#fff" strokeWidth={1} opacity={0.4} />
      <line x1={-5} y1={9} x2={5} y2={9} stroke="#fff" strokeWidth={1} opacity={0.4} />
    </g>
  );
};

export const ProfileIcon: React.FC<EvidenceIconProps> = ({ size, color }) => {
  const s = size / 30;
  return (
    <g transform={`scale(${s})`} fill={color}>
      <circle cx={0} cy={-6} r={6} />
      <path d="M -10,13 C -10,3 -6,-1 0,-1 C 6,-1 10,3 10,13 Z" />
    </g>
  );
};

export const DnaIcon: React.FC<EvidenceIconProps> = ({ size, color }) => {
  const s = size / 30;
  const ys = [-14, -7, 0, 7, 14];
  const xsA = ys.map((_, i) => (i % 2 === 0 ? -7 : 7));
  const xsB = xsA.map((x) => -x);
  const pathFrom = (xs: number[]) => "M " + ys.map((y, i) => `${xs[i]},${y}`).join(" L ");
  return (
    <g transform={`scale(${s})`} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={pathFrom(xsA)} />
      <path d={pathFrom(xsB)} />
      {ys.map((y, i) => (
        <line key={i} x1={xsA[i]} y1={y} x2={xsB[i]} y2={y} strokeWidth={1.4} opacity={0.7} />
      ))}
    </g>
  );
};
