#!/usr/bin/env node
/*
 * Generate a timed voiceover track for the CrimePsych video from voscript.json.
 *
 * It calls a high-quality TTS provider per line, then uses ffmpeg to drop each
 * clip at its exact timestamp on a 30s silent bed — so the narration lines up
 * with the on-screen scenes. Also writes an .srt subtitle file.
 *
 * Run this on a machine WITH network access + an API key (this sandbox blocks
 * the providers). Output: public/voiceover.mp3  (+ public/captions.srt)
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk_...  node scripts/generate-voiceover.mjs
 *   VOICE_PROVIDER=openai OPENAI_API_KEY=sk_...  node scripts/generate-voiceover.mjs
 *
 * Env:
 *   VOICE_PROVIDER        elevenlabs (default) | openai
 *   ELEVENLABS_API_KEY    required for elevenlabs
 *   ELEVENLABS_VOICE_ID   default: Adam (pNInz6obpgDQGcFmaJgB)
 *   ELEVENLABS_MODEL_ID   default: eleven_multilingual_v2
 *   OPENAI_API_KEY        required for openai
 *   OPENAI_VOICE          default: onyx
 *   OPENAI_MODEL          default: gpt-4o-mini-tts
 *
 * For a truly human (real-person) voice: record the lines in voscript.json,
 * time them to the `start` marks, export public/voiceover.mp3, and skip this.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const script = JSON.parse(fs.readFileSync(path.join(root, "src/crime/voscript.json"), "utf8"));
const tmp = path.join(root, ".vo-tmp");
const pub = path.join(root, "public");
fs.mkdirSync(tmp, { recursive: true });
fs.mkdirSync(pub, { recursive: true });

const provider = (process.env.VOICE_PROVIDER || "elevenlabs").toLowerCase();

async function ttsElevenLabs(text, outPath) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set");
  const voice = process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB"; // Adam
  const model = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: model,
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
}

async function ttsOpenAI(text, outPath) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  const voice = process.env.OPENAI_VOICE || "onyx";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini-tts";
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ model, voice, input: text, response_format: "mp3" }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
}

const synth = provider === "openai" ? ttsOpenAI : ttsElevenLabs;

function srtTime(s) {
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(Math.floor(s % 60)).padStart(2, "0");
  const ms = String(Math.round((s % 1) * 1000)).padStart(3, "0");
  return `${h}:${m}:${sec},${ms}`;
}

async function main() {
  console.log(`Provider: ${provider}`);
  const lines = script.lines;

  // 1) synthesize each line
  const files = [];
  for (let i = 0; i < lines.length; i++) {
    const out = path.join(tmp, `line${String(i).padStart(2, "0")}.mp3`);
    process.stdout.write(`  [${i + 1}/${lines.length}] "${lines[i].text.slice(0, 48)}..."\n`);
    await synth(lines[i].text, out);
    files.push({ file: out, start: lines[i].start });
  }

  // 2) mux onto a silent bed at the right timestamps
  const total = script.total || 30;
  const args = ["-y", "-f", "lavfi", "-t", String(total), "-i", "anullsrc=r=44100:cl=stereo"];
  files.forEach((f) => args.push("-i", f.file));
  const filters = files
    .map((f, i) => `[${i + 1}]adelay=${Math.round(f.start * 1000)}:all=1[a${i}]`)
    .join(";");
  const mixIn = ["[0]", ...files.map((_, i) => `[a${i}]`)].join("");
  const filter = `${filters};${mixIn}amix=inputs=${files.length + 1}:normalize=0:dropout_transition=0[mix]`;
  const outMp3 = path.join(pub, "voiceover.mp3");
  args.push("-filter_complex", filter, "-map", "[mix]", "-t", String(total), "-c:a", "libmp3lame", "-q:a", "3", outMp3);
  const r = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error("ffmpeg mux failed");

  // 3) write captions.srt
  const srt = lines
    .map((l, i) => {
      const end = (lines[i + 1]?.start ?? total) - 0.05;
      return `${i + 1}\n${srtTime(l.start)} --> ${srtTime(end)}\n${l.text}\n`;
    })
    .join("\n");
  fs.writeFileSync(path.join(pub, "captions.srt"), srt);

  console.log(`\n✓ public/voiceover.mp3`);
  console.log(`✓ public/captions.srt`);
  console.log(`\nNow render with narration:\n  npm run render:crime:vo\n`);
}

main().catch((e) => {
  console.error("\n✗ " + e.message);
  process.exit(1);
});
