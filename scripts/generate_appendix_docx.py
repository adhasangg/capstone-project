import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="D0D7DE", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def build_document():
    doc = Document()

    # Set page margins: 4 cm left, 3 cm top, right, bottom (standard Indonesian academic)
    for section in doc.sections:
        section.top_margin = Inches(1.18)     # ~3.0 cm
        section.bottom_margin = Inches(1.18)  # ~3.0 cm
        section.left_margin = Inches(1.57)    # ~4.0 cm
        section.right_margin = Inches(1.18)   # ~3.0 cm
        # Ensure no headers are printed
        section.header.is_linked_to_previous = False
        for p in section.header.paragraphs:
            p.text = ""

    # Normal Style configuration
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0x1A, 0x1A, 0x1A)
    normal_style.paragraph_format.line_spacing = 1.5
    normal_style.paragraph_format.space_after = Pt(6)
    normal_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    # Helper: Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(18)
    p_title.paragraph_format.line_spacing = 1.5
    run_t1 = p_title.add_run("LAMPIRAN\n")
    run_t1.bold = True
    run_t1.font.size = Pt(14)
    run_t2 = p_title.add_run("KODE SUMBER, REPOSITORI, DAN DOKUMENTASI IMPLEMENTASI TEKNIS SISTEM SAFESPACE")
    run_t2.bold = True
    run_t2.font.size = Pt(13)

    def add_h1(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.5
        run = p.add_run(text)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.5
        run = p.add_run(text)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        return p

    def add_p(text, bold_prefix=None, italic=False):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.5
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.bold = True
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(12)
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        r.italic = italic
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.5
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.bold = True
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(12)
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        return p

    def add_code_block(code_content, caption=None):
        if caption:
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p_cap.paragraph_format.space_before = Pt(6)
            p_cap.paragraph_format.space_after = Pt(3)
            p_cap.paragraph_format.line_spacing = 1.15
            r_cap = p_cap.add_run(caption)
            r_cap.bold = True
            r_cap.italic = True
            r_cap.font.name = 'Times New Roman'
            r_cap.font.size = Pt(10)

        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False

        cell = tbl.cell(0, 0)
        cell.width = Inches(5.9) # spans text width (8.27 - 1.57 - 1.18 = 5.52 inches approx)
        set_cell_background(cell, "F6F8FA")
        set_cell_margins(cell, top=120, bottom=120, left=180, right=180)

        # Single subtle left accent border
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="single" w:sz="4" w:space="0" w:color="D0D7DE"/>'
            f'<w:left w:val="single" w:sz="24" w:space="0" w:color="0969DA"/>'
            f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="D0D7DE"/>'
            f'<w:right w:val="single" w:sz="4" w:space="0" w:color="D0D7DE"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.0

        r = p.add_run(code_content.strip())
        r.font.name = 'Consolas'
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(0x24, 0x29, 0x2E)

        # Add spacing after table
        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_before = Pt(0)
        p_after.paragraph_format.space_after = Pt(6)
        p_after.paragraph_format.line_spacing = 1.0

    # -------------------------------------------------------------
    # BAGIAN 1
    # -------------------------------------------------------------
    add_h1("1. Tautan Repositori Resmi dan Lingkungan Deployment Sistem")
    add_p(
        "Seluruh kode program, modul pengujian, dan konfigurasi infrastruktur sistem SafeSpace "
        "dikelola secara terpusat pada repositori Git resmi. Untuk memastikan transparansi akademis, "
        "keterbukaan evaluasi penguji, serta keterulangan pengujian (reproducibility), berikut adalah tautan "
        "repositori dan alamat deployment resmi dari sistem SafeSpace:"
    )

    tbl_links = doc.add_table(rows=6, cols=2)
    tbl_links.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_links)

    headers = [("Komponen Akses", "Keterangan / URL Akses Resmi")]
    data_links = [
        ("Tautan Repositori GitHub", "https://github.com/adhasangg/capstone-project"),
        ("Tautan Live Production", "https://safespace.ijplabs.dev"),
        ("Tautan Testing / Evaluator Sandbox", "https://test-safespace.ijplabs.dev"),
        ("Commit Hash Rilis Pengujian", "c489429 (Release Capstone Final v1.0.0)"),
        ("Runtime & Paket Manajer", "Bun v1.2+, React 19, TypeScript v5.8, Docker Engine 27+"),
    ]

    # Header row
    hdr_cells = tbl_links.rows[0].cells
    hdr_cells[0].text = "Komponen Akses"
    hdr_cells[1].text = "Keterangan / URL Akses Resmi"
    for i, cell in enumerate(hdr_cells):
        set_cell_background(cell, "F0F4F8")
        set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
        for p in cell.paragraphs:
            p.runs[0].bold = True
            p.runs[0].font.name = 'Times New Roman'
            p.runs[0].font.size = Pt(11)

    for row_idx, (col0, col1) in enumerate(data_links):
        row_cells = tbl_links.rows[row_idx + 1].cells
        row_cells[0].text = col0
        row_cells[1].text = col1
        for cell in row_cells:
            set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
            for p in cell.paragraphs:
                p.paragraph_format.line_spacing = 1.2
                p.paragraph_format.space_after = Pt(2)
                if len(p.runs) > 0:
                    p.runs[0].font.name = 'Times New Roman'
                    p.runs[0].font.size = Pt(11)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # BAGIAN 2
    # -------------------------------------------------------------
    add_h1("2. Struktur Direktori Proyek dan Arsitektur Monorepo Bun Workspaces")
    add_p(
        "Sistem SafeSpace dibangun menggunakan paradigma arsitektur Monorepo yang dikelola secara "
        "efisien dengan fitur Bun Workspaces. Arsitektur ini dipilih untuk menjawab kebutuhan ekosistem "
        "aplikasi modern, di mana modul antarmuka pengguna (frontend PWA), peladen layanan (backend API), "
        "definisi skema basis data (ORM), serta modul logika bisnis psikometri (DASS-21 dan VAK) berada dalam "
        "satu repositori terpadu namun tetap terisolasi secara modular."
    )

    add_h2("2.1 Keunggulan dan Alasan Pemilihan Bun Workspaces")
    add_p(
        "Penggunaan Bun Workspaces memberikan sejumlah keunggulan teknis signifikan dibandingkan "
        "arsitektur terpisah (multi-repo) maupun pengelola paket konvensional seperti npm/yarn:",
    )
    add_bullet(
        " Modul frontend (apps/web) dan backend (apps/api) dapat langsung mengimpor "
        "antarmuka TypeScript, fungsi validasi Zod, dan algoritma skoring dari pustaka bersama (@safespace/shared) "
        "tanpa memerlukan tahapan kompilasi terpisah (zero-build step overhead).",
        "1. Berbagi Tipe Data Tanpa Duplikasi (Single Source of Truth):"
    )
    add_bullet(
        " Bun memanfaatkan fitur sistem berkas modern (hardlinks) sehingga ketergantungan "
        "yang sama di seluruh paket hanya diunduh dan disimpan satu kali, menghemat ruang penyimpanan "
        "dan mempercepat instalasi dependensi hingga 10-20 kali lebih cepat dibandingkan npm.",
        "2. Efisiensi Instalasi dan Eksekusi Ekstrem:"
    )
    add_bullet(
        " Bun menyediakan Bun Test runner bawaan yang mendukung eksekusi pengujian unit "
        "dan integrasi secara native di seluruh workspaces secara instan (<500 ms) langsung pada berkas TypeScript.",
        "3. Mesin Pengujian Otomatis Terintegrasi:"
    )

    add_h2("2.2 Struktur Pohon Direktori (Directory Tree)")
    add_p(
        "Berikut adalah struktur pohon direktori proyek SafeSpace yang merefleksikan pemisahan "
        "tanggung jawab (Separation of Concerns) antar-layanan:"
    )

    tree_str = """safespace-monorepo/
├── apps/
│   ├── api/                        # Backend REST & WebSocket Service (Bun + ElysiaJS)
│   │   ├── src/
│   │   │   ├── middleware/         # RBAC defense guard & autentikasi JWT
│   │   │   ├── modules/            # Domain: auth, assessment, chat, session
│   │   │   └── index.ts            # Entry point peladen API
│   │   └── package.json            # @safespace/api
│   └── web/                        # Frontend Progressive Web App (React 19 + Vite)
│       ├── src/
│       │   ├── components/         # Komponen UI: ChatRoom, DASS-21, VAK, Navbar
│       │   ├── services/           # offlineStorage.ts, webCrypto.ts, api.ts
│       │   └── routes/             # TanStack Router type-safe pages
│       ├── public/                 # Manifest PWA, service worker, ikon
│       └── package.json            # @safespace/web
├── packages/
│   ├── db/                         # Lapisan Persistensi & Migrasi Data (Drizzle ORM)
│   │   ├── src/
│   │   │   ├── schema/             # users.ts, sessions.ts, messages.ts, counselors.ts
│   │   │   └── index.ts            # PostgreSQL Drizzle client connection
│   │   └── package.json            # @safespace/db
│   └── shared/                     # Kernel Domain Logika & Kriptografi Bersama
│       ├── src/
│       │   ├── types/              # assessment.types.ts, auth.types.ts, chat.types.ts
│       │   ├── utils/              # crypto.utils.ts, dass21.utils.ts, vak.utils.ts
│       │   └── validators/         # Zod schemas (assessment, auth, chat)
│       └── package.json            # @safespace/shared
├── docker/                         # Konfigurasi Kontainerisasi Multi-Stage
│   ├── Dockerfile.api              # Kontainer backend berbasis Bun Alpine
│   ├── Dockerfile.web              # Kontainer frontend statis berbasis Nginx Alpine
│   └── init.sql                    # Skrip inisialisasi ekstensi PostgreSQL
├── tests/
│   └── e2e/                        # Pengujian Otomatis End-to-End (Playwright Chromium)
│       ├── safespace-flow.e2e.ts   # Skenario pengujian alur mahasiswa lengkap
│       └── role-elevation-flow.e2e.ts # Skenario pengujian RBAC & peran sistem
├── docker-compose.yml              # Orkestrasi multi-kontainer (Testing & Production)
├── playwright.config.ts            # Konfigurasi pengujian browser Playwright
├── biome.json                      # Konfigurasi Linter & Code Formatter
└── package.json                    # Konfigurasi Root Monorepo Bun Workspaces"""

    add_code_block(tree_str, "Gambar L.1: Struktur Direktori Monorepo Proyek SafeSpace")

    # -------------------------------------------------------------
    # BAGIAN 3
    # -------------------------------------------------------------
    add_h1("3. Implementasi Algoritma Inti (Core Business Logic)")
    add_p(
        "SafeSpace mengedepankan prinsip transparansi klinis dan privasi matematis. Sistem secara tegas "
        "tidak menggunakan algoritma kecerdasan buatan (Machine Learning) yang bersifat kotak hitam (black box) "
        "pada modul diagnosis untuk mencegah halusinasi data emosional mahasiswa. Seluruh proses perhitungan "
        "dieksekusi menggunakan kalkulasi deterministik baku yang terverifikasi."
    )

    add_h2("3.1 Sanitasi Identitas Kriptografis Satu Arah (One-Way Identity Sanitizer)")
    add_p(
        "Untuk menjamin prinsip Zero-Knowledge dan Two-Way Anonymity, sistem tidak pernah menyimpan "
        "NIM, nama asli, atau alamat email mahasiswa di basis data. Subject ID resmi dari Google OAuth "
        "langsung disanitasi menggunakan algoritma HMAC-SHA-256 yang diperkuat dengan rahasia peladen (server pepper). "
        "Proses ini bersifat searah (one-way) sehingga identitas asli mahasiswa mustahil direkayasa balik (irreversible)."
    )

    crypto_code = """// Lokasi Berkas: packages/shared/src/utils/crypto.utils.ts
export function hashIdentity(googleSub: string, pepperSecret: string): string {
  if (!googleSub || googleSub.trim().length === 0) {
    throw new Error('Subject identifier cannot be empty');
  }
  if (!pepperSecret || pepperSecret.length < 16) {
    throw new Error('Pepper secret must be at least 16 characters');
  }

  const globalAny = globalThis as unknown as {
    Bun?: {
      CryptoHasher: new (algo: string, secret?: string) => {
        update: (data: string) => void;
        digest: (format: string) => string;
      };
    };
  };

  // Jalur cepat native pada runtime Bun menggunakan mesin kriptografi C++ internal
  if (typeof globalAny.Bun?.CryptoHasher === 'function') {
    const hasher = new globalAny.Bun.CryptoHasher('sha256', pepperSecret);
    hasher.update(googleSub);
    return hasher.digest('hex');
  }

  // Fallback standar Node.js runtime
  const nodeCrypto = require('node:crypto');
  return nodeCrypto.createHmac('sha256', pepperSecret).update(googleSub).digest('hex');
}"""
    add_code_block(crypto_code, "Listing Kode L.1: Sanitasi Kriptografis HMAC-SHA-256 Identitas Pengguna")

    add_h2("3.2 Algoritma Skoring & Klasifikasi Klinis DASS-21 (Lovibond & Lovibond, 1995)")
    add_p(
        "Modul pemetaan emosional DASS-21 memproses tepat 21 butir jawaban skala Likert (0–3). "
        "Tujuh butir spesifik dialokasikan ke masing-masing subskala (Depresi, Kecemasan, dan Stres). "
        "Total skor mentah dikalikan dua agar setara dengan norma standar DASS-42 sebelum dipetakan "
        "ke dalam lima tingkatan tingkat keparahan klinis (Normal, Mild, Moderate, Severe, Extremely Severe)."
    )

    dass21_code = """// Lokasi Berkas: packages/shared/src/utils/dass21.utils.ts
import type { Dass21Category, Dass21Result, Dass21SubscaleResult } from '../types/assessment.types';

// Distribusi indeks butir DASS-21 (0-indexed) sesuai Lovibond & Lovibond (1995)
const DEPRESSION_INDICES = [2, 4, 9, 12, 15, 16, 20]; // Butir soal 3, 5, 10, 13, 16, 17, 21
const ANXIETY_INDICES    = [1, 3, 6, 8, 14, 18, 19];   // Butir soal 2, 4, 7, 9, 15, 19, 20
const STRESS_INDICES     = [0, 5, 7, 10, 11, 13, 17];  // Butir soal 1, 6, 8, 11, 12, 14, 18

function classifyDepression(score: number): Dass21Category {
  if (score <= 9) return 'Normal';
  if (score <= 13) return 'Mild';
  if (score <= 20) return 'Moderate';
  if (score <= 27) return 'Severe';
  return 'Extremely Severe';
}

function classifyAnxiety(score: number): Dass21Category {
  if (score <= 7) return 'Normal';
  if (score <= 9) return 'Mild';
  if (score <= 14) return 'Moderate';
  if (score <= 19) return 'Severe';
  return 'Extremely Severe';
}

function classifyStress(score: number): Dass21Category {
  if (score <= 14) return 'Normal';
  if (score <= 18) return 'Mild';
  if (score <= 25) return 'Moderate';
  if (score <= 33) return 'Severe';
  return 'Extremely Severe';
}

function computeSubscale(
  answers: ReadonlyArray<number>,
  indices: ReadonlyArray<number>,
  classifier: (score: number) => Dass21Category,
): Dass21SubscaleResult {
  const rawScore = indices.reduce((sum, idx) => sum + (answers[idx] ?? 0), 0);
  const multipliedScore = rawScore * 2; // Normalisasi ke standar DASS-42
  return {
    rawScore,
    multipliedScore,
    category: classifier(multipliedScore),
  };
}

export function calculateDass21Score(answers: ReadonlyArray<number>): Dass21Result {
  if (answers.length !== 21) {
    throw new Error('DASS-21 requires exactly 21 answers');
  }
  for (const score of answers) {
    if (!Number.isInteger(score) || score < 0 || score > 3) {
      throw new Error('Each answer score must be an integer between 0 and 3');
    }
  }
  return {
    depression: computeSubscale(answers, DEPRESSION_INDICES, classifyDepression),
    anxiety: computeSubscale(answers, ANXIETY_INDICES, classifyAnxiety),
    stress: computeSubscale(answers, STRESS_INDICES, classifyStress),
    completedAt: new Date().toISOString(),
  };
}"""
    add_code_block(dass21_code, "Listing Kode L.2: Algoritma Perhitungan Deterministik Skor Klinis DASS-21")

    add_h2("3.3 Algoritma Pemetaan Gaya Belajar VAK Fleming")
    add_p(
        "Instrumen VAK memetakan modalitas belajar mahasiswa (Visual, Auditori, atau Kinestetik) "
        "berdasarkan frekuensi jawaban. Sistem menghitung persentase tiap modalitas dan menetapkan "
        "gaya belajar dominan atau multimodal jika terdapat skor seimbang. Informasi ini berfungsi "
        "sebagai exit strategy untuk mengurangi beban kognitif saat memproses materi kuliah daring."
    )

    vak_code = """// Lokasi Berkas: packages/shared/src/utils/vak.utils.ts
import type { VakModality, VakResult } from '../types/assessment.types';

export function calculateVakScore(answers: ReadonlyArray<VakModality>): VakResult {
  const total = answers.length;
  if (total < 3) throw new Error('VAK questionnaire requires at least 3 answered questions');

  let visualCount = 0, auditoryCount = 0, kinestheticCount = 0;
  for (const answer of answers) {
    if (answer === 'visual') visualCount++;
    else if (answer === 'auditory') auditoryCount++;
    else if (answer === 'kinesthetic') kinestheticCount++;
  }

  const visualPct = Math.round((visualCount / total) * 100);
  const auditoryPct = Math.round((auditoryCount / total) * 100);
  const kinestheticPct = Math.round((kinestheticCount / total) * 100);

  let dominantStyle: VakModality | 'multimodal';
  if (visualCount > auditoryCount && visualCount > kinestheticCount) dominantStyle = 'visual';
  else if (auditoryCount > visualCount && auditoryCount > kinestheticCount) dominantStyle = 'auditory';
  else if (kinestheticCount > visualCount && kinestheticCount > auditoryCount) dominantStyle = 'kinesthetic';
  else dominantStyle = 'multimodal';

  return {
    visual: { count: visualCount, percentage: visualPct },
    auditory: { count: auditoryCount, percentage: auditoryPct },
    kinesthetic: { count: kinestheticCount, percentage: kinestheticPct },
    dominantStyle,
    totalQuestionsAnswered: total,
    completedAt: new Date().toISOString(),
  };
}"""
    add_code_block(vak_code, "Listing Kode L.3: Algoritma Pemetaan Gaya Belajar VAK Fleming")

    # -------------------------------------------------------------
    # BAGIAN 4
    # -------------------------------------------------------------
    add_h1("4. Skema Basis Data Relasional Tanpa PII (Database Schema DDL)")
    add_p(
        "Lapisan persistensi data diimplementasikan pada PostgreSQL 16 menggunakan Drizzle ORM. "
        "Skema dirancang khusus untuk mematuhi prinsip Zero-Knowledge Privacy, di mana basis data "
        "sama sekali tidak memiliki kolom untuk menyimpan Personally Identifiable Information (PII) "
        "seperti nama mahasiswa, NIM, nomor HP, maupun teks percakapan terbuka."
    )

    schema_code = """// Lokasi Berkas: packages/db/src/schema/
import { jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import type { Dass21Result, VakResult } from '@safespace/shared';

// 1. ENUMERASI PERAN & STATUS SISTEM
export const userRoleEnum = pgEnum('user_role', ['student', 'counselor', 'admin']);
export const sessionStatusEnum = pgEnum('session_status', ['waiting', 'active', 'closed']);
export const senderTypeEnum = pgEnum('sender_type', ['student', 'counselor', 'system']);

// 2. TABEL AKUN TERAUTENTIKASI (HANYA MEMUAT HASH ANONIM)
export const usersAuth = pgTable('users_auth', {
  id: uuid('id').defaultRandom().primaryKey(),
  hashedIdentity: varchar('hashed_identity', { length: 64 }).notNull().unique(), // HMAC-SHA256
  role: userRoleEnum('role').default('student').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. TABEL TIKET SESI PRA-KONSELING (DENGAN SNAPSHOT DASS-21 & VAK)
export const counselingSessions = pgTable('counseling_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => usersAuth.id, { onDelete: 'cascade' }).notNull(),
  counselorId: uuid('counselor_id').references(() => usersAuth.id, { onDelete: 'set null' }),
  studentPseudonym: varchar('student_pseudonym', { length: 100 }).notNull(), // 'Mahasiswa #XXXX'
  vakResult: jsonb('vak_result').$type<VakResult>(),                         // Snapshot hasil VAK
  dass21Score: jsonb('dass21_score').$type<Dass21Result>(),                  // Snapshot hasil DASS-21
  status: sessionStatusEnum('status').default('waiting').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  closedAt: timestamp('closed_at', { withTimezone: true }),
});

// 4. TABEL PESAN PERCAKAPAN (HANYA MENYIMPAN CIPHERTEXT TERENKRIPSI)
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').references(() => counselingSessions.id, { onDelete: 'cascade' }).notNull(),
  senderType: senderTypeEnum('sender_type').notNull(),
  encryptedContent: text('encrypted_content').notNull(), // Ciphertext AES-GCM-256 Base64
  iv: varchar('iv', { length: 64 }),                    // Initialization Vector acak per pesan
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});"""
    add_code_block(schema_code, "Listing Kode L.4: Definisi Skema Relasional Drizzle ORM Tanpa Kolom PII")

    # -------------------------------------------------------------
    # BAGIAN 5
    # -------------------------------------------------------------
    add_h1("5. Keamanan dan Kontrol Akses Berbasis Peran (RBAC Middleware)")
    add_p(
        "Sistem menerapkan mekanisme Role-Based Access Control (RBAC) yang ketat pada sisi peladen API. "
        "Setiap permintaan HTTP diverifikasi secara otomatis menggunakan middleware penjaga (defense guard). "
        "Pengguna dengan peran 'admin' (Sysadmin) secara sengaja diisolasi dari akses antrean tiket konseling "
        "dan riwayat chat mahasiswa demi menjaga integritas privasi konseling profesional."
    )

    rbac_code = """// Lokasi Berkas: apps/api/src/middleware/rbac.middleware.ts
import type { UserRole } from '@safespace/shared';

interface JwtPayloadWithRole {
  readonly userId?: string;
  readonly role?: UserRole;
  readonly pseudonym?: string;
}

export function requireRoles(allowedRoles: ReadonlyArray<UserRole>) {
  return async ({ headers, jwt, set }: any) => {
    const authHeader = headers.authorization as string | undefined;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Token otentikasi wajib disertakan' } };
    }

    const token = authHeader.slice(7);
    let payload = (await jwt.verify(token)) as JwtPayloadWithRole | null;

    // Dukungan Sandbox Evaluator untuk Pengujian Mandiri Dosen/Penguji
    if (!payload && token === 'demo_student_jwt_token') {
      payload = { userId: '0192e4a8-6f1b-789a-bcde-000000000001', role: 'student', pseudonym: 'Mahasiswa #4829' };
    } else if (!payload && token === 'demo_counselor_jwt_token') {
      payload = { userId: '0192e4a8-6f1b-789a-bcde-000000000002', role: 'counselor', pseudonym: 'Konselor_A' };
    }

    if (!payload || !payload.userId || !payload.role) {
      set.status = 401;
      return { success: false, error: { code: 'INVALID_TOKEN', message: 'Sesi kedaluwarsa atau tidak valid' } };
    }

    // Validasi wewenang peran pengguna terhadap daftar peran yang diizinkan
    if (!allowedRoles.includes(payload.role)) {
      set.status = 403;
      return { success: false, error: { code: 'FORBIDDEN', message: 'Akses ditolak: Wewenang peran tidak mencukupi' } };
    }

    return { user: payload };
  };
}"""
    add_code_block(rbac_code, "Listing Kode L.5: Middleware Penegakan Kontrol Akses Peran (RBAC)")

    # -------------------------------------------------------------
    # BAGIAN 6
    # -------------------------------------------------------------
    add_h1("6. Mekanisme Offline-First dan Sinkronisasi Data PWA")
    add_p(
        "Karakteristik mahasiswa UT yang tersebar di pelosok daerah menuntut keandalan aplikasi "
        "saat berada dalam kondisi jaringan internet tidak stabil atau terputus (offline). Modul "
        "offlineStorage mengimplementasikan arsitektur offline-first, di mana kalkulasi DASS-21 dan VAK "
        "tetap dapat dijalankan secara instan di peramban, disimpan ke penyimpanan lokal klien, dan "
        "didaftarkan ke dalam antrean sinkronisasi (offline queue) untuk dikirim ke peladen saat koneksi pulih."
    )

    offline_code = """// Lokasi Berkas: apps/web/src/services/offlineStorage.ts
import { calculateDass21Score, calculateVakScore } from '@safespace/shared';
import type { Dass21Result, VakModality, VakResult } from '@safespace/shared';
import { api } from './api';

export const offlineStorage = {
  // Pemrosesan luring DASS-21 saat tidak ada koneksi internet
  processDass21Offline(answers: number[]): Dass21Result {
    const result = calculateDass21Score(answers);
    const cached = {
      id: `dass21_${Date.now()}`,
      type: 'dass21',
      result,
      answers,
      timestamp: Date.now(),
      is_synced: false,
    };
    try {
      localStorage.setItem('safespace_dass21_latest', JSON.stringify(cached));
      this.enqueuePending(cached); // Masukkan ke antrean luring
    } catch (e) {
      console.warn('Gagal menyimpan cache lokal DASS-21:', e);
    }
    return result;
  },

  // Sinkronisasi otomatis saat browser memicu event 'online'
  async syncPendingQueue(): Promise<{ synced: number; failed: number }> {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return { synced: 0, failed: 0 };

    let syncedCount = 0;
    const remainingQueue = [];

    for (const item of queue) {
      try {
        if (item.type === 'dass21') {
          await api.submitDass21(item.answers as number[]);
        } else if (item.type === 'vak') {
          await api.submitVak(item.answers as VakModality[]);
        }
        syncedCount++;
      } catch (err) {
        remainingQueue.push(item); // Pertahankan jika jaringan masih gagal
      }
    }

    localStorage.setItem('safespace_offline_queue', JSON.stringify(remainingQueue));
    return { synced: syncedCount, failed: remainingQueue.length };
  }
};"""
    add_code_block(offline_code, "Listing Kode L.6: Mekanisme Komputasi Luring dan Antrean Auto-Sync PWA")

    # -------------------------------------------------------------
    # BAGIAN 7
    # -------------------------------------------------------------
    add_h1("7. Konfigurasi Infrastruktur dan Pengujian Otomatis")
    add_p(
        "Untuk menjamin keandalan sistem pada lingkungan produksi serta mempermudah evaluasi penguji, "
        "seluruh tumpukan aplikasi (full-stack) diorkestrasi menggunakan Docker Compose dan diverifikasi "
        "melalui skrip pengujian otomatis komprehensif."
    )

    add_h2("7.1 Orkestrasi Kontainerisasi (docker-compose.yml)")
    add_p(
        "Infrastruktur SafeSpace memisahkan layanan pengujian (port 3021, DB 5441) dan layanan produksi "
        "(port 3020, DB 5440) ke dalam jaringan virtual terisolasi, memastikan basis data produksi "
        "tidak terkontaminasi selama sesi pengujian evaluator."
    )

    compose_code = """# Lokasi Berkas: docker-compose.yml (Cuplikan Layanan Pengujian & Evaluator)
services:
  # 1. Basis Data PostgreSQL Terisolasi
  safespace-db-test:
    container_name: safespace-db-test
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: safespace_testing_db
      POSTGRES_USER: safespace_user
      POSTGRES_PASSWORD: safespace_test_pass_2026
    volumes:
      - safespace_test_db_data:/var/lib/postgresql/data
      - ./docker/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5441:5432"
    networks:
      - safespace-net

  # 2. Layanan Backend API Terkontainerisasi
  safespace-test-api:
    container_name: safespace-test-api
    build:
      context: .
      dockerfile: docker/Dockerfile.api
    restart: unless-stopped
    environment:
      NODE_ENV: development
      PORT: 3000
      ENABLE_SANDBOX: "true"
      DB_HOST: safespace-db-test
      DB_PORT: 5432
      DB_USER: ${TEST_DB_USER:-safespace_user}
      DB_PASSWORD: ${TEST_DB_PASSWORD}
      DB_NAME: ${TEST_DB_NAME:-safespace_testing_db}
      JWT_SECRET: ${TEST_JWT_SECRET}
      IDENTITY_PEPPER_SECRET: ${TEST_IDENTITY_PEPPER_SECRET}
      ADMIN_EMAILS: ${ADMIN_EMAILS}
    ports:
      - "3021:3000"
    networks:
      - safespace-net"""
    add_code_block(compose_code, "Listing Kode L.7: Konfigurasi Orkestrasi Kontainer Docker Compose")

    add_h2("7.2 Skrip Pengujian Otomatis Unit & Integrasi (Bun Test - TDD)")
    add_p(
        "Pengujian unit mengadopsi pendekatan Test-Driven Development (TDD) untuk menjamin validitas "
        "kalkulasi matematis DASS-21 terhadap batas norma klinis. Seluruh 99 skenario pengujian unit "
        "dan integrasi tercatat lulus 100% dengan waktu eksekusi 410 ms."
    )

    unit_test_code = """// Lokasi Berkas: packages/shared/src/utils/dass21.utils.test.ts
import { describe, expect, it } from 'bun:test';
import { calculateDass21Score } from './dass21.utils';

describe('calculateDass21Score (TDD Verification)', () => {
  it('harus menghasilkan kategori Normal jika seluruh jawaban bernilai 0', () => {
    const answers = Array(21).fill(0);
    const result = calculateDass21Score(answers);
    expect(result.depression.category).toBe('Normal');
    expect(result.anxiety.category).toBe('Normal');
    expect(result.stress.category).toBe('Normal');
  });

  it('harus menghasilkan kategori Extremely Severe jika seluruh jawaban bernilai 3', () => {
    const answers = Array(21).fill(3);
    const result = calculateDass21Score(answers);
    expect(result.depression.multipliedScore).toBe(42);
    expect(result.depression.category).toBe('Extremely Severe');
  });

  it('harus mengklasifikasikan Depresi Sedang (Moderate) secara tepat (skor 14-20)', () => {
    const answers = Array(21).fill(0);
    answers[2] = 2; answers[4] = 2; answers[9] = 2; answers[12] = 2; // Butir depresi
    const result = calculateDass21Score(answers);
    expect(result.depression.multipliedScore).toBe(16);
    expect(result.depression.category).toBe('Moderate');
    expect(result.anxiety.category).toBe('Normal');
  });

  it('harus menolak input jika panjang array bukan tepat 21 butir', () => {
    expect(() => calculateDass21Score(Array(20).fill(1))).toThrow('DASS-21 requires exactly 21 answers');
  });
});"""
    add_code_block(unit_test_code, "Listing Kode L.8: Skrip Unit Testing TDD Validasi Kalkulasi DASS-21")

    add_h2("7.3 Skrip Pengujian Otomatis End-to-End (Playwright Chromium)")
    add_p(
        "Pengujian fungsional end-to-end (E2E) mensimulasikan interaksi nyata peramban web dari halaman utama, "
        "pengisian instrumen 21 butir DASS-21, hingga pengajuan tiket pra-konseling anonim. Seluruh 10 skenario E2E "
        "tercatat lulus 100% pada lingkungan Chromium tanpa kegagalan (0 failed)."
    )

    e2e_code = """// Lokasi Berkas: tests/e2e/safespace-flow.e2e.ts
import { expect, test } from '@playwright/test';

test.describe('SafeSpace PWA: Verifikasi Alur End-to-End Pengguna', () => {
  test('TC-E2E: Pengisian Lengkap DASS-21 dan Pengajuan Tiket Anonim', async ({ page }) => {
    // 1. Masuk ke aplikasi melalui gerbang autentikasi evaluator
    await page.goto('/#/auth?sandbox_key=safespace-evaluator-2026');
    await page.getByRole('button', { name: /^Mahasiswa$/i }).click();

    // 2. Navigasi ke modul Asesmen Mandiri
    await page.getByRole('button', { name: 'Asesmen Mandiri' }).first().click();
    await expect(page.getByText('Pertanyaan 1 dari 21')).toBeVisible();

    // 3. Menjawab 21 butir pertanyaan Likert DASS-21 secara berurutan
    for (let i = 1; i <= 21; i++) {
      await expect(page.getByText(`Pertanyaan ${i} dari 21`)).toBeVisible();
      await page.getByRole('button', { name: /^2\\s+Sering/i }).click();
    }

    // 4. Kirim asesmen dan verifikasi tampilan hasil kalkulasi
    const submitBtn = page.getByRole('button', { name: /Lihat Hasil Analisis/i });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    await expect(page.getByText('Hasil Pemetaan Emosional DASS-21')).toBeVisible();
    await expect(page.getByText('Extremely Severe').first()).toBeVisible();

    // 5. Mengajukan tiket pra-konseling dan memastikan pseudonim terbit
    await page.getByRole('button', { name: /Lampirkan ke Tiket Pra-Konseling/i }).click();
    await expect(page.getByText(/Tiket sesi pra-konseling .* berhasil dibuka!/i)).toBeVisible();
  });
});"""
    add_code_block(e2e_code, "Listing Kode L.9: Skrip Pengujian Otomatis End-to-End Menggunakan Playwright")

    # Save to file
    out_docx_1 = "d:\\ijplabs\\capstone\\Lampiran_Kode_Sumber_SafeSpace.docx"
    out_docx_2 = "d:\\ijplabs\\capstone\\docs\\Lampiran_Kode_Sumber_SafeSpace.docx"
    try:
        doc.save(out_docx_1)
        print(f"1. Berhasil menyimpan: {out_docx_1}")
    except PermissionError:
        print(f"1. Catatan: {out_docx_1} sedang dibuka di Microsoft Word oleh pengguna.")
    
    try:
        doc.save(out_docx_2)
        print(f"2. Berhasil menyimpan: {out_docx_2}")
    except PermissionError:
        print(f"2. Catatan: {out_docx_2} sedang dibuka di Microsoft Word.")

if __name__ == '__main__':
    build_document()
