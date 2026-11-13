import { chromium } from 'playwright';

async function renderBadgeIcon() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ deviceScaleFactor: 3 });
  await page.setContent(`
    <html><body style="margin:0;padding:20px;background:transparent;">
      <div id="icon" style="width:120px;height:120px;border-radius:34px;background:linear-gradient(135deg, #4A7C59 0%, #3B5998 100%);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(74, 124, 89, 0.3);">
        <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      </div>
    </body></html>
  `);
  const icon = page.locator('#icon');
  await icon.screenshot({ path: 'D:/ijplabs/capstone/docs/videos/brand-promo-mahasiswa/safespace-badge-icon.png', omitBackground: true });
  await browser.close();
  console.log('Badge icon saved!');
}
renderBadgeIcon();
