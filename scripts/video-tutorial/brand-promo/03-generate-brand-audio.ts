import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';

const BASE_DIR = path.resolve(__dirname, '../../../');
const AUDIO_DIR = path.join(BASE_DIR, 'docs/videos/brand-promo-mahasiswa/audio');
fs.mkdirSync(AUDIO_DIR, { recursive: true });

const VOICE_ITEMS = [
  {
    id: 'vo_01_url',
    text: 'Mulai perjalanan pemulihan dan kesehatan mental Anda di safespace.ijplabs.dev.',
    voice: 'id-ID-GadisNeural',
    rate: '+0%',
  },
  {
    id: 'vo_02_landing',
    text: 'Cukup satu klik Masuk atau Daftar, tanpa perlu instalasi aplikasi yang rumit.',
    voice: 'id-ID-GadisNeural',
    rate: '+5%',
  },
  {
    id: 'vo_03_auth',
    text: 'Masuk aman dengan Google. Identitas Anda disanitasi satu arah lewat kriptografi SHA-256 tanpa rekam jejak.',
    voice: 'id-ID-GadisNeural',
    rate: '+3%',
  },
  {
    id: 'vo_04_dashboard',
    text: 'Selamat datang di dashboard mahasiswa. Tanpa nama asli, tanpa NIM, serta dilengkapi tombol darurat Safe Exit.',
    voice: 'id-ID-GadisNeural',
    rate: '+3%',
  },
  {
    id: 'vo_05_dass21',
    text: 'Isi instrumen pemetaan emosional DASS-21 Lovibond. Hasil risiko burnout langsung terukur secara ilmiah.',
    voice: 'id-ID-GadisNeural',
    rate: '+4%',
  },
  {
    id: 'vo_06_vak',
    text: 'Petakan juga modalitas belajar VAK Anda, untuk menemukan strategi belajar adaptif selama perkuliahan.',
    voice: 'id-ID-GadisNeural',
    rate: '+4%',
  },
  {
    id: 'vo_07_ticket_prep',
    text: 'Kedua hasil otomatis terlampir ke tiket konsultasi. Konselor langsung memahami kondisi Anda tanpa cerita dari nol.',
    voice: 'id-ID-GadisNeural',
    rate: '+3%',
  },
  {
    id: 'vo_08_ticket_active',
    text: 'Tiket pra-konseling Anda aktif dan terenkripsi. SafeSpace, ruang aman pertama sebelum konseling.',
    voice: 'id-ID-GadisNeural',
    rate: '+0%',
  },
];

console.log('=== Step 3: Generating Audio Assets for Brand Promo ===');

// 1. Synthesize crisp UI Click SFX (tactile mouse click)
const clickWav = path.join(AUDIO_DIR, 'sfx_click.wav');
console.log('[SFX] Generating crisp tactile mouse click...');
const clickCmd = `ffmpeg -y -f lavfi -i "sine=frequency=1400:duration=0.018" -af "afade=t=in:ss=0:d=0.002,afade=t=out:st=0.004:d=0.014,volume=0.9" -ar 48000 -ac 2 "${clickWav}"`;
try {
  execSync(clickCmd, { stdio: 'ignore' });
  console.log(`[SFX] Created ${path.basename(clickWav)}`);
} catch (e) {
  console.error('Click SFX failed:', e);
}

// 2. Synthesize camera pan-zoom whoosh
const whooshWav = path.join(AUDIO_DIR, 'sfx_whoosh.wav');
console.log('[SFX] Generating smooth camera whoosh...');
const whooshCmd = `ffmpeg -y -f lavfi -i "anoisesrc=d=0.4:c=pink:r=48000:a=0.3" -af "bandpass=f=750:w=350,afade=t=in:ss=0:d=0.15,afade=t=out:st=0.18:d=0.22,volume=0.4" -ar 48000 -ac 2 "${whooshWav}"`;
try {
  execSync(whooshCmd, { stdio: 'ignore' });
  console.log(`[SFX] Created ${path.basename(whooshWav)}`);
} catch (e) {
  console.error('Whoosh SFX failed:', e);
}

// 3. Synthesize typing sound (mechanical keystrokes)
const typingWav = path.join(AUDIO_DIR, 'sfx_keystrokes.wav');
console.log('[SFX] Generating keyboard typing sound...');
const typingCmd = `ffmpeg -y -f lavfi -i "sine=frequency=2400:duration=0.03" -f lavfi -i "sine=frequency=3200:duration=0.03" -filter_complex "[0:a]volume=0.25[k1];[1:a]volume=0.2[k2];[k1][k2]amix=inputs=2,apad=pad_dur=0.08,aloop=loop=25:size=5000" -ar 48000 -ac 2 "${typingWav}"`;
try {
  execSync(typingCmd, { stdio: 'ignore' });
  console.log(`[SFX] Created ${path.basename(typingWav)}`);
} catch (e) {
  console.error('Typing SFX failed:', e);
}

// 4. Milestone Pop SFX
const popWav = path.join(AUDIO_DIR, 'sfx_pop.wav');
console.log('[SFX] Generating milestone pop sound...');
const popCmd = `ffmpeg -y -f lavfi -i "sine=frequency=880:duration=0.15" -af "afade=t=out:st=0.02:d=0.13,volume=0.5" -ar 48000 -ac 2 "${popWav}"`;
try {
  execSync(popCmd, { stdio: 'ignore' });
  console.log(`[SFX] Created ${path.basename(popWav)}`);
} catch (e) {
  console.error('Pop SFX failed:', e);
}

// 5. Copy/reuse ambient music pulse
const srcMusic = path.join(BASE_DIR, 'docs/videos/promo/audio/promo_ambient_pulse.wav');
const destMusic = path.join(AUDIO_DIR, 'brand_ambient_bgm.wav');
if (fs.existsSync(srcMusic)) {
  fs.copyFileSync(srcMusic, destMusic);
  console.log('[BGM] Reused promo_ambient_pulse.wav as brand_ambient_bgm.wav');
}

// 6. Generate Voiceovers using Edge-TTS
for (const item of VOICE_ITEMS) {
  const rawMp3 = path.join(AUDIO_DIR, `${item.id}.mp3`);
  const targetWav = path.join(AUDIO_DIR, `${item.id}.wav`);
  const vttPath = path.join(AUDIO_DIR, `${item.id}.vtt`);

  console.log(`[VO] Rendering ${item.id} (${item.voice})...`);
  const rateParam = item.rate ? `--rate="${item.rate}"` : '';
  const ttsCmd = `uvx edge-tts --voice ${item.voice} ${rateParam} --text "${item.text.replace(/"/g, '\\"')}" --write-media "${rawMp3}" --write-subtitles "${vttPath}"`;

  try {
    execSync(ttsCmd, { stdio: 'ignore' });
    if (fs.existsSync(rawMp3)) {
      execSync(`ffmpeg -y -i "${rawMp3}" -ar 48000 -ac 2 "${targetWav}"`, { stdio: 'ignore' });
      console.log(`[WAV] Created ${path.basename(targetWav)}`);
    }
  } catch (err) {
    console.error(`TTS failed for ${item.id}:`, err);
  }
}

console.log('=== Step 3 Completed: All audio assets ready! ===');
