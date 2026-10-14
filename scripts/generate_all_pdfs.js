const fs = require('node:fs');
const path = require('node:path');
const { marked } = require('marked');
const katex = require('katex');
const { chromium } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

const FILES_TO_CONVERT = [
  {
    input: path.join(DOCS_DIR, 'Naskah_Resmi_Bab3_Metodologi.md'),
    output: path.join(DOCS_DIR, 'Naskah_Resmi_Bab3_Metodologi.pdf'),
    title: 'BAB III METODOLOGI - SAFESPACE PWA',
    subtitle: 'Naskah Resmi Capstone Project Program Studi Sistem Informasi FST UT (2026)',
  },
  {
    input: path.join(DOCS_DIR, 'Panduan_Operasional_UAT_Tim.md'),
    output: path.join(DOCS_DIR, 'Panduan_Operasional_UAT_Tim.pdf'),
    title: 'PANDUAN OPERASIONAL UAT (SUS) - SAFESPACE PWA',
    subtitle: 'Panduan Eksekusi Kuesioner dan Olah Data Skor SUS untuk Tim',
  },
  {
    input: path.join(DOCS_DIR, 'Bank_Bahan_Presentasi_dan_Laporan.md'),
    output: path.join(DOCS_DIR, 'Bank_Bahan_Presentasi_dan_Laporan.pdf'),
    title: 'BANK BAHAN DEVELOPMENT - SAFESPACE PWA',
    subtitle: 'Kumpulan Metrik, Fitur Unggulan, Aset Gambar, dan Diagram untuk Slide & Laporan',
  },
  {
    input: path.join(DOCS_DIR, 'Matriks_Black_Box_Testing.md'),
    output: path.join(DOCS_DIR, 'Matriks_Black_Box_Testing.pdf'),
    title: 'MATRIKS BLACK-BOX TESTING - SAFESPACE PWA',
    subtitle: 'Rancangan dan Hasil Uji Fungsionalitas Sistem (13 Skenario Pengujian Lolos 100%)',
  },
  {
    input: path.join(DOCS_DIR, 'Kuesioner_SUS_dan_Panduan_UAT.md'),
    output: path.join(DOCS_DIR, 'Kuesioner_SUS_dan_Panduan_UAT.pdf'),
    title: 'KUESIONER SUS & PANDUAN UAT - SAFESPACE PWA',
    subtitle: 'Instrumen Pengujian Kelaikan dan Usabilitas Sistem (System Usability Scale)',
  },
  {
    input: path.join(DOCS_DIR, 'Instrumen_Baku_DASS21_dan_VAK.md'),
    output: path.join(DOCS_DIR, 'Instrumen_Baku_DASS21_dan_VAK.pdf'),
    title: 'INSTRUMEN BAKU KLINIS DASS-21 & VAK - SAFESPACE PWA',
    subtitle: 'Spesifikasi Pembobotan, Formula Skor, dan Parameter Deteksi Kejenuhan Belajar',
  },
  {
    input: path.join(DOCS_DIR, 'Daftar_Pustaka_Mutakhir_5_Tahun.md'),
    output: path.join(DOCS_DIR, 'Daftar_Pustaka_Mutakhir_5_Tahun.pdf'),
    title: 'DAFTAR PUSTAKA MUTAKHIR - SAFESPACE PWA',
    subtitle: 'Kompilasi Rujukan Ilmiah Terindeks Bereputasi (IEEE, ACM, Scopus, SINTA)',
  },
];

// Read assets
const katexCssPath = path.join(ROOT_DIR, 'node_modules', 'katex', 'dist', 'katex.min.css');
const katexCss = fs.existsSync(katexCssPath) ? fs.readFileSync(katexCssPath, 'utf8') : '';

const mermaidJsPath = path.join(ROOT_DIR, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js');
const mermaidJs = fs.existsSync(mermaidJsPath) ? fs.readFileSync(mermaidJsPath, 'utf8') : '';

// Configure marked with custom renderer
const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
  if (lang === 'mermaid') {
    return `<div class="mermaid-wrapper"><pre class="mermaid">${text}</pre></div>`;
  }
  return `<pre><code class="language-${lang || 'text'}">${escapeHtml(text)}</code></pre>`;
};

