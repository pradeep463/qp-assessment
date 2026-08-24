# Remotion Explainer Videos

Programmatically-generated videos built with [Remotion](https://www.remotion.dev/).
All recreate a distinct visual style procedurally (SVG + CSS) — no stock
footage required.

| Composition   | Length | Style                                          | Output                        |
| ------------- | ------ | ---------------------------------------------- | ----------------------------- |
| `AiExplainer` | 10s    | Bright mixed-media torn-paper collage          | `out/ai-explainer.mp4`        |
| `CrimePsych`  | 30s    | Dark case-file / evidence-board (crime & horror) | `out/crime-psychology.mp4`    |
| `Episode1`    | ~11min | CipherStudios TC — full documentary episode    | `out/episode1.mp4`            |

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

**Finalize with ambience + captions (offline, no re-render):**

```bash
npm run render:crime                                   # silent base (once)
python3 scripts/generate_voiceover.py --voice am_onyx --speed 1.06
npm run finalize:crime                                 # -> out/crime-psychology-vo.mp4
```

`scripts/mux_voiceover.sh` builds a subtle horror ambience bed (low drone +
sub rumble + faint air, all synthesized in ffmpeg), sidechain-ducks it under
the narration so the voice stays clear, burns in the synced captions, and muxes
everything onto the silent render. Flags: `--no-bed`, `--no-captions`.

---

## 3. CipherStudios TC — Episode 1: "The First Crimes" (~11min)

The channel's first upload — a full documentary episode in the case-file
aesthetic, built the same offline way as everything above: no cloud TTS, no
stock footage, no captions (narration only).

**Structure:** `src/episode1/beats.json` holds ~70 narration beats (each
tagged with which "case" it belongs to and an optional short on-screen fact
tag). `scripts/generate_episode.py` synthesizes every beat with Kokoro-82M,
places them sequentially, and writes `src/episode1/timing.json` — the
*actual* synthesized start/end per beat. `Episode1.tsx` imports that JSON
directly and builds Remotion `<Sequence>`s from it, so every fact-tag pops
in exactly when the narration reaches it — no manual timing, no drift.

```bash
python3 scripts/generate_episode.py --voice am_onyx --speed 1.0
npm run render:episode1        # -> out/episode1-main.mp4 (silent-free, ~11min)
```

**Welcome bumper + outro** are separate short compositions
(`WelcomeBumper.tsx`, `Outro.tsx`) with their own tiny narration
(`bookends.json` → `scripts/generate_bookends.py` → `bookends-timing.json`).
Keeping them separate means adding/editing the intro or outro never requires
re-rendering the ~15,000-frame main episode — just re-render the short clip
and re-concat:

```bash
python3 scripts/generate_bookends.py --voice am_onyx
npx remotion render src/index.ts WelcomeBumper out/welcome.mp4
npx remotion render src/index.ts Outro out/outro.mp4
ffmpeg -i out/welcome.mp4 -i out/episode1-main.mp4 -i out/outro.mp4 \
  -filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0][2:v:0][2:a:0]concat=n=3:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 24 -pix_fmt yuv420p -c:a aac out/episode1.mp4
```

**Thumbnail:** `npx remotion still src/index.ts Thumbnail out/thumbnail.png`
— a 1280×720 still composition (`Thumbnail.tsx`) built from the same
case-file components.

**Upload metadata:** `scripts/episode1-metadata.md` has title options, a
full description with chapter timestamps and sources, tags, category, and a
pinned-comment fun fact — ready to paste into YouTube Studio.

**Performance note:** a continuous `transform: scale(...)` on a large scene
tree is expensive to recomposite every frame in this software-rendered (no
GPU) environment — regardless of whether the value animates or is merely
non-1. That mistake alone turned an ~11-minute video into a projected
2h20m render; removing it (motion instead comes from periodic flash
"re-hooks" and fact-tags popping in on beat) plus baking the film-grain/
paper-fiber `feTurbulence` filters to static `public/tex-*.png` textures
(they were being recomputed identically every single frame) brought it back
to ~60 minutes at 24fps. If a new long-form scene feels slow to render,
check for exactly this pattern first.
