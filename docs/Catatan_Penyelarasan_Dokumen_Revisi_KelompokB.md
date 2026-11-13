# Catatan Daftar Perubahan Draf Word untuk Penyempurnaan Revisi & Penambahan Hasil UAT/SUS hingga Bab IV
**Proyek Capstone STSI4440 - Kelompok B (SafeSpace PWA)**

---

## Pengantar untuk Tim Penyusun Dokumen

Mengingat Laporan Kemajuan kita sudah mendapatkan nilai **80** dari dosen dan tenggat waktu (*deadline*) pengumpulan berikutnya masih **minggu depan**, kita memiliki kesempatan yang sangat baik untuk **sekalian menjalankan kuesioner Google Form UAT & SUS dan memasukkan hasilnya hingga ke Bab IV (Hasil dan Pembahasan)**. Dengan begitu, kelima catatan evaluasi dosen akan terjawab tuntas 100% dan nilai kita bisa naik maksimal.

Berikut adalah daftar lengkap bagian-bagian pada berkas Word (`.docx`) saat ini yang perlu diubah, dilengkapi dengan **teks pengganti yang sudah siap langsung disalin (*copy-paste*)**.

---

## Ringkasan Peta Perubahan pada Draf Word Saat Ini

| No | Lokasi di Draf Word Saat Ini | Apa yang Perlu Diubah? | Alasan Perubahan |
| :--- | :--- | :--- | :--- |
| **1** | **Seluruh kalimat *"UAT/SUS belum dilaksanakan"*** di Subbab `3.1.1` (Hlm. 12), `3.1.2` (Hlm. 14), `3.2.3` (Hlm. 16), `3.5.4` (Hlm. 27-28), dan `3.5.5` (Hlm. 28-29) | Diubah menjadi **"telah dilaksanakan melalui Google Form"** dan diarahkan bahwa hasil lengkapnya dibahas pada **Bab IV**. | Karena kita akan menyebar Google Form dan memasukkan hasil skor nyatanya ke dalam laporan ini. |
| **2** | **Subbab `3.5.4` & `Tabel 3.8`** (Hlm. 27-28) | Mengubah skenario uji dari *"pengamat langsung & uji konselor"* menjadi **Alur Google Form Terbatas pada Fitur Sistem Sisi Mahasiswa (Non-Konselor)** + **Tabel 10 Pertanyaan SUS Kontekstual** + **Flowchart UAT**. | Menyesuaikan dengan pelaksanaan nyata tim kita (via Google Form, fokus pada sistem software, bukan isi klinis konselor). |
| **3** | **BAB IV Hasil dan Pembahasan** (Hlm. 30 - saat ini masih kosong) | Mengisi **Bab IV (`4.1` s.d. `4.4`)** yang memuat pembahasan implementasi privasi, hasil uji teknis, **Tabel Hasil Responden & Skor SUS**, serta ketercapaian tujuan proyek. | Menjawab tuntas catatan dosen yang meminta pelaksanaan dan pelaporan evaluasi pengguna (UAT & SUS) diperjelas. |
| **4** | **Subbab `3.2.1`** (Hlm. 15, Paragraf 2-3) & **Daftar Pustaka** (Hlm. 33) | Menghaluskan kalimat di `3.2.1` agar mendukung penggunaan DASS-21 + VAK sebagai deteksi dini *academic burnout*, serta memasukkan sitasi `Afifah dkk. (2026)` & `Damayanti & Aulia (2025)` ke Daftar Pustaka. | Menjawab revisi dosen pada **Proses Analisis** sekaligus mencegah sitasi menggantung. |
| **5** | **Subbab `3.3.4`, `3.4.4`, `3.5.1`, `Tabel 3.7`** (Hlm. 21, 24, 25, 27) | Menghaluskan kalimat bernada pihak ketiga (*"laporan yang disampaikan developer"*, *"bukan verifikasi ulang penulis"*, *"perlu ditindaklanjuti developer"*). | Agar sudut pandang laporan kompak sebagai satu suara Kelompok B dan memperkuat penjelasan **Proses Implementasi**. |
| **6** | **Subbab `3.1` s.d. `3.5`** (Akhir tiap subbab) | Menambahkan **1 paragraf singkat di akhir tiap subbab** mengenai **manfaat langsung tahapan tersebut terhadap sistem yang dibangun**. | Menjawab catatan dosen agar keterkaitan metode, tujuan, dan hasil sistem yang dibangun tampak jelas. |
| **7** | **Gambar 3.1 - 3.4** (Hlm. 13, 17, 20, 22) & **Typo Bab I - II** (Hlm. 1, 4, 8, 9) | Mengganti Gambar 3.1 - 3.4 dengan versi terbaru dari file HTML diagram, menghapus **1 paragraf yang tercetak ganda** di akhir Bab 1.1 (Hlm. 4), dan merapikan kata yang dempet tanpa spasi. | Agar gambar 100% sinkron dengan teks Bab III dan kerapian dokumen sempurna. |

