import React from "react";
import { CC } from "../crime/theme";

// Simple, geometric case-file icons for each segment — illustrative, not
// photographic (no real remains/victims depicted), consistent with the
// channel's victim-dignity policy.

const wrap = (size: number, children: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    {children}
  </svg>
);

// Case 1 — the oldest murder: a cracked skull, two impact marks above the
// left eye.
export const SkullIcon: React.FC<{ size: number; color?: string }> = ({ size, color = CC.bone }) => wrap(size,
  <>
    <path d="M100 30 Q150 30 155 85 Q158 115 140 135 L140 165 L60 165 L60 135 Q42 115 45 85 Q50 30 100 30 Z" fill={color} opacity={0.92} />
    <rect x="72" y="165" width="14" height="18" fill={color} opacity={0.92} />
    <rect x="114" y="165" width="14" height="18" fill={color} opacity={0.92} />
    <circle cx="78" cy="95" r="12" fill={CC.board} />
    <circle cx="122" cy="95" r="12" fill={CC.board} />
    <path d="M100 105 L92 128 L108 128 Z" fill={CC.board} />
    <path d="M92 132 Q100 140 108 132" stroke={CC.board} strokeWidth={5} fill="none" strokeLinecap="round" />
    {/* two impact fractures, same shape, above the left eye */}
    <g stroke={CC.red} strokeWidth={3.4} opacity={0.95}>
      <path d="M62 78 L74 70 L70 84 L82 78" fill="none" />
      <path d="M58 92 L70 86 L66 98 L78 94" fill="none" />
    </g>
  </>
);

// Case 2 — Ötzi: a mountain range, a fallen silhouette, an arrow.
export const IcemanIcon: React.FC<{ size: number; color?: string }> = ({ size, color = CC.bone }) => wrap(size,
  <>
    <path d="M0 150 L45 70 L75 110 L110 40 L150 110 L175 85 L200 150 Z" fill={color} opacity={0.28} />
    <ellipse cx="100" cy="168" rx="70" ry="8" fill="#000" opacity={0.35} />
    {/* fallen figure */}
    <path d="M55 160 Q70 150 95 152 Q120 154 138 162 L138 168 L55 168 Z" fill={color} opacity={0.92} />
    <circle cx="50" cy="156" r="11" fill={color} opacity={0.92} />
    {/* arrow */}
    <g stroke={CC.red} strokeWidth={3.5}>
      <line x1="10" y1="120" x2="72" y2="150" />
      <path d="M72 150 L62 146 M72 150 L68 140" fill="none" />
    </g>
  </>
);

// Case 3 — Code of Ur-Nammu: a clay tablet with etched cuneiform-style rows.
export const TabletIcon: React.FC<{ size: number; color?: string }> = ({ size, color = CC.bone }) => wrap(size,
  <>
    <rect x="35" y="30" width="130" height="150" rx="6" fill={color} opacity={0.92} />
    {Array.from({ length: 7 }).map((_, row) => (
      <g key={row}>
        {Array.from({ length: 6 }).map((__, col) => (
          <path
            key={col}
            d={`M${52 + col * 18} ${52 + row * 18} l 8 0 l -3 6 l 5 0`}
            stroke={CC.board}
            strokeWidth={2.4}
            fill="none"
            opacity={0.85}
          />
        ))}
      </g>
    ))}
  </>
);

// Case 4 — Locusta: a poison vial + laurel sprig.
export const VialIcon: React.FC<{ size: number; color?: string }> = ({ size, color = CC.bone }) => wrap(size,
  <>
    <path d="M85 30 h30 v25 l14 20 v75 q0 12 -12 12 h-34 q-12 0 -12 -12 v-75 l14 -20 Z" fill={color} opacity={0.92} />
    <rect x="82" y="26" width="36" height="10" rx="3" fill={color} opacity={0.92} />
    <rect x="76" y="90" width="48" height="46" fill={CC.red} opacity={0.85} />
    <path d="M100 100 L100 130 M90 108 L110 108" stroke={CC.board} strokeWidth={3} />
    {/* laurel sprig */}
    <g stroke={color} strokeWidth={3} opacity={0.7} fill="none">
      <path d="M30 170 Q50 150 45 120" />
      <path d="M45 165 l-14 -8 M50 150 l-14 -6 M47 135 l-13 -6 M45 120 l-11 -4" />
    </g>
  </>
);

// Case 5 — Song Ci: a sickle blade with a single fly.
export const SickleIcon: React.FC<{ size: number; color?: string }> = ({ size, color = CC.bone }) => wrap(size,
  <>
    <path d="M50 150 Q40 90 90 55 Q120 35 150 45 Q125 50 105 70 Q75 100 85 150 Z" fill={color} opacity={0.92} />
    <rect x="80" y="148" width="14" height="34" rx="3" fill={color} opacity={0.92} />
    {/* fly */}
    <g transform="translate(118,60)">
      <ellipse cx="0" cy="0" rx="7" ry="5" fill={CC.red} />
      <circle cx="6" cy="-2" r="3.4" fill={CC.red} />
      <path d="M-2 -3 L-16 -10 M-2 3 L-16 10 M2 -3 L14 -12 M2 3 L14 11" stroke={color} strokeWidth={1.6} opacity={0.7} />
    </g>
  </>
);

export const CASE_ICONS: Record<number, React.FC<{ size: number; color?: string }>> = {
  2: SkullIcon,
  3: IcemanIcon,
  4: TabletIcon,
  5: VialIcon,
  6: SickleIcon,
};
