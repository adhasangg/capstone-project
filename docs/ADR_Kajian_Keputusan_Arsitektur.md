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
2. [ADR-001: Mekanisme Autentikasi — Migrasi ke Google OAuth 2.0 dengan Hashing Anonim](#2-adr-001-mekanisme-autentikasi--migrasi-ke-google-oauth-20-dengan-hashing-anonim)
3. [ADR-002: Pemilihan Basis Data — PostgreSQL dengan Drizzle ORM](#3-adr-002-pemilihan-basis-data--postgresql-dengan-drizzle-orm)
4. [ADR-003: Arsitektur Realtime — ElysiaJS Native WebSocket & WebRTC P2P](#4-adr-003-arsitektur-realtime--elysiajs-native-websocket--webrtc-p2p)
5. [ADR-004: Standardisasi Rekayasa Perangkat Lunak — Bun Monorepo, Biome, TDD, & GitNexus](#5-adr-004-standardisasi-rekayasa-perangkat-lunak--bun-monorepo-biome-tdd--gitnexus)
6. [Matriks Ringkasan Keputusan](#6-matriks-ringkasan-keputusan)

---

## 1. Pendahuluan & Konteks Sistem

SafeSpace PWA dirancang sebagai platform layanan Bimbingan Konseling (BK) digital berbasis *Progressive Web App* yang memprioritaskan privasi psikologis mahasiswa. Dua pilar non-fungsional utama sistem ini adalah:
1. **Double-Blind Anonymity**: Mahasiswa dan konselor tidak saling mengetahui identitas asli (nama, NIM, email asli). Komunikasi dilakukan menggunakan pseudonim yang diterbitkan secara dinamis oleh sistem.
2. **End-to-End Encryption (E2EE)**: Pesan obrolan dienkripsi di peramban menggunakan pasangan kunci kriptografis (Web Crypto API) sehingga peladen maupun administrator basis data tidak dapat membaca konten percakapan (*Zero-Knowledge Architecture*).

Untuk memenuhi standar karya ilmiah yang dapat dipertanggungjawabkan, setiap keputusan pemilihan teknologi dan alur arsitektur didokumentasikan dalam format ADR ini.

---

## 2. ADR-001: Mekanisme Autentikasi — Migrasi ke Google OAuth 2.0 dengan Hashing Anonim

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
    │ Login via Google (email @ecampus.ut.ac.id / umum)
    ▼
[Google Identity Provider] ──(ID Token)──► [ElysiaJS Backend]
                                                │
       ┌────────────────────────────────────────┴────────────────────────────────────────┐
       │ 1. Validasi Domain (Whitelist: ecampus.ut.ac.id atau * sesuai konfigurasi)      │
       │ 2. Ekstrak 'sub' (Google Unique Subject Identifier)                             │
       │ 3. Hashing Kriptografis Satu Arah: SHA-256(sub + PEPPER_SECRET)                │
       │ 4. BUANG data nama asli, foto profil, dan email teks biasa dari memori          │
       │ 5. Cari / Buat Record di `users_auth`:                                         │
       │    - id: UUIDv7                                                                 │
       │    - hashed_identity: SHA-256 ciphertext                                        │
       │    - role: 'student' | 'counselor'                                              │
       │ 6. Terbitkan Sesi JWT Anonim (Payload: userId: UUID, pseudonym: "Mahasiswa #X") │
       └─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.4. Konsekuensi
- **Positif:** Tidak ada ketergantungan birokrasi izin server kampus, keamanan kelas industri, mendukung adopsi multi-kampus melalui variabel lingkungan `ALLOWED_EMAIL_DOMAINS`, dan jaminan bahwa data pribadi mahasiswa tidak pernah tersimpan di database.
- **Mitigasi Risiko:** Pengguna yang kehilangan akses akun Google harus memulihkan akun lewat Google; peladen tidak menyimpan nomor telepon atau pemulihan alternatif.

---

## 3. ADR-002: Pemilihan Basis Data — PostgreSQL dengan Drizzle ORM

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

## 4. ADR-003: Arsitektur Realtime — ElysiaJS Native WebSocket & WebRTC P2P

### 4.1. Konteks Masalah
Sistem membutuhkan transmisi pesan instan (<200ms) untuk chat teks serta kemampuan eskalasi ke panggilan suara/video jika pengguna membutuhkan intervensi darurat.

### 4.2. Keputusan Arsitektur
Diterapkan pemisahan tanggung jawab yang jelas (*Separation of Concerns*):

```
                  ┌──────────────────────────────────────────────┐
                  │              PERAMBAN KLIEN                  │
                  │  - Enkripsi Pesan Web Crypto (RSA/AES)       │
                  │  - Inisiasi RTCPeerConnection (Media P2P)    │
                  └──────────────┬────────────────┬──────────────┘
                                 │                │
                     Media Stream (Audio/Video)   │ WebSocket (Chat & Signaling)
                     Peer-to-Peer murni           │
                                 ▼                ▼
                  ┌────────────────────────┐   ┌──────────────────────────────────┐
                  │    KLIEN LAWAN BICARA  │   │     ELYSIANJS NATIVE WEBSOCKET   │
                  │    (Konselor / Pasien) │   │  (Kernel Bun uWebSocket C++)     │
                  └────────────────────────┘   │  - Topic Pub/Sub in-memory       │
                                               │  - Relay SDP & ICE Candidate     │
                                               └──────────────┬───────────────────┘
                                                              │
                                            Simpan Pesan Ciphertext Terenkripsi
                                                              ▼
                                               ┌──────────────────────────────────┐
                                               │     POSTGRESQL PERSISTENCE       │
                                               │  (Hanya menyimpan ciphertext)    │
                                               └──────────────────────────────────┘
```

1. **Jalur Teks Chat**:
   - Klien mengenkripsi pesan -> Mengirimkan ciphertext via WebSocket ElysiaJS.
   - ElysiaJS melakukan `publish` ke topik sesi obrolan secara *in-memory* dengan latensi mikrodetik.
   - ElysiaJS menyimpan ciphertext tersebut ke PostgreSQL (`messages.encrypted_content`) agar riwayat obrolan dapat dibuka kembali saat refresh.
2. **Jalur Panggilan Darurat (WebRTC)**:
   - Peladen ElysiaJS hanya bertindak sebagai **Signaling Server** (menukar penawaran SDP dan kandidat ICE antar-klien).
   - Data suara dan video mengalir langsung secara *Peer-to-Peer* (P2P) antar-peramban tanpa melalui server, sehingga beban server tetap ringan dan privasi percakapan suara terjaga.

---

## 5. ADR-004: Standardisasi Rekayasa Perangkat Lunak — Bun Monorepo, Biome, TDD, & GitNexus

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

## 6. Matriks Ringkasan Keputusan

| Dimensi | Desain Awal | Desain Mutakhir (ADR) | Justifikasi Akademis |
|---|---|---|---|
| **Otentikasi Identitas** | OTP Email Institusi | Google OAuth 2.0 + Domain Whitelist + One-Way Identity Hashing | Menghilangkan friksi birokrasi, siap adopsi multi-kampus, privasi anonim absolut terjamin. |
| **Basis Data** | MariaDB / PostgreSQL | **PostgreSQL** + Drizzle ORM | Dukungan UUIDv7 native, JSONB terindeks, Listen/Notify untuk event realtime, dan kesiapan ekstensi AI. |
| **Kanal Realtime** | WebSocket konvensional | ElysiaJS Bun Native WebSocket (C++ uWS) + WebRTC P2P | Throughput tinggi di memori server untuk chat, P2P bebas beban server untuk streaming audio/video. |
| **Kualitas Kode** | ESLint + Prettier | **Biome** (Zero-Any, Zero-Unknown, Rust-powered) | Kecepatan build, standardisasi ketat, pencegahan celah tipe data di masa kompilasi. |
| **Indeks Repositori** | Manual | **GitNexus** (Knowledge Graph Code Indexing) | Memastikan keterlacakan simbol dan integritas arsitektur monorepo. |
