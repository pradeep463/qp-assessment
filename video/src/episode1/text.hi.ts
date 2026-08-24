// Hindi on-screen text for the parts of Episode 1 that aren't beat-driven
// (beats.hi.json already covers the fact-tag cards). Deliberately keeps
// common English loanwords transliterated rather than translating them —
// "सीरियल किलर," "फोरेंसिक्स," "सब्सक्राइब," "केस" — matching how this is
// actually said out loud, not textbook Hindi.

export const TRANSITION_HOOKS_HI: Record<number, string> = {
  3: "एक चेहरे वाला पीड़ित",
  4: "पहला लिखित कानून",
  5: "रोम की सीरियल किलर",
  6: "एक मक्खी ने केस खोला",
};

export const COLD_OPEN_TEXT_HI = {
  caseFileLabel: "केस फ़ाइल 001",
  title: "पहले अपराध",
};

export const INTRO_TEXT_HI = {
  heading: "5 पहली बार.",
  labels: ["हत्या", "कोल्ड केस", "कानून", "सीरियल किलर", "फोरेंसिक्स"],
  sourcesNotLegend: "स्रोत, किंवदंती नहीं",
};

export const CLOSE_TEXT_HI = {
  line1: "चार लाख तीस हज़ार साल.",
  line2: "एक सीधी रेखा.",
  subscribe: "सब्सक्राइब करें — CipherStudios",
  caseClosed: "केस बंद",
};
