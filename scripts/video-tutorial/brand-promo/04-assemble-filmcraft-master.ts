import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';

const BASE_DIR = path.resolve(__dirname, '../../../');
const SCENES_DIR = path.join(BASE_DIR, 'docs/videos/brand-promo-mahasiswa/scenes');
const AUDIO_DIR = path.join(BASE_DIR, 'docs/videos/brand-promo-mahasiswa/audio');
const OUT_DIR = path.join(BASE_DIR, 'docs/videos/brand-promo-mahasiswa');

const SCENE_FILES = [
  'scene_01.mp4',
  'scene_02.mp4',
  'scene_03.mp4',
  'scene_04.mp4',
  'scene_05.mp4',
  'scene_06.mp4',
  'scene_07.mp4',
  'scene_08.mp4',
  'scene_09.mp4',
];

// Exact start timestamps for each scene in the concatenated timeline:
// Scene 1: 0.0s (dur 5.0s)
// Scene 2: 5.0s (dur 6.5s)
// Scene 3: 11.5s (dur 6.5s)
// Scene 4: 18.0s (dur 7.0s)
// Scene 5: 25.0s (dur 11.0s)
// Scene 6: 36.0s (dur 10.5s)
// Scene 7: 46.5s (dur 6.0s)
// Scene 8: 52.5s (dur 7.0s) -> Student Ticket List
// Scene 9: 59.5s (dur 5.5s) -> Brand Outro
// Total duration = 65.0s

const SFX_CUES = [
  // Scene 1: Brand hero whoosh and 3 staggered badge pops
  { file: 'sfx_whoosh.wav', delayMs: 200, vol: 0.5 },
  { file: 'sfx_pop.wav', delayMs: 500, vol: 0.7 },
  { file: 'sfx_pop.wav', delayMs: 700, vol: 0.7 },
  { file: 'sfx_pop.wav', delayMs: 900, vol: 0.7 },
  // Scene 2 whoosh & click (Masuk / Daftar at 4.15s into Scene 2 -> 9150ms)
  { file: 'sfx_whoosh.wav', delayMs: 5000, vol: 0.5 },
  { file: 'sfx_click.wav', delayMs: 9150, vol: 1.0 },
  // Scene 3 whoosh & click (Google button at 4.35s into Scene 3 -> 15850ms)
  { file: 'sfx_whoosh.wav', delayMs: 11500, vol: 0.5 },
  { file: 'sfx_click.wav', delayMs: 15850, vol: 1.0 },
  // Scene 4 whoosh into dashboard
  { file: 'sfx_whoosh.wav', delayMs: 18000, vol: 0.5 },
  // Scene 5 whoosh, milestone pop (30.0s), and result whoosh (32.8s)
  { file: 'sfx_whoosh.wav', delayMs: 25000, vol: 0.5 },
  { file: 'sfx_pop.wav', delayMs: 30000, vol: 0.85 },
  { file: 'sfx_whoosh.wav', delayMs: 32800, vol: 0.5 },
  // Scene 6 whoosh, milestone pop (40.8s), and result whoosh (43.6s)
  { file: 'sfx_whoosh.wav', delayMs: 36000, vol: 0.5 },
  { file: 'sfx_pop.wav', delayMs: 40800, vol: 0.85 },
  { file: 'sfx_whoosh.wav', delayMs: 43600, vol: 0.5 },
  // Scene 7 whoosh & click (+ Buka Tiket at 4.5s into Scene 7 -> 51000ms)
  { file: 'sfx_whoosh.wav', delayMs: 46500, vol: 0.5 },
  { file: 'sfx_click.wav', delayMs: 51000, vol: 1.0 },
  // Scene 8 whoosh into Student Ticket List & pop on active ticket badge
  { file: 'sfx_whoosh.wav', delayMs: 52500, vol: 0.55 },
  { file: 'sfx_pop.wav', delayMs: 55500, vol: 0.75 },
  // Scene 9 outro whoosh
  { file: 'sfx_whoosh.wav', delayMs: 59500, vol: 0.6 },
];

console.log('=== Step 4: Assembling Final SafeSpace Brand Promo Video ===');

