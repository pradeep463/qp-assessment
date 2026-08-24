# Remotion Explainer Videos

Two programmatically-generated explainer videos built with
[Remotion](https://www.remotion.dev/). Both recreate a distinct collage
aesthetic procedurally (SVG + CSS) — no stock footage required.

| Composition   | Length | Style                                          | Output                        |
| ------------- | ------ | ---------------------------------------------- | ----------------------------- |
| `AiExplainer` | 10s    | Bright mixed-media torn-paper collage          | `out/ai-explainer.mp4`        |
| `CrimePsych`  | 30s    | Dark case-file / evidence-board (crime & horror) | `out/crime-psychology.mp4`    |

---

## 1. AI Explainer — Mixed-Media Collage (10s)

A 10-second explainer video about **AI**. The visual style recreates the
"mixed-media / torn-paper collage" look from the reference clip:
cream textured paper, torn deckle edges, pushpins, lined index cards,
paper bar & pie charts, and a professional hand-drawn presenter
(Open Peeps) given a B&W + white sticker-outline treatment.

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
npm run render        # AiExplainer -> out/ai-explainer.mp4
npm run render:crime  # CrimePsych  -> out/crime-psychology.mp4
npm run still         # a single frame of AiExplainer
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
  crime/              the 30s crime/horror "case file" video
    theme.ts          dark palette + type
    CrimePsych.tsx    main timeline (6 scenes on a persistent board)
    components/       Atmosphere (grain/vignette/board), Pieces (torn
                      cards, pins, red string, redaction, stamps),
                      Text (typewriter + reveal), SweetSpotChart, SceneKit
    scenes/           S1 Hook · S2 Curiosity · S3 Paradox ·
                      S4 Audience · S5 Craft · S6 Ethics
```

---

## 2. Crime & Horror Psychology — Case File (30s)

A 30-second explainer summarizing the research document *"The Psychology
and Craft of Crime & Horror Video Content."* It is deliberately built in
the aesthetic the document itself prescribes for the genre — a
**desaturated, dark "evidence board" / case-file** look with a single
signal color (blood red), aged torn paper, red investigation string,
redaction bars, typewriter stamps, film grain and vignette — and it is
structured with the document's own craft rules (a hook in the first
seconds, open loops, suspense, the inverted-U "sweet spot," an ethics
close that loops back to the opening question).

**Storyboard** (30s @ 30fps, 1920×1080):

| Time      | Scene           | Beat                                                    |
| --------- | --------------- | ------------------------------------------------------- |
| 0–5.5s    | Hook            | "Why we can't look away" — evidence board + open loop   |
| 5.5–10s   | Morbid curiosity| "It's not a flaw. It's an adaptation." (Scrivner)       |
| 10–16s    | The paradox     | amygdala → cortex → dopamine + inverted-U sweet spot    |
| 16–20.5s  | The audience    | 44% vs 23% — women & true crime (Pew, 2023)             |
| 20.5–26s  | The craft       | suspense > surprise · sound · open/close loops          |
| 26–30s    | Ethics + close  | "Center the victim, not the killer." → *Case Closed*    |

### Voiceover (offline neural voice — no cloud, no API key)

The narration in `out/crime-psychology-vo.mp4` is generated **entirely locally**
with **Kokoro-82M**, a high-quality neural TTS (not robotic espeak):

- model weights ship in the npm package `kokoro-fp16-shards` (10 shards → one `.onnx`)
- voice styles ship in `kokoro-js` (`voices/*.bin`)
- phonemization uses espeak-ng bundled inside the pip wheel `espeakng-loader`

Nothing is downloaded from HuggingFace or a TTS provider, so it runs anywhere.

```bash
pip install kokoro-onnx soundfile
python3 scripts/generate_voiceover.py --voice am_onyx --speed 1.06
```

`src/crime/voscript.json` is the single source of truth for the narration and
timing (lines are placed sequentially so they never overlap). Voices include
`am_onyx` `am_michael` (US male), `bm_george` (UK male), `bf_emma` (UK female),
`af_sarah` (US female). See `public/README.md` for the human-recording and
cloud-TTS (ElevenLabs/OpenAI) alternatives.

To attach the voice: either mux onto the silent render with ffmpeg (fast, no
re-render), or run `npm run render:crime:vo` to render with the `<Audio>` track.
