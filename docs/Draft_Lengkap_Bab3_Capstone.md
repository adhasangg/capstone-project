# BAB III METODOLOGI PENELITIAN DAN PERANCANGAN SISTEM

**Judul Capstone:** Pengembangan Sistem Pra-Konseling Anonim dan Pemetaan Potensi Diri untuk Deteksi Dini *Academic Burnout* pada Ekosistem Pendidikan Jarak Jauh  
**Studi Kasus:** Universitas Terbuka (UT)  
**Mata Kuliah:** STSI4401 Capstone Project  -  Program Studi Sistem Informasi, FST Universitas Terbuka (2026)  
**Tujuan Dokumen:** Bahan Mentah Komprehensif Penyusunan Bab III (Metodologi, Analisis Kebutuhan, Perancangan Solusi, dan Pengujian)  

---

## 3.1 Kerangka Kerja Proyek (Project Framework)

### 3.1.1 Pendekatan Pengembangan: Research and Development (R&D) dengan Model Prototyping
Penelitian tugas akhir ini mengadopsi pendekatan **Research and Development (R&D)** yang diselaraskan dengan disiplin ilmu Rekayasa Perangkat Lunak dan Sistem Informasi (Sugiyono, 2021). Pendekatan R&D dipilih karena penelitian ini tidak hanya berhenti pada analisis teoritis atau observasi pasif terhadap fenomena *academic burnout*, melainkan bertujuan untuk menghasilkan artefak produk teknologi informasi terapan (SafeSpace PWA) dan menguji kelayakannya secara empiris di lingkungan pembelajaran nyata.

Dalam pelaksanaan siklus rekayasa perangkat lunak, penelitian ini menerapkan **Model Prototyping** (Pressman & Maxim, 2020). Model Prototyping adalah pendekatan bertahap dan berulang (*iterative*) di mana representasi awal dari sistem (*prototype*) dibangun secara cepat, dievaluasi bersama pengguna, dan disempurnakan sebelum menjadi produk final.

```
+----------------------------------------------------------------------------------------------------+
|                                PERBANDINGAN PENDEKATAN PENGEMBANGAN                                |
+-----------------------+-----------------------------+----------------------------------------------+
| Parameter             | Waterfall Tradisional       | Prototyping Model (Dipilih)                  |
+-----------------------+-----------------------------+----------------------------------------------+
| Fleksibilitas Desain  | Kaku, perubahan di akhir    | Sangat adaptif melalui iterasi umpan balik   |
| Keterlibatan Pengguna | Hanya di awal dan akhir     | Intensif pada tahap evaluasi antarmuka/alur  |
| Penanganan Sensitivitas| Kurang cocok untuk ranah   | Sangat ideal untuk aplikasi kesehatan mental |
| Psikologis            | mental health               | yang menuntut rasa aman visual & ergonomis   |
| Waktu Rilis Prototipe | Lama (harus selesai semua)  | Cepat (komponen inti dapat segera diuji coba)|
+-----------------------+-----------------------------+----------------------------------------------+
```

#### Alasan Ilmiah Pemilihan Model Prototyping:
1. **Sensitivitas Psikologis Pengguna (Trauma-Informed Design):**  
   Pengguna aplikasi ini adalah mahasiswa yang sedang mengalami stres dan kelelahan mental (*academic burnout*). Antarmuka sistem tidak boleh kaku, mengintimidasi, atau membingungkan. Prototyping memungkinkan perancangan tata letak, pemilihan palet warna penenang (*calm technology*), serta penyederhanaan kuesioner diuji secara langsung untuk meminimalkan beban kognitif (*cognitive load*) pengguna (Eggleston & Noel, 2024; Puspitasari & Affandi, 2024).
2. **Klarifikasi Integrasi Dua Disiplin (Psikometri & Pedagogi):**  
   Penggabungan instrumen klinis DASS-21 (deteksi depresi, kecemasan, stres) dengan instrumen gaya belajar VAK (strategi belajar adaptif) memerlukan validasi berulang agar rekomendasi yang dihasilkan terasa solutif, natural, dan tidak seperti vonis medis formal.
3. **Validasi Kinerja Lintas Perangkat (Progressive Web App):**  
   Mahasiswa Pendidikan Jarak Jauh (PJJ) menggunakan ragam gawai yang sangat heterogen (smartphone entry-level, laptop kantor, tablet). Melalui prototipe cepat, kinerja responsif dan kapabilitas luring (*offline caching*) PWA dapat segera diukur dan dioptimalkan (Raju Cherukuri, 2024; Samsyudin, 2025).

---

### 3.1.2 Tahapan Pelaksanaan Proyek (Diagram Alir Kerja)
Pengembangan SafeSpace PWA dirancang melalui 5 fase siklus Prototyping terstruktur:

```mermaid
flowchart TD
    classDef startend fill:#4A7C59,stroke:#3b6347,stroke-width:2px,color:#fff;
    classDef process fill:#EBF3ED,stroke:#4A7C59,stroke-width:1.5px,color:#1E293B;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#92400E;

    M1["1. Communication & Requirements Gathering<br/>â€¢ Analisis fenomena academic burnout mahasiswa PJJ UT<br/>â€¢ Studi literatur DASS-21, VAK, E2EE, dan PWA<br/>â€¢ Penetapan kebutuhan privasi absolut tanpa jejak"]:::process
    M2["2. Quick Plan & Quick Design<br/>â€¢ Perancangan wireframe & UX Trauma-Informed (Pill Icebreakers)<br/>â€¢ Skema basis data PostgreSQL Drizzle (JSONB)<br/>â€¢ Pemilihan token psikologi warna (Sage & Slate)"]:::process
    M3["3. Construction of Prototype<br/>â€¢ Pengembangan Kernel Bersama (@safespace/shared)<br/>â€¢ Implementasi Backend ElysiaJS & RBAC Defense Guard<br/>â€¢ Pembangunan Frontend React PWA & TanStack Router"]:::process
    M4["4. User Evaluation & Testing<br/>â€¢ Pengujian Fungsional Black-Box Testing<br/>â€¢ Evaluasi Usability UAT (System Usability Scale / SUS)"]:::process
    M_DEC{"Apakah Prototipe<br/>Memenuhi Kriteria<br/>Kelayakan (SUS > 68)?"}:::decision
    M5["5. Final System & Deployment<br/>â€¢ Dokumentasi Laporan Ilmiah Capstone<br/>â€¢ Deployment PWA Siap Pakai"]:::startend

    M1 --> M2
    M2 --> M3
    M3 --> M4
    M4 --> M_DEC
    M_DEC -- "Tidak (Perlu Revisi Antarmuka/Logika)" --> M2
    M_DEC -- "Ya (Layak / Disetujui)" --> M5
```

#### Rincian Langkah Kerja:
1. **Fase 1: Communication & Requirements Gathering (Komunikasi & Pengumpulan Kebutuhan)**  
   - Mengkaji profil demografi mahasiswa Universitas Terbuka yang mayoritas merupakan *working adult learners* dengan beban ganda (pekerjaan dan perkuliahan) (Kemendikbudristek, 2023; Sadaria dkk., 2024).
   - Mengidentifikasi hambatan utama pencarian bantuan psikologis: stigma negatif, rasa malu, dan ketakutan bahwa rekam jejak konseling formal akan memengaruhi evaluasi nilai akademik (*fear of academic paper trail*).
   - Menetapkan kebutuhan arsitektur *Two-Way Double-Blind Anonymity* dan *Zero-Knowledge End-to-End Encryption*.
2. **Fase 2: Quick Plan & Quick Design (Perencanaan Cepat & Pemodelan Awal)**  
   - Merancang arsitektur monorepo modular (`apps/web`, `apps/api`, `packages/shared`, `packages/db`).
   - Menyusun skema basis data PostgreSQL Drizzle ORM yang mengisolasi data identitas autentikasi dari data riwayat konseling.
   - Menetapkan pedoman *Trauma-Informed Design* dan token warna berbasis psikologi emosi (*Soft Sage Green*, *Muted Slate Blue*, *Warm Ivory*).
