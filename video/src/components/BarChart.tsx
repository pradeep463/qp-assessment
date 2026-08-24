import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../theme";
import { tornRectPath } from "../lib/torn";

// A bar chart made of torn-paper strips that grow up from a paper shelf.
// `delay` staggers the columns; represents "AI learning from data".
export const BarChart: React.FC<{
  width: number;
  height: number;
  values: number[];
  colors?: string[];
  delay?: number;
}> = ({ width, height, values, colors, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = colors ?? [
    COLORS.charcoal,
    COLORS.red,
    COLORS.gray,
    COLORS.charcoal,
    COLORS.yellowDark,
  ];
  const n = values.length;
  const gap = width * 0.05;
  const barW = (width - gap * (n + 1)) / n;
  const maxVal = Math.max(...values);
  const shelfY = height - 22;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {values.map((v, i) => {
        const grow = spring({
          frame: frame - delay - i * 6,
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 120 },
        });
        const full = (v / maxVal) * (height * 0.82);
        const bh = Math.max(2, full * grow);
        const bx = gap + i * (barW + gap);
        const by = shelfY - bh;
        return (
          <g key={i}>
            <path
              d={tornRectPath(barW, bh, {
                seed: 20 + i,
                edges: ["top"],
                amp: 6,
                step: 12,
              })}
              transform={`translate(${bx}, ${by})`}
              fill={palette[i % palette.length]}
              filter="url(#tinyShadow)"
            />
            <path
              d={tornRectPath(barW, bh, { seed: 20 + i, edges: ["top"], amp: 6, step: 12 })}
              transform={`translate(${bx}, ${by})`}
              fill="#000"
              filter="url(#grain)"
              opacity={0.14}
            />
          </g>
        );
      })}
      {/* paper shelf the bars stand on */}
      <path
        d={tornRectPath(width, 20, { seed: 5, edges: ["top", "bottom"], amp: 5, step: 20 })}
        transform={`translate(0, ${shelfY})`}
        fill={COLORS.charcoal}
        opacity={interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" })}
      />
    </svg>
  );
};
