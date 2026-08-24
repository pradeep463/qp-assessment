import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../theme";
import { Background } from "../components/Background";
import { TornPaper } from "../components/Paper";
import { Pushpin } from "../components/Pushpin";
import { Presenter } from "../components/Presenter";
import { RiseWords, Tag } from "../components/Kinetic";
import { Camera } from "../components/Camera";

// Scene 1 — Title board: presenter points at the headline "WHAT IS AI?"
export const Scene1: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Camera
      from={{ scale: 1.08, x: 10, y: 6 }}
      to={{ scale: 1.0, x: 0, y: 0 }}
      duration={84}
    >
      {/* corner collage accents */}
      <TornPaper width={190} height={150} color={COLORS.red} seed={11} x={-40} y={-40} rotate={-6} />
      <TornPaper width={150} height={150} color={COLORS.charcoal} seed={12} x={1360} y={780} rotate={5} />
      <TornPaper width={140} height={120} color={COLORS.yellow} seed={31} x={40} y={760} rotate={4} />
      <Pushpin x={95} y={35} color={COLORS.charcoal} size={38} />

      {/* big yellow panel holding the headline */}
      <TornPaper width={840} height={580} color={COLORS.yellow} seed={7} x={610} y={210} rotate={-1.5}>
        <div style={{ position: "absolute", left: 130, top: 96, width: 640 }}>
          <Tag delay={6} bg={COLORS.red}>10-second explainer</Tag>
          <div style={{ height: 26 }} />
          <RiseWords text="WHAT IS AI?" size={128} delay={10} color={COLORS.charcoal} />
          <div style={{ height: 28 }} />
          <RiseWords
            text="Artificial Intelligence, simply put."
            size={38}
            delay={26}
            weight={700}
            color={COLORS.charcoalSoft}
            lineHeight={1.1}
          />
        </div>
      </TornPaper>

      {/* presenter cutout, lower-left, pointing right at the headline */}
      <Presenter height={760} x={-60} y={235} rotate={-1} />
      <Pushpin x={1370} y={240} color={COLORS.red} size={40} />
    </Camera>
  </AbsoluteFill>
);
