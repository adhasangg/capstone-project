import { spawn } from 'node:child_process';

const p = spawn('D:\\ArtCraft\\EffectCraft\\effectcraft-cli.exe', ['--empty', 'mcp'], { stdio: ['pipe', 'pipe', 'pipe'] });
let buf = '';
p.stdout.on('data', d => {
  buf += d.toString();
  const lines = buf.split('\n');
  for (const l of lines) {
    if (!l.trim()) continue;
    try {
      const m = JSON.parse(l);
      if (m.id === 2) {
        console.log('layer.newText schema:');
        console.log(m.result?.content?.[0]?.text);
        p.stdin.write(JSON.stringify({jsonrpc: '2.0', id: 3, method: 'tools/call', params: {name: 'list_commands', arguments: {}}}) + '\n');
      }
      if (m.id === 3) {
        console.log('All commands:');
        console.log(m.result?.content?.[0]?.text);
        process.exit(0);
      }
    } catch (e) {}
  }
});

p.stdin.write(JSON.stringify({jsonrpc: '2.0', id: 1, method: 'initialize', params: {protocolVersion: '2024-11-05', capabilities: {}, clientInfo: {name: 'test', version: '1.0'}}}) + '\n');
p.stdin.write(JSON.stringify({jsonrpc: '2.0', method: 'notifications/initialized'}) + '\n');
p.stdin.write(JSON.stringify({jsonrpc: '2.0', id: 2, method: 'tools/call', params: {name: 'describe_command', arguments: {command: 'layer.newText'}}}) + '\n');
