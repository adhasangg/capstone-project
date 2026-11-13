# MATRIKS TANGGAPAN DAN REVISI LAPORAN KEMAJUAN (TUGAS 2)
## STSI4440 CAPSTONE PROJECT - UNIVERSITAS TERBUKA (2026)

**Judul Capstone:** Pengembangan Sistem Pra-Konseling Anonim dan Pemetaan Potensi Diri untuk Deteksi Dini *Academic Burnout* pada Ekosistem Pendidikan Jarak Jauh  
**Studi Kasus:** Universitas Terbuka (UT)  
**Kelompok:** Kelompok B  
**Anggota Tim:**
1. Muhammad Mirza Fauzan (NIM: 051105305)
2. Adam Budiman (NIM: 051438428)
3. Aprilianti (NIM: 051719678)
4. Fuad Hasan (NIM: 051317626)
5. Prasetyo Galih Utomo (NIM: 050669398)

---

## 1. Prinsip Utama Revisi: Penyelarasan Manfaat Nyata terhadap Sistem yang Dibangun (*Software Traceability*)

Merespons arahan dan catatan dosen evaluator, revisi Laporan Kemajuan Tugas 2 ini tidak hanya memperbaiki teks secara pasif, melainkan menerapkan prinsip **Ketertelusuran Perangkat Lunak (*Software Traceability*) dan Nilai Terapannya (*Actionable Value*)**. 

Di setiap subbab pada Bab III (Metode Penelitian, Proses Analisis, Proses Perancangan, Implementasi, hingga Pengujian), tim telah menyematkan sub-bagian penutup eksplisit:
> **"Manfaat dan Kontribusi Nyata terhadap Sistem SafeSpace PWA yang Dibangun"**

Pendekatan ini membuktikan bahwa setiap teori, tahapan siklus hidup perangkat lunak, maupun teknik pengumpulan data yang dipilih bukanlah hafalan teoretis semata, melainkan memiliki benang merah yang ditarik langsung ke pembentukan fitur, keandalan performa, dan jaminan privasi aplikasi SafeSpace PWA.

---

## 2. Matriks Rekapitulasi Catatan Reviewer dan Tindak Lanjut Perbaikan

Tabel berikut merangkum 5 poin catatan masukan dosen pembimbing/evaluator pada Tugas 2 beserta tindakan perbaikan yang telah dilakukan dan lokasi perubahannya pada berkas naskah resmi:

