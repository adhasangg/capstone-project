import { spawn, execSync } from 'node:child_process';
import * as path from 'node:path';

const EFFECTCRAFT_CLI = 'D:\\ArtCraft\\EffectCraft\\effectcraft-cli.exe';
const PROJ = 'D:\\ijplabs\\capstone\\docs\\videos\\brand-promo-mahasiswa\\qa-frames\\test_complete_card.ecproj';
const OUT_MP4 = 'D:\\ijplabs\\capstone\\docs\\videos\\brand-promo-mahasiswa\\qa-frames\\test_complete_card.mp4';
const QA_PNG = 'D:\\ijplabs\\capstone\\docs\\videos\\brand-promo-mahasiswa\\qa-frames\\test_complete_card.png';

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
      clientInfo: { name: 'test', version: '1.0' },
    });
    this.proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
  }

  close() {
    this.proc.stdin.end();
  }
}

async function run() {
  const c = new EffectCraftClient();
  await c.init();
  await c.call('execute_command', {
    command: 'comp.new',
    params: { name: 'TestCompleteCard', width: 1920, height: 1080, duration: 1.0, background: '#f9f9f6' },
  });

  const x = 390;
  const y = 835;
  const w = 600;
  const h = 195;

  // 1. Soft Elevation Shadow
  const shadow = await c.call('execute_command', {
    command: 'layer.newShape',
    params: {
      kind: 'rounded',
      name: 'Card Shadow',
      size: [w, h],
      position: [x + 4, y + 6],
      fill: '#1e293b',
    },
  });
  await c.call('set_property', { layer: shadow.layer, path: 'transform/opacity', value: 12 });

  // 2. White Card Body
  const body = await c.call('execute_command', {
    command: 'layer.newShape',
    params: {
      kind: 'rounded',
      name: 'Card Body',
      size: [w, h],
      position: [x, y],
      fill: '#ffffff',
      stroke: '#4a7c59',
      strokeWidth: 2,
    },
  });
  await c.call('set_property', { layer: body.layer, path: 'transform/opacity', value: 97 });

  const cardLeft = x - w / 2;
  const cardTop = y - h / 2;
  const contentLeft = cardLeft + 28;
  const contentTop = cardTop + 24;
  const contentW = w - 56;

  // 3. Badge Pill Shape
  const badgeTextStr = 'RUANG AMAN MAHASISWA PJJ';
  const badgeW = badgeTextStr.length * 8.5 + 24;
  await c.call('execute_command', {
    command: 'layer.newShape',
    params: {
      kind: 'rounded',
      name: 'Badge Pill',
      size: [badgeW, 26],
      position: [contentLeft + badgeW / 2, contentTop + 13],
      fill: '#e3ece5',
      stroke: '#4a7c59',
      strokeWidth: 1,
    },
  });

  // 4. Badge Text
  await c.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: 'Badge Text',
      text: badgeTextStr,
      position: [contentLeft + badgeW / 2, contentTop + 18],
      font: 'Segoe UI',
      size: 13,
      fauxBold: true,
      fill: '#31523a',
      justify: 'center',
    },
  });

  // 5. Title Text
  await c.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: 'Title Text',
      text: 'Mulai Tanpa Rasa Ragu.',
      box: [contentLeft, contentTop + 36, contentW, 40],
      font: 'Segoe UI',
      size: 26,
      fauxBold: true,
      fill: '#0f172a',
      justify: 'left',
    },
  });

  // 6. Description Text
  await c.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: 'Desc Text',
      text: 'Klik tombol Masuk / Daftar di pojok kanan atas.\nLangsung siap digunakan di browser PWA.',
      box: [contentLeft, contentTop + 80, contentW, 65],
      font: 'Segoe UI',
      size: 17,
      fill: '#334155',
      justify: 'left',
    },
  });

  await c.call('save_project', { path: PROJ });
  c.close();

  execSync(`"${EFFECTCRAFT_CLI}" --project "${PROJ}" render --comp "TestCompleteCard" --out "${OUT_MP4}" --format h264 --fps 60`, { stdio: 'inherit' });
  execSync(`ffmpeg -y -ss 0.5 -i "${OUT_MP4}" -frames:v 1 "${QA_PNG}" -loglevel error`);
  console.log('Test complete card generated successfully!');
}

run().catch(console.error);