// 1. Concatenate all 9 visual scenes into video track
const concatTxt = path.join(SCENES_DIR, 'concat_list.txt');
fs.writeFileSync(concatTxt, SCENE_FILES.map(f => `file '${path.join(SCENES_DIR, f).replace(/\\/g, '/')}'`).join('\n'));

const visualMaster = path.join(OUT_DIR, 'safespace_visual_master.mp4');
console.log('[Concat] Joining 9 EffectCraft scenes into visual master...');
execSync(`ffmpeg -y -f concat -safe 0 -i "${concatTxt}" -c copy "${visualMaster}"`, { stdio: 'inherit' });
console.log(`[Visual] Created ${path.basename(visualMaster)}`);

// 2. Build SFX audio stream
console.log('[Audio] Building synchronized SFX mix...');
const sfxInputs = SFX_CUES.map(c => `-i "${path.join(AUDIO_DIR, c.file)}"`).join(' ');
const sfxFilters = SFX_CUES.map((c, i) => `[${i}:a]volume=${c.vol},adelay=${c.delayMs}|${c.delayMs}[sfx${i}]`).join(';');
const sfxMixPads = SFX_CUES.map((_, i) => `[sfx${i}]`).join('');
const sfxFilterComplex = `${sfxFilters};${sfxMixPads}amix=inputs=${SFX_CUES.length}:dropout_transition=0,volume=${SFX_CUES.length * 0.4}[out_sfx]`;

const sfxMasterWav = path.join(AUDIO_DIR, 'sfx_master.wav');
execSync(`ffmpeg -y ${sfxInputs} -filter_complex "${sfxFilterComplex}" -map "[out_sfx]" -ar 48000 -ac 2 "${sfxMasterWav}"`, { stdio: 'inherit' });
console.log(`[SFX] Created ${path.basename(sfxMasterWav)}`);

// 3. Render Final Master Video: WITHOUT VOICEOVER (SafeSpace Uplifting Music + Synchronized SFX)
console.log('\n--- Rendering Final Video: SafeSpace Brand Master (NO VO) ---');
const bgmWav = path.join(AUDIO_DIR, 'safespace_uplifting_bgm.wav');
const outNoVoMp4 = path.join(OUT_DIR, 'safespace-brand-promo-mahasiswa-novo.mp4');

const mixNoVoCmd = `ffmpeg -y -i "${visualMaster}" -i "${sfxMasterWav}" -i "${bgmWav}" ` +
  `-filter_complex "[2:a]volume=0.85,atrim=0:65,afade=t=in:ss=0:d=1.2,afade=t=out:st=61:d=4[bgm];` +
  `[1:a]volume=1.2[sfx];` +
  `[sfx][bgm]amix=inputs=2:dropout_transition=0,volume=1.8,alimiter=limit=0.95[aout]" ` +
  `-map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 256k -shortest "${outNoVoMp4}"`;

execSync(mixNoVoCmd, { stdio: 'inherit' });
console.log(`[Done] Exported ${path.basename(outNoVoMp4)}`);

// 4. Render Final Master Video: WITH VOICEOVER (Voiceover + Ducked Uplifting Music + Synchronized SFX)
console.log('\n--- Rendering Final Video: SafeSpace Brand Master (WITH VO) ---');
const voMasterWav = path.join(AUDIO_DIR, 'vo_master.wav');
const outVoMp4 = path.join(OUT_DIR, 'safespace-brand-promo-mahasiswa-vo.mp4');

const mixVoCmd = `ffmpeg -y -i "${visualMaster}" -i "${sfxMasterWav}" -i "${bgmWav}" -i "${voMasterWav}" ` +
  `-filter_complex "[2:a]volume=0.45,atrim=0:65,afade=t=in:ss=0:d=1.2,afade=t=out:st=61:d=4[bgm];` +
  `[1:a]volume=1.0[sfx];` +
  `[3:a]volume=1.35[vo];` +
  `[sfx][bgm][vo]amix=inputs=3:dropout_transition=0,volume=2.0,alimiter=limit=0.95[aout]" ` +
  `-map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 256k -shortest "${outVoMp4}"`;

execSync(mixVoCmd, { stdio: 'inherit' });
console.log(`[Done] Exported ${path.basename(outVoMp4)}`);

console.log('\n=== SafeSpace Promotional Master Video generated successfully! ===');
