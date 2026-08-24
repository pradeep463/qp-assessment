#!/usr/bin/env python3
"""
Offline voiceover + timing generator for a full episode (Episode 1: "The
First Crimes"). Same offline Kokoro-82M stack as generate_voiceover.py
(model from npm `kokoro-fp16-shards`, voices from npm `kokoro-js`,
phonemization from PyPI `espeakng-loader` — no cloud, no API key).

Reads src/episode1/beats.json, synthesizes each beat in order, places them
sequentially with small gaps, and writes:
  - public/episode1-voiceover.mp3     (full narration)
  - src/episode1/timing.json          (ground-truth start/end per beat, s)

The Remotion timeline (Episode1.tsx) imports timing.json directly so every
visual reveal is locked to the actual synthesized audio — no drift.

Usage:
    python3 scripts/generate_episode.py --voice am_onyx --speed 1.0
"""
import argparse
import glob
import json
import os
import re
import subprocess
import sys
import unicodedata

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KDIR = os.path.join(ROOT, ".kokoro")
MODEL = os.path.join(KDIR, "kokoro-v1.0.fp16.onnx")
VOICES = os.path.join(KDIR, "voices.npz")
BEATS = os.path.join(ROOT, "src", "episode1", "beats.json")
TIMING_OUT = os.path.join(ROOT, "src", "episode1", "timing.json")
PUB = os.path.join(ROOT, "public")


def build_assets():
    os.makedirs(KDIR, exist_ok=True)
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
    if not os.path.exists(VOICES):
        vdir = os.path.join(ROOT, "node_modules", "kokoro-js", "voices")
        bins = sorted(glob.glob(os.path.join(vdir, "*.bin")))
        if not bins:
            sys.exit("Missing npm package 'kokoro-js' voices — run `npm install` first.")
        print(f"Building voices.npz from {len(bins)} voices...")
        voices = {os.path.splitext(os.path.basename(f))[0]:
                  np.fromfile(f, dtype=np.float32).reshape(510, 1, 256) for f in bins}
        np.savez(VOICES, **voices)


def _ascii_fold(text: str) -> str:
    """Kokoro's espeak backend silently returns 0-length audio for some
    non-ASCII input (e.g. 'Ötzi'). Fold to plain ASCII as a last resort."""
    norm = unicodedata.normalize("NFKD", text)
    return "".join(c for c in norm if not unicodedata.combining(c)).encode("ascii", "ignore").decode()


