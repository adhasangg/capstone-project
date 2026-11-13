import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';

const BASE_DIR = path.resolve(__dirname, '../../../');
const EFFECTCRAFT_CLI = 'D:\\ArtCraft\\EffectCraft\\effectcraft-cli.exe';
const PROJECT_FILE = path.join(BASE_DIR, 'docs/videos/brand-promo-mahasiswa/safespace-brand-mahasiswa.ecproj');
const SCENES_DIR = path.join(BASE_DIR, 'docs/videos/brand-promo-mahasiswa/scenes');
const QA_DIR = path.join(BASE_DIR, 'docs/videos/brand-promo-mahasiswa/qa-frames');

fs.mkdirSync(SCENES_DIR, { recursive: true });
fs.mkdirSync(QA_DIR, { recursive: true });

const SCENES = [
  { comp: 'Scene01_URL_Intro', out: 'scene_01.mp4', qaTimes: [2.5] },
  { comp: 'Scene02_Landing_Zoom', out: 'scene_02.mp4', qaTimes: [4.5] },
  { comp: 'Scene03_Google_Auth', out: 'scene_03.mp4', qaTimes: [4.5] },
  { comp: 'Scene04_Student_Dashboard', out: 'scene_04.mp4', qaTimes: [3.5] },
  { comp: 'Scene05_DASS21_Showcase', out: 'scene_05.mp4', qaTimes: [3.0, 6.2, 9.2] },
  { comp: 'Scene06_VAK_Showcase', out: 'scene_06.mp4', qaTimes: [3.0, 6.0, 8.8] },
  { comp: 'Scene07_Create_Ticket', out: 'scene_07.mp4', qaTimes: [4.5] },
  { comp: 'Scene08_Ticket_List', out: 'scene_08.mp4', qaTimes: [4.5] },
  { comp: 'Scene09_Brand_Outro', out: 'scene_09.mp4', qaTimes: [3.5] },
];

const targetFilter = process.argv.slice(2);
const SCENES_TO_RENDER = targetFilter.length > 0 
  ? SCENES.filter(s => targetFilter.some(f => s.comp.includes(f) || s.out.includes(f)))
  : SCENES;

console.log(`=== Step 2B: Rendering ${SCENES_TO_RENDER.length} EffectCraft Scenes to MP4 (1080p 60fps) ===`);

for (const s of SCENES_TO_RENDER) {
  const targetMp4 = path.join(SCENES_DIR, s.out);
  console.log(`\n[Render] Rendering ${s.comp} -> ${s.out}...`);
  const renderCmd = `"${EFFECTCRAFT_CLI}" --project "${PROJECT_FILE}" render --comp "${s.comp}" --out "${targetMp4}" --format h264 --fps 60 --quality best`;
  try {
    execSync(renderCmd, { stdio: 'inherit' });
    console.log(`[Success] Rendered ${s.out}`);

    // Extract QA preview frames
    for (const qt of s.qaTimes) {
      const qaFrame = path.join(QA_DIR, `qa_${path.basename(s.out, '.mp4')}_${qt}s.png`);
      execSync(`ffmpeg -y -ss ${qt} -i "${targetMp4}" -frames:v 1 "${qaFrame}" -loglevel error`, { stdio: 'ignore' });
      console.log(`[QA] Extracted ${path.basename(qaFrame)} at t=${qt}s`);
    }
  } catch (err) {
    console.error(`Render failed for ${s.comp}:`, err);
    process.exit(1);
  }
}

console.log('\n=== All 8 scenes rendered successfully! ===');