| No | Komponen Evaluasi | Catatan Masukan Dosen (Evaluator) | Tindak Lanjut Perbaikan oleh Tim Kelompok B | Lokasi Subbab pada Naskah Bab III |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Metode Penelitian** | *"Metode penelitian dan tahapan yang digunakan telah dijelaskan dengan baik. Namun, keterkaitan antara metode yang dipilih, tujuan penelitian, dan hasil yang ingin dicapai masih perlu diperkuat agar pelaksanaan penelitian lebih terarah dan sistematis."* | - Menambahkan **Tabel 3.1: Matriks Keterkaitan Metode Penelitian (Model Prototyping R&D), Tujuan Penelitian (5 Butir di Bab 1.2), dan Hasil Konkret yang Dicapai**.<br/>- Menguraikan aktivitas operasional setiap fase prototyping (Communication, Quick Plan, Construction, Testing, Refinement) secara terpadu dengan luaran konkret yang dihasilkan sistem.<br/>- Menambahkan sub-bagian khusus: **Manfaat dan Kontribusi Nyata Model Prototyping terhadap Sistem SafeSpace PWA** dan **Manfaat Penyelarasan Matriks terhadap Ketertelusuran Sistem**. | **Subbab 3.1.1 & 3.1.2** (Halaman Bab III) |
| **2** | **Proses Analisis** | *"Proses analisis kebutuhan sistem telah diuraikan secara cukup terstruktur, mencakup kebutuhan dan fungsi sistem yang akan dikembangkan. Namun, kesesuaian instrumen yang digunakan dengan tujuan deteksi dini academic burnout perlu diperjelas agar hasil analisis benar-benar mendukung pencapaian tujuan penelitian."* | - Menambahkan subbab mendalam **Kesesuaian dan Justifikasi Ilmiah Instrumen DASS-21 dan VAK untuk Deteksi Dini Academic Burnout**.<br/>- Menjelaskan korelasi psikometri antara 3 dimensi Maslach Burnout Inventory (MBI: *Emotional Exhaustion*, *Cynicism*, *Reduced Efficacy*) dengan 3 subskala DASS-21 (Stres, Cemas, Depresi).<br/>- Menjelaskan peran model VAK sebagai *exit strategy* pedagogis untuk mereduksi beban kognitif (*Cognitive Load Theory*) dari modul BMP UT.<br/>- Menambahkan sub-bagian: **Manfaat Ilmiah dan Fungsional Integrasi DASS-21 dan VAK bagi Sistem SafeSpace PWA** (bagi mahasiswa, konselor, dan integritas sistem). | **Subbab 3.2.2** (Halaman Bab III) |
| **3** | **Proses Perancangan Sistem** | *"Sangat Baik Menguraikan. Proses perancangan sistem telah dijelaskan secara terperinci, terutama terkait rancangan sistem dan alur fungsionalnya. Uraian tersebut menunjukkan bahwa tahapan perancangan telah disusun secara sistematis dan memberikan gambaran yang jelas mengenai sistem yang akan dikembangkan."* | - Mempertahankan seluruh keunggulan struktur perancangan yang telah dinilai **Sangat Baik**.<br/>- Mempertegas integrasi diagram UML, kamus data skema basis data PostgreSQL Drizzle nir-jejak data pribadi (*Zero-PII Storage*), arsitektur monorepo Bun Workspaces, dan pendekatan antarmuka ramah trauma (*Trauma-Informed UI*).<br/>- Menambahkan sub-bagian penutup manfaat nyata arsitektur monorepo, basis data zero-PII, warna sage green, dan kriptografi E2EE. | **Subbab 3.3.1 - 3.3.4** (Halaman Bab III) |
| **4** | **Proses Implementasi** | *"Proses implementasi sistem telah diuraikan dengan baik dan memberikan gambaran mengenai penerapan rancangan ke dalam sistem yang dikembangkan. Namun, penjelasan mengenai mekanisme anonimitas, pengelolaan identitas pengguna, dan perlindungan data pribadi masih perlu diperjelas untuk memastikan keamanan dan kerahasiaan data pengguna."* | - Menyusun subbab komprehensif mengenai **Mekanisme Anonimitas, Pengelolaan Identitas, dan Perlindungan Data Pribadi (Privacy by Design)** melalui 5 lapisan pertahanan (*Defense-in-Depth*):<br/>  1. Anonimitas hulu via `HMAC-SHA-256(Google_Sub + Server_Pepper)` dan pembuangan instan nama/email dari RAM (*Zero-PII Storage*).<br/>  2. Tata kelola identitas dan kontrol akses berbasis peran (RBAC) pada router API ElysiaJS dan pembatasan kueri (*Database Scoping*).<br/>  3. Nama samaran acak dinamis per sesi tiket (*Unlinkable Ephemeral Pseudonymity*).<br/>  4. Perlindungan isi obrolan konseling via Web Crypto API AES-GCM-256 (E2EE).<br/>  5. Fitur tombol darurat privasi fisik (*Emergency Safe Exit*).<br/>- Menambahkan sub-bagian: **Manfaat Penerapan Lima Lapis Pertahanan Privasi bagi Pengguna dan Sistem**. | **Subbab 3.4.2** (Halaman Bab III) |
| **5** | **Pengujian dan Evaluasi** | *"Pengujian teknis sistem telah dilaporkan, tetapi pembahasan mengenai evaluasi sistem dari sisi pengguna masih perlu dilengkapi. Pelaksanaan dan pelaporan User Acceptance Testing (UAT) serta System Usability Scale (SUS) perlu diperjelas agar kualitas sistem, kemudahan penggunaan, dan penerimaan pengguna dapat dinilai secara lebih komprehensif."* | - **Memberikan klarifikasi metodologis yang jujur dan ilmiah:** Pada Tugas 2, pengujian berfokus pada verifikasi teknis internal (99 unit/integration test, 10 Playwright E2E, 14 black-box test; 100% lulus). Pengujian pengguna riil belum dilaksanakan karena ketiadaan responden langsung saat fase Tugas 2.<br/>- **Menyusun Alur Operasional Pengujian UAT Terstandarisasi via Google Forms:**<br/>  1. Prosedur pembuatan Google Form instrumen baku 10 butir SUS (Brooke, 1996).<br/>  2. Panduan 4 skenario tugas terpandu (*bounded testing scenario tasks*).<br/>  3. **PENEGASAN BATASAN:** Pengujian MURNI menguji sistem perangkat lunak (antarmuka, alur asesmen DASS-21, pengisian VAK, mood tracker, safe exit), **BUKAN menguji efektivitas medis atau kompetensi isi konselor**.<br/>  4. Formula matematis baku perhitungan skor SUS dan matriks kelayakan industri (Bangor et al., 2008).<br/>  5. Lembar kerja tabulasi rencana pengujian responden mahasiswa UT.<br/>- Menambahkan sub-bagian: **Manfaat Pelaksanaan UAT dan Skoring SUS bagi Kelaikan Adopsi Sistem Informasi**. | **Subbab 3.5.4** (Halaman Bab III) |

