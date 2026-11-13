import { spawn } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';

const BASE_DIR = path.resolve(__dirname, '../../../');
const EFFECTCRAFT_CLI = 'D:\\ArtCraft\\EffectCraft\\effectcraft-cli.exe';
const PROJECT_FILE = path.join(BASE_DIR, 'docs/videos/brand-promo-mahasiswa/safespace-brand-mahasiswa.ecproj');

// HD Screen Asset Paths
const SCREENS_DIR = path.join(BASE_DIR, 'docs/videos/brand-promo-mahasiswa/app-screens');
const QA_LEGACY_DIR = path.join(BASE_DIR, 'docs/videos/qa-frames');

const ASSETS = {
  landing: path.join(SCREENS_DIR, '02_landing_page.png'),
  auth: path.join(SCREENS_DIR, '03_auth_page.png'),
  dashboard: path.join(SCREENS_DIR, '04_student_dashboard.png'),
  dass21Wizard: path.join(SCREENS_DIR, '05_dass21_wizard.png'),
  dass21Result: path.join(SCREENS_DIR, '05_dass21_result.png'),
  vakInput: path.join(SCREENS_DIR, '06_vak_input.png'), // Form input for VAK Fleming (Skenario 1 dari 12)
  vakResult: path.join(SCREENS_DIR, '06_vak_result_clean.png'), // Real VAK 3-bar breakdown (Visual 42%, Kinestetik 33%, Auditori 25%)
  counselorQueue: path.join(SCREENS_DIR, '07_counselor_triage.png'), // Crisp retina counselor triage queue
  e2eeChat: path.join(SCREENS_DIR, '08_e2ee_chat.png'), // Crisp retina encrypted chat room
  brandLogo: path.join(BASE_DIR, 'docs/videos/brand-promo-mahasiswa/safespace-brand-logo.png'),
};

class EffectCraftClient {
  private proc = spawn(EFFECTCRAFT_CLI, ['--empty', 'mcp'], { stdio: ['pipe', 'pipe', 'pipe'] });
  private buf = '';
  private nextId = 1;
  private pending = new Map<number, (v: any) => void>();

  constructor() {
    this.proc.stdout.on('data', chunk => {
      this.buf += chunk.toString('utf8');
      let idx: number;
      while ((idx = this.buf.indexOf('\n')) !== -1) {
        const line = this.buf.slice(0, idx).trim();
        this.buf = this.buf.slice(idx + 1);
        if (!line) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id && this.pending.has(msg.id)) {
            const cb = this.pending.get(msg.id)!;
            this.pending.delete(msg.id);
            cb(msg);
          }
        } catch {}
      }
    });
  }

  rpc(method: string, params: any = {}): Promise<any> {
    const id = this.nextId++;
    return new Promise(resolve => {
      this.pending.set(id, resolve);
      this.proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  }

  async call(tool: string, args: any = {}) {
    const r = await this.rpc('tools/call', { name: tool, arguments: args });
    if (r.error) throw new Error(JSON.stringify(r.error));
    const txt = r.result?.content?.find((c: any) => c.type === 'text')?.text;
    try {
      return txt ? JSON.parse(txt) : r.result;
    } catch {
      return txt;
    }
  }

  async init() {
    await this.rpc('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'zelios-hd-promo-builder', version: '7.0' },
    });
    this.proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
  }

  close() {
    this.proc.stdin.end();
  }
}

// -----------------------------------------------------------------
// STUDIO BACKDROP
// -----------------------------------------------------------------
async function createStudioBackdrop(
  client: EffectCraftClient,
  duration: number,
  glowColor = '#e3ece5',
  options: { fadeIn?: boolean; fadeOut?: boolean } = {}
) {
  // 1. Warm Base Studio Solid
  await client.call('execute_command', {
    command: 'layer.newSolid',
    params: { name: 'Studio Base', color: '#fbfbf9', width: 1920, height: 1080 },
  });

  // 2. Soft Ambient Aura Glow
  const glow = await client.call('execute_command', {
    command: 'layer.newShape',
    params: {
      kind: 'ellipse',
      name: 'Ambient Aura',
      size: [1180, 840],
      position: [960, 540],
      fill: glowColor,
    },
  });
  await client.call('set_property', { layer: glow.layer, path: 'transform/opacity', value: 38 });
  await client.call('add_effect', {
    layer: glow.layer,
    effect: 'Gaussian Blur',
    values: { blurriness: 48 },
  });

  // 3. Optional Dissolve only for Intro / Outro (NOT during tablet walkthrough!)
  if (options.fadeIn || options.fadeOut) {
    const veil = await client.call('execute_command', {
      command: 'layer.newSolid',
      params: { name: 'Transition Dissolve', color: '#fbfbf9', width: 1920, height: 1080 },
    });
    const keys: any[] = [];
    if (options.fadeIn) {
      keys.push({ time: 0.0, value: 100 }, { time: 0.35, value: 0 });
    }
    if (options.fadeOut) {
      keys.push({ time: duration - 0.35, value: 0 }, { time: duration, value: 100 });
    }
    await client.call('add_keyframe', {
      layer: veil.layer,
      path: 'transform/opacity',
      keys,
      interpolation: 'easyEase',
    });
  }
}

