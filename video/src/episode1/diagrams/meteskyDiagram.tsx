import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";

// A profile sheet building up trait by trait — the actual mechanism of the
// case (a psychiatrist inferring a description from behavior alone) reads
// more truthfully as a checklist filling in than as a face.
const Trait: React.FC<{ y: number; label: string; value: string; s: number }> = ({ y, label, value, s }) => (
  <g opacity={interpolate(s, [0, 1], [0, 1])} transform={`translate(${interpolate(s, [0, 1], [-16, 0])} 0)`}>
    <line x1={0} y1={y} x2={310} y2={y} stroke={CC.paperDark} strokeWidth={1.4} opacity={0.5} />
    <text x={0} y={y - 8} fontFamily={CFONT.stamp} fontSize={13} fill={CC.inkSoft} letterSpacing={1}>{label}</text>
    <text x={0} y={y + 16} fontFamily={CFONT.display} fontSize={22} fill={CC.ink}>{value}</text>
  </g>
);

export const MeteskyDiagram: React.FC<{
  width: number; height: number;
  traitsAt: number; suitAt: number; matchAt: number;
}> = ({ width, height, traitsAt, suitAt, matchAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  const sheetIn = spring({ frame: frame - f(0.3), fps, config: { damping: 18, mass: 0.8 } });
  const t1 = spring({ frame: frame - f(traitsAt), fps, config: { damping: 16, mass: 0.6 } });
  const t2 = spring({ frame: frame - f(traitsAt) - 8, fps, config: { damping: 16, mass: 0.6 } });
  const t3 = spring({ frame: frame - f(suitAt), fps, config: { damping: 16, mass: 0.6 } });
  const matchS = spring({ frame: frame - f(matchAt), fps, config: { damping: 16, mass: 0.6 } });

  return (
    <svg width={width} height={height} viewBox="0 0 340 300" style={{ overflow: "visible" }}>
      <g opacity={sheetIn}>
        <text x={0} y={20} fontFamily={CFONT.stamp} fontSize={14} fill={CC.redDark} letterSpacing={2}>PSYCHIATRIC PROFILE</text>
      </g>

      <g transform="translate(0 55)">
        <Trait y={0} label="ORIGIN" value="Foreign-born" s={t1} />
        <Trait y={55} label="AGE" value="40s" s={t2} />
        <Trait y={110} label="SUIT (predicted)" value="Double-breasted, buttoned" s={t3} />
      </g>

      {matchS > 0.1 && (
        <g transform={`translate(170 280) scale(${interpolate(matchS, [0, 1], [0.6, 1])})`}
          opacity={interpolate(matchS, [0, 0.4], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={-112} y={-22} width={224} height={40} fill="none" stroke={CC.red} strokeWidth={4} />
          <text x={0} y={7} textAnchor="middle" fontFamily={CFONT.heavy} fontWeight={900} fontSize={20} fill={CC.red} letterSpacing={1.5}>
            EXACT MATCH
          </text>
        </g>
      )}
    </svg>
  );
};
