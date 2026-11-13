import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { VideoCursorRecorder } from './cursor-overlay';
import {
  CHAT_EXCHANGE,
  DASS21_RESPONSES,
  VAK_CHOICES,
} from './story-data';

const BASE_URL = 'http://localhost:5173';
const RAW_DIR = path.resolve(__dirname, '../../docs/videos/raw-footage');
fs.mkdirSync(RAW_DIR, { recursive: true });

async function runDualPOVRecording() {
  console.log('=== Starting SafeSpace Playwright Dual-POV Studio Capture ===');

  const browser = await chromium.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
    ],
  });

  // ----------------------------------------------------
  // PART 1: RECORD POV MAHASISWA
  // ----------------------------------------------------
  console.log('\n--- Capturing Scene 1: POV Mahasiswa ---');
  const studentContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: RAW_DIR,
      size: { width: 1920, height: 1080 },
    },
  });

  const studentPage = await studentContext.newPage();
  const studentRecorder = new VideoCursorRecorder(RAW_DIR);
  await studentRecorder.setupPageCursor(studentPage);

  // 1. Landing Page
  studentRecorder.resetClock();
  await studentPage.goto(`${BASE_URL}/?sandbox_key=safespace-evaluator-2026`);
  await studentPage.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('safespace_sandbox_unlocked', 'true');
  });
  await studentPage.reload();
  await studentPage.waitForLoadState('networkidle');
  await studentPage.waitForTimeout(1000);

  // Hover over Safe Exit button to explain safety feature (DO NOT CLICK HERE!)
  const safeExitBtn = studentPage.getByRole('button', { name: /Safe Exit/i });
  await studentRecorder.hover(studentPage, safeExitBtn, 'Inspect Safe Exit Button in Navbar', 1000);

  // Click Masuk / Mulai Konsultasi
  const primaryCta = studentPage.getByRole('button', { name: /Masuk \/ Mulai Konsultasi/i });
  if (await primaryCta.isVisible()) {
    await studentRecorder.moveAndClick(studentPage, primaryCta, 'Click Masuk / Mulai Konsultasi', 800);
  } else {
    await studentPage.goto(`${BASE_URL}/#/auth`);
  }

  // 2. Auth: Mahasiswa Sandbox Login
  const studentLoginBtn = studentPage.getByRole('button', { name: /^Mahasiswa$/i });
  await studentLoginBtn.waitFor({ state: 'visible', timeout: 10000 });
  await studentRecorder.moveAndClick(studentPage, studentLoginBtn, 'Login as Mahasiswa', 1200);

  // 3. Asesmen Mandiri: DASS-21
  const assessmentNav = studentPage.getByRole('button', { name: 'Asesmen Mandiri' }).first();
  await studentRecorder.moveAndClick(studentPage, assessmentNav, 'Navigate to Asesmen Mandiri', 800);

  console.log('[DASS-21] Answering 21 questions...');
  for (let i = 0; i < 21; i++) {
    const score = DASS21_RESPONSES[i];
    let pattern = /^2\s+Sering/i;
    let labelText = 'Sering';
    if (score === 0) {
      pattern = /^0\s+Tidak Pernah/i;
      labelText = 'Tidak Pernah';
    } else if (score === 1) {
      pattern = /^1\s+Kadang-kadang/i;
      labelText = 'Kadang-kadang';
    } else if (score === 3) {
      pattern = /^3\s+Sangat Sering/i;
      labelText = 'Sangat Sering';
    }

    const optionBtn = studentPage.getByRole('button', { name: pattern });
    const delay = i < 3 ? 500 : 120;
    await studentRecorder.moveAndClick(studentPage, optionBtn, `DASS-21 Q${i + 1} (${labelText})`, delay);
  }

  const submitDassBtn = studentPage.getByRole('button', { name: /Lihat Hasil Analisis/i });
  await submitDassBtn.waitFor({ state: 'visible', timeout: 5000 });
  await studentRecorder.moveAndClick(studentPage, submitDassBtn, 'Submit DASS-21 Assessment', 2200);

  // 4. Asesmen Mandiri: Gaya Belajar VAK
  const vakTabBtn = studentPage.getByRole('button', { name: '2. Gaya Belajar (VAK)' });
  await studentRecorder.moveAndClick(studentPage, vakTabBtn, 'Switch to VAK Subtab', 800);

  console.log('[VAK] Answering 12 scenarios...');
  for (let i = 0; i < 12; i++) {
    const choice = VAK_CHOICES[i];
    const optIndex = choice === 'visual' ? 0 : choice === 'auditory' ? 1 : 2;
    const optionCards = studentPage.locator('div.space-y-3 > button');
    const targetCard = optionCards.nth(optIndex);

    const delay = i < 2 ? 600 : 120;
    await studentRecorder.moveAndClick(studentPage, targetCard, `VAK Skenario ${i + 1} (${choice})`, delay);
  }

  const submitVakBtn = studentPage.getByRole('button', { name: /Lihat Profil Gaya Belajar/i });
  await submitVakBtn.waitFor({ state: 'visible', timeout: 5000 });
  await studentRecorder.moveAndClick(studentPage, submitVakBtn, 'Submit VAK Questionnaire', 2200);

  // 5. Curhat Refleksi & Mood Tracker
  const moodNav = studentPage.getByRole('button', { name: 'Curhat Refleksi' }).first();
  await studentRecorder.moveAndClick(studentPage, moodNav, 'Navigate to Curhat Refleksi', 800);

  // Click Icebreaker Pill
  const icebreakerBtn = studentPage.getByRole('button', { name: /Saya merasa sangat lelah/i });
  await studentRecorder.moveAndClick(studentPage, icebreakerBtn, 'Click Icebreaker Pill', 400);

  // Type additional narrative into textarea
  const textarea = studentPage.locator('textarea');
  await studentRecorder.moveAndType(
    studentPage,
    textarea,
    ' Minggu ini pekerjaan kantor sedang tutup buku, sementara tugas tutorial harus selesai besok malam. Kepala rasanya penuh.',
    'Curhat Textarea',
    25,
  );

  const submitMoodBtn = studentPage.getByRole('button', { name: /Kirim & Resapi Refleksi/i });
  await studentRecorder.moveAndClick(studentPage, submitMoodBtn, 'Submit Mood Narrative', 2000);

  // 6. Buka Tiket Pra-Konseling dari Dashboard
  const dashNav = studentPage.getByRole('button', { name: 'Dashboard' }).first();
  await studentRecorder.moveAndClick(studentPage, dashNav, 'Return to Student Dashboard', 800);

  const openTicketBtn = studentPage.getByRole('button', { name: /Buka Tiket Pra-Konseling/i });
  await studentRecorder.moveAndClick(studentPage, openTicketBtn, 'Open Pra-Counseling Ticket', 2000);

  // Save student telemetry
  studentRecorder.saveTelemetry('telemetry-student.json');
  console.log('[POV Mahasiswa] Primary workflow recorded.');

  // ----------------------------------------------------
  // PART 2: RECORD POV KONSELOR
  // ----------------------------------------------------
  console.log('\n--- Capturing Scene 2: POV Konselor ---');
  const counselorContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: RAW_DIR,
      size: { width: 1920, height: 1080 },
    },
  });

  const counselorPage = await counselorContext.newPage();
  const counselorRecorder = new VideoCursorRecorder(RAW_DIR);
  await counselorRecorder.setupPageCursor(counselorPage);

  counselorRecorder.resetClock();
  await counselorPage.goto(`${BASE_URL}/?sandbox_key=safespace-evaluator-2026`);
  await counselorPage.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('safespace_sandbox_unlocked', 'true');
  });
  await counselorPage.goto(`${BASE_URL}/#/auth`);
  await counselorPage.waitForLoadState('networkidle');

  // Login as Counselor
  const counselorLoginBtn = counselorPage.getByRole('button', { name: /^Konselor$/i });
  await counselorLoginBtn.waitFor({ state: 'visible', timeout: 5000 });
  await counselorRecorder.moveAndClick(counselorPage, counselorLoginBtn, 'Login as Konselor', 1200);

  // Lands on CounselorQueue
  await counselorPage.waitForURL(/.*konselor\/antrean/);
  await counselorPage.waitForTimeout(1000);

  // Highlight attached profile cards
  const queueCards = counselorPage.locator('div.grid > div');
  await queueCards.first().waitFor({ state: 'visible', timeout: 5000 });
  await counselorRecorder.hover(counselorPage, queueCards.first(), 'Review Student Attached Profile in Queue', 1500);

  // Click "Terima & Masuk Sesi"
  const acceptBtn = counselorPage.getByRole('button', { name: /Terima & Masuk Sesi/i }).first();
  await counselorRecorder.moveAndClick(counselorPage, acceptBtn, 'Accept Ticket & Enter Chatroom', 1500);

  // In Counselor Chatroom: send greeting
  await counselorPage.waitForURL(/.*app\/chat/);
  const counselorChatInput = counselorPage.locator('input[placeholder*="Ketik pesan aman Anda"]');
  await counselorRecorder.moveAndType(
    counselorPage,
    counselorChatInput,
    CHAT_EXCHANGE[0].text,
    'Counselor Greeting Input',
    20,
  );

  const counselorSendBtn = counselorPage.getByRole('button', { name: /Kirim/i });
  await counselorRecorder.moveAndClick(counselorPage, counselorSendBtn, 'Counselor Send Message', 1200);

  // ----------------------------------------------------
  // PART 3: DUAL CONVERSATION IN CHATROOM
  // ----------------------------------------------------
  console.log('\n--- Capturing Scene 3: Two-Way Chat Exchange ---');
  // Student enters chatroom from their dashboard
  const enterChatBtn = studentPage.getByRole('button', { name: /Buka Ruang Konseling/i }).first();
  if (await enterChatBtn.isVisible()) {
    await studentRecorder.moveAndClick(studentPage, enterChatBtn, 'Student Enter Chatroom', 1200);
  } else {
    await studentPage.goto(`${BASE_URL}/#/app/chat`);
    await studentPage.waitForTimeout(1000);
  }

  // Student clicks Pill "Kewalahan tugas"
  const pillKewalahan = studentPage.getByRole('button', { name: 'Kewalahan tugas' });
  await studentRecorder.moveAndClick(studentPage, pillKewalahan, 'Student Click Pill Kewalahan', 400);

  // Fill detailed text and send
  const studentChatInput = studentPage.locator('input[placeholder*="Ketik pesan aman Anda"]');
  await studentChatInput.fill(CHAT_EXCHANGE[1].text);
  const studentSendBtn = studentPage.getByRole('button', { name: /Kirim/i });
  await studentRecorder.moveAndClick(studentPage, studentSendBtn, 'Student Send Response', 1200);

  // Counselor replies with VAK Pomodoro insight
  await counselorPage.waitForTimeout(1000);
  await counselorRecorder.moveAndType(
    counselorPage,
    counselorChatInput,
    CHAT_EXCHANGE[2].text,
    'Counselor VAK Recommendation',
    18,
  );
  await counselorRecorder.moveAndClick(counselorPage, counselorSendBtn, 'Counselor Send VAK Advice', 1200);

  // Student asks for rhythm recommendation
  await studentPage.waitForTimeout(1000);
  const pillRekomendasi = studentPage.getByRole('button', { name: 'Rekomendasi ritme belajar' });
  await studentRecorder.moveAndClick(studentPage, pillRekomendasi, 'Student Click Pill Rekomendasi', 400);
  await studentRecorder.moveAndClick(studentPage, studentSendBtn, 'Student Send Query', 1200);

  // Counselor delivers tactical plan
  await counselorPage.waitForTimeout(1000);
  await counselorRecorder.moveAndType(
    counselorPage,
    counselorChatInput,
    CHAT_EXCHANGE[4].text,
    'Counselor Pomodoro Plan',
    18,
  );
  await counselorRecorder.moveAndClick(counselorPage, counselorSendBtn, 'Counselor Send Plan', 1200);

  // Student thanks counselor
  await studentPage.waitForTimeout(1000);
  const pillTerimaKasih = studentPage.getByRole('button', { name: 'Terima kasih' });
  await studentRecorder.moveAndClick(studentPage, pillTerimaKasih, 'Student Click Pill Terima Kasih', 400);
  await studentChatInput.fill(CHAT_EXCHANGE[5].text);
  await studentRecorder.moveAndClick(studentPage, studentSendBtn, 'Student Send Closing', 1200);

  // Emergency Safe Exit demonstration at the end
  console.log('\n--- Capturing Scene 4: Emergency Safe Exit Demonstration ---');
  const studentSafeExit = studentPage.getByRole('button', { name: /Safe Exit/i });
  await studentRecorder.moveAndClick(studentPage, studentSafeExit, 'Trigger Safe Exit Emergency Redirect', 1500);

  // Give a moment for Google redirect animation
  await studentPage.waitForTimeout(1500);

  counselorRecorder.saveTelemetry('telemetry-counselor.json');

  // Close contexts cleanly so Playwright saves and flushes the video files
  await studentContext.close();
  await counselorContext.close();
  await browser.close();

  console.log('\n=== Dual-POV Studio Capture Completed Successfully! ===');
}

runDualPOVRecording().catch((err) => {
  console.error('Recording error:', err);
  process.exit(1);
});
