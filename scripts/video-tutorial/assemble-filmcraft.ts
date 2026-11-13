import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { NARRATION_SCRIPTS } from './story-data';

const FILMCRAFT_CLI = 'D:\\ArtCraft\\FilmCraft\\filmcraft-cli.exe';
const PROJECT_FILE = path.resolve(__dirname, '../../docs/videos/safespace-tutorial.fcproj');
const VIDEOS_DIR = path.resolve(__dirname, '../../docs/videos');

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

// 254,016,000,000 ticks per second
function secToTicks(seconds: number): string {
  return String(Math.round(seconds * 254016000000));
}

async function assembleTutorials() {
  console.log('=== Assembling SafeSpace Video Tutorials with FilmCraft Engine ===');

  // 1. Inspect project to retrieve asset item IDs
  const proj = runCli(['--project', PROJECT_FILE, 'inspect', 'project']);
  const itemMap: Record<string, number> = {};

  const traverse = (node: any) => {
    if (node.name && node.item) {
      itemMap[node.name] = node.item;
    }
    if (node.children) {
      for (const child of node.children) traverse(child);
    }
  };
  traverse(proj.root);

  console.log('[Assets] Mapped Items in Project:');
  console.log(` - Student Footage: ${itemMap['student_pov_cfr.mp4']}`);
  console.log(` - Counselor Footage: ${itemMap['counselor_pov_cfr.mp4']}`);
  console.log(` - Ambient Music: ${itemMap['calm_ambient_bg.wav']}`);

  // -------------------------------------------------------------------------
  // SEQUENCE 1: POV MAHASISWA (01-tutorial-pov-mahasiswa.mp4)
  // -------------------------------------------------------------------------
  console.log('\n--- Building Sequence 1: POV Mahasiswa ---');
  const seqStudent = runCli([
    '--project', PROJECT_FILE, '--save',
    'exec', 'file.newSequence',
    'name=POV_Mahasiswa', 'width=1920', 'height=1080', 'fps=60', 'video=4', 'audio=3',
  ]);
  const seqStudentId = seqStudent.sequence;
  console.log(`[POV Mahasiswa] Created sequence id: ${seqStudentId}`);

  // Place video footage on V1 (0 to 76 seconds)
  const studentFootageItem = itemMap['student_pov_cfr.mp4'];
  const placeStudentVideo = runCli([
    '--project', PROJECT_FILE, '--save',
    'exec', 'timeline.place',
    `item=${studentFootageItem}`, 'track=V1', 'seconds=0', 'insert=false', 'audio=false',
  ]);
  const studentClipId = placeStudentVideo.clips[0];
  console.log(`[POV Mahasiswa] Placed student footage clip id: ${studentClipId}`);

  // Apply Motion Keyframes: Smooth Zoom at DASS-21 Result (around 33s)
  try {
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'effects.setParam',
      `clip=${studentClipId}`, 'effect=motion', 'param=scale', 'value=100', `time=${secToTicks(32.5)}`, 'keyframe=true',
    ]);
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'effects.setParam',
      `clip=${studentClipId}`, 'effect=motion', 'param=scale', 'value=135', `time=${secToTicks(34.0)}`, 'keyframe=true',
    ]);
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'effects.setInterpolation',
      `clip=${studentClipId}`, 'effect=motion', 'param=scale', `mediaTime=${secToTicks(34.0)}`, 'interpolation=continuousBezier',
    ]);
    // Zoom back out before VAK
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'effects.setParam',
      `clip=${studentClipId}`, 'effect=motion', 'param=scale', 'value=100', `time=${secToTicks(42.5)}`, 'keyframe=true',
    ]);
    console.log('[Motion] Injected bezier zoom keyframe for DASS-21 Result');
  } catch (err) {
    console.warn('Motion keyframe warning:', err);
  }

  // Place Voiceovers on Track A1
  const studentVoices = [
    { name: 'scene_01_intro.wav', time: 0 },
    { name: 'scene_02_login_student.wav', time: 8.0 },
    { name: 'scene_03_dass21.wav', time: 19.0 },
    { name: 'scene_04_dass21_result.wav', time: 33.0 },
    { name: 'scene_05_vak.wav', time: 44.0 },
    { name: 'scene_06_mood_ticket.wav', time: 55.0 },
    { name: 'scene_10_safe_exit.wav', time: 66.5 },
  ];

  for (const vo of studentVoices) {
    const voItem = itemMap[vo.name];
    if (voItem) {
      runCli([
        '--project', PROJECT_FILE, '--save',
        'exec', 'timeline.place',
        `item=${voItem}`, 'track=A1', `seconds=${vo.time}`, 'insert=false', 'video=false',
      ]);
    }
  }

  // Place Ambient score on Track A2
  const ambientItem = itemMap['calm_ambient_bg.wav'];
  if (ambientItem) {
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'timeline.place',
      `item=${ambientItem}`, 'track=A2', 'seconds=0', `duration=${secToTicks(78)}`, 'insert=false', 'video=false',
    ]);
    // Set A2 volume to -24 dB
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'timeline.setTrack',
      'track=A2', 'volumeDb=-24',
    ]);
  }

  // Add Captions Track on C1
  try {
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'captions.newTrack',
      'format=Subtitle', 'name=Bahasa_Indonesia', 'language=id',
    ]);
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'captions.setStyle',
      'track=C1', 'font=Inter', 'fontStyle=SemiBold', 'size=38', 'color=#FFFFFF', 'background=true', 'backgroundColor=#1E293BD9', 'margin=0.06',
    ]);

    for (const vo of studentVoices) {
      const script = NARRATION_SCRIPTS.find((s) => s.id === vo.name.replace('.wav', ''));
      if (script) {
        runCli([
          '--project', PROJECT_FILE, '--save',
          'exec', 'captions.add',
          'track=C1', `text=${script.text}`, `seconds=${vo.time}`, `durationSeconds=${script.approxDurationSec}`,
        ]);
      }
    }
    console.log('[Captions] Generated Subtitle Track for POV Mahasiswa');
  } catch (err) {
    console.warn('Caption warning:', err);
  }

  // Export 01-tutorial-pov-mahasiswa.mp4
  const studentOutPath = path.join(VIDEOS_DIR, '01-tutorial-pov-mahasiswa.mp4');
  console.log(`[Export] Rendering ${path.basename(studentOutPath)}...`);
  runCli([
    '--project', PROJECT_FILE,
    'export', studentOutPath,
    '--range', 'custom', '--start', '0', '--end', '76',
    '--gpu-rendering', 'auto',
  ]);
  console.log(`[Export] Done: ${studentOutPath}`);

  // -------------------------------------------------------------------------
  // SEQUENCE 2: POV KONSELOR (02-tutorial-pov-konselor.mp4)
  // -------------------------------------------------------------------------
  console.log('\n--- Building Sequence 2: POV Konselor ---');
  const seqCounselor = runCli([
    '--project', PROJECT_FILE, '--save',
    'exec', 'file.newSequence',
    'name=POV_Konselor', 'width=1920', 'height=1080', 'fps=60', 'video=4', 'audio=3',
  ]);
  const seqCounselorId = seqCounselor.sequence;
  console.log(`[POV Konselor] Created sequence id: ${seqCounselorId}`);

  // Place video footage on V1 (0 to 48 seconds)
  const counselorFootageItem = itemMap['counselor_pov_cfr.mp4'];
  const placeCounselorVideo = runCli([
    '--project', PROJECT_FILE, '--save',
    'exec', 'timeline.place',
    `item=${counselorFootageItem}`, 'track=V1', 'seconds=0', 'insert=false', 'audio=false',
  ]);
  const counselorClipId = placeCounselorVideo.clips[0];
  console.log(`[POV Konselor] Placed counselor footage clip id: ${counselorClipId}`);

  // Motion Keyframe: Zoom into Attached DASS-21 & VAK in Queue (around 12s)
  try {
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'effects.setParam',
      `clip=${counselorClipId}`, 'effect=motion', 'param=scale', 'value=100', `time=${secToTicks(11.5)}`, 'keyframe=true',
    ]);
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'effects.setParam',
      `clip=${counselorClipId}`, 'effect=motion', 'param=scale', 'value=140', `time=${secToTicks(13.0)}`, 'keyframe=true',
    ]);
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'effects.setInterpolation',
      `clip=${counselorClipId}`, 'effect=motion', 'param=scale', `mediaTime=${secToTicks(13.0)}`, 'interpolation=continuousBezier',
    ]);
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'effects.setParam',
      `clip=${counselorClipId}`, 'effect=motion', 'param=scale', 'value=100', `time=${secToTicks(21.5)}`, 'keyframe=true',
    ]);
    console.log('[Motion] Injected bezier zoom keyframe for Attached Profile in Queue');
  } catch (err) {
    console.warn('Motion keyframe warning:', err);
  }

  // Place Counselor Voiceovers on Track A1
  const counselorVoices = [
    { name: 'scene_07_counselor_triage.wav', time: 0 },
    { name: 'scene_08_counselor_attached_profile.wav', time: 11.0 },
    { name: 'scene_09_chat_e2ee.wav', time: 23.5 },
    { name: 'scene_11_outro.wav', time: 37.0 },
  ];

  for (const vo of counselorVoices) {
    const voItem = itemMap[vo.name];
    if (voItem) {
      runCli([
        '--project', PROJECT_FILE, '--save',
        'exec', 'timeline.place',
        `item=${voItem}`, 'track=A1', `seconds=${vo.time}`, 'insert=false', 'video=false',
      ]);
    }
  }

  // Ambient & SFX Chime on A2 & A3
  if (ambientItem) {
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'timeline.place',
      `item=${ambientItem}`, 'track=A2', 'seconds=0', `duration=${secToTicks(50)}`, 'insert=false', 'video=false',
    ]);
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'timeline.setTrack',
      'track=A2', 'volumeDb=-24',
    ]);
  }

  const chimeItem = itemMap['message_chime.wav'];
  if (chimeItem) {
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'timeline.place',
      `item=${chimeItem}`, 'track=A3', 'seconds=27.5', 'insert=false', 'video=false',
    ]);
  }

  // Captions for Counselor POV
  try {
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'captions.newTrack',
      'format=Subtitle', 'name=Bahasa_Indonesia', 'language=id',
    ]);
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'captions.setStyle',
      'track=C1', 'font=Inter', 'fontStyle=SemiBold', 'size=38', 'color=#FFFFFF', 'background=true', 'backgroundColor=#1E293BD9', 'margin=0.06',
    ]);

    for (const vo of counselorVoices) {
      const script = NARRATION_SCRIPTS.find((s) => s.id === vo.name.replace('.wav', ''));
      if (script) {
        runCli([
          '--project', PROJECT_FILE, '--save',
          'exec', 'captions.add',
          'track=C1', `text=${script.text}`, `seconds=${vo.time}`, `durationSeconds=${script.approxDurationSec}`,
        ]);
      }
    }
    console.log('[Captions] Generated Subtitle Track for POV Konselor');
  } catch (err) {
    console.warn('Caption warning:', err);
  }

  // Export 02-tutorial-pov-konselor.mp4
  const counselorOutPath = path.join(VIDEOS_DIR, '02-tutorial-pov-konselor.mp4');
  console.log(`[Export] Rendering ${path.basename(counselorOutPath)}...`);
  runCli([
    '--project', PROJECT_FILE,
    'export', counselorOutPath,
    '--range', 'custom', '--start', '0', '--end', '48',
    '--gpu-rendering', 'auto',
  ]);
  console.log(`[Export] Done: ${counselorOutPath}`);

  // -------------------------------------------------------------------------
  // SEQUENCE 3: MASTER END-TO-END (00-safespace-full-end-to-end.mp4)
  // -------------------------------------------------------------------------
  console.log('\n--- Building Sequence 3: Full End-to-End Master ---');
  const seqMaster = runCli([
    '--project', PROJECT_FILE, '--save',
    'exec', 'file.newSequence',
    'name=SafeSpace_Full_Master', 'width=1920', 'height=1080', 'fps=60', 'video=4', 'audio=3',
  ]);
  const seqMasterId = seqMaster.sequence;
  console.log(`[Master Edit] Created master sequence id: ${seqMasterId}`);

  // Student Part (0s - 76s)
  runCli([
    '--project', PROJECT_FILE, '--save',
    'exec', 'timeline.place',
    `item=${studentFootageItem}`, 'track=V1', 'seconds=0', `duration=${secToTicks(76)}`, 'insert=false', 'audio=false',
  ]);

  // Counselor Part & Chat (76s - 132s)
  runCli([
    '--project', PROJECT_FILE, '--save',
    'exec', 'timeline.place',
    `item=${counselorFootageItem}`, 'track=V1', 'seconds=76', `duration=${secToTicks(56)}`, 'insert=false', 'audio=false',
  ]);

  // Place All 11 Voiceovers
  const allMasterVoices = [
    { name: 'scene_01_intro.wav', time: 0 },
    { name: 'scene_02_login_student.wav', time: 8.0 },
    { name: 'scene_03_dass21.wav', time: 19.0 },
    { name: 'scene_04_dass21_result.wav', time: 33.0 },
    { name: 'scene_05_vak.wav', time: 44.0 },
    { name: 'scene_06_mood_ticket.wav', time: 55.0 },
    { name: 'scene_07_counselor_triage.wav', time: 76.0 },
    { name: 'scene_08_counselor_attached_profile.wav', time: 87.0 },
    { name: 'scene_09_chat_e2ee.wav', time: 99.5 },
    { name: 'scene_10_safe_exit.wav', time: 114.0 },
    { name: 'scene_11_outro.wav', time: 124.0 },
  ];

  for (const vo of allMasterVoices) {
    const voItem = itemMap[vo.name];
    if (voItem) {
      runCli([
        '--project', PROJECT_FILE, '--save',
        'exec', 'timeline.place',
        `item=${voItem}`, 'track=A1', `seconds=${vo.time}`, 'insert=false', 'video=false',
      ]);
    }
  }

  // Ambient & Music
  if (ambientItem) {
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'timeline.place',
      `item=${ambientItem}`, 'track=A2', 'seconds=0', `duration=${secToTicks(136)}`, 'insert=false', 'video=false',
    ]);
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'timeline.setTrack',
      'track=A2', 'volumeDb=-24',
    ]);
  }

  // Captions for Master
  try {
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'captions.newTrack',
      'format=Subtitle', 'name=Bahasa_Indonesia', 'language=id',
    ]);
    runCli([
      '--project', PROJECT_FILE, '--save',
      'exec', 'captions.setStyle',
      'track=C1', 'font=Inter', 'fontStyle=SemiBold', 'size=38', 'color=#FFFFFF', 'background=true', 'backgroundColor=#1E293BD9', 'margin=0.06',
    ]);

    for (const vo of allMasterVoices) {
      const script = NARRATION_SCRIPTS.find((s) => s.id === vo.name.replace('.wav', ''));
      if (script) {
        runCli([
          '--project', PROJECT_FILE, '--save',
          'exec', 'captions.add',
          'track=C1', `text=${script.text}`, `seconds=${vo.time}`, `durationSeconds=${script.approxDurationSec}`,
        ]);
      }
    }
  } catch (err) {
    console.warn('Caption warning:', err);
  }

  // Export 00-safespace-full-end-to-end.mp4
  const masterOutPath = path.join(VIDEOS_DIR, '00-safespace-full-end-to-end.mp4');
  console.log(`[Export] Rendering ${path.basename(masterOutPath)}...`);
  runCli([
    '--project', PROJECT_FILE,
    'export', masterOutPath,
    '--range', 'custom', '--start', '0', '--end', '133',
    '--gpu-rendering', 'auto',
  ]);
  console.log(`[Export] Done: ${masterOutPath}`);

  console.log('\n=== All 3 Video Tutorials Successfully Assembled and Exported! ===');
}

assembleTutorials().catch((err) => {
  console.error('Assembly error:', err);
  process.exit(1);
});
