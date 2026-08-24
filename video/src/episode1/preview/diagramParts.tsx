import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";

// ---- A small excavation cross-section: a shaft dropping into a cave, with
// a depth marker that draws in. Represents Atapuerca / Sima de los Huesos.
export const ExcavationDiagram: React.FC<{ appearAt: number; width: number; height: number }> = ({ appearAt, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 16, mass: 0.7 } });
  const markerLen = interpolate(s, [0, 1], [0, height * 0.62]);
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g opacity={s}>
        {/* ground line */}
        <line x1={0} y1={30} x2={width} y2={30} stroke={CC.ink} strokeWidth={4} />
        {/* shaft */}
        <path d={`M ${width * 0.42} 30 L ${width * 0.42} ${height * 0.7} L ${width * 0.58} ${height * 0.7} L ${width * 0.58} 30 Z`} fill={CC.ink} opacity={0.85} />
        {/* cave chamber */}
        <ellipse cx={width * 0.5} cy={height * 0.78} rx={width * 0.34} ry={height * 0.14} fill={CC.ink} opacity={0.85} />
        {/* depth marker */}
        <line x1={width * 0.82} y1={30} x2={width * 0.82} y2={30 + markerLen} stroke={CC.red} strokeWidth={3} />
        <line x1={width * 0.78} y1={30} x2={width * 0.86} y2={30} stroke={CC.red} strokeWidth={3} />
        <line x1={width * 0.78} y1={30 + markerLen} x2={width * 0.86} y2={30 + markerLen} stroke={CC.red} strokeWidth={3} />
        <text x={width * 0.9} y={30 + markerLen * 0.55} fill={CC.red} fontFamily={CFONT.stamp} fontSize={20} fontWeight={700}>
          43 FT
        </text>
      </g>
    </svg>
  );
};

// ---- 28 small silhouette dots that populate in a grid, one at a time.
// Represents "at least 28 individuals" — a growing-data visualization
// rather than just a number in text.
export const PeopleGrid: React.FC<{ count: number; appearAt: number; width: number; height: number; highlightIndex?: number }> = ({
  count,
  appearAt,
  width,
  height,
  highlightIndex,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = 7;
  const rows = Math.ceil(count / cols);
  const cellW = width / cols;
  const cellH = height / rows;
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = spring({ frame: frame - appearAt - i * 2, fps, config: { damping: 14, mass: 0.4, stiffness: 220 } });
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = cellW * col + cellW / 2;
        const cy = cellH * row + cellH / 2;
        const isHi = highlightIndex === i;
        const hiPulse = isHi ? 1 + 0.15 * Math.sin(frame * 0.25) : 1;
        return (
          <g key={i} transform={`translate(${cx} ${cy}) scale(${interpolate(s, [0, 1], [0, 1]) * hiPulse})`} opacity={s}>
            <circle r={cellH * 0.22} fill={isHi ? CC.red : CC.ink} />
            <rect x={-cellH * 0.16} y={cellH * 0.14} width={cellH * 0.32} height={cellH * 0.28} rx={4} fill={isHi ? CC.red : CC.ink} />
          </g>
        );
      })}
    </svg>
  );
};