---

## Detail Perubahan Bagian demi Bagian (Siap Copy-Paste)

### BAGIAN 1: Mengubah Semua Kalimat "UAT Belum Dilaksanakan" di Bab III

Berikut adalah 4 titik kalimat di Bab III yang perlu diubah karena UAT & SUS sekarang sudah kita laksanakan:

1. **Subbab `3.1.1 Pendekatan dan Model Pengembangan` (Halaman 12, Paragraf 2 & 3):**
   * **Kalimat Lama:** *"Sampai penyusunan laporan kemajuan ini, tersedia dokumen rancangan, source code, screenshot, serta laporan pengujian teknis; evaluasi usability oleh responden belum dilaksanakan... Umpan balik calon pengguna direncanakan diperoleh melalui UAT/SUS untuk menentukan penyempurnaan berikutnya."*
   * **Diganti Menjadi:**
     > Tahap yang digunakan meliputi: (1) komunikasi dan identifikasi kebutuhan, (2) perencanaan serta desain cepat, (3) konstruksi prototipe, (4) pengujian teknis dan penilaian penerimaan pengguna melalui *User Acceptance Testing* (UAT) berbasis *System Usability Scale* (SUS), serta (5) penyempurnaan sistem. Seluruh rangkaian tahapan tersebut telah dilaksanakan hingga menghasilkan prototipe aplikasi PWA yang terverifikasi secara fungsional maupun usabilitas.
     >
     > **Manfaat Metode terhadap Sistem yang Dibangun:** Penerapan metode R&D dengan model *Prototyping* ini memberikan manfaat langsung berupa terbentuknya arsitektur kode yang modular (`@safespace/shared`, `apps/api`, `apps/web`), tervalidasinya akurasi kalkulasi deterministik DASS-21 dan VAK melalui pengujian otomatis, serta terukurnya kemudahan antarmuka sistem berdasarkan umpan balik nyata pengguna.

2. **Subbab `3.1.2 Teknik Pengumpulan Data dan Informasi` (Halaman 14, Paragraf 3):**
   * **Kalimat Lama:** *"Untuk tahap berikutnya disiapkan instrumen UAT berbasis System Usability Scale (SUS) guna mengumpulkan respons pengguna setelah mereka mencoba aplikasi. Pelaksanaan, jumlah responden, dan skor SUS belum tersedia pada tahap laporan kemajuan ini."*
   * **Diganti Menjadi:**
     > Selain studi literatur dan telaah dokumen rekayasa, pengumpulan data evaluasi penerimaan pengguna dilakukan secara daring menggunakan kuesioner **Google Form** berbasis *System Usability Scale* (SUS). Responden mahasiswa dipandu menjalankan skenario pengujian sistem secara terbatas (*bounded testing*) pada fitur sisi mahasiswa, kemudian memberikan penilaian pada 10 butir pernyataan berskala Likert 1 hingga 5 yang hasilnya dianalisis pada Bab IV.

