import React from "react";
import { COLORS } from "../theme";
import { TornPaper } from "./Paper";
import { Pushpin } from "./Pushpin";

// A lined index card (torn paper) with a red margin line and a pushpin,
// optionally holding content (the "steps" in scene 2).
export const IndexCard: React.FC<{
  width: number;
  height: number;
  x: number;
  y: number;
  rotate?: number;
  seed?: number;
  pin?: string;
  children?: React.ReactNode;
}> = ({ width, height, x, y, rotate = 0, seed = 3, pin = "#C63A28", children }) => {
  const lines = Math.max(3, Math.floor(height / 34));
  return (
    <TornPaper
      width={width}
      height={height}
      color={COLORS.card}
      seed={seed}
      x={x}
      y={y}
      rotate={rotate}
      amp={9}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* red margin line near the top */}
        <line
          x1={0}
          y1={height * 0.24}
          x2={width}
          y2={height * 0.24}
          stroke={COLORS.redLine}
          strokeWidth={3}
          opacity={0.75}
        />
        {/* ruled lines */}
        {Array.from({ length: lines }).map((_, i) => {
          const yy = height * 0.24 + (i + 1) * ((height * 0.7) / lines);
          if (yy > height - 8) return null;
          return (
            <line
              key={i}
              x1={width * 0.06}
              y1={yy}
              x2={width * 0.94}
              y2={yy}
              stroke={COLORS.cardLine}
              strokeWidth={1.6}
              opacity={0.6}
            />
          );
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
      <Pushpin x={width * 0.5 - 20} y={-14} size={40} color={pin} />
    </TornPaper>
  );
};
