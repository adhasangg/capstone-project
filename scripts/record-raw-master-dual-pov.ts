import { chromium, type Page, type Locator, type Browser } from 'playwright';
import { execSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.resolve(__dirname, '../../docs/videos/raw-footage');
const QA_DIR = path.resolve(__dirname, '../../docs/videos/raw-footage/qa-frames');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(QA_DIR, { recursive: true });

export class MasterRawRecorder {
  private currentX = 960;
  private currentY = 540;

  async setupPage(page: Page) {
    await page.addInitScript(() => {
      const init = () => {
        // 1. Main Camera Transition
        const mainEl = document.querySelector('main');
        if (mainEl) {
          mainEl.style.transformOrigin = '50% 120px';
          mainEl.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        }

        // 2. Virtual Cursor
        if (!document.getElementById('virtual-mouse-cursor')) {
          const cursor = document.createElement('div');
          cursor.id = 'virtual-mouse-cursor';
          cursor.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 6px rgba(0,0,0,0.45));">
              <path d="M4 2L11 20L14 13L21 10L4 2Z" fill="#0F172A" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          `;
          cursor.style.position = 'fixed';
          cursor.style.top = '0px';
          cursor.style.left = '0px';
          cursor.style.pointerEvents = 'none';
          cursor.style.zIndex = '999999';
          cursor.style.transform = 'translate3d(960px, 540px, 0)';
          cursor.style.transition = 'transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1)';
          document.documentElement.appendChild(cursor);
        }

        // 3. Click Ripple Container
        if (!document.getElementById('virtual-click-ripple-container')) {
          const rippleContainer = document.createElement('div');
          rippleContainer.id = 'virtual-click-ripple-container';
          rippleContainer.style.position = 'fixed';
          rippleContainer.style.top = '0px';
          rippleContainer.style.left = '0px';
          rippleContainer.style.pointerEvents = 'none';
          rippleContainer.style.zIndex = '999998';
          document.documentElement.appendChild(rippleContainer);

          (window as any).__showClickRipple = (x: number, y: number) => {
            const ring = document.createElement('div');
            ring.style.position = 'absolute';
            ring.style.left = `${x - 22}px`;
            ring.style.top = `${y - 22}px`;
            ring.style.width = '44px';
            ring.style.height = '44px';
            ring.style.borderRadius = '50%';
            ring.style.border = '3px solid #4A7C59';
            ring.style.backgroundColor = 'rgba(74, 124, 89, 0.28)';
            ring.style.boxShadow = '0 0 16px rgba(74, 124, 89, 0.75)';
            ring.style.animation = 'masterClickRipple 0.5s cubic-bezier(0.1, 0.8, 0.2, 1) forwards';
            rippleContainer.appendChild(ring);

            setTimeout(() => ring.remove(), 550);
          };

          const style = document.createElement('style');
          style.innerHTML = `
            @keyframes masterClickRipple {
              0% { transform: scale(0.3); opacity: 1; }
              100% { transform: scale(1.6); opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }

        // 4. Global Camera Controller targeting <main>
        (window as any).__camera = {
          scale: 1,
          ty: 0,
          zoomTo(targetX: number, targetY: number, scale: number = 1.25) {
            const m = document.querySelector('main');
            if (!m) return;
            this.scale = scale;
            const offset = (500 - targetY) * 0.35;
            this.ty = Math.max(-80, Math.min(40, offset));
            m.style.transformOrigin = '50% 120px';
            m.style.transform = `scale(${this.scale}) translateY(${this.ty}px)`;
          },
          reset() {
            const m = document.querySelector('main');
            if (!m) return;
            this.scale = 1;
            this.ty = 0;
            m.style.transformOrigin = '50% 120px';
            m.style.transform = 'scale(1) translateY(0px)';
          }
        };
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    });
  }

  async ensureCameraReady(page: Page) {
    await page.evaluate(() => {
      const m = document.querySelector('main');
      if (m && !m.style.transition) {
        m.style.transformOrigin = '50% 120px';
        m.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      }
      if (!(window as any).__camera) {
        (window as any).__camera = {
          scale: 1,
          ty: 0,
          zoomTo(targetX: number, targetY: number, scale: number = 1.25) {
            const el = document.querySelector('main');
            if (!el) return;
            this.scale = scale;
            const offset = (500 - targetY) * 0.35;
            this.ty = Math.max(-80, Math.min(40, offset));
            el.style.transformOrigin = '50% 120px';
            el.style.transform = `scale(${this.scale}) translateY(${this.ty}px)`;
          },
          reset() {
            const el = document.querySelector('main');
            if (!el) return;
            this.scale = 1;
            this.ty = 0;
            el.style.transformOrigin = '50% 120px';
            el.style.transform = 'scale(1) translateY(0px)';
          }
        };
      }
    }).catch(() => {});
  }

  async zoomReset(page: Page, waitMs: number = 700) {
    await this.ensureCameraReady(page);
    await page.evaluate(() => {
      if ((window as any).__camera) (window as any).__camera.reset();
    }).catch(() => {});
    if (waitMs > 0) await page.waitForTimeout(waitMs);
  }

  async zoomToElement(page: Page, locator: Locator, scale: number = 1.25, waitMs: number = 700) {
    await this.ensureCameraReady(page);
    try {
      await locator.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
      const box = await locator.boundingBox();
      if (box) {
        const rawCx = box.x + box.width / 2;
        const rawCy = box.y + box.height / 2;

        await page.evaluate(({ cx, cy, scale }) => {
          if ((window as any).__camera) (window as any).__camera.zoomTo(cx, cy, scale);
        }, { cx: rawCx, cy: rawCy, scale }).catch(() => {});

        if (waitMs > 0) await page.waitForTimeout(waitMs);
      }
    } catch {}
  }

  async moveCursor(page: Page, targetX: number, targetY: number, dwellMs: number = 250) {
    this.currentX = targetX;
    this.currentY = targetY;
    await page.evaluate(({ x, y }) => {
      const cursor = document.getElementById('virtual-mouse-cursor');
      if (cursor) cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, { x: targetX, y: targetY }).catch(() => {});
    if (dwellMs > 0) await page.waitForTimeout(dwellMs);
  }

  async hover(page: Page, locator: Locator, label: string, dwellMs: number = 500) {
    try {
      const box = await locator.boundingBox();
      if (box) {
        const tx = Math.round(box.x + box.width / 2);
        const ty = Math.round(box.y + box.height / 2);
        await this.moveCursor(page, tx, ty, dwellMs);
      }
    } catch {}
  }

  async focusAndClick(
    page: Page,
    locator: Locator,
    label: string,
    options: { zoom?: number; delayBefore?: number; delayAfter?: number } = {}
  ) {
    const { zoom, delayBefore = 220, delayAfter = 600 } = options;

    if (zoom) {
      await this.zoomToElement(page, locator, zoom, 650);
    }

    try {
      const box = await locator.boundingBox();
      if (box) {
        const tx = Math.round(box.x + box.width / 2);
        const ty = Math.round(box.y + box.height / 2);
        await this.moveCursor(page, tx, ty, delayBefore);

        // Trigger Click Ripple
        await page.evaluate(({ x, y }) => {
          if ((window as any).__showClickRipple) (window as any).__showClickRipple(x, y);
        }, { x: tx, y: ty }).catch(() => {});
      }

      await locator.click({ force: true });
    } catch {
      await locator.click({ force: true }).catch(() => {});
    }

    if (delayAfter > 0) await page.waitForTimeout(delayAfter);
  }

  async focusAndType(
    page: Page,
    locator: Locator,
    text: string,
    label: string,
    options: { zoom?: number; charDelay?: number; delayAfter?: number } = {}
  ) {
    const { zoom, charDelay = 25, delayAfter = 400 } = options;
    await this.focusAndClick(page, locator, `Focus ${label}`, { zoom, delayAfter: 200 });
    await locator.pressSequentially(text, { delay: charDelay });
    if (delayAfter > 0) await page.waitForTimeout(delayAfter);
  }
}

function extractFrameSafe(videoPath: string, ss: number, outPath: string) {
  try {
    execSync(`ffmpeg -y -ss ${ss} -i "${videoPath}" -frames:v 1 "${outPath}" -loglevel error`);
  } catch (e) {
    console.warn(`[QA] Could not extract frame at ${ss}s from ${path.basename(videoPath)}`);
  }
}

// -----------------------------------------------------------------
// Transcode raw WebM to Master H.264 MP4 with 60fps & Unsharp Filter
// -----------------------------------------------------------------
function exportMasterVideo(rawWebmPath: string, outMp4Path: string) {
  console.log(`[Export] Transcoding ${path.basename(rawWebmPath)} -> ${path.basename(outMp4Path)} (1080p 60fps, High-Bitrate Unsharp)...`);
  const cmd = `ffmpeg -y -i "${rawWebmPath}" -vf "unsharp=5:5:0.7:5:5:0.3,fps=60" -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p "${outMp4Path}" -loglevel error`;
  execSync(cmd, { stdio: 'inherit' });
  console.log(`[Success] Master Video created at: ${outMp4Path}`);
}

// =================================================================
// 1. POV MAHASISWA RECORDING
// =================================================================
async function recordStudentPOV(browser: Browser): Promise<string> {
  console.log('\n======================================================');
  console.log('--- RECORDING POV MAHASISWA (MASTER RAW WALKTHROUGH) ---');
  console.log('======================================================');

  const studentRawDir = path.join(OUTPUT_DIR, 'tmp_student_raw');
  fs.mkdirSync(studentRawDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: studentRawDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();
  const rec = new MasterRawRecorder();
  await rec.setupPage(page);

  // 1. Landing Page
  console.log('[Student] 1. Opening Landing Page...');
  await page.goto(`${BASE_URL}/?sandbox_key=safespace-evaluator-2026`);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('safespace_sandbox_unlocked', 'true');
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Inspect Navbar & Safe Exit Button
  const safeExitBtn = page.getByRole('button', { name: /Safe Exit/i });
  await rec.hover(page, safeExitBtn, 'Safe Exit Button in Navbar', 800);

  // Focus & Click Masuk / Mulai Konsultasi
  const primaryCta = page.getByRole('button', { name: /Masuk \/ Mulai Konsultasi/i });
  await rec.focusAndClick(page, primaryCta, 'Masuk / Mulai Konsultasi', { zoom: 1.25, delayAfter: 800 });

  // 2. Auth Page (Google / Sandbox Evaluator)
  console.log('[Student] 2. Logging in as Mahasiswa...');
  await page.waitForURL(/.*auth/);
  await rec.zoomReset(page, 400);

  const studentLoginBtn = page.getByRole('button', { name: /^Mahasiswa$/i });
  await studentLoginBtn.waitFor({ state: 'visible', timeout: 5000 });
  await rec.focusAndClick(page, studentLoginBtn, 'Login as Mahasiswa', { zoom: 1.28, delayAfter: 1200 });

  // 3. Student Dashboard
  console.log('[Student] 3. Viewing Student Dashboard...');
  await page.waitForTimeout(1000);
  await rec.zoomReset(page, 400);

  // Navigate to Asesmen Mandiri
  const assessmentNav = page.getByRole('button', { name: 'Asesmen Mandiri' }).first();
  await rec.focusAndClick(page, assessmentNav, 'Menu Asesmen Mandiri', { zoom: 1.22, delayAfter: 800 });

  // 4. DASS-21 Questionnaire
  console.log('[Student] 4. Filling DASS-21 21 Items...');
  await page.waitForTimeout(600);

  // Focus on questionnaire card
  const qCard = page.locator('div.max-w-2xl').first();
  await rec.zoomToElement(page, qCard, 1.25, 600);

  // 21 Lovibond items (0: Tidak Pernah, 1: Kadang, 2: Sering, 3: Sangat Sering)
  const DASS_CHOICES = [2, 1, 1, 1, 2, 2, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1];
  for (let i = 0; i < 21; i++) {
    const score = DASS_CHOICES[i];
    console.log(`[Student] Answering DASS-21 Q${i + 1}/21...`);
    const btns = page.locator('div.grid.grid-cols-1.sm\\:grid-cols-2 > button');
    const optBtn = btns.nth(score);
    await rec.focusAndClick(page, optBtn, `DASS-21 Q${i + 1} (Score ${score})`, { delayBefore: i < 2 ? 150 : 50, delayAfter: i < 2 ? 300 : 80 });

    if (i < 20) {
      const advanced = await page.waitForFunction((nextQ) => {
        const el = document.querySelector('span.font-mono');
        return el?.textContent?.includes(`Butir ${nextQ} / 21`);
      }, i + 2, { timeout: 1200 }).catch(() => false);

      if (!advanced) {
        await optBtn.evaluate((b) => (b as HTMLButtonElement).click()).catch(() => {});
        await page.waitForTimeout(200);
      }
    }
  }

  // Submit DASS-21
  const submitDassBtn = page.getByRole('button', { name: /Lihat Hasil Analisis/i });
  await submitDassBtn.waitFor({ state: 'visible', timeout: 8000 });
  await rec.focusAndClick(page, submitDassBtn, 'Lihat Hasil Analisis DASS-21', { zoom: 1.25, delayAfter: 2000 });

  // Hold on DASS-21 Lovibond Result Card for viewer reading
  console.log('[Student] Displaying DASS-21 Lovibond Results...');
  await page.waitForTimeout(2500);

  // 5. VAK Learning Style Questionnaire
  console.log('[Student] 5. Switching to VAK Questionnaire...');
  const vakTabBtn = page.getByRole('button', { name: '2. Gaya Belajar (VAK)' });
  await rec.focusAndClick(page, vakTabBtn, 'Subtab 2. Gaya Belajar (VAK)', { zoom: 1.22, delayAfter: 800 });

  console.log('[Student] Filling 12 VAK Learning Scenarios...');
  // Multi-modal distribution: 4 Visual, 4 Auditory, 4 Kinesthetic
  for (let q = 0; q < 12; q++) {
    const choiceIdx = q % 3; // 0: Visual, 1: Auditory, 2: Kinesthetic
    console.log(`[Student] Answering VAK Skenario ${q + 1}/12...`);
    const targetCard = page.locator('button.w-full.text-left').nth(choiceIdx);
    await rec.focusAndClick(page, targetCard, `VAK Skenario ${q + 1}`, { delayBefore: q < 2 ? 150 : 50, delayAfter: q < 2 ? 300 : 80 });

    if (q < 11) {
      const advanced = await page.waitForFunction((nextQ) => {
        const el = document.querySelector('span.font-mono');
        return el?.textContent?.includes(`Skenario ${nextQ} / 12`);
      }, q + 2, { timeout: 1200 }).catch(() => false);

      if (!advanced) {
        await targetCard.evaluate((b) => (b as HTMLButtonElement).click()).catch(() => {});
        await page.waitForTimeout(200);
      }
    }
  }

  // Submit VAK Questionnaire
  const submitVakBtn = page.getByRole('button', { name: /Lihat Profil Gaya Belajar/i });
  await submitVakBtn.waitFor({ state: 'visible', timeout: 8000 });
  await rec.focusAndClick(page, submitVakBtn, 'Lihat Profil Gaya Belajar VAK', { zoom: 1.25, delayAfter: 2000 });

  // Hold on VAK Fleming 3-Bar Result Card
  console.log('[Student] Displaying VAK Multimodal Results...');
  await page.waitForTimeout(2500);

  // 6. Curhat Refleksi & Mood Narrative
  console.log('[Student] 6. Navigating to Curhat Refleksi...');
  const moodNav = page.getByRole('button', { name: 'Curhat Refleksi' }).first();
  await rec.focusAndClick(page, moodNav, 'Menu Curhat Refleksi', { zoom: 1.22, delayAfter: 800 });

  // Click Icebreaker Pill
  const icebreakerBtn = page.getByRole('button', { name: /Saya merasa sangat lelah/i });
  await rec.focusAndClick(page, icebreakerBtn, 'Pill Mood Refleksi', { zoom: 1.25, delayAfter: 500 });

  // Type Narrative
  const textarea = page.locator('textarea');
  await rec.focusAndType(
    page,
    textarea,
    ' Minggu ini pekerjaan kantor sedang tutup buku, sementara tugas tutorial harus selesai besok malam. Kepala rasanya penuh.',
    'Curhat Textarea',
    { zoom: 1.25, charDelay: 25, delayAfter: 600 }
  );

  // Submit Mood Narrative
  const submitMoodBtn = page.getByRole('button', { name: /Kirim & Resapi Refleksi/i });
  await rec.focusAndClick(page, submitMoodBtn, 'Kirim & Resapi Refleksi', { delayAfter: 2000 });

  // 7. Buka Tiket Pra-Konseling dari Dashboard
  console.log('[Student] 7. Returning to Dashboard & Creating Ticket...');
  const dashNav = page.getByRole('button', { name: 'Dashboard' }).first();
  await rec.focusAndClick(page, dashNav, 'Kembali ke Dashboard', { zoom: 1.22, delayAfter: 800 });

  // Open Ticket
  const openTicketBtn = page.getByRole('button', { name: /Buka Tiket Pra-Konseling/i });
  await rec.focusAndClick(page, openTicketBtn, 'Buka Tiket Pra-Konseling', { zoom: 1.25, delayAfter: 1500 });

  // 8. Masuk ke Ruang Chat Mahasiswa
  console.log('[Student] 8. Entering Encrypted Chatroom...');
  const enterChatBtn = page.getByRole('button', { name: /Buka Chatroom/i }).first();
  if (await enterChatBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await rec.focusAndClick(page, enterChatBtn, 'Buka Chatroom', { zoom: 1.22, delayAfter: 1200 });
  } else {
    await page.goto(`${BASE_URL}/#/app/chat`);
    await page.waitForTimeout(1000);
  }

  // Zoom into chatroom and send student message
  const chatInput = page.locator('input[placeholder*="Ketik pesan aman Anda"]');
  const pillKewalahan = page.getByRole('button', { name: 'Kewalahan tugas' });
  if (await pillKewalahan.isVisible({ timeout: 3000 }).catch(() => false)) {
    await rec.focusAndClick(page, pillKewalahan, 'Pill Kewalahan Tugas', { zoom: 1.22, delayAfter: 400 });
  } else {
    await chatInput.fill('Halo konselor, belakangan ini saya merasa sulit membagi waktu antara pekerjaan kantor dan tenggat tutorial UT.');
  }

  const sendBtn = page.getByRole('button', { name: /Kirim/i });
  await rec.focusAndClick(page, sendBtn, 'Kirim Pesan Mahasiswa', { delayAfter: 2500 });

  // Hold chatroom for clear reading
  await page.waitForTimeout(2500);
  await rec.zoomReset(page, 700);

  // Close context to finalize video recording
  await context.close();

  // Find saved WebM
  const files = fs.readdirSync(studentRawDir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) throw new Error('No student video recorded!');
  const rawWebm = path.join(studentRawDir, files[0]);
  console.log(`[Student] Raw WebM captured: ${rawWebm}`);
  return rawWebm;
}

// =================================================================
// 2. POV KONSELOR RECORDING
// =================================================================
async function recordCounselorPOV(browser: Browser): Promise<string> {
  console.log('\n======================================================');
  console.log('--- RECORDING POV KONSELOR (MASTER RAW WALKTHROUGH) ---');
  console.log('======================================================');

  const counselorRawDir = path.join(OUTPUT_DIR, 'tmp_counselor_raw');
  fs.mkdirSync(counselorRawDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: counselorRawDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();
  const rec = new MasterRawRecorder();
  await rec.setupPage(page);

  // 1. Auth Page
  console.log('[Counselor] 1. Opening Auth Page & Logging in...');
  await page.goto(`${BASE_URL}/?sandbox_key=safespace-evaluator-2026`);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('safespace_sandbox_unlocked', 'true');
  });
  await page.goto(`${BASE_URL}/#/auth`);
  await page.waitForLoadState('networkidle');

  // Zoom into Login Card & Click Konselor
  const counselorLoginBtn = page.getByRole('button', { name: /^Konselor$/i });
  await counselorLoginBtn.waitFor({ state: 'visible', timeout: 5000 });
  await rec.focusAndClick(page, counselorLoginBtn, 'Login as Konselor', { zoom: 1.25, delayAfter: 1200 });

  // 2. Triage Queue
  console.log('[Counselor] 2. Viewing Counselor Triage Queue...');
  await page.waitForURL(/.*konselor\/antrean/);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await rec.zoomReset(page, 400);

  // Inspect student ticket card in queue
  const queueCards = page.locator('div.bg-white.rounded-2xl.border');
  if (await queueCards.first().isVisible({ timeout: 5000 }).catch(() => false)) {
    await rec.zoomToElement(page, queueCards.first(), 1.25, 700);
    await rec.hover(page, queueCards.first(), 'Review Student Attached Profil DASS-21 & VAK', 1800);

    const acceptBtn = page.getByRole('button', { name: /Terima & Masuk Sesi/i }).first();
    if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await rec.focusAndClick(page, acceptBtn, 'Terima & Masuk Sesi', { zoom: 1.25, delayAfter: 1500 });
    }
  }

  // 3. Ruang Chat Pendampingan Konselor
  console.log('[Counselor] 3. Entering Counselor Chatroom...');
  if (!page.url().includes('chat')) {
    const activeChatBtn = page.getByRole('button', { name: /Buka Sesi|Masuk Sesi|Buka Chatroom/i }).first();
    if (await activeChatBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await rec.focusAndClick(page, activeChatBtn, 'Masuk Sesi Chat', { zoom: 1.22, delayAfter: 1200 });
    } else {
      await page.goto(`${BASE_URL}/#/app/chat`);
    }
  }
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);

  // Zoom into chat interface
  const chatInput = page.locator('input[placeholder*="Ketik pesan aman Anda"]');
  await rec.zoomToElement(page, chatInput, 1.2, 700);

  // Type empathetic counselor response
  await rec.focusAndType(
    page,
    chatInput,
    'Halo rekan mahasiswa. Terima kasih sudah berbagi. Beban ganda antara pekerjaan dan tugas kuliah memang sangat menguras energi. Mari kita urai bersama secara bertahap.',
    'Counselor Response',
    { charDelay: 22, delayAfter: 600 }
  );

  // Click Kirim
  const sendBtn = page.getByRole('button', { name: /Kirim/i });
  await rec.focusAndClick(page, sendBtn, 'Kirim Pesan Konselor', { delayAfter: 2000 });

  // Hover over quick assistance pills
  const pillRekomendasi = page.getByRole('button', { name: 'Rekomendasi ritme belajar' });
  if (await pillRekomendasi.isVisible({ timeout: 2000 }).catch(() => false)) {
    await rec.hover(page, pillRekomendasi, 'Pill Rekomendasi Ritme Belajar', 1200);
  }

  // Hold chatroom for clear viewing
  await page.waitForTimeout(3000);
  await rec.zoomReset(page, 700);

  // Close context to finalize video
  await context.close();

  const files = fs.readdirSync(counselorRawDir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) throw new Error('No counselor video recorded!');
  const rawWebm = path.join(counselorRawDir, files[0]);
  console.log(`[Counselor] Raw WebM captured: ${rawWebm}`);
  return rawWebm;
}

// =================================================================
// MAIN ORCHESTRATOR
// =================================================================
async function main() {
  console.log('=== Starting Master Raw Site Recordings with Cursor & Zoom Focus Click ===');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  });

  try {
    // 1. Record POV Mahasiswa
    const rawStudentWebm = await recordStudentPOV(browser);
    const masterStudentMp4 = path.join(OUTPUT_DIR, 'safespace-raw-master-pov-mahasiswa.mp4');
    exportMasterVideo(rawStudentWebm, masterStudentMp4);

    // Extract QA Preview Frames for Mahasiswa
    console.log('[QA] Extracting QA verification frames for POV Mahasiswa...');
    extractFrameSafe(masterStudentMp4, 2.0, path.join(QA_DIR, 'qa_mahasiswa_01_landing.png'));
    extractFrameSafe(masterStudentMp4, 5.0, path.join(QA_DIR, 'qa_mahasiswa_02_auth.png'));
    extractFrameSafe(masterStudentMp4, 10.0, path.join(QA_DIR, 'qa_mahasiswa_03_dass_form.png'));
    extractFrameSafe(masterStudentMp4, 18.0, path.join(QA_DIR, 'qa_mahasiswa_04_dass_res.png'));
    extractFrameSafe(masterStudentMp4, 25.0, path.join(QA_DIR, 'qa_mahasiswa_05_vak_res.png'));
    extractFrameSafe(masterStudentMp4, 32.0, path.join(QA_DIR, 'qa_mahasiswa_06_mood.png'));
    extractFrameSafe(masterStudentMp4, 42.0, path.join(QA_DIR, 'qa_mahasiswa_07_chat.png'));

    // 2. Record POV Konselor
    const rawCounselorWebm = await recordCounselorPOV(browser);
    const masterCounselorMp4 = path.join(OUTPUT_DIR, 'safespace-raw-master-pov-konselor.mp4');
    exportMasterVideo(rawCounselorWebm, masterCounselorMp4);

    // Extract QA Preview Frames for Konselor
    console.log('[QA] Extracting QA verification frames for POV Konselor...');
    extractFrameSafe(masterCounselorMp4, 2.0, path.join(QA_DIR, 'qa_konselor_01_auth.png'));
    extractFrameSafe(masterCounselorMp4, 6.0, path.join(QA_DIR, 'qa_konselor_02_triage_queue.png'));
    extractFrameSafe(masterCounselorMp4, 12.0, path.join(QA_DIR, 'qa_konselor_03_chat.png'));

    console.log('\n=== ALL MASTER RAW RECORDINGS COMPLETED SUCCESSFULLY! ===');
    console.log(`1. POV Mahasiswa: ${masterStudentMp4}`);
    console.log(`2. POV Konselor: ${masterCounselorMp4}`);
  } finally {
    await browser.close();
  }
}

if (import.meta.main) {
  main().catch(err => {
    console.error('Fatal error during recording:', err);
    process.exit(1);
  });
}
