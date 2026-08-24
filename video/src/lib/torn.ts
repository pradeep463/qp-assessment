// Deterministic helpers for generating torn-paper edges.
// A seeded RNG keeps every render frame identical (no flicker).

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Edge = "top" | "right" | "bottom" | "left";

/**
 * Build an SVG path for a rectangle whose chosen edges are torn (jagged).
 * Non-torn edges stay straight. Coordinates run 0..w / 0..h.
 */
export function tornRectPath(
  w: number,
  h: number,
  opts: {
    seed?: number;
    edges?: Edge[];
    amp?: number; // jitter amplitude in px
    step?: number; // spacing between jag points in px
  } = {}
): string {
  const {
    seed = 1,
    edges = ["top", "right", "bottom", "left"],
    amp = 10,
    step = 16,
  } = opts;
  const rand = mulberry32(seed);
  const jag = (t: boolean) => (t ? (rand() - 0.5) * 2 * amp : 0);

  const pts: [number, number][] = [];

  // top: left -> right
  {
    const torn = edges.includes("top");
    const n = Math.max(2, Math.floor(w / step));
    for (let i = 0; i <= n; i++) {
      const x = (w * i) / n;
      pts.push([x, jag(torn && i > 0 && i < n) + (torn ? amp * 0.6 : 0)]);
    }
  }
  // right: top -> bottom
  {
    const torn = edges.includes("right");
    const n = Math.max(2, Math.floor(h / step));
    for (let i = 1; i <= n; i++) {
      const y = (h * i) / n;
      pts.push([w + jag(torn && i < n) - (torn ? amp * 0.6 : 0), y]);
    }
  }
  // bottom: right -> left
  {
    const torn = edges.includes("bottom");
    const n = Math.max(2, Math.floor(w / step));
    for (let i = 1; i <= n; i++) {
      const x = w - (w * i) / n;
      pts.push([x, h + jag(torn && i < n) - (torn ? amp * 0.6 : 0)]);
    }
  }
  // left: bottom -> top
  {
    const torn = edges.includes("left");
    const n = Math.max(2, Math.floor(h / step));
    for (let i = 1; i < n; i++) {
      const y = h - (h * i) / n;
      pts.push([jag(torn) + (torn ? amp * 0.6 : 0), y]);
    }
  }

  return (
    "M " +
    pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") +
    " Z"
  );
}
