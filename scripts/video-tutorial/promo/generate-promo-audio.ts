import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { PROMO_VOICEOVERS } from './promo-story-config';

const OUTPUT_DIR = path.resolve(__dirname, '../../../docs/videos/promo/audio');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generatePromoAudio() {
  console.log('=== Generating Promotional Voiceovers & SFX for SafeSpace Showcase ===');

  for (const item of PROMO_VOICEOVERS) {
    const rawMp3 = path.join(OUTPUT_DIR, `${item.id}.mp3`);
    const targetWav = path.join(OUTPUT_DIR, `${item.id}.wav`);
    const vttPath = path.join(OUTPUT_DIR, `${item.id}.vtt`);

    console.log(`[VO] Rendering ${item.id} (${item.voice}, rate=${item.rate || '+0%'})...`);

    const rateParam = item.rate ? `--rate="${item.rate}"` : '';
    const ttsCmd = `uvx edge-tts --voice ${item.voice} ${rateParam} --text "${item.text.replace(/"/g, '\\"')}" --write-media "${rawMp3}" --write-subtitles "${vttPath}"`;

    try {
      execSync(ttsCmd, { stdio: 'inherit' });
    } catch (err) {
      console.error(`TTS failed for ${item.id}:`, err);
    }

    if (fs.existsSync(rawMp3)) {
      const ffmpegCmd = `ffmpeg -y -i "${rawMp3}" -ar 48000 -ac 2 "${targetWav}"`;
      try {
        execSync(ffmpegCmd, { stdio: 'ignore' });
        console.log(`[WAV] Created ${path.basename(targetWav)} (48kHz Stereo)`);
      } catch (err) {
        console.error(`FFmpeg convert failed for ${item.id}:`, err);
      }
    }
  }

  // --- Sound Effects Synthesis (48kHz stereo) ---
  console.log('\n--- Synthesizing Promotional Sound Effects (SFX) ---');

  // 1. Keystroke SFX (rapid mechanical typing sound for browser URL)
  const typingWav = path.join(OUTPUT_DIR, 'sfx_keystrokes.wav');
  console.log('[SFX] Synthesizing keyboard typing sound...');
  const typingCmd = `ffmpeg -y -f lavfi -i "sine=frequency=2400:duration=0.03" -f lavfi -i "sine=frequency=3200:duration=0.03" -filter_complex "[0:a]volume=0.25[k1];[1:a]volume=0.2[k2];[k1][k2]amix=inputs=2,apad=pad_dur=0.08,aloop=loop=25:size=5000" -ar 48000 -ac 2 "${typingWav}"`;
  try {
    execSync(typingCmd, { stdio: 'ignore' });
    console.log(`[SFX] Created ${path.basename(typingWav)}`);
  } catch (err) {
    console.warn('Keystroke synth warning:', err);
  }

  // 2. Camera Pan-Zoom Soft Whoosh Transition
  const whooshWav = path.join(OUTPUT_DIR, 'sfx_whoosh.wav');
  console.log('[SFX] Synthesizing camera whoosh transition...');
  const whooshCmd = `ffmpeg -y -f lavfi -i "anoisesrc=d=0.45:c=pink:r=48000:a=0.3" -af "bandpass=f=600:w=300,afade=t=in:ss=0:d=0.18,afade=t=out:st=0.2:d=0.25,volume=0.35" -ar 48000 -ac 2 "${whooshWav}"`;
  try {
    execSync(whooshCmd, { stdio: 'ignore' });
    console.log(`[SFX] Created ${path.basename(whooshWav)}`);
  } catch (err) {
    console.warn('Whoosh synth warning:', err);
  }

  // 3. UI Pop / Card Chime
  const popWav = path.join(OUTPUT_DIR, 'sfx_pop.wav');
  console.log('[SFX] Synthesizing UI card pop chime...');
  const popCmd = `ffmpeg -y -f lavfi -i "sine=frequency=1046.50:duration=0.25" -af "afade=t=out:st=0.04:d=0.2,volume=0.18" -ar 48000 -ac 2 "${popWav}"`;
  try {
    execSync(popCmd, { stdio: 'ignore' });
    console.log(`[SFX] Created ${path.basename(popWav)}`);
  } catch (err) {
    console.warn('Pop chime synth warning:', err);
  }

  // 4. Background Score: Warm Uplifting Ambient Pulse (~110 seconds)
  const bgMusicWav = path.join(OUTPUT_DIR, 'promo_ambient_pulse.wav');
  console.log('[SFX] Synthesizing warm ambient pulse background track...');
  // Multi-harmonic gentle pad with uplifting 3rd & 5th (C-Major / F-Major warm progression)
  const bgCmd = `ffmpeg -y -f lavfi -i "sine=frequency=130.81:duration=110" -f lavfi -i "sine=frequency=164.81:duration=110" -f lavfi -i "sine=frequency=196.00:duration=110" -f lavfi -i "sine=frequency=261.63:duration=110" -filter_complex "[0:a]volume=0.10[c];[1:a]volume=0.08[e];[2:a]volume=0.08[g];[3:a]volume=0.06[c2];[c][e][g][c2]amix=inputs=4:duration=first,lowpass=f=550,afade=t=in:ss=0:d=3,afade=t=out:st=102:d=8,volume=0.22" -ar 48000 -ac 2 "${bgMusicWav}"`;
  try {
    execSync(bgCmd, { stdio: 'ignore' });
    console.log(`[SFX] Created ${path.basename(bgMusicWav)}`);
  } catch (err) {
    console.warn('Background score synth warning:', err);
  }

  console.log('\n=== All Promotional Audio Assets Generated Successfully! ===\n');
}

generatePromoAudio();
