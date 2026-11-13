import { spawn } from 'node:child_process';
import * as path from 'node:path';

const EFFECTCRAFT_CLI = 'D:\\ArtCraft\\EffectCraft\\effectcraft-cli.exe';

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

async function testCard() {
  const c = new EffectCraftClient();
  await c.init();
  await c.call('execute_command', {
    command: 'comp.new',
    params: { name: 'TestSafeSpaceTheme', width: 1920, height: 1080, duration: 2.0, background: '#f9f9f6' },
  });

  // White Card Shadow
  const shadow = await c.call('execute_command', {
    command: 'layer.newShape',
    params: {
      kind: 'rounded',
      name: 'Card Shadow',
      size: [600, 190],
      position: [384, 836],
      fill: '#1e293b',
    },
  });
  await c.call('set_property', { layer: shadow.layer, path: 'transform/opacity', value: 12 });

  // White Card Body
  const card = await c.call('execute_command', {
    command: 'layer.newShape',
    params: {
      kind: 'rounded',
      name: 'Card Body',
      size: [600, 190],
      position: [380, 830],
      fill: '#ffffff',
      stroke: '#4a7c59',
      strokeWidth: 2,
    },
  });

  // Badge Text
  await c.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: 'Badge',
      text: 'RUANG AMAN MAHASISWA PJJ',
      position: [110, 770],
      font: 'Segoe UI',
      size: 16,
      fauxBold: true,
      fill: '#31523a',
    },
  });

  // Title Text
  await c.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: 'Title',
      text: 'Mulai Tanpa Rasa Ragu.',
      position: [110, 815],
      font: 'Segoe UI',
      size: 30,
      fauxBold: true,
      fill: '#0f172a',
    },
  });

  // Desc Text
  await c.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: 'Desc',
      text: 'Klik tombol Masuk / Daftar di pojok kanan atas.\nLangsung siap digunakan di browser PWA.',
      position: [110, 865],
      font: 'Segoe UI',
      size: 19,
      fill: '#334155',
    },
  });

  console.log('Test composition built successfully!');
  c.close();
}

testCard().catch(console.error);
