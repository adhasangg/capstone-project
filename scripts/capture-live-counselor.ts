import { chromium } from 'playwright';
import * as path from 'path';

const BASE_URL = 'http://localhost:5173';
const OUT_DIR = path.resolve('D:/ijplabs/capstone/docs/videos/brand-promo-mahasiswa/app-screens');

async function captureCounselorAndChat() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1240, height: 720 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // 1. Login as Student, create ticket with DASS-21
  await page.goto(`${BASE_URL}/?sandbox_key=safespace-evaluator-2026`);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('safespace_sandbox_unlocked', 'true');
  });
  await page.goto(`${BASE_URL}/#/auth`);
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /^Mahasiswa$/i }).click();
  await page.waitForTimeout(800);

  // Complete DASS-21
  await page.goto(`${BASE_URL}/#/app/asesmen`);
  await page.waitForTimeout(500);
  for (let i = 0; i < 21; i++) {
    const score = i % 3 === 0 ? 2 : 1;
    const btn = page.getByRole('button', { name: score === 2 ? /^2\s+Sering/i : /^1\s+Kadang/i });
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(40);
    }
  }
  const submitDassBtn = page.getByRole('button', { name: /Lihat Hasil Analisis/i });
  if (await submitDassBtn.isVisible()) {
    await submitDassBtn.click();
    await page.waitForTimeout(600);
  }

  // Open Ticket
  await page.goto(`${BASE_URL}/#/app/dashboard`);
  await page.waitForTimeout(600);
  const openTicketBtn = page.getByRole('button', { name: /Buka Tiket Pra-Konseling/i });
  if (await openTicketBtn.isVisible()) {
    await openTicketBtn.click();
    await page.waitForTimeout(1000);
  }

  // 2. Switch to Counselor
  await page.goto(`${BASE_URL}/#/auth`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /^Konselor$/i }).click();
  await page.waitForTimeout(1000);

  // Triage queue
  await page.goto(`${BASE_URL}/#/konselor/antrean`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '07_counselor_triage.png') });
  console.log('Captured 07_counselor_triage.png with live tickets!');

  // Accept Ticket & enter Chat
  const acceptBtn = page.getByRole('button', { name: /Terima & Masuk Sesi/i }).first();
  if (await acceptBtn.isVisible({ timeout: 4000 })) {
    await acceptBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, '08_e2ee_chat.png') });
    console.log('Captured 08_e2ee_chat.png with live chat room!');
  }

  await browser.close();
}
captureCounselorAndChat();
