import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Continuous, Lush, Uplifting SafeSpace Background Score (68s)
 * - Zero silent gaps, zero sudden restarts.
 * - Continuous warm analog chord pads with smooth equal-power crossfading.
 * - Continuous gentle acoustic bell/rhodes arpeggio plucks on every bar.
 * - Steady, soft ambient heartbeat/lofi pulse (kick + snap + subtle shaker).
 */

const SAMPLE_RATE = 48000;
const DURATION_SEC = 68; // Covers the full 65.0s video with margin
const NUM_SAMPLES = SAMPLE_RATE * DURATION_SEC;
const BPM = 84;
const SEC_PER_BEAT = 60 / BPM; // ~0.714s
const SEC_PER_BAR = SEC_PER_BEAT * 4; // ~2.857s per bar

const OUT_FILE = path.resolve(__dirname, '../../../docs/videos/brand-promo-mahasiswa/audio/safespace_uplifting_bgm.wav');

// Frequencies (Hz)
const NOTES: Record<string, number> = {
  F2: 87.31, G2: 98.0, A2: 110.0, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0, B5: 987.77, C6: 1046.5,
};

// 4-Bar Hopeful Progression: Fmaj9 -> Gadd9 -> Em7 -> Am9 (Repeats seamlessly without abrupt drops)
const CHORDS = [
  { root: NOTES.F2, pad: [NOTES.F3, NOTES.C4, NOTES.E4, NOTES.G4, NOTES.A4, NOTES.C5] }, // Fmaj9
  { root: NOTES.G2, pad: [NOTES.G3, NOTES.D4, NOTES.G4, NOTES.B4, NOTES.D5, NOTES.E5] }, // G6/9
  { root: NOTES.E2, pad: [NOTES.E3, NOTES.B3, NOTES.D4, NOTES.G4, NOTES.B4, NOTES.D5] }, // Em7
  { root: NOTES.A2, pad: [NOTES.A3, NOTES.C4, NOTES.E4, NOTES.G4, NOTES.B4, NOTES.C5] }, // Am9
];

console.log('--- Synthesizing Seamless, Continuous SafeSpace Uplifting BGM (WAV 48kHz Stereo) ---');

const left = new Float32Array(NUM_SAMPLES);
const right = new Float32Array(NUM_SAMPLES);

// 1. CONTINUOUS WARM ANALOG PAD WITH SMOOTH CROSSFADING (ZERO SILENT GAPS)
// Instead of decaying each bar, each chord crossfades into the next chord smoothly.
for (let s = 0; s < NUM_SAMPLES; s++) {
  const t = s / SAMPLE_RATE;
  
  // Overall smooth master envelope (fade in at t=0..2s, fade out at t=63..68s)
  let masterEnv = 1.0;
  if (t < 2.0) masterEnv = t / 2.0;
  else if (t > 63.0) masterEnv = Math.max(0, (68.0 - t) / 5.0);

  // Position in the 4-bar cycle
  const cycleTime = t % (SEC_PER_BAR * 4);
  const barFloat = cycleTime / SEC_PER_BAR; // e.g. 0.0 to 3.999
  const currentBar = Math.floor(barFloat) % 4;
  const nextBar = (currentBar + 1) % 4;
  const frac = barFloat - Math.floor(barFloat); // 0.0 to 1.0 within bar

  // Equal-power crossfade weights between current and next chord
  // In the first 70% of bar, current chord dominates; in last 30%, it crossfades smoothly into next
  let wNext = 0;
  if (frac > 0.65) {
    const x = (frac - 0.65) / 0.35; // 0 to 1
    wNext = 0.5 * (1 - Math.cos(Math.PI * x));
  }
  const wCur = Math.sqrt(Math.max(0, 1 - wNext * wNext));

  // Synthesize chord tones
  const renderChord = (chordIdx: number, weight: number) => {
    if (weight <= 0.001) return;
    const chord = CHORDS[chordIdx];
    
    // Sub-bass fundamental (warm sine + second harmonic)
    const subL = (Math.sin(2 * Math.PI * chord.root * t) + 0.3 * Math.sin(2 * Math.PI * chord.root * 2 * t)) * 0.18;
    left[s] += subL * weight * masterEnv;
    right[s] += subL * weight * masterEnv;

    // Pad voices (with rich chorus detuning and stereo panning)
    for (let i = 0; i < chord.pad.length; i++) {
      const f = chord.pad[i];
      const pan = (i / (chord.pad.length - 1)) * 0.7 - 0.35; // -0.35 to +0.35
      // Detuned dual oscillators for lush analog warmth
      const osc1 = Math.sin(2 * Math.PI * (f * 0.999) * t);
      const osc2 = Math.sin(2 * Math.PI * (f * 1.001) * t);
      const tone = (osc1 + osc2) * 0.024 * weight * masterEnv;

      left[s] += tone * (0.5 - pan);
      right[s] += tone * (0.5 + pan);
    }
  };

  renderChord(currentBar, wCur);
  renderChord(nextBar, wNext);
}

