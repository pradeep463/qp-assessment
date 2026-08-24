import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../theme";

// The inverted-U "sweet spot" from Andersen et al. 2020: enjoyment vs fear.
export const SweetSpotChart: React.FC<{ width: number; height: number; delay?: number }> = ({ width, height, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pad = 56;
  const w = width - pad * 2;
  const h = height - pad * 2;

  // inverted parabola across the plot
  const curveY = (t: number) => {
    const yNorm = 1 - 4 * (t - 0.5) * (t - 0.5); // 0..1 peak at t=0.5
    return pad + h - yNorm * h * 0.92;
  };
  const draw = spring({ frame: frame - delay, fps, config: { damping: 20, mass: 0.9 } });
  const steps = 60;
  const pts: string[] = [];
  for (let i = 0; i <= steps * draw; i++) {
    const t = i / steps;
    pts.push(`${(pad + t * w).toFixed(1)} ${curveY(t).toFixed(1)}`);
  }
  const path = pts.length > 1 ? "M " + pts.join(" L ") : "";

  const markerT = 0.5;
  const markerX = pad + markerT * w;
  const markerY = curveY(markerT);
  const markerIn = spring({ frame: frame - delay - 24, fps, config: { damping: 12, mass: 0.6 } });

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* axes */}
      <line x1={pad} y1={pad} x2={pad} y2={pad + h} stroke={CC.boneDim} strokeWidth={2} opacity={0.7} />
      <line x1={pad} y1={pad + h} x2={pad + w} y2={pad + h} stroke={CC.boneDim} strokeWidth={2} opacity={0.7} />
      <text x={pad - 12} y={pad + 6} fill={CC.boneDim} fontSize={20} fontFamily={CFONT.stamp} textAnchor="end">ENJOY</text>
      <text x={pad + w} y={pad + h + 30} fill={CC.boneDim} fontSize={20} fontFamily={CFONT.stamp} textAnchor="end">FEAR →</text>

      {/* curve */}
      <path d={path} stroke={CC.red} strokeWidth={5} fill="none" strokeLinecap="round" />

      {/* sweet-spot marker */}
      {markerIn > 0.01 && (
        <g opacity={markerIn} transform={`translate(${markerX} ${markerY})`}>
          <line x1={0} y1={0} x2={0} y2={pad + h - markerY} stroke={CC.bone} strokeDasharray="6 6" strokeWidth={2} opacity={0.6} />
          <circle r={interpolate(markerIn, [0, 1], [2, 12])} fill={CC.bone} stroke={CC.red} strokeWidth={4} />
          <text x={0} y={-24} fill={CC.bone} fontSize={26} fontFamily={CFONT.display} fontStyle="italic" textAnchor="middle">the sweet spot</text>
        </g>
      )}
    </svg>
  );
};