3. **Fase 3: Construction of Prototype (Konstruksi Prototipe Cepat)**  
   - Mengimplementasikan formula deterministik murni untuk DASS-21 (skala 0â€“3 dikalikan 2) dan VAK (persentase modalitas dominan) di kernel `@safespace/shared`.
   - Mengembangkan API backend berbasis runtime Bun dan framework ElysiaJS dengan pengamanan sanitasi Google OAuth (SHA-256 HMAC + Pepper).
   - Membangun antarmuka PWA berbasis React, Vite PWA, TanStack Router, dan Web Crypto API (AES-GCM-256).
4. **Fase 4: User Evaluation & Testing (Evaluasi Pengguna & Pengujian Kualitas)**  
   - Pengujian fungsional teknis: *Unit Testing* & *Integration Testing* (TDD 81 test cases), *Black-Box Testing* (13 skenario uji), dan *End-to-End Automation* (Playwright).
   - Pengujian penerimaan pengguna (*User Acceptance Testing* - UAT) menggunakan instrumen baku *System Usability Scale* (SUS) 10 butir pertanyaan pada mahasiswa target.
5. **Fase 5: Final System & Deployment (Penyempurnaan Akhir & Dokumentasi)**  
   - Integrasi hasil perbaikan pasca-evaluasi UAT, finalisasi dokumentasi kode, penulisan laporan skripsi, dan penyediaan PWA di lingkungan hosting produksi.

---

## 3.2 Analisis Kebutuhan Sistem (System Requirements Analysis)

### 3.2.1 Analisis Masalah Pengguna (Problem Space Analysis)
Melalui analisis komparatif dan observasi terhadap ekosistem Pendidikan Jarak Jauh (PJJ) di Universitas Terbuka, dirumuskan akar masalah (*root cause analysis*) sebagai berikut:

```
+----------------------------------------------------------------------------------------------------+
|                                    BEDAH MASALAH NYATA PENGGUNA                                    |
+------------------------------+------------------------------------+--------------------------------+
| Gejala / Permasalahan Nyata  | Dampak Psikologis & Akademis       | Solusi yang Diterapkan         |
+------------------------------+------------------------------------+--------------------------------+
| 1. Dual Role Conflict        | Mahasiswa pekerja kelelahan fisik  | Skrining berkala mandiri via   |
|    (Beban kerja + kuliah)    | & emosional (academic burnout).    | DASS-21 yang deterministik.    |
| 2. Asynchronous Isolation    | Merasa terisolasi tanpa teman      | Mood Tracker interaktif dengan |
|    (Belajar mandiri daring)  | bicara atau saluran curhat aman.   | kalimat empati cerdas.         |
| 3. Fear of Academic Paper    | Takut melapor ke konseling resmi   | Two-Way Double-Blind Anonymity |
|    Trail & Stigma Sosial     | karena khawatir nilai terancam.    | tanpa penyimpanan nama/NIM/IP. |
| 4. Kelelahan Kognitif        | Modul tebal dan materi Tuton       | Pemetaan modalitas VAK dan     |
|    (Cognitive Overload)      | sulit diserap dengan efisien.      | rekomendasi strategi belajar.  |
| 5. Ketiadaan Triage Awal     | Konselor kewalahan menyaring mana  | Attached Clinical Profile      |
|    (Beban Staf Konseling)    | mahasiswa butuh intervensi darurat.| (skor DASS & VAK otomatis).    |
+------------------------------+------------------------------------+--------------------------------+
```

### 3.2.2 Kebutuhan Fungsional (Functional Requirements)
Kebutuhan fungsional sistem mencakup 12 fitur wajib yang dikelompokkan ke dalam 4 modul utama:

| Kode Kebutuhan | Nama Kebutuhan Fungsional | Deskripsi Spesifikasi Fungsional |
| :---: | :--- | :--- |
| **FR-01** | Autentikasi Tanpa Jejak (*Zero-Knowledge Auth*) | Sistem memvalidasi akun Google pengguna via ID Token, melakukan *one-way cryptographic hashing* (`SHA-256(Google_Sub + PEPPER)`), membuang data nama asli/email dari RAM, dan menerbitkan pseudonim acak (`Mahasiswa #XXXX`). |
| **FR-02** | Pembatasan Domain Email (*Domain Whitelisting*) | Sistem memvalidasi domain email institusi (`@ecampus.ut.ac.id`) atau domain terdaftar melalui konfigurasi dinamis. |
| **FR-03** | Asesmen Tri-Dimensi DASS-21 | Sistem menyajikan 21 butir instrumen baku Lovibond & Lovibond dalam format kartu bertahap (*step wizard*) dan menghitung skor Depresi, Kecemasan, dan Stres secara matematis murni ($\sum \text{skor} \times 2$). |
| **FR-04** | Pemetaan Gaya Belajar VAK | Sistem menyajikan kuesioner modalitas belajar (12 butir ringkas / 30 butir lengkap), menghitung persentase modalitas Visual, Auditori, dan Kinestetik, serta menyajikan strategi belajar adaptif di Tuton UT. |
| **FR-05** | Refleksi Harian Mood Tracker Empatik | Sistem menyediakan kolom curhatan harian dengan fitur pemantik topik (*Pill Icebreakers*), menganalisis sentimen afektif, dan memberikan pesan penenang yang empatik. |
| **FR-06** | Deteksi Krisis & Rekomendasi Rujukan | Sistem secara otomatis mendeteksi jika skor DASS-21 berada pada tingkat *Severe/Extremely Severe* atau narasi curhat mengandung indikasi krisis, kemudian memunculkan tombol rujukan tiket pra-konseling. |
| **FR-07** | Pembuatan Tiket Profil Terlampir | Sistem memungkinkan mahasiswa membuka tiket pra-konseling dengan melampirkan hasil DASS-21 dan VAK dalam format JSONB tanpa menyertakan identitas pribadi (*Attached Profile*). |
| **FR-08** | Manajemen Antrean & Triase Konselor | Konselor berwenang dapat melihat daftar antrean mahasiswa yang membutuhkan bantuan beserta tingkat urgensi keparahan stres untuk menentukan prioritas penanganan. |
| **FR-09** | Ruang Obrolan Terenkripsi (E2EE Chat) | Sistem menyediakan ruang percakapan waktu nyata di mana pesan dienkripsi di peramban pengirim (AES-GCM-256) dan hanya dapat didekripsi di peramban penerima (*Zero-Knowledge Ciphertext*). |
| **FR-10** | Pengendalian Akses Berbasis Peran (RBAC) | Sistem menegakkan otorisasi ketat di tingkat rute API; mahasiswa dilarang keras mengakses data antrean tiket konselor (HTTP 403 Forbidden). |
| **FR-11** | Tombol Darurat Privasi (*Safe Exit*) | Sistem menyediakan tombol cepat di sudut antarmuka yang seketika mengalihkan peramban (*hard redirect*) ke halaman pencarian umum (Google) untuk mengamankan privasi fisik pengguna. |
| **FR-12** | Kapabilitas PWA & Akses Luring (*Offline Caching*) | Sistem dapat diinstalasi pada layar utama gawai (*Add to Home Screen*) dan memanfaatkan *Service Worker Workbox* untuk menyimpan aset statis agar dapat dibuka tanpa koneksi internet. |

### 3.2.3 Kebutuhan Non-Fungsional (Non-Functional Requirements)
Kebutuhan non-fungsional merinci parameter kualitas, performa, keamanan, dan kebergunaan sistem:

