import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { NARRATION_SCRIPTS } from './story-data';

const OUTPUT_DIR = path.resolve(__dirname, '../../docs/videos/audio');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generateAllVoiceovers() {
  console.log('--- Generating Indonesian Neural Voiceovers via edge-tts ---');

  for (const item of NARRATION_SCRIPTS) {
    const rawMp3 = path.join(OUTPUT_DIR, `${item.id}.mp3`);
    const targetWav = path.join(OUTPUT_DIR, `${item.id}.wav`);
    const vttPath = path.join(OUTPUT_DIR, `${item.id}.vtt`);

    console.log(`[VO] Rendering ${item.id} (${item.voice})...`);

    // 1. edge-tts command
    const ttsCmd = `uvx edge-tts --voice ${item.voice} --text "${item.text.replace(/"/g, '\\"')}" --write-media "${rawMp3}" --write-subtitles "${vttPath}"`;
    try {
      execSync(ttsCmd, { stdio: 'inherit' });
    } catch (err) {
      console.error(`TTS failed for ${item.id}:`, err);
    }

    // 2. Transcode MP3 to WAV 48kHz for FilmCraft timeline
    if (fs.existsSync(rawMp3)) {
      const ffmpegCmd = `ffmpeg -y -i "${rawMp3}" -ar 48000 -ac 2 "${targetWav}"`;
      try {
        execSync(ffmpegCmd, { stdio: 'ignore' });
        console.log(`[WAV] Converted to ${path.basename(targetWav)} (48kHz Stereo)`);
      } catch (err) {
        console.error(`FFmpeg convert failed for ${item.id}:`, err);
      }
    }
  }

  // 3. Generate Calm Ambient Pad Background Track (~4 minutes) via FFmpeg filter
  const ambientWav = path.join(OUTPUT_DIR, 'calm_ambient_bg.wav');
  console.log('[SFX] Synthesizing continuous calm background ambient music...');
  const ambientCmd = `ffmpeg -y -f lavfi -i "sine=frequency=196:duration=260" -f lavfi -i "sine=frequency=293.66:duration=260" -filter_complex "[0:a][1:a]amix=inputs=2:duration=first,lowpass=f=450,volume=0.08,afade=t=in:ss=0:d=4,afade=t=out:st=250:d=8" -ar 48000 -ac 2 "${ambientWav}"`;
  try {
    execSync(ambientCmd, { stdio: 'ignore' });
    console.log(`[SFX] Created ${path.basename(ambientWav)}`);
  } catch (err) {
    console.warn('Ambient synth failed:', err);
  }

  // 4. Generate Message Notification Chime
  const chimeWav = path.join(OUTPUT_DIR, 'message_chime.wav');
  const chimeCmd = `ffmpeg -y -f lavfi -i "sine=frequency=880:duration=0.3" -af "afade=t=out:st=0.05:d=0.25,volume=0.15" -ar 48000 -ac 2 "${chimeWav}"`;
  try {
    execSync(chimeCmd, { stdio: 'ignore' });
    console.log(`[SFX] Created ${path.basename(chimeWav)}`);
  } catch (err) {
    console.warn('Chime synth failed:', err);
  }

  console.log('--- Voiceover & SFX Audio Assets Ready! ---');
}

generateAllVoiceovers();