def synth_robust(k, text, voice, speed, lang, depth=0):
    """Kokoro occasionally returns a valid (non-raising) but zero-length
    array for specific inputs — observed with non-ASCII characters and with
    certain hyphenated compounds (e.g. 'first-century'). Silently accepting
    that would drop the line from the narration entirely, so retry with
    escalating normalization before giving up.
    """
    try:
        samples, sr = k.create(text, voice=voice, speed=speed, lang=lang)
    except ValueError:
        # e.g. "Nothing to synthesize, ... produced no phonemes" — a
        # normalization step upstream (de-hyphenate, ascii-fold) can strip a
        # short input down to nothing; treat like empty audio and keep
        # falling through the cascade instead of crashing the whole run.
        samples, sr = np.zeros(0, dtype=np.float32), 24000
    if len(samples) > 0:
        return samples, sr

    if depth == 0:
        # try each sentence on its own — isolates which clause is the problem
        sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
        # a single long sentence with a colon/semicolon can also trigger this
        # (observed: batching a clause-joined sentence returns 0 samples even
        # though each clause alone is fine) — split there too
        if len(sentences) == 1:
            pieces = [s.strip() for s in re.split(r"(?<=[:;])\s+", sentences[0]) if s.strip()]
            # a clause ending in ':' or ';' can itself trigger the empty-audio
            # bug even alone — swap the trailing mark for a period, which
            # keeps the same pause but synthesizes reliably
            sentences = [re.sub(r"[:;]$", ".", p) for p in pieces]
        if len(sentences) > 1:
            parts = [synth_robust(k, s, voice, speed, lang, depth + 1)[0] for s in sentences]
            pad = np.zeros(int(0.12 * sr), dtype=np.float32)
            joined = np.concatenate([p for s in parts for p in (s, pad)])[: -len(pad)]
            return joined, sr

    if depth <= 1:
        # de-hyphenate compounds (observed trigger: "first-century", and the
        # same thing between non-Latin characters, e.g. a transliterated
        # "उर-नम्मू" — \S rather than [A-Za-z] so this also fires for
        # Devanagari/Kannada script, not just English)
        despaced = re.sub(r"(?<=\S)-(?=\S)", " ", text)
        if despaced != text:
            return synth_robust(k, despaced, voice, speed, lang, depth + 1)

    if depth <= 2:
        folded = _ascii_fold(text)
        # ascii-folding a non-Latin script (Devanagari, Kannada, ...) strips
        # the entire line rather than just an accented letter or two — only
        # use the fold if it kept a meaningful amount of content.
        if folded and folded != text and len(folded.strip()) >= 0.4 * len(text.strip()):
            return synth_robust(k, folded, voice, speed, lang, depth + 1)

    if depth <= 3:
        # rare rounding edge case: a handful of (short) inputs return 0-length
        # audio at one exact speed value but not at a nearby one — nudging
        # speed by a few percent is inaudible but reliably dodges it
        candidates = {round(speed * 1.06, 4), round(speed * 0.94, 4), 1.0, 0.95}
        for cand in candidates - {speed}:
            try:
                samples, sr = k.create(text, voice=voice, speed=cand, lang=lang)
            except ValueError:
                continue
            if len(samples) > 0:
                return samples, sr

    print(f"  ! WARNING: Kokoro produced empty audio for: {text!r} — inserting 1s of silence")
    return np.zeros(int(1.0 * sr), dtype=np.float32), sr


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="am_onyx")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--lang", default="en-us")
    ap.add_argument("--gap", type=float, default=0.35, help="seconds of silence between beats")
    ap.add_argument("--case-gap-extra", type=float, default=0.5, help="extra silence when the case changes")
    ap.add_argument("--out", default=os.path.join(PUB, "episode1-voiceover.mp3"))
    ap.add_argument("--beats-file", default=BEATS, help="path to a beats.json-shaped file (e.g. beats.hi.json for a translated pass)")
    ap.add_argument("--timing-out", default=TIMING_OUT)
    args = ap.parse_args()

    build_assets()
    from kokoro_onnx import Kokoro

    data = json.load(open(args.beats_file))
    beats = data["beats"]
    sr = 24000

    print(f"Voice: {args.voice}  speed: {args.speed}  beats: {len(beats)}")
    k = Kokoro(MODEL, VOICES)

    clips = []
    cursor = 0.6  # lead-in
    prev_case = None
    timing = []
    for i, b in enumerate(beats):
        samples, _ = synth_robust(k, b["text"], args.voice, args.speed, args.lang)
        gap = args.gap if prev_case == b["case"] or prev_case is None else args.gap + args.case_gap_extra
        start = cursor if i == 0 else cursor + gap
        dur = len(samples) / sr
        end = start + dur
        clips.append((start, samples))
        timing.append({"i": i, "case": b["case"], "bridgeTo": b.get("bridgeTo"),
                        "card": b.get("card"), "text": b["text"],
                        "start": round(start, 3), "end": round(end, 3)})
        cursor = end
        prev_case = b["case"]
        print(f"  [{i+1:2d}/{len(beats)}] case {b['case']:>2}  {start:6.1f}s–{end:6.1f}s  {b['text'][:44]}")

    tail = 1.2
    total_dur = cursor + tail
    bed = np.zeros(int(total_dur * sr) + sr, dtype=np.float32)
    for start, samples in clips:
        s0 = int(start * sr)
        bed[s0:s0 + len(samples)] += samples

    peak = float(np.max(np.abs(bed))) or 1.0
    if peak > 1.0:
        bed = bed / peak * 0.98
    bed = bed[: int(total_dur * sr)]

    os.makedirs(PUB, exist_ok=True)
    import soundfile as sf
    wav = os.path.join(KDIR, "episode1-voiceover.wav")
    sf.write(wav, bed, sr)
    subprocess.run(["ffmpeg", "-y", "-i", wav, "-codec:a", "libmp3lame", "-q:a", "2", args.out],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    json.dump({"totalSeconds": round(total_dur, 3), "voice": args.voice, "speed": args.speed,
               "beats": timing}, open(args.timing_out, "w"), ensure_ascii=False, indent=2)

    mins = int(total_dur // 60)
    secs = total_dur - mins * 60
    print(f"\n✓ {args.out}")
    print(f"✓ {args.timing_out}")
    print(f"\nTotal runtime: {mins}m {secs:04.1f}s\n")


if __name__ == "__main__":
    main()