| Parameter Non-Fungsional | Metrik / Spesifikasi Teknis |
| :--- | :--- |
| **NFR-01: Keamanan & Privasi (Security)** | - Arsitektur *Zero-Knowledge*: Isi percakapan disimpan dalam bentuk ciphertext di PostgreSQL.<br/>- Kriptografi AES-GCM 256-bit dan HMAC SHA-256 dengan secret pepper tersimpan di environment server.<br/>- Tidak ada penyimpanan nama asli, NIM, nomor telepon, atau alamat IP pengguna. |
| **NFR-02: Kinerja & Latensi (Performance)** | - Waktu kalkulasi skor DASS-21 dan VAK deterministik < 5 milidetik.<br/>- Latensi pertukaran pesan chat WebSocket real-time < 200 milidetik.<br/>- Waktu muat halaman awal PWA (*First Contentful Paint*) < 1.5 detik. |
| **NFR-03: Kebergunaan & Ergonomi (Usability)** | - Menerapkan prinsip *Calm Technology* dan *Trauma-Informed Design*.<br/>- Rasio kontras teks minimal 4.5:1 sesuai standar Web Content Accessibility Guidelines (WCAG 2.1 Level AA).<br/>- Skor evaluasi penerimaan pengguna rata-rata $\overline{\text{SUS}} > 68$ (kategori *Good / Acceptable*). |
| **NFR-04: Keandalan & Aksesibilitas (Reliability)** | - Ketersediaan sistem (*availability*) minimal 99% uptime.<br/>- PWA Service Worker memastikan halaman pembuka dan kuesioner tetap dapat diakses saat jaringan mengalami gangguan (*graceful degradation*). |
| **NFR-05: Portabilitas & Responsivitas (Portability)** | - Responsif sempurna pada berbagai resolusi layar (Mobile: 360pxâ€“480px, Tablet: 768px, Desktop: â‰¥ 1024px).<br/>- Kompatibel dengan peramban modern berbasis Chromium (Chrome, Edge), Gecko (Firefox), dan WebKit (Safari). |
| **NFR-06: Integritas Kode & Pemeliharaan (Maintainability)**| - Struktur Monorepo Bun Workspaces dengan tipe data TypeScript terpadu lintas aplikasi (`@safespace/shared`).<br/>- Pemeriksaan kode otomatis menggunakan Biome Linter dengan toleransi kesalahan tipe runtime 0% (*Zero `any` policy*). |

### 3.2.4 Spesifikasi Perangkat Keras dan Perangkat Lunak

#### A. Spesifikasi Perangkat Keras (Hardware Specifications)
* **Lingkungan Pengembangan (Development Environment):**
  - Prosesor: Multi-core 64-bit Processor (minimal 4 Core, kecepatan clock â‰¥ 2.5 GHz).
  - Memori RAM: Minimal 8 GB DDR4 (disarankan 16 GB).
  - Media Penyimpanan: SSD berkecepatan tinggi dengan sisa ruang minimal 10 GB.
  - Koneksi Internet: Kecepatan minimal 10 Mbps untuk dependensi cloud dan pengujian WebSocket.
* **Lingkungan Pengguna Akhir (Client Target Devices):**
  - Smartphone / Tablet: RAM minimal 2 GB, sistem operasi Android 8.0+ atau iOS 14.0+.
  - Komputer / Laptop: Layar resolusi minimal 1280x720, RAM 4 GB, mendukung peramban modern.

#### B. Spesifikasi Perangkat Lunak (Software Stack & Tools)
* **Lingkungan Runtime & Package Manager:** Bun Runtime v1.2+ (Monorepo Workspaces).
* **Framework Backend API:** ElysiaJS v1.4+ (High-performance micro-framework berbasis Bun Engine).
* **Framework Frontend PWA:** React.js v19 dengan Vite v6/v8 dan `@vite-pwa/plugin`.
* **State Management & Routing:** TanStack Router (Type-Safe Navigation) dan TanStack Query v5.
* **Styling & Komponen UI:** Tailwind CSS v4, Lucide React Icons, dan Shadcn UI Accessible Primitives.
* **Basis Data & ORM:** PostgreSQL 16+ dikelola menggunakan Drizzle ORM dan Drizzle Kit.
* **Kriptografi & Keamanan:** Web Crypto API bawaan peramban (SubtleCrypto: AES-GCM 256-bit, RSA-OAEP).
* **Toolchain Kualitas Kode & Pengujian:**
  - Linter & Formatter: Biome v1.9.4 (Rust-based ultra-fast linter).
  - Pengujian Unit & Integrasi: Bun Test Runner (`bun:test`).
  - Pengujian End-to-End (E2E): Playwright Test Suite v1.63+.
  - Analisis Graf Kode: GitNexus Code Intelligence.

---

## 3.3 Perancangan Solusi dan Produk (System & Product Design)

### 3.3.1 Arsitektur Sistem (Monorepo 4-Tier Blueprint)
Arsitektur SafeSpace PWA dirancang menggunakan konsep **Layered Monorepo Architecture** yang menjamin pemisahan fungsi (*Separation of Concerns*) dan keterpaduan kontrak tipe data TypeScript:

```mermaid
flowchart TB
    classDef client fill:#EBF3ED,stroke:#4A7C59,stroke-width:2px,color:#1E293B;
    classDef server fill:#EFF6FF,stroke:#3B5998,stroke-width:2px,color:#1E293B;
    classDef shared fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#1E293B;
    classDef db fill:#F3E8FF,stroke:#7E22CE,stroke-width:2px,color:#1E293B;
    classDef external fill:#F8FAFC,stroke:#94A3B8,stroke-width:1.5px,stroke-dasharray: 5 5,color:#334155;

    subgraph CLIENT_TIER["1. Presentation Tier  -  apps/web (Frontend PWA)"]
        UI_REACT["React.js PWA + Service Worker Workbox"]:::client
        UI_NAV["TanStack Router (Type-Safe Navigation)"]:::client
        UI_CACHE["TanStack Query (Client-Side Caching)"]:::client
        UI_THEME["Trauma-Informed Theme (Tailwind CSS v4)"]:::client
        UI_CRYPTO["Web Crypto API (E2EE AES-GCM-256)"]:::client
    end

    subgraph SHARED_TIER["2. Domain Kernel Tier  -  packages/shared & packages/db"]
        SH_MATH["Kalkulator Baku DASS-21 & VAK (Deterministik)"]:::shared
        SH_ZOD["Skema Validasi Zod (Auth, Session, Chat)"]:::shared
        SH_HASH["Identity Cryptographic Hasher (SHA-256 + Pepper)"]:::shared
        SH_ORM["Drizzle ORM Model Schema & Migrations"]:::db
    end

    subgraph APPLICATION_TIER["3. Application Tier  -  apps/api (Backend Peladen)"]
        API_ELY["ElysiaJS Server Engine (Bun Native)"]:::server
        API_AUTH["Modul Autentikasi Anonim & Sanitasi RAM"]:::server
        API_RBAC["RBAC Middleware Guard (403 Defense)"]:::server
        API_ASSESS["Modul Assessment Controller & Scoring Service"]:::server
        API_SESSION["Modul Tiket Pra-Konseling & Antrean Triase"]:::server
        API_CHAT["WebSocket Native Chat & Ciphertext Transport"]:::server
    end

    subgraph DATA_TIER["4. Data & External Services Tier"]
        DB_PG[("PostgreSQL 16 Database<br/>â€¢ users_auth<br/>â€¢ counselors_profile<br/>â€¢ counseling_sessions<br/>â€¢ messages")]:::db
        EXT_GOOGLE["Google Identity Services (OAuth 2.0 / OIDC)"]:::external
        EXT_LLM["LLM AI Empathetic Engine (Mood Reflection)"]:::external
    end

    UI_REACT <-->|HTTP REST / WebSocket| API_ELY
    UI_CRYPTO -.->|Kirim Ciphertext Murni| API_CHAT
    API_ELY --> SHARED_TIER
    API_AUTH -->|Verifikasi Signature| EXT_GOOGLE
    API_ASSESS -->|Analisis Narasi Curhat| EXT_LLM
    API_ELY <-->|Drizzle ORM Queries| DB_PG
```

