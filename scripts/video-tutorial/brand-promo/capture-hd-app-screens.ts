import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:5173';
const OUT_DIR = path.resolve(__dirname, '../../../docs/videos/brand-promo-mahasiswa/app-screens');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function captureHDScreenshots() {
  console.log('=== Capturing Crisp Focused Retina (1240x720 @ 2x DPR) Screenshots from SafeSpace PWA ===');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1240, height: 720 },
    deviceScaleFactor: 2, // Ultra-sharp 2480x1440 physical resolution
  });

  const page = await context.newPage();

  // 1. Landing Page
  console.log('[1/8] Capturing Landing Page...');
  await page.goto(`${BASE_URL}/`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT_DIR, '02_landing_page.png') });

  // 2. Auth Page (Sandbox Mode unlocked)
  console.log('[2/8] Unlocking sandbox & capturing Auth...');
  await page.goto(`${BASE_URL}/?sandbox_key=safespace-evaluator-2026`);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('safespace_sandbox_unlocked', 'true');
  });
  await page.goto(`${BASE_URL}/#/auth`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, '03_auth_page.png') });

  // 3. Login as Mahasiswa & Dashboard
  console.log('[3/8] Logging in as Mahasiswa...');
  const studentBtn = page.getByRole('button', { name: /^Mahasiswa$/i });
  if (await studentBtn.isVisible({ timeout: 5000 })) {
    await studentBtn.click();
    await page.waitForTimeout(1000);
  }

  // Go to Dashboard
  await page.goto(`${BASE_URL}/#/app/dashboard`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT_DIR, '04_student_dashboard.png') });

  // 4. DASS-21 Assessment
  console.log('[4/8] Capturing DASS-21 Assessment Form...');
  await page.goto(`${BASE_URL}/#/app/asesmen`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT_DIR, '05_dass21_wizard.png') });

  // Fill DASS-21 to get Results
  console.log('[5/8] Answering DASS-21 to capture Lovibond Result...');
  for (let i = 0; i < 21; i++) {
    const score = i % 3 === 0 ? 2 : 1;
    const btn = page.getByRole('button', { name: score === 2 ? /^2\s+Sering/i : /^1\s+Kadang/i });
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(70);
    }
  }
  const submitDassBtn = page.getByRole('button', { name: /Lihat Hasil Analisis/i });
  if (await submitDassBtn.isVisible({ timeout: 3000 })) {
    await submitDassBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '05_dass21_result.png') });
  }

  // 5. VAK Assessment Input Form & Result
  console.log('[6/8] Capturing VAK Assessment Form & Results...');
  const vakTabBtn = page.getByRole('button', { name: /Gaya Belajar/i });
  if (await vakTabBtn.isVisible()) {
    await vakTabBtn.click();
    await page.waitForTimeout(600);
  }
  // Capture Question 1 input form
  await page.screenshot({ path: path.join(OUT_DIR, '06_vak_input.png') });

  // Fill VAK (12 questions) with varied choices for realistic multi-modal distribution
  for (let q = 0; q < 12; q++) {
    const choiceIndex = q % 3; // Rotates: 0 (Visual), 1 (Auditory), 2 (Kinesthetic)
    const optionBtns = page.locator('button.w-full.text-left');
    const targetBtn = optionBtns.nth(choiceIndex);
    if (await targetBtn.isVisible()) {
      await targetBtn.click();
      await page.waitForTimeout(100);
    }
  }
  await page.waitForTimeout(500);

  // Click Submit VAK to see the real 3-bar Result Screen
  const submitVakBtn = page.getByRole('button', { name: /Lihat Profil Gaya Belajar/i });
  if (await submitVakBtn.isVisible({ timeout: 2000 })) {
    await submitVakBtn.click();
    await page.waitForTimeout(1000);
  }

  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT_DIR, '06_vak_result.png') });
  await page.screenshot({ path: path.join(OUT_DIR, '06_vak_result_clean.png') });

  // 6. Counselor Queue
  console.log('[7/8] Logging in as Counselor for Triage Queue...');
  await page.goto(`${BASE_URL}/#/auth`);
  await page.waitForLoadState('networkidle');
  const counselorBtn = page.getByRole('button', { name: /^Konselor$/i });
  if (await counselorBtn.isVisible({ timeout: 5000 })) {
    await counselorBtn.click();
    await page.waitForTimeout(1000);
  }
  await page.goto(`${BASE_URL}/#/konselor/antrean`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '07_counselor_triage.png') });

  // 7. Chat Room
  console.log('[8/8] Capturing Encrypted Chat Room...');
  const acceptBtn = page.getByRole('button', { name: /Terima & Masuk Sesi/i }).first();
  if (await acceptBtn.isVisible({ timeout: 2000 })) {
    await acceptBtn.click();
    await page.waitForTimeout(1000);
  } else {
    await page.goto(`${BASE_URL}/#/app/chat`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: path.join(OUT_DIR, '08_e2ee_chat.png') });

  await browser.close();
  console.log('\n=== All Crisp Retina Screenshots Captured Successfully! ===');
}

captureHDScreenshots().catch((err) => {
  console.error('Capture Error:', err);
  process.exit(1);
});