// -----------------------------------------------------------------
// BULLETPROOF ZELIOS SIDE BENTO CARD (ZERO OVERFLOW GUARANTEE)
// -----------------------------------------------------------------
async function createSideBentoCard(
  client: EffectCraftClient,
  options: {
    name: string;
    pos: [number, number];
    size: [number, number];
    badge: string;
    title: string;
    descLines: string[]; // Strict clean short lines (max 38 chars)
    inTime: number;
    outTime: number;
    badgeColor?: string;
    badgeFill?: string;
  }
) {
  const [x, y] = options.pos;
  const [w, h] = options.size;
  const inTime = options.inTime;
  const outTime = options.outTime;
  const bColor = options.badgeColor ?? '#244e33';
  const bFill = options.badgeFill ?? '#e8f3ec';

  // Elevation Shadow
  const shadow = await client.call('execute_command', {
    command: 'layer.newShape',
    params: {
      kind: 'rounded',
      name: `${options.name} Shadow`,
      size: [w, h],
      position: [x + 4, y + 8],
      fill: '#1e293b',
    },
  });
  await client.call('set_property', { layer: shadow.layer, path: 'transform/opacity', value: 9 });
  await client.call('add_keyframe', {
    layer: shadow.layer,
    path: 'transform/opacity',
    keys: [
      { time: inTime, value: 0 },
      { time: inTime + 0.35, value: 9 },
      { time: outTime - 0.35, value: 9 },
      { time: outTime, value: 0 },
    ],
  });

  // White Card Body
  const body = await client.call('execute_command', {
    command: 'layer.newShape',
    params: {
      kind: 'rounded',
      name: `${options.name} Body`,
      size: [w, h],
      position: [x, y],
      fill: '#ffffff',
      stroke: '#c7d9cc',
      strokeWidth: 1.5,
    },
  });
  await client.call('set_property', { layer: body.layer, path: 'transform/opacity', value: 98 });
  await client.call('add_keyframe', {
    layer: body.layer,
    path: 'transform/opacity',
    keys: [
      { time: inTime, value: 0 },
      { time: inTime + 0.35, value: 98 },
      { time: outTime - 0.35, value: 98 },
      { time: outTime, value: 0 },
    ],
  });
  await client.call('add_keyframe', {
    layer: body.layer,
    path: 'transform/scale',
    keys: [
      { time: inTime, value: [88, 88] },
      { time: inTime + 0.32, value: [102, 102] },
      { time: inTime + 0.45, value: [100, 100] },
    ],
    interpolation: 'easyEase',
  });
  await client.call('add_keyframe', {
    layer: body.layer,
    path: 'transform/position',
    keys: [
      { time: inTime, value: [x, y + 22] },
      { time: inTime + 0.4, value: [x, y] },
    ],
    interpolation: 'easyEase',
  });

  const cardLeft = x - w / 2;
  const cardTop = y - h / 2;
  const contentLeft = cardLeft + 28;
  const contentTop = cardTop + 24;

  // Badge Pill
  const badgeW = options.badge.length * 8.0 + 26;
  await client.call('execute_command', {
    command: 'layer.newShape',
    params: {
      kind: 'rounded',
      name: `${options.name} Badge Pill`,
      size: [badgeW, 26],
      position: [contentLeft + badgeW / 2, contentTop + 13],
      fill: bFill,
      stroke: '#4a7c59',
      strokeWidth: 1,
    },
  });
  await client.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: `${options.name} Badge Text`,
      text: options.badge,
      position: [contentLeft + badgeW / 2, contentTop + 18],
      font: 'Segoe UI',
      size: 12.5,
      fauxBold: true,
      fill: bColor,
      justify: 'center',
    },
  });

  // Title
  await client.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: `${options.name} Title`,
      text: options.title,
      position: [contentLeft, contentTop + 58],
      font: 'Segoe UI',
      size: 23,
      fauxBold: true,
      fill: '#0f172a',
      justify: 'left',
    },
  });

  // Description Lines (Guaranteed to stay well within container)
  let lineY = contentTop + 90;
  for (let i = 0; i < options.descLines.length; i++) {
    await client.call('execute_command', {
      command: 'layer.newText',
      params: {
        name: `${options.name} Desc L${i + 1}`,
        text: options.descLines[i],
        position: [contentLeft, lineY],
        font: 'Segoe UI',
        size: 14,
        fill: '#475569',
        justify: 'left',
      },
    });
    lineY += 23;
  }
}

