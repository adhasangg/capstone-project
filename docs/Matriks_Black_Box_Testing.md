# Matriks Pengujian Fungsional (Black-Box Testing)

**Sistem:** SafeSpace PWA  -  Sistem Informasi Pra-Konseling Anonim dan Pemetaan Potensi Diri untuk Deteksi Dini Academic Burnout pada Ekosistem Pendidikan Jarak Jauh  
**Studi Kasus:** Universitas Terbuka (UT)  
**Mata Kuliah:** STSI4401 Capstone Project (2026)  
**Metodologi Pengujian:** *Black-Box Testing* (*Boundary Value Analysis* & *Equivalence Partitioning*)  

---

## 1. Pendahuluan & Ruang Lingkup Pengujian

Pengujian kotak hitam (*Black-Box Testing*) bertujuan untuk memverifikasi fungsionalitas perangkat lunak tanpa memeriksa struktur kode internal secara langsung, melainkan berfokus pada kesesuaian antara masukan (*input*), proses fungsional, dan luaran (*expected output*) sistem sesuai spesifikasi kebutuhan perangkat lunak (Pressman & Maxim, 2020).

Ruang lingkup pengujian mencakup 6 domain utama:
1. **Autentikasi & Sanitasi Identitas Kriptografis (Zero-Knowledge)**
2. **Instrumen Baku Pemetaan Emosional DASS-21**
3. **Instrumen Pemetaan Modalitas Belajar VAK**
4. **Modul Refleksi Curhat Empatik (Mood Tracker)**
5. **Manajemen Tiket Pra-Konseling & Pertahanan Lapis Ganda (RBAC 403)**
6. **Keamanan Enkripsi End-to-End (E2EE AES-GCM-256) & Fitur Trauma-Informed PWA**

---

## 2. Tabel Matriks Pengujian Fungsional

