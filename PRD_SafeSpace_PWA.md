# Product Requirements Document (PRD)

**Nama Produk:** Sistem Informasi Pra-Konseling Terintegrasi (Deteksi Dini Academic Burnout) — SafeSpace PWA  
**Platform:** Web (Progressive Web App - PWA)  
**Target Pengguna:** Mahasiswa Universitas Terbuka (UT) & Staf Konselor / Guru BK  
**Status Dokumen:** Draf / Perencanaan (Revisi Arsitektur Pra-Konseling)  

---

## 1. Ringkasan Eksekutif & Reposisi Produk
SafeSpace PWA adalah platform **Pra-Konseling Digital** berbasis Progressive Web App (PWA) yang berfungsi sebagai **"P3K Psikologis"** dan jembatan deteksi dini *academic burnout* bagi mahasiswa pendidikan jarak jauh (PJJ). Sistem ini **bukan** pesaing atau pengganti portal konseling resmi kampus (seperti MyScout UT), melainkan gerbang awal bagi mahasiswa yang enggan atau malu mengakses layanan formal akibat stigma negatif.

Sistem menjamin privasi absolut melalui:
- **Two-Way Double-Blind Anonymity**: Mahasiswa dan konselor saling dianonimkan (menggunakan pseudonim acak dan nama samaran konselor seperti `Konselor_A` / `Psikolog_Athena`).
- **End-to-End Encryption (E2EE)**: Percakapan chatbox terenkripsi secara kriptografis menggunakan Web Crypto API.
- **Instrumen Psikometrik Baku**: Penentuan tingkat stres dan gaya belajar menggunakan instrumen baku internasional (DASS-21 & VAK) dengan perhitungan rumus matematis murni.
- **AI Empathetic Mood Tracker**: LLM dialokasikan khusus untuk membaca narasi curhatan bebas harian guna memberikan kalimat empati dan rekomendasi pembukaan tiket rujukan.

## 2. Arsitektur & Teknologi (Tech Stack)
Proyek menggunakan struktur **Monorepo** dengan **Bun Workspaces**.

### Frontend (Klien)
- **Core:** React.js dengan Vite (PWA plugin terkonfigurasi).
- **Routing:** TanStack Router (Type-Safe routing, PWA navigation).
- **State & Data Fetching:** TanStack Query (caching pesan, sinkronisasi real-time).
- **UI/UX:** Tailwind CSS v4 & Shadcn UI (Pill Icebreakers, expanding textarea, dialog, toast).
- **Kriptografi:** Web Crypto API (E2EE RSA/AES).

### Backend (Peladen)
- **Framework:** ElysiaJS (berjalan di atas runtime Bun, low latency).
- **Real-time:** Elysia WebSockets (komunikasi chat waktu nyata & WebRTC signaling).
- **Authentication & RBAC:** Google OAuth 2.0 / OpenID Connect + One-Way HMAC Identity Sanitization + Role-Based Access Control Middleware.
- **AI Integration:** Fetch API ke LLM (OpenAI/Gemini) khusus untuk analisis sentimen & pesan empati Mood Tracker.
- **Database & ORM:** PostgreSQL dikelola dengan Drizzle ORM.

## 3. Peran Pengguna (User Roles & RBAC)
1. **Mahasiswa (`student`):** Pengguna akhir yang melakukan asesmen mandiri, mengisi kuesioner, dan berkonsultasi dalam mode pseudonim (`Mahasiswa #XXXX`).
2. **Konselor (`counselor`):** Staf yang merespons tiket dan membaca lampiran profil DASS-21/VAK. Tampil sebagai nama samaran (`Konselor_A` / `Psikolog_Athena`) dari sudut pandang mahasiswa.
3. **Super Admin (`admin`):** Pengelola sistem yang memantau metrik agregat tanpa akses ke isi percakapan terenkripsi.
4. **Sistem (Deteksi Dini & Auto-Router):** Modul tanpa antarmuka yang mengolah skor DASS-21/VAK dan sentimen Mood Tracker.

## 4. Fitur & Spesifikasi Kebutuhan

### 4.1. Modul Autentikasi Tanpa Jejak & RBAC
**Kebutuhan:** Verifikasi pengguna yang sah tanpa menyimpan identitas asli.
- **Alur:**
  1. Pengguna login menggunakan Google Sign-In.
  2. ElysiaJS memverifikasi ID Token Google dan memvalidasi domain terhadap `ALLOWED_EMAIL_DOMAINS`.
  3. Peladen melakukan *one-way cryptographic hash* (`SHA-256(sub + SECRET_PEPPER)`), lalu membuang data nama, email, dan foto dari memori.
  4. Sesi JWT diterbitkan hanya berisi `userId` (UUIDv7), `role` (`student` | `counselor` | `admin`), dan `pseudonym`.