// -----------------------------------------------------------------
// PERSISTENT SEAMLESS TABLET DEVICE FRAME HELPER WITH HD APP SCREENSHOTS
// -----------------------------------------------------------------
async function createTabletMockupWithScreenshot(
  client: EffectCraftClient,
  options: {
    name: string;
    screenshotPath: string;
    secondScreenshotPath?: string;
    secondStartTime?: number;
    pos?: [number, number];
    isIntro?: boolean; // True ONLY in Scene 2! False in Scenes 3-8 to maintain seamless persistent frame!
  }
) {
  const [cx, cy] = options.pos ?? [1210, 520];
  const isIntro = options.isIntro ?? false;

  // Frame Dimensions (Crisp 1240x720 Retina App Screen @ 45.16% = 1120 x 650)
  const screenW = 1120;
  const screenH = 650;
  const bezelW = 1160;
  const bezelH = 690;

  // 1. Ambient Drop Shadow (Persistent across walkthrough)
  const shadow = await client.call('execute_command', {
    command: 'layer.newShape',
    params: { kind: 'rounded', name: `${options.name} Frame Shadow`, size: [bezelW, bezelH], position: [cx + 4, cy + 14], fill: '#1e293b' },
  });
  await client.call('set_property', { layer: shadow.layer, path: 'transform/opacity', value: 15 });

  // 2. Titanium Dark Bezel (Seamless persistence: Only animates scale on Scene 2 intro, then stays rock solid!)
  const bezel = await client.call('execute_command', {
    command: 'layer.newShape',
    params: { kind: 'rounded', name: `${options.name} Bezel`, size: [bezelW, bezelH], position: [cx, cy], fill: '#0f172a' },
  });

  if (isIntro) {
    await client.call('add_keyframe', {
      layer: bezel.layer,
      path: 'transform/scale',
      keys: [
        { time: 0.2, value: [92, 92] },
        { time: 0.65, value: [100, 100] },
      ],
      interpolation: 'easyEase',
    });
  }

  // 3. Screen Viewport Base
  await client.call('execute_command', {
    command: 'layer.newShape',
    params: { kind: 'rounded', name: `${options.name} Screen Canvas`, size: [screenW, screenH], position: [cx, cy], fill: '#ffffff' },
  });

  // 4. Import Primary HD Screenshot Footage
  await client.call('execute_command', {
    command: 'file.import',
    params: { paths: [options.screenshotPath], addToComp: true },
  });
  const comp = await client.call('get_comp');
  const compData = typeof comp === 'string' ? JSON.parse(comp) : comp;
  const footageLayer = compData.layers?.find((l: any) => l.type === 'Footage' && l.name === path.basename(options.screenshotPath));

  if (footageLayer) {
    await client.call('set_property', { layer: footageLayer.id, path: 'transform/position', value: [cx, cy] });
    await client.call('set_property', { layer: footageLayer.id, path: 'transform/scale', value: [45.16, 45.16] });

    if (!isIntro) {
      // Smooth subtle cross-fade for incoming screen content inside persistent frame
      await client.call('add_keyframe', {
        layer: footageLayer.id,
        path: 'transform/opacity',
        keys: [
          { time: 0.0, value: 0 },
          { time: 0.25, value: 100 },
        ],
      });
    }

    if (options.secondScreenshotPath && options.secondStartTime) {
      // Fade out primary screenshot when second starts
      await client.call('add_keyframe', {
        layer: footageLayer.id,
        path: 'transform/opacity',
        keys: [
          { time: options.secondStartTime - 0.3, value: 100 },
          { time: options.secondStartTime, value: 0 },
        ],
      });
    }
  }

  // 5. If second screenshot exists (e.g. Question form -> Result transition)
  if (options.secondScreenshotPath && options.secondStartTime) {
    await client.call('execute_command', {
      command: 'file.import',
      params: { paths: [options.secondScreenshotPath], addToComp: true },
    });
    const comp2 = await client.call('get_comp');
    const compData2 = typeof comp2 === 'string' ? JSON.parse(comp2) : comp2;
    const footageLayer2 = compData2.layers?.find((l: any) => l.type === 'Footage' && l.name === path.basename(options.secondScreenshotPath));

    if (footageLayer2) {
      await client.call('set_property', { layer: footageLayer2.id, path: 'transform/position', value: [cx, cy] });
      await client.call('set_property', { layer: footageLayer2.id, path: 'transform/scale', value: [45.16, 45.16] });
      await client.call('add_keyframe', {
        layer: footageLayer2.id,
        path: 'transform/opacity',
        keys: [
          { time: options.secondStartTime - 0.3, value: 0 },
          { time: options.secondStartTime, value: 100 },
        ],
      });
    }
  }

  // 6. Subtle Glass Glare / Display Bezel Accent
  const glare = await client.call('execute_command', {
    command: 'layer.newShape',
    params: { kind: 'rounded', name: `${options.name} Inner Stroke`, size: [screenW, screenH], position: [cx, cy], fill: 'transparent', stroke: '#000000', strokeWidth: 1 },
  });
  await client.call('set_property', { layer: glare.layer, path: 'transform/opacity', value: 8 });
}

