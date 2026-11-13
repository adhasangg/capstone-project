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

async function run() {
  const c = new EffectCraftClient();
  await c.init();
  await c.call('execute_command', {
    command: 'comp.new',
    params: { name: 'TestAnchor', width: 1920, height: 1080, duration: 1.0, background: '#f9f9f6' },
  });

  // Card Body at center [390, 835], size [600, 195] -> bounds: X 90..690, Y 737..932
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

  // Test A: justify: 'center' at center X = 390
  await c.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: 'Text Centered at 390',
      text: 'Option A: Centered at 390',
      position: [390, 770],
      font: 'Segoe UI',
      size: 24,
      fill: '#d97706',
      justify: 'center',
    },
  });

  // Test B: justify: 'left' at X = 130
  await c.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: 'Text Left at 130',
      text: 'Option B: Left at 130 (justify left)',
      position: [130, 820],
      font: 'Segoe UI',
      size: 24,
      fill: '#0f172a',
      justify: 'left',
    },
  });

  // Test C: no justify at X = 390
  await c.call('execute_command', {
    command: 'layer.newText',
    params: {
      name: 'Text Center at 390 without justify',
      text: 'Option C: Center at 390 (no justify)',
      position: [390, 870],
      font: 'Segoe UI',
      size: 24,
      fill: '#4a7c59',
    },
  });

  await c.call('execute_command', {
    command: 'render.exportVideo',
    params: {
      outputPath: 'D:\\ijplabs\\capstone\\docs\\videos\\brand-promo-mahasiswa\\qa-frames\\test_anchor.mp4',
      format: 'mp4',
    },
  });
  console.log('Rendered test_anchor.mp4');
  c.close();
}

run().catch(console.error);
