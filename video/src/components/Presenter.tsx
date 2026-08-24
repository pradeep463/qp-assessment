import React from "react";
import Peep from "react-peeps";

// Professional hand-drawn presenter using the Open Peeps illustration set
// (react-peeps). We pick a pointing pose + top-bun hair to echo the reference
// character, then apply a monochrome treatment and a white "sticker" outline so
// it sits naturally in the torn-paper collage. Points right by default; `flip`
// mirrors her to point left.

export const Presenter: React.FC<{
  height: number;
  x: number;
  y: number;
  flip?: boolean;
  rotate?: number;
  face?: string;
  hair?: string;
  body?: string;
}> = ({
  height,
  x,
  y,
  flip = false,
  rotate = 0,
  face = "Cheeky",
  hair = "Bun",
  body = "PointingFingerWB",
}) => {
  const vb = { x: -360, y: -30, w: 1720, h: 1620 };
  const vbW = vb.w;
  const vbH = vb.h;
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
        // desaturate to match the B&W collage, then build a white torn-sticker
        // outline out of layered drop-shadows + a soft depth shadow.
        filter:
          "grayscale(1) contrast(1.02) " +
          "drop-shadow(5px 0 0 #F6F2E8) drop-shadow(-5px 0 0 #F6F2E8) drop-shadow(0 5px 0 #F6F2E8) drop-shadow(0 -5px 0 #F6F2E8) drop-shadow(4px 4px 0 #F6F2E8) drop-shadow(-4px 4px 0 #F6F2E8) drop-shadow(4px -4px 0 #F6F2E8) drop-shadow(-4px -4px 0 #F6F2E8) drop-shadow(8px 18px 15px rgba(38,36,25,0.34))",
      }}
    >
      <Peep
        style={{ width, height }}
        body={body as never}
        face={face as never}
        hair={hair as never}
        strokeColor="#2A2723"
        viewBox={{ x: String(vb.x), y: String(vb.y), width: String(vb.w), height: String(vb.h) }}
      />
    </div>
  );
};
