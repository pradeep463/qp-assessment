#!/usr/bin/env bash
# Finalize the crime video: subtle horror ambience bed + sidechain-ducked
# voiceover + burned-in captions, muxed onto the already-rendered silent video.
# No re-render of frames needed. Everything is produced offline with ffmpeg.
#
# Prereqs:
#   out/crime-psychology.mp4      (npm run render:crime)
#   public/voiceover.mp3          (python3 scripts/generate_voiceover.py ...)
#   public/captions.srt           (written by the same generator)
#
# Usage:
#   scripts/mux_voiceover.sh [--no-bed] [--no-captions]
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .kokoro

BED=1; CAPS=1
for a in "$@"; do [ "$a" = "--no-bed" ] && BED=0; [ "$a" = "--no-captions" ] && CAPS=0; done

IN=out/crime-psychology.mp4
VO=public/voiceover.mp3
OUT=out/crime-psychology-vo.mp4

# 1) ambience bed (low drone + sub rumble + faint air), 32s
ffmpeg -y \
 -f lavfi -i "sine=frequency=55:duration=32" \
 -f lavfi -i "sine=frequency=82.5:duration=32" \
 -f lavfi -i "anoisesrc=color=brown:duration=32:amplitude=0.6" \
 -f lavfi -i "anoisesrc=color=white:duration=32:amplitude=0.4" \
 -filter_complex "[0:a]volume=0.34[d1];[1:a]volume=0.16[d2];[2:a]lowpass=f=110,volume=0.62[sub];[3:a]highpass=f=2500,lowpass=f=7000,volume=0.05,tremolo=f=0.12:d=0.8[air];[d1][d2][sub][air]amix=inputs=4:normalize=0[m];[m]apulsator=hz=0.06,lowpass=f=2800,afade=t=in:st=0:d=4,afade=t=out:st=28:d=4,volume=1.5[bed]" \
 -map "[bed]" -c:a pcm_s16le .kokoro/bed.wav -loglevel error

# 2) mix VO with the ducked bed (bed dips while the narrator speaks)
if [ "$BED" = "1" ]; then
  ffmpeg -y -i "$VO" -i .kokoro/bed.wav -filter_complex \
    "[1:a][0:a]sidechaincompress=threshold=0.03:ratio=8:attack=5:release=350[bd];[0:a][bd]amix=inputs=2:normalize=0:dropout_transition=0,alimiter=limit=0.95[mix]" \
    -map "[mix]" -c:a pcm_s16le .kokoro/mixed.wav -loglevel error
else
  cp "$VO" .kokoro/mixed.wav
fi

# 3) freeze the end-card to cover the tail, optionally burn captions, mux audio
if [ "$CAPS" = "1" ]; then
  VF="[0:v]tpad=stop_mode=clone:stop_duration=1.6,subtitles=$( printf %q public/captions.srt ):force_style='FontName=DejaVu Sans,Fontsize=23,Bold=1,PrimaryColour=&H00CEE2E8,BorderStyle=4,BackColour=&H84000000,Outline=0,Shadow=0,MarginV=52'[v]"
else
  VF="[0:v]tpad=stop_mode=clone:stop_duration=1.6[v]"
fi
ffmpeg -y -i "$IN" -i .kokoro/mixed.wav -filter_complex "$VF" \
  -map "[v]" -map 1:a -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest "$OUT" -loglevel error

echo "✓ $OUT"
