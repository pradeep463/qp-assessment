import React from "react";
import { COLORS } from "../theme";
import { tornRectPath } from "../lib/torn";

/**
 * Shared SVG filter definitions for paper grain + soft drop shadows.
 * Rendered once near the top of the tree.
 */
export const PaperDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      {/* fine paper grain */}
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          stitchTiles="stitch"
          result="n"
        />
        <feColorMatrix in="n" type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.9" intercept="0" />
        </feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
      {/* large fibrous texture for the background */}
      <filter id="fibers">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.03"
          numOctaves={3}
          seed={7}
          result="n"
        />
        <feColorMatrix in="n" type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.06" intercept="0" />
        </feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
      {/* soft depth shadow for collage layers */}
      <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow
          dx="0"
          dy="10"
          stdDeviation="12"
          floodColor="#2a2418"
          floodOpacity="0.28"
        />
      </filter>
      <filter id="tinyShadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow
          dx="0"
          dy="4"
          stdDeviation="4"
          floodColor="#2a2418"
          floodOpacity="0.35"
        />
      </filter>
    </defs>
  </svg>
);

/**
 * A single torn-paper tile: a colored paper shape sitting on a slightly
 * larger white "deckle" edge, with grain + drop shadow. This is the core
 * building block of the collage.
 */
export const TornPaper: React.FC<{
  width: number;
  height: number;
  color: string;
  seed?: number;
  edges?: ("top" | "right" | "bottom" | "left")[];
  amp?: number;
  rotate?: number;
  x?: number;
  y?: number;
  shadow?: boolean;
  deckle?: boolean; // white torn backing edge
  children?: React.ReactNode;
}> = ({
  width,
  height,
  color,
  seed = 1,
  edges,
  amp = 11,
  rotate = 0,
  x = 0,
  y = 0,
  shadow = true,
  deckle = true,
  children,
}) => {
  const pad = amp + 4;
  const path = tornRectPath(width, height, { seed, edges, amp });
  const grainPath = tornRectPath(width, height, { seed, edges, amp });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "center",
      }}
    >
      <svg
        width={width + pad * 2}
        height={height + pad * 2}
        viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`}
        style={{
          position: "absolute",
          left: -pad,
          top: -pad,
          overflow: "visible",
          filter: shadow ? "url(#softShadow)" : undefined,
        }}
      >
        {deckle && (
          <path
            d={tornRectPath(width, height, { seed: seed + 99, edges, amp: amp + 3 })}
            fill={COLORS.white}
            transform="translate(-2,-2)"
          />
        )}
        <path d={path} fill={color} />
        {/* grain overlay clipped to the paper shape */}
        <path d={grainPath} fill="#000" filter="url(#grain)" opacity={0.16} />
      </svg>
      {children && (
        <div style={{ position: "absolute", inset: 0 }}>{children}</div>
      )}
    </div>
  );
};
