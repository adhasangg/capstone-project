import { spawn, execSync } from 'node:child_process';
import * as path from 'node:path';

const EFFECTCRAFT_CLI = 'D:\\ArtCraft\\EffectCraft\\effectcraft-cli.exe';
const PROJ = 'D:\\ijplabs\\capstone\\docs\\videos\\brand-promo-mahasiswa\\qa-frames\\test_box.ecproj';
const OUT_MP4 = 'D:\\ijplabs\\capstone\\docs\\videos\\brand-promo-mahasiswa\\qa-frames\\test_box.mp4';
const QA_PNG = 'D:\\ijplabs\\capstone\\docs\\videos\\brand-promo-mahasiswa\\qa-frames\\test_box.png';

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
    params: { name: 'TestBoxComp', width: 1920, height: 1080, duration: 1.0, background: '#f9f9f6' },
  });

  // Card Body at center [390, 835], size [600, 195]
  await c.call('execute_command', {
    command: 'layer.newShape',
    params: {
      kind: 'rounded',
      name: 'Card Body',
      size: [600, 195],
      position: [390, 835],
      fill: '#ffffff',
      stroke: '#4a7c59',
      strokeWidth: 2,
    },
  });

  // Test 1: box parameter
  try {
    const tBox = await c.call('execute_command', {
      command: 'layer.newText',
      params: {
        name: 'Text With Box',
        text: 'This is tested with box parameter [130, 755, 520, 150]',
        box: [130, 755, 520, 150],
        font: 'Segoe UI',
        size: 22,
        fill: '#0f172a',
      },
    });
    console.log('box param succeeded:', tBox);
  } catch (e) {
    console.log('box param failed:', e);
  }

  // Test 2: What is the layer anchor point and position of a regular text?
  const tRegular = await c.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: 'Text Regular',
      text: 'Centered at 390 (position [390, 840])',
      position: [390, 840],
      font: 'Segoe UI',
      size: 24,
      fill: '#d97706',
      justify: 'center',
    },
  });
  console.log('regular text layer:', tRegular);

  await c.call('save_project', { path: PROJ });
  c.close();

  console.log('Project saved, rendering with CLI...');
  execSync(`"${EFFECTCRAFT_CLI}" --project "${PROJ}" render --comp "TestBoxComp" --out "${OUT_MP4}" --format h264 --fps 60`, { stdio: 'inherit' });
  execSync(`ffmpeg -y -ss 0.5 -i "${OUT_MP4}" -frames:v 1 "${QA_PNG}" -loglevel error`);
  console.log('Extracted QA_PNG successfully!');
}

run().catch(console.error);