// 2. CONTINUOUS FLOWING ARPEGGIO MELODY (COVERING ALL 16 BEATS OF THE CYCLE)
// Completely fills all 4 bars with no awkward 3-second silence!
const FLOWING_ARPEGGIO = [
  // Bar 1 (Fmaj9): 4 beats
  { b: 0.0, n: NOTES.C5 }, { b: 0.5, n: NOTES.E5 }, { b: 1.0, n: NOTES.G5 }, { b: 1.5, n: NOTES.A5 },
  { b: 2.0, n: NOTES.C6 }, { b: 2.5, n: NOTES.A5 }, { b: 3.0, n: NOTES.G5 }, { b: 3.5, n: NOTES.E5 },
  // Bar 2 (G6/9): 4 beats
  { b: 4.0, n: NOTES.D5 }, { b: 4.5, n: NOTES.G5 }, { b: 5.0, n: NOTES.B5 }, { b: 5.5, n: NOTES.D6 },
  { b: 6.0, n: NOTES.B5 }, { b: 6.5, n: NOTES.A5 }, { b: 7.0, n: NOTES.G5 }, { b: 7.5, n: NOTES.D5 },
  // Bar 3 (Em7): 4 beats
  { b: 8.0, n: NOTES.B4 }, { b: 8.5, n: NOTES.E5 }, { b: 9.0, n: NOTES.G5 }, { b: 9.5, n: NOTES.B5 },
  { b: 10.0, n: NOTES.E6 }, { b: 10.5, n: NOTES.D6 }, { b: 11.0, n: NOTES.B5 }, { b: 11.5, n: NOTES.G5 },
  // Bar 4 (Am9): 4 beats - CONTINUOUSLY ROLLS RIGHT INTO BAR 1!
  { b: 12.0, n: NOTES.C5 }, { b: 12.5, n: NOTES.E5 }, { b: 13.0, n: NOTES.A5 }, { b: 13.5, n: NOTES.C6 },
  { b: 14.0, n: NOTES.B5 }, { b: 14.5, n: NOTES.A5 }, { b: 15.0, n: NOTES.G5 }, { b: 15.5, n: NOTES.E5 },
];

const CYCLE_BEATS = 16;
const CYCLE_DURATION = CYCLE_BEATS * SEC_PER_BEAT; // ~11.428s

for (let cycleStart = 0; cycleStart < DURATION_SEC; cycleStart += CYCLE_DURATION) {
  for (const arp of FLOWING_ARPEGGIO) {
    const noteTime = cycleStart + (arp.b * SEC_PER_BEAT);
    if (noteTime >= DURATION_SEC) break;

    const startIdx = Math.floor(noteTime * SAMPLE_RATE);
    const noteLen = Math.floor(0.85 * SAMPLE_RATE);
    const endIdx = Math.min(NUM_SAMPLES, startIdx + noteLen);
    const freq = arp.n;

    for (let s = startIdx; s < endIdx; s++) {
      const t = s / SAMPLE_RATE;
      let masterEnv = 1.0;
      if (t < 1.5) masterEnv = t / 1.5;
      else if (t > 63.0) masterEnv = Math.max(0, (68.0 - t) / 5.0);

      const dt = (s - startIdx) / SAMPLE_RATE;
      // Exponential decay with warm acoustic bell chime
      const env = Math.exp(-dt * 4.8);
      const tone = (
        Math.sin(2 * Math.PI * freq * dt) +
        0.4 * Math.sin(2 * Math.PI * (freq * 2.0) * dt) +
        0.18 * Math.sin(2 * Math.PI * (freq * 3.01) * dt)
      ) * env * 0.038 * masterEnv;

      const pan = 0.5 + 0.2 * Math.sin(freq * 0.7);
      left[s] += tone * (1.0 - pan);
      right[s] += tone * pan;
    }
  }
}