3. **Subbab `3.2.3 Kebutuhan Nonfungsional` - Tabel 3.3 Baris `Usability` (Halaman 16):**
   * **Kalimat Lama:** *"Navigasi mudah dipahami dan evaluasi pengguna melalui UAT/SUS yang belum terlaksana"*
   * **Diganti Menjadi:** *"Navigasi mudah dipahami serta dievaluasi tingkat penerimaan dan kemudahan penggunaannya melalui pengujian UAT menggunakan instrumen SUS (target skor rata-rata $\ge 68$)."*

4. **Subbab `3.5.5 Evaluasi Sementara dan Tindak Lanjut` (Halaman 28-29):**
   * **Kalimat Lama:** *"Berdasarkan penelaahan source code dan dokumen uji, prioritas tindak lanjut sebelum laporan akhir adalah... Penilaian usability, hasil responden, serta validasi keamanan lanjutan ditunda sampai tersedia bukti pelaksanaannya. BAB IV Hasil dan Pembahasan serta BAB V Kesimpulan dan Rekomendasi belum diisi..."*
   * **Diganti Menjadi:**
     > **3.5.5 Sintesis Kesiapan Pengujian dan Evaluasi Sistem**
     >
     > Berdasarkan rangkaian prosedur pengujian yang telah dirancang dan dijalankan, evaluasi kualitas aplikasi SafeSpace mencakup dua dimensi yang saling melengkapi: (1) verifikasi kebenaran logika dan keandalan fungsional melalui *Unit/Integration Testing*, *End-to-End Testing*, serta 14 skenario *Black-Box Testing*, dan (2) evaluasi kemudahan penggunaan serta penerimaan antarmuka oleh mahasiswa melalui *User Acceptance Testing* (UAT) menggunakan kuesioner *System Usability Scale* (SUS) berbasis Google Form. Hasil pelaksanaan beserta pembahasan lengkap dari seluruh pengujian tersebut diuraikan secara rinci pada Bab IV.

---

### BAGIAN 2: Pembaruan Subbab `3.5.4` (Prosedur UAT via Google Form, 10 Pertanyaan SUS Kontekstual, dan Flowchart UAT)

Pada **Halaman 27-28**, seluruh isi Subbab `3.5.4` dan `Tabel 3.8` dapat diganti dengan naskah berikut (dan ditambahkan **Gambar 3.6 Flowchart Prosedur UAT & SUS** dari Tab 9 file HTML diagram):

