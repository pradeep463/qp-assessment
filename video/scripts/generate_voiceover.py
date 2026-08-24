#!/usr/bin/env python3
"""
Offline voiceover generator for the CrimePsych video — NO cloud, NO API keys.

Uses Kokoro-82M (a high-quality neural TTS, not robotic) entirely locally:
  - model weights come from the npm package `kokoro-fp16-shards` (10 shards
    concatenated into one .onnx)
  - voice styles come from the npm package `kokoro-js` (voices/*.bin)
  - phonemization uses espeak-ng bundled inside the pip wheel `espeakng-loader`
Everything is reachable from this sandbox (npm + PyPI), so it runs here.

Reads src/crime/voscript.json, synthesizes each line, and places it at its
exact timestamp on a silent bed so narration lines up with the scenes. Writes
public/voiceover.mp3 (+ public/captions.srt).

Setup (once):
    pip install kokoro-onnx soundfile
    npm install            # brings in kokoro-js + kokoro-fp16-shards

Run:
    python scripts/generate_voiceover.py --voice am_onyx --speed 0.95
Then:
    npm run render:crime:vo
"""
import argparse
import glob
import json
import os
import subprocess
import sys

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KDIR = os.path.join(ROOT, ".kokoro")
MODEL = os.path.join(KDIR, "kokoro-v1.0.fp16.onnx")
VOICES = os.path.join(KDIR, "voices.npz")
SCRIPT = os.path.join(ROOT, "src", "crime", "voscript.json")
PUB = os.path.join(ROOT, "public")


def build_assets():
    os.makedirs(KDIR, exist_ok=True)
    # 1) model: concat kokoro-fp16-shards/*.part*.bin -> one .onnx
    if not os.path.exists(MODEL):
        shard_dir = os.path.join(ROOT, "node_modules", "kokoro-fp16-shards")
        shards = sorted(glob.glob(os.path.join(shard_dir, "kokoro-fp16.part*.bin")),
                        key=lambda p: int(p.split("part")[1].split(".")[0]))
        if not shards:
            sys.exit("Missing npm package 'kokoro-fp16-shards' — run `npm install` first.")
        print(f"Assembling model from {len(shards)} shards...")
        with open(MODEL, "wb") as out:
            for s in shards:
                with open(s, "rb") as f:
                    out.write(f.read())
    # 2) voices: kokoro-js/voices/*.bin (510,256) -> voices.npz {name:(510,1,256)}
    if not os.path.exists(VOICES):
        vdir = os.path.join(ROOT, "node_modules", "kokoro-js", "voices")
        bins = sorted(glob.glob(os.path.join(vdir, "*.bin")))
        if not bins:
            sys.exit("Missing npm package 'kokoro-js' voices — run `npm install` first.")
        print(f"Building voices.npz from {len(bins)} voices...")
        voices = {os.path.splitext(os.path.basename(f))[0]:
                  np.fromfile(f, dtype=np.float32).reshape(510, 1, 256) for f in bins}
        np.savez(VOICES, **voices)


def srt_time(t):
    h, m = int(t // 3600), int((t % 3600) // 60)
    s, ms = int(t % 60), int(round((t % 1) * 1000))
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="am_onyx", help="Kokoro voice, e.g. am_onyx, bm_george, bf_emma, af_sarah")
    ap.add_argument("--speed", type=float, default=0.95)
    ap.add_argument("--lang", default="en-us")
    ap.add_argument("--out", default=os.path.join(PUB, "voiceover.mp3"))
    args = ap.parse_args()

    build_assets()
    from kokoro_onnx import Kokoro  # imported after assets exist

    script = json.load(open(SCRIPT))
    lines = script["lines"]
    total = script.get("total", 30)
    sr = 24000

    print(f"Voice: {args.voice}  speed: {args.speed}")
    k = Kokoro(MODEL, VOICES)
    gap = 0.12  # min silence between lines
    clips, cursor, placed = [], 0.0, []
    for i, ln in enumerate(lines):
        samples, _ = k.create(ln["text"], voice=args.voice, speed=args.speed, lang=args.lang)
        start = max(ln["start"], cursor + (gap if i else 0.0))
        cursor = start + len(samples) / sr
        clips.append((start, samples))
        placed.append(start)
        print(f"  [{i+1}/{len(lines)}] {start:>5.1f}s  ({len(samples)/sr:4.2f}s)  {ln['text'][:48]}")

    audio_len = max(int(total * sr), int(cursor * sr) + sr)
    bed = np.zeros(audio_len, dtype=np.float32)
    for start, samples in clips:
        s0 = int(start * sr)
        bed[s0:s0 + len(samples)] += samples
    if cursor > total:
        print(f"  ! narration runs to {cursor:.1f}s (>{total}s); video will be extended to fit.")

    peak = float(np.max(np.abs(bed))) or 1.0
    if peak > 1.0:
        bed = bed / peak * 0.98
    # trim trailing silence, keep a short tail
    nz = np.nonzero(np.abs(bed) > 1e-3)[0]
    if len(nz):
        bed = bed[: min(len(bed), nz[-1] + int(0.6 * sr))]

    os.makedirs(PUB, exist_ok=True)
    import soundfile as sf
    wav = os.path.join(KDIR, "voiceover.wav")
    sf.write(wav, bed, sr)
    subprocess.run(["ffmpeg", "-y", "-i", wav, "-codec:a", "libmp3lame", "-q:a", "3", args.out],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    srt = "\n".join(
        f"{i+1}\n{srt_time(l['start'])} --> {srt_time((lines[i+1]['start'] if i+1 < len(lines) else total) - 0.05)}\n{l['text']}\n"
        for i, l in enumerate(lines)
    )
    open(os.path.join(PUB, "captions.srt"), "w").write(srt)

    print(f"\n✓ {args.out}")
    print(f"✓ {os.path.join(PUB, 'captions.srt')}")
    print("\nRender narrated video:\n  npm run render:crime:vo\n")


if __name__ == "__main__":
    main()
