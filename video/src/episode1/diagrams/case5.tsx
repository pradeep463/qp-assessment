import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";

// ---- A sprig of leaves next to a vial — visualizes "an expert's knowledge
// of plants, which ones healed you and which ones killed you slowly."
export const PlantVialDiagram: React.FC<{ width: number; height: number; appearAt: number }> = ({ width, height, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 16, mass: 0.7 } });
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g opacity={s} transform={`scale(${interpolate(s, [0, 1], [0.85, 1])})`}>
        <line x1={width * 0.32} y1={height * 0.8} x2={width * 0.32} y2={height * 0.25} stroke={CC.green} strokeWidth={4} />
        {[0, 1, 2].map((i) => (
          <ellipse
            key={i}
            cx={width * 0.32 + (i % 2 === 0 ? -1 : 1) * width * 0.1}
            cy={height * (0.35 + i * 0.15)}
            rx={width * 0.09}
            ry={height * 0.045}
            fill={CC.green}
            opacity={0.85}
            transform={`rotate(${i % 2 === 0 ? -30 : 30} ${width * 0.32 + (i % 2 === 0 ? -1 : 1) * width * 0.1} ${height * (0.35 + i * 0.15)})`}
          />
        ))}
        <rect x={width * 0.55} y={height * 0.35} width={width * 0.22} height={height * 0.45} rx={8} fill={CC.paperDark} stroke={CC.ink} strokeWidth={3} />
        <rect x={width * 0.6} y={height * 0.24} width={width * 0.12} height={height * 0.12} rx={3} fill={CC.ink} />
        <rect x={width * 0.58} y={height * 0.55} width={width * 0.18} height={height * 0.2} fill={CC.red} opacity={0.55} />
      </g>
    </svg>
  );
};

// ---- Two cups: the first attempt fails (X), the second succeeds
// (checkmark) — visualizes "the job took two attempts."
export const PoisonAttempts: React.FC<{ width: number; height: number; attempt1At: number; attempt2At: number }> = ({
  width,
  height,
  attempt1At,
  attempt2At,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame: frame - attempt1At, fps, config: { damping: 16, mass: 0.6 } });
  const s2 = spring({ frame: frame - attempt2At, fps, config: { damping: 16, mass: 0.6 } });
  const cupW = width * 0.36;

  const Cup: React.FC<{ x: number; s: number; success: boolean; label: string }> = ({ x, s, success, label }) => (
    <g transform={`translate(${x} 0) scale(${interpolate(s, [0, 1], [0.8, 1])})`} opacity={s}>
      <path d={`M0 0 L${cupW} 0 L${cupW * 0.8} ${height * 0.5} L${cupW * 0.2} ${height * 0.5} Z`} fill={CC.paperDark} stroke={CC.ink} strokeWidth={3} />
      <ellipse cx={cupW / 2} cy={height * 0.08} rx={cupW * 0.4} ry={height * 0.03} fill={CC.green} opacity={0.8} />
      {success ? (
        <path
          d={`M${cupW * 0.3} ${height * 0.6} L${cupW * 0.45} ${height * 0.75} L${cupW * 0.75} ${height * 0.45}`}
          stroke={CC.red}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <>
          <line x1={cupW * 0.3} y1={height * 0.55} x2={cupW * 0.7} y2={height * 0.8} stroke={CC.boneDim} strokeWidth={8} strokeLinecap="round" />
          <line x1={cupW * 0.7} y1={height * 0.55} x2={cupW * 0.3} y2={height * 0.8} stroke={CC.boneDim} strokeWidth={8} strokeLinecap="round" />
        </>
      )}
      <text x={cupW / 2} y={height * 0.92} textAnchor="middle" fill={CC.bone} fontFamily={CFONT.stamp} fontSize={17} fontWeight={700}>
        {label}
      </text>
    </g>
  );

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <Cup x={width * 0.02} s={s1} success={false} label="1ST DOSE" />
      <Cup x={width - cupW - width * 0.02} s={s2} success={true} label="2ND DOSE" />
    </svg>
  );
};

// ---- Growing tally marks — the repeatable method behind "earliest
// documented serial killer": multiple victims, not one.
export const TallyDiagram: React.FC<{ width: number; height: number; appearAt: number; count: number }> = ({
  width,
  height,
  appearAt,
  count,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = spring({ frame: frame - appearAt - i * 8, fps, config: { damping: 14, mass: 0.4 } });
        const x = width * (0.14 + i * 0.24);
        return (
          <g key={i} opacity={s}>
            <line x1={x} y1={height * 0.2} x2={x} y2={height * 0.2 + height * 0.55 * s} stroke={CC.red} strokeWidth={7} strokeLinecap="round" />
            <ellipse cx={x} cy={height * 0.14} rx={10} ry={10} fill={CC.red} opacity={s} />
          </g>
        );
      })}
    </svg>
  );
};
