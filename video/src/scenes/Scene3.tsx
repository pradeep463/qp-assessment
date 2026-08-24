import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Background } from "../components/Background";
import { TornPaper } from "../components/Paper";
import { PieChart } from "../components/PieChart";
import { Pushpin } from "../components/Pushpin";
import { Presenter } from "../components/Presenter";
import { RiseWords, Tag } from "../components/Kinetic";
import { Camera } from "../components/Camera";

const LEGEND = [
  { label: "Chat & search", color: COLORS.charcoal },
  { label: "Photos & video", color: COLORS.red },
  { label: "Maps & travel", color: COLORS.gray },
  { label: "Health & work", color: COLORS.yellow },
];

// Scene 3 — "AI is everywhere": pie of everyday uses + closing line.
export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background />
      <Camera from={{ scale: 1.06, x: -10, y: 0 }} to={{ scale: 1.0, x: 0, y: -6 }} duration={90}>
        <TornPaper width={200} height={150} color={COLORS.yellow} seed={15} x={-50} y={-40} rotate={-5} />
        <TornPaper width={170} height={160} color={COLORS.red} seed={16} x={1360} y={800} rotate={6} />

        {/* pie chart board (left) */}
        <TornPaper width={620} height={620} color={COLORS.card} seed={9} x={90} y={210} rotate={-1.5}>
          <div style={{ position: "absolute", left: 70, top: 70 }}>
            <PieChart size={360} data={[4, 3, 2.5, 2.5]} delay={8} />
          </div>
        </TornPaper>
        <Pushpin x={370} y={200} color={COLORS.red} size={40} />

        {/* legend */}
        <div style={{ position: "absolute", left: 700, top: 235 }}>
          <Tag delay={4} bg={COLORS.red}>Everyday AI</Tag>
          <div style={{ height: 22 }} />
          <div style={{ width: 360 }}>
            <RiseWords text="AI is already everywhere." size={58} delay={8} color={COLORS.charcoal} />
          </div>
          <div style={{ marginTop: 34 }}>
            {LEGEND.map((l, i) => {
              const s = spring({ frame: frame - 20 - i * 5, fps, config: { damping: 15, mass: 0.6 } });
              return (
                <div
                  key={l.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 16,
                    opacity: s,
                    transform: `translateX(${interpolate(s, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <div style={{ width: 30, height: 30, background: l.color, boxShadow: "0 3px 6px rgba(38,36,25,0.3)" }} />
                  <span style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 34, color: COLORS.charcoalSoft }}>
                    {l.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* presenter on the right edge, pointing left toward the content */}
        <Presenter height={760} x={1000} y={250} flip rotate={1} />

        {/* closing tag */}
        <div style={{ position: "absolute", left: 700, top: 720 }}>
          <Tag delay={44} bg={COLORS.charcoal} color={COLORS.yellow} rotate={-2} size={28}>
            Learns from your data
          </Tag>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
