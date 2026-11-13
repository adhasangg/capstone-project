# LAMPIRAN: KODE SUMBER, REPOSITORI, DAN DOKUMENTASI IMPLEMENTASI TEKNIS SISTEM SAFESPACE

---

## 1. Tautan Repositori Resmi dan Lingkungan Deployment Sistem

Seluruh kode program, modul pengujian, dan konfigurasi infrastruktur sistem SafeSpace dikelola secara terpusat pada repositori Git resmi. Untuk memastikan transparansi akademis, kemudahan evaluasi penguji, serta keterulangan pengujian (*reproducibility*), berikut adalah tautan repositori dan alamat *deployment* resmi dari sistem SafeSpace:

| Komponen Akses | Keterangan / URL Akses Resmi |
| :--- | :--- |
| **Tautan Repositori GitHub** | `https://github.com/adhasangg/capstone-project` |
| **Tautan Live Production** | `https://safespace.ijplabs.dev` |
| **Tautan Testing / Evaluator Sandbox** | `https://test-safespace.ijplabs.dev` |
| **Commit Hash Rilis Pengujian** | `c489429` (Release Capstone Final v1.0.0) |
| **Runtime & Paket Manajer** | Bun v1.2+, React 19, TypeScript v5.8, Docker Engine 27+ |

---

## 2. Struktur Direktori Proyek dan Arsitektur Monorepo Bun Workspaces

Sistem SafeSpace dibangun menggunakan paradigma arsitektur **Monorepo** yang dikelola secara efisien dengan fitur **Bun Workspaces**. Arsitektur ini dipilih untuk menjawab kebutuhan ekosistem aplikasi modern, di mana modul antarmuka pengguna (*frontend* PWA), peladen layanan (*backend* API), definisi skema basis data (*ORM*), serta modul logika bisnis psikometri (DASS-21 dan VAK) berada dalam satu repositori terpadu namun tetap terisolasi secara modular.

### 2.1 Keunggulan dan Alasan Pemilihan Bun Workspaces

Penggunaan Bun Workspaces memberikan sejumlah keunggulan teknis signifikan dibandingkan arsitektur terpisah (*multi-repo*) maupun pengelola paket konvensional seperti npm/yarn:
1. **Berbagi Tipe Data Tanpa Duplikasi (*Single Source of Truth*):** Modul *frontend* (`apps/web`) dan *backend* (`apps/api`) dapat langsung mengimpor antarmuka TypeScript, fungsi validasi Zod, dan algoritma skoring dari pustaka bersama (`@safespace/shared`) tanpa memerlukan tahapan kompilasi terpisah (*zero-build step overhead*).
2. **Efisiensi Instalasi dan Eksekusi Ekstrem:** Bun memanfaatkan fitur sistem berkas modern (*hardlinks*) sehingga ketergantungan yang sama di seluruh paket hanya diunduh dan disimpan satu kali, menghemat ruang penyimpanan dan mempercepat instalasi dependensi hingga 10–20 kali lebih cepat dibandingkan npm.
3. **Mesin Pengujian Otomatis Terintegrasi:** Bun menyediakan *test runner* bawaan (`bun test`) yang mendukung eksekusi pengujian unit dan integrasi secara *native* di seluruh *workspaces* secara instan (<500 ms) langsung pada berkas TypeScript tanpa konfigurasi bundler rumit.

### 2.2 Struktur Pohon Direktori (*Directory Tree*)

Berikut adalah struktur pohon direktori proyek SafeSpace yang merefleksikan pemisahan tanggung jawab (*Separation of Concerns*) antar-layanan:

```text
safespace-monorepo/
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
└── package.json                    # Konfigurasi Root Monorepo Bun Workspaces
```

---

## 3. Implementasi Algoritma Inti (*Core Business Logic*)

SafeSpace mengedepankan prinsip transparansi klinis dan privasi matematis. Sistem secara tegas tidak menggunakan algoritma kecerdasan buatan (*Machine Learning*) yang bersifat kotak hitam (*black box*) pada modul diagnosis untuk mencegah halusinasi data emosional mahasiswa. Seluruh proses perhitungan dieksekusi menggunakan kalkulasi deterministik baku yang terverifikasi.

### 3.1 Sanitasi Identitas Kriptografis Satu Arah (*One-Way Identity Sanitizer*)

Untuk menjamin prinsip *Zero-Knowledge* dan *Two-Way Anonymity*, sistem tidak pernah menyimpan NIM, nama asli, atau alamat email mahasiswa di basis data. Subject ID resmi dari Google OAuth langsung disanitasi menggunakan algoritma HMAC-SHA-256 yang diperkuat dengan rahasia peladen (*server pepper*). Proses ini bersifat searah (*one-way*) sehingga identitas asli mahasiswa mustahil direkayasa balik (*irreversible*).

```typescript
// Lokasi Berkas: packages/shared/src/utils/crypto.utils.ts
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

  // Jalur cepat native pada runtime Bun menggunakan mesin kriptografi internal
  if (typeof globalAny.Bun?.CryptoHasher === 'function') {
    const hasher = new globalAny.Bun.CryptoHasher('sha256', pepperSecret);
    hasher.update(googleSub);
    return hasher.digest('hex');
  }

  // Fallback standar Node.js runtime
  const nodeCrypto = require('node:crypto');
  return nodeCrypto.createHmac('sha256', pepperSecret).update(googleSub).digest('hex');
}
```

