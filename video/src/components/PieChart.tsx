import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../theme";

// A paper pie chart whose wedges sweep in one after another.
export const PieChart: React.FC<{
  size: number;
  data: number[];
  colors?: string[];
  delay?: number;
}> = ({ size, data, colors, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = colors ?? [
    COLORS.charcoal,
    COLORS.red,
    COLORS.gray,
    COLORS.yellow,
  ];
  const total = data.reduce((a, b) => a + b, 0);
  const r = size / 2;
  const cx = r;
  const cy = r;

  // reveal wedges progressively
  let acc = 0;
  const wedges = data.map((d, i) => {
    const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += d;
    const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
    return { start, end, color: palette[i % palette.length], i };
  });

  const arcPath = (start: number, end: number) => {
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  const appear = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, mass: 0.8 },
  });
  const scale = interpolate(appear, [0, 1], [0.6, 1]);

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }} filter="url(#softShadow)">
      <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
        {wedges.map((w) => {
          const wp = spring({
            frame: frame - delay - 6 - w.i * 8,
            fps,
            config: { damping: 15, mass: 0.6, stiffness: 110 },
          });
          const end = w.start + (w.end - w.start) * wp;
          if (wp <= 0.001) return null;
          return (
            <g key={w.i}>
              <path d={arcPath(w.start, end)} fill={w.color} stroke={COLORS.paper} strokeWidth={4} />
              <path d={arcPath(w.start, end)} fill="#000" filter="url(#grain)" opacity={0.13} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};
