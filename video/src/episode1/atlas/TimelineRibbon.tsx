import React from "react";
import { AC, AFONT } from "./theme";

export const TimelineRibbon: React.FC<{ years: number[]; activeYear: number }> = ({ years, activeYear }) => {
  const min = years[0], max = years[years.length - 1];
  const pct = (y: number) => ((y - min) / (max - min)) * 100;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 118, background: "rgba(43,32,19,0.92)", display: "flex", alignItems: "center", padding: "0 80px" }}>
      <div style={{ position: "relative", flex: 1, height: 2, background: "rgba(243,233,199,0.25)" }}>
        {years.map((y) => (
          <div key={y} style={{ position: "absolute", left: `${pct(y)}%`, top: -4, width: 1, height: 10, background: "rgba(243,233,199,0.4)" }} />
        ))}
        {years.map((y) => (
          <div key={`l${y}`} style={{ position: "absolute", left: `${pct(y)}%`, top: -34, transform: "translateX(-50%)", fontFamily: AFONT.stamp, fontSize: 17, color: y === activeYear ? AC.brass : AC.vellum, opacity: y === activeYear ? 1 : 0.55 }}>
            {y}
          </div>
        ))}
        <div style={{ position: "absolute", left: `${pct(activeYear)}%`, top: -7, width: 16, height: 16, borderRadius: "50%", background: AC.brass, transform: "translateX(-50%)", boxShadow: `0 0 0 5px rgba(185,138,61,0.25)` }} />
      </div>
    </div>
  );
};