// ---- A skull with two impact points that draw in one at a time, each with
// radiating crack lines (SVG stroke animation) — visualizes "two holes,
// same shape" far more concretely than a static icon.
export const SkullWoundDiagram: React.FC<{ width: number; wound1At: number; wound2At: number }> = ({ width, wound1At, wound2At }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w1 = spring({ frame: frame - wound1At, fps, config: { damping: 12, mass: 0.5 } });
  const w2 = spring({ frame: frame - wound2At, fps, config: { damping: 12, mass: 0.5 } });
  const scale = width / 200;

  const crack = (cx: number, cy: number, prog: number, seedAngle: number) => {
    const lines = 5;
    return Array.from({ length: lines }).map((_, i) => {
      const ang = seedAngle + (i / lines) * Math.PI * 1.6 - Math.PI * 0.8;
      const len = (14 + (i % 3) * 6) * prog;
      const x2 = cx + Math.cos(ang) * len;
      const y2 = cy + Math.sin(ang) * len;
      return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke={CC.red} strokeWidth={2.4} strokeLinecap="round" />;
    });
  };

  return (
    <svg width={width} height={width} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <path
        d="M100 30 Q150 30 155 85 Q158 115 140 135 L140 165 L60 165 L60 135 Q42 115 45 85 Q50 30 100 30 Z"
        fill={CC.ink}
        opacity={0.92}
      />
      <rect x="72" y="165" width="14" height="18" fill={CC.ink} opacity={0.92} />
      <rect x="114" y="165" width="14" height="18" fill={CC.ink} opacity={0.92} />
      <circle cx="78" cy="95" r="12" fill={CC.paper} />
      <circle cx="122" cy="95" r="12" fill={CC.paper} />
      <path d="M100 105 L92 128 L108 128 Z" fill={CC.paper} />
      <path d="M92 132 Q100 140 108 132" stroke={CC.paper} strokeWidth={5} fill="none" strokeLinecap="round" />

      {w1 > 0.01 && (
        <g opacity={w1}>
          <circle cx={70} cy={68} r={7 * w1} fill={CC.red} />
          {crack(70, 68, w1, 0.3)}
        </g>
      )}
      {w2 > 0.01 && (
        <g opacity={w2}>
          <circle cx={88} cy={60} r={7 * w2} fill={CC.red} />
          {crack(88, 60, w2, 1.1)}
        </g>
      )}
    </svg>
  );
};

// ---- Side-by-side "accident vs intentional" comparison, resolving to
// highlight the correct one. Visualizes the forensic reasoning instead of
// only stating it in narration.
export const AccidentComparison: React.FC<{ appearAt: number; resolveAt: number; width: number; height: number }> = ({
  appearAt,
  resolveAt,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inA = spring({ frame: frame - appearAt, fps, config: { damping: 16, mass: 0.6 } });
  const inB = spring({ frame: frame - appearAt - 6, fps, config: { damping: 16, mass: 0.6 } });
  const resolve = spring({ frame: frame - resolveAt, fps, config: { damping: 16, mass: 0.7 } });
  const panelW = width * 0.46;

  const Panel: React.FC<{ x: number; s: number; label: string; marks: number; dim: boolean }> = ({ x, s, label, marks, dim }) => (
    <g
      transform={`translate(${x} 0) scale(${interpolate(s, [0, 1], [0.8, 1])})`}
      opacity={interpolate(s, [0, 1], [0, 1]) * (dim ? interpolate(resolve, [0, 1], [1, 0.35]) : 1)}
    >
      <rect width={panelW} height={height} rx={10} fill={CC.paper} />
      <circle cx={panelW / 2} cy={height * 0.36} r={panelW * 0.16} fill={CC.paperDark} />
      {Array.from({ length: marks }).map((_, i) => (
        <circle
          key={i}
          cx={panelW / 2 + (i - (marks - 1) / 2) * 14}
          cy={height * 0.36 - (marks > 1 ? 6 : 0)}
          r={6}
          fill={CC.red}
        />
      ))}
      <text x={panelW / 2} y={height * 0.78} fill={CC.ink} fontFamily={CFONT.heavy} fontSize={22} fontWeight={800} textAnchor="middle">
        {label}
      </text>
      {!dim && resolve > 0.2 && (
        <rect width={panelW} height={height} rx={10} fill="none" stroke={CC.red} strokeWidth={interpolate(resolve, [0, 1], [0, 6])} />
      )}
    </g>
  );

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <Panel x={0} s={inA} label="ACCIDENT" marks={1} dim />
      <Panel x={width - panelW} s={inB} label="INTENTIONAL" marks={2} dim={false} />
    </svg>
  );
};