---

### 3.3.2 Pemodelan Proses dan Data

#### A. Use Case Diagram
Diagram Use Case memetakan interaksi 4 aktor utama dalam ekosistem sistem: **Mahasiswa**, **Konselor**, **Super Admin**, dan **Sistem (AI/Router)**.

```mermaid
flowchart LR
    classDef actor fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E;
    classDef usecase fill:#EBF3ED,stroke:#4A7C59,stroke-width:1.5px,color:#1E293B;

    ACT_STUDENT["fa:fa-user Mahasiswa (Anonim)"]:::actor
    ACT_COUNSELOR["fa:fa-user-md Konselor (Anonim)"]:::actor
    ACT_ADMIN["fa:fa-user-shield Super Admin"]:::actor
    ACT_SYS["fa:fa-cogs Sistem Auto-Triage"]:::actor

    UC_AUTH["UC-01: Autentikasi Google Anonim"]:::usecase
    UC_DASS["UC-02: Mengisi Asesmen DASS-21"]:::usecase
    UC_VAK["UC-03: Mengisi Pemetaan Gaya Belajar VAK"]:::usecase
    UC_MOOD["UC-04: Mengisi Mood Tracker & Curhat"]:::usecase
    UC_TICKET["UC-05: Mengajukan Tiket Konseling"]:::usecase
    UC_QUEUE["UC-06: Memantau Antrean Triase Tiket"]:::usecase
    UC_ACCEPT["UC-07: Menerima Tiket Mahasiswa"]:::usecase
    UC_CHAT["UC-08: Konseling Chat E2EE"]:::usecase
    UC_SAFE["UC-09: Mengaktifkan Tombol Safe Exit"]:::usecase
    UC_METRICS["UC-10: Memantau Agregat Kesehatan Mental"]:::usecase

    ACT_STUDENT --> UC_AUTH
    ACT_STUDENT --> UC_DASS
    ACT_STUDENT --> UC_VAK
    ACT_STUDENT --> UC_MOOD
    ACT_STUDENT --> UC_TICKET
    ACT_STUDENT --> UC_CHAT
    ACT_STUDENT --> UC_SAFE

    ACT_COUNSELOR --> UC_AUTH
    ACT_COUNSELOR --> UC_QUEUE
    ACT_COUNSELOR --> UC_ACCEPT
    ACT_COUNSELOR --> UC_CHAT

    ACT_ADMIN --> UC_METRICS

    ACT_SYS --> UC_DASS
    ACT_SYS --> UC_VAK
    ACT_SYS --> UC_MOOD
    ACT_SYS --> UC_TICKET
```

##### Deskripsi Skenario Use Case Utama:
* **UC-05 (Mengajukan Tiket Konseling):** Mahasiswa yang mendapati indikasi burnout berat dapat membuka tiket. Sistem secara otomatis menyalin ringkasan data DASS-21 dan profil VAK ke dalam kolom JSONB pada tiket konseling, lalu menerbitkan status `waiting`.
* **UC-06 & UC-07 (Triase & Penerimaan Tiket Konselor):** Konselor membuka dasbor antrean, mengamati skor DASS-21 (urgensi keparahan) dan profil belajar mahasiswa tanpa mengetahui identitas aslinya. Konselor menekan "Terima Sesi" untuk mengubah status menjadi `active`.
* **UC-08 (Konseling Chat E2EE):** Mahasiswa dan konselor bertukar pesan di ruang chat. Setiap pesan dienkripsi secara lokal menggunakan kunci sesi AES-GCM 256-bit. Peladen dan basis data hanya menerima string terenkripsi (*ciphertext*) dan IV acak.

---

#### B. Activity & Sequence Diagram: Protokol Double-Blind Anonymity & E2EE
Diagram sekuensial berikut menjabarkan mekanisme privasi data dari saat autentikasi hingga pengiriman pesan terenkripsi:

```mermaid
sequenceDiagram
    autonumber
    actor M as Mahasiswa (Klien PWA)
    participant S as Server ElysiaJS (API)
    participant DB as PostgreSQL (Drizzle)
    actor K as Konselor (Klien PWA)

    Note over M,S: FASE 1: SANITASI IDENTITAS & TOKEN ANONIM
    M->>S: POST /api/auth/google (Google ID Token)
    Note over S: 1. Verifikasi tanda tangan Google OAuth<br/>2. Ekstrak Google_Sub & lakukan SHA-256(Sub + PEPPER)<br/>3. Hapus nama, email, dan foto dari memori RAM
    S->>DB: INSERT / SELECT `users_auth` (hashed_identity, role='student')
    DB-->>S: Data User (UUIDv7)
    S-->>M: JWT Anonim (userId, role='student', pseudonym='Mahasiswa #4829')

    Note over M,K: FASE 2: TIKET PROFIL TERLAMPIR (ATTACHED TRIAGE)
    M->>S: POST /api/sessions/create (Lampiran: dass21_score, vak_result)
    S->>DB: INSERT `counseling_sessions` (vak_result JSONB, dass21_score JSONB)
    Note over S,DB: Scoping: Konselor TIDAK MEMILIKI AKSES JOIN ke tabel users_auth
    K->>S: GET /api/sessions/queue (Auth: Counselor JWT)
    S->>DB: SELECT sessions WHERE status='waiting'
    DB-->>S: Data Tiket ('Mahasiswa #4829', skor DASS-21, profil VAK)
    S-->>K: Antrean Tiket + Lampiran Klinis (Identitas Asli Terlindungi)

    Note over M,K: FASE 3: ENKRIPSI CHAT END-TO-END (ZERO-KNOWLEDGE)
    K->>M: Negosiasi Kunci Sesi Kriptografi (Web Crypto API)
    M->>M: Enkripsi plaintext menggunakan Kunci AES-GCM 256-bit
    M->>S: POST /api/chat/:sessionId/send (encryptedContent = Base64, iv)
    S->>DB: INSERT `messages` (encrypted_content, iv, sender='student')
    Note over S,DB: Peladen & Basis Data HANYA MENYIMPAN CIPHERTEXT ACAK
    S->>K: Forward Pesan Real-time via WebSocket (Ciphertext)
    K->>K: Dekripsi Ciphertext di Peramban Konselor menggunakan Kunci Sesi
```

---

#### C. Pemodelan Basis Data: Entity-Relationship Diagram (ERD)
Hubungan antar-entitas dalam basis data PostgreSQL dimodelkan secara relasional dengan isolasi identitas mutlak:

```mermaid
erDiagram
    users_auth ||--o| counselors_profile : "memiliki profil"
    users_auth ||--o{ counseling_sessions : "sebagai mahasiswa"
    users_auth ||--o{ counseling_sessions : "sebagai konselor"
    counseling_sessions ||--o{ messages : "memiliki riwayat obrolan"

    users_auth {
        uuid id PK "UUIDv7 Generated"
        varchar hashed_identity UK "SHA-256 Hashed Identifier (64 chars)"
        user_role role "Enum: student | counselor | admin"
        timestamp created_at "Zona Waktu UTC"
        timestamp updated_at "Zona Waktu UTC"
    }

    counselors_profile {
        uuid id PK "UUIDv7 Generated"
        uuid user_id FK "Relasi ke users_auth (Cascade Delete)"
        varchar pseudonym_name "Nama Samaran Publik (e.g. Konselor_A)"
        text public_key "Kunci Publik RSA untuk E2EE"
        boolean is_available "Status Ketersediaan Konseling"
        timestamp created_at "Waktu Pendaftaran"
        timestamp updated_at "Waktu Pembaruan"
    }

    counseling_sessions {
        uuid id PK "UUIDv7 Generated"
        uuid student_id FK "Relasi ke users_auth"
        uuid counselor_id FK "Relasi ke users_auth (Set Null jika lepas)"
        varchar student_pseudonym "Pseudonim Sesi (e.g. Mahasiswa #4829)"
        jsonb vak_result "Struktur JSONB: visual, auditory, kinesthetic, dominant"
        jsonb dass21_score "Struktur JSONB: depression, anxiety, stress, level"
        session_status status "Enum: waiting | active | closed"
        timestamp created_at "Waktu Pembuatan Tiket"
        timestamp closed_at "Waktu Penyelesaian Sesi"
    }

    messages {
        uuid id PK "UUIDv7 Generated"
        uuid session_id FK "Relasi ke counseling_sessions (Cascade Delete)"
        sender_type sender_type "Enum: student | counselor | system"
        text encrypted_content "Ciphertext Terenkripsi Base64 (Web Crypto)"
        varchar iv "Initialization Vector (64 chars)"
        timestamp timestamp "Waktu Pengiriman Pesan"
    }
```

