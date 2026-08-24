import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";

// ---- A clay tablet with cuneiform-like rows drawing in one at a time —
// represents the Code of Ur-Nammu being "written down" for the first time.
export const TabletReveal: React.FC<{ width: number; height: number; appearAt: number }> = ({ width, height, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 16, mass: 0.7 } });
  const lines = 6;
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g opacity={s} transform={`scale(${interpolate(s, [0, 1], [0.9, 1])})`}>
        <rect x={width * 0.12} y={height * 0.05} width={width * 0.76} height={height * 0.9} rx={8} fill={CC.paperDark} stroke={CC.ink} strokeWidth={3} />
        {Array.from({ length: lines }).map((_, i) => {
          const w = spring({ frame: frame - appearAt - 8 - i * 5, fps, config: { damping: 20, mass: 0.4 } });
          return (
            <rect
              key={i}
              x={width * 0.2}
              y={height * (0.16 + (i * 0.68) / lines)}
              width={width * 0.6 * w}
              height={height * 0.05}
              fill={CC.ink}
              opacity={0.7}
            />
          );
        })}
      </g>
    </svg>
  );
};

// ---- A balance scale, gently tilting — visualizes "punishment scaled to
// crime" (a bone-break weighs a fine; the heaviest offenses weigh death).
export const ScaleDiagram: React.FC<{ width: number; height: number; appearAt: number }> = ({ width, height, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 16, mass: 0.7 } });
  const tilt = interpolate(s, [0, 1], [0, 9]);
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g opacity={s}>
        <line x1={width * 0.5} y1={height * 0.08} x2={width * 0.5} y2={height * 0.5} stroke={CC.ink} strokeWidth={5} />
        <g transform={`rotate(${tilt} ${width * 0.5} ${height * 0.16})`}>
          <line x1={width * 0.15} y1={height * 0.16} x2={width * 0.85} y2={height * 0.16} stroke={CC.ink} strokeWidth={4} />
          <line x1={width * 0.15} y1={height * 0.16} x2={width * 0.15} y2={height * 0.3} stroke={CC.ink} strokeWidth={3} />
          <line x1={width * 0.85} y1={height * 0.16} x2={width * 0.85} y2={height * 0.3} stroke={CC.ink} strokeWidth={3} />
          <circle cx={width * 0.15} cy={height * 0.34} r={width * 0.09} fill={CC.paperDark} stroke={CC.ink} strokeWidth={2} />
          <text x={width * 0.15} y={height * 0.37} textAnchor="middle" fill={CC.ink} fontFamily={CFONT.stamp} fontSize={13} fontWeight={700}>
            FINE
          </text>
          <circle cx={width * 0.85} cy={height * 0.34} r={width * 0.09} fill={CC.red} stroke={CC.ink} strokeWidth={2} />
          <text x={width * 0.85} y={height * 0.37} textAnchor="middle" fill={CC.bone} fontFamily={CFONT.stamp} fontSize={13} fontWeight={700}>
            DEATH
          </text>
        </g>
        <polygon points={`${width * 0.4},${height * 0.5} ${width * 0.6},${height * 0.5} ${width * 0.5},${height * 0.62}`} fill={CC.ink} />
        <rect x={width * 0.34} y={height * 0.62} width={width * 0.32} height={height * 0.05} fill={CC.ink} />
      </g>
    </svg>
  );
};

// ---- The list of what the code actually made capital vs. merely fined —
// murder, robbery and rape were capital; a broken bone was a silver fine.
export const OffenseList: React.FC<{ width: number; height: number; appearAt: number }> = ({ width, height, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const offenses = [
    { label: "MURDER", capital: true },
    { label: "ROBBERY", capital: true },
    { label: "RAPE", capital: true },
    { label: "BROKEN BONE", capital: false },
  ];
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {offenses.map((o, i) => {
        const s = spring({ frame: frame - appearAt - i * 8, fps, config: { damping: 16, mass: 0.5 } });
        const y = height * (0.06 + i * 0.235);
        return (
          <g key={i} opacity={s} transform={`translate(${interpolate(s, [0, 1], [-30, 0])} 0)`}>
            <rect x={0} y={y} width={width} height={height * 0.19} rx={6} fill={CC.paper} opacity={0.14} />
            <text x={20} y={y + height * 0.13} fill={CC.bone} fontFamily={CFONT.heavy} fontSize={24} fontWeight={800}>
              {o.label}
            </text>
            <text
              x={width - 20}
              y={y + height * 0.13}
              textAnchor="end"
              fill={o.capital ? CC.red : CC.boneDim}
              fontFamily={CFONT.stamp}
              fontSize={18}
              fontWeight={700}
            >
              {o.capital ? "CAPITAL" : "FINE"}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ---- A gavel strikes once — the closing beat: crime is now a defined,
// written thing, not just a reaction after the fact.
export const GavelStrike: React.FC<{ width: number; height: number; appearAt: number }> = ({ width, height, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 10, mass: 0.6 } });
  const rot = interpolate(s, [0, 0.5, 1], [-38, -38, 0]);
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g opacity={interpolate(s, [0, 0.15], [0, 1], { extrapolateRight: "clamp" })}>
        <ellipse cx={width * 0.5} cy={height * 0.72} rx={width * 0.26} ry={height * 0.04} fill={CC.ink} opacity={0.5} />
        <g transform={`rotate(${rot} ${width * 0.3} ${height * 0.68})`}>
          <rect x={width * 0.28} y={height * 0.2} width={width * 0.05} height={height * 0.5} rx={4} fill={CC.paperDark} />
          <rect x={width * 0.18} y={height * 0.14} width={width * 0.26} height={height * 0.16} rx={6} fill={CC.ink} />
        </g>
      </g>
    </svg>
  );
};
