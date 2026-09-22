# Product Requirements Document (PRD)

**Nama Produk:** Sistem Informasi Manajemen Konseling Terintegrasi (SafeSpace PWA)
**Platform:** Web (Progressive Web App - PWA)
**Target Pengguna:** Mahasiswa Universitas Terbuka (UT) & Staf Konselor / Guru BK
**Status Dokumen:** Draf / Perencanaan

---

## 1. Ringkasan Eksekutif
SafeSpace PWA adalah platform Bimbingan Konseling (BK) digital berbasis Progressive Web App (PWA) yang menjamin privasi absolut penggunanya. Menggunakan arsitektur *Double-Blind* (Anonimitas Ganda) dan *End-to-End Encryption* (E2EE), sistem ini memfasilitasi mahasiswa pendidikan jarak jauh (PJJ) untuk:
- Memetakan kondisi psikologis secara mandiri menggunakan bantuan AI.
- Memiliki ruang aman untuk berkonsultasi tanpa takut identitas terungkap.
- Mendobrak stigma negatif terhadap layanan BK institusional.

## 2. Arsitektur & Teknologi (Tech Stack)
Proyek ini menggunakan struktur **Monorepo** dengan **Bun Workspaces** untuk efisiensi pengembangan.

### Frontend (Klien)
- **Core:** React.js dengan Vite (PWA plugin terkonfigurasi).
- **Routing:** TanStack Router (Type-Safe routing, PWA navigation).
- **State & Data Fetching:** TanStack Query (caching pesan, sinkronisasi real-time).
- **UI/UX:** Tailwind CSS v4 & Shadcn UI (dialog, toast, expanding textarea).
- **Kriptografi:** Web Crypto API (E2EE).

### Backend (Peladen)
- **Framework:** ElysiaJS (berjalan di atas runtime Bun, low latency).
- **Real-time:** Elysia WebSockets (komunikasi chat waktu nyata & WebRTC signaling).
- **Authentication:** Google OAuth 2.0 / OpenID Connect (dengan domain whitelist dinamis & one-way hashing untuk privasi anonim).
- **AI Integration:** LangChain / Fetch API langsung ke endpoint LLM (OpenAI/Gemini).
- **Database & ORM:** PostgreSQL dikelola dengan Drizzle ORM.

## 3. Peran Pengguna (User Roles)
1. **Mahasiswa (Klien):** Pengguna akhir yang membutuhkan layanan. Beroperasi dalam mode anonim (Pseudonim).
2. **Konselor (Staf):** Pihak yang merespons tiket. Beroperasi dalam mode anonim dari sudut pandang mahasiswa.
3. **Sistem (AI & Auto-Router):** Modul tanpa antarmuka yang mengolah sentimen teks dan merutekan antrean tiket.

## 4. Fitur & Spesifikasi Kebutuhan

### 4.1. Modul Autentikasi Tanpa Jejak (Google OAuth 2.0 & Sanitasi Identitas)
**Kebutuhan:** Verifikasi pengguna yang sah (misal: domain `@ecampus.ut.ac.id` atau domain terdaftar lainnya) tanpa menyimpan identitas asli.
- **Alur:**
  1. Pengguna login menggunakan Google Sign-In (mendukung email kampus Google Workspace maupun umum).
  2. ElysiaJS memverifikasi ID Token Google, memvalidasi domain email terhadap daftar whitelist yang diizinkan (`ALLOWED_EMAIL_DOMAINS`).
  3. Peladen mengekstrak identifier unik Google (`sub`), melakukan *one-way cryptographic hash* (`SHA-256(sub + SECRET_PEPPER)`), lalu membuang data nama asli, email, dan foto dari memori.
  4. Sesi JWT diterbitkan hanya berisi `user_id` (UUIDv7) dan `pseudonym` (misal: "Mahasiswa #3921"). Identitas Google tidak pernah disimpan di database.

### 4.2. Modul Self-Assessment Berbasis AI
**Kebutuhan:** Pemetaan potensi diri dan mood tracker harian.
- **Alur:**
  1. Pengguna mengetik narasi bebas tentang perasaannya (menggunakan textarea Shadcn).
  2. Teks diproses oleh LLM di backend.
  3. LLM mengembalikan JSON: `skor_stres` (1-10) dan `rekomendasi_tindakan`.
  4. Jika `skor_stres > 7`, muncul Dialog Shadcn menyarankan pengguna membuka "Bilik Privat".

### 4.3. Modul Double-Blind & E2EE Chatbox
**Kebutuhan:** Ruang obrolan interaktif, aman, dan E2EE.
- **Manajemen Kriptografi:**
  - Konselor login -> Peramban menghasilkan RSA Key Pair -> Public Key ke peladen.
  - Mahasiswa buat sesi -> Mengambil Public Key konselor terkait.
- **UI/UX (Empathetic Chatbox):**
  - Tombol Pill Icebreakers (misal: "Saya butuh didengar").
  - Dukungan konversi gambar ke Base64 (dienkripsi klien sebelum dikirim).
- **Kerahasiaan Identitas:**
  - Peladen hanya merespons dengan `session_id` dan `pseudonym`.
  - TanStack Router memastikan parameter URL tidak membocorkan ID asli.

### 4.4. Modul WebRTC Intervensi Darurat (Tahap 2 / Opsional)
**Kebutuhan:** Panggilan suara/video P2P untuk krisis tingkat tinggi.
- **Alur:**
  1. Mahasiswa menekan "Ajukan Panggilan".
  2. Alert Dialog: "Tindakan ini akan membuka identitas Anda. Lanjutkan?".
  3. Jika disetujui, ElysiaJS bertindak sebagai Signaling Server menukar SDP untuk inisiasi WebRTC P2P murni.

## 5. Struktur Data Inti (Skema Drizzle ORM - PostgreSQL)
> [!IMPORTANT]  
> Pemisahan entitas sangat ketat untuk mencegah kebocoran data identitas (*Double-Blind*). Menggunakan tipe data native PostgreSQL (UUIDv7, JSONB, Text).

- `users_auth`: `id` (UUIDv7 PK), `hashed_identity` (Varchar(64) - SHA-256), `role` (Enum: 'student', 'counselor'), `created_at` (Timestamp).
- `counselors_profile`: `id` (UUIDv7 PK), `user_id` (UUID FK), `pseudonym_name` (Varchar), `public_key` (Text), `is_available` (Boolean).
- `counseling_sessions`: `id` (UUIDv7 PK), `student_id` (UUID FK), `counselor_id` (UUID FK), `student_pseudonym` (Varchar), `status` (Enum: 'waiting', 'active', 'closed'), `created_at` (Timestamp).
- `messages`: `id` (UUIDv7 PK), `session_id` (UUID FK), `sender_type` (Enum: 'student', 'counselor', 'system'), `encrypted_content` (Text - Ciphertext base64), `timestamp` (Timestamp).

## 6. Kriteria Keberhasilan (Acceptance Criteria)
- **Lighthouse PWA Score:** Audit frontend mencapai skor PWA > 90.
- **Uji Enkripsi (Black-Box):** Inspeksi database (SQL client) hanya menampilkan string acak pada `encrypted_content`.
- **Sanitasi API:** Pemanggilan jaringan di antarmuka mahasiswa tidak memuat satu pun atribut pengenal asli milik konselor.
- **Performa:** Navigasi tanpa full-reload (TanStack Router) dan latensi pesan WebSocket < 200ms.
