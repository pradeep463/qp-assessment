import React from "react";
import { CC, CFONT } from "../theme";
import { tornRectPath } from "../../lib/torn";

// A torn piece of aged file paper (case-file card).
export const TornCard: React.FC<{
  width: number;
  height: number;
  x: number;
  y: number;
  color?: string;
  seed?: number;
  rotate?: number;
  amp?: number;
  children?: React.ReactNode;
}> = ({ width, height, x, y, color = CC.paper, seed = 1, rotate = 0, amp = 10, children }) => {
  const pad = amp + 6;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, height, transform: `rotate(${rotate}deg)`, transformOrigin: "center" }}>
      <svg
        width={width + pad * 2}
        height={height + pad * 2}
        viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`}
        style={{ position: "absolute", left: -pad, top: -pad, overflow: "visible", filter: "url(#cshadow)" }}
      >
        <path d={tornRectPath(width, height, { seed: seed + 50, amp: amp + 3 })} fill={CC.bone} transform="translate(-2,-2)" opacity={0.5} />
        <path d={tornRectPath(width, height, { seed, amp })} fill={color} />
        <path d={tornRectPath(width, height, { seed, amp })} fill="#000" filter="url(#cgrain)" opacity={0.2} />
      </svg>
      {children && <div style={{ position: "absolute", inset: 0 }}>{children}</div>}
    </div>
  );
};

// A pushpin / thumbtack.
export const Pin: React.FC<{ x: number; y: number; size?: number; color?: string }> = ({ x, y, size = 34, color = CC.red }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: "url(#cshadowSm)" }}>
      <circle cx="50" cy="50" r="38" fill={color} />
      <circle cx="50" cy="50" r="38" fill="#000" filter="url(#cgrain)" opacity={0.25} />
      <ellipse cx="38" cy="36" rx="13" ry="8" fill="#fff" opacity={0.35} />
    </svg>
  </div>
);

// A taut red investigation string between two points, with a slight sag.
export const RedString: React.FC<{ x1: number; y1: number; x2: number; y2: number; sag?: number }> = ({ x1, y1, x2, y2, sag = 30 }) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag;
  const minX = Math.min(x1, x2) - 10, minY = Math.min(y1, y2) - 10;
  const w = Math.abs(x2 - x1) + 20, h = Math.abs(y2 - y1) + sag + 20;
  return (
    <svg style={{ position: "absolute", left: minX, top: minY, overflow: "visible" }} width={w} height={h}>
      <path d={`M ${x1 - minX} ${y1 - minY} Q ${mx - minX} ${my - minY} ${x2 - minX} ${y2 - minY}`}
        stroke="#000" strokeOpacity={0.5} strokeWidth={5} fill="none" transform="translate(1,3)" />
      <path d={`M ${x1 - minX} ${y1 - minY} Q ${mx - minX} ${my - minY} ${x2 - minX} ${y2 - minY}`}
        stroke={CC.string} strokeWidth={3.2} fill="none" />
    </svg>
  );
};

// A redaction bar (censor). Optionally reveals by wiping away.
export const Redacted: React.FC<{ width: number; height: number; reveal?: number; children?: React.ReactNode }> = ({ width, height, reveal = 0, children }) => (
  <div style={{ position: "relative", width, height, display: "inline-block" }}>
    {children}
    <div style={{ position: "absolute", inset: 0, background: CC.redact, transform: `scaleX(${1 - reveal})`, transformOrigin: "left center" }} />
  </div>
);

// A stamped label (rotated, distressed), e.g. CONFIDENTIAL / CASE FILE.
export const Stamp: React.FC<{ children: React.ReactNode; color?: string; rotate?: number; size?: number; opacity?: number }> = ({ children, color = CC.red, rotate = -8, size = 30, opacity = 0.9 }) => (
  <div style={{ display: "inline-block", transform: `rotate(${rotate}deg)`, border: `4px solid ${color}`, color, opacity, fontFamily: CFONT.stamp, fontWeight: 700, fontSize: size, letterSpacing: 4, textTransform: "uppercase", padding: `${size * 0.28}px ${size * 0.55}px`, borderRadius: 4 }}>
    {children}
  </div>
);
