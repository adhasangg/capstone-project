import { chromium } from '@playwright/test';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { VideoCursorRecorder } from '../cursor-overlay';
import { PROMO_CALLOUTS, PromoCalloutOverlay } from './promo-story-config';

const OVERLAYS_DIR = path.resolve(__dirname, '../../../docs/videos/promo/overlays');
const RAW_DIR = path.resolve(__dirname, '../../../docs/videos/promo/raw');
const PROMO_DIR = path.resolve(__dirname, '../../../docs/videos/promo');

fs.mkdirSync(OVERLAYS_DIR, { recursive: true });
fs.mkdirSync(RAW_DIR, { recursive: true });

function getIconSvg(icon: string): string {
  switch (icon) {
    case 'check':
      return `<div style="width:26px;height:26px;border-radius:50%;background:#DCFCE7;display:flex;align-items:center;justify-content:center;color:#16A34A;font-weight:900;font-size:14px;box-shadow:0 1px 3px rgba(0,0,0,0.08);shrink:0;">✓</div>`;
    case 'cross':
      return `<div style="width:26px;height:26px;border-radius:50%;background:#FEE2E2;display:flex;align-items:center;justify-content:center;color:#DC2626;font-weight:900;font-size:14px;box-shadow:0 1px 3px rgba(0,0,0,0.08);shrink:0;">✕</div>`;
    case 'lock':
      return `<div style="width:26px;height:26px;border-radius:50%;background:#D1FAE5;display:flex;align-items:center;justify-content:center;color:#059669;font-weight:900;font-size:13px;box-shadow:0 1px 3px rgba(0,0,0,0.08);shrink:0;">🔒</div>`;
    case 'shield':
      return `<div style="width:26px;height:26px;border-radius:50%;background:#DBEAFE;display:flex;align-items:center;justify-content:center;color:#2563EB;font-weight:900;font-size:13px;box-shadow:0 1px 3px rgba(0,0,0,0.08);shrink:0;">🛡️</div>`;
    case 'zap':
      return `<div style="width:26px;height:26px;border-radius:50%;background:#FEF3C7;display:flex;align-items:center;justify-content:center;color:#D97706;font-weight:900;font-size:13px;box-shadow:0 1px 3px rgba(0,0,0,0.08);shrink:0;">⚡</div>`;
    case 'chart':
      return `<div style="width:26px;height:26px;border-radius:50%;background:#EDE9FE;display:flex;align-items:center;justify-content:center;color:#7C3AED;font-weight:900;font-size:13px;box-shadow:0 1px 3px rgba(0,0,0,0.08);shrink:0;">📊</div>`;
    case 'alert':
      return `<div style="width:26px;height:26px;border-radius:50%;background:#FFEDD5;display:flex;align-items:center;justify-content:center;color:#EA580C;font-weight:900;font-size:13px;box-shadow:0 1px 3px rgba(0,0,0,0.08);shrink:0;">⚠️</div>`;
    default:
      return `<div style="width:26px;height:26px;border-radius:50%;background:#E2E8F0;display:flex;align-items:center;justify-content:center;color:#334155;font-weight:900;font-size:13px;shrink:0;">•</div>`;
  }
}

