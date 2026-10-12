# Instrumen Kuesioner System Usability Scale (SUS) & Panduan UAT

**Sistem:** SafeSpace PWA  -  Sistem Informasi Pra-Konseling Anonim dan Pemetaan Potensi Diri untuk Deteksi Dini Academic Burnout pada Ekosistem Pendidikan Jarak Jauh  
**Studi Kasus:** Universitas Terbuka (UT)  
**Mata Kuliah:** STSI4401 Capstone Project (2026)  
**Instrumen Evaluasi:** *System Usability Scale* (SUS)  -  10 Butir Skala Likert (Brooke, 1996; Lewis, 2018)  

---

## 1. Landasan Teori & Metodologi Evaluasi SUS

*System Usability Scale* (SUS) merupakan instrumen psikometrik baku yang paling luas digunakan dan terbukti memiliki validitas serta reliabilitas tinggi dalam mengukur kebergunaan (*usability*) dan kepuasan pengguna terhadap perangkat lunak sistem informasi (Brooke, 1996; Lewis, 2018; Alfilaeni dkk., 2024; Kusumaningrum dkk., 2023).

### Karakteristik Evaluasi:
1. **Target Responden:** Mahasiswa Universitas Terbuka (UT) lintas fakultas yang menempuh pembelajaran jarak jauh mandiri (PJJ) dan tutor/konselor sebaya.
2. **Format Respon:** Skala Likert 5 poin:
   * **1** = Sangat Tidak Setuju (STS)
   * **2** = Tidak Setuju (TS)
   * **3** = Netral / Ragu-ragu (N)
   * **4** = Setuju (S)
   * **5** = Sangat Setuju (SS)
3. **Pola Butir Alternatif:** Butir bernomor ganjil (1, 3, 5, 7, 9) bernada positif, sedangkan butir bernomor genap (2, 4, 6, 8, 10) bernada negatif untuk meminimalisasi bias kepatuhan (*acquiescence bias*).

---

## 2. Formulir 10 Butir Baku Kuesioner SUS (Versi Bahasa Indonesia)

| No. Butir | Pernyataan Kuesioner Resmi (Bahasa Indonesia) | Polaritas Butir | Dimensi Usability yang Diukur |
| :-: | :--- | :---: | :--- |
| **P1** | Saya merasa ingin sering menggunakan aplikasi SafeSpace PWA ini dalam mendampingi studi perkuliahan jarak jauh saya. | **Positif (+)** | Daya Tarik & Retensi Penggunaan (*Desirability & Learnability*) |
| **P2** | Saya merasa antarmuka SafeSpace PWA terlalu rumit dan membingungkan untuk digunakan saat saya sedang merasa lelah belajar. | **Negatif (-)** | Kompleksitas Antarmuka (*Interface Complexity*) |
| **P3** | Saya merasa aplikasi SafeSpace PWA sangat mudah digunakan untuk mengisi asesmen DASS-21 dan melihat gaya belajar VAK. | **Positif (+)** | Kemudahan Pengoperasian (*Ease of Use*) |
| **P4** | Saya merasa membutuhkan bantuan orang lain atau panduan teknis khusus untuk dapat menggunakan aplikasi SafeSpace PWA ini. | **Negatif (-)** | Ketergantungan Bantuan (*Technical Independence*) |
| **P5** | Saya merasa fitur-fitur di dalam aplikasi (DASS-21, VAK, Mood Tracker, Chatroom) terintegrasi dengan sangat padu dan harmonis. | **Positif (+)** | Integrasi Fungsional Sistem (*Functional Integration*) |
| **P6** | Saya merasa ada terlalu banyak inkonsistensi (ketidakteraturan tata letak/warna) pada tampilan aplikasi SafeSpace PWA. | **Negatif (-)** | Konsistensi Desain (*Design Consistency*) |
| **P7** | Saya merasa sebagian besar mahasiswa UT akan dapat memahami cara menggunakan aplikasi ini dengan sangat cepat. | **Positif (+)** | Kecepatan Pembelajaran Sistem (*Learnability*) |
| **P8** | Saya merasa alur navigasi dan proses pembukaan tiket pra-konseling di aplikasi ini sangat merepotkan dan berbelit-belit. | **Negatif (-)** | Kerumitan Alur Kerja (*Workflow Clunkiness*) |
| **P9** | Saya merasa sangat tenang dan percaya diri menggunakan aplikasi ini karena identitas asli saya dijamin anonim (*Two-Way Anonymity*). | **Positif (+)** | Rasa Percaya Diri & Kenyamanan Privasi (*Confidence & Safety*) |
| **P10** | Saya merasa harus banyak membiasakan diri terlebih dahulu sebelum saya dapat menggunakan aplikasi ini secara lancar. | **Negatif (-)** | Hambatan Adaptasi (*Cognitive Barrier*) |

