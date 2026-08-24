import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../theme";

// Typewriter reveal with a blinking cursor.
export const Typewriter: React.FC<{
  text: string;
  startAt?: number;
  cps?: number; // chars per second
  size: number;
  color?: string;
  font?: string;
  weight?: number;
  letterSpacing?: number;
  cursor?: boolean;
  style?: React.CSSProperties;
}> = ({ text, startAt = 0, cps = 22, size, color = CC.bone, font = CFONT.stamp, weight = 700, letterSpacing = 1, cursor = true, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((frame - startAt) / fps) * cps));
  const shown = text.slice(0, n);
  const done = n >= text.length;
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={{ fontFamily: font, fontSize: size, color, fontWeight: weight, letterSpacing, ...style }}>
      {shown}
      {cursor && (!done || blink) && frame >= startAt ? <span style={{ opacity: blink ? 1 : 0.2 }}>▌</span> : null}
    </span>
  );
};

// Word-by-word rise-in headline.
export const Reveal: React.FC<{
  text: string;
  delay?: number;
  size: number;
  color?: string;
  font?: string;
  weight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, size, color = CC.bone, font = CFONT.display, weight = 700, lineHeight = 1.0, letterSpacing = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight, letterSpacing, ...style }}>
      {words.map((w, i) => {
        const s = spring({ frame: frame - delay - i * 3, fps, config: { damping: 18, mass: 0.6, stiffness: 120 } });
        return (
          <span key={i} style={{ display: "inline-block", transform: `translateY(${interpolate(s, [0, 1], [size * 0.5, 0])}px)`, opacity: s, filter: `blur(${interpolate(s, [0, 1], [6, 0])}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
