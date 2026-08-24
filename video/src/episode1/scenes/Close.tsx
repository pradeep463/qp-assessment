import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CC, CFONT } from "../../crime/theme";
import { TornCard, RedString, Pin, Stamp } from "../../crime/components/Pieces";
import { Reveal } from "../../crime/components/Text";
import { SkullIcon, IcemanIcon, TabletIcon, VialIcon, SickleIcon } from "../icons";

const ICONS = [SkullIcon, IcemanIcon, TabletIcon, VialIcon, SickleIcon];

type Beat = { frame: number; card: string | null };

// Full board recap — all five cases strung together — then the channel CTA
// and the closing stamp. The last two beats (subscribe / case closed) get
// their own dedicated stamps rather than the generic fact-tag, so nothing
// doubles up on screen.
export const Close: React.FC<{ beats: Beat[] }> = ({ beats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardBeats = beats.filter((b) => b.card);
  const subscribeBeat = cardBeats[cardBeats.length - 2];
  const closedBeat = cardBeats[cardBeats.length - 1];
  const midCards = cardBeats.slice(0, -2);

  let activeCard: string | null = null;
  for (const b of midCards) if (b.frame <= frame) activeCard = b.card;

  const positions = [
    { x: 140, y: 640 },
    { x: 480, y: 610 },
    { x: 820, y: 650 },
    { x: 1160, y: 610 },
    { x: 1500, y: 650 },
  ];

  const subscribeIn = spring({ frame: frame - (subscribeBeat?.frame ?? 9999), fps, config: { damping: 14, mass: 0.6 } });
  const closedIn = spring({ frame: frame - (closedBeat?.frame ?? 9999), fps, config: { damping: 14, mass: 0.6 } });

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}>
        <Reveal text="FOUR HUNDRED THIRTY THOUSAND YEARS." size={50} color={CC.bone} font={CFONT.display} style={{ justifyContent: "center" }} />
        <div style={{ marginTop: 10 }}>
          <Reveal text="ONE STRAIGHT LINE." delay={10} size={50} color={CC.red} font={CFONT.display} style={{ justifyContent: "center" }} />
        </div>
      </div>

      {activeCard && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: CC.red,
              color: CC.bone,
              fontFamily: CFONT.heavy,
              fontWeight: 900,
              fontSize: 32,
              letterSpacing: 1,
              padding: "14px 26px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
            }}
          >
            {activeCard}
          </div>
        </div>
      )}

      {positions.map((p, i) => {
        const Icon = ICONS[i];
        const s = spring({ frame: frame - i * 5, fps, config: { damping: 16, mass: 0.6 } });
        return (
          <div key={i} style={{ opacity: s }}>
            <TornCard width={200} height={200} x={p.x} y={p.y} rotate={(i - 2) * 3} seed={i + 40}>
              <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
                <Icon size={125} color={CC.ink} />
              </AbsoluteFill>
            </TornCard>
            <Pin x={p.x + 82} y={p.y - 14} color={CC.red} size={26} />
          </div>
        );
      })}
      <RedString x1={340} y1={740} x2={580} y2={720} sag={14} />
      <RedString x1={680} y1={720} x2={920} y2={750} sag={14} />
      <RedString x1={1020} y1={750} x2={1260} y2={720} sag={14} />
      <RedString x1={1360} y1={720} x2={1600} y2={750} sag={14} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            opacity: subscribeIn,
            transform: `scale(${interpolate(subscribeIn, [0, 1], [0.85, 1])})`,
          }}
        >
          <Stamp color={CC.bone} rotate={-3} size={28}>Subscribe — CipherStudios</Stamp>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 975, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            opacity: closedIn,
            transform: `rotate(-4deg) scale(${interpolate(closedIn, [0, 1], [0.8, 1])})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              border: `5px solid ${CC.red}`,
              color: CC.red,
              fontFamily: CFONT.stamp,
              fontWeight: 700,
              fontSize: 38,
              letterSpacing: 6,
              padding: "10px 26px",
              borderRadius: 6,
            }}
          >
            CASE CLOSED
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