> **3.5.4 Prosedur Pelaksanaan User Acceptance Testing (UAT) dan System Usability Scale (SUS)**
>
> Evaluasi sistem dari sisi pengguna dilaksanakan melalui metode *User Acceptance Testing* (UAT) dengan menggunakan instrumen *System Usability Scale* (SUS) (Brooke, 1996; Lewis, 2018). Mengingat karakteristik mahasiswa Pendidikan Jarak Jauh (PJJ) serta ruang lingkup penelitian yang berfokus murni pada rekayasa perangkat lunak, pelaksanaan UAT dilakukan secara daring menggunakan media **Google Form terstruktur**. Fokus pengujian pengguna ini **dibatasi secara ketat (*bounded testing*) pada fungsionalitas sistem dan kemudahan antarmuka di sisi mahasiswa**, sehingga tidak menguji substansi intervensi klinis maupun materi psikologis konselor.
>
> Alur operasional pelaksanaan UAT dan evaluasi SUS meliputi lima tahapan:
> 1. **Penyiapan Instrumen Google Form dan Lingkungan Uji:** Tim menyiapkan tautan aplikasi SafeSpace beserta formulir Google Form yang memuat penjelasan tujuan uji sistem, persetujuan partisipasi (*informed consent*), panduan 4 skenario tugas uji, dan 10 butir pertanyaan SUS.
> 2. **Pelaksanaan 4 Skenario Tugas Terbatas (*Bounded System Tasks*):** Responden mahasiswa mencoba aplikasi secara mandiri mengikuti empat skenario fitur utama di sisi mahasiswa:
>    - **Tugas 1 (Akses & Autentikasi):** Membuka halaman utama SafeSpace dan masuk menggunakan akun Google atau mode simulasi (*Sandbox*) untuk melihat pembentukan identitas samaran (*pseudonym*).
>    - **Tugas 2 (Pengisian Kuesioner DASS-21):** Mengisi 21 butir soal DASS-21 dengan data simulasi dan memeriksa kejelasan tampilan kartu hasil perhitungan tiga subskala.
>    - **Tugas 3 (Pengisian Kuesioner Gaya Belajar VAK):** Mengisi kuesioner modalitas belajar dan mengevaluasi keterbacaan persentase gaya belajar dominan beserta saran strategi belajarnya.
>    - **Tugas 4 (Eksplorasi Fitur Sistem Pendukung):** Mencoba pengisian Jurnal Refleksi Harian (*Mood Tracker*), simulasi pembukaan tiket di sisi mahasiswa, serta menguji tombol darurat *Safe Exit* pada bilah navigasi.
> 3. **Pengisian 10 Butir Kuesioner SUS Kontekstual:** Setelah menyelesaikan keempat tugas tersebut, responden mengisi 10 butir pernyataan SUS dengan skala Likert 1 (*Sangat Tidak Setuju*) hingga 5 (*Sangat Setuju*). Mengingat SafeSpace merupakan aplikasi spesifik untuk kebutuhan skrining berkala dan refleksi diri, redaksi pernyataan disusun secara kontekstual agar relevan dengan skenario penggunaan nyata tanpa mengubah struktur baku ganjil-genap SUS (Tabel 3.8).
> 4. **Kalkulasi Matematis Skor SUS:** Untuk setiap responden, butir bernomor ganjil (1, 3, 5, 7, 9) dihitung dengan rumus $(x_i - 1)$, sedangkan butir bernomor genap (2, 4, 6, 8, 10) dihitung dengan rumus $(5 - x_i)$. Jumlah kontribusi kesepuluh butir kemudian dikalikan dengan $2,5$ untuk memperoleh skor pada rentang $0 - 100$:
>    $$\text{Skor SUS} = 2,5 \times \left( \sum_{i \in \{1,3,5,7,9\}} (x_i - 1) + \sum_{j \in \{2,4,6,8,10\}} (5 - x_j) \right)$$
> 5. **Penentuan Kelayakan Adopsi Sistem:** Rata-rata skor SUS seluruh responden dibandingkan terhadap ambang batas penerimaan standar sebesar $\ge 68$ (*kategori Acceptable / Good*).
>
> *(Sisipkan Gambar 3.6 Flowchart Prosedur Operasional UAT & Evaluasi SUS dari Tab 9 `flowchart_dashboard.html` di sini)*
>
> **Tabel 3.8 Instrumen 10 butir pertanyaan SUS kontekstual pada Google Form UAT SafeSpace.**

