#!/usr/bin/env python3
"""
Generates voiceover + timing for the welcome bumper and outro (see
bookends.json). Same offline Kokoro-82M stack as generate_episode.py. Kept
separate from the main episode so adding/editing these never requires
re-rendering the 15,000-frame main video.

Usage:
    python3 scripts/generate_bookends.py --voice am_onyx --speed 1.0
"""
import argparse
import glob
import json
import os
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from generate_episode import synth_robust, build_assets, MODEL, VOICES  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOOKENDS = os.path.join(ROOT, "src", "episode1", "bookends.json")
PUB = os.path.join(ROOT, "public")


def render_track(name, spec, voice, speed, lang):
    from kokoro_onnx import Kokoro
    sr = 24000
    k = Kokoro(MODEL, VOICES)
    lines = spec["lines"]
    total = spec["total"]
    bed = np.zeros(int(total * sr) + sr, dtype=np.float32)
    timing = []
    cursor = 0.0
    for i, ln in enumerate(lines):
        samples, _ = synth_robust(k, ln["text"], voice, speed, lang)
        start = max(ln["start"], cursor + (0.15 if i else 0))
        end = start + len(samples) / sr
        s0 = int(start * sr)
        bed[s0:s0 + len(samples)] += samples
        timing.append({"start": round(start, 3), "end": round(end, 3), "text": ln["text"]})
        cursor = end
        print(f"  [{name}] {start:.1f}s-{end:.1f}s  {ln['text'][:50]}")
    total_real = max(total, cursor + 1.0)
    bed = bed[: int(total_real * sr)]
    peak = float(np.max(np.abs(bed))) or 1.0
    if peak > 1.0:
        bed = bed / peak * 0.98

    os.makedirs(PUB, exist_ok=True)
    import soundfile as sf
    wav = os.path.join(ROOT, ".kokoro", f"{name}.wav")
    sf.write(wav, bed, sr)
    mp3 = os.path.join(PUB, f"{name}.mp3")
    subprocess.run(["ffmpeg", "-y", "-i", wav, "-codec:a", "libmp3lame", "-q:a", "2", mp3],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return {"totalSeconds": round(total_real, 3), "lines": timing}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="am_onyx")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--lang", default="en-us")
    args = ap.parse_args()

    build_assets()
    spec = json.load(open(BOOKENDS))

    out = {}
    for name in ("welcome", "outro"):
        out[name] = render_track(name, spec[name], args.voice, args.speed, args.lang)

    json.dump(out, open(os.path.join(ROOT, "src", "episode1", "bookends-timing.json"), "w"), indent=2)
    print("\n✓ public/welcome.mp3 + public/outro.mp3")
    print("✓ src/episode1/bookends-timing.json")


if __name__ == "__main__":
    main()