| Kode Uji | Modul / Fitur | Skenario Pengujian | Masukan (Input / Aksi) | Luaran yang Diharapkan (Expected Result) | Hasil Riil (Actual Result) | Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TB-01** | Autentikasi Google | Mahasiswa login menggunakan email kampus domain valid (`@ecampus.ut.ac.id`). | Payload Google ID Token dengan klaim email `mahasiswa@ecampus.ut.ac.id`. | Sistem memverifikasi token, men-hash Google Sub secara satu arah (`SHA-256`), membuang email/nama dari memori, dan menerbitkan JWT berisi `pseudonym` (contoh: `Mahasiswa #4829`). HTTP 200. | Token diterima, profil asli dibuang, JWT terbit dengan pseudonym acak. | **PASSED** |
| **TB-02** | Autentikasi Domain | Pengguna login menggunakan domain di luar whitelist instansi. | Payload ID Token dengan domain email umum (`pengguna@gmail.com`) saat whitelist dibatasi kampus. | Sistem menolak autentikasi dengan pesan kesalahan validasi domain. HTTP 403 / 400. | Akses ditolak, sesi tidak diterbitkan. | **PASSED** |
| **TB-03** | Sanitasi Token Palsu | Permintaan login dengan ID Token kedaluwarsa atau string acak. | Payload `{ idToken: "invalid_dummy_token" }` ke endpoint `/api/auth/google`. | Sistem menolak token dan mengembalikan respons kesalahan tanpa mengeksekusi hash identitas. HTTP 400. | Ditolak dengan pesan kesalahan verifikasi token. | **PASSED** |
| **TB-04** | DASS-21 Matematis | Pengisian 21 butir instrumen baku Lovibond & Lovibond. | Array 21 angka bulat skala 0â€“3: `[0, 1, 2, 0, 1, 3, ...]` ke `/api/assessment/dass21`. | Sistem menghitung total skor per subskala (Depresi, Kecemasan, Stres), mengalikannya dengan 2, mengklasifikasikan ke kategori baku (*Normal, Mild, Moderate, Severe, Extremely Severe*), dan menentukan level risiko burnout. HTTP 200. | Skor terhitung deterministik matematis murni tanpa halusinasi AI; kategori akurat sesuai norma Lovibond. | **PASSED** |
| **TB-05** | DASS-21 Boundary | Validasi jumlah butir kurang dari 21 atau nilai skor di luar batas 0â€“3. | Array 20 butir atau array berisi angka 4 / -1. | Sistem mendeteksi anomali panjang/nilai, menolak proses kalkulasi, dan mengembalikan pesan validasi Zod. HTTP 400. | Input ditolak oleh skema validasi; tidak ada kalkulasi yang dieksekusi. | **PASSED** |
| **TB-06** | Pemetaan Gaya VAK | Pengisian 12 butir skenario belajar adaptif (Format Dinamis). | Array 12 modalitas `['visual', 'auditory', 'kinesthetic', ...]` ke `/api/assessment/vak`. | Sistem menghitung frekuensi dan persentase tiap modalitas, menentukan gaya dominan (*Visual/Auditori/Kinestetik/Multimodal*), dan memberikan rekomendasi belajar Tuton UT. HTTP 200. | Persentase terhitung tepat, dominansi akurat, tips LMS muncul sesuai modalitas. | **PASSED** |
| **TB-07** | Mood Tracker Empati | Pengiriman narasi curhat dengan sentimen tekanan tinggi. | Narasi teks: *"Saya merasa sangat lelah bekerja lembur sambil mengejar deadline tugas tuton"*. | Sistem mendeteksi sentimen distres, memberikan respon empati yang menenangkan, dan menampilkan rekomendasi pembukaan tiket pra-konseling. HTTP 200. | Respon empati menenangkan muncul; tombol buka tiket pra-konseling terpicu. | **PASSED** |
| **TB-08** | Pertahanan RBAC Lapis Ganda | Mahasiswa mencoba mengakses antrean tiket konselor secara ilegal. | Permintaan `GET /api/sessions/queue` dengan Bearer JWT ber-role `student`. | Middleware RBAC memblokir permintaan secara ketat dan mengembalikan status HTTP 403 Forbidden. | Permintaan diblokir seketika dengan HTTP 403; data antrean konselor tidak bocor. | **PASSED** |
| **TB-09** | Tiket Terlampir (Attached Profile) | Mahasiswa membuka tiket pra-konseling dengan melampirkan hasil DASS-21 & VAK. | Permintaan `POST /api/sessions/create` dengan payload `dass21Score` dan `vakResult`. | Tiket tersimpan dengan status `waiting`. Data DASS-21 dan VAK tersimpan dalam format JSONB pada tiket konseling tanpa JOIN ke tabel `users_auth`. HTTP 201. | Tiket berhasil dibuat dengan profil terlampir; identitas asli tetap terisolasi. | **PASSED** |
| **TB-10** | Enkripsi E2EE Pengirim | Pengiriman pesan chat dari klien mahasiswa ke konselor. | Klien mengenkripsi plaintext *"Saya butuh bantuan"* dengan AES-GCM-256 via Web Crypto API, lalu mengirim ciphertext base64 & IV ke `/api/chat/:sessionId/send`. | Server menerima dan menyimpan hanya string ciphertext base64 acak dan IV ke kolom `messages.encrypted_content`. Teks asli tidak pernah diterima server. HTTP 201. | Inspeksi log & SQL membuktikan server hanya menerima dan menyimpan ciphertext terenkripsi. | **PASSED** |
| **TB-11** | Dekripsi E2EE Penerima | Konselor membuka ruang chatroom dan memuat riwayat percakapan. | Permintaan `GET /api/chat/:sessionId/messages`, kemudian klien konselor mendekripsi ciphertext menggunakan kunci sesi lokal. | Ciphertext berhasil didekripsi di browser konselor menjadi teks terbaca. | Teks percakapan tampil utuh di antarmuka konselor dengan tanda enkripsi aktif. | **PASSED** |
| **TB-12** | Trauma-Informed Safe Exit | Pengguna menekan tombol darurat "Safe Exit" saat privasi fisik terganggu. | Klik tombol `Safe Exit` di pojok kanan atas antarmuka PWA. | Peramban seketika mengalihkan halaman (*hard redirect*) ke URL netral (`https://www.google.com`) tanpa menyimpan riwayat formulir di tampilan. | Halaman langsung teralihkan ke Google dalam < 100ms. | **PASSED** |
| **TB-13** | Audit PWA & Service Worker | Membuka aplikasi secara berulang / saat jaringan terputus (*offline cache*). | PWA dimuat di peramban seluler/desktop, registrasi `sw.js` dan inspeksi `manifest.webmanifest`. | Service Worker terpasang aktif (`generateSW`), aset statis tersimpan di *Cache Storage Workbox*, dan tombol instalasi PWA muncul. | Service worker `sw.js` terdaftar sukses, manifest valid dengan tema `#4A7C59`. | **PASSED** |

---

## 3. Kesimpulan Hasil Pengujian Kotak Hitam

Seluruh 13 skenario pengujian fungsional (*test cases*) berstatus **100% PASSED** (Lolos Uji).
Sistem membuktikan bahwa:
1. Algoritma matematis DASS-21 dan VAK bekerja secara deterministik tanpa deviasi logika.
2. Arsitektur *Zero-Knowledge* dan *Two-Way Anonymity* terlindungi secara struktural dari level API, middleware RBAC, hingga penyimpanan database PostgreSQL.
3. Enkripsi *End-to-End* (E2EE) menggunakan Web Crypto API berhasil melindungi kerahasiaan isi curhatan mahasiswa dari akses pihak ketiga maupun administrator peladen.
