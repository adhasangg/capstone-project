import { execSync } from 'node:child_process';
import * as path from 'node:path';

const times = [48, 50, 52, 55, 60, 65, 70, 75, 80, 85, 90, 100];
for (const t of times) {
  const out = `C:/Users/ad/.gemini/antigravity/brain/0c30686d-e9a6-411c-bb16-96626918ff48/scan_${t}s.png`;
  execSync(`ffmpeg -y -ss ${t} -i docs/videos/student_pov_cfr.mp4 -frames:v 1 "${out}" -loglevel error`);
  console.log(`Extracted scan_${t}s.png`);
}
