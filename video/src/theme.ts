// Palette + type sampled from the reference "mixed media" collage look:
// cream textured paper, torn edges, bold red / mustard / charcoal accents.
export const COLORS = {
  paper: "#E9E1CE", // cream background
  paperDeep: "#DED4BC", // shadowed paper
  card: "#F2EDDF", // index-card off-white
  cardLine: "#B9B09B", // ruled lines on cards
  redLine: "#D8432E", // red margin line
  red: "#D0402C",
  redDark: "#A8321F",
  yellow: "#E7B23B",
  yellowDark: "#C9922A",
  charcoal: "#26241F",
  charcoalSoft: "#33302A",
  gray: "#8F8B80",
  grayDark: "#5F5B52",
  white: "#F6F2E8",
  ink: "#211F1A",
};

export const FONTS = {
  // Kept to widely-available system faces so rendering never needs the network.
  display: `"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif`,
  body: `"Helvetica Neue", Helvetica, Arial, sans-serif`,
  serif: `Georgia, "Times New Roman", serif`,
};

export const VIDEO = {
  width: 1500,
  height: 1000,
  fps: 24,
  durationInFrames: 240, // 10 seconds
};
