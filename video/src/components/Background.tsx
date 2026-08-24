import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../theme";

// Cream paper backdrop with fibrous texture + a soft vignette so the
// collage layers read against it.
export const Background: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
    <AbsoluteFill style={{ filter: "url(#fibers)", opacity: 1 }}>
      <div style={{ width: "100%", height: "100%", background: COLORS.charcoal }} />
    </AbsoluteFill>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 120% at 50% 38%, rgba(255,255,255,0.10), rgba(40,36,25,0.20) 100%)",
      }}
    />
  </AbsoluteFill>
);
