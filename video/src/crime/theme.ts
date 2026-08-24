// Palette + type for the crime/horror "case-file" explainer. Follows the
// document's own aesthetic guidance: desaturated dark base, a single signal
// color (blood red), low-key contrast, aged paper.
export const CC = {
  board: "#141210", // near-black corkboard/paper
  boardDeep: "#0C0B09",
  paper: "#D6CDB4", // aged file paper
  paperDark: "#C2B896",
  ink: "#1A1712",
  inkSoft: "#4A4234",
  red: "#B01B16", // blood / danger signal color
  redBright: "#D23A2C",
  redDark: "#7C1310",
  string: "#8E1A16",
  bone: "#E9E2CE", // off-white
  boneDim: "#B9B097",
  green: "#5F6E4E", // sickly, used sparingly
  amber: "#C98A2B",
  redact: "#0B0A08",
};

export const CFONT = {
  // System faces so rendering never needs the network.
  stamp: `"Courier New", Courier, monospace`,
  display: `Georgia, "Times New Roman", serif`,
  sans: `"Arial Narrow", "Helvetica Neue", Arial, sans-serif`,
  heavy: `"Arial Black", "Helvetica Neue", Arial, sans-serif`,
};

export const CVIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 900, // 30 seconds
};