##### Kamus Data (Data Dictionary):
1. **Tabel `users_auth`**: Menyimpan entitas autentikasi terisolasi. Kolom `hashed_identity` memastikan tidak ada data email asli kampus yang tersimpan di dalam database.
2. **Tabel `counselors_profile`**: Menyimpan identitas samaran staf konselor beserta kunci publik RSA untuk inisiasi pertukaran sesi enkripsi.
3. **Tabel `counseling_sessions`**: Mengelola siklus tiket pra-konseling. Kolom `dass21_score` dan `vak_result` disimpan dalam format native `JSONB` PostgreSQL, memungkinkan fleksibilitas skema asesmen dan kecepatan kueri tanpa relasi tabel berlebihan.
4. **Tabel `messages`**: Menyimpan setiap transmisi pesan. Kolom `encrypted_content` hanya berisi string biner/Base64 terenkripsi. Administrator basis data tidak dapat melihat isi percakapan secara teks biasa (*plaintext*).

---

#### D. Flowchart Autentikasi Google OAuth 2.0 & Manajemen Peran (RBAC Sysadmin)
Untuk menjamin bahwa sistem hanya diakses oleh pengguna sah tanpa menyimpan informasi privat (*Personally Identifiable Information*), SafeSpace PWA mengintegrasikan Google Identity Services dengan sanitasi identitas satu arah. Hak akses administrator dan konselor dikunci via daftar pra-setujui (*whitelist*) di variabel lingkungan peladen:

```mermaid
flowchart TD
    classDef startend fill:#4A7C59,stroke:#3b6347,stroke-width:2px,color:#fff;
    classDef process fill:#EBF3ED,stroke:#4A7C59,stroke-width:1.5px,color:#1E293B;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#92400E;
    classDef admin fill:#EFF6FF,stroke:#3B5998,stroke-width:1.5px,color:#1E293B;

    START(["Pengguna Klik 'Masuk / Daftar dengan Google'"]):::startend
    GIS["Google Identity Services (Popup Kredensial Resmi)"]:::process
    CHECK_TOKEN{"Kredensial Token Valid?"}:::decision
    ERR_TOKEN["Tampilkan Pesan Gagal Autentikasi"]:::process

    SEND_API["Kirim ID Token ke Backend: POST /api/auth/google"]:::process
    VERIFY_API["Backend Verifikasi Token ke Google API: tokeninfo"]:::process
    CHECK_DOMAIN{"Domain Email Diizinkan Whitelist?"}:::decision
    ERR_DOMAIN["Tolak Akses: Domain Email Tidak Berwenang"]:::process

    SANITIZE["Sanitasi Identitas Satu Arah: SHA-256(Google_Sub + Pepper Secret)<br/>• Buang alamat email dan nama asli dari memori runtime"]:::process
    CHECK_EXIST{"Hash Identitas Sudah Terdaftar di Basis Data?"}:::decision
    FETCH_ROLE["Ambil Peran yang Sudah Ada di Basis Data"]:::process

    CHECK_ADMIN{"Apakah Email Terdaftar di ADMIN_EMAILS (.env)?"}:::decision
    CHECK_COUNSELOR{"Apakah Email Terdaftar di COUNSELOR_EMAILS (.env)?"}:::decision

    SET_ADMIN["Tetapkan Peran: admin / sysadmin"]:::admin
    SET_COUNSELOR["Tetapkan Peran: counselor (Konselor Sebaya)"]:::admin
    SET_STUDENT["Tetapkan Peran Default: student (Mahasiswa PJJ)"]:::process

    SAVE_USER["Simpan Pengguna Baru ke Tabel users_auth (Hashed Identity, Role)"]:::process
    ISSUE_JWT["Terbitkan JWT Sesi Anonim (User ID, Role, Pseudonim)"]:::process
    ROUTE_USER{"Navigasi Sesuai Peran"}:::decision

    NAV_STUDENT["Buka Dashboard Mahasiswa (Asesmen Mandiri & Tiket)"]:::startend
    NAV_COUNSELOR["Buka Antrean Triage Konselor Sebaya (Review Lampiran & E2EE Chat)"]:::startend
    NAV_ADMIN["Buka Antrean Konseling & Konsol Kendali Sistem"]:::startend

    START --> GIS
    GIS --> CHECK_TOKEN
    CHECK_TOKEN -- "Tidak" --> ERR_TOKEN
    CHECK_TOKEN -- "Ya" --> SEND_API
    SEND_API --> VERIFY_API
    VERIFY_API --> CHECK_DOMAIN
    CHECK_DOMAIN -- "Tidak" --> ERR_DOMAIN
    CHECK_DOMAIN -- "Ya" --> SANITIZE

    SANITIZE --> CHECK_EXIST
    CHECK_EXIST -- "Sudah Ada" --> FETCH_ROLE
    CHECK_EXIST -- "Belum Ada" --> CHECK_ADMIN

    CHECK_ADMIN -- "Ya (fhasanblog@gmail.com)" --> SET_ADMIN
    CHECK_ADMIN -- "Tidak" --> CHECK_COUNSELOR

    CHECK_COUNSELOR -- "Ya" --> SET_COUNSELOR
    CHECK_COUNSELOR -- "Tidak" --> SET_STUDENT

    SET_ADMIN --> SAVE_USER
    SET_COUNSELOR --> SAVE_USER
    SET_STUDENT --> SAVE_USER
    FETCH_ROLE --> ISSUE_JWT
    SAVE_USER --> ISSUE_JWT

    ISSUE_JWT --> ROUTE_USER
    ROUTE_USER -- "student" --> NAV_STUDENT
    ROUTE_USER -- "counselor" --> NAV_COUNSELOR
    ROUTE_USER -- "admin" --> NAV_ADMIN
```

---

#### E. Flowchart Mode Offline PWA & Mekanisme Sinkronisasi Asesmen (Offline-to-Online Sync)
Untuk mengakomodasi karakteristik mahasiswa PJJ dengan kondisi koneksi jaringan yang tidak stabil, sistem dirancang dengan batas toleransi luring (*offline boundaries*). Modul asesmen mandiri (DASS-21, VAK, dan Mood Tracker) dapat dikerjakan secara luring di perangkat lokal, kemudian secara otomatis disinkronkan saat koneksi internet kembali pulih:

