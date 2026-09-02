import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";

// A comparison-microscope split view — the actual format ballistics
// examiners use: one eyepiece, two bullets' surfaces side by side, striation
// lines that either continue across the seam (a real match) or don't
// (Stielow's fabricated one).
const Striations: React.FC<{ side: "left" | "right"; aligned: boolean; opacity: number }> = ({ side, aligned, opacity }) => {
  const xs = side === "left" ? [-68, -60, -52, -44, -36, -28, -20, -12, -4] : [4, 12, 20, 28, 36, 44, 52, 60, 68];
  return (
    <g opacity={opacity} stroke={side === "left" ? CC.boneDim : CC.bone} strokeWidth={0.9}>
      {xs.map((x, i) => {
        const jitter = aligned ? 0 : (i % 2 === 0 ? 4 : -4);
        return <line key={x} x1={x} y1={-58} x2={x + jitter} y2={58} />;
      })}
    </g>
  );
};

export const StielowDiagram: React.FC<{
  width: number; height: number;
  compareAt: number; matchAt: number;
}> = ({ width, height, compareAt, matchAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  const scopeIn = spring({ frame: frame - f(0.3), fps, config: { damping: 18, mass: 0.8 } });
  const leftIn = interpolate(frame, [f(compareAt), f(compareAt) + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightIn = interpolate(frame, [f(matchAt), f(matchAt) + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const resolveS = spring({ frame: frame - f(matchAt) - 10, fps, config: { damping: 16, mass: 0.6 } });

  return (
    <svg width={width} height={height} viewBox="0 0 340 300" style={{ overflow: "visible" }}>
      <g opacity={scopeIn} transform="translate(170 130)">
        <circle r={100} fill="#1A1712" stroke={CC.inkSoft} strokeWidth={2.5} />
        <circle r={94} fill="#241f18" />
        <clipPath id="scopeClip"><circle r={94} /></clipPath>
        <g clipPath="url(#scopeClip)">
          <Striations side="left" aligned={false} opacity={leftIn} />
          <Striations side="right" aligned={true} opacity={rightIn} />
          <line x1={0} y1={-94} x2={0} y2={94} stroke="#0B0A08" strokeWidth={3} />
        </g>
        <circle r={100} fill="none" stroke={CC.inkSoft} strokeWidth={1} />
      </g>

      {/* labels sit on the parchment dossier card, not the dark scope circle
          — CC.bone/boneDim (off-white, meant for the dark corkboard) are
          nearly invisible here; ink tones are what actually read on paper. */}
      {leftIn > 0.3 && (
        <text x={95} y={250} textAnchor="middle" fontFamily={CFONT.stamp} fontSize={13} fill={CC.inkSoft} letterSpacing={1}
          opacity={interpolate(leftIn, [0.3, 1], [0, 1], { extrapolateLeft: "clamp" })}>
          "EXPERT" CLAIM
        </text>
      )}
      {rightIn > 0.3 && (
        <text x={245} y={250} textAnchor="middle" fontFamily={CFONT.stamp} fontSize={13} fill={CC.redDark} letterSpacing={1}
          opacity={interpolate(rightIn, [0.3, 1], [0, 1], { extrapolateLeft: "clamp" })}>
          REAL RE-TEST
        </text>
      )}

      {resolveS > 0.1 && (
        <g transform={`translate(170 275) scale(${interpolate(resolveS, [0, 1], [0.6, 1])})`}
          opacity={interpolate(resolveS, [0, 0.5], [0, 1], { extrapolateRight: "clamp" })}>
          <text textAnchor="middle" fontFamily={CFONT.display} fontStyle="italic" fontSize={20} fill={CC.redDark}>
            no match. wrong man.
          </text>
        </g>
      )}
    </svg>
  );
};