// =================================================================
// MAIN COMPOSITION FUNCTION: 9 SEAMLESS HIGH-FIDELITY SCENES
// =================================================================
async function buildAllScenes() {
  console.log('=== Composing 9 SafeSpace Promo Scenes (PERSISTENT FRAME & DASS/VAK FORM INPUTS) ===');

  const client = new EffectCraftClient();
  await client.init();

  // =================================================================
  // SCENE 1: Kinetic Brand Hook & Bento Hero Reveal (5.0s)
  // =================================================================
  console.log('[Zelios] Building Scene 01: Hero Reveal (5.0s)...');
  await client.call('execute_command', {
    command: 'comp.new',
    params: {
      name: 'Scene01_URL_Intro',
      width: 1920,
      height: 1080,
      frameRate: 60,
      duration: 5.0,
      background: '#fbfbf9',
    },
  });
  await createStudioBackdrop(client, 5.0, '#e3ece5', { fadeIn: true });

  // SafeSpace Official Brand Logo (Exact App Shield + SafeSpace PWA Typography)
  await client.call('execute_command', {
    command: 'file.import',
    params: { paths: [ASSETS.brandLogo], addToComp: true },
  });
  const s1Comp = await client.call('get_comp');
  const s1CompData = typeof s1Comp === 'string' ? JSON.parse(s1Comp) : s1Comp;
  const s1LogoLayer = s1CompData.layers?.find((l: any) => l.type === 'Footage' && l.name.includes('safespace-brand-logo'));
  if (s1LogoLayer) {
    await client.call('set_property', { layer: s1LogoLayer.id, path: 'transform/position', value: [960, 235] });
    await client.call('set_property', { layer: s1LogoLayer.id, path: 'transform/scale', value: [62, 62] });
    await client.call('add_keyframe', {
      layer: s1LogoLayer.id,
      path: 'transform/scale',
      keys: [
        { time: 0.1, value: [42, 42] },
        { time: 0.5, value: [62, 62] },
      ],
      interpolation: 'easyEase',
    });
  }

  // Top Pill: Authentic Website Sub-header
  await client.call('execute_command', {
    command: 'layer.newShape',
    params: { kind: 'rounded', name: 'Badge Pill', size: [560, 38], position: [960, 350], fill: '#e3ece5', stroke: '#c7d9cc', strokeWidth: 1.5 },
  });
  await client.call('execute_command', {
    command: 'layer.newText',
    params: { name: 'Badge Text', text: '✨ PLATFORM PRA-KONSELING • ZERO-KNOWLEDGE PRIVASI MAHASISWA PJJ', position: [960, 355], font: 'Segoe UI', size: 13, fauxBold: true, fill: '#31523a', justify: 'center' },
  });

  // Large Kinetic Title
  await client.call('execute_command', {
    command: 'layer.newText',
    params: { name: 'Hero Title L1', text: 'Ruang Aman Anonim untuk Mengurai', position: [960, 425], font: 'Segoe UI', size: 48, fauxBold: true, fill: '#1e293b', justify: 'center' },
  });
  await client.call('execute_command', {
    command: 'layer.newText',
    params: { name: 'Hero Title L2 Accent', text: 'Academic Burnout', position: [960, 480], font: 'Segoe UI', size: 52, fauxBold: true, fill: '#4a7c59', justify: 'center' },
  });

  // Subtitle
  await client.call('execute_command', {
    command: 'layer.newText',
    params: { name: 'Hero Subtitle L1', text: 'Deteksi dini kelelahan akademik dengan instrumen baku DASS-21 & VAK Fleming.', position: [960, 535], font: 'Segoe UI', size: 21, fill: '#475569', justify: 'center' },
  });
  await client.call('execute_command', {
    command: 'layer.newText',
    params: { name: 'Hero Subtitle L2', text: 'Terhubung langsung dengan konselor pendamping melalui ruang obrolan aman & privat.', position: [960, 565], font: 'Segoe UI', size: 20, fill: '#475569', justify: 'center' },
  });

  // 3 Staggered Floating Feature Badges
  const badgesS1 = [
    { text: '🔒 Two-Way Anonymity (Zero-Knowledge)', pos: [560, 640], size: [340, 50], delay: 0.5 },
    { text: '📊 Dual Asesmen DASS-21 & VAK', pos: [960, 640], size: [320, 50], delay: 0.7 },
    { text: '⚡ PWA Offline-First Tanpa Instalasi', pos: [1360, 640], size: [330, 50], delay: 0.9 },
  ];

  for (const b of badgesS1) {
    const shadow = await client.call('execute_command', {
      command: 'layer.newShape',
      params: { kind: 'rounded', name: `${b.text} Shadow`, size: b.size, position: [b.pos[0] + 3, b.pos[1] + 6], fill: '#1e293b' },
    });
    await client.call('set_property', { layer: shadow.layer, path: 'transform/opacity', value: 8 });

    const pill = await client.call('execute_command', {
      command: 'layer.newShape',
      params: { kind: 'rounded', name: `${b.text} Pill`, size: b.size, position: b.pos, fill: '#ffffff', stroke: '#c7d9cc', strokeWidth: 1.5 },
    });
    await client.call('execute_command', {
      command: 'layer.newText',
      params: { name: `${b.text} Text`, text: b.text, position: [b.pos[0], b.pos[1] + 5], font: 'Segoe UI', size: 15, fauxBold: true, fill: '#1e293b', justify: 'center' },
    });

    await client.call('add_keyframe', {
      layer: pill.layer,
      path: 'transform/scale',
      keys: [
        { time: b.delay, value: [84, 84] },
        { time: b.delay + 0.35, value: [100, 100] },
      ],
      interpolation: 'easyEase',
    });
  }

  // Footer Tagline
  await client.call('execute_command', {
    command: 'layer.newText',
    params: { name: 'Subtext Hook', text: 'Tanpa Unduh Aplikasi Rumit • Langsung Terhubung Dari Browser Anda', position: [960, 715], font: 'Segoe UI', size: 17, fill: '#64748b', justify: 'center' },
  });

  // =================================================================
  // SCENE 2: Real App Landing Page on Floating Tablet (6.5s)
  // INTRODUCES THE TABLET (isIntro = true)
  // =================================================================
  console.log('[Zelios] Building Scene 02: Real Landing Page Showcase (6.5s)...');
  await client.call('execute_command', {
    command: 'comp.new',
    params: {
      name: 'Scene02_Landing_Zoom',
      width: 1920,
      height: 1080,
      frameRate: 60,
      duration: 6.5,
      background: '#fbfbf9',
    },
  });
  await createStudioBackdrop(client, 6.5, '#e1ede4');

  // Floating Tablet Device with Real HD Landing Page Screenshot (isIntro = true)
  await createTabletMockupWithScreenshot(client, {
    name: 'S2 Landing',
    screenshotPath: ASSETS.landing,
    pos: [1210, 520],
    isIntro: true,
  });

  // Click Ripple on the 'Masuk / Daftar' Button in the HD navbar
  const s2Ripple = await client.call('execute_command', {
    command: 'layer.newShape',
    params: { kind: 'ellipse', name: 'Click Ripple', size: [40, 40], position: [1466, 225], fill: '#4a7c59' },
  });
  await client.call('add_keyframe', {
    layer: s2Ripple.layer,
    path: 'transform/scale',
    keys: [
      { time: 4.15, value: [20, 20] },
      { time: 4.65, value: [260, 260] },
    ],
    interpolation: 'easyEaseOut',
  });
  await client.call('add_keyframe', {
    layer: s2Ripple.layer,
    path: 'transform/opacity',
    keys: [
      { time: 4.15, value: 85 },
      { time: 4.65, value: 0 },
    ],
    interpolation: 'easyEaseOut',
  });

  // Left Side Bento Callout Card
  await createSideBentoCard(client, {
    name: 'Card S2',
    pos: [360, 520],
    size: [500, 240],
    badge: 'RUANG AMAN MAHASISWA PJJ',
    title: 'Mulai Tanpa Rasa Ragu.',
    descLines: [
      'Cukup satu klik Masuk atau Daftar.',
      'Siap digunakan seketika tanpa perlu',
      'mengunduh aplikasi yang rumit.',
      'Akses instan dari semua browser.',
    ],
    inTime: 0.4,
    outTime: 6.5,
  });

  // =================================================================
  // SCENE 3: Real Auth Page & Cryptographic Pipeline (6.5s)
  // PERSISTENT TABLET FRAME (isIntro = false)
  // =================================================================
  console.log('[Zelios] Building Scene 03: Real Auth & Crypto (6.5s)...');
  await client.call('execute_command', {
    command: 'comp.new',
    params: {
      name: 'Scene03_Google_Auth',
      width: 1920,
      height: 1080,
      frameRate: 60,
      duration: 6.5,
      background: '#fbfbf9',
    },
  });
  await createStudioBackdrop(client, 6.5, '#e4efe7');

  // Persistent Tablet Frame
  await createTabletMockupWithScreenshot(client, {
    name: 'S3 Auth',
    screenshotPath: ASSETS.auth,
    pos: [1210, 520],
    isIntro: false,
  });

  // Left Side Bento Callout Card
  await createSideBentoCard(client, {
    name: 'Card S3',
    pos: [360, 520],
    size: [500, 250],
    badge: 'OTENTIKASI RESMI GOOGLE • SHA-256',
    title: 'Identitas Aman 100%.',
    descLines: [
      '✓ Masuk praktis dengan akun Google kampus',
      '✓ Sanitasi kriptografis satu arah SHA-256',
      '✓ Nama samaran acak dibuat otomatis',
      '✓ Bebas dari stigma rekam jejak akademik',
    ],
    inTime: 0.1,
    outTime: 6.5,
  });

  // =================================================================
  // SCENE 4: Real Student Dashboard on Floating Tablet (7.0s)
  // PERSISTENT TABLET FRAME (isIntro = false)
  // =================================================================
  console.log('[Zelios] Building Scene 04: Real Student Dashboard (7.0s)...');
  await client.call('execute_command', {
    command: 'comp.new',
    params: {
      name: 'Scene04_Student_Dashboard',
      width: 1920,
      height: 1080,
      frameRate: 60,
      duration: 7.0,
      background: '#fbfbf9',
    },
  });
  await createStudioBackdrop(client, 7.0, '#e3ede5');

  // Persistent Tablet Frame
  await createTabletMockupWithScreenshot(client, {
    name: 'S4 Dashboard',
    screenshotPath: ASSETS.dashboard,
    pos: [1210, 520],
    isIntro: false,
  });

  // Left Side Bento Callout Card
  await createSideBentoCard(client, {
    name: 'Card S4',
    pos: [360, 520],
    size: [500, 250],
    badge: 'DASBOR MAHASISWA PJJ',
    title: 'Pusat Kendali Tenang.',
    descLines: [
      'Selamat datang di dashboard pribadi.',
      'Pantau kondisi emosi dan ritme belajar',
      'tanpa rasa cemas atau dihakimi.',
      'Dilengkapi tombol Safe Exit di tiap layar.',
    ],
    inTime: 0.1,
    outTime: 7.0,
  });

  // =================================================================
  // SCENE 5: DASS-21 Scientific Assessment & Lovibond Results (11.0s)
  // PERSISTENT TABLET FRAME: Form Input (t=0-5.2s) -> Result (t=5.2-11s)
  // =================================================================
  console.log('[Zelios] Building Scene 05: Real DASS-21 Showcase (11.0s)...');
  await client.call('execute_command', {
    command: 'comp.new',
    params: {
      name: 'Scene05_DASS21_Showcase',
      width: 1920,
      height: 1080,
      frameRate: 60,
      duration: 11.0,
      background: '#fbfbf9',
    },
  });
  await createStudioBackdrop(client, 11.0, '#e2efe6');

  // Persistent Tablet Frame with DASS-21 Wizard Input -> Result Transition at t=5.2s
  await createTabletMockupWithScreenshot(client, {
    name: 'S5 DASS21',
    screenshotPath: ASSETS.dass21Wizard,
    secondScreenshotPath: ASSETS.dass21Result,
    secondStartTime: 5.2,
    pos: [1210, 520],
    isIntro: false,
  });

  // Left Side Bento Callout Card
  await createSideBentoCard(client, {
    name: 'Card S5',
    pos: [360, 520],
    size: [500, 250],
    badge: 'ASESMEN ILMIAH DASS-21',
    title: 'Terukur Secara Ilmiah.',
    descLines: [
      'Instrumen psikometri baku 21 butir.',
      'Deteksi dini depresi, kecemasan,',
      'dan stres akademik Lovibond terukur',
      'secara objektif tanpa praduga subjektif.',
    ],
    inTime: 0.1,
    outTime: 11.0,
  });

  // =================================================================
  // SCENE 6: Real VAK Learning Style Assessment (10.5s)
  // PERSISTENT TABLET FRAME: Form Input (t=0-5.0s) -> Result Bars (t=5.0-10.5s)
  // FIXES ISSUE 2: VAK Form Input is explicitly showcased first!
  // =================================================================
  console.log('[Zelios] Building Scene 06: Real VAK Showcase with Form Input (10.5s)...');
  await client.call('execute_command', {
    command: 'comp.new',
    params: {
      name: 'Scene06_VAK_Showcase',
      width: 1920,
      height: 1080,
      frameRate: 60,
      duration: 10.5,
      background: '#fbfbf9',
    },
  });
  await createStudioBackdrop(client, 10.5, '#e4eee6');

  // Persistent Tablet Frame with VAK Form Input -> Result Transition at t=5.0s
  await createTabletMockupWithScreenshot(client, {
    name: 'S6 VAK',
    screenshotPath: ASSETS.vakInput,
    secondScreenshotPath: ASSETS.vakResult,
    secondStartTime: 5.0,
    pos: [1210, 520],
    isIntro: false,
  });

  // Left Side Bento Callout Card
  await createSideBentoCard(client, {
    name: 'Card S6',
    pos: [360, 520],
    size: [500, 250],
    badge: 'MODALITAS BELAJAR ADAPTIF',
    title: 'Strategi Belajar Tepat.',
    descLines: [
      'Petakan modalitas belajar VAK Anda.',
      'Isi kuesioner skenario belajar Fleming',
      'untuk menemukan gaya belajar adaptif',
      '(Visual, Auditori, atau Kinestetik).',
    ],
    inTime: 0.1,
    outTime: 10.5,
  });

  // =================================================================
  // SCENE 7: Real Counselor Triage Queue & Attached Profiles (6.0s)
  // PERSISTENT TABLET FRAME (isIntro = false)
  // =================================================================
  console.log('[Zelios] Building Scene 07: Real Counselor Triage (6.0s)...');
  await client.call('execute_command', {
    command: 'comp.new',
    params: {
      name: 'Scene07_Create_Ticket',
      width: 1920,
      height: 1080,
      frameRate: 60,
      duration: 6.0,
      background: '#fbfbf9',
    },
  });
  await createStudioBackdrop(client, 6.0, '#e2eee5');

  // Persistent Tablet Frame
  await createTabletMockupWithScreenshot(client, {
    name: 'S7 Triage',
    screenshotPath: ASSETS.counselorQueue,
    pos: [1210, 520],
    isIntro: false,
  });

  // Left Side Bento Callout Card (Clean Wrap, Zero Overflow)
  await createSideBentoCard(client, {
    name: 'Card S7',
    pos: [360, 520],
    size: [500, 250],
    badge: 'TRIAGE PRA-KONSELING OTOMATIS',
    title: 'Tak Perlu Cerita dari Nol.',
    descLines: [
      'Kedua hasil otomatis terlampir ke tiket.',
      'Konselor langsung memahami kondisi Anda',
      'tanpa perlu Anda mengulang beban cerita',
      'dari awal secara berulang-ulang.',
    ],
    inTime: 0.1,
    outTime: 6.0,
  });

  // =================================================================
  // SCENE 8: Real Encrypted E2EE Chat Session (7.0s)
  // PERSISTENT TABLET FRAME (isIntro = false)
  // =================================================================
  console.log('[Zelios] Building Scene 08: Real Encrypted Chat (7.0s)...');
  await client.call('execute_command', {
    command: 'comp.new',
    params: {
      name: 'Scene08_Ticket_List',
      width: 1920,
      height: 1080,
      frameRate: 60,
      duration: 7.0,
      background: '#fbfbf9',
    },
  });
  await createStudioBackdrop(client, 7.0, '#e1ede4');

  // Persistent Tablet Frame
  await createTabletMockupWithScreenshot(client, {
    name: 'S8 Chat',
    screenshotPath: ASSETS.e2eeChat,
    pos: [1210, 520],
    isIntro: false,
  });

  // Left Side Bento Callout Card (Clean Wrap, Zero Overflow)
  await createSideBentoCard(client, {
    name: 'Card S8',
    pos: [360, 520],
    size: [500, 250],
    badge: 'RUANG KONSELING PRIVAT',
    title: 'Percakapan Aman & Privat.',
    descLines: [
      'Pesan terenkripsi aman di peramban.',
      'Didampingi konselor kampus terpercaya',
      'yang siap mendengarkan tanpa menghakimi,',
      'tanpa mengetahui identitas asli Anda.',
    ],
    inTime: 0.1,
    outTime: 7.0,
  });

  // =================================================================
  // SCENE 9: Climax Brand Outro & Sleek CTA (5.5s)
  // DISSOLVE TO OUTRO CARD (fadeOut = true)
  // =================================================================
  console.log('[Zelios] Building Scene 09: Brand Outro (5.5s)...');
  await client.call('execute_command', {
    command: 'comp.new',
    params: {
      name: 'Scene09_Brand_Outro',
      width: 1920,
      height: 1080,
      frameRate: 60,
      duration: 5.5,
      background: '#fbfbf9',
    },
  });
  await createStudioBackdrop(client, 5.5, '#e2eee5', { fadeIn: true });

  // Center Brand Card
  const s9Shadow = await client.call('execute_command', {
    command: 'layer.newShape',
    params: { kind: 'rounded', name: 'Outro Shadow', size: [940, 480], position: [964, 528], fill: '#1e293b' },
  });
  await client.call('set_property', { layer: s9Shadow.layer, path: 'transform/opacity', value: 14 });

  const s9Card = await client.call('execute_command', {
    command: 'layer.newShape',
    params: { kind: 'rounded', name: 'Outro Card', size: [940, 480], position: [960, 520], fill: '#ffffff', stroke: '#4a7c59', strokeWidth: 2 },
  });
  await client.call('add_keyframe', {
    layer: s9Card.layer,
    path: 'transform/scale',
    keys: [
      { time: 0.2, value: [90, 90] },
      { time: 0.7, value: [100, 100] },
    ],
    interpolation: 'easyEase',
  });

  // Logo Outro (Official SafeSpace Brand Logo)
  await client.call('execute_command', {
    command: 'file.import',
    params: { paths: [ASSETS.brandLogo], addToComp: true },
  });
  const s9Comp = await client.call('get_comp');
  const s9CompData = typeof s9Comp === 'string' ? JSON.parse(s9Comp) : s9Comp;
  const s9LogoLayer = s9CompData.layers?.find((l: any) => l.type === 'Footage' && l.name.includes('safespace-brand-logo'));
  if (s9LogoLayer) {
    await client.call('set_property', { layer: s9LogoLayer.id, path: 'transform/position', value: [960, 375] });
    await client.call('set_property', { layer: s9LogoLayer.id, path: 'transform/scale', value: [75, 75] });
  }

  // Tagline Outro
  await client.call('execute_command', {
    command: 'layer.newText',
    params: { name: 'Tagline Outro', text: 'Kenali Burnout Lebih Dini • Konseling Aman Tanpa Identitas', position: [960, 480], font: 'Segoe UI', size: 21, fauxBold: true, fill: '#244e33', justify: 'center' },
  });

  // Primary Emerald CTA Button
  const ctaBtn = await client.call('execute_command', {
    command: 'layer.newShape',
    params: { kind: 'rounded', name: 'CTA Button', size: [520, 64], position: [960, 580], fill: '#4a7c59', stroke: '#31523a', strokeWidth: 1.5 },
  });
  await client.call('add_keyframe', {
    layer: ctaBtn.layer,
    path: 'transform/scale',
    keys: [
      { time: 0.4, value: [88, 88] },
      { time: 0.75, value: [100, 100] },
    ],
    interpolation: 'easyEase',
  });
  await client.call('execute_command', {
    command: 'layer.newText',
    params: { name: 'CTA Text', text: 'Kunjungi safespace.ijplabs.dev  →', position: [960, 588], font: 'Segoe UI', size: 24, fauxBold: true, fill: '#ffffff', justify: 'center' },
  });

  // Trust Badges Footer
  await client.call('execute_command', {
    command: 'layer.newText',
    params: { name: 'Trust Footer', text: '🛡️ Enkripsi Klien Web Crypto   •   Sanitasi SHA-256   •   Akses PWA Offline-First', position: [960, 665], font: 'Segoe UI', size: 15.5, fauxBold: true, fill: '#64748b', justify: 'center' },
  });

  // Save EffectCraft Project
  console.log(`[Project] Saving EffectCraft project to ${PROJECT_FILE}...`);
  await client.call('save_project', { path: PROJECT_FILE });
  client.close();
  console.log('=== All 9 Persistent Frame Scenes Composed and Saved Successfully! ===');
}

buildAllScenes().catch(err => {
  console.error('Build Scenes Error:', err);
  process.exit(1);
});
