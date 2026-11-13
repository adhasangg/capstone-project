import { chromium } from 'playwright';
import * as path from 'path';

async function renderLogo() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ deviceScaleFactor: 3 });
  await page.goto('file:///' + path.resolve('D:/ijplabs/capstone/scripts/render-logo.html').replace(/\\/g, '/'));
  await page.waitForLoadState('networkidle');
  
  const logoEl = page.locator('#logo');
  const outPath = 'D:/ijplabs/capstone/docs/videos/brand-promo-mahasiswa/safespace-brand-logo.png';
  await logoEl.screenshot({ path: outPath, omitBackground: true });
  console.log('Saved logo to', outPath);
  await browser.close();
}
renderLogo();
