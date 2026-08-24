# AI Explainer — Mixed-Media Collage Video (Remotion)

A 10-second explainer video about **AI**, built programmatically with
[Remotion](https://www.remotion.dev/). The visual style recreates the
"mixed-media / torn-paper collage" look from the reference clip:
cream textured paper, torn deckle edges, pushpins, lined index cards,
paper bar & pie charts, and a grayscale "paper cutout" presenter with a
white sticker outline — all rendered procedurally (SVG + CSS), no stock
assets required.

## Output

- **Resolution:** 1500 × 1000 (3:2, matches the reference aspect)
- **Frame rate:** 24 fps
- **Duration:** 10 s (240 frames)
- **File:** `out/ai-explainer.mp4`

## Storyboard

| Time      | Scene                | Content                                             |
| --------- | -------------------- | --------------------------------------------------- |
| 0.0–3.5s  | **What is AI?**      | Presenter points at the title on a torn yellow board |
| 3.5–6.9s  | **How it works**    | "It learns from data" — paper bar chart + Data → Learn → Predict cards |
| 6.7–10s   | **AI is everywhere** | Paper pie chart of everyday uses + presenter + closing line |

Scenes are joined with a paper "slide-in" transition and each has a slow
Ken-Burns camera move, echoing the continuous pan/zoom of the reference.

## Develop

```bash
cd video
npm install
npm run dev        # opens Remotion Studio to preview/scrub
```

## Render

Rendering needs a Chromium build that supports the old headless mode. This
repo's environment ships one via Playwright, so the scripts point at
`chrome-headless-shell`:

```bash
npm run render     # -> out/ai-explainer.mp4
npm run still      # -> out/still.png (a single frame)
```

If you're on your own machine, drop the `--browser-executable` flag and
Remotion will download/find Chrome automatically:

```bash
npx remotion render src/index.ts AiExplainer out/ai-explainer.mp4
```

## Structure

```
src/
  index.ts            registerRoot entry
  Root.tsx            <Composition> registration
  AiExplainer.tsx     main timeline (scenes + transitions)
  theme.ts            palette, fonts, video config
  lib/torn.ts         seeded torn-paper edge geometry
  components/         Paper, Background, Pushpin, IndexCard,
                      BarChart, PieChart, Presenter, Kinetic text, Camera
  scenes/             Scene1, Scene2, Scene3
```