### 4.2. Modul Pemetaan Diri (Instrumen Baku DASS-21 & VAK)
**Kebutuhan:** Penilaian psikologis yang sahih secara akademis, bebas dari halusinasi diagnostik AI.
- **DASS-21 (Depression, Anxiety, Stress Scale - 21 Butir):**
  - Menggunakan 21 butir instrumen baku Lovibond & Lovibond (7 butir Depresi, 7 butir Kecemasan, 7 butir Stres).
  - Skala jawaban: 0 (Tidak pernah) hingga 3 (Sangat sering).
  - Rumus: $\text{Skor Skala} = \sum(\text{Poin Subskala}) \times 2$.
  - Kategori baku: *Normal, Mild, Moderate, Severe, Extremely Severe*.
- **VAK (Visual, Auditory, Kinesthetic Learning Style):**
  - Mengakomodasi kuesioner dinamis (format ringkas default 12 butir maupun format lengkap 30 butir).
  - Dihitung dari persentase skor jawaban tertinggi untuk menentukan gaya belajar dominan.
- **Modul Mood Tracker (AI Empati):**
  - Mahasiswa dapat mengetik narasi curhatan bebas harian.
  - LLM hanya menganalisis sentimen teks dan memberikan respon empati yang menenangkan.
  - Jika sentimen terdeteksi krisis berat atau skor DASS-21 masuk kategori *Severe*, sistem menampilkan rekomendasi pembukaan tiket pra-konseling.

### 4.3. Modul Double-Blind Dua Arah & Empathetic Chatbox
**Kebutuhan:** Ruang obrolan interaktif, aman, E2EE, dan rendah beban kognitif.
- **Two-Way Anonymity:** Mahasiswa beridentitas `Mahasiswa #XXXX`, konselor beridentitas `Konselor_A` / `Psikolog_Athena`.
- **Integrasi Modul (Attached Profile):** Saat mahasiswa membuka sesi obrolan, hasil asesmen `dass21_score` dan `vak_result` otomatis dilampirkan (*attached*) ke tiket dalam format JSONB, sehingga konselor langsung memahami kondisi psikologis tanpa bertanya dari awal.
- **UI/UX Empatik:**
  - **Pill Icebreakers:** Tombol pemantik obrolan (misal: *"Saya butuh didengar"*, *"Saya merasa kewalahan kuliah"*).
  - **Expanding Textarea:** Kolom teks yang membesar secara mulus mengikuti panjang curhatan.

### 4.4. Pertahanan Lapis Ganda (Defense-in-Depth RBAC)
1. **Level API (ElysiaJS Middleware):** Endpoint antrean dan respons konselor dilindungi middleware `requireRole(['counselor', 'admin'])`. Mahasiswa yang mencoba mengakses langsung direspons HTTP `403 Forbidden`.
2. **Level Database (Drizzle ORM Scoping):** Query konselor dibatasi hanya pada tabel `counseling_sessions` dan `messages`. Instruksi JOIN ke tabel `users_auth` diblokir secara struktural pada repository konselor.

### 4.5. Modul WebRTC Intervensi Darurat (Tahap 2 / Opsional)
**Kebutuhan:** Panggilan suara/video P2P untuk krisis tingkat tinggi dengan persetujuan eksplisit (*consent*).

## 5. Struktur Data Inti (Skema Drizzle ORM - PostgreSQL)
> [!IMPORTANT]  
> Pemisahan entitas sangat ketat untuk mencegah kebocoran data identitas (*Double-Blind*). Menggunakan tipe data native PostgreSQL (UUIDv7, JSONB, Text).

- `users_auth`: `id` (UUIDv7 PK), `hashed_identity` (Varchar(64) - SHA-256), `role` (Enum: 'student', 'counselor', 'admin'), `created_at` (Timestamp).
- `counselors_profile`: `id` (UUIDv7 PK), `user_id` (UUID FK), `pseudonym_name` (Varchar: e.g. 'Konselor_A'), `public_key` (Text), `is_available` (Boolean).
- `counseling_sessions`: 
  - `id` (UUIDv7 PK), `student_id` (UUID FK), `counselor_id` (UUID FK), `student_pseudonym` (Varchar).
  - `vak_result` (JSONB): Hasil kuesioner modalitas belajar mahasiswa.
  - `dass21_score` (JSONB): Hasil scoring baku DASS-21 (Depresi, Kecemasan, Stres).
  - `status` (Enum: 'waiting', 'active', 'closed'), `created_at` (Timestamp), `closedAt` (Timestamp).
- `messages`: `id` (UUIDv7 PK), `session_id` (UUID FK), `sender_type` (Enum: 'student', 'counselor', 'system'), `encrypted_content` (Text - Ciphertext base64), `timestamp` (Timestamp).

## 6. Kriteria Keberhasilan (Acceptance Criteria)
- **Validitas Psikometrik:** Hasil skor DASS-21 dan VAK terhitung secara deterministik sesuai norma standar ilmiah.
- **Lighthouse PWA Score:** Audit frontend mencapai skor PWA > 90.
- **Uji Enkripsi (Black-Box):** Inspeksi database (SQL client) hanya menampilkan string acak pada `encrypted_content`.
- **RBAC & Sanitasi API:** Mahasiswa dilarang keras mengakses endpoint antrean konselor (HTTP 403) dan profil asli konselor/mahasiswa tidak pernah bocor ke jaringan.
- **Performa:** Navigasi tanpa full-reload (TanStack Router) dan latensi pesan WebSocket < 200ms.