function renderCalloutHtml(callout: PromoCalloutOverlay): string {
  let posStyle = '';
  switch (callout.calloutPosition) {
    case 'top-left':
      posStyle = 'top: 60px; left: 70px;';
      break;
    case 'top-right':
      posStyle = 'top: 60px; right: 70px;';
      break;
    case 'bottom-left':
      posStyle = 'bottom: 70px; left: 70px;';
      break;
    case 'bottom-right':
      posStyle = 'bottom: 70px; right: 70px;';
      break;
    case 'center-right':
      posStyle = 'top: 50%; right: 70px; transform: translateY(-50%);';
      break;
    case 'center-left':
      posStyle = 'top: 50%; left: 70px; transform: translateY(-50%);';
      break;
  }

  const badgesHtml = callout.badges
    .map(
      (b) =>
        `<span style="background: rgba(74, 124, 89, 0.12); color: #234B30; border: 1px solid rgba(74, 124, 89, 0.25); font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">${b}</span>`,
    )
    .join('');

  const pointsHtml = callout.points
    .map(
      (p) => `
      <div style="display: flex; align-items: center; gap: 12px; margin-top: 10px;">
        ${getIconSvg(p.icon)}
        <span style="font-size: 15px; font-weight: 600; color: #1E293B; line-height: 1.4;">${p.text}</span>
      </div>
    `,
    )
    .join('');

  let spotlightHtml = '';
  if (callout.highlightBox) {
    const { x, y, width, height } = callout.highlightBox;
    spotlightHtml = `
      <!-- Spotlight Glowing Box -->
      <div style="position: absolute; left: ${x - 6}px; top: ${y - 6}px; width: ${width + 12}px; height: ${height + 12}px; border-radius: 16px; border: 3px solid #4A7C59; box-shadow: 0 0 24px rgba(74, 124, 89, 0.65), inset 0 0 16px rgba(74, 124, 89, 0.2); pointer-events: none;"></div>
      <!-- Soft Pulsing Corner Accent -->
      <div style="position: absolute; left: ${x - 12}px; top: ${y - 12}px; width: 24px; height: 24px; border-top: 4px solid #3B5998; border-left: 4px solid #3B5998; border-top-left-radius: 8px;"></div>
      <div style="position: absolute; left: ${x + width - 12}px; top: ${y + height - 12}px; width: 24px; height: 24px; border-bottom: 4px solid #3B5998; border-right: 4px solid #3B5998; border-bottom-right-radius: 8px;"></div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 1920px;
            height: 1080px;
            background: transparent;
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            overflow: hidden;
            position: relative;
          }
          .glass-card {
            position: absolute;
            ${posStyle}
            max-width: 540px;
            background: rgba(255, 255, 255, 0.94);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1.5px solid rgba(226, 232, 240, 0.95);
            border-radius: 22px;
            box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(15, 23, 42, 0.08);
            padding: 24px 28px;
            z-index: 100;
          }
        </style>
      </head>
      <body>
        ${spotlightHtml}
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #4A7C59; box-shadow: 0 0 8px rgba(74, 124, 89, 0.8);"></div>
              <h3 style="font-size: 19px; font-weight: 800; color: #0F172A; letter-spacing: -0.3px;">${callout.title}</h3>
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${badgesHtml}
            </div>
          </div>
          <div>
            ${pointsHtml}
          </div>
        </div>
      </body>
    </html>
  `;
}

function renderOutroCardHtml(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 1920px;
            height: 1080px;
            background: linear-gradient(135deg, #F8FAF9 0%, #EBF3ED 50%, #E3ECE5 100%);
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .outro-box {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(24px);
            border: 2px solid #C7D9CC;
            border-radius: 36px;
            box-shadow: 0 30px 70px -15px rgba(35, 75, 48, 0.22), 0 10px 25px rgba(0, 0, 0, 0.05);
            padding: 64px 80px;
            text-align: center;
            max-width: 980px;
          }
          .badge-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 24px;
          }
          .pill-badge {
            background: #EBF3ED;
            color: #234B30;
            border: 1.5px solid #C7D9CC;
            font-size: 13px;
            font-weight: 700;
            padding: 6px 16px;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
        </style>
      </head>
      <body>
        <div class="outro-box">
          <div class="badge-row">
            <span class="pill-badge">🔒 100% Anonim</span>
            <span class="pill-badge">📊 DASS-21 & VAK Ilmiah</span>
            <span class="pill-badge">🔐 E2EE AES-GCM 256-bit</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 16px;">
            <div style="width: 64px; height: 64px; border-radius: 20px; background: linear-gradient(135deg, #4A7C59 0%, #3B5998 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: 900; box-shadow: 0 8px 20px rgba(74, 124, 89, 0.4);">
              🛡️
            </div>
            <h1 style="font-size: 48px; font-weight: 800; color: #1E293B; letter-spacing: -1px;">
              SafeSpace <span style="color: #4A7C59; font-size: 30px; font-weight: 800;">PWA</span>
            </h1>
          </div>

          <p style="font-size: 21px; color: #475569; font-weight: 600; margin-bottom: 36px; max-width: 720px; margin-left: auto; margin-right: auto; line-height: 1.5;">
            Ruang Aman Pertama Sebelum Konseling.<br/>
            Bebas Stigma, Terenkripsi, dan Siap Mendukung Perjalanan Akademik Anda.
          </p>

          <div style="background: #1E293B; color: #FFFFFF; padding: 18px 40px; border-radius: 20px; font-size: 28px; font-weight: 800; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 14px; box-shadow: 0 12px 28px rgba(30, 41, 59, 0.35);">
            <span style="color: #4ADE80; font-size: 24px;">🌐</span>
            <span>safespace.ijplabs.dev</span>
          </div>

          <p style="margin-top: 24px; font-size: 14px; color: #94A3B8; font-weight: 600;">
            Akses Instan dari Seluruh Peramban Desktop & Smartphone • Offline-First PWA
          </p>
        </div>
      </body>
    </html>
  `;
}

async function generateAllOverlays() {
  console.log('--- Generating High-Resolution 1080p RGBA Callout Overlays ---');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  for (const [key, callout] of Object.entries(PROMO_CALLOUTS)) {
    const html = renderCalloutHtml(callout);
    await page.setContent(html, { waitUntil: 'networkidle' });
    const outPng = path.join(OVERLAYS_DIR, `${key}.png`);
    await page.screenshot({ path: outPng, omitBackground: true });
    console.log(`[Overlay] Created ${path.basename(outPng)} (1920x1080 RGBA)`);
  }

  // Outro screen
  const outroHtml = renderOutroCardHtml();
  await page.setContent(outroHtml, { waitUntil: 'networkidle' });
  const outroPng = path.join(OVERLAYS_DIR, 'outro_card.png');
  await page.screenshot({ path: outroPng, omitBackground: false });
  console.log(`[Overlay] Created ${path.basename(outroPng)} (Outro Screen)`);

  await browser.close();
}

async function recordCleanIntroClip() {
  console.log('\n--- Recording Clean Intro Bridge Clip with safespace.ijplabs.dev Typing ---');

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-web-security', '--allow-file-access-from-files'],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: RAW_DIR,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();
  const cursorRecorder = new VideoCursorRecorder(RAW_DIR);
  await cursorRecorder.setupPageCursor(page);

  // Setup route interceptor to hide sandbox evaluator toggle and force clean production presentation
  await page.route('**/api/auth/config', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ enableSandbox: false, googleClientId: 'demo' }),
    });
  });

  // Navigate to local Vite dev server
  await page.goto('http://localhost:5173/#/', { waitUntil: 'networkidle' });

  // Hide any remaining sandbox elements cleanly via style tag
  await page.addStyleTag({
    content: `
      button:has-text("Buka Mode Sandbox"), div:has-text("Buka Mode Sandbox"), .sandbox-container { display: none !important; }
    `,
  });

  // 1. Injected Sleek Browser URL Bar Typing Animation at start
  console.log('[Intro] Injecting and animating address bar for safespace.ijplabs.dev...');
  await page.evaluate(() => {
    const bar = document.createElement('div');
    bar.id = 'promo-browser-bar';
    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.96);backdrop-filter:blur(16px);border:1.5px solid #CBD5E1;box-shadow:0 14px 35px rgba(0,0,0,0.18);border-radius:18px;padding:12px 24px;width:760px;">
        <div style="display:flex;gap:6px;">
          <div style="width:12px;height:12px;border-radius:50%;background:#EF4444;"></div>
          <div style="width:12px;height:12px;border-radius:50%;background:#F59E0B;"></div>
          <div style="width:12px;height:12px;border-radius:50%;background:#10B981;"></div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;background:#F1F5F9;border-radius:10px;padding:8px 16px;flex:1;border:1px solid #E2E8F0;">
          <span style="font-size:14px;color:#10B981;">🔒</span>
          <span style="font-size:15px;color:#64748B;font-family:monospace;font-weight:600;">https://</span>
          <span id="promo-typing-target" style="font-size:16px;color:#0F172A;font-family:monospace;font-weight:700;"></span>
          <span id="promo-typing-cursor" style="display:inline-block;width:2px;height:18px;background:#4A7C59;animation:blink 0.7s infinite;"></span>
        </div>
        <div style="font-size:11px;font-weight:800;color:#234B30;background:#EBF3ED;border:1px solid #C7D9CC;padding:4px 10px;border-radius:8px;">PWA</div>
      </div>
      <style>
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      </style>
    `;
    bar.style.position = 'fixed';
    bar.style.top = '100px';
    bar.style.left = '50%';
    bar.style.transform = 'translateX(-50%)';
    bar.style.zIndex = '999990';
    bar.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    document.body.appendChild(bar);
  });

  await page.waitForTimeout(600);

  // Type characters into address bar
  const urlToType = 'safespace.ijplabs.dev';
  for (let i = 0; i < urlToType.length; i++) {
    await page.evaluate((char) => {
      const el = document.getElementById('promo-typing-target');
      if (el) el.textContent += char;
    }, urlToType[i]);
    await page.waitForTimeout(70 + Math.random() * 30);
  }

  // Pause after finished typing, then press enter (bar fades out)
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const bar = document.getElementById('promo-browser-bar');
    if (bar) {
      bar.style.opacity = '0';
      bar.style.transform = 'translateX(-50%) translateY(-20px)';
      setTimeout(() => bar.remove(), 450);
    }
  });

  await page.waitForTimeout(600);

  // 2. Smoothly move cursor to top-right "Masuk / Daftar" button on Navbar
  console.log('[Intro] Moving cursor to Masuk / Daftar button on Navbar...');
  const loginBtn = page.locator('header button:has-text("Masuk / Daftar")');
  await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
  await cursorRecorder.moveAndClick(page, loginBtn, 'Masuk / Daftar Navbar', 800, 600);

  // Wait for navigation to /#/auth
  await page.waitForURL('**/#/auth', { timeout: 5000 });
  await page.waitForTimeout(1000);

  // Also ensure sandbox button is hidden on auth page
  await page.addStyleTag({
    content: `
      button:has-text("Buka Mode Sandbox"), div:has-text("Buka Mode Sandbox"), .sandbox-container { display: none !important; }
    `,
  });

  // 3. Focus on Google Sign In container
  console.log('[Intro] Focusing on pristine Google OAuth Card...');
  const authCardHeader = page.locator('h3:has-text("Masuk / Daftar Akun Google")');
  await authCardHeader.waitFor({ state: 'visible', timeout: 5000 });

  const googleBtnContainer = page.locator('div:has(> iframe)').first();
  await googleBtnContainer.waitFor({ state: 'visible', timeout: 5000 });
  await cursorRecorder.hover(page, googleBtnContainer, 'Google Sign In Button', 1200);

  // 4. Click Google Sign In button to trigger click ripple and transition
  console.log('[Intro] Clicking Google Sign In button...');
  await cursorRecorder.moveAndClick(page, googleBtnContainer, 'Click Google Sign In', 600, 1500);

  // Show authentic loading indicator state
  await page.evaluate(() => {
    const loader = document.createElement('div');
    loader.id = 'simulated-auth-loader';
    loader.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;gap:10px;padding:16px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;font-size:13px;font-weight:600;color:#334155;margin-top:14px;">
        <div style="width:18px;height:18px;border:2.5px solid #CBD5E1;border-top-color:#4A7C59;border-radius:50%;animation:spin 0.7s linear infinite;"></div>
        <span>Memverifikasi kredensial Google & menerbitkan token anonim...</span>
      </div>
      <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;
    const card = document.querySelector('.p-5, .p-6');
    if (card) card.appendChild(loader);
  });

  await page.waitForTimeout(1400);

  console.log('[Intro] Clean bridge capture completed.');
  await page.close();
  await context.close();
  await browser.close();

  // Find recorded webm file in RAW_DIR
  const files = fs.readdirSync(RAW_DIR).filter((f) => f.endsWith('.webm'));
  if (files.length === 0) throw new Error('No webm recorded');
  const latestWebm = path.join(RAW_DIR, files[files.length - 1]);
  const introCfrMp4 = path.join(PROMO_DIR, 'intro_clean_auth.mp4');

  console.log(`[FFmpeg] Transcoding clean intro to 60fps CFR: ${introCfrMp4}`);
  execSync(
    `ffmpeg -y -i "${latestWebm}" -r 60 -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "${introCfrMp4}"`,
    { stdio: 'inherit' },
  );

  console.log('=== Clean Intro Bridge & Callout Overlays Successfully Created! ===\n');
}

async function main() {
  await generateAllOverlays();
  await recordCleanIntroClip();
}

main().catch((err) => {
  console.error('Record clean intro failed:', err);
  process.exit(1);
});
