import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../theme";
import { Stamp } from "../components/Pieces";
import { Reveal } from "../components/Text";
import { SceneWrap } from "../components/SceneKit";

// S6 — the ethical spine, then the close (loops back to the opening question).
export const S6Ethics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const closeIn = spring({ frame: frame - 64, fps, config: { damping: 16, mass: 0.8 } });
  return (
    <SceneWrap zoomFrom={1.0} zoomTo={1.08} fout={1}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
          <Stamp color={CC.red} rotate={-4} size={30}>Rule #1</Stamp>
          <div style={{ height: 40 }} />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Reveal text="Center the victim." delay={8} size={96} color={CC.bone} font={CFONT.display} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
            <Reveal text="Not the killer." delay={16} size={96} color={CC.red} font={CFONT.display} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
            <Reveal text="The ethical path is the one that lasts." delay={34} size={40} color={CC.boneDim} font={CFONT.display} style={{ fontStyle: "italic" }} />
          </div>
        </div>

        {/* close / loop */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", opacity: closeIn }}>
          <div style={{ display: "inline-block", transform: `scale(${interpolate(closeIn, [0, 1], [0.8, 1])}) rotate(-6deg)`, border: `5px solid ${CC.red}`, color: CC.red, fontFamily: CFONT.stamp, fontWeight: 700, fontSize: 42, letterSpacing: 6, padding: "12px 28px", borderRadius: 6 }}>
            CASE CLOSED
          </div>
          <div style={{ marginTop: 26, fontFamily: CFONT.stamp, fontSize: 22, color: CC.inkSoft, letterSpacing: 3 }}>
            …so, why couldn't you look away?
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