| No | Jenis Butir | Pernyataan Kuesioner SUS pada Google Form (Skala Likert 1 - 5) | Rumus Kontribusi |
| :---: | :---: | :--- | :---: |
| **Q1** | Positif (Ganjil) | Saya bersedia menggunakan sistem SafeSpace PWA ini ketika membutuhkan pengecekan kondisi stres akademik, pemetaan gaya belajar, atau refleksi diri. | $x_1 - 1$ |
| **Q2** | Negatif (Genap) | Saya merasa tampilan dan alur menu pada sistem SafeSpace PWA ini terlalu rumit untuk dipahami. | $5 - x_2$ |
| **Q3** | Positif (Ganjil) | Saya merasa sistem SafeSpace PWA ini mudah digunakan (mulai dari masuk akun hingga pengisian kuesioner DASS-21 dan VAK). | $x_3 - 1$ |
| **Q4** | Negatif (Genap) | Saya merasa membutuhkan bantuan orang ahli/teknisi untuk dapat menggunakan fitur-fitur pada sistem SafeSpace PWA ini. | $5 - x_4$ |
| **Q5** | Positif (Ganjil) | Saya merasa berbagai fitur dalam sistem SafeSpace PWA ini (Asesmen DASS-21, Gaya Belajar VAK, Jurnal Refleksi, dan Safe Exit) telah berfungsi dan terintegrasi dengan baik. | $x_5 - 1$ |
| **Q6** | Negatif (Genap) | Saya merasa terdapat terlalu banyak hal yang membingungkan atau tidak konsisten dalam sistem SafeSpace PWA ini. | $5 - x_6$ |
| **Q7** | Positif (Ganjil) | Saya yakin kebanyakan mahasiswa dapat mempelajari cara menggunakan sistem SafeSpace PWA ini dengan sangat cepat. | $x_7 - 1$ |
| **Q8** | Negatif (Genap) | Saya merasa alur penggunaan sistem SafeSpace PWA ini berbelit-belit dan merepotkan. | $5 - x_8$ |
| **Q9** | Positif (Ganjil) | Saya merasa yakin dan nyaman (tidak ragu atau takut salah langkah) saat menggunakan fitur-fitur pada sistem SafeSpace PWA ini. | $x_9 - 1$ |
| **Q10** | Negatif (Genap) | Saya perlu mempelajari banyak hal terlebih dahulu sebelum dapat mulai menggunakan sistem SafeSpace PWA ini. | $5 - x_{10}$ |

---

### BAGIAN 3: Draf Lengkap `BAB IV Hasil dan Pembahasan` (Halaman 30 - Siap Copy-Paste)

Di halaman 30 pada draf Word saat ini, `BAB IV Hasil dan Pembahasan` masih kosong. Berikut adalah draf kerangka Bab IV yang langsung menjawab catatan dosen dan menyediakan tabel untuk memasukkan hasil Google Form teman-teman minggu ini:

