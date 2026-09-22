# Dokumentasi Workflow Development: SafeSpace PWA

Dokumen ini memandu tim pengembang mengenai alur kerja (workflow) teknis dari proyek SafeSpace PWA untuk menjaga konsistensi, keterbacaan kode, dan efisiensi waktu siklus rilis.

## 1. Struktur Repositori (Bun Workspaces Monorepo)

Proyek ini menggunakan **Bun Workspaces** untuk mengelola Frontend (klien) dan Backend (peladen) dalam satu repositori (monorepo).

```text
safespace-pwa/
├── apps/
│   ├── web/          # Frontend React.js + Vite
│   └── api/          # Backend ElysiaJS
├── packages/
│   ├── shared/       # Tipe data bersama (Types/Interfaces), skema validasi, fungsi utilitas
│   ├── ui/           # (Opsional) Komponen Shadcn UI yang dibagikan jika proyek membesar
│   └── db/           # Skema Drizzle ORM & migrasi database
├── package.json      # Konfigurasi Bun Workspaces
└── bun.lockb         # Global lockfile
```

**Perintah Dasar:**
- Install dependencies: `bun install` (di root)
- Menjalankan Backend: `bun run dev --filter api`
- Menjalankan Frontend: `bun run dev --filter web`

## 2. Standar Penulisan Kode (Coding Standards)

- **Linter & Formatter:** Gunakan **Biome** sebagai satu-satunya linter dan formatter (menggantikan ESLint/Prettier). Lihat `.agent/rules/03-code-quality-biome.md` untuk konfigurasi lengkap.
- **Type Safety:** 
  - Gunakan TypeScript secara ketat (strict mode: true).
  - **DILARANG** menggunakan tipe `any`, `unknown`, `object`, atau `Function`.
  - Bagikan tipe data (misal: skema respon API) antara `apps/web` dan `apps/api` melalui folder `packages/shared`.
- **TDD (Test-Driven Development):** Seluruh fitur wajib dikembangkan mengikuti siklus Red → Green → Refactor. Lihat `.agent/rules/01-tdd.md`.
- **LOC & Struktur File:** Patuhi batas LOC per file untuk menjaga keterbacaan. Lihat `.agent/rules/04-loc-file-structure.md`.
- **Styling:** Gunakan utility classes dari Tailwind CSS v4. Ekstrak kelas yang repetitif menjadi komponen React (menggunakan pola Shadcn UI).

## 3. Strategi Percabangan Git (Branching Strategy)

Kita menggunakan **GitHub Flow** yang disederhanakan:

1. **`main` branch:** Kode produksi. Selalu stabil dan siap di-deploy.
2. **Feature branches:** Dibuat dari `main`.
   - Format penamaan: `feat/nama-fitur` (contoh: `feat/otp-auth`)
   - Bug fix: `fix/nama-bug` (contoh: `fix/socket-latency`)
   - Chore/Setup: `chore/setup-drizzle`

**Alur Commit:**
Gunakan [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: implementasi LLM self-assessment`
- `fix: memperbaiki error validasi JWT di Elysia`
- `refactor: memisahkan komponen chatbox`

## 4. Alur Kerja Pengembangan Harian (Daily Workflow)

1. **Pull & Sync:**
   ```bash
   git checkout main
   git pull origin main
   bun install # Pastikan dependencies up-to-date
   ```
2. **Buat Branch Baru:**
   ```bash
   git checkout -b feat/task-baru
   ```
3. **Mulai Development Server:**
   Buka dua terminal atau gunakan package pendukung seperti `turborepo` atau script Bun untuk menjalankan web dan api secara bersamaan.
4. **Pengujian Lokal:**
   - Frontend: Pastikan UI responsif dan PWA terdeteksi.
   - Backend: Uji endpoint Elysia menggunakan Swagger UI bawaan (plugin Elysia) atau Postman.
5. **Push & Pull Request (PR):**
   - Push branch ke remote: `git push origin feat/task-baru`
   - Buka Pull Request ke `main`.
   - Wajibkan minimal 1 *Code Reviewer* untuk mengecek **keamanan enkripsi E2EE** dan **tidak adanya kebocoran data identitas**.

## 5. Security, Privacy, & Logic Checklist (Wajib Sebelum Rilis)

> [!CAUTION]  
> Keamanan, privasi absolut (Two-Way Double-Blind & E2EE), serta validitas instrumen psikometrik adalah pilar utama aplikasi ini. Setiap fitur baru harus melalui checklist ini.

- [ ] **Tidak ada Logging Identitas:** Pastikan `console.log` di backend TIDAK mencetak `email` atau `id` asli pengguna ke stdout.
- [ ] **Validasi Token & RBAC:** Semua rute peladen memverifikasi JWT. Rute konselor wajib menolak role `student` dengan status 403 Forbidden.
- [ ] **Isolasi Database (Scoping):** Query repository untuk konselor dilarang keras melakukan relasi JOIN ke tabel `users_auth`.
- [ ] **Two-Way Double-Blind:** Antarmuka mahasiswa hanya menampilkan nama samaran konselor (`Konselor_A` / `Psikolog_Athena`) dan router TanStack tidak memuat ID asli di URL.
- [ ] **Validitas Komputasi DASS-21 & VAK:** Penilaian stres dan gaya belajar wajib dihitung secara deterministik matematika murni di `@safespace/shared`, bebas dari halusinasi diagnostik AI.
- [ ] **Verifikasi E2EE:** Cek manual ke DB bahwa kolom `messages.encrypted_content` benar-benar terenkripsi base64/ciphertext, bukan plaintext.

## 6. Proses Deployment (CI/CD Pipeline)

- **Frontend (`apps/web`):**
  Dapat di-deploy ke Vercel, Cloudflare Pages, atau VPS Nginx. Build command: `bun run build --filter web`.
- **Backend (`apps/api`):**
  Deploy ke VPS (Ubuntu/Debian) atau platform seperti Railway/Render dengan Bun runtime terinstal. Command: `bun run start --filter api`.
- **Database:**
  Terapkan migrasi Drizzle secara terkontrol pada environment produksi sebelum mendeploy aplikasi backend.
