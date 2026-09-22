# Kanban Pengerjaan Proyek: SafeSpace PWA

Gunakan papan Kanban ini untuk melacak progres pengembangan SafeSpace PWA. Anda dapat memindahkannya ke Jira, Trello, atau GitHub Projects.

## 📝 Backlog (Belum Dikerjakan)
- [ ] **Desain & UI/UX**: Buat wireframe dan mockup antarmuka dengan pendekatan desain empatik.
- [ ] **Modul WebRTC (Tahap 2)**: Implementasi signaling server di ElysiaJS.
- [ ] **Modul WebRTC (Tahap 2)**: Implementasi P2P Video/Voice Call di klien dengan persetujuan (consent).
- [ ] **Optimasi PWA**: Konfigurasi Service Worker, offline fallback, dan manifest untuk skor Lighthouse > 90.

## 📌 To Do (Akan Dikerjakan Sprint Ini)
- [ ] **Modul Asesmen Matematika Baku**: Implementasi kalkulator DASS-21 (Lovibond & Lovibond) dan VAK (Visual, Auditory, Kinesthetic format dinamis 12/30) di `@safespace/shared` via TDD.
- [ ] **Migrasi Database PostgreSQL (JSONB)**: Tambahkan kolom `vak_result` dan `dass21_score` pada tabel `counseling_sessions`, serta enum role `admin`.
- [ ] **RBAC Middleware & Query Scoping**: Penjaga rute ElysiaJS 403 Forbidden dan isolasi relasi ORM untuk konselor (Double-Blind dua arah).
- [ ] **Setup Frontend PWA**: Inisialisasi Vite + React.js, Tailwind CSS v4, komponen empatik (Pill Icebreakers, expanding textarea, dialog, toast).
- [ ] **Routing Frontend**: Setup TanStack Router dan struktur halaman (Login, Dashboard, Assessment, Chatroom).

## 🏃 In Progress (Sedang Dikerjakan)
- [ ] **Manajemen Sesi & State Klien**: Integrasi Google Sign-In button dan TanStack Query di klien untuk caching status otentikasi.

## 🔍 In Review (Pengujian & QA)
- *(Belum ada tiket di fase ini)*
*(Catatan: Pindahkan tiket ke sini setelah implementasi selesai untuk dilakukan Code Review dan Testing)*
  - Contoh yang akan diuji:
    - *Validitas Formula Matematis DASS-21 (Normal, Mild, Moderate, Severe, Extremely Severe).*
    - *Akurasi Modalitas Belajar VAK (Format 12 & Format 30).*
    - *Penegakan RBAC Lapis Ganda (HTTP 403 untuk akses ilegal & isolasi users_auth).*
    - *Black-Box Testing pada Database untuk `encrypted_content`.*

## ✅ Done (Selesai)
- [x] **Requirement Gathering**: PRD dan Dokumen Arsitektur Selesai (Reposisi Pra-Konseling & Deteksi Dini Academic Burnout).
- [x] **Tech Stack Selection**: Pemilihan stack (Bun, Elysia, React, PostgreSQL, dll) disetujui.
- [x] **Architectural Decision Records (ADR)**: Kajian akademis (ADR-001 s.d. ADR-006) terdokumentasi di `docs/ADR_Kajian_Keputusan_Arsitektur.md`.
- [x] **Inisiasi Proyek (Tahap 0)**: Setup Monorepo menggunakan Bun Workspaces, Biome linter, Git remote, dan GitNexus indexing.
- [x] **Kernel Bersama (Tahap 1)**: Implementasi `@safespace/shared` (Strict types, Zod schemas, one-way crypto hash, pseudonym generator) dengan 100% unit test passing.
- [x] **Skema Database & Migrasi (Tahap 2)**: Implementasi `@safespace/db` Drizzle ORM, pembuatan skema PostgreSQL (`users_auth`, `counselors_profile`, `counseling_sessions`, `messages`), dan migrasi sukses ke database live.
- [x] **Backend Inisiasi & Modul Auth (Tahap 3)**: Setup ElysiaJS (`apps/api`), Swagger UI, CORS, JWT session, serta implementasi layered auth architecture (Route ≤150 LOC, Service ≤300 LOC, Repository ≤200 LOC) dengan TDD passing (32/32 tests).

---

## 🎯 Milestones (Fase Rilis)

### Fase 1: Fondasi, Auth, & Pra-Konseling Engine
Fokus pada infrastruktur monorepo, database PostgreSQL, Google OAuth 2.0 (one-way hashing), dan mesin kalkulasi matematika DASS-21 & VAK.

### Fase 2: Mood Tracker AI & Antarmuka Empatik
Fokus pada analisis sentimen curhatan teks bebas harian via LLM untuk afirmasi empati, Pill Icebreakers, dan expanding textarea.

### Fase 3: Core Chat & E2EE
Implementasi Web Crypto API (RSA Key Pair), WebSocket ElysiaJS untuk obrolan real-time, dan UI Chatbox (Pill Icebreakers).

### Fase 4: PWA Polish & WebRTC (Opsional)
Optimalisasi PWA (Lighthouse Audit) dan penambahan fitur panggilan darurat (P2P WebRTC).