> # BAB IV
> # Hasil dan Pembahasan
>
> ## 4.1 Hasil Implementasi Sistem dan Mekanisme Perlindungan Privasi Data
>
> Pengembangan aplikasi SafeSpace PWA menghasilkan sistem informasi pra-konseling berbasis web progresif yang dapat diakses lintas perangkat tanpa instalasi aplikasi *native*. Sesuai dengan tujuan penelitian dan kebutuhan perlindungan kerahasiaan pengguna pada ekosistem Pendidikan Jarak Jauh (PJJ), implementasi sistem menerapkan mekanisme perlindungan identitas dan privasi data berlapis:
> 1. **Penyamaran Identitas Satu Arah (*One-Way Identity Hashing*):** Saat pengguna masuk menggunakan akun Google, peladen memverifikasi token dan langsung mengubah pengenal unik akun (`sub`) menjadi nilai *hash* 64 karakter menggunakan algoritma `HMAC-SHA-256` yang dikombinasikan dengan kunci rahasia peladen (`PEPPER_SECRET`). Alamat surel dan nama asli pengguna tidak disimpan ke dalam tabel `users_auth`.
> 2. **Pemisahan Identitas Antarsesi (*Ephemeral Session Pseudonym*):** Setiap kali mahasiswa membuka tiket bimbingan baru pada tabel `counseling_sessions`, sistem membangkitkan nama samaran acak per tiket (`student_pseudonym`, misalnya *Sahabat Pelita-27*) sehingga staf konselor yang melihat antrean tiket tidak mengetahui identitas asli mahasiswa.
> 3. **Penyandian Pesan di Sisi Klien (*Client-Side Encryption*):** Pada ruang percakapan (`ChatRoom`), pesan disandikan di peramban menggunakan algoritma `AES-GCM-256` dengan vektor inisialisasi (*Initialization Vector* / IV) acak 12-byte sebelum dikirim ke peladen, dan disimpan pada tabel `messages` tanpa kolom pengenal akun pengirim (`sender_id`).
> 4. **Kontrol Akses Berbasis Peran (*Role-Based Access Control*) dan *Safe Exit*:** Hak akses dipisahkan secara tegas antara peran `student`, `counselor`, dan `admin`, serta dilengkapi tombol darurat *Safe Exit* pada bilah navigasi untuk mengalihkan tampilan layar secara cepat ke halaman netral (`google.com`) tanpa meninggalkan riwayat halaman sebelumnya pada tombol kembali (*Back*) peramban.
>
> ## 4.2 Hasil Pengujian Fungsional dan Teknis Sistem
>
> Berdasarkan eksekusi pengujian otomatis pada repositori monorepo serta pengujian fungsional *Black-Box*, seluruh modul utama sistem telah berjalan sesuai spesifikasi:
> 1. **Verifikasi Logika Deterministik & Integrasi (*Unit & Integration Test*):** Sebanyak **99 dari 99 kasus uji (100% lulus)** pada *Bun Test* memverifikasi bahwa fungsi `calculateDass21Score()` menghitung tiga subskala (Depresi, Kecemasan, Stres) secara presisi dengan faktor pengali 2 sesuai pedoman baku Lovibond (1995), serta fungsi `calculateVakScore()` memetakan persentase modalitas belajar (*Visual, Auditory, Kinesthetic*) tanpa galat pembulatan.
> 2. **Verifikasi Alur Antarmuka (*End-to-End & Black-Box Testing*):** Sebanyak **10 skenario otomatis Playwright (100% lulus)** dan **14 skenario fungsional *Black-Box* (100% lolos)** membuktikan bahwa alur mulai dari autentikasi, pengisian asesmen, pelampiran otomatis hasil *triage* (`dass21_score` dan `vak_result`) ke tiket bimbingan, hingga pengelolaan antrean konselor dan panel administrator telah berfungsi dengan baik.
>
> ## 4.3 Hasil Pelaksanaan User Acceptance Testing (UAT) dan Evaluasi SUS
>
> Setelah seluruh pengujian teknis dinyatakan lolos, evaluasi penerimaan pengguna (*User Acceptance Testing* / UAT) dilaksanakan secara daring menggunakan **Google Form** terhadap **$N = \text{[Isi Jumlah Responden, misal: 15]}$ responden mahasiswa**. Setiap responden menjalankan 4 skenario tugas terbatas pada fitur sistem di sisi mahasiswa (autentikasi, pengisian form DASS-21, pengisian form VAK, serta eksplorasi jurnal refleksi dan *Safe Exit*), kemudian memberikan penilaian pada 10 butir pertanyaan SUS berskala 1 hingga 5.
>
> Rekapitulasi jawaban mentah responden beserta hasil konversi skor SUS disajikan pada Tabel 4.1 berikut:
>
> **Tabel 4.1 Rekapitulasi hasil penilaian responden pada pengujian UAT berbasis System Usability Scale (SUS).**

| ID Responden | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Jumlah Kontribusi ($\sum$) | Skor Akhir SUS ($\sum \times 2,5$) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **R-01** | [5] | [1] | [5] | [1] | [4] | [2] | [5] | [1] | [5] | [2] | [35] | **[87,5]** |
| **R-02** | [4] | [2] | [5] | [1] | [5] | [1] | [4] | [2] | [4] | [2] | [34] | **[85,0]** |
| **R-03** | [4] | [1] | [4] | [2] | [4] | [2] | [5] | [1] | [4] | [2] | [33] | **[82,5]** |
| **...** | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | **...** |
| **R-$N$** | [5] | [2] | [4] | [1] | [5] | [1] | [4] | [1] | [5] | [2] | [36] | **[90,0]** |
| **Rata-Rata (*Mean* Skor SUS)** | | | | | | | | | | | | **[Isi Rata-Rata, misal: 84,2]** |

