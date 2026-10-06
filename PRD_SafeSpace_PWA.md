# Product Requirements Document (PRD)

**Nama Dokumen:** Spesifikasi Kebutuhan Perangkat Lunak & Perancangan Sistem  
**Judul Capstone:** Pengembangan Sistem PraKonseling Anonim dan Pemetaan Potensi Diri untuk Deteksi Dini Academic Burnout pada Ekosistem Pendidikan Jarak Jauh (Studi Kasus: Universitas Terbuka)  
**Mata Kuliah:** STSI4401 CAPSTONE PROJECT — Program Studi Sistem Informasi, FST Universitas Terbuka  
**Platform:** Web (Progressive Web App - PWA)  
**Target Pengguna:** Mahasiswa Universitas Terbuka (Working Adult Learners) & Staf Konselor / Guru BK  
**Status Dokumen:** Terverifikasi & Selaras dengan Proposal Capstone 2026  

---

## 1. Ringkasan Eksekutif & Reposisi Produk
SafeSpace PWA adalah platform **Pra-Konseling Digital** berbasis Progressive Web App (PWA) yang berfungsi sebagai **"P3K Psikologis"** dan jembatan deteksi dini *academic burnout* bagi mahasiswa pendidikan jarak jauh (PJJ). Sistem ini **bukan** pesaing atau pengganti portal konseling resmi kampus (seperti MyScout UT), melainkan gerbang awal bagi mahasiswa yang enggan atau ragu mengakses layanan formal akibat stigma sosial dan ketakutan rekam jejak akademik (*academic paper trail*).

Sistem menjamin rasa aman hakiki melalui:
- **Two-Way Double-Blind Anonymity**: Mahasiswa dan konselor saling dianonimkan (menggunakan pseudonim acak `Mahasiswa #XXXX` dan nama samaran konselor seperti `Konselor_A` / `Psikolog_Athena`).
- **End-to-End Encryption (E2EE)**: Percakapan chatbox terenkripsi secara kriptografis menggunakan Web Crypto API (*Zero-Knowledge Architecture*).
- **Instrumen Psikometrik Baku**: Penentuan tingkat stres dan gaya belajar menggunakan instrumen baku internasional (DASS-21 & VAK) dengan perhitungan rumus matematis murni tanpa bias/halusinasi kecerdasan buatan (*non-AI black box*).
- **AI Empathetic Mood Tracker**: LLM dialokasikan khusus untuk membaca narasi curhatan bebas harian guna memberikan kalimat empati dan rekomendasi pembukaan tiket rujukan awal.

---

## 2. Metodologi Penelitian & Rekayasa Perangkat Lunak

### 2.1. Metodologi Penelitian: Research and Development (R&D)
Penelitian ini mengadopsi pendekatan R&D untuk bidang Sistem Informasi yang bertujuan menghasilkan produk perangkat lunak bernilai guna tinggi dan menguji kelayakannya secara empiris.

### 2.2. Metode Pengembangan Sistem: Prototyping Model
Pengembangan sistem mengikuti 5 tahapan siklus iteratif Prototyping:
1. **Communication & Requirements Gathering**: Identifikasi fenomena *dual role conflict*, *asynchronous isolation*, dan kebutuhan privasi mahasiswa UT.
2. **Quick Plan & Quick Design**: Perancangan antarmuka empatik, palet psikologi warna, struktur basis data Drizzle ORM, dan protokol enkripsi.
3. **Construction of Prototype**: Pembangunan prototipe PWA terintegrasi (DASS-21, VAK, Google OAuth hash, Elysia API, Web Crypto).
4. **User Evaluation & Testing**: Pengujian fungsionalitas (*Black-Box Testing*) dan evaluasi penerimaan pengguna akhir (*User Acceptance Testing* menggunakan *System Usability Scale* / SUS).
5. **Final System & Deployment**: Perbaikan pasca-evaluasi, penyusunan laporan akhir, dan deployment PWA siap pakai.

