import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Background } from "../components/Background";
import { TornPaper } from "../components/Paper";
import { IndexCard } from "../components/IndexCard";
import { BarChart } from "../components/BarChart";
import { Tag, RiseWords } from "../components/Kinetic";
import { Camera } from "../components/Camera";

const StepCard: React.FC<{
  x: number;
  y: number;
  rotate: number;
  seed: number;
  pin: string;
  n: string;
  title: string;
  sub: string;
  delay: number;
}> = ({ x, y, rotate, seed, pin, n, title, sub, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, mass: 0.7 } });
  return (
    <div
      style={{
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
        opacity: s,
      }}
    >
      <IndexCard width={360} height={190} x={x} y={y} rotate={rotate} seed={seed} pin={pin}>
        <div style={{ position: "absolute", left: 30, top: 22 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 30, fontWeight: 900, color: pin }}>
            {n}
          </div>
          <div style={{ fontFamily: FONTS.display, fontSize: 46, fontWeight: 900, color: COLORS.charcoal, marginTop: 26 }}>
            {title}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.grayDark, marginTop: 8 }}>
            {sub}
          </div>
        </div>
      </IndexCard>
    </div>
  );
};

// Scene 2 — "How it works": data grows into learning (bar chart) → steps.
export const Scene2: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Camera from={{ scale: 1.0, x: 20, y: 0 }} to={{ scale: 1.06, x: -10, y: 0 }} duration={84}>
      <TornPaper width={200} height={160} color={COLORS.charcoal} seed={13} x={-50} y={-45} rotate={5} />
      <TornPaper width={170} height={150} color={COLORS.red} seed={14} x={1350} y={-40} rotate={-6} />

      <div style={{ position: "absolute", left: 90, top: 70 }}>
        <Tag delay={4} bg={COLORS.charcoal} color={COLORS.yellow}>How it works</Tag>
      </div>
      <div style={{ position: "absolute", left: 90, top: 140, width: 620 }}>
        <RiseWords text="It learns from data." size={70} delay={8} color={COLORS.charcoal} />
      </div>

      {/* bar chart on the yellow board (left) */}
      <TornPaper width={560} height={520} color={COLORS.yellow} seed={8} x={90} y={330} rotate={-1}>
        <div style={{ position: "absolute", left: 60, top: 60, width: 440, height: 400 }}>
          <BarChart width={440} height={400} values={[3, 5, 4, 7, 9]} delay={16} />
        </div>
      </TornPaper>

      {/* three step cards on the right */}
      <div style={{ position: "absolute", left: 760, top: 250 }}>
        <StepCard x={0} y={0} rotate={-2.5} seed={41} pin={COLORS.red} n="01" title="DATA" sub="Examples go in" delay={20} />
      </div>
      <div style={{ position: "absolute", left: 760, top: 250 }}>
        <StepCard x={70} y={230} rotate={2} seed={42} pin={COLORS.charcoal} n="02" title="LEARN" sub="Finds patterns" delay={28} />
      </div>
      <div style={{ position: "absolute", left: 760, top: 250 }}>
        <StepCard x={20} y={460} rotate={-1.5} seed={43} pin={COLORS.yellowDark} n="03" title="PREDICT" sub="Answers new ones" delay={36} />
      </div>
    </Camera>
  </AbsoluteFill>
);
