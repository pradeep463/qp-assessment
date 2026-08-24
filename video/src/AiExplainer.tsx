import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { PaperDefs } from "./components/Paper";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";

// Slides a scene in from the right like a fresh sheet dropped on the collage.
const SlideIn: React.FC<{ children: React.ReactNode; enable?: boolean }> = ({
  children,
  enable = true,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
  const x = enable ? interpolate(ease, [0, 1], [100, 0]) : 0;
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${x}%)`,
        boxShadow: x > 0.5 ? "-30px 0 60px rgba(38,36,25,0.35)" : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const AiExplainer: React.FC = () => (
  <AbsoluteFill>
    <PaperDefs />
    <Sequence from={0} durationInFrames={88}>
      <SlideIn enable={false}>
        <Scene1 />
      </SlideIn>
    </Sequence>
    <Sequence from={82} durationInFrames={84}>
      <SlideIn>
        <Scene2 />
      </SlideIn>
    </Sequence>
    <Sequence from={160} durationInFrames={80}>
      <SlideIn>
        <Scene3 />
      </SlideIn>
    </Sequence>
  </AbsoluteFill>
);