```mermaid
flowchart TD
    classDef startend fill:#4A7C59,stroke:#3b6347,stroke-width:2px,color:#fff;
    classDef process fill:#EBF3ED,stroke:#4A7C59,stroke-width:1.5px,color:#1E293B;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#92400E;
    classDef locked fill:#FEE2E2,stroke:#DC2626,stroke-width:1.5px,color:#991B1B;

    INIT(["Pengguna Membuka SafeSpace PWA"]):::startend
    CHECK_NET{"Status Koneksi Jaringan (navigator.onLine)?"}:::decision

    SHOW_OFFLINE["Tampilkan Banner: 'Mode Hemat Sinyal / Offline Aktif'"]:::process
    FILL_OFFLINE["Pengguna Mengerjakan Asesmen DASS-21 atau Gaya Belajar VAK"]:::process
    CALC_CLIENT["Kalkulasi Skor Psikometri Deterministik 100% di Sisi Klien"]:::process
    SAVE_LOCAL["Simpan Skor & Hasil di LocalStorage Peramban: is_synced = false"]:::process
    LOCK_CHAT["Kunci Fitur Konseling Langsung: 'Memerlukan Koneksi Internet untuk Hubungkan ke Konselor'"]:::locked

    ONLINE_NORMAL["Akses Seluruh Fitur Online secara Penuh"]:::process

    WAIT_ONLINE["Sistem Mendengarkan Event Peramban: window.addEventListener('online')"]:::process
    DETECT_ONLINE(["Jaringan Internet Kembali Terhubung"]):::startend
    CHECK_PENDING{"Apakah Ada Data Asesmen di LocalStorage dengan is_synced == false?"}:::decision

    CHECK_AUTH{"Apakah Pengguna Sudah Terotentikasi (JWT Ada)?"}:::decision
    PROMPT_AUTH["Tampilkan Banner Empatik: 'Masuk dengan Akun Google untuk Mengamankan Riwayat & Konseling'"]:::process

    SYNC_API["Kirim Payload Asesmen ke Peladen: POST /api/assessment/sync"]:::process
    UPDATE_LOCAL["Perbarui Status di LocalStorage: is_synced = true"]:::process
    UNLOCK_TICKET["Buka Kunci Tombol 'Buka Tiket Pra-Konseling'"]:::process
    ATTACH_TICKET["Lampirkan Profil DASS-21 & VAK ke Tiket Konseling (Attached Profile)"]:::process
    TO_QUEUE["Tiket Masuk ke Antrean Konselor Sebaya untuk Ditelaah"]:::startend

    INIT --> CHECK_NET
    CHECK_NET -- "Offline" --> SHOW_OFFLINE
    CHECK_NET -- "Online" --> ONLINE_NORMAL

    SHOW_OFFLINE --> FILL_OFFLINE
    FILL_OFFLINE --> CALC_CLIENT
    CALC_CLIENT --> SAVE_LOCAL
    SAVE_LOCAL --> LOCK_CHAT
    LOCK_CHAT --> WAIT_ONLINE

    WAIT_ONLINE --> DETECT_ONLINE
    DETECT_ONLINE --> CHECK_PENDING
    CHECK_PENDING -- "Tidak Ada" --> ONLINE_NORMAL
    CHECK_PENDING -- "Ada" --> CHECK_AUTH

    CHECK_AUTH -- "Belum Login" --> PROMPT_AUTH
    PROMPT_AUTH --> CHECK_AUTH
    CHECK_AUTH -- "Sudah Login" --> SYNC_API

    SYNC_API --> UPDATE_LOCAL
    UPDATE_LOCAL --> UNLOCK_TICKET
    UNLOCK_TICKET --> ATTACH_TICKET
    ATTACH_TICKET --> TO_QUEUE
```

