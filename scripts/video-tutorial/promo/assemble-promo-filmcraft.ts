import { execFileSync, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const FILMCRAFT_CLI = 'D:\\ArtCraft\\FilmCraft\\filmcraft-cli.exe';
const PROMO_DIR = path.resolve(__dirname, '../../../docs/videos/promo');
const SUBCLIPS_DIR = path.join(PROMO_DIR, 'subclips');
const OVERLAYS_DIR = path.join(PROMO_DIR, 'overlays');
const AUDIO_DIR = path.join(PROMO_DIR, 'audio');
const QA_DIR = path.join(PROMO_DIR, 'qa-frames');
const PROJECT_FILE = path.join(PROMO_DIR, 'safespace-promo.fcproj');
const FINAL_OUTPUT = path.join(PROMO_DIR, 'safespace-promo-showcase.mp4');

const RAW_STUDENT = path.resolve(__dirname, '../../../docs/videos/student_pov_cfr.mp4');
const RAW_COUNSELOR = path.resolve(__dirname, '../../../docs/videos/counselor_pov_cfr.mp4');
const INTRO_CLEAN = path.join(PROMO_DIR, 'intro_clean_auth.mp4');

fs.mkdirSync(SUBCLIPS_DIR, { recursive: true });
fs.mkdirSync(QA_DIR, { recursive: true });

function runCli(args: string[]): any {
  try {
    const stdout = execFileSync(FILMCRAFT_CLI, args, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    const trimmed = stdout.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return JSON.parse(trimmed);
    }
    return trimmed;
  } catch (err: any) {
    console.error(`CLI execution failed: ${FILMCRAFT_CLI} ${args.join(' ')}\n`, err.stderr || err.message);
    throw err;
  }
}

function secToTicks(seconds: number): string {
  return String(Math.round(seconds * 254016000000));
}

// -----------------------------------------------------------------------------
// STEP 1: Prepare Exact Subclips with Precision Speed Ramps & Clean Crops
// -----------------------------------------------------------------------------
async function prepareSubclips() {
  console.log('=== Step 1: Preparing High-Quality 60fps CFR Subclips ===');

  // Subclip 1: Hook & URL Typing (0.0s to 5.5s from intro)
  console.log('[Subclip 1] Hook & URL typing (5.50s)...');
  execSync(
    `ffmpeg -y -ss 00:00:00 -i "${INTRO_CLEAN}" -t 5.50 -vf "scale=1920:1080" -r 60 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '01_hook.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 2: Clean Login & Google OAuth (5.5s to 11.63s from intro)
  console.log('[Subclip 2] Pristine Google OAuth & Click (6.13s)...');
  execSync(
    `ffmpeg -y -ss 00:00:05.50 -i "${INTRO_CLEAN}" -t 6.13 -vf "scale=1920:1080" -r 60 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '02_oauth.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 3: Student POV Anonymity Navbar & Banner (06.20s to 10.50s, 4.30s)
  console.log('[Subclip 3] Student POV Inside Dashboard: Akun Mahasiswa & Banner (4.30s)...');
  execSync(
    `ffmpeg -y -ss 00:00:06.20 -i "${RAW_STUDENT}" -t 4.30 -vf "scale=1920:1080" -r 60 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '03_anonymity.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 4: DASS-21 Speed-Ramp 500% (10.50s to 21.40s, exact 131 frames = 2.18s)
  console.log('[Subclip 4] DASS-21 Questionnaire Speed-Ramp 500% (2.18s)...');
  execSync(
    `ffmpeg -y -ss 00:00:10.50 -i "${RAW_STUDENT}" -vf "setpts=0.20*PTS,fps=60,scale=1920:1080" -frames:v 131 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '04_dass21_ramp.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 5: DASS-21 Lovibond Result Card (21.80s to 25.30s, 3.50s)
  console.log('[Subclip 5] DASS-21 Lovibond Result Card (3.50s)...');
  execSync(
    `ffmpeg -y -ss 00:00:21.80 -i "${RAW_STUDENT}" -t 3.50 -vf "scale=1920:1080" -r 60 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '05_dass21_result.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 6: VAK Questionnaire Speed-Ramp 500% (25.50s to 33.00s, exact 90 frames = 1.50s)
  console.log('[Subclip 6] VAK Questionnaire Speed-Ramp 500% (1.50s)...');
  execSync(
    `ffmpeg -y -ss 00:00:25.50 -i "${RAW_STUDENT}" -vf "setpts=0.20*PTS,fps=60,scale=1920:1080" -frames:v 90 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '06_vak_ramp.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 7: VAK Kinesthetic Result Card (33.20s to 36.70s, 3.50s)
  console.log('[Subclip 7] VAK Dominant Kinesthetic 58% Result (3.50s)...');
  execSync(
    `ffmpeg -y -ss 00:00:33.20 -i "${RAW_STUDENT}" -t 3.50 -vf "scale=1920:1080" -r 60 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '07_vak_result.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 8: Mood Journal & Ticket Speed-Ramp 250% (37.00s to 50.50s, exact 324 frames = 5.40s)
  console.log('[Subclip 8] Curhat Mood Journal & Buka Tiket Pra-Konseling (5.40s)...');
  execSync(
    `ffmpeg -y -ss 00:00:37.00 -i "${RAW_STUDENT}" -vf "setpts=0.40*PTS,fps=60,scale=1920:1080" -frames:v 324 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '08_mood_ticket.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 9: Counselor Triage Queue (04.30s to 09.50s, 5.20s, skipping counselor sandbox login!)
  console.log('[Subclip 9] Counselor Triage Queue: Sahabat Fajar-89 Ticket (5.20s)...');
  execSync(
    `ffmpeg -y -ss 00:00:04.30 -i "${RAW_COUNSELOR}" -t 5.20 -vf "scale=1920:1080" -r 60 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '09_counselor_triage.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 10: Counselor Chatroom Enters (09.80s to 17.30s, 7.50s)
  console.log('[Subclip 10] E2EE Chat Header & Counselor Greeting (7.50s)...');
  execSync(
    `ffmpeg -y -ss 00:00:09.80 -i "${RAW_COUNSELOR}" -t 7.50 -vf "scale=1920:1080" -r 60 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '10_counselor_chat.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 11: Student Live E2EE Exchange (82.50s to 98.00s, speed-ramped 200%, exact 465 frames = 7.75s)
  console.log('[Subclip 11] Student Live E2EE Exchange & Kinesthetic Pomodoro (7.75s)...');
  execSync(
    `ffmpeg -y -ss 00:01:22.50 -i "${RAW_STUDENT}" -vf "setpts=0.50*PTS,fps=60,scale=1920:1080" -frames:v 465 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '11_student_chat.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 12: Emergency Safe Exit Click (121.00s to 124.68s, 3.68s)
  console.log('[Subclip 12] Emergency Safe Exit to Google.com (3.68s)...');
  execSync(
    `ffmpeg -y -ss 00:02:01.00 -i "${RAW_STUDENT}" -t 3.68 -vf "scale=1920:1080" -r 60 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '12_safe_exit.mp4')}"`,
    { stdio: 'ignore' },
  );

  // Subclip 13: Outro Showcase Screen (16.00s from outro_card.png)
  console.log('[Subclip 13] Outro Branded Showcase Card (16.00s)...');
  const outroPng = path.join(OVERLAYS_DIR, 'outro_card.png');
  execSync(
    `ffmpeg -y -loop 1 -i "${outroPng}" -t 16.00 -vf "scale=1920:1080" -r 60 -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${path.join(SUBCLIPS_DIR, '13_outro.mp4')}"`,
    { stdio: 'ignore' },
  );

  console.log('=== All 13 Subclips Generated with Exact Frame Counts! ===\n');
}

// -----------------------------------------------------------------------------
// STEP 2: Assemble FilmCraft Project & Multi-Track Showcase
// -----------------------------------------------------------------------------
async function buildFilmCraftProject() {
  console.log('=== Step 2: Assembling FilmCraft .fcproj Project ===');

  if (fs.existsSync(PROJECT_FILE)) {
    fs.unlinkSync(PROJECT_FILE);
  }

  // 1. Initialize project
  runCli(['--demo', '--save-as', PROJECT_FILE, 'exec', 'file.newBin', 'name=PromoAssets']);

  // 2. Import assets into FilmCraft
  const subclipFiles = fs
    .readdirSync(SUBCLIPS_DIR)
    .filter((f) => f.endsWith('.mp4'))
    .map((f) => path.join(SUBCLIPS_DIR, f));
  const overlayFiles = fs
    .readdirSync(OVERLAYS_DIR)
    .filter((f) => f.endsWith('.png'))
    .map((f) => path.join(OVERLAYS_DIR, f));
  const audioFiles = fs
    .readdirSync(AUDIO_DIR)
    .filter((f) => f.endsWith('.wav'))
    .map((f) => path.join(AUDIO_DIR, f));

  const allAssetsToImport = [...subclipFiles, ...overlayFiles, ...audioFiles];
  console.log(`[FilmCraft] Importing ${allAssetsToImport.length} media assets into project...`);

  runCli(['--project', PROJECT_FILE, '--save', 'import', ...allAssetsToImport]);

  // 3. Inspect project to build item mapping
  const proj = runCli(['--project', PROJECT_FILE, 'inspect', 'project']);
  const itemMap: Record<string, number> = {};
  const traverse = (node: any) => {
    if (node.name && node.item) itemMap[node.name] = node.item;
    if (node.children) {
      for (const c of node.children) traverse(c);
    }
  };
  traverse(proj.root);

  // 4. Create Sequence: SafeSpace_Promo_Showcase
  console.log('[FilmCraft] Creating Sequence: SafeSpace_Promo_Showcase (1920x1080 60fps)...');
  const seqRes = runCli([
    '--project',
    PROJECT_FILE,
    '--save',
    'exec',
    'file.newSequence',
    'name=SafeSpace_Promo_Showcase',
    'width=1920',
    'height=1080',
    'fps=60',
    'video=4',
    'audio=4',
  ]);
  console.log(`[FilmCraft] Created Sequence ID: ${seqRes.sequence}`);

  // 5. Place Subclips sequentially on Track V1
  const subclipsOrder = [
    { name: '01_hook.mp4', dur: 5.5 },
    { name: '02_oauth.mp4', dur: 6.13 },
    { name: '03_anonymity.mp4', dur: 4.3 },
    { name: '04_dass21_ramp.mp4', dur: 2.18 },
    { name: '05_dass21_result.mp4', dur: 3.5 },
    { name: '06_vak_ramp.mp4', dur: 1.5 },
    { name: '07_vak_result.mp4', dur: 3.5 },
    { name: '08_mood_ticket.mp4', dur: 5.4 },
    { name: '09_counselor_triage.mp4', dur: 5.2 },
    { name: '10_counselor_chat.mp4', dur: 7.5 },
    { name: '11_student_chat.mp4', dur: 7.75 },
    { name: '12_safe_exit.mp4', dur: 3.68 },
    { name: '13_outro.mp4', dur: 16.0 },
  ];

  let currentTimelineSec = 0;
  for (const sc of subclipsOrder) {
    const itemId = itemMap[sc.name];
    if (itemId) {
      runCli([
        '--project',
        PROJECT_FILE,
        '--save',
        'exec',
        'timeline.place',
        `item=${itemId}`,
        'track=V1',
        `seconds=${currentTimelineSec.toFixed(3)}`,
        `duration=${secToTicks(sc.dur)}`,
        'insert=false',
        'audio=false',
      ]);
      currentTimelineSec += sc.dur;
    }
  }
  console.log(`[FilmCraft] Placed 13 subclips on Track V1 (Total: ${currentTimelineSec.toFixed(2)}s)`);

  // 6. Place Callout Overlays on Track V2
  const overlaysSchedule = [
    { name: 'callout_01_hook.png', start: 0.8, dur: 4.2 },
    { name: 'callout_02_auth.png', start: 6.2, dur: 5.0 },
    { name: 'callout_03_anonymity.png', start: 11.8, dur: 3.7 },
    { name: 'callout_04_dass21.png', start: 18.2, dur: 3.2 },
    { name: 'callout_05_vak.png', start: 23.2, dur: 3.2 },
    { name: 'callout_06_counselor_triage.png', start: 32.2, dur: 4.6 },
    { name: 'callout_07_e2ee.png', start: 37.5, dur: 7.0 },
    { name: 'callout_08_safe_exit.png', start: 52.5, dur: 3.3 },
  ];

  for (const ov of overlaysSchedule) {
    const ovId = itemMap[ov.name];
    if (ovId) {
      runCli([
        '--project',
        PROJECT_FILE,
        '--save',
        'exec',
        'timeline.place',
        `item=${ovId}`,
        'track=V2',
        `seconds=${ov.start}`,
        `duration=${secToTicks(ov.dur)}`,
        'insert=false',
        'audio=false',
      ]);
    }
  }
  console.log('[FilmCraft] Placed 8 Callout Overlays on Track V2');

  // 7. Place Voiceovers on Track A1
  const voSchedule = [
    { name: 'promo_01_hook.wav', start: 0.0 },
    { name: 'promo_02_intro_pwa.wav', start: 5.5 },
    { name: 'promo_03_oauth_sanitization.wav', start: 11.5 },
    { name: 'promo_04_student_anonymity.wav', start: 16.0 },
    { name: 'promo_05_dass21.wav', start: 18.5 },
    { name: 'promo_06_vak_reflection.wav', start: 23.5 },
    { name: 'promo_07_counselor_triage.wav', start: 32.0 },
    { name: 'promo_08_e2ee_chat.wav', start: 37.5 },
    { name: 'promo_09_safe_exit.wav', start: 52.5 },
    { name: 'promo_10_outro.wav', start: 56.5 },
  ];

  for (const vo of voSchedule) {
    const voId = itemMap[vo.name];
    if (voId) {
      runCli([
        '--project',
        PROJECT_FILE,
        '--save',
        'exec',
        'timeline.place',
        `item=${voId}`,
        'track=A1',
        `seconds=${vo.start}`,
        'insert=false',
        'video=false',
      ]);
    }
  }
  console.log('[FilmCraft] Placed 10 Voiceovers on Track A1');

  // 8. Place Background Music on Track A3
  const bgId = itemMap['promo_ambient_pulse.wav'];
  if (bgId) {
    runCli([
      '--project',
      PROJECT_FILE,
      '--save',
      'exec',
      'timeline.place',
      `item=${bgId}`,
      'track=A3',
      'seconds=0',
      `duration=${secToTicks(currentTimelineSec)}`,
      'insert=false',
      'video=false',
    ]);
    runCli(['--project', PROJECT_FILE, '--save', 'exec', 'timeline.setTrack', 'track=A3', 'volumeDb=-22']);
  }
  console.log('[FilmCraft] Placed Background Score on Track A3 (-22 dB)');

  console.log(`\n=== FilmCraft Project Saved: ${PROJECT_FILE} ===\n`);
}

// -----------------------------------------------------------------------------
// STEP 3: Composite Master Promotional Showcase Video (1080p 60fps)
// -----------------------------------------------------------------------------
async function compositeMasterVideo() {
  console.log('=== Step 3: Compositing High-Definition Master Promotional Showcase ===');

  const audioMixWav = path.join(PROMO_DIR, 'promo_master_audio.wav');
  console.log('[Audio] Mixing master audio tracks (A1 VO + A2 SFX + A3 Music)...');

  const voFiles = [
    { f: 'promo_01_hook.wav', t: 0.0 },
    { f: 'promo_02_intro_pwa.wav', t: 5.5 },
    { f: 'promo_03_oauth_sanitization.wav', t: 11.5 },
    { f: 'promo_04_student_anonymity.wav', t: 16.0 },
    { f: 'promo_05_dass21.wav', t: 18.5 },
    { f: 'promo_06_vak_reflection.wav', t: 23.5 },
    { f: 'promo_07_counselor_triage.wav', t: 32.0 },
    { f: 'promo_08_e2ee_chat.wav', t: 37.5 },
    { f: 'promo_09_safe_exit.wav', t: 52.5 },
    { f: 'promo_10_outro.wav', t: 56.5 },
  ];

  let voInputs = '';
  let voFilter = '';
  voFiles.forEach((vo, idx) => {
    voInputs += ` -i "${path.join(AUDIO_DIR, vo.f)}"`;
    const delayMs = Math.round(vo.t * 1000);
    voFilter += `[${idx}:a]adelay=${delayMs}|${delayMs}[vo${idx}];`;
  });
  const voMixInputs = voFiles.map((_, idx) => `[vo${idx}]`).join('');
  const voFilterComplex = `${voFilter}${voMixInputs}amix=inputs=${voFiles.length}:dropout_transition=0,volume=1.35[vo_master]`;

  const voMixWav = path.join(PROMO_DIR, 'vo_mix.wav');
  execSync(`ffmpeg -y ${voInputs} -filter_complex "${voFilterComplex}" -map "[vo_master]" -ar 48000 -ac 2 "${voMixWav}"`, {
    stdio: 'ignore',
  });

  const bgMusic = path.join(AUDIO_DIR, 'promo_ambient_pulse.wav');
  const whooshSfx = path.join(AUDIO_DIR, 'sfx_whoosh.wav');
  const popSfx = path.join(AUDIO_DIR, 'sfx_pop.wav');
  const keySfx = path.join(AUDIO_DIR, 'sfx_keystrokes.wav');

  const mixFinalCmd = `ffmpeg -y -i "${voMixWav}" -i "${bgMusic}" -i "${whooshSfx}" -i "${popSfx}" -i "${keySfx}" -filter_complex "[1:a]volume=0.18,afade=t=in:ss=0:d=2,afade=t=out:st=67:d=4[bg];[4:a]adelay=300|300,volume=0.6[keys];[2:a]asplit=7[w1_in][w2_in][w3_in][w4_in][w5_in][w6_in][w7_in];[3:a]asplit=7[p1_in][p2_in][p3_in][p4_in][p5_in][p6_in][p7_in];[w1_in]adelay=5400|5400,volume=0.4[w1];[p1_in]adelay=6500|6500,volume=0.3[p1];[w2_in]adelay=11500|11500,volume=0.4[w2];[p2_in]adelay=12000|12000,volume=0.3[p2];[w3_in]adelay=18000|18000,volume=0.4[w3];[p3_in]adelay=18500|18500,volume=0.3[p3];[w4_in]adelay=23000|23000,volume=0.4[w4];[p4_in]adelay=23500|23500,volume=0.3[p4];[w5_in]adelay=32000|32000,volume=0.4[w5];[p5_in]adelay=32500|32500,volume=0.3[p5];[w6_in]adelay=37200|37200,volume=0.4[w6];[p6_in]adelay=38000|38000,volume=0.3[p6];[w7_in]adelay=52400|52400,volume=0.4[w7];[p7_in]adelay=53000|53000,volume=0.3[p7];[0:a][bg][keys][w1][p1][w2][p2][w3][p3][w4][p4][w5][p5][w6][p6][w7][p7]amix=inputs=17:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[aout]" -map "[aout]" -ar 48000 -ac 2 "${audioMixWav}"`;

  execSync(mixFinalCmd, { stdio: 'ignore' });
  console.log('[Audio] Master audio track normalized to -14 LUFS!');

  // Concatenate video subclips (Track V1)
  console.log('[Video] Stitching 13 subclips into master video stream...');
  const concatListTxt = path.join(PROMO_DIR, 'concat_list.txt');
  const scOrder = [
    '01_hook.mp4',
    '02_oauth.mp4',
    '03_anonymity.mp4',
    '04_dass21_ramp.mp4',
    '05_dass21_result.mp4',
    '06_vak_ramp.mp4',
    '07_vak_result.mp4',
    '08_mood_ticket.mp4',
    '09_counselor_triage.mp4',
    '10_counselor_chat.mp4',
    '11_student_chat.mp4',
    '12_safe_exit.mp4',
    '13_outro.mp4',
  ];
  fs.writeFileSync(concatListTxt, scOrder.map((f) => `file 'subclips/${f}'`).join('\n'), 'utf-8');

  const v1BaseMp4 = path.join(PROMO_DIR, 'v1_base.mp4');
  execSync(`ffmpeg -y -f concat -safe 0 -i concat_list.txt -c copy "${v1BaseMp4}"`, {
    cwd: PROMO_DIR,
    stdio: 'ignore',
  });

  // Composite Track V2 Callout Overlays with exact timeline matches onto Track V1 + Audio
  console.log('[Video] Compositing Track V2 Callout Overlays onto Track V1...');
  const ov1 = path.join(OVERLAYS_DIR, 'callout_01_hook.png');
  const ov2 = path.join(OVERLAYS_DIR, 'callout_02_auth.png');
  const ov3 = path.join(OVERLAYS_DIR, 'callout_03_anonymity.png');
  const ov4 = path.join(OVERLAYS_DIR, 'callout_04_dass21.png');
  const ov5 = path.join(OVERLAYS_DIR, 'callout_05_vak.png');
  const ov6 = path.join(OVERLAYS_DIR, 'callout_06_counselor_triage.png');
  const ov7 = path.join(OVERLAYS_DIR, 'callout_07_e2ee.png');
  const ov8 = path.join(OVERLAYS_DIR, 'callout_08_safe_exit.png');

  // Exact overlay activation time windows matching the cumulative subclip timeline:
  // 01_hook: 0.0 - 5.5s
  // 02_oauth: 5.5 - 11.63s
  // 03_anonymity: 11.63 - 15.93s
  // 04_dass21_ramp: 15.93 - 18.11s
  // 05_dass21_result: 18.11 - 21.61s
  // 06_vak_ramp: 21.61 - 23.11s
  // 07_vak_result: 23.11 - 26.61s
  // 08_mood_ticket: 26.61 - 32.01s
  // 09_counselor_triage: 32.01 - 37.21s
  // 10_counselor_chat: 37.21 - 44.71s
  // 11_student_chat: 44.71 - 52.46s
  // 12_safe_exit: 52.46 - 56.14s
  // 13_outro: 56.14 - 72.14s
  const overlayFilter = `
    [0:v][1:v]overlay=0:0:enable='between(t,0.8,5.0)'[b1];
    [b1][2:v]overlay=0:0:enable='between(t,6.2,11.2)'[b2];
    [b2][3:v]overlay=0:0:enable='between(t,11.8,15.5)'[b3];
    [b3][4:v]overlay=0:0:enable='between(t,18.2,21.4)'[b4];
    [b4][5:v]overlay=0:0:enable='between(t,23.2,26.4)'[b5];
    [b5][6:v]overlay=0:0:enable='between(t,32.2,36.8)'[b6];
    [b6][7:v]overlay=0:0:enable='between(t,37.5,44.5)'[b7];
    [b7][8:v]overlay=0:0:enable='between(t,52.5,55.8)'[vout]
  `.replace(/\s+/g, '');

  const compositeCmd = `ffmpeg -y -i "${v1BaseMp4}" -i "${ov1}" -i "${ov2}" -i "${ov3}" -i "${ov4}" -i "${ov5}" -i "${ov6}" -i "${ov7}" -i "${ov8}" -i "${audioMixWav}" -filter_complex "${overlayFilter}" -map "[vout]" -map 9:a -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest "${FINAL_OUTPUT}"`;

  console.log('[FFmpeg] Rendering final composite video...');
  execSync(compositeCmd, { stdio: 'inherit' });

  console.log(`\n=== FINAL PROMOTIONAL VIDEO EXPORTED: ${FINAL_OUTPUT} ===\n`);

  // -----------------------------------------------------------------------------
  // STEP 4: Extract Key QA Frames for Multi-Modal Verification
  // -----------------------------------------------------------------------------
  console.log('=== Step 4: Extracting QA Verification Frames ===');
  const qaTimestamps = [
    { t: '00:00:02.50', name: 'qa_01_url_typing.png' },
    { t: '00:00:08.50', name: 'qa_02_clean_auth.png' },
    { t: '00:00:13.50', name: 'qa_03_student_anonymity.png' },
    { t: '00:00:19.50', name: 'qa_04_dass21_result.png' },
    { t: '00:00:24.50', name: 'qa_05_vak_kinesthetic.png' },
    { t: '00:00:34.50', name: 'qa_06_counselor_triage.png' },
    { t: '00:00:40.50', name: 'qa_07_e2ee_chat.png' },
    { t: '00:00:54.00', name: 'qa_08_safe_exit.png' },
    { t: '00:01:02.00', name: 'qa_09_outro_card.png' },
  ];

  for (const qa of qaTimestamps) {
    const outPng = path.join(QA_DIR, qa.name);
    execSync(`ffmpeg -y -ss ${qa.t} -i "${FINAL_OUTPUT}" -vframes 1 "${outPng}"`, { stdio: 'ignore' });
    console.log(`[QA] Extracted ${qa.name} at ${qa.t}`);
  }

  console.log('=== Showcase Verification Ready! ===\n');
}

async function main() {
  await prepareSubclips();
  await buildFilmCraftProject();
  await compositeMasterVideo();
}

main().catch((err) => {
  console.error('Assembly failed:', err);
  process.exit(1);
});