*(Visualisasi diagram lengkap dapat dilihat dan diunduh di [`docs/flowchart_dashboard.html`](file:///d:/ijplabs/capstone/docs/flowchart_dashboard.html)).*

---

## 3. Landasan Teori UI/UX & Psikologi Warna (Trauma-Informed Design)

Antarmuka SafeSpace didesain khusus untuk pengguna yang sedang mengalami kelelahan mental (*academic burnout*), sehingga menerapkan prinsip:
- **Calm Technology & Low Cognitive Load**: Menyederhanakan alur kerja, menghilangkan elemen yang menekan, dan menerapkan sistem kartu bertahap (*step-by-step wizard*) untuk pengisian kuesioner.
- **Pill Icebreakers & Expanding Textarea**: Menyediakan tombol pemantik topik curhatan pada chatbox untuk mereduksi *blank canvas anxiety*, serta kolom teks yang melebar otomatis.
- **Palet Warna Psikologis**:
  - *Primary (Soft Sage Green - `#4A7C59`)*: Menstimulasi ketenangan sistem saraf parasimpatis dan perasaan aman.
  - *Secondary (Muted Slate Blue - `#3B5998`)*: Membangun kepercayaan (*trust*) dan jaminan privasi.
  - *Background (Warm Ivory - `#F9F9F6`)*: Mencegah silau dan kelelahan visual (*eye strain*) dibanding warna putih murni.
  - *Accent (Warm Amber - `#D97706`)*: Indikator peringatan yang ramah dan suportif tanpa memicu panik layaknya warna merah terang.
- **Aksesibilitas (WCAG 2.1 AA)**: Kontras rasio teks terjamin minimal 4.5:1.

---

## 4. Arsitektur & Teknologi (Tech Stack)

Proyek dikelola dalam struktur **Monorepo** dengan **Bun Workspaces**:

### 4.1. Frontend (Klien - `apps/web`)
- **Core:** React.js dengan Vite + Vite PWA Plugin (Service Worker & Manifest).
- **Routing:** TanStack Router (Type-Safe routing, navigasi tanpa reload).
- **State & Data Fetching:** TanStack Query (caching pesan, sinkronisasi status auth).
- **UI/UX:** Tailwind CSS v4 & Shadcn UI (desain empatik berbasis token warna Sage/Slate).
- **Kriptografi:** Web Crypto API (E2EE RSA-OAEP & AES-GCM).

### 4.2. Backend (Peladen - `apps/api`)
- **Framework:** ElysiaJS (berjalan di atas runtime Bun, high-throughput, low-latency).
- **Real-time:** Elysia WebSockets (komunikasi chat waktu nyata & WebRTC signaling).
- **Authentication & RBAC:** Google OAuth 2.0 / OpenID Connect + One-Way SHA-256 HMAC Identity Sanitization + Role-Based Access Control Middleware.
- **AI Integration:** Fetch API ke LLM khusus untuk analisis sentimen & pesan empati Mood Tracker.
- **Database & ORM:** PostgreSQL dikelola dengan Drizzle ORM.

### 4.3. Kernel Bersama (`packages/shared` & `packages/db`)
- `@safespace/shared`: Skema validasi Zod, formula matematika DASS-21/VAK murni, crypto hasher, dan type-definitions.
- `@safespace/db`: Skema Drizzle ORM PostgreSQL (`users_auth`, `counselors_profile`, `counseling_sessions`, `messages`).

---

## 5. Peran Pengguna (User Roles & RBAC)
1. **Mahasiswa (`student`):** Pengguna akhir yang melakukan asesmen mandiri, mengisi kuesioner, dan berkonsultasi dalam mode pseudonim (`Mahasiswa #XXXX`).
2. **Konselor (`counselor`):** Staf yang merespons tiket dan membaca lampiran profil DASS-21/VAK. Tampil sebagai nama samaran (`Konselor_A` / `Psikolog_Athena`) dari sudut pandang mahasiswa.
3. **Super Admin (`admin`):** Pengelola sistem yang memantau metrik agregat tanpa akses ke isi percakapan terenkripsi.
4. **Sistem (Deteksi Dini & Auto-Router):** Modul tanpa antarmuka yang mengolah skor DASS-21/VAK dan sentimen Mood Tracker.

---

## 6. Fitur & Spesifikasi Kebutuhan

### 6.1. Modul Autentikasi Tanpa Jejak & RBAC
- **Alur:**
  1. Pengguna login menggunakan Google Sign-In.
  2. ElysiaJS memverifikasi ID Token Google dan memvalidasi domain terhadap `ALLOWED_EMAIL_DOMAINS`.
  3. Peladen melakukan *one-way cryptographic hash* (`SHA-256(sub + SECRET_PEPPER)`), lalu membuang data nama, email, dan foto dari memori.
  4. Sesi JWT diterbitkan hanya berisi `userId` (UUIDv7), `role` (`student` | `counselor` | `admin`), dan `pseudonym`.

### 6.2. Modul Pemetaan Diri (Instrumen Baku DASS-21 & VAK)
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

### 6.3. Modul Double-Blind Dua Arah & Empathetic Chatbox
- **Two-Way Anonymity:** Mahasiswa beridentitas `Mahasiswa #XXXX`, konselor beridentitas `Konselor_A` / `Psikolog_Athena`.
- **Integrasi Modul (Attached Profile):** Saat mahasiswa membuka sesi obrolan, hasil asesmen `dass21_score` dan `vak_result` otomatis dilampirkan (*attached*) ke tiket dalam format JSONB, sehingga konselor langsung memahami kondisi psikologis tanpa bertanya dari awal.
- **UI/UX Empatik:**
  - *Pill Icebreakers:* Tombol pemantik obrolan (misal: *"Saya butuh didengar"*, *"Saya merasa kewalahan kuliah"*).
  - *Expanding Textarea:* Kolom teks yang membesar secara mulus mengikuti panjang curhatan.

### 6.4. Pertahanan Lapis Ganda (Defense-in-Depth RBAC)
1. **Level API (ElysiaJS Middleware):** Endpoint antrean dan respons konselor dilindungi middleware `requireRole(['counselor', 'admin'])`. Mahasiswa yang mencoba mengakses langsung direspons HTTP `403 Forbidden`.
2. **Level Database (Drizzle ORM Scoping):** Query konselor dibatasi hanya pada tabel `counseling_sessions` dan `messages`. Instruksi JOIN ke tabel `users_auth` diblokir secara struktural pada repository konselor.

---

## 7. Kriteria Keberhasilan & Pengujian (Acceptance Criteria)

Pengujian dibatasi pada ranah *Software Engineering*:
1. **Uji Fungsional (Black-Box Testing):**
   - Seluruh endpoint API, formulir asesmen DASS-21 & VAK, serta flow chatroom lolos uji fungsional tanpa bug kritis.
   - Database inspection (SQL Client) mengonfirmasi bahwa kolom `messages.encrypted_content` hanya berisi string *ciphertext* base64 acak.
2. **Uji Penerimaan Pengguna (User Acceptance Testing via SUS):**
   - Evaluasi kelayakan adopsi dan kemudahan antarmuka menghasilkan skor rata-rata **SUS > 68** (*Acceptable / Good category*).
3. **Audit Kualitas PWA:**
   - Skor audit Google Lighthouse PWA mencapai nilai **> 90** untuk responsivitas dan *caching capability*.
4. **Verifikasi RBAC & Privasi:**
   - Percobaan akses ilegal mahasiswa ke antrean konselor menghasilkan HTTP 403.
   - Tidak ada rekam jejak identitas asli (NIM/Email/Nama) yang tersimpan di database atau tercetak di log server.
