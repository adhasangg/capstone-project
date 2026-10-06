const { chromium } = require('playwright');

async function verifyLiterature() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const searchTopics = [
    {
      topic: 'DASS-21 Validasi Indonesia Mahasiswa (2019-2025)',
      query:
        'https://api.crossref.org/works?query=validitas+reliabilitas+DASS-21+mahasiswa&filter=from-pub-date:2019&rows=3',
    },
    {
      topic: 'Academic Burnout Mahasiswa PJJ / Bekerja (2020-2025)',
      query:
        'https://api.crossref.org/works?query=academic+burnout+mahasiswa+pembelajaran+daring&filter=from-pub-date:2020&rows=3',
    },
    {
      topic: 'System Usability Scale SUS Evaluasi Sistem Informasi (2019-2025)',
      query:
        'https://api.crossref.org/works?query=evaluasi+usability+SUS+System+Usability+Scale+aplikasi&filter=from-pub-date:2019&rows=3',
    },
    {
      topic: 'Gaya Belajar VAK E-Learning Mahasiswa (2020-2025)',
      query:
        'https://api.crossref.org/works?query=gaya+belajar+VAK+pembelajaran+mahasiswa&filter=from-pub-date:2020&rows=3',
    },
    {
      topic: 'Trauma Informed Design & Calm UI Digital Health (2019-2025)',
      query:
        'https://api.crossref.org/works?query=trauma+informed+design+digital+health&filter=from-pub-date:2019&rows=3',
    },
  ];

  console.log('=== VERIFIKASI LITERATUR TERKINI (MAKS 5-10 TAHUN) VIA PLAYWRIGHT ===\n');

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

verifyLiterature().catch(console.error);
