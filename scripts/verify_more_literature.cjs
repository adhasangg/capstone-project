const { chromium } = require('playwright');

async function verifyMoreLiterature() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const searchTopics = [
    {
      topic: 'Color Psychology UI UX Health Emotion (2018-2025)',
      query:
        'https://api.crossref.org/works?query=color+psychology+emotion+visual+interface&filter=from-pub-date:2018&rows=3',
    },
    {
      topic: 'Cognitive Load Theory Multimedia Learning (2019-2025)',
      query:
        'https://api.crossref.org/works?query=cognitive+load+theory+online+learning+multimedia&filter=from-pub-date:2019&rows=3',
    },
    {
      topic: 'Progressive Web Apps PWA Healthcare Education (2020-2025)',
      query:
        'https://api.crossref.org/works?query=Progressive+Web+Apps+PWA+performance+user+experience&filter=from-pub-date:2020&rows=3',
    },
  ];

  console.log('=== VERIFIKASI LITERATUR TAMBAHAN (2018-2025) VIA PLAYWRIGHT ===\n');

  for (const item of searchTopics) {
    try {
      const response = await page.goto(item.query, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      const text = await response.text();
      const data = JSON.parse(text);
      console.log(`📌 Topik: ${item.topic}`);
      const works = data.message?.items || [];
      works.forEach((w, idx) => {
        const title = w.title?.[0] || 'Tanpa Judul';
        const year =
          w.issued?.['date-parts']?.[0]?.[0] || w.published?.['date-parts']?.[0]?.[0] || 'N/A';
        const authors = (w.author || [])
          .map((a) => `${a.family || ''}, ${a.given || ''}`.trim())
          .filter(Boolean)
          .slice(0, 3)
          .join('; ');
        const container = w['container-title']?.[0] || 'Jurnal Ilmiah';
        const doi = w.DOI ? `https://doi.org/${w.DOI}` : '';
        console.log(`   [${idx + 1}] ${authors} (${year}). "${title}". ${container}. ${doi}`);
      });
      console.log('');
    } catch (err) {
      console.error(`Error fetching for ${item.topic}:`, err.message);
    }
  }

  await browser.close();
}

verifyMoreLiterature().catch(console.error);
