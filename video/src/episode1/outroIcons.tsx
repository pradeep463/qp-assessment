import React from "react";
import { CC } from "../crime/theme";

const wrap = (size: number, children: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    {children}
  </svg>
);

export const LikeIcon: React.FC<{ size: number; color?: string }> = ({ size, color = CC.ink }) => wrap(size,
  <path
    d="M60 90 L60 170 L40 170 L40 90 Z M60 95 L110 30 Q118 20 128 28 Q135 34 130 46 L115 85 L155 85 Q170 85 168 100 L158 155 Q155 170 138 170 L70 170 Z"
    fill={color}
  />
);

export const SubscribeIcon: React.FC<{ size: number; color?: string }> = ({ size, color = CC.ink }) => wrap(size,
  <>
    <rect x="30" y="55" width="140" height="95" rx="14" fill={color} />
    <path d="M85 78 L130 102 L85 126 Z" fill={CC.paper} />
  </>
);

export const ShareIcon: React.FC<{ size: number; color?: string }> = ({ size, color = CC.ink }) => wrap(size,
  <>
    <circle cx="150" cy="45" r="22" fill={color} />
    <circle cx="150" cy="155" r="22" fill={color} />
    <circle cx="45" cy="100" r="22" fill={color} />
    <line x1="60" y1="90" x2="132" y2="55" stroke={color} strokeWidth={9} />
    <line x1="60" y1="110" x2="132" y2="145" stroke={color} strokeWidth={9} />
  </>
);

export const BellIcon: React.FC<{ size: number; color?: string }> = ({ size, color = CC.ink }) => wrap(size,
  <>
    <path d="M100 25 Q130 25 130 65 Q130 110 145 130 L55 130 Q70 110 70 65 Q70 25 100 25 Z" fill={color} />
    <circle cx="100" cy="150" r="14" fill={color} />
  </>
);
