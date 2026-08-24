#!/usr/bin/env python3
"""
Voiceover + timing generator for a full episode, using Google Cloud
Text-to-Speech instead of Kokoro-82M — for languages Kokoro doesn't support
(here: Kannada, via the kn-IN Chirp3-HD voices). Mirrors the sequencing
logic of generate_episode.py exactly (same gap/case-gap-extra scheme,
same timing.json shape) so Episode1.tsx can consume either output
identically.

Requires a Google Cloud API key with the "Cloud Text-to-Speech API" enabled,
passed via the GOOGLE_TTS_API_KEY environment variable — never hardcode a
key into this file or commit one anywhere in the repo.

Usage:
    export GOOGLE_TTS_API_KEY=...
    python3 scripts/generate_episode_google.py \
        --voice kn-IN-Chirp3-HD-Charon --lang-code kn-IN \
        --beats-file src/episode1/beats.kn.json \
        --timing-out src/episode1/timing.kn.json \
        --out public/episode1-voiceover-kn.mp3
"""
import argparse
import base64
import json
import os
import subprocess
import sys
import tempfile
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")


def synthesize(text, voice, lang_code, api_key, out_path):
    body = json.dumps({
        "input": {"text": text},
        "voice": {"languageCode": lang_code, "name": voice},
        "audioConfig": {"audioEncoding": "MP3"},
    }).encode()
    req = urllib.request.Request(
        f"https://texttospeech.googleapis.com/v1/text:synthesize?key={api_key}",
        data=body, headers={"Content-Type": "application/json"},
    )
    try:
        resp = json.load(urllib.request.urlopen(req))
    except urllib.error.HTTPError as e:
        sys.exit(f"Google TTS request failed: {e.read().decode()}")
    audio = base64.b64decode(resp["audioContent"])
    with open(out_path, "wb") as f:
        f.write(audio)


def wav_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def make_silence(path, seconds, sr):
    subprocess.run(
        ["ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r={sr}:cl=mono",
         "-t", f"{seconds:.3f}", path],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def to_wav(mp3_path, wav_path, sr):
    subprocess.run(
        ["ffmpeg", "-y", "-i", mp3_path, "-ar", str(sr), "-ac", "1", wav_path],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="kn-IN-Chirp3-HD-Charon")
    ap.add_argument("--lang-code", default="kn-IN")
    ap.add_argument("--gap", type=float, default=0.35)
    ap.add_argument("--case-gap-extra", type=float, default=0.5)
    ap.add_argument("--sr", type=int, default=24000)
    ap.add_argument("--beats-file", required=True)
    ap.add_argument("--timing-out", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    api_key = os.environ.get("GOOGLE_TTS_API_KEY")
    if not api_key:
        sys.exit("Set GOOGLE_TTS_API_KEY in the environment first.")

    data = json.load(open(args.beats_file, encoding="utf-8"))
    beats = data["beats"]
    print(f"Voice: {args.voice}  beats: {len(beats)}")

    with tempfile.TemporaryDirectory() as tmp:
        concat_list = []
        cursor = 0.6
        prev_case = None
        timing = []
        for i, b in enumerate(beats):
            mp3_path = os.path.join(tmp, f"beat{i:03d}.mp3")
            wav_path = os.path.join(tmp, f"beat{i:03d}.wav")
            synthesize(b["text"], args.voice, args.lang_code, api_key, mp3_path)
            to_wav(mp3_path, wav_path, args.sr)
            dur = wav_duration(wav_path)

            gap = args.gap if prev_case == b["case"] or prev_case is None else args.gap + args.case_gap_extra
            start = cursor if i == 0 else cursor + gap
            end = start + dur

            if i > 0:
                gap_wav = os.path.join(tmp, f"gap{i:03d}.wav")
                make_silence(gap_wav, gap, args.sr)
                concat_list.append(gap_wav)
            else:
                lead_wav = os.path.join(tmp, "lead.wav")
                make_silence(lead_wav, cursor, args.sr)
                concat_list.append(lead_wav)
            concat_list.append(wav_path)

            timing.append({"i": i, "case": b["case"], "bridgeTo": b.get("bridgeTo"),
                            "card": b.get("card"), "text": b["text"],
                            "start": round(start, 3), "end": round(end, 3)})
            cursor = end
            prev_case = b["case"]
            print(f"  [{i+1:2d}/{len(beats)}] case {b['case']:>2}  {start:6.1f}s-{end:6.1f}s  {b['text'][:44]}")

        tail_wav = os.path.join(tmp, "tail.wav")
        make_silence(tail_wav, 1.2, args.sr)
        concat_list.append(tail_wav)
        total_dur = cursor + 1.2

        list_file = os.path.join(tmp, "concat.txt")
        with open(list_file, "w") as f:
            for p in concat_list:
                f.write(f"file '{p}'\n")

        os.makedirs(os.path.dirname(args.out), exist_ok=True)
        subprocess.run(
            ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", list_file,
             "-codec:a", "libmp3lame", "-q:a", "2", args.out],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )

    json.dump({"totalSeconds": round(total_dur, 3), "voice": args.voice,
               "beats": timing}, open(args.timing_out, "w"), ensure_ascii=False, indent=2)

    mins = int(total_dur // 60)
    secs = total_dur - mins * 60
    print(f"\n✓ {args.out}")
    print(f"✓ {args.timing_out}")
    print(f"\nTotal runtime: {mins}m {secs:04.1f}s\n")


if __name__ == "__main__":
    main()
