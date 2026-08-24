import React from "react";

// A round magnet / pushpin dot like the ones holding the note cards.
export const Pushpin: React.FC<{
  size?: number;
  color?: string;
  x: number;
  y: number;
}> = ({ size = 42, color = "#C63A28", x, y }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <svg width={size} height={size * 1.05} viewBox="0 0 100 105" style={{ overflow: "visible" }}>
      <ellipse cx="50" cy="78" rx="34" ry="12" fill="#000" opacity="0.28" filter="url(#tinyShadow)" />
      <circle cx="50" cy="50" r="40" fill={color} />
      <circle cx="50" cy="50" r="40" fill="#000" filter="url(#grain)" opacity="0.18" />
      <ellipse cx="38" cy="36" rx="14" ry="9" fill="#fff" opacity="0.28" />
    </svg>
  </div>
);
