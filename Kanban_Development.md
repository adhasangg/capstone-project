# Kanban Pengerjaan Proyek: SafeSpace PWA

Gunakan papan Kanban ini untuk melacak progres pengembangan SafeSpace PWA. Anda dapat memindahkannya ke Jira, Trello, atau GitHub Projects.

## 📝 Backlog (Belum Dikerjakan)
- [ ] **Desain & UI/UX**: Buat wireframe dan mockup antarmuka dengan pendekatan desain empatik.
- [ ] **Modul WebRTC (Tahap 2)**: Implementasi signaling server di ElysiaJS.
- [ ] **Modul WebRTC (Tahap 2)**: Implementasi P2P Video/Voice Call di klien dengan persetujuan (consent).
- [ ] **Optimasi PWA**: Konfigurasi Service Worker, offline fallback, dan manifest untuk skor Lighthouse > 90.

## 📌 To Do (Akan Dikerjakan Sprint Ini)
- [ ] **Setup Backend**: Inisialisasi ElysiaJS, integrasi `@safespace/db`, dan struktur layered modul auth.
- [ ] **Setup Frontend**: Inisialisasi Vite + React.js, Tailwind CSS v4, dan komponen dasar Shadcn UI.
- [ ] **Routing Frontend**: Setup TanStack Router dan struktur halaman (Login, Dashboard, Assessment, Chatroom).

## 🏃 In Progress (Sedang Dikerjakan)
- [ ] **Modul Autentikasi (Google OAuth 2.0)**: Endpoint verifikasi token Google, domain whitelist validation, dan identity sanitization (one-way hashing).
- [ ] **Manajemen Sesi & State**: Penerbitan anonim JWT dan setup TanStack Query di klien untuk caching status otentikasi.

## 🔍 In Review (Pengujian & QA)
- *(Belum ada tiket di fase ini)*
*(Catatan: Pindahkan tiket ke sini setelah implementasi selesai untuk dilakukan Code Review dan Testing)*
  - Contoh yang akan diuji:
    - *Sanitasi API (pastikan tidak ada ID asli atau email Google yang bocor).*
    - *Black-Box Testing pada Database untuk `encrypted_content`.*

## ✅ Done (Selesai)
- [x] **Requirement Gathering**: PRD dan Dokumen Arsitektur Selesai.
- [x] **Tech Stack Selection**: Pemilihan stack (Bun, Elysia, React, dll) disetujui.
- [x] **Architectural Decision Records (ADR)**: Dokumen kajian akademis (Google OAuth 2.0 vs OTP, PostgreSQL vs MariaDB) terdokumentasi di `docs/ADR_Kajian_Keputusan_Arsitektur.md`.
- [x] **Inisiasi Proyek (Tahap 0)**: Setup Monorepo menggunakan Bun Workspaces, Biome linter, Git remote, dan GitNexus indexing.
- [x] **Kernel Bersama (Tahap 1)**: Implementasi `@safespace/shared` (Strict types, Zod schemas, one-way crypto hash, pseudonym generator) dengan 100% unit test passing.
- [x] **Skema Database & Migrasi (Tahap 2)**: Implementasi `@safespace/db` Drizzle ORM, pembuatan skema PostgreSQL (`users_auth`, `counselors_profile`, `counseling_sessions`, `messages`), dan migrasi sukses ke database live.

---

## 🎯 Milestones (Fase Rilis)

### Fase 1: Fondasi & Auth
Fokus pada infrastruktur monorepo, database PostgreSQL, dan login anonim menggunakan Google OAuth 2.0 (dengan domain filtering dan hashing anonim).

### Fase 2: Assessment & Routing AI
Fokus pada integrasi LLM LangChain/Fetch untuk Self-Assessment dan prompt engineering untuk rekomendasi skor stres.

### Fase 3: Core Chat & E2EE
Implementasi Web Crypto API (RSA Key Pair), WebSocket ElysiaJS untuk obrolan real-time, dan UI Chatbox (Pill Icebreakers).

### Fase 4: PWA Polish & WebRTC (Opsional)
Optimalisasi PWA (Lighthouse Audit) dan penambahan fitur panggilan darurat (P2P WebRTC).
