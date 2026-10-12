# Architectural Decision Records (ADR)
## Dokumen Kajian & Keputusan Rekayasa Arsitektur Sistem

**Nama Proyek:** SafeSpace PWA (Sistem Informasi Manajemen Konseling Terintegrasi)  
**Konteks Dokumen:** Landasan Teoretis & Keputusan Arsitektur untuk Karya Ilmiah / Capstone Project  
**Status:** Disetujui (Approved)  
**Versi:** 1.0.0  
**Tanggal:** 22 September 2026  

---

## Daftar Isi
1. [Pendahuluan & Konteks Sistem](#1-pendahuluan--konteks-sistem)
2. [ADR-001: Mekanisme Autentikasi  -  Migrasi ke Google OAuth 2.0 dengan Hashing Anonim](#2-adr-001-mekanisme-autentikasi--migrasi-ke-google-oauth-20-dengan-hashing-anonim)
3. [ADR-002: Pemilihan Basis Data  -  PostgreSQL dengan Drizzle ORM](#3-adr-002-pemilihan-basis-data--postgresql-dengan-drizzle-orm)
4. [ADR-003: Arsitektur Realtime  -  ElysiaJS Native WebSocket & WebRTC P2P](#4-adr-003-arsitektur-realtime--elysiajs-native-websocket--webrtc-p2p)
5. [ADR-004: Standardisasi Rekayasa Perangkat Lunak  -  Bun Monorepo, Biome, TDD, & GitNexus](#5-adr-004-standardisasi-rekayasa-perangkat-lunak--bun-monorepo-biome-tdd--gitnexus)
6. [ADR-005: Instrumen Psikometrik Baku (DASS-21 & VAK) dengan Formula Matematis vs Diagnostik LLM](#6-adr-005-instrumen-psikometrik-baku-dass-21--vak-dengan-formula-matematis-vs-diagnostik-llm)
7. [ADR-006: Pertahanan Keamanan Berlapis (Two-Way Double-Blind & Defense-in-Depth RBAC)](#7-adr-006-pertahanan-keamanan-berlapis-two-way-double-blind--defense-in-depth-rbac)
8. [ADR-007: Unlinkable Ephemeral Pseudonymity & Counselor Handled Log Architecture](#8-adr-007-unlinkable-ephemeral-pseudonymity--counselor-handled-log-architecture)
9. [Matriks Ringkasan Keputusan](#9-matriks-ringkasan-keputusan)


---

## 1. Pendahuluan & Konteks Sistem

SafeSpace PWA dirancang sebagai platform layanan Bimbingan Konseling (BK) digital berbasis *Progressive Web App* yang memprioritaskan privasi psikologis mahasiswa. Dua pilar non-fungsional utama sistem ini adalah:
1. **Double-Blind Anonymity**: Mahasiswa dan konselor tidak saling mengetahui identitas asli (nama, NIM, email asli). Komunikasi dilakukan menggunakan pseudonim yang diterbitkan secara dinamis oleh sistem.
2. **End-to-End Encryption (E2EE)**: Pesan obrolan dienkripsi di peramban menggunakan pasangan kunci kriptografis (Web Crypto API) sehingga peladen maupun administrator basis data tidak dapat membaca konten percakapan (*Zero-Knowledge Architecture*).

Untuk memenuhi standar karya ilmiah yang dapat dipertanggungjawabkan, setiap keputusan pemilihan teknologi dan alur arsitektur didokumentasikan dalam format ADR ini.

---

## 2. ADR-001: Mekanisme Autentikasi  -  Migrasi ke Google OAuth 2.0 dengan Hashing Anonim

### 2.1. Konteks Masalah
Rancangan awal sistem menggunakan autentikasi berbasis kode OTP (One-Time Password) yang dikirimkan ke email institusi (`@ecampus.ut.ac.id`). Dalam kajian kelayakan implementasi, ditemukan beberapa kendala kritis:
1. **Hambatan Birokrasi Organisasi**: Integrasi langsung dengan API internal institusi atau penyediaan relay SMTP kampus memerlukan persetujuan dan izin birokrasi lintas departemen yang memakan waktu panjang.
2. **Keterbatasan Adopsi (Portabilitas)**: Jika sistem dikunci mati ke satu institusi tertentu, penelitian ini tidak dapat direplikasi atau diadopsi oleh institusi pendidikan tinggi lain maupun organisasi non-kampus.
3. **Isu Reliabilitas SMTP**: Pengiriman OTP via email sering mengalami latensi tinggi, tertahan di filter spam, atau terkena kuota batas pengiriman (*rate limit*).

### 2.2. Alternatif yang Dikaji
* **Opsi A: Integrasi SSO/LDAP Kampus Internal.**  
  *Kelebihan:* Otentikasi resmi.  
  *Kelemahan:* Sangat terikat pada birokrasi satu organisasi, tidak portabel, risiko tinggi proyek terhenti karena izin.
* **Opsi B: OTP via Email Eksternal (SMTP Pribadi).**  
  *Kelebihan:* Mudah disetup.  
  *Kelemahan:* Rawan spam, biaya pemeliharaan email provider, mahasiswa harus verifikasi manual via inbox.
* **Opsi C: Google OAuth 2.0 / OpenID Connect dengan Domain Whitelisting Dinamis (Dipilih).**  
  *Kelebihan:* Sangat handal, UX instan (*single-click*), banyak kampus (termasuk Universitas Terbuka) menggunakan Google Workspace for Education sehingga email kampus tetap valid, dan sistem fleksibel untuk adopsi multi-institusi.

### 2.3. Keputusan & Desain Keamanan (*Double-Blind Preservation*)
Dipilih **Google OAuth 2.0 (Opsi C)** dengan mekanisme sanitasi identitas instan di peladen backend:

```
[Pengguna] 
    â”‚ Login via Google (email @ecampus.ut.ac.id / umum)
    â–¼
[Google Identity Provider] â”€â”€(ID Token)â”€â”€â–º [ElysiaJS Backend]
                                                â”‚
       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
       â”‚ 1. Validasi Domain (Whitelist: ecampus.ut.ac.id atau * sesuai konfigurasi)      â”‚
       â”‚ 2. Ekstrak 'sub' (Google Unique Subject Identifier)                             â”‚
       â”‚ 3. Hashing Kriptografis Satu Arah: SHA-256(sub + PEPPER_SECRET)                â”‚
       â”‚ 4. BUANG data nama asli, foto profil, dan email teks biasa dari memori          â”‚
       â”‚ 5. Cari / Buat Record di `users_auth`:                                         â”‚
       â”‚    - id: UUIDv7                                                                 â”‚
       â”‚    - hashed_identity: SHA-256 ciphertext                                        â”‚
       â”‚    - role: 'student' | 'counselor'                                              â”‚
       â”‚ 6. Terbitkan Sesi JWT Anonim (Payload: userId: UUID, pseudonym: "Mahasiswa #X") â”‚
       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### 2.4. Konsekuensi
- **Positif:** Tidak ada ketergantungan birokrasi izin server kampus, keamanan kelas industri, mendukung adopsi multi-kampus melalui variabel lingkungan `ALLOWED_EMAIL_DOMAINS`, dan jaminan bahwa data pribadi mahasiswa tidak pernah tersimpan di database.
- **Mitigasi Risiko:** Pengguna yang kehilangan akses akun Google harus memulihkan akun lewat Google; peladen tidak menyimpan nomor telepon atau pemulihan alternatif.

---

## 3. ADR-002: Pemilihan Basis Data  -  PostgreSQL dengan Drizzle ORM

### 3.1. Konteks Masalah
Sistem mengelola komunikasi realtime (chat interaktif), pertukaran sinyal WebRTC, serta riwayat pesan terenkripsi (E2EE). Diperlukan basis data yang tangguh dalam hal integritas data, mendukung kriptografi identitas, memiliki latensi rendah, dan ramah terhadap arsitektur monorepo TypeScript.

### 3.2. Perbandingan Basis Data

| Parameter Evaluasi | PostgreSQL (Dipilih) | MariaDB / MySQL | MongoDB / NoSQL |
|---|---|---|---|
| **Tipe Data UUID Native** | Native UUIDv4/UUIDv7 (Sangat efisien dalam indeks B-Tree) | Disimpan sebagai `VARCHAR(36)` atau `BINARY(16)` (kurang efisien) | ObjectId default (kurang standar dengan UUID E2EE) |
| **Dukungan Dokumen JSON** | `JSONB` native (terindeks GIN, performa tinggi) | `JSON` alias text/longtext (evaluasi lambat) | Native BSON |
| **Mekanisme Pub/Sub Internal** | `LISTEN / NOTIFY` bawaan (sangat berguna untuk multiserver event bus) | Tidak ada (memerlukan Redis eksternal) | Change Streams (kompleks, butuh replika set) |
| **Kesiapan Ekstensi AI** | `pgvector` terintegrasi (siap untuk modul analisis sentimen & RAG masa depan) | Keterbatasan integrasi vektor | Memerlukan layanan terpisah (Vector Atlas) |
| **Kematangan Drizzle ORM** | Dialek paling kaya fitur dan *first-class support* di Drizzle | Fitur lanjutan lebih terbatas | Drizzle tidak mendukung NoSQL secara native |

### 3.3. Keputusan
Dipilih **PostgreSQL** yang dikelola melalui **Drizzle ORM**.

### 3.4. Justifikasi Akademis & Rekayasa
1. **Integritas Relasional & Zero-Data Leakage**: Sesi konseling (`counseling_sessions`), profil pseudonim konselor (`counselors_profile`), dan pesan terenkripsi (`messages`) memiliki relasi relasional yang ketat dengan integritas referensial (*foreign keys*) guna mencegah *orphan data* yang dapat membocorkan informasi.
2. **Kesesuaian Tipe Kolom**:
   - Kolom identitas: `uuid` native menjamin proteksi dari *enumeration attacks* (penyerang tidak bisa menebak ID berikutnya seperti pada format auto-increment `1, 2, 3`).
   - Kolom kunci enkripsi: Kunci publik RSA konselor dan preferensi klien disimpan dengan aman di kolom berformat `text` atau `jsonb`.
3. **Skalabilitas Vertikal ke Horizontal**: Fitur `LISTEN / NOTIFY` PostgreSQL memungkinkan arsitektur diperluas ke beberapa node pekerja tanpa wajib menginstal dependensi tambahan seperti Redis di fase awal.

---

## 4. ADR-003: Arsitektur Realtime  -  ElysiaJS Native WebSocket & WebRTC P2P

### 4.1. Konteks Masalah
Sistem membutuhkan transmisi pesan instan (<200ms) untuk chat teks serta kemampuan eskalasi ke panggilan suara/video jika pengguna membutuhkan intervensi darurat.

### 4.2. Keputusan Arsitektur
Diterapkan pemisahan tanggung jawab yang jelas (*Separation of Concerns*):

```
                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                  â”‚              PERAMBAN KLIEN                  â”‚
                  â”‚  - Enkripsi Pesan Web Crypto (RSA/AES)       â”‚
                  â”‚  - Inisiasi RTCPeerConnection (Media P2P)    â”‚
                  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                 â”‚                â”‚
                     Media Stream (Audio/Video)   â”‚ WebSocket (Chat & Signaling)
                     Peer-to-Peer murni           â”‚
                                 â–¼                â–¼
                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                  â”‚    KLIEN LAWAN BICARA  â”‚   â”‚     ELYSIANJS NATIVE WEBSOCKET   â”‚
                  â”‚    (Konselor / Pasien) â”‚   â”‚  (Kernel Bun uWebSocket C++)     â”‚
                  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚  - Topic Pub/Sub in-memory       â”‚
                                               â”‚  - Relay SDP & ICE Candidate     â”‚
                                               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                                              â”‚
                                            Simpan Pesan Ciphertext Terenkripsi
                                                              â–¼
                                               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                               â”‚     POSTGRESQL PERSISTENCE       â”‚
                                               â”‚  (Hanya menyimpan ciphertext)    â”‚
                                               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

1. **Jalur Teks Chat**:
   - Klien mengenkripsi pesan -> Mengirimkan ciphertext via WebSocket ElysiaJS.
   - ElysiaJS melakukan `publish` ke topik sesi obrolan secara *in-memory* dengan latensi mikrodetik.
   - ElysiaJS menyimpan ciphertext tersebut ke PostgreSQL (`messages.encrypted_content`) agar riwayat obrolan dapat dibuka kembali saat refresh.
2. **Jalur Panggilan Darurat (WebRTC)**:
   - Peladen ElysiaJS hanya bertindak sebagai **Signaling Server** (menukar penawaran SDP dan kandidat ICE antar-klien).
   - Data suara dan video mengalir langsung secara *Peer-to-Peer* (P2P) antar-peramban tanpa melalui server, sehingga beban server tetap ringan dan privasi percakapan suara terjaga.

---

## 5. ADR-004: Standardisasi Rekayasa Perangkat Lunak  -  Bun Monorepo, Biome, TDD, & GitNexus

### 5.1. Bun Workspaces (Monorepo)
- **Keputusan**: Menggabungkan `apps/api`, `apps/web`, dan `packages/shared` dalam satu repositori Bun.
- **Rasional**: Mencegah fragmentasi tipe data TypeScript. Ketika backend memperbarui antarmuka pesan atau skema validasi, frontend langsung mendapatkan *type checking* otomatis saat kompilasi tanpa perlu mempublikasikan package privat ke npm.

### 5.2. Biome Toolchain (Pengganti ESLint & Prettier)
- **Keputusan**: Menggunakan **Biome** sebagai linter dan formatter tunggal.
- **Rasional**: Biome ditulis dalam Rust, memiliki kecepatan 25-35x lebih tinggi dibanding ESLint/Prettier, dan memiliki konfigurasi bawaan yang ketat. Larangan penggunaan tipe data `any` dan `unknown` ditegakkan di level compiler untuk menjamin *Zero Runtime Type Errors*.

### 5.3. Test-Driven Development (TDD)
- **Keputusan**: Menerapkan siklus *Red-Green-Refactor* menggunakan Bun Test Runner (`bun:test`) untuk backend/packages dan Vitest untuk frontend.
- **Rasional**: Modul kriptografi E2EE dan mekanisme hashing akun wajib diuji keandalannya melalui pengujian otomatis sebelum diimplementasikan ke antarmuka pengguna.

### 5.4. Code Indexing dengan GitNexus
- **Keputusan**: Mengintegrasikan **GitNexus** dalam siklus pengembangan repositori.
- **Rasional**: Struktur monorepo memiliki keterkaitan simbol dan tipe yang rumit lintas paket (`@safespace/shared` -> `apps/api` & `apps/web`). GitNexus membuat indeks graf pengetahuan kode secara lokal, mempercepat navigasi simbol, dan mempermudah peninjauan kode (*code review*).

---

## 6. ADR-005: Instrumen Psikometrik Baku (DASS-21 & VAK) dengan Formula Matematis vs Diagnostik LLM

### 6.1. Konteks Masalah
Rancangan awal mengandalkan Large Language Model (LLM) untuk menentukan tingkat stres dan gaya belajar mahasiswa berdasarkan teks curhatan bebas. Dalam tinjauan etika klinis dan kaidah karya ilmiah, pendekatan ini memiliki kelemahan mendasar:
1. **Risiko Halusinasi Klinis (*Diagnostic Hallucination*)**: Model LLM bersifat probabilistik dan tidak deterministik. Menggunakan LLM untuk menegakkan diagnosis atau mengukur skor tingkat stres berisiko menghasilkan kesimpulan psikologis yang keliru atau inkonsisten.
2. **Ketiadaan Landasan Validitas Psikometrik**: Pengujian di hadapan dewan penguji akademis memerlukan instrumen baku yang telah tervalidasi secara internasional melalui uji reliabilitas dan validitas konstruk (*Cronbach's Alpha*).

### 6.2. Keputusan Arsitektur
1. **Penerapan Instrumen Baku DASS-21 (Lovibond & Lovibond, 1995)**:
   - Pengukuran tingkat *Depression*, *Anxiety*, dan *Stress* menggunakan 21 butir pernyataan baku (skala Likert 0â€“3).
   - Perhitungan dilakukan murni secara **deterministik matematis**:
     $$\text{Score} = \left( \sum_{i \in \text{Subscale}} \text{Item}_i \right) \times 2$$
   - Skor diklasifikasikan ke dalam 5 tingkatan baku: *Normal*, *Mild*, *Moderate*, *Severe*, dan *Extremely Severe*.
2. **Penerapan Instrumen Gaya Belajar VAK**:
   - Menghitung modalitas belajar (*Visual*, *Auditory*, *Kinesthetic*) melalui kuesioner dinamis (format ringkas default 12 butir dan format lengkap hingga 30 butir).
   - Ditentukan secara matematis berdasarkan modalitas dengan akumulasi persentase tertinggi.
3. **Reposisi dan Reduksi Peran AI (LLM)**:
   - LLM "diturunkan pangkatnya" murni untuk **Mood Tracker harian**: menganalisis sentimen dari curhatan teks bebas untuk menghasilkan kalimat respon empati yang menenangkan dan merekomendasikan rujukan pembukaan tiket pra-konseling jika kondisi terindikasi berat.

### 6.3. Konsekuensi & Manfaat
- Menjamin validitas ilmiah pada naskah skripsi/capstone.
- Beban komputasi server ElysiaJS menjadi jauh lebih ringan dan hemat biaya API LLM karena kalkulasi skor ditangani secara instan di kernel lokal.

---

## 7. ADR-006: Pertahanan Keamanan Berlapis (Two-Way Double-Blind & Defense-in-Depth RBAC)

### 7.1. Konteks Masalah
Pada sistem konseling konvensional, staf konselor sering kali mengetahui identitas mahasiswa atau sebaliknya, mahasiswa mengetahui identitas asli konselor. Hal ini memicu:
1. Keengganan mahasiswa berkonsultasi karena takut dinilai (*judgmental fear*).
2. Potensi bias pemilihan konselor (*counselor shopping*).
3. Risiko staf konselor menjadi sasaran pelampiasan emosional mahasiswa di luar sistem (*doxxing/harassment*).
4. Potensi kebocoran data jika hak akses API hanya dibatasi di sisi antarmuka pengguna (*frontend UI*).

### 7.2. Keputusan Arsitektur
Diterapkan arsitektur keamanan lapis ganda (*Defense-in-Depth*):

```
                                  PERMINTAAN KLIEN
                                         â”‚
                                         â–¼
                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                   â”‚        LAPISAN 1: API MIDDLEWARE          â”‚
                   â”‚           (ElysiaJS Router Guard)         â”‚
                   â”‚  - Verifikasi Sesi JWT                    â”‚
                   â”‚  - Cek Role: Mahasiswa vs Konselor        â”‚
                   â”‚  - Jika role = student akses antrean      â”‚
                   â”‚    konselor â”€â”€â–º TOLAK (403 Forbidden)     â”‚
                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                         â”‚ (Lolos Validasi)
                                         â–¼
                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                   â”‚        LAPISAN 2: DATABASE SCOPING        â”‚
                   â”‚             (Drizzle ORM Layer)           â”‚
                   â”‚  - Query konselor diisolasi               â”‚
                   â”‚  - DILARANG JOIN ke tabel `users_auth`    â”‚
                   â”‚  - Hanya menarik `counseling_sessions`    â”‚
                   â”‚    dengan lampiran `dass21_score` (JSONB) â”‚
                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

1. **Two-Way Double-Blind**:
   - Mahasiswa beridentitas `Mahasiswa #XXXX`.
   - Konselor dianonimkan dari mahasiswa dengan nama samaran seperti `Konselor_A` atau `Psikolog_Athena`.
2. **Defense-in-Depth RBAC**:
   - **Level API:** Middleware ElysiaJS memverifikasi role JWT. Endpoint dasbor konselor memblokir role `student` dengan status HTTP 403.
   - **Level ORM:** Method repository konselor dirancang terisolasi secara struktural tanpa kapabilitas melakukan relasi JOIN ke tabel `users_auth`.

---

## 8. ADR-007: Unlinkable Ephemeral Pseudonymity & Counselor Handled Log Architecture

### 8.1. Konteks Masalah
Pada desain awal, pseudonim mahasiswa diterbitkan satu kali saat pendaftaran akun (misalnya `Mahasiswa #4021`) dan digunakan terus menerus untuk setiap tiket konseling di masa depan (*Persistent Pseudonym*). Dalam kajian evaluasi privasi tingkat lanjut, ditemukan dua risiko kritis:
1. **Risiko De-anonimisasi Berkelanjutan (*Linkability & Stylometry Profiling*)**: Konselor dapat menghubungkan potongan informasi, gaya bahasa, atau jam konsultasi dari berbagai tiket yang memiliki pseudonim sama untuk menebak identitas mahasiswa (Pfitzmann & Hansen, 2010).
2. **Kekhawatiran Stigma & Keengganan Curhat Ulang**: Mahasiswa yang pernah berkonsultasi mengenai masalah berat merasa enggan membuka tiket baru karena takut dinilai buruk oleh konselor di sesi berikutnya (*Fear of Evaluation*, Suler, 2004).

### 8.2. Keputusan Arsitektur
Diterapkan mekanisme **Unlinkable Ephemeral Pseudonymity** (Pseudonim Dinamis Sekali Pakai per Sesi) dan pemisahan arsitektur antarmuka:

1. **Per-Session Ephemeral Pseudonym (Unlinkability Garansi)**:
   - Setiap kali mahasiswa membuat tiket baru via `POST /api/sessions/create`, sistem otomatis menerbitkan nama samaran sesi yang independen (misalnya: `Sahabat Lentera-42`, `Sahabat Samudera-88`).
   - Konselor hanya melihat `studentPseudonym` pada tiket tersebut. Konselor tidak dapat mengetahui apakah dua tiket berbeda berasal dari mahasiswa yang sama (*Unlinkability by Design*, Cavoukian, 2010).
2. **Sanitasi Tampilan Navbar Mahasiswa**:
   - Di navbar mahasiswa, label identitas diubah menjadi representasi akun privat: `Akun Mahasiswa [Mahasiswa PJJ]`, menghilangkan kontradiksi nama dengan kartu tiket.
   - Nama samaran sesi hanya ditampilkan secara eksplisit pada masing-masing kartu tiket dan ruang obrolan sesi bersangkutan.
3. **Riwayat Pendampingan Konselor (*Counselor Handled History*)**:
   - Staf konselor disediakan tab `Riwayat Pendampingan Saya` via endpoint `GET /api/sessions/counselor/history`.
   - Konselor dapat meninjau log tiket yang pernah atau sedang mereka tangani secara resmi sebagai portofolio bimbingan tanpa membuka identitas personal mahasiswa.

### 8.3. Landasan Teoretis & Referensi Akademis
- **Pfitzmann, A., & Hansen, M. (2010)**: *Anonymity, Unlinkability, Undetectability, Unobservability, Pseudonymity, and Identity Management - A Consolidated Proposal for Terminology*. Standar W3C & ISO/IEC 27563 mengenai klasifikasi *Transaction Pseudonyms* vs *Persistent Pseudonyms*.
- **Cavoukian, A. (2010)**: *Privacy by Design: The 7 Foundational Principles*. Penerapan prinsip *Data Minimization* dan *Full Functionality (Zero-Sum to Positive-Sum)*.
- **Suler, J. (2004)**: *The Online Disinhibition Effect*. CyberPsychology & Behavior, 7(3), 321-326.

---

## 9. Matriks Ringkasan Keputusan

| Dimensi | Desain Awal | Desain Mutakhir (ADR) | Justifikasi Akademis |
|---|---|---|---|
| **Posisi Produk** | Sistem Konseling Alternatif | **Sistem Pra-Konseling (Deteksi Dini Burnout)** | Sebagai P3K psikologis dan jembatan ke MyScout UT tanpa tumpang tindih birokrasi. |
| **Otentikasi & RBAC** | OTP Email Institusi | Google OAuth 2.0 + Domain Whitelist + Hashing + RBAC Lapis Ganda | Fleksibel multi-kampus, zero identity storage, proteksi struktural via API & ORM scoping. |
| **Pemetaan Diri** | Diagnostik Bebas LLM | **Instrumen Baku DASS-21 & VAK (Matematika Murni)** | Menghindari halusinasi klinis AI, validitas psikometrik teruji secara internasional. |
| **Peran AI (LLM)** | Menilai Tingkat Stres | **Empathetic Mood Tracker** | Murni membaca sentimen narasi curhatan bebas dan memberi afirmasi empati rujukan. |
| **Basis Data** | MariaDB / PostgreSQL | **PostgreSQL** + Drizzle ORM (JSONB Lampiran Profil) | Menyimpan profil DASS-21/VAK langsung terlampir di tiket tanpa konselor bertanya dari nol. |
| **Anonimitas Sesi** | Pseudonim Statis Akun | **Unlinkable Ephemeral Pseudonymity** (Berganti Tiap Tiket) | Mencegah profiling lintas sesi (Pfitzmann & Hansen, 2010; Cavoukian, 2010). |
| **Anonimitas Obrolan** | Satu Arah (Mahasiswa saja) | **Two-Way Double-Blind** (Mahasiswa & Konselor) | Mencegah bias pemilihan konselor dan melindungi staf dari potensi penargetan identitas. |
| **Audit Konselor** | Hanya antrean triage | **Riwayat Pendampingan Saya** (Dedicated Counselor Log) | Konselor memiliki rekapitulasi portofolio bimbingan resmi tanpa merusak privasi mahasiswa. |
| **Kanal Realtime** | WebSocket konvensional | ElysiaJS Bun Native WebSocket + WebRTC P2P | Throughput mikrodetik di memory server dan streaming media bebas beban server. |
| **Kualitas Kode** | ESLint + Prettier | **Biome** (Zero-Any, Zero-Unknown) + TDD | Menjamin integritas tipe data dan keandalan logika algoritma kriptografi/skor. |
| **Indeks Repositori** | Manual | **GitNexus** (Knowledge Graph Code Indexing) | Menjaga keterlacakan graf dependensi monorepo. |


