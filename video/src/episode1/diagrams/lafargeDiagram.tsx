import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";

// The Marsh test: arsenic-laced sample heated in a glass apparatus, the gas
// passed through a tube and ignited — a deposit of pure metallic arsenic
// condenses on cold porcelain as a visible dark mirror. That stain, not a
// courtroom theory, is what convicted Lafarge.
export const LafargeDiagram: React.FC<{
  width: number; height: number;
  stainAt: number; convictedAt: number; disputedAt: number;
}> = ({ width, height, stainAt, convictedAt, disputedAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  const apparatusIn = spring({ frame: frame - f(0.3), fps, config: { damping: 18, mass: 0.8 } });
  const stainIn = interpolate(frame, [f(stainAt), f(stainAt) + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const convictedS = spring({ frame: frame - f(convictedAt), fps, config: { damping: 16, mass: 0.6 } });
  const disputedS = spring({ frame: frame - f(disputedAt), fps, config: { damping: 14, mass: 0.6 } });
  const wobble = 3 * Math.sin(frame * 0.1);

  // A second, slower flicker phase for the flame's inner core, so the core
  // doesn't pulse in lockstep with the outer flame — real flame layers drift
  // independently. Still just trig on one small element, not a scene-wide cost.
  const coreFlicker = 1 + Math.sin(frame * 0.5 + 2) * 0.1 + Math.sin(frame * 0.23) * 0.05;

  return (
    <svg width={width} height={height} viewBox="0 0 400 320" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lafargeGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={CC.bone} stopOpacity={0.5} />
          <stop offset="35%" stopColor={CC.bone} stopOpacity={0.05} />
          <stop offset="70%" stopColor={CC.inkSoft} stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="lafargeLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={CC.bone} stopOpacity={0.45} />
          <stop offset="18%" stopColor={CC.green} stopOpacity={0.5} />
          <stop offset="100%" stopColor={CC.inkSoft} stopOpacity={0.55} />
        </linearGradient>
        <radialGradient id="lafargeFlameCore" cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor={CC.bone} stopOpacity={0.95} />
          <stop offset="45%" stopColor={CC.amber} stopOpacity={0.9} />
          <stop offset="100%" stopColor={CC.redBright} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="lafargeFlameGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CC.amber} stopOpacity={0.35} />
          <stop offset="100%" stopColor={CC.amber} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g opacity={apparatusIn}>
        {/* flask — outline, a glass-sheen fill for depth, and two thin
            highlight streaks standing in for reflected light on curved glass */}
        <path d="M150,60 L150,110 L110,190 Q100,210 120,210 L200,210 Q220,210 210,190 L170,110 L170,60 Z"
          fill="url(#lafargeGlass)" stroke={CC.inkSoft} strokeWidth={2.4} />
        <path d="M138,120 Q128,165 122,196" fill="none" stroke={CC.bone} strokeWidth={2} strokeLinecap="round" opacity={0.35} />
        <path d="M186,120 Q193,150 196,175" fill="none" stroke={CC.bone} strokeWidth={1.4} strokeLinecap="round" opacity={0.25} />
        <rect x={142} y={48} width={36} height={14} rx={3} fill={CC.inkSoft} />
        {/* liquid — depth gradient instead of a flat tint, plus a curved
            meniscus at the surface so the top edge doesn't read as a flat cut */}
        <path d="M126,178 L204,178 L210,190 Q220,210 200,210 L120,210 Q100,210 110,190 Z" fill="url(#lafargeLiquid)" />
        <path d="M126,178 Q165,184 204,178" fill="none" stroke={CC.bone} strokeWidth={1.4} opacity={0.4} />
        {/* the flask sits in a water bath, not over a flame — Marsh's own
            apparatus (checked against a period illustration) generates the
            gas cold and only ignites it downstream at the delivery jet, so
            a burner under the flask itself would be wrong, not just plain */}
        <ellipse cx={160} cy={214} rx={64} ry={14} fill="none" stroke={CC.inkSoft} strokeWidth={2} opacity={0.55} />
        <ellipse cx={160} cy={214} rx={64} ry={14} fill={CC.bone} opacity={0.06} />
        {/* delivery tube, angled up and right to the jet */}
        <path d="M170,90 L260,90 L260,118" fill="none" stroke={CC.inkSoft} strokeWidth={2.4} />
        {/* the jet flame — small, right where the gas actually burns, over
            the porcelain dish rather than under the flask */}
        <ellipse cx={260} cy={122} rx={14} ry={9} fill="url(#lafargeFlameGlow)" opacity={0.8} />
        <g style={{ transformOrigin: "260px 126px" }} transform={`scale(${1 + Math.sin(frame * 0.4) * 0.07 + Math.sin(frame * 0.17) * 0.04}, ${1 + Math.sin(frame * 0.31 + 1) * 0.09})`}>
          <path d="M260,106 Q252,118 255,127 Q257,132 260,128 Q263,132 265,127 Q268,118 260,106 Z" fill={CC.amber} opacity={0.88} />
          <path d="M260,114 Q256,122 258,127 Q260,130 262,127 Q264,122 260,114 Z" fill={CC.red} opacity={0.92} />
        </g>
        <g style={{ transformOrigin: "260px 124px" }} transform={`scale(${coreFlicker})`}>
          <path d="M260,117 Q257,122 259,125 Q260,127 261,125 Q263,122 260,117 Z" fill="url(#lafargeFlameCore)" />
        </g>
        {/* cold porcelain dish, held right in the jet flame to catch the deposit */}
        <rect x={225} y={130} width={70} height={22} rx={3} fill="none" stroke={CC.inkSoft} strokeWidth={2} />
        <text x={260} y={175} textAnchor="middle" fontFamily={CFONT.stamp} fontSize={13} fill={CC.inkSoft} letterSpacing={1}>
          COLD PORCELAIN
        </text>
        {/* the spirit lamp itself, off to the side — its own flame is what's
            drawn at the jet above; this is the period-accurate fixture, not
            a generic burner block */}
        <ellipse cx={340} cy={213} rx={20} ry={6} fill={CC.inkSoft} opacity={0.85} />
        <rect x={336} y={158} width={8} height={55} fill={CC.inkSoft} opacity={0.85} />
        <ellipse cx={340} cy={152} rx={20} ry={15} fill={CC.bone} fillOpacity={0.18} stroke={CC.inkSoft} strokeWidth={1.8} />
        <rect x={336} y={134} width={8} height={18} fill={CC.inkSoft} />
        {/* bell-shaped glass chimney — wide base tapering to a narrower rounded top, the recognizable oil-lamp-shade silhouette */}
        <path d="M320,132 L328,95 Q340,88 352,95 L360,132 Z" fill={CC.bone} fillOpacity={0.14} stroke={CC.inkSoft} strokeWidth={1.6} />
      </g>

      {/* the arsenic mirror itself — a dark metallic streak building across the dish */}
      <rect x={228} y={133} width={64 * stainIn} height={16} fill={CC.ink} opacity={0.9 * stainIn} />
      {stainIn > 0.4 && (
        <text x={230} y={30} textAnchor="middle" fontFamily={CFONT.display} fontStyle="italic" fontSize={20} fill={CC.redDark}
          opacity={interpolate(stainIn, [0.4, 1], [0, 1], { extrapolateLeft: "clamp" })}>
          a mirror of arsenic.
        </text>
      )}

      {convictedS > 0.15 && (
        <g transform={`translate(160 265) rotate(-4) scale(${interpolate(convictedS, [0, 1], [0.6, 1])})`}
          opacity={interpolate(convictedS, [0, 0.4], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={-92} y={-22} width={184} height={42} fill="none" stroke={CC.red} strokeWidth={4} />
          <text x={0} y={7} textAnchor="middle" fontFamily={CFONT.heavy} fontWeight={900} fontSize={24} fill={CC.red} letterSpacing={2}>
            CONVICTED
          </text>
        </g>
      )}

      {disputedS > 0.05 && (
        <g opacity={disputedS} transform={`translate(340 40) rotate(${wobble})`}>
          <text textAnchor="middle" fontFamily={CFONT.heavy} fontSize={46} fontWeight={900} fill={CC.amber}>?</text>
        </g>
      )}
    </svg>
  );
};
