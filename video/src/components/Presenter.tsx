import React from "react";

// A flat, grayscale "paper cutout" presenter with a white sticker outline,
// echoing the black-and-white photo cutout in the reference. She points to
// the right by default; pass flip to mirror her for the other side.
const SKIN = "#CFC6B8";
const SKIN_SH = "#B7AD9C";
const HAIR = "#2E2C28";
const HAIR_HI = "#403D37";
const SHIRT = "#A49E92";
const SHIRT_SH = "#8C8578";
const LINE = "#3A372F";

export const Presenter: React.FC<{
  height: number;
  x: number;
  y: number;
  flip?: boolean;
  rotate?: number;
}> = ({ height, x, y, flip = false, rotate = 0 }) => {
  const vbW = 520;
  const vbH = 620;
  const width = (height * vbW) / vbH;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `rotate(${rotate}deg) scaleX(${flip ? -1 : 1})`,
        transformOrigin: "center",
        // white sticker outline + soft depth shadow
        filter:
          "drop-shadow(3px 0 0 #F6F2E8) drop-shadow(-3px 0 0 #F6F2E8) drop-shadow(0 3px 0 #F6F2E8) drop-shadow(0 -3px 0 #F6F2E8) drop-shadow(2px 2px 0 #F6F2E8) drop-shadow(-2px 2px 0 #F6F2E8) drop-shadow(2px -2px 0 #F6F2E8) drop-shadow(-2px -2px 0 #F6F2E8) drop-shadow(6px 14px 12px rgba(38,36,25,0.35))",
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`}>
        {/* ---- torso / shirt ---- */}
        <path
          d="M120 340 Q210 300 300 340 L340 620 L80 620 Z"
          fill={SHIRT}
        />
        <path d="M120 340 Q160 320 210 322 L210 620 L80 620 Z" fill={SHIRT_SH} opacity={0.5} />
        {/* collar */}
        <path d="M170 330 L210 380 L175 405 Z" fill="#F1ECDE" />
        <path d="M250 330 L210 380 L245 405 Z" fill="#E7E1D2" />
        {/* placket + buttons */}
        <line x1="210" y1="382" x2="210" y2="610" stroke={SHIRT_SH} strokeWidth="4" />
        {[430, 480, 530, 580].map((cy) => (
          <circle key={cy} cx="210" cy={cy} r="4" fill={LINE} opacity={0.7} />
        ))}
        {/* chest pocket */}
        <rect x="245" y="430" width="60" height="55" rx="4" fill="none" stroke={SHIRT_SH} strokeWidth="3" />

        {/* ---- pointing arm (to the right) ---- */}
        <path
          d="M285 350 Q400 330 470 300 Q500 288 500 275 L470 250 Q420 285 360 300 Q320 312 285 320 Z"
          fill={SHIRT}
        />
        {/* hand */}
        <path
          d="M470 300 Q505 292 512 274 L505 258 Q500 270 486 274 L500 262 L492 252 Q478 268 468 270 Z"
          fill={SKIN}
        />
        {/* index finger */}
        <path d="M500 268 L515 258 Q521 254 516 248 Q512 244 506 249 L492 259 Z" fill={SKIN} />

        {/* ---- neck ---- */}
        <path d="M182 300 L182 350 Q210 372 238 350 L238 300 Z" fill={SKIN} />
        <path d="M182 300 L182 340 Q196 352 210 353 L210 300 Z" fill={SKIN_SH} opacity={0.6} />

        {/* ---- hair back ---- */}
        <ellipse cx="210" cy="185" rx="115" ry="130" fill={HAIR} />
        {/* bun */}
        <circle cx="210" cy="52" r="46" fill={HAIR} />
        <circle cx="196" cy="42" r="18" fill={HAIR_HI} opacity={0.6} />

        {/* ---- face ---- */}
        <ellipse cx="210" cy="180" rx="82" ry="96" fill={SKIN} />
        <path d="M128 180 Q135 250 175 288 Q150 260 138 200 Z" fill={SKIN_SH} opacity={0.5} />
        {/* fringe / bangs */}
        <path
          d="M128 150 Q150 92 210 88 Q270 92 292 150 Q262 120 210 122 Q158 120 128 150 Z"
          fill={HAIR}
        />
        <path d="M128 150 Q140 200 150 210 Q150 150 175 128 Q150 130 128 150 Z" fill={HAIR} />
        <path d="M292 150 Q280 200 270 210 Q270 150 245 128 Q270 130 292 150 Z" fill={HAIR} />

        {/* features */}
        <path d="M168 165 Q182 158 196 165" stroke={LINE} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M224 165 Q238 158 252 165" stroke={LINE} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <ellipse cx="182" cy="182" rx="6" ry="7" fill={LINE} />
        <ellipse cx="238" cy="182" rx="6" ry="7" fill={LINE} />
        <path d="M205 195 Q210 212 216 196" stroke={SKIN_SH} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M188 228 Q210 244 232 228" stroke={LINE} strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};