---

## 3. Uraian Rinci Jawaban dan Perbaikan per Butir Masukan Dosen

Berikut adalah naskah lengkap perbaikan yang telah diintegrasikan ke dalam berkas utama laporan [`docs/Naskah_Resmi_Bab3_Metodologi.md`](file:///d:/ijplabs/capstone/docs/Naskah_Resmi_Bab3_Metodologi.md):

### A. Perbaikan Poin 1: Penguatan Keterkaitan Metode Penelitian, Tujuan, dan Hasil

Pada naskah yang direvisi, Subbab 3.1.2 menyajikan pemetaan keterkaitan antara 5 fase Model Prototyping (R&D) dengan 5 Tujuan Penelitian di Bab 1.2:
- **Fase 1 (Komunikasi):** Menjawab **Tujuan 1** (Konseptualisasi SafeSpace PWA sebagai platform pra-konseling anonim). Menghasilkan dokumen PRD, pemetaan 3 akar masalah pengguna, dan spesifikasi kebutuhan (10 FR, 4 NFR).
- **Fase 2 (Perencanaan & Desain Cepat):** Menjawab **Tujuan 2, 3, dan 4** (Rancangan modul DASS-21/VAK, arsitektur RBAC & E2EE, dan tiket triage). Menghasilkan desain monorepo Bun, skema 4 tabel PostgreSQL Drizzle Zero-PII, diagram UML interaktif, dan pedoman UI ramah trauma.
- **Fase 3 (Konstruksi Prototipe):** Menjawab **Tujuan 1, 2, 3, dan 4** (Realisasi ke baris kode program). Menghasilkan repositori monorepo fungsional penuh berbasis Bun, ElysiaJS, React 19, kalkulasi skor deterministik murni, dan modul Web Crypto AES-GCM-256.
- **Fase 4 (Pengujian & Evaluasi):** Menjawab **Tujuan 5** (Verifikasi teknis Black-Box dan rancangan UAT SUS). Menghasilkan 99 Unit/Integration Test lulus (100%), 10 Playwright E2E Test lulus (100%), 14 skenario Black-Box lulus (100%), serta Prosedur Operasional UAT Daring via Google Forms.
- **Fase 5 (Penyempurnaan & Peluncuran):** Menjawab **Tujuan 1 dan 5** (Kesiapan sistem dan dokumentasi akademik). Menghasilkan deployment multi-container Docker terisolasi (staging dan production) serta dokumentasi teknis lengkap.

---

### B. Perbaikan Poin 2: Justifikasi Kesesuaian Instrumen DASS-21 dan VAK untuk Deteksi Dini Academic Burnout

Pada Subbab 3.2.2, tim memperjelas fondasi ilmiah pemilihan instrumen:
1. **Korelasi Tiga Dimensi Maslach Burnout Inventory (MBI) dengan DASS-21:**
   - *Emotional Exhaustion* (Kelelahan Emosional) berkorelasi langsung dengan **Subskala Stres DASS-21** (mengukur ketegangan syaraf, iritabilitas, dan kesulitan relaksasi).
   - *Cynicism / Depersonalization* dan kecemasan performa berkorelasi dengan **Subskala Kecemasan DASS-21** (mengukur ketakutan situasional dan kepanikan menghadapi tugas PJJ).
   - *Reduced Academic Efficacy* (Penurunan Efikasi Diri) berkorelasi dengan **Subskala Depresi DASS-21** (mengukur anhedonia, disforia, dan keputusasaan terhadap kelanjutan studi).
   - DASS-21 memiliki validitas psikometri tinggi dan waktu pengerjaan sangat singkat (< 3 menit), sehingga mencegah kelelahan responden (*survey fatigue*).
2. **Model Gaya Belajar VAK sebagai Exit Strategy Pedagogis:**
   - Berdasarkan *Cognitive Load Theory* (Sweller, 1988), burnout pada mahasiswa PJJ UT kerap dipicu oleh beban kognitif akibat modul bacaan digital (BMP) yang padat teks visual murni.
   - SafeSpace memadukan diagnosis stres dengan jalan keluar solutif: hasil kuesioner VAK memberikan rekomendasi tips belajar adaptif di Tuton UT (misal: text-to-speech untuk auditori, peta konsep untuk kinestetik), mereduksi beban kognitif pemicu kelelahan belajar.
3. **Penegasan Batasan Peran Sistem:**
   - SafeSpace PWA adalah platform pra-konseling dan pemilahan awal (*triage*) akademik, bukan alat diagnosis psikiatri klinis. Perhitungan skor deterministik murni menjamin netralitas tanpa risiko kesalahan halusinasi kecerdasan buatan (*zero algorithmic hallucination*).

---

### C. Perbaikan Poin 3: Proses Perancangan Sistem

Subbab 3.3.1 hingga 3.3.4 dipertahankan dan disempurnakan karena telah memperoleh predikat **Sangat Baik Menguraikan** dari dosen. Seluruh artefak perancangan arsitektur multi-tier, skema basis data PostgreSQL Drizzle, kamus data atribut, perancangan antarmuka ramah trauma (*Calm Technology*), dan diagram alur kriptografi tetap menjadi rujukan utama, kini dilengkapi dengan penjabaran manfaat arsitekturalnya terhadap stabilitas sistem.

---

### D. Perbaikan Poin 4: Penjelasan Mekanisme Anonimitas, Pengelolaan Identitas, dan Perlindungan Data Pribadi

Pada Subbab 3.4.2, tim menguraikan secara rinci lima mekanisme keamanan dan privasi data (*Defense-in-Depth*):
1. **One-Way Cryptographic Identity Sanitization:** Menggunakan fungsi `HMAC-SHA-256(Google_Sub, PEPPER_SECRET)`. Kunci rahasia pepper tersimpan di environment server dan data nama/email asli dibuang dari RAM peladen seketika (*Zero-PII Storage*).
2. **Pengelolaan Identitas dan Otorisasi Berbasis Peran (RBAC):** Struktur 3 peran (`student`, `counselor`, `admin`) dilindungi middleware guard ElysiaJS pada API router dan isolasi kueri basis data (*Database Scoping*).
3. **Unlinkable Ephemeral Pseudonymity:** Setiap tiket bimbingan baru membangkitkan nama samaran acak baru (`Sahabat [Kata-Empati]-[Angka]`), sehingga konselor tidak dapat mengorelasikan riwayat tiket mahasiswa di masa lalu (*fresh start privacy*).
4. **Enkripsi End-to-End (E2EE) Web Crypto AES-GCM-256:** Teks obrolan dienkripsi di peramban pengguna sebelum dikirim. Server hanya bertindak sebagai perantara relai *ciphertext* tanpa memiliki kunci dekripsi (*Zero-Knowledge*).
5. **Emergency Safe Exit:** Tombol darurat di navbar yang membersihkan sesi lokal dan mengalihkan layar seketika (< 50 milidetik) ke portal edukasi netral jika privasi fisik mahasiswa terancam.

---

### E. Perbaikan Poin 5: Prosedur dan Alur Operasional Pengujian UAT Berbasis SUS

Merespons masukan dosen mengenai evaluasi pengguna, tim menyusun Subbab 3.5.4 dengan struktur alur kerja operasional terstandarisasi:
1. **Klarifikasi Metodologis Tugas 2:** Menjelaskan bahwa Tugas 2 berfokus pada pengujian teknis internal (99 Unit/Integration Test, 10 Playwright E2E, 14 Black-Box Test; 100% lulus). UAT disajikan sebagai **Prosedur dan Desain Protokol Operasional UAT Terstandarisasi** yang siap dieksekusi menjelang Laporan Akhir.
2. **Penegasan Batasan Ruang Lingkup Pengujian UAT:**
   - **Fokus Pengujian:** MURNI menguji aspek rekayasa perangkat lunak sistem informasi (kemudahan antarmuka, kejelasan alur pengisian kuesioner DASS-21 dan VAK, keterbacaan hasil skor, kenyamanan warna penenang, kehandalan navigasi, dan fungsi tombol *Safe Exit*).
   - **Batasan:** TIDAK menguji isi bimbingan konselor, kompetensi konselor, efektivitas terapi psikologis, maupun efikasi klinis medis.
3. **Alur Kerja Operasional UAT (4 Langkah):**
   - *Langkah 1:* Pembuatan Google Form berisi data demografi singkat dan 10 butir instrumen baku SUS skala Likert 1-5.
   - *Langkah 2:* Skenario Tugas Terpandu (*Bounded Testing Tasks*) bagi responden:
     * Tugas 1: Akses aplikasi dan navigasi landing page/dashboard.
     * Tugas 2: Pengisian kuesioner mandiri DASS-21 dan pengecekan tampilan skor emosional.
     * Tugas 3: Pengisian kuesioner preferensi gaya belajar VAK dan pengecekan tips belajar adaptif.
     * Tugas 4: Eksplorasi fitur Jurnal Mood Refleksi dan uji respons tombol darurat *Safe Exit*.
   - *Langkah 3:* Pengisian Google Form kuesioner 10 butir SUS pasca-interaksi sistem.
   - *Langkah 4:* Pengolahan skor menggunakan rumus baku SUS:
     $$X_i = \text{Skor Ganjil} - 1, \quad Y_i = 5 - \text{Skor Genap}$$
     $$\text{Skor Akhir SUS} = \left(\sum X_i + \sum Y_i\right) \times 2,5$$
     Target penerimaan sistem ditetapkan pada $\overline{\text{SUS}} > 68,0$ (Grade B / Good).
4. **Lembar Tabulasi Rencana Pengujian:** Menyiapkan format tabel rekapitulasi untuk 20 hingga 30 responden mahasiswa Universitas Terbuka lintas fakultas.

---

## 4. Berkas Pendukung yang Telah Disiapkan untuk Tim

Seluruh instrumen pendukung operasional UAT dan bahan laporan telah tersedia pada repositori:
1. **Naskah Lengkap Bab III Metodologi:**  
   [`docs/Naskah_Resmi_Bab3_Metodologi.md`](file:///d:/ijplabs/capstone/docs/Naskah_Resmi_Bab3_Metodologi.md)
2. **Panduan Operasional Pembuatan Google Form UAT:**  
   [`docs/Panduan_Operasional_UAT_Tim.md`](file:///d:/ijplabs/capstone/docs/Panduan_Operasional_UAT_Tim.md)
3. **Instrumen Kuesioner Baku SUS & Panduan Skoring:**  
   [`docs/Kuesioner_SUS_dan_Panduan_UAT.md`](file:///d:/ijplabs/capstone/docs/Kuesioner_SUS_dan_Panduan_UAT.md)
4. **Lembar Kerja Spreadsheet Excel Kalkulator SUS Otomatis:**  
   [`docs/UAT_SUS_Kalkulator_Otomatis.xlsx`](file:///d:/ijplabs/capstone/docs/UAT_SUS_Kalkulator_Otomatis.xlsx)
5. **Dasbor Diagram Visualisasi UML & Arsitektur Monorepo:**  
   [`docs/flowchart_dashboard.html`](file:///d:/ijplabs/capstone/docs/flowchart_dashboard.html)
6. **Panduan Teknikal dan Bank Pertanyaan Sidang/Presentasi:**  
   [`docs/Panduan_Teknikal_dan_Tanya_Jawab_Presentasi.md`](file:///d:/ijplabs/capstone/docs/Panduan_Teknikal_dan_Tanya_Jawab_Presentasi.md)