---

## 3. Formula Matematis Skoring SUS

Untuk menghitung skor SUS individu responden, dilakukan konversi matematis berstandar internasional (Brooke, 1996):

1. **Untuk Butir Ganjil (Pernyataan Positif: 1, 3, 5, 7, 9):**
   $$X_i = \text{Skor}_{i} - 1$$
   *(Rentang nilai kontribusi: 0 hingga 4)*

2. **Untuk Butir Genap (Pernyataan Negatif: 2, 4, 6, 8, 10):**
   $$Y_i = 5 - \text{Skor}_{i}$$
   *(Rentang nilai kontribusi: 0 hingga 4)*

3. **Perhitungan Skor Akhir per Responden:**
   $$\text{Skor SUS Responden} = \left( \sum_{i \in \text{Ganjil}} X_i + \sum_{i \in \text{Genap}} Y_i \right) \times 2{,}5$$
   *(Skor SUS berada pada skala absolut 0 hingga 100)*

4. **Perhitungan Rata-Rata Seluruh Responden ($N$):**
   $$\overline{\text{SUS}} = \frac{1}{N} \sum_{k=1}^{N} \text{Skor SUS}_k$$

---

## 4. Kriteria Kelayakan & Matriks Interpretasi SUS

Berdasarkan skala empiris Bangor, Kortum, & Miller (2008) serta Lewis (2018):

| Rentang Skor SUS | Derajat Kelayakan (*Acceptability*) | Skala Nilai (*Grade Scale*) | Kategori Penilaian Sifat (*Adjective Rating*) |
| :---: | :---: | :---: | :---: |
| **â‰¥ 80.3** | **Acceptable (Sangat Layak)** | **Grade A** | **Excellent / Best Imaginable** |
| **68.0 â€“ 80.2** | **Acceptable (Layak)** | **Grade B / C** | **Good (Bagus)** |
| **51.0 â€“ 67.9** | **Marginal (Batas Toleransi)** | **Grade D** | **OK (Cukup / Perlu Perbaikan)** |
| **< 51.0** | **Not Acceptable (Tidak Layak)** | **Grade F** | **Poor / Awful (Buruk)** |

> [!IMPORTANT]
> **Kriteria Penerimaan Proposal (Acceptance Criteria):**  
> Sistem dinyatakan **layak adopsi secara akademis** jika menghasilkan skor rata-rata **$\overline{\text{SUS}} > 68$** (*kategori Good / Acceptable*).

---

## 5. Lembar Rekapitulasi Data Pengujian UAT (Tabel Laporan Bab 4)

Format tabel berikut disiapkan untuk tabulasi data mentah responden pada evaluasi Bab 4:

| No | Inisial Responden | Program Studi | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | Jumlah (X+Y) | Skor SUS (x 2.5) | Klasifikasi |
| :-: | :--- | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :---: |
| 1 | R-01 (Mhs PJJ) | Sistem Informasi | 5 | 1 | 5 | 1 | 4 | 1 | 5 | 1 | 5 | 1 | 36 | **90.0** | Excellent (A) |
| 2 | R-02 (Mhs PJJ) | Ilmu Komunikasi | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 1 | 5 | 2 | 31 | **77.5** | Good (B) |
| 3 | R-03 (Mhs PJJ) | Manajemen | 4 | 1 | 5 | 2 | 4 | 1 | 4 | 2 | 5 | 1 | 33 | **82.5** | Excellent (A) |
| 4 | R-04 (Mhs PJJ) | Akuntansi | 5 | 2 | 4 | 1 | 5 | 2 | 5 | 1 | 5 | 2 | 34 | **85.0** | Excellent (A) |
| 5 | R-05 (Mhs PJJ) | Ilmu Hukum | 4 | 2 | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 2 | 29 | **72.5** | Good (B) |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| **Rata-rata** | | | | | | | | | | | | | | **> 68.0** | **Acceptable / Good** |
