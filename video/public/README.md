# public/ — voiceover drop-in

Remotion serves this folder via `staticFile()`. The narrated render looks for
**`public/voiceover.mp3`** here.

## Two ways to get the voice

### A) A real human voice (truly not-AI)
1. Open `../src/crime/voscript.json` — it lists every line and the second it
   should start.
2. Record the lines (yourself, or a hired voice actor — e.g. Fiverr/Voice123),
   timed to those `start` marks.
3. Export the mix as `voiceover.mp3` into this folder.

### B) Near-human AI voice (fast)
On a machine with internet + an API key (this sandbox blocks the providers):

```bash
# most human-like (recommended)
ELEVENLABS_API_KEY=sk_...  npm run voiceover
# or
VOICE_PROVIDER=openai OPENAI_API_KEY=sk_...  npm run voiceover
```

That writes `voiceover.mp3` (timed to the script) and `captions.srt` here.

## Then render with narration + captions
```bash
npm run render:crime:vo   # -> out/crime-psychology-vo.mp4
```

The plain `npm run render:crime` stays silent (no audio file needed).
