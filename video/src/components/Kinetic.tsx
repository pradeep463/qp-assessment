import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONTS } from "../theme";

// Word-by-word rise-in text, used for headlines.
export const RiseWords: React.FC<{
  text: string;
  delay?: number;
  size: number;
  color?: string;
  weight?: number;
  lineHeight?: number;
  font?: string;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, size, color = COLORS.charcoal, weight = 900, lineHeight = 0.98, font = FONTS.display, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `0 ${size * 0.28}px`,
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight,
        letterSpacing: -1,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = spring({
          frame: frame - delay - i * 3,
          fps,
          config: { damping: 16, mass: 0.6, stiffness: 130 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${interpolate(s, [0, 1], [size * 0.7, 0])}px)`,
              opacity: s,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// A little highlighted "tape/tag" label.
export const Tag: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  delay?: number;
  rotate?: number;
  size?: number;
}> = ({ children, bg = COLORS.red, color = COLORS.white, delay = 0, rotate = -2, size = 26 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.5 } });
  return (
    <div
      style={{
        display: "inline-block",
        transform: `rotate(${rotate}deg) scale(${interpolate(s, [0, 1], [0.7, 1])})`,
        opacity: s,
        background: bg,
        color,
        fontFamily: FONTS.display,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: 2,
        textTransform: "uppercase",
        padding: `${size * 0.35}px ${size * 0.7}px`,
        boxShadow: "0 6px 12px rgba(38,36,25,0.28)",
      }}
    >
      {children}
    </div>
  );
};
