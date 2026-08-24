import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";

// ---- Glacier/mountain range with a body silhouette at the base, and a
// year-count that ticks up to "5,300 YEARS OLD" — visualizes the discovery
// instead of only stating the number.
export const MountainScene: React.FC<{ appearAt: number; ageAt: number; width: number; height: number }> = ({
  appearAt,
  ageAt,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 16, mass: 0.7 } });
  const ageS = spring({ frame: frame - ageAt, fps, config: { damping: 18, mass: 0.7 } });
  const age = Math.round(interpolate(ageS, [0, 1], [0, 5300]));

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g opacity={s}>
        <path
          d={`M0 ${height * 0.72} L${width * 0.2} ${height * 0.34} L${width * 0.36} ${height * 0.56} L${width * 0.52} ${height * 0.2} L${width * 0.68} ${height * 0.5} L${width * 0.82} ${height * 0.3} L${width} ${height * 0.68} L${width} ${height} L0 ${height} Z`}
          fill={CC.ink}
          opacity={0.85}
        />
        <path
          d={`M${width * 0.44} ${height * 0.26} L${width * 0.52} ${height * 0.2} L${width * 0.6} ${height * 0.28} L${width * 0.52} ${height * 0.32} Z`}
          fill={CC.bone}
          opacity={0.9}
        />
        <path
          d={`M${width * 0.75} ${height * 0.34} L${width * 0.82} ${height * 0.3} L${width * 0.88} ${height * 0.36} L${width * 0.81} ${height * 0.39} Z`}
          fill={CC.bone}
          opacity={0.85}
        />
        {/* body silhouette, half-emerged from the ice */}
        <ellipse cx={width * 0.58} cy={height * 0.88} rx={width * 0.17} ry={height * 0.035} fill={CC.red} opacity={0.8} />
        <rect x={width * 0.5} y={height * 0.8} width={width * 0.16} height={height * 0.08} rx={6} fill={CC.boneDim} opacity={0.55} />
      </g>
      {age > 0 && (
        <text x={width * 0.5} y={height * 0.12} textAnchor="middle" fill={CC.red} fontFamily={CFONT.stamp} fontSize={38} fontWeight={700}>
          {age.toLocaleString()} YEARS
        </text>
      )}
    </svg>
  );
};

// ---- An arrow flies in from off-frame and strikes a back-view body
// outline, with radiating cracks marking the impact — visualizes "shot
// from behind" far more concretely than a static wound icon.
export const ArrowStrikeDiagram: React.FC<{ width: number; height: number; arrowAt: number; impactAt: number }> = ({
  width,
  height,
  arrowAt,
  impactAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flight = spring({ frame: frame - arrowAt, fps, config: { damping: 20, mass: 0.5, stiffness: 150 } });
  const impact = spring({ frame: frame - impactAt, fps, config: { damping: 12, mass: 0.5 } });
  const arrowX = interpolate(flight, [0, 1], [width * 1.05, width * 0.58]);

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g opacity={0.92}>
        <ellipse cx={width * 0.4} cy={height * 0.22} rx={width * 0.09} ry={height * 0.07} fill={CC.ink} />
        <path
          d={`M${width * 0.24} ${height * 0.32} Q${width * 0.4} ${height * 0.22} ${width * 0.56} ${height * 0.32} L${width * 0.52} ${height * 0.85} L${width * 0.28} ${height * 0.85} Z`}
          fill={CC.ink}
        />
      </g>
      {flight < 1 && (
        <g transform={`translate(${arrowX} ${height * 0.4}) rotate(-10)`} opacity={interpolate(flight, [0, 0.06, 1], [0, 1, 1])}>
          <line x1={0} y1={0} x2={78} y2={0} stroke={CC.boneDim} strokeWidth={4} />
          <path d="M0 0 L15 -6 L15 6 Z" fill={CC.boneDim} />
        </g>
      )}
      {impact > 0.01 && (
        <g opacity={impact} transform={`translate(${width * 0.56} ${height * 0.34})`}>
          <circle r={7 * impact} fill={CC.red} />
          {Array.from({ length: 5 }).map((_, i) => {
            const ang = 0.3 + (i / 5) * Math.PI * 1.6 - Math.PI * 0.8;
            const len = (16 + (i % 3) * 6) * impact;
            return (
              <line
                key={i}
                x1={0}
                y1={0}
                x2={Math.cos(ang) * len}
                y2={Math.sin(ang) * len}
                stroke={CC.red}
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            );
          })}
        </g>
      )}
    </svg>
  );
};

// ---- A forearm outline with a healed blade wound — visualizes the
// defensive wound from the knife fight days before the fatal ambush.
export const DefensiveWoundDiagram: React.FC<{ width: number; height: number; appearAt: number }> = ({ width, height, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 16, mass: 0.6 } });
  const cutLen = interpolate(s, [0, 1], [0, 1]);

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g opacity={s}>
        <path
          d={`M${width * 0.3} ${height * 0.82} L${width * 0.34} ${height * 0.3} Q${width * 0.36} ${height * 0.14} ${width * 0.47} ${height * 0.16} Q${width * 0.5} ${height * 0.3} ${width * 0.5} ${height * 0.5} L${width * 0.7} ${height * 0.82} Z`}
          fill={CC.ink}
          opacity={0.85}
        />
        <line
          x1={width * 0.4}
          y1={height * 0.36}
          x2={width * 0.4 + cutLen * 62}
          y2={height * 0.36 - cutLen * 30}
          stroke={CC.red}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <line
          x1={width * 0.4}
          y1={height * 0.36}
          x2={width * 0.4 + cutLen * 62}
          y2={height * 0.36 - cutLen * 30}
          stroke={CC.redDark}
          strokeWidth={1.5}
          strokeDasharray="3 3"
          strokeLinecap="round"
          opacity={0.7}
        />
      </g>
    </svg>
  );
};

// ---- A case-folder tab flipping to "OPEN" — the closing beat for a cold
// case that, thirty years on, still has zero suspects.
export const ColdCaseStamp: React.FC<{ width: number; height: number; appearAt: number }> = ({ width, height, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 14, mass: 0.6 } });
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g opacity={s} transform={`scale(${interpolate(s, [0, 1], [0.85, 1])})`}>
        <rect x={width * 0.18} y={height * 0.2} width={width * 0.64} height={height * 0.56} rx={4} fill={CC.paperDark} stroke={CC.ink} strokeWidth={3} />
        <rect x={width * 0.18} y={height * 0.14} width={width * 0.24} height={height * 0.1} rx={3} fill={CC.paperDark} stroke={CC.ink} strokeWidth={3} />
        <rect
          x={width * 0.26}
          y={height * 0.36}
          width={width * 0.48 * interpolate(s, [0.3, 1], [0, 1], { extrapolateLeft: "clamp" })}
          height={height * 0.14}
          fill="none"
          stroke={CC.red}
          strokeWidth={4}
        />
        <text x={width * 0.5} y={height * 0.46} textAnchor="middle" fill={CC.red} fontFamily={CFONT.stamp} fontSize={26} fontWeight={700}>
          OPEN
        </text>
      </g>
    </svg>
  );
};