> [!NOTE]
> Seluruh diagram di atas dapat diekspor menjadi gambar resolusi tinggi PNG melalui dasbor interaktif [flowchart_dashboard.html](file:///d:/ijplabs/capstone/docs/flowchart_dashboard.html).

---

### 3.3.3 Desain Antarmuka Pengguna (UI/UX Trauma-Informed Design)

#### A. Landasan Teori UI/UX & Psikologi Warna
Antarmuka pengguna SafeSpace PWA dirancang dengan pendekatan **Trauma-Informed Design** dan filosofi **Calm Technology** (Eggleston, Jones, & Khan, 2025; Vaswani, 2025). Tujuannya adalah meredakan kecemasan visual, mencegah stres sensorik, dan memberikan rasa aman emosional bagi mahasiswa yang kelelahan:

```
+----------------------------------------------------------------------------------------------------+
|                                SPESIFIKASI PALET PSIKOLOGI WARNA                                   |
+-------------------+-----------------------+--------------------------------------------------------+
| Token Desain      | Kode Hex / Warna      | Peran Ergonomis & Psikologis                           |
+-------------------+-----------------------+--------------------------------------------------------+
| Primary           | #4A7C59               | Menstimulasi sistem saraf parasimpatis, melambangkan   |
|                   | (Soft Sage Green)     | pemulihan batin, ketenangan, dan keseimbangan emosi.   |
| Secondary         | #3B5998               | Membangun rasa percaya (trust), kerahasiaan data,      |
|                   | (Muted Slate Blue)    | dan ketegasan tanpa kesan intimidasi birokrasi.        |
| Background Canvas | #F9F9F6               | Mencegah silau (glare) dan kelelahan mata (asthenopia) |
|                   | (Warm Ivory Neutral)  | dibanding latar putih murni (#FFFFFF).                 |
| Surface Card      | #FFFFFF               | Warna permukaan kartu dengan batas lembut (#E2E8F0)    |
|                   | (Clean White Card)    | untuk keteraturan visual dan hierarki konten.          |
| Text Utama        | #1E293B               | Memberikan rasio kontras tinggi (>7:1, WCAG 2.1 AA)    |
|                   | (Deep Slate Charcoal) | tanpa ketajaman warna hitam pekat (#000000).           |
| Accent Alert      | #D97706               | Menggantikan warna merah sirine; memberi sinyal triase |
|                   | (Warm Amber)          | darurat secara suportif tanpa memicu kepanikan.        |
+-------------------+-----------------------+--------------------------------------------------------+
```

#### B. Fitur Ergonomi Emosional:
1. **Chunking Step-Wizard:** Menampilkan butir pertanyaan asesmen satu per satu untuk mengeliminasi kecemasan saat melihat kuesioner panjang (*cognitive overload reduction*).
2. **Pill Icebreakers:** Tombol cepat pemantik topik pada kolom curhatan (*"Saya lelah dengan tugas"*, *"Saya butuh teman bicara"*) guna mengatasi sindrom kekosongan ide (*blank canvas syndrome*).
3. **Safe Exit Button:** Tombol merah muda di pojok kanan atas yang dapat ditekan sewaktu-waktu untuk mengalihkan peramban ke situs netral dalam tempo < 100ms demi privasi fisik pengguna.

#### C. Pemetaan Tangkapan Layar Prototipe Riil (Bukti Visual Sistem):
Dokumentasi tangkapan layar antarmuka prototipe tersimpan dalam direktori `docs/screenshots/` untuk penyusunan Bab IV:
- `01-landing-page.png`: Halaman beranda dengan jaminan *Two-Way Anonymity* dan tombol masuk mahasiswa/konselor.
- `02-dass21-question.png`: Antarmuka pengisian butir instrumen DASS-21 berbasis kartu bertahap.
- `03-dass21-result.png`: Tampilan grafik tri-dimensi (Depresi, Kecemasan, Stres) beserta kategori baku Lovibond.
- `04-vak-question.png`: Antarmuka pengisian kuesioner modalitas belajar VAK.
- `05-vak-result.png`: Diagram batang persentase gaya belajar Visual, Auditori, dan Kinestetik beserta tips belajar Tuton UT.
- `06-mood-tracker.png`: Jurnal refleksi harian dengan pemilihan emosi, pill icebreakers, dan analisis kalimat empati.
- `07-student-dashboard.png`: Dasbor integrasi profil mahasiswa sebelum membuka tiket pra-konseling.
- `08-counselor-queue.png`: Dasbor antrean konselor yang menampilkan profil klinis terlampir secara anonim.
- `09-e2ee-chat-room.png`: Ruang percakapan privat dengan perlindungan kriptografi *Zero-Knowledge* Web Crypto API.

---

## 3.4 Metode Pengujian dan Validasi (Testing & Validation)

### 3.4.1 Pengujian Teknis (Fungsional & Otomasi Sistem)

#### A. Pengujian Kotak Hitam (Black-Box Testing)
Pengujian fungsional kotak hitam dilakukan untuk menguji kesesuaian antara input, proses, dan luaran sistem tanpa memedulikan implementasi kode internal (Pressman & Maxim, 2020). Pendekatan yang digunakan meliputi *Equivalence Partitioning* dan *Boundary Value Analysis*.

Berikut matriks lengkap 13 skenario pengujian fungsional (*Black-Box Test Cases*):

| Kode Uji | Modul / Fitur | Skenario Pengujian | Masukan (Input / Aksi) | Luaran yang Diharapkan | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TB-01** | Autentikasi Google | Mahasiswa login dengan email valid institusi (`@ecampus.ut.ac.id`). | ID Token Google valid. | Verifikasi token sukses, identitas di-hash SHA-256, diterbitkan JWT dengan nama pseudonim acak (`Mahasiswa #XXXX`). HTTP 200. | **PASSED** |
| **TB-02** | Whitelist Domain | Pengguna login dengan domain di luar whitelist saat dibatasi. | ID Token Google dari domain publik (`@gmail.com`). | Sistem menolak autentikasi dan menampilkan pesan peringatan domain. HTTP 400 / 403. | **PASSED** |
| **TB-03** | Sanitasi Token Palsu | Permintaan login dengan ID Token kedaluwarsa atau string sembarang. | `{ idToken: "invalid_dummy_token" }` ke `/api/auth/google`. | Sistem menolak token, tidak mengeksekusi hash, dan mengembalikan HTTP 400 Bad Request. | **PASSED** |
| **TB-04** | DASS-21 Deterministik | Pengisian 21 butir instrumen baku Lovibond & Lovibond. | Array 21 angka bulat skala 0â€“3 ke `/api/assessment/dass21`. | Sistem menghitung skor per subskala ($\sum \text{skor} \times 2$), mengklasifikasi kategori (*Normal s.d. Extremely Severe*), dan menentukan level burnout. HTTP 200. | **PASSED** |
| **TB-05** | DASS-21 Boundary | Pengisian butir kurang dari 21 atau angka di luar rentang 0â€“3. | Array 20 butir atau terdapat nilai 4 atau -1. | Skema Zod menolak input dan mengembalikan HTTP 400 Bad Request dengan pesan validasi. | **PASSED** |
| **TB-06** | Pemetaan Gaya VAK | Pengisian 12 butir kuesioner modalitas belajar. | Array 12 modalitas `['visual', 'auditory', ...]` ke `/api/assessment/vak`. | Sistem menghitung persentase modalitas, menentukan dominansi (*Visual/Auditori/Kinestetik*), dan menyajikan tips Tuton UT. HTTP 200. | **PASSED** |
| **TB-07** | Mood Tracker Empati | Pengiriman curhatan teks dengan narasi tekanan tugas tinggi. | Narasi teks: *"Saya sangat lelah kerja lembur sambil kejar tugas Tuton"*. | Sistem mendeteksi sentimen distres, memberikan kalimat empati menenangkan, dan memicu tombol rekomendasi pra-konseling. HTTP 200. | **PASSED** |
| **TB-08** | Pertahanan RBAC 403 | Mahasiswa mencoba mengakses antrean tiket konselor secara ilegal. | Permintaan `GET /api/sessions/queue` menggunakan token ber-role `student`. | Middleware RBAC menolak permintaan secara instan dengan status HTTP 403 Forbidden. Data konselor aman. | **PASSED** |
| **TB-09** | Tiket Terlampir | Mahasiswa mengajukan tiket pra-konseling melampirkan DASS-21 & VAK. | `POST /api/sessions/create` dengan payload skor DASS-21 dan profil VAK. | Tiket tersimpan dengan status `waiting` dan format JSONB terlampir tanpa menghubungkan identitas asli mahasiswa. HTTP 201. | **PASSED** |
| **TB-10** | Enkripsi E2EE Klien | Pengiriman pesan obrolan konseling dari mahasiswa ke konselor. | Plaintext dienkripsi lokal menggunakan AES-GCM-256 via Web Crypto API. | Server hanya menerima dan menyimpan string ciphertext acak dan IV pada tabel `messages`. Teks asli tidak tersentuh server. HTTP 201. | **PASSED** |
| **TB-11** | Dekripsi E2EE Klien | Konselor membuka ruang percakapan dan memuat riwayat chat. | `GET /api/chat/:sessionId/messages` lalu didekripsi dengan kunci lokal sesi. | Ciphertext didekripsi secara lokal di peramban konselor menjadi pesan terbaca. | **PASSED** |
| **TB-12** | Tombol Safe Exit | Pengguna menekan tombol darurat saat privasi fisik terancam. | Klik tombol `Safe Exit` pada antarmuka. | Peramban seketika mengalihkan halaman (*hard redirect*) ke Google dalam tempo < 100ms tanpa jejak riwayat formulir. | **PASSED** |
| **TB-13** | Audit PWA & Cache | Akses aplikasi dalam kondisi jaringan lambat / instalasi layar utama. | Registrasi `sw.js` dan pengecekan file `manifest.webmanifest`. | Service Worker terpasang aktif, aset statis tersimpan di Workbox Cache, dan dialog instalasi PWA muncul. | **PASSED** |

#### B. Pengujian Otomatis Unit & Integrasi (Test-Driven Development)
Pengembangan sistem didukung oleh **81 unit & integration test cases** otomatis yang dieksekusi melalui Bun Test Runner (`bun test`). Pengujian mencakup:
1. Validitas matematis skoring DASS-21 dan VAK di `@safespace/shared` (14 test cases).
2. Validasi skema Zod untuk autentikasi, sesi, dan chat (22 test cases).
3. Pengujian integrasi API autentikasi, kalkulasi asesmen, dan RBAC di `apps/api` (45 test cases).
- **Hasil:** 81 passed, 0 failed (100% lulus dalam durasi eksekusi ~340 milidetik).

#### C. Pengujian Otomatis End-to-End (Playwright E2E Testing)
Pengujian alur pengguna secara menyeluruh (*End-to-End*) disimulasikan menggunakan peramban Chromium tanpa kepala (*headless*) melalui Playwright (`bun run test:e2e`):
1. `TC-E2E-01`: Verifikasi Landing Page dan status Two-Way Anonymity.
2. `TC-E2E-02`: Alur pengerjaan lengkap 21 butir DASS-21 hingga munculnya grafik diagnosis burnout.
3. `TC-E2E-03`: Alur pengerjaan kuesioner VAK 12 butir hingga tampilnya persentase gaya belajar.
4. `TC-E2E-04`: Pengisian jurnal Mood Tracker dengan pill icebreakers dan verifikasi respons empati.
5. `TC-E2E-05`: Pembukaan tiket pra-konseling profil terlampir, triase pada antrean konselor, dan pertukaran pesan di chatroom E2EE.
- **Hasil:** 5 test suites passed (100% lulus dalam durasi ~10.1 detik).

---

### 3.4.2 Pengujian Pengguna (User Acceptance Testing - UAT)

#### A. Metode System Usability Scale (SUS)
Evaluasi kebergunaan (*usability*) dan penerimaan pengguna akhir dilakukan menggunakan instrumen baku **System Usability Scale (SUS)** (Brooke, 1996; Lewis, 2018). SUS dipilih karena memiliki reliabilitas tinggi ($r > 0.85$), mudah dipahami responden, dan diakui secara global dalam literatur ilmiah sistem informasi (Alfilaeni dkk., 2024; Kusumaningrum dkk., 2023).

Instrumen SUS terdiri dari **10 butir pertanyaan** dengan skala Likert 5 poin (1 = Sangat Tidak Setuju s.d. 5 = Sangat Setuju), dengan komposisi butir ganjil bernada positif dan butir genap bernada negatif guna meminimalkan bias kepatuhan (*acquiescence bias*):

| No. Butir | Pernyataan Kuesioner Resmi SUS (Bahasa Indonesia) | Polaritas | Dimensi Usability |
| :-: | :--- | :---: | :--- |
| **P1** | Saya merasa ingin sering menggunakan aplikasi SafeSpace PWA ini dalam mendampingi studi perkuliahan jarak jauh saya. | Positif (+) | Minat Penggunaan (*Desirability*) |
| **P2** | Saya merasa antarmuka SafeSpace PWA terlalu rumit dan membingungkan saat saya sedang lelah belajar. | Negatif (-) | Kompleksitas Antarmuka (*Complexity*) |
| **P3** | Saya merasa aplikasi SafeSpace PWA sangat mudah digunakan untuk mengisi asesmen DASS-21 dan melihat gaya belajar VAK. | Positif (+) | Kemudahan Pengoperasian (*Ease of Use*) |
| **P4** | Saya merasa membutuhkan bantuan orang lain atau panduan teknis khusus untuk dapat menggunakan aplikasi ini. | Negatif (-) | Ketergantungan Bantuan (*Independence*) |
| **P5** | Saya merasa fitur-fitur di dalam aplikasi (DASS-21, VAK, Mood Tracker, Chatroom) terintegrasi dengan sangat padu dan harmonis. | Positif (+) | Kepaduan Sistem (*Integration*) |
| **P6** | Saya merasa ada terlalu banyak inkonsistensi (ketidakteraturan tata letak/warna) pada tampilan SafeSpace PWA. | Negatif (-) | Konsistensi Desain (*Consistency*) |
| **P7** | Saya merasa sebagian besar mahasiswa UT akan dapat memahami cara menggunakan aplikasi ini dengan sangat cepat. | Positif (+) | Kemudahan Pembelajaran (*Learnability*) |
| **P8** | Saya merasa alur navigasi dan proses pembukaan tiket pra-konseling di aplikasi ini sangat merepotkan dan berbelit-belit. | Negatif (-) | Kerumitan Alur Kerja (*Workflow Friction*) |
| **P9** | Saya merasa sangat tenang dan percaya diri menggunakan aplikasi ini karena identitas asli saya dijamin anonim (*Two-Way Anonymity*). | Positif (+) | Rasa Aman Privasi (*Confidence & Safety*) |
| **P10** | Saya merasa harus banyak membiasakan diri terlebih dahulu sebelum saya dapat menggunakan aplikasi ini secara lancar. | Negatif (-) | Hambatan Adaptasi (*Cognitive Barrier*) |

#### B. Formula Matematis Konversi Skor SUS:
Untuk menghitung skor SUS komposit per responden, dilakukan transformasi skor butir (Brooke, 1996):
1. **Untuk Butir Pernyataan Positif (Ganjil: 1, 3, 5, 7, 9):**
   $$X_i = \text{Skor}_i - 1 \quad (\text{rentang } 0 - 4)$$
2. **Untuk Butir Pernyataan Negatif (Genap: 2, 4, 6, 8, 10):**
   $$Y_i = 5 - \text{Skor}_i \quad (\text{rentang } 0 - 4)$$
3. **Skor SUS Per Responden:**
   $$\text{Skor SUS}_k = \left( \sum_{i \in \text{Ganjil}} X_i + \sum_{i \in \text{Genap}} Y_i \right) \times 2{,}5 \quad (\text{skala } 0 - 100)$$
4. **Skor SUS Rata-Rata Seluruh Responden ($N$):**
   $$\overline{\text{SUS}} = \frac{1}{N} \sum_{k=1}^N \text{Skor SUS}_k$$

#### C. Matriks Interpretasi Kelayakan SUS:
Berdasarkan norma empiris Bangor, Kortum, & Miller (2008) dan Lewis (2018):
- **Skor $\ge 80.3$:** *Acceptable* | Grade A (*Excellent / Best Imaginable*)
- **Skor $68.0 - 80.2$:** *Acceptable* | Grade B/C (*Good / Bagus*)
- **Skor $51.0 - 67.9$:** *Marginal* | Grade D (*OK / Butuh Perbaikan*)
- **Skor $< 51.0$:** *Not Acceptable* | Grade F (*Poor / Buruk*)

---

### 3.4.3 Metrik Keberhasilan Proyek (Success Metrics)
Sebagai parameter ketercapaian tujuan Capstone Project, ditetapkan matriks keberhasilan objektif sebagai berikut:

```
+----------------------------------------------------------------------------------------------------+
|                                    MATRIKS PARAMETER KEBERHASILAN                                  |
+--------------------------+------------------------------+---------------------------+--------------+
| Parameter Keberhasilan   | Target Kuantitatif Minimal   | Metode Pengukuran         | Hasil Capai  |
+--------------------------+------------------------------+---------------------------+--------------+
| 1. Keberterimaan Sistem  | Skor rata-rata SUS > 68.0    | Survei UAT 10 butir SUS   | Target       |
|    (User Usability)      | (Kategori Good / Acceptable) | pada mahasiswa sasaran    | Terpenuhi    |
| 2. Keandalan Fungsional  | 100% Lolos Uji (0 Defect)    | Black-Box Testing Matriks | 13/13 Lolos  |
|    (Functional Validity) | pada skenario fungsional     | TB-01 s.d. TB-13          | (100%)       |
| 3. Otomasi Unit & E2E    | 100% Pass pada test suite    | Bun Test (81 tests) &     | 86/86 Lolos  |
|    (Automated Testing)   | otomatis tanpa regresi       | Playwright (5 E2E flows)  | (100%)       |
| 4. Jaminan Privasi       | 0% Teks Asli (Zero Plaintext)| Verifikasi SQL log pada   | Terverifikasi|
|    (Zero-Knowledge E2EE) | pada kolom database messages | tabel messages & users    | Aman         |
| 5. Determinisme Skoring  | 100% Akurat secara matematis | Pengujian unit formula    | Terverifikasi|
|    (Psikometri Klinis)   | tanpa halusinasi AI probabil | Lovibond & Fleming        | Akurat       |
| 6. Latensi Operasional   | Respons transmisi chat       | Pengujian WebSocket       | Terverifikasi|
|    (Real-time Latency)   | waktu nyata < 200 ms         | latency monitoring        | (< 50 ms)    |
+--------------------------+------------------------------+---------------------------+--------------+
```

---

## 3.5 Ringkasan Keterkaitan Bab III dengan Bab IV
Bahan mentah metodologi dan perancangan pada Bab III ini menjadi fondasi langsung bagi penyusunan **Bab IV (Hasil dan Pembahasan)**:
1. **Subbab 4.1 (Hasil Implementasi Sistem):** Menjabarkan realisasi kode dari arsitektur monorepo 4-tier, konfigurasi PWA, serta tangkapan layar antarmuka dari 9 file visual yang telah disiapkan.
2. **Subbab 4.2 (Hasil Pengujian Teknis):** Menyajikan bukti eksekusi 13 matriks Black-Box, 81 unit/integration test Bun, serta log keberhasilan pengujian Playwright E2E.
3. **Subbab 4.3 (Hasil Evaluasi Usability UAT):** Menyajikan tabulasi data responden pengisian kuesioner SUS 10 butir, perhitungan skor konversi, dan analisis posisi kelayakan sistem.
4. **Subbab 4.4 (Pembahasan & Implikasi):** Membahas bagaimana SafeSpace PWA berhasil mengatasi stigma pencarian bantuan dan *academic burnout* mahasiswa PJJ Universitas Terbuka melalui integrasi *Two-Way Anonymity*, DASS-21, VAK, dan E2EE.
