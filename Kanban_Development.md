# Kanban Pengerjaan Proyek: SafeSpace PWA

**Judul Capstone:** Pengembangan Sistem PraKonseling Anonim dan Pemetaan Potensi Diri untuk Deteksi Dini Academic Burnout pada Ekosistem Pendidikan Jarak Jauh (Studi Kasus: Universitas Terbuka)  
**Mata Kuliah:** STSI4401 CAPSTONE PROJECT — Universitas Terbuka (2026)  

---

## 📝 Backlog (Fase Mendatang)
- [ ] **Modul WebRTC (Tahap Opsional)**: Implementasi signaling server di ElysiaJS untuk panggilan darurat intervensi krisis.
- [ ] **Modul WebRTC (Tahap Opsional)**: Implementasi P2P Video/Voice Call di klien dengan persetujuan eksplisit (*consent*).
- [ ] **Audit Performa PWA Akhir**: Konfigurasi Workbox Service Worker, offline fallback, dan audit Google Lighthouse PWA skor > 90.

## 📌 To Do (Sprint Saat Ini — Prototyping Construction)
- [ ] **Setup Frontend PWA (`apps/web`)**: Inisialisasi Vite + React.js, Tailwind CSS v4, konfigurasi palet warna psikologis (Soft Sage Green & Slate Blue).
- [ ] **Routing & Arsitektur Halaman Klien**: Setup TanStack Router (Halaman Login Google, Dashboard Anonim, Wizard Asesmen, Chatroom).
- [ ] **Komponen UI Empatik (Shadcn UI)**: Implementasi *Pill Icebreakers*, *expanding textarea*, modal dialog konfirmasi tiket, dan safe exit button.
- [ ] **Instrumen Pengujian Evaluasi Bab 3**: Penyiapan lembar uji *Black-Box Testing* dan kuesioner *System Usability Scale (SUS)* 10 butir pertanyaan skala Likert.

## 🏃 In Progress (Sedang Berjalan)
- [ ] **Inisialisasi Frontend PWA (`apps/web`)**: Setup React Vite monorepo dengan token warna psikologis.

## 🔍 In Review (Pengujian & Verifikasi)
- [x] **Validitas Formula Matematis DASS-21**: Lovibond & Lovibond (Normal, Mild, Moderate, Severe, Extremely Severe) terverifikasi 100% via unit test (TDD pass).
- [x] **Akurasi Modalitas Belajar VAK**: Format 12 & 30 butir terverifikasi deterministik via unit test (TDD pass).
- [x] **Penegakan RBAC Lapis Ganda**: HTTP 403 Forbidden untuk akses ilegal mahasiswa ke antrean konselor terverifikasi via test.
- [x] **Kesesuaian Kajian Metodologi Bab 3**: Formulasi R&D, Prototyping, dan pemisahan data fungsional vs data SUS terverifikasi selaras dengan proposal.

## ✅ Done (Selesai)
- [x] **Requirement Gathering & Proposal Alignment**: Penyelarasan PRD dengan proposal resmi Capstone STSI4401 Universitas Terbuka.
- [x] **Kajian Metodologi Bab III & Teori Desain**: Penyusunan dokumen kajian metodologi R&D, model Prototyping, instrumen SUS, dan psikologi warna di `docs/Bab3_Metodologi_dan_Teori_Desain.md`.
- [x] **Riset Instrumen Baku DASS-21 & VAK**: Pendokumentasian resmi 21 butir DASS-21 dan format kuesioner VAK di `docs/Instrumen_Baku_DASS21_dan_VAK.md`.
- [x] **Visualisasi Diagram Mermaid & Ekspor PNG**: Pembangunan dashboard interaktif mandiri di `docs/flowchart_dashboard.html` dengan fitur download PNG resolusi tinggi untuk laporan Bab 3 & 4.
- [x] **Architectural Decision Records (ADR)**: Kajian akademis (ADR-001 s.d. ADR-006) terdokumentasi di `docs/ADR_Kajian_Keputusan_Arsitektur.md`.
- [x] **Inisiasi Monorepo (Tahap 0)**: Setup Monorepo Bun Workspaces, Biome linter, Git rules, dan konfigurasi Typecheck.
- [x] **Kernel Bersama (Tahap 1)**: Implementasi `@safespace/shared` (Strict types, Zod schemas, one-way crypto hash, pseudonym generator, formula DASS-21, formula VAK) dengan 100% unit test passing.
- [x] **Skema Database & Migrasi (Tahap 2)**: Implementasi `@safespace/db` Drizzle ORM PostgreSQL (`users_auth`, `counselors_profile`, `counseling_sessions`, `messages`, kolom JSONB `vak_result` dan `dass21_score`, role `admin`).
- [x] **Backend Auth RBAC (Tahap 3)**: Setup ElysiaJS (`apps/api`), Swagger UI, CORS, JWT session, Google OAuth sanitization, dan RBAC middleware.
- [x] **Backend Assessment HTTP Route**: Implementasi endpoint DASS-21, VAK, dan Mood Tracker di `apps/api/src/modules/assessment/assessment.route.ts` dengan TDD (6/6 test pass).
- [x] **Backend Counseling Sessions & Helpdesk Ticket**: Implementasi repository terisolasi (Double-Blind scoping), service, dan route tiket pra-konseling di `apps/api/src/modules/session/` dengan proteksi RBAC 403 (9/9 test pass).

---

## 🎯 Siklus Rilis (Sesuai Model Prototyping)

### Siklus 1: Requirements & Architectural Modeling (SELESAI ✅)
Fondasi monorepo, database PostgreSQL, sanitasi identitas Google OAuth 2.0, formula DASS-21 & VAK murni, dan perumusan metodologi Bab 3.

### Siklus 2: Quick Design & Visual Modeling (AKTIF 🔄)
Penyusunan diagram alur sistem, dashboard visualisasi diagram laporan, penetapan palet warna empati, dan persiapan komponen UI PWA.

### Siklus 3: Prototype Construction & Helpdesk Ticketing (SELANJUTNYA 🔜)
Inisialisasi `apps/web` (React + Tailwind v4 + TanStack Router), integrasi endpoint asesmen, dan alur pembuatan tiket pra-konseling terenkripsi.

### Siklus 4: Realtime Chat, E2EE, & Evaluasi UAT (SUS)
Implementasi Web Crypto API, WebSocket realtime chatroom, pelaksanaan Black-Box testing, dan pengujian UAT System Usability Scale dengan responden mahasiswa UT.