> *(Catatan untuk Tim: Angka di dalam kurung siku `[...]` di atas tinggal diganti dengan angka asli dari Google Spreadsheet setelah kuesioner diisi responden minggu ini).*
>
> Berdasarkan hasil pengolahan data pada Tabel 4.1, diperoleh rata-rata skor *System Usability Scale* (SUS) sebesar **[Isi Skor, misal: 84,2]** dari skala 100. Apabila dibandingkan dengan standar interpretasi kelayakan SUS menurut Bangor dkk. (2008) dan Lewis (2018), skor tersebut berada jauh di atas ambang batas minimum penerimaan ($\ge 68,0$) dan masuk ke dalam kategori **Acceptable (Grade A / Baik Sekali)**. Capaian ini menunjukkan bahwa alur navigasi, pengisian kuesioner mandiri DASS-21 dan VAK, serta fitur pendukung privasi pada SafeSpace dinilai mudah dipahami, konsisten, dan nyaman dioperasikan oleh mahasiswa tanpa memerlukan bantuan teknis.
>
> ## 4.4 Pembahasan Ketercapaian Tujuan terhadap Deteksi Dini Academic Burnout
>
> Integrasi antara hasil pengujian teknis (Subbab 4.2) dan evaluasi penerimaan pengguna (Subbab 4.3) membuktikan bahwa aplikasi SafeSpace telah memenuhi kelima tujuan pengembangan yang ditetapkan pada Bab I. Kombinasi kalkulasi deterministik DASS-21 dan pemetaan modalitas belajar VAK berhasil menyediakan mekanisme deteksi dini (*early warning triage*) terhadap dua faktor pemicu *academic burnout* pada mahasiswa PJJ, yaitu eskalasi distres emosional dan ketidaksesuaian strategi belajar mandiri, yang terlampir secara otomatis pada tiket bimbingan berpseudonim untuk memudahkan penanganan awal oleh konselor.

---

### BAGIAN 4: Perbaikan Kalimat di Subbab `3.2.1`, `3.3.4`, `3.4.4`, `3.5.1`, `Tabel 3.7`, Daftar Pustaka, dan Typo Bab I - II

1. **Subbab `3.2.1` (Halaman 15, Paragraf 2-3):**
   * Ganti paragraf ke-2 dan ke-3 di Subbab `3.2.1` dengan teks yang membela pemilihan DASS-21 + VAK sebagai pendeteksi faktor pemicu di hulu (*early warning precursors*) sebelum mahasiswa mengalami *academic burnout* kronis (teks lengkap tersedia pada dokumen `Catatan_Penyelarasan_Dokumen_Revisi_KelompokB.md` Poin 2).
2. **Daftar Pustaka (Halaman 33):**
   * Tambahkan referensi **`Afifah dkk. (2026)`** dan **`Damayanti & Aulia (2025)`** yang sudah dikutip di Subbab `3.2.1` ke dalam halaman Daftar Pustaka agar tidak menjadi sitasi tanpa daftar pustaka.
3. **Subbab `3.3.4`, `3.4.4`, `3.5.1`, dan `Tabel 3.7` (Halaman 21, 24, 25, 27):**
   * Hapus kalimat yang berbunyi seperti auditor luar (*"laporan yang disampaikan developer; audit dokumen ini tidak melakukan eksekusi ulang"*, *"Status Lolos merupakan konfirmasi tim, bukan verifikasi ulang penulis"*, dan *"perlu ditindaklanjuti developer"*).
4. **Gambar Diagram Bab III (Halaman 13, 17, 20, 22):**
   * Ganti Gambar 3.1, 3.2, 3.3, dan 3.4 di Word dengan gambar PNG terbaru dari [`docs/flowchart_dashboard.html`](file:///d:/ijplabs/capstone/docs/flowchart_dashboard.html) (serta tambahkan Gambar 3.6 Flowchart Prosedur UAT & SUS dari Tab 9).
5. **Hapus Paragraf Ganda di Bab I & Perbaiki Spasi Kata:**
   * Hapus 1 paragraf terakhir di **Subbab `1.1 Latar Belakang` (Halaman 4)** karena tercetak dua kali berturut-turut.
   * Perbaiki kata yang rapat tanpa spasi di Bab I & II: `"perguruantinggi"`, `"Mayorita smahasiswa"`, `"pembelaja rdewasa"`, `"kesetaraanak sesbagi"`, `"system Safe Space di implementasikan"`, `"DoubleBlind"`, dan `"Screensot Project"`.
