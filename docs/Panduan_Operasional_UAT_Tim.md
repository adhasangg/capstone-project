# PANDUAN OPERASIONAL TIM: UJI COBA PENGGUNA (UAT) BERBASIS SUS

Dokumen ini ditujukan untuk anggota tim yang bertugas membuat Google Form, mengumpulkan data responden, dan menghitung skor kelayakan sistem **SafeSpace PWA** menggunakan metode baku **System Usability Scale (SUS)**.

Telah disediakan berkas lembar kerja spreadsheet Excel otomatis:  
📁 [**UAT_SUS_Kalkulator_Otomatis.xlsx**](file:///d:/ijplabs/capstone/docs/UAT_SUS_Kalkulator_Otomatis.xlsx)

---

## 1. Ringkasan Singkat (Apa yang Perlu Dilakukan?)

Tugas rekan tim sangat sederhana dan terdiri dari 3 tahapan:
1. **Buat Google Form** menggunakan teks 10 pertanyaan yang sudah disiapkan di bawah.
2. **Sebarkan ke 20 - 30 rekan mahasiswa Universitas Terbuka (UT)** setelah mereka mencoba membuka aplikasi SafeSpace PWA.
3. **Salin nilai respon ke berkas Excel `UAT_SUS_Kalkulator_Otomatis.xlsx`** (rumus di Excel akan menghitung total skor dan rata-rata secara otomatis).

---

## 2. Draf Teks Siap Salin untuk Google Form

### A. Judul & Deskripsi Formulir
- **Judul Formulir:**  
  *Kuesioner Uji Kelaikan Pengguna (UAT) SafeSpace PWA - Universitas Terbuka*
- **Deskripsi Formulir:**  
  *Halo rekan-rekan mahasiswa Universitas Terbuka! Kami mengundang Anda untuk memberikan umpan balik terhadap prototipe aplikasi SafeSpace PWA (Sistem Informasi Pra-Konseling Anonim & Pemetaan Potensi Diri Mahasiswa PJJ). Mohon coba fitur asesmen DASS-21, VAK, dan curhat terlebih dahulu, kemudian berikan penilaian jujur pada 10 pernyataan di bawah ini. Pengisian hanya membutuhkan waktu sekitar 2-3 menit. Terima kasih atas partisipasi Anda!*

### B. Bagian 1: Data Responden (Singkat)
1. **Inisial / Nama Panggilan:** (Jawaban Singkat - Wajib)
2. **Program Studi / Fakultas di UT:** (Pilihan Ganda / Dropdown / Jawaban Singkat - Wajib)
3. **Semester / Angkatan:** (Jawaban Singkat - Opsional)

### C. Bagian 2: 10 Pertanyaan Baku SUS
*Petunjuk untuk Google Form: Gunakan tipe soal **Skala Linier** dari rentang **1** (Sangat Tidak Setuju) hingga **5** (Sangat Setuju) untuk setiap pertanyaan di bawah ini.*

1. **Pertanyaan 1 (Positif):**  
   *Saya berpikir akan sering menggunakan sistem SafeSpace PWA ini.*  
   (Skala 1: Sangat Tidak Setuju | Skala 5: Sangat Setuju)

2. **Pertanyaan 2 (Negatif):**  
   *Saya merasa sistem ini terlalu rumit, padahal dapat dibuat lebih sederhana.*  
   (Skala 1: Sangat Tidak Setuju | Skala 5: Sangat Setuju)

3. **Pertanyaan 3 (Positif):**  
   *Saya merasa sistem ini sangat mudah untuk digunakan.*  
   (Skala 1: Sangat Tidak Setuju | Skala 5: Sangat Setuju)

4. **Pertanyaan 4 (Negatif):**  
   *Saya merasa membutuhkan bantuan orang lain untuk dapat menggunakan sistem ini.*  
   (Skala 1: Sangat Tidak Setuju | Skala 5: Sangat Setuju)

5. **Pertanyaan 5 (Positif):**  
   *Saya merasa fitur-fitur dalam sistem ini terintegrasi dengan sangat baik.*  
   (Skala 1: Sangat Tidak Setuju | Skala 5: Sangat Setuju)

6. **Pertanyaan 6 (Negatif):**  
   *Saya merasa sistem ini terlalu banyak hal yang tidak konsisten.*  
   (Skala 1: Sangat Tidak Setuju | Skala 5: Sangat Setuju)

7. **Pertanyaan 7 (Positif):**  
   *Saya merasa orang lain akan dapat mempelajari sistem ini dengan sangat cepat.*  
   (Skala 1: Sangat Tidak Setuju | Skala 5: Sangat Setuju)

8. **Pertanyaan 8 (Negatif):**  
   *Saya merasa sistem ini membingungkan dan membuat canggung saat digunakan.*  
   (Skala 1: Sangat Tidak Setuju | Skala 5: Sangat Setuju)

9. **Pertanyaan 9 (Positif):**  
   *Saya merasa sangat percaya diri dan aman (privat) saat menggunakan sistem ini.*  
   (Skala 1: Sangat Tidak Setuju | Skala 5: Sangat Setuju)

10. **Pertanyaan 10 (Negatif):**  
    *Saya harus mempelajari banyak hal terlebih dahulu sebelum dapat menggunakan sistem ini.*  
    (Skala 1: Sangat Tidak Setuju | Skala 5: Sangat Setuju)

---

## 3. Cara Pengolahan Nilai Menggunakan Berkas Excel

1. Buka berkas [**`UAT_SUS_Kalkulator_Otomatis.xlsx`**](file:///d:/ijplabs/capstone/docs/UAT_SUS_Kalkulator_Otomatis.xlsx) di Microsoft Excel atau Google Sheets.
2. Buka sheet kedua yang berjudul **"Kalkulator Skor SUS"**.
3. Masukkan inisial responden dan angka jawaban kuesioner (angka 1 sampai 5) ke kolom **Q1** sampai **Q10**.
4. Rumus di Excel akan otomatis:
   - Menghitung kontribusi tiap soal ganjil `(X - 1)` dan genap `(5 - X)`.
   - Mengalikan total kontribusi dengan faktor pengali `2,5`.
   - Menampilkan skor akhir responden (rentang 0 - 100).
   - Menampilkan kategori kelayakan (*Excellent / Good / Marginal*).
   - Menghitung nilai rata-rata (*average*) pada baris paling bawah.

---

## 4. Standar Penilaian untuk Laporan Akhir

| Rentang Skor SUS | Predikat Kelayakan | Keterangan untuk Laporan |
| :---: | :---: | :--- |
| **> 80,3** | **Grade A (Excellent)** | Sistem sangat unggul, sangat mudah digunakan, dan sangat direkomendasikan. |
| **68,0 - 80,3** | **Grade B / C (Good / Acceptable)** | Sistem memenuhi standar industri dan dapat diterima dengan baik oleh pengguna. |
| **< 68,0** | **Marginal / Below Average** | Perlu perbaikan antarmuka atau alur penggunaan. |

> **Target Capstone Kita:** Rata-rata skor SUS **di atas 75,0** (Kategori *Good* hingga *Excellent*).

---

## 5. Draf Kalimat Siap Pakai untuk Rekan Tim Penulis Laporan / Slide

Setelah angka rata-rata di Excel didapatkan, rekan tim cukup menyalin teks kesimpulan berikut:

> *"Berdasarkan hasil pengujian User Acceptance Testing (UAT) menggunakan instrumen System Usability Scale (SUS) kepada **[Isi Jumlah: misal 25]** responden mahasiswa Universitas Terbuka, SafeSpace PWA memperoleh skor rata-rata SUS sebesar **[Isi Skor: misal 78,5]** dari skala 100. Hasil ini menempatkan aplikasi pada predikat **[Good / Grade B]** dengan kategori Acceptable, yang membuktikan bahwa antarmuka SafeSpace PWA ramah pengguna, mudah dipelajari secara mandiri, dan fitur privasi anonimitasnya memberikan rasa aman bagi mahasiswa PJJ."*
