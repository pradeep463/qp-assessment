import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { geoNaturalEarth1, geoPath, GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import land110 from "world-atlas/land-110m.json";
import { AC } from "./theme";

// Real land geometry (Natural Earth, 110m simplification, via the world-atlas
// npm package) projected once at module load — this is an actual world map,
// not hand-plotted points, so every coastline and every pin's position both
// come from the same real lat/long data instead of being eyeballed to agree.
const landFeature = feature(land110 as any, (land110 as any).objects.land) as any;
const projection: GeoProjection = geoNaturalEarth1().fitSize([1920, 1080], landFeature);
const pathGen = geoPath(projection);
export const LAND_D = pathGen(landFeature) as string;

export function project(lon: number, lat: number): [number, number] {
  return projection([lon, lat]) as [number, number];
}

export type GeoPin = { lon: number; lat: number; label: string; active?: boolean; labelBelow?: boolean };

export const MapBoard: React.FC<{
  pins: GeoPin[];
  zoomInAt: number; // seconds
  // Where the active pin should land once zoomed — defaults to true frame
  // center, but a dossier card overlaid on one side (as in AtlasSample)
  // covers that point, so callers with an overlay should pass the center of
  // whatever area actually stays visible instead.
  focus?: { x: number; y: number };
  // The previous case's pin — when given, the camera stays at the zoomed-in
  // scale throughout and glides from that location to this case's active
  // pin, instead of zooming out to the wide view and back in on every cut.
  // Omit for the very first case (which still does the wide-to-zoomed
  // establishing push) and for bookend scenes.
  fromPin?: { lon: number; lat: number };
  // A single beat this case wants the map itself to react to — draws an
  // expanding "search" ring and a small evidence icon at the active pin,
  // so the map is doing narrative work instead of sitting idle once zoomed.
  revealAt?: number;
  EvidenceIcon?: React.FC<{ size: number; color: string }>;
}> = ({ pins, zoomInAt, focus, fromPin, revealAt, EvidenceIcon }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  const projected = pins.map((p) => ({ ...p, xy: project(p.lon, p.lat) }));
  const active = projected.find((p) => p.active) ?? projected[0];
  const fromXY = fromPin ? project(fromPin.lon, fromPin.lat) : null;

  // A single bounded push-in that settles once, not a continuous per-frame
  // zoom over the whole runtime — the render-cost trap this project's own
  // README documents for Episode 1's diagrams. Uses an explicit-duration
  // ease rather than spring() — spring's implicit settle time at this
  // damping/mass was under half a second (a snap-cut, not a push); a fixed
  // ~1.3s window gives predictable, checkable pacing instead.
  const zoom = interpolate(frame, [f(zoomInAt), f(zoomInAt) + 32], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // With a fromPin, we're already zoomed in from the previous case — hold
  // scale constant and glide the focus point instead of re-running the
  // zoom-in, so cuts read as one continuous journey across the map rather
  // than five independent zoom-ins.
  const scale = fromXY ? 1.5 : interpolate(zoom, [0, 1], [1, 1.5]);
  const cx = focus?.x ?? width / 2, cy = focus?.y ?? height / 2;
  const originX = fromXY ? interpolate(zoom, [0, 1], [fromXY[0], active.xy[0]]) : active.xy[0];
  const originY = fromXY ? interpolate(zoom, [0, 1], [fromXY[1], active.xy[1]]) : active.xy[1];
  // transform-origin is pinned to the (possibly gliding) focus point, so
  // scale() alone leaves that point fixed on screen; translate (rightmost,
  // applied first) then carries that fixed point the rest of the way to
  // frame center. (An earlier version composed translate+scale around the
  // element's center instead of the pin, which is why the "zoom" landed on
  // Africa instead of Argentina — scaling around the wrong origin moves the
  // target point rather than fixing it.)
  const tx = fromXY ? cx - originX : interpolate(zoom, [0, 1], [0, cx - active.xy[0]]);
  const ty = fromXY ? cy - originY : interpolate(zoom, [0, 1], [0, cy - active.xy[1]]);

  // A plain opacity fade rather than a stroke-dashoffset "draw-in": this
  // route already has its own permanent dash pattern (10px/9px, real pixel
  // units), and pathLength-normalized dashoffset reveal requires the dash
  // pattern to be in that same 0..1 normalized space (a single dash the
  // full path length) — combining the two the way the previous version did
  // meant the "dash 10, gap 9" was ~10x longer than the whole normalized
  // path, so it always rendered fully solid regardless of the reveal
  // progress (and never actually looked dashed either).
  const routeIn = interpolate(frame, [f(0.2), f(0.2) + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const routeD = "M " + projected.map((p) => `${p.xy[0]},${p.xy[1]}`).join(" L ");

  // The one map-surface reaction to this case's key beat: two staggered
  // "radar ping" rings expanding from the active pin, plus a matching bump
  // on the pin itself. Both are finite, one-shot animations gated on
  // revealFrame — not a continuous loop — so the map goes back to sitting
  // quietly once the beat has passed, same render-cost discipline as
  // everything else here (one circle's radius/opacity per frame).
  const revealFrame = revealAt !== undefined ? f(revealAt) : null;
  const pingRing = (delay: number) => {
    if (revealFrame === null) return null;
    const t = frame - revealFrame - delay;
    if (t < 0 || t > 46) return null;
    const p = t / 46;
    return { r: interpolate(p, [0, 1], [6, 78]), opacity: interpolate(p, [0, 1], [0.65, 0]) };
  };
  const ringA = pingRing(0);
  const ringB = pingRing(16);
  const revealDt = revealFrame === null ? -999 : frame - revealFrame;
  const pinPunch = revealDt >= 0 && revealDt < 30 ? Math.exp(-revealDt / 10) * Math.sin((revealDt / 30) * Math.PI) : 0;
  const iconIn = revealFrame === null ? 0 : spring({ frame: frame - revealFrame - 6, fps, config: { damping: 14, mass: 0.5 } });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #ECE1C2, ${AC.parch} 42%, ${AC.parchDeep})` }}>
      {/* faint graticule */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.13 }}>
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 160} y1={0} x2={i * 160} y2={height} stroke={AC.inkFaint} strokeWidth={1} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 155} x2={width} y2={i * 155} stroke={AC.inkFaint} strokeWidth={1} />
        ))}
      </svg>

      <div style={{ position: "absolute", inset: 0, transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: `${originX}px ${originY}px` }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={LAND_D} fill={AC.land} stroke={AC.landLine} strokeWidth={1} opacity={0.85} />

          {/* "marching ants" — a continuously-incrementing dashoffset on one
              isolated path element. Cheap (a single number changing per
              frame on one already-small element), not the whole-scene
              per-frame recomposite this project's README warns about. */}
          <path
            d={routeD}
            fill="none"
            stroke={AC.brass}
            strokeWidth={3}
            strokeDasharray="10 9"
            strokeDashoffset={-frame * 0.6}
            strokeLinecap="round"
            opacity={routeIn * 0.85}
          />

          {/* compass rose — the ring/ticks stay fixed (a spinning frame reads
              as broken), only the needle turns, like it's settling. Small,
              isolated element: cheap to animate continuously. */}
          <g transform="translate(1780,150)" opacity={0.55}>
            <circle r={62} fill="none" stroke={AC.ink} strokeWidth={1.4} />
            <circle r={40} fill="none" stroke={AC.ink} strokeWidth={0.8} />
            <line x1={0} y1={-58} x2={0} y2={58} stroke={AC.ink} strokeWidth={0.8} />
            <line x1={-58} y1={0} x2={58} y2={0} stroke={AC.ink} strokeWidth={0.8} />
            <g transform={`rotate(${Math.sin(frame * 0.02) * 6})`}>
              <path d="M0,-26 L11,0 L0,26 L-11,0 Z" fill={AC.wax} />
            </g>
            <text x={0} y={-70} textAnchor="middle" fontFamily="Georgia" fontSize={16} fill={AC.ink}>N</text>
          </g>

          {projected.map((p, i) => {
            const pinIn = spring({ frame: frame - f(0.4 + i * 0.15), fps, config: { damping: 16, mass: 0.5 } });
            // The standard "balloon pin" construction (the same curve
            // shape used across most map-pin icon sets): a two-segment C/S
            // bezier pair, well-tested geometry, rather than hand-derived
            // arc flags — the previous attempt hit the degenerate case
            // where the two tangent points sit exactly on a diameter,
            // which made the arc direction ambiguous and self-intersecting.
            // Shifted so local (0,0) is the TIP, not the top of the head —
            // the group below translates (0,0) to the real geo coordinate,
            // so the anchor point has to be wherever the icon should be
            // read as "pointing," per normal map-pin convention. The first
            // version anchored the top of the head instead, which put the
            // true coordinate a full pin-height above where the tip
            // appeared to point.
            const pinPath = "M0,-34 C-6.58,-34 -11.9,-28.68 -11.9,-22.1 C-11.9,-13.17 0,0 0,0 S11.9,-13.17 11.9,-22.1 C11.9,-28.68 6.58,-34 0,-34 Z";
            const headCy = -22.1;
            // Only the active pin gets the reveal-beat bump — the ping rings
            // and evidence icon below are already scoped to the active pin,
            // so an inactive pin bumping too would read as a stray signal.
            const pinScale = interpolate(pinIn, [0, 1], [0.4, 1]) * (1 + (p.active ? pinPunch * 0.3 : 0));
            return (
              <g key={i} opacity={pinIn} transform={`translate(${p.xy[0]} ${p.xy[1]}) scale(${pinScale})`}>
                <path d={pinPath} fill={p.active ? AC.brass : AC.wax} stroke={AC.ink} strokeWidth={1.2} filter="url(#cshadowSm)" />
                <ellipse cx={-4} cy={headCy - 5} rx={4.5} ry={2.8} fill="#fff" opacity={0.3} />
                <circle cx={0} cy={headCy} r={5} fill={AC.vellum} />
                {/* West Shelby (1915) and New York City (1956) sit close enough on
                    the map that same-side labels collide — labelBelow flips one
                    below its pin instead of hand-nudging pixel offsets. */}
                <text x={0} y={p.labelBelow ? 26 : -46} textAnchor="middle" fontFamily="Courier New" fontSize={17} fill={AC.ink} letterSpacing={0.5}>
                  {p.label}
                </text>
              </g>
            );
          })}

          {/* "search radius" ping — two staggered rings expanding out from
              the active pin at this case's key beat, so the map itself
              reacts to the reveal instead of sitting static under the card. */}
          {(ringA || ringB) && (
            <g transform={`translate(${active.xy[0]} ${active.xy[1]})`}>
              {ringA && <circle r={ringA.r} fill="none" stroke={AC.brass} strokeWidth={2.5} opacity={ringA.opacity} />}
              {ringB && <circle r={ringB.r} fill="none" stroke={AC.brass} strokeWidth={2.5} opacity={ringB.opacity} />}
            </g>
          )}

          {/* the case's evidence icon, appearing beside the active pin on
              the same beat as the ping rings — a small, concrete image tied
              to the map location rather than floating in the dossier card. */}
          {EvidenceIcon && revealFrame !== null && frame >= revealFrame && (
            <g
              transform={`translate(${active.xy[0] + 52} ${active.xy[1] - 18}) scale(${interpolate(iconIn, [0, 1], [0.5, 1])})`}
              opacity={interpolate(iconIn, [0, 1], [0, 1])}
            >
              <circle r={26} fill={AC.vellum} stroke={AC.ink} strokeWidth={1.2} opacity={0.95} filter="url(#cshadowSm)" />
              <EvidenceIcon size={30} color={AC.ink} />
            </g>
          )}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
