import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, random } from "remotion";
import { CC, CFONT } from "../../crime/theme";

// ---- A bound book drawing open — "The Washing Away of Wrongs," the
// world's first forensic-science textbook.
export const BookReveal: React.FC<{ width: number; height: number; appearAt: number }> = ({ width, height, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 16, mass: 0.7 } });
  const openAmt = spring({ frame: frame - appearAt - 10, fps, config: { damping: 18, mass: 0.6 } });
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g opacity={s} transform={`scale(${interpolate(s, [0, 1], [0.88, 1])})`}>
        <rect x={width * 0.5 - width * 0.02} y={height * 0.1} width={width * 0.04} height={height * 0.7} fill={CC.ink} />
        <g transform={`translate(${width * 0.5} 0) scale(${interpolate(openAmt, [0, 1], [0, 1])} 1)`}>
          <rect x={-width * 0.36} y={height * 0.1} width={width * 0.36} height={height * 0.7} rx={4} fill={CC.paperDark} stroke={CC.ink} strokeWidth={3} />
          {Array.from({ length: 4 }).map((_, i) => (
            <rect key={i} x={-width * 0.3} y={height * (0.22 + i * 0.12)} width={width * 0.24} height={height * 0.04} fill={CC.ink} opacity={0.55} />
          ))}
        </g>
        <g transform={`translate(${width * 0.5} 0) scale(${interpolate(openAmt, [0, 1], [0, 1])} 1)`}>
          <rect x={width * 0} y={height * 0.1} width={width * 0.36} height={height * 0.7} rx={4} fill={CC.paperDark} stroke={CC.ink} strokeWidth={3} />
          {Array.from({ length: 4 }).map((_, i) => (
            <rect key={i} x={width * 0.06} y={height * (0.22 + i * 0.12)} width={width * 0.24} height={height * 0.04} fill={CC.ink} opacity={0.55} />
          ))}
        </g>
      </g>
    </svg>
  );
};

// ---- A row of villagers' sickles laid in the dirt; flies converge and
// swarm the one blade with blood traces too small to see — the case that's
// still taught today, and the first recorded use of forensic entomology.
export const SickleLineup: React.FC<{
  width: number;
  height: number;
  appearAt: number;
  guiltyIndex: number;
  flyAt: number;
}> = ({ width, height, appearAt, guiltyIndex, flyAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = 6;
  const flyCount = 7;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <line x1={width * 0.04} y1={height * 0.78} x2={width * 0.96} y2={height * 0.78} stroke={CC.ink} strokeWidth={2} opacity={0.4} />
      {Array.from({ length: count }).map((_, i) => {
        const s = spring({ frame: frame - appearAt - i * 5, fps, config: { damping: 16, mass: 0.5 } });
        const x = width * (0.1 + i * 0.16);
        const isGuilty = i === guiltyIndex;
        return (
          <g key={i} transform={`translate(${x} ${height * 0.66}) scale(${s})`} opacity={s}>
            <path d={`M0 0 Q22 -34 2 -56 Q-10 -32 0 0`} fill="none" stroke={isGuilty ? CC.red : CC.ink} strokeWidth={5} />
            <line x1={0} y1={0} x2={0} y2={36} stroke={CC.ink} strokeWidth={5} />
          </g>
        );
      })}
      {Array.from({ length: flyCount }).map((_, i) => {
        const fs = spring({ frame: frame - flyAt - i * 2, fps, config: { damping: 9, mass: 0.3 } });
        const gx = width * (0.1 + guiltyIndex * 0.16);
        const gy = height * 0.66 - 30;
        const angle = (i / flyCount) * Math.PI * 2 + random(`fly${i}`) * 2;
        const radius = interpolate(fs, [0, 1], [90, 14]);
        if (fs <= 0.01) return null;
        return (
          <circle
            key={i}
            cx={gx + Math.cos(angle + frame * 0.12) * radius}
            cy={gy + Math.sin(angle + frame * 0.12) * radius * 0.5}
            r={3.2}
            fill={CC.ink}
            opacity={fs}
          />
        );
      })}
    </svg>
  );
};

// ---- A magnifying glass settles over a small "confirmed" mark — closing
// beat for "first recorded case of forensic entomology."
export const ForensicConfirm: React.FC<{ width: number; height: number; appearAt: number }> = ({ width, height, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 14, mass: 0.6 } });
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g opacity={s} transform={`translate(${interpolate(s, [0, 1], [-24, 0])} 0) scale(${interpolate(s, [0, 1], [0.85, 1])})`}>
        <circle cx={width * 0.42} cy={height * 0.42} r={width * 0.22} fill="none" stroke={CC.ink} strokeWidth={7} />
        <line x1={width * 0.42 + width * 0.16} y1={height * 0.42 + width * 0.16} x2={width * 0.72} y2={height * 0.72} stroke={CC.ink} strokeWidth={9} strokeLinecap="round" />
        <path
          d={`M${width * 0.32} ${height * 0.42} L${width * 0.4} ${height * 0.5} L${width * 0.54} ${height * 0.32}`}
          stroke={CC.red}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