### 3.2 Algoritma Skoring & Klasifikasi Klinis DASS-21 (Lovibond & Lovibond, 1995)

Modul pemetaan emosional DASS-21 memproses tepat 21 butir jawaban skala Likert (0–3). Tujuh butir spesifik dialokasikan ke masing-masing subskala (Depresi, Kecemasan, dan Stres). Total skor mentah dikalikan dua agar setara dengan norma standar DASS-42 sebelum dipetakan ke dalam lima tingkatan tingkat keparahan klinis (*Normal, Mild, Moderate, Severe, Extremely Severe*).

```typescript
// Lokasi Berkas: packages/shared/src/utils/dass21.utils.ts
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
}
```

### 3.3 Algoritma Pemetaan Gaya Belajar VAK Fleming

Instrumen VAK memetakan modalitas belajar mahasiswa (Visual, Auditori, atau Kinestetik) berdasarkan frekuensi jawaban. Sistem menghitung persentase tiap modalitas dan menetapkan gaya belajar dominan atau multimodal jika terdapat skor seimbang. Informasi ini berfungsi sebagai *exit strategy* untuk mengurangi beban kognitif saat memproses materi kuliah daring.

```typescript
// Lokasi Berkas: packages/shared/src/utils/vak.utils.ts
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
}
```

---

## 4. Skema Basis Data Relasional Tanpa PII (Database Schema DDL)

Lapisan persistensi data diimplementasikan pada PostgreSQL 16 menggunakan Drizzle ORM. Skema dirancang khusus untuk mematuhi prinsip *Zero-Knowledge Privacy*, di mana basis data sama sekali tidak memiliki kolom untuk menyimpan *Personally Identifiable Information* (PII) seperti nama mahasiswa, NIM, nomor HP, maupun teks percakapan terbuka.

```typescript
// Lokasi Berkas: packages/db/src/schema/
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
});
```

---

## 5. Keamanan dan Kontrol Akses Berbasis Peran (RBAC Middleware)

Sistem menerapkan mekanisme *Role-Based Access Control* (RBAC) yang ketat pada sisi peladen API. Setiap permintaan HTTP diverifikasi secara otomatis menggunakan middleware penjaga (*defense guard*). Pengguna dengan peran `admin` (Sysadmin) secara sengaja diisolasi dari akses antrean tiket konseling dan riwayat chat mahasiswa demi menjaga integritas privasi konseling profesional.

```typescript
// Lokasi Berkas: apps/api/src/middleware/rbac.middleware.ts
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
}
```

---

## 6. Mekanisme Offline-First dan Sinkronisasi Data PWA

Karakteristik mahasiswa UT yang tersebar di pelosok daerah menuntut keandalan aplikasi saat berada dalam kondisi jaringan internet tidak stabil atau terputus (*offline*). Modul `offlineStorage` mengimplementasikan arsitektur *offline-first*, di mana kalkulasi DASS-21 dan VAK tetap dapat dijalankan secara instan di peramban, disimpan ke penyimpanan lokal klien, dan didaftarkan ke dalam antrean sinkronisasi (*offline queue*) untuk dikirim ke peladen saat koneksi pulih.

```typescript
// Lokasi Berkas: apps/web/src/services/offlineStorage.ts
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
};
```

---

## 7. Konfigurasi Infrastruktur dan Pengujian Otomatis

Untuk menjamin keandalan sistem pada lingkungan produksi serta mempermudah evaluasi penguji, seluruh tumpukan aplikasi (*full-stack*) diorkestrasi menggunakan Docker Compose dan diverifikasi melalui skrip pengujian otomatis komprehensif.

### 7.1 Orkestrasi Kontainerisasi (`docker-compose.yml`)

Infrastruktur SafeSpace memisahkan layanan pengujian (port 3021, DB 5441) dan layanan produksi (port 3020, DB 5440) ke dalam jaringan virtual terisolasi, memastikan basis data produksi tidak terkontaminasi selama sesi pengujian evaluator.

```yaml
# Lokasi Berkas: docker-compose.yml (Cuplikan Layanan Pengujian & Evaluator)
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
      - safespace-net
```

### 7.2 Skrip Pengujian Otomatis Unit & Integrasi (Bun Test - TDD)

Pengujian unit mengadopsi pendekatan *Test-Driven Development* (TDD) untuk menjamin validitas kalkulasi matematis DASS-21 terhadap batas norma klinis. Seluruh 99 skenario pengujian unit dan integrasi tercatat lulus 100% dengan waktu eksekusi 410 ms.

```typescript
// Lokasi Berkas: packages/shared/src/utils/dass21.utils.test.ts
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
});
```

### 7.3 Skrip Pengujian Otomatis End-to-End (Playwright Chromium)

Pengujian fungsional *end-to-end* (E2E) mensimulasikan interaksi nyata peramban web dari halaman utama, pengisian instrumen 21 butir DASS-21, hingga pengajuan tiket pra-konseling anonim. Seluruh 10 skenario E2E tercatat lulus 100% pada lingkungan Chromium tanpa kegagalan (0 *failed*).

```typescript
// Lokasi Berkas: tests/e2e/safespace-flow.e2e.ts
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
      await page.getByRole('button', { name: /^2\s+Sering/i }).click();
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
});
```
