// "Cold Case Terminal" theme — a forensic case-management interface look,
// distinct from the Case Atlas parchment palette. Mono/sans fallback stacks
// (not a webfont load) so the sample doesn't depend on font-loading working
// in the render — swap in real JetBrains Mono / IBM Plex Sans once approved.
export const CT = {
  bg: "#0A0F0D",
  panel: "#0C1B15",
  panelLine: "#1C3A2E",
  grid: "#14251E",
  ink: "#D9F2E3",
  inkDim: "#6E9484",
  accent: "#45FFA0",
  accentDim: "#1E5A40",
  amber: "#FFB238",
  red: "#FF5C5C",
  land: "#123326",
  landLine: "#1E5A40",
};

export const CFONT = {
  mono: `"JetBrains Mono", ui-monospace, Consolas, Menlo, monospace`,
  sans: `"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif`,
};
