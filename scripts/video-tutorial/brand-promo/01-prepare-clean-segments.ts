import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';

const BASE_DIR = path.resolve(__dirname, '../../../');
const RAW_STUDENT = path.join(BASE_DIR, 'docs/videos/student_pov_cfr.mp4');
const CLEAN_INTRO = path.join(BASE_DIR, 'docs/videos/promo/intro_clean_auth.mp4');
const SEGMENTS_DIR = path.join(BASE_DIR, 'docs/videos/brand-promo-mahasiswa/segments');

fs.mkdirSync(SEGMENTS_DIR, { recursive: true });

function run(cmd: string) {
  console.log(`[FFmpeg] ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

console.log('=== Preparing Seamless Full Segments ===');

// 1. Scene 1 BG: 5.0s
run(`ffmpeg -y -ss 0.0 -to 5.0 -i "${CLEAN_INTRO}" -c:v libx264 -pix_fmt yuv420p -r 60 "${path.join(SEGMENTS_DIR, 'seg_01_bg.mp4')}"`);

// 2. Scene 2: Landing Hero & Click Masuk / Daftar (8.4s total, comp is 7.0s)
// Start at 3.0s where URL typing is already finished, eliminating duplicate typing!
run(`ffmpeg -y -ss 3.0 -to 5.4 -i "${CLEAN_INTRO}" -vf "tpad=start_mode=clone:start_duration=2.0:stop_mode=clone:stop_duration=4.0,fps=60" -c:v libx264 -pix_fmt yuv420p "${path.join(SEGMENTS_DIR, 'seg_02_landing.mp4')}"`);

// 3. Scene 3: Clean Google Auth (8.0s total, comp is 7.0s)
run(`ffmpeg -y -ss 5.4 -to 11.4 -i "${CLEAN_INTRO}" -vf "tpad=stop_mode=clone:stop_duration=2.0,fps=60" -c:v libx264 -pix_fmt yuv420p "${path.join(SEGMENTS_DIR, 'seg_03_auth.mp4')}"`);

// 4. Scene 4: Student Dashboard Showcase (9.0s total, comp is 8.0s)
run(`ffmpeg -y -ss 6.3 -to 7.2 -i "${RAW_STUDENT}" -vf "tpad=start_mode=clone:start_duration=8.1,fps=60" -c:v libx264 -pix_fmt yuv420p "${path.join(SEGMENTS_DIR, 'seg_04_dashboard.mp4')}"`);

// 5. Scene 5 Full: DASS-21 (Sample Q1-Q4 -> hold/blur -> Result Card) = exactly 12.0s
const s5a = path.join(SEGMENTS_DIR, 'tmp_s5a.mp4');
const s5c = path.join(SEGMENTS_DIR, 'tmp_s5c.mp4');
run(`ffmpeg -y -ss 7.3 -to 11.5 -i "${RAW_STUDENT}" -vf "setpts=1.4*PTS,fps=60" -c:v libx264 -pix_fmt yuv420p "${s5a}"`);
run(`ffmpeg -y -ss 21.8 -to 24.1 -i "${RAW_STUDENT}" -vf "tpad=stop_mode=clone:stop_duration=2.5,fps=60" -c:v libx264 -pix_fmt yuv420p "${s5c}"`);
run(`ffmpeg -y -i "${s5a}" -i "${s5c}" -filter_complex "[0:v]tpad=stop_mode=clone:stop_duration=2.15[v0];[v0][1:v]concat=n=2:v=1:a=0[outv]" -map "[outv]" -c:v libx264 -pix_fmt yuv420p -r 60 "${path.join(SEGMENTS_DIR, 'seg_05_dass_full.mp4')}"`);

// 6. Scene 6 Full: VAK (Sample Scenario 1-3 -> hold/blur -> Result Card) = exactly 11.0s
const s6a = path.join(SEGMENTS_DIR, 'tmp_s6a.mp4');
const s6c = path.join(SEGMENTS_DIR, 'tmp_s6c.mp4');
run(`ffmpeg -y -ss 24.2 -to 27.6 -i "${RAW_STUDENT}" -vf "setpts=1.4*PTS,fps=60" -c:v libx264 -pix_fmt yuv420p "${s6a}"`);
run(`ffmpeg -y -ss 33.2 -to 35.5 -i "${RAW_STUDENT}" -vf "tpad=stop_mode=clone:stop_duration=2.5,fps=60" -c:v libx264 -pix_fmt yuv420p "${s6c}"`);
run(`ffmpeg -y -i "${s6a}" -i "${s6c}" -filter_complex "[0:v]tpad=stop_mode=clone:stop_duration=2.24[v0];[v0][1:v]concat=n=2:v=1:a=0[outv]" -map "[outv]" -c:v libx264 -pix_fmt yuv420p -r 60 "${path.join(SEGMENTS_DIR, 'seg_06_vak_full.mp4')}"`);

// 7. Scene 7: Dashboard with both results + Click Buka Tiket (8.6s total padded, plenty for 6.0s comp to prevent blank screen)
run(`ffmpeg -y -ss 47.4 -to 49.0 -i "${RAW_STUDENT}" -vf "tpad=start_mode=clone:start_duration=3.5:stop_mode=clone:stop_duration=3.5,fps=60" -c:v libx264 -pix_fmt yuv420p "${path.join(SEGMENTS_DIR, 'seg_07_ticket_prep.mp4')}"`);

// 8. Scene 8: Student Ticket List Showcase ("Daftar Tiket & Sesi Pra-Konseling Saya") (10.0s total padded, for 7.0s comp)
run(`ffmpeg -y -ss 49.2 -to 56.2 -i "${RAW_STUDENT}" -vf "tpad=start_mode=clone:start_duration=1.0:stop_mode=clone:stop_duration=3.0,fps=60" -c:v libx264 -pix_fmt yuv420p "${path.join(SEGMENTS_DIR, 'seg_08_ticket_list.mp4')}"`);

console.log('=== Segments Ready! ===');
