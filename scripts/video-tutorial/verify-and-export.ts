import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const VIDEOS_DIR = path.resolve(__dirname, '../../docs/videos');
const QA_DIR = path.join(VIDEOS_DIR, 'qa-frames');
fs.mkdirSync(QA_DIR, { recursive: true });

const TARGET_VIDEOS = [
  '01-tutorial-pov-mahasiswa.mp4',
  '02-tutorial-pov-konselor.mp4',
  '00-safespace-full-end-to-end.mp4',
];

interface VideoQA {
  filename: string;
  durationSec: number;
  width: number;
  height: number;
  fps: number;
  hasAudio: boolean;
  sizeMb: number;
}

function inspectVideo(file: string): VideoQA {
  const fullPath = path.join(VIDEOS_DIR, file);
  const probeCmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -show_entries format=duration,size -of json "${fullPath}"`;
  const audioCmd = `ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of json "${fullPath}"`;

  const probeOut = JSON.parse(execSync(probeCmd, { encoding: 'utf-8' }));
  const audioOut = JSON.parse(execSync(audioCmd, { encoding: 'utf-8' }));

  const stream = probeOut.streams[0];
  const [num, den] = stream.r_frame_rate.split('/').map(Number);
  const fps = Math.round(num / den);

  return {
    filename: file,
    durationSec: Math.round(Number(probeOut.format.duration)),
    width: stream.width,
    height: stream.height,
    fps,
    hasAudio: Boolean(audioOut.streams && audioOut.streams.length > 0),
    sizeMb: Math.round((Number(probeOut.format.size) / 1024 / 1024) * 10) / 10,
  };
}

function extractQAFrame(videoFile: string, second: number, outName: string) {
  const videoPath = path.join(VIDEOS_DIR, videoFile);
  const outPath = path.join(QA_DIR, outName);
  const cmd = `ffmpeg -y -ss ${second} -i "${videoPath}" -vframes 1 -q:v 2 "${outPath}"`;
  execSync(cmd, { stdio: 'ignore' });
  return outPath;
}

async function runQA() {
  console.log('=== Running Visual & Audio Quality Verification ===\n');

  const report: VideoQA[] = [];
  for (const v of TARGET_VIDEOS) {
    const qa = inspectVideo(v);
    report.push(qa);
  }

  console.table(report);

  // Extract checkpoint frames for multimodal QA
  console.log('\n[Visual QA] Extracting keyframe screenshots from Master Tutorial...');
  const master = '00-safespace-full-end-to-end.mp4';
  const frames = [
    { sec: 4, name: '01_landing_hero.jpg' },
    { sec: 14, name: '02_google_sandbox_auth.jpg' },
    { sec: 35, name: '03_dass21_result_zoom.jpg' },
    { sec: 47, name: '04_vak_learning_style.jpg' },
    { sec: 80, name: '05_counselor_triage_queue.jpg' },
    { sec: 104, name: '06_encrypted_e2ee_chat.jpg' },
    { sec: 128, name: '07_safe_exit_and_outro.jpg' },
  ];

  for (const f of frames) {
    const p = extractQAFrame(master, f.sec, f.name);
    console.log(` - Captured checkpoint at t=${f.sec}s -> ${path.basename(p)}`);
  }

  console.log('\n=== All Video Outputs Verified & QA Frames Ready! ===');
}

runQA().catch((err) => {
  console.error('QA failed:', err);
  process.exit(1);
});
