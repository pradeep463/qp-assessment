# public/ — voiceover drop-in

Remotion serves this folder via `staticFile()`. The narrated render looks for
**`public/voiceover.mp3`** here.

## Option 1 — Local neural voice (works offline, recommended)

Kokoro-82M runs 100% locally — no cloud, no API key. Model weights come from
the npm package `kokoro-fp16-shards`, voices from `kokoro-js`, and phonemization
from the pip wheel `espeakng-loader`. It's a real neural voice, not robotic.

```bash
pip install kokoro-onnx soundfile
npm install                                   # brings the model + voices
python3 scripts/generate_voiceover.py --voice am_onyx --speed 0.95
```

Voices: `am_onyx` `am_michael` `am_adam` (US male) · `bm_george` `bm_lewis`
(UK male) · `bf_emma` `bf_alice` (UK female) · `af_sarah` `af_nicole` (US female).

## Option 2 — A real human recording (truly not-AI)

1. Open `../src/crime/voscript.json` — every line + the second it starts.
2. Record them (yourself, or a voice actor — Fiverr/Voice123), timed to those marks.
3. Export the mix as `voiceover.mp3` into this folder.

## Option 3 — Cloud TTS (ElevenLabs / OpenAI)

On a machine with internet + an API key:

```bash
ELEVENLABS_API_KEY=sk_...  npm run voiceover:cloud
```

## Then render with narration + captions
```bash
npm run render:crime:vo     # -> out/crime-psychology-vo.mp4
```

Plain `npm run render:crime` stays silent (no audio file needed).