marked.use({ renderer });

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function processMath(markdownText) {
  // Replace $$...$$ block formulas
  let processed = markdownText.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    try {
      return `<div class="math-block">${katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch (_e) {
      return match;
    }
  });

  // Replace $...$ inline formulas (avoiding escaped dollars)
  processed = processed.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false });
    } catch (_e) {
      return match;
    }
  });

  return processed;
}

function buildHtml(contentHtml, docMeta) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(docMeta.title)}</title>
  <style>
    ${katexCss}

    @page {
      size: A4;
      margin: 24mm 20mm 24mm 20mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.65;
      color: #1E293B;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
    }

    .doc-header {
      border-bottom: 2px solid #0D9488;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }

    .doc-header h1 {
      font-size: 18pt;
      color: #0F172A;
      margin: 0 0 6px 0;
      font-weight: 800;
      letter-spacing: -0.3px;
    }

    .doc-header p {
      font-size: 10pt;
      color: #64748B;
      margin: 0;
      font-style: italic;
    }

    h1 {
      font-size: 16pt;
      color: #0F172A;
      margin-top: 24px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #E2E8F0;
      page-break-after: avoid;
    }

    h2 {
      font-size: 13pt;
      color: #1E3A8A;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 11.5pt;
      color: #0D9488;
      margin-top: 16px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }

    h4 {
      font-size: 10.5pt;
      color: #334155;
      margin-top: 12px;
      margin-bottom: 6px;
      font-weight: bold;
      page-break-after: avoid;
    }

    p {
      margin-top: 0;
      margin-bottom: 10px;
      text-align: justify;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 12px;
      padding-left: 24px;
    }

    li {
      margin-bottom: 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      margin-bottom: 18px;
      font-size: 8.5pt;
      page-break-inside: auto;
    }

    thead {
      display: table-header-group;
    }

    tr {
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid #CBD5E1;
      padding: 7px 10px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: #F1F5F9;
      color: #1E293B;
      font-weight: bold;
    }

    tr:nth-child(even) td {
      background-color: #F8FAFC;
    }

    blockquote {
      border-left: 4px solid #0D9488;
      background-color: #F0FDFA;
      padding: 10px 14px;
      margin: 14px 0;
      border-radius: 0 8px 8px 0;
      font-style: normal;
      color: #0F5132;
      page-break-inside: avoid;
    }

    blockquote p {
      margin-bottom: 0;
    }

    pre {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 10px 12px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 8.5pt;
      overflow-x: auto;
      margin: 12px 0;
      page-break-inside: avoid;
    }

    code {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9pt;
      background-color: #F1F5F9;
      padding: 2px 5px;
      border-radius: 4px;
      color: #BE185D;
    }

    pre code {
      background-color: transparent;
      padding: 0;
      color: #334155;
    }

    .math-block {
      margin: 14px 0;
      text-align: center;
      page-break-inside: avoid;
    }

    .mermaid-wrapper {
      text-align: center;
      margin: 16px 0;
      padding: 12px;
      background-color: #FAFAFA;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      page-break-inside: avoid;
    }

    .mermaid {
      font-family: inherit;
    }

    hr {
      border: none;
      border-top: 1px solid #E2E8F0;
      margin: 20px 0;
    }

    a {
      color: #0D9488;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <h1>${escapeHtml(docMeta.title)}</h1>
    <p>${escapeHtml(docMeta.subtitle)}</p>
  </div>
  <div class="doc-content">
    ${contentHtml}
  </div>

  <script>
    ${mermaidJs}
  </script>
  <script>
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        flowchart: { useMaxWidth: true, htmlLabels: true },
        securityLevel: 'loose'
      });
      window.addEventListener('DOMContentLoaded', async () => {
        try {
          await mermaid.run();
        } catch (e) {
          console.error('Mermaid render error:', e);
        }
        window.__MERMAID_DONE__ = true;
      });
    } else {
      window.__MERMAID_DONE__ = true;
    }
  </script>
</body>
</html>`;
}

async function convertFile(fileMeta, browser) {
  console.log(`Processing: ${fileMeta.input}...`);
  if (!fs.existsSync(fileMeta.input)) {
    console.error(`File not found: ${fileMeta.input}`);
    return;
  }

  const rawMd = fs.readFileSync(fileMeta.input, 'utf8');
  const withMath = processMath(rawMd);
  const htmlContent = marked.parse(withMath);
  const fullHtml = buildHtml(htmlContent, fileMeta);

  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle' });

  // Wait for mermaid rendering to finish
  try {
    await page.waitForFunction(() => window.__MERMAID_DONE__ === true, { timeout: 10000 });
    // Additional short delay to ensure SVG sizes stabilize
    await new Promise((r) => setTimeout(r, 600));
  } catch (e) {
    console.warn(`Mermaid render wait warning for ${fileMeta.input}: ${e.message}`);
  }

  await page.pdf({
    path: fileMeta.output,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '24mm',
      bottom: '24mm',
      left: '20mm',
      right: '20mm',
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 8pt; color: #64748B; width: 100%; padding: 0 20mm; display: flex; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px;">
        <span>SafeSpace PWA - Capstone Project FST UT</span>
        <span>Dokumen Resmi 2026</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 8pt; color: #64748B; width: 100%; padding: 0 20mm; display: flex; justify-content: space-between; border-top: 1px solid #E2E8F0; padding-top: 4px;">
        <span>Universitas Terbuka</span>
        <span>Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></span>
      </div>
    `,
  });

  await page.close();
  console.log(`SUCCESS: Created ${fileMeta.output}`);
}

async function main() {
  console.log('Launching headless Chromium...');
  const browser = await chromium.launch({ headless: true });

  for (const f of FILES_TO_CONVERT) {
    await convertFile(f, browser);
  }

  await browser.close();
  console.log('All PDF files generated successfully!');
}

main().catch((err) => {
  console.error('PDF Generation failed:', err);
  process.exit(1);
});