// 3. CONTINUOUS STEADY LOFI / AMBIENT PULSE (KICK + SOFT RIM + SHAKER)
// Runs continuously from start to finish
for (let beat = 0; beat * SEC_PER_BEAT < DURATION_SEC; beat++) {
  const beatTime = beat * SEC_PER_BEAT;
  const startIdx = Math.floor(beatTime * SAMPLE_RATE);
  const beatInBar = beat % 4;

  let masterEnv = 1.0;
  if (beatTime < 2.0) masterEnv = beatTime / 2.0;
  else if (beatTime > 63.0) masterEnv = Math.max(0, (68.0 - beatTime) / 5.0);

  // Soft warm kick on beats 0 and 2
  if (beatInBar === 0 || beatInBar === 2) {
    const kickLen = Math.floor(0.24 * SAMPLE_RATE);
    const endIdx = Math.min(NUM_SAMPLES, startIdx + kickLen);
    for (let s = startIdx; s < endIdx; s++) {
      const dt = (s - startIdx) / SAMPLE_RATE;
      const pitch = 95 * Math.exp(-dt * 26) + 42;
      const val = Math.sin(2 * Math.PI * pitch * dt) * Math.exp(-dt * 12) * 0.16 * masterEnv;
      left[s] += val;
      right[s] += val;
    }
  }

  // Soft organic snap / rim on beats 1 and 3
  if (beatInBar === 1 || beatInBar === 3) {
    const snapLen = Math.floor(0.12 * SAMPLE_RATE);
    const endIdx = Math.min(NUM_SAMPLES, startIdx + snapLen);
    for (let s = startIdx; s < endIdx; s++) {
      const dt = (s - startIdx) / SAMPLE_RATE;
      const noise = (Math.random() * 2 - 1) * Math.exp(-dt * 40) * 0.06 * masterEnv;
      const snapTone = Math.sin(2 * Math.PI * 480 * dt) * Math.exp(-dt * 50) * 0.04 * masterEnv;
      left[s] += (noise + snapTone);
      right[s] += (noise + snapTone);
    }
  }

  // Continuous gentle shaker on every 8th note
  for (let eighth = 0; eighth < 2; eighth++) {
    const shkTime = beatTime + (eighth * SEC_PER_BEAT * 0.5);
    const shkIdx = Math.floor(shkTime * SAMPLE_RATE);
    const shkLen = Math.floor(0.06 * SAMPLE_RATE);
    const endIdx = Math.min(NUM_SAMPLES, shkIdx + shkLen);
    for (let s = shkIdx; s < endIdx; s++) {
      const dt = (s - shkIdx) / SAMPLE_RATE;
      const shaker = (Math.random() * 2 - 1) * Math.exp(-dt * 65) * 0.022 * masterEnv;
      left[s] += shaker * 0.8;
      right[s] += shaker * 1.2;
    }
  }
}

// 4. Encode to 16-bit PCM WAV Stereo File
console.log('[WAV] Encoding PCM buffer to 48kHz stereo WAV...');
const bytesPerSample = 2;
const numChannels = 2;
const blockAlign = numChannels * bytesPerSample;
const byteRate = SAMPLE_RATE * blockAlign;
const dataSize = NUM_SAMPLES * blockAlign;
const headerSize = 44;
const totalSize = headerSize + dataSize;

const buffer = Buffer.alloc(totalSize);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(totalSize - 8, 4);
buffer.write('WAVE', 8);

// fmt chunk
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // chunk size
buffer.writeUInt16LE(1, 20);  // PCM format
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(SAMPLE_RATE, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34); // bits per sample

// data chunk
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

let offset = 44;
for (let i = 0; i < NUM_SAMPLES; i++) {
  // Soft limiter to prevent clipping
  const l = Math.max(-0.95, Math.min(0.95, left[i]));
  const r = Math.max(-0.95, Math.min(0.95, right[i]));

  const sampleL = Math.floor(l < 0 ? l * 32768 : l * 32767);
  const sampleR = Math.floor(r < 0 ? r * 32768 : r * 32767);

  buffer.writeInt16LE(sampleL, offset);
  buffer.writeInt16LE(sampleR, offset + 2);
  offset += 4;
}

fs.writeFileSync(OUT_FILE, buffer);
console.log(`[Success] Written seamless continuous BGM to: ${OUT_FILE} (${(totalSize / (1024 * 1024)).toFixed(2)} MB)`);
