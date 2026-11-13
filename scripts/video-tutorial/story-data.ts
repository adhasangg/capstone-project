export interface NarrationSegment {
  id: string;
  role: 'narrator_student' | 'narrator_counselor' | 'system';
  voice: 'id-ID-GadisNeural' | 'id-ID-ArdiNeural';
  text: string;
  approxDurationSec: number;
}

export const DASS21_RESPONSES = [
  // 21 butir DASS-21 (0: Tidak Pernah, 1: Kadang, 2: Sering, 3: Sangat Sering)
  // Indeks 0: Q1 (S) -> 2
  2,
  // Indeks 1: Q2 (A) -> 1
  1,
  // Indeks 2: Q3 (D) -> 1
  1,
  // Indeks 3: Q4 (A) -> 1
  1,
  // Indeks 4: Q5 (D) -> 2
  2,
  // Indeks 5: Q6 (S) -> 2
  2,
  // Indeks 6: Q7 (A) -> 1
  1,
  // Indeks 7: Q8 (S) -> 2
  2,
  // Indeks 8: Q9 (A) -> 1
  1,
  // Indeks 9: Q10 (D) -> 1
  1,
  // Indeks 10: Q11 (S) -> 2
  2,
  // Indeks 11: Q12 (S) -> 2
  2,
  // Indeks 12: Q13 (D) -> 1
  1,
  // Indeks 13: Q14 (S) -> 2
  2,
  // Indeks 14: Q15 (A) -> 1
  1,
  // Indeks 15: Q16 (D) -> 1
  1,
  // Indeks 16: Q17 (D) -> 1
  1,
  // Indeks 17: Q18 (S) -> 2
  2,
  // Indeks 18: Q19 (A) -> 1
  1,
  // Indeks 19: Q20 (A) -> 1
  1,
  // Indeks 20: Q21 (D) -> 1
  1,
];

// Target VAK: 7 Kinestetik, 3 Visual, 2 Auditori -> 58% Kinestetik
export const VAK_CHOICES: ('visual' | 'auditory' | 'kinesthetic')[] = [
  'kinesthetic', // Skenario 1
  'visual',      // Skenario 2
  'kinesthetic', // Skenario 3
  'auditory',    // Skenario 4
  'kinesthetic', // Skenario 5
  'kinesthetic', // Skenario 6
  'visual',      // Skenario 7
  'kinesthetic', // Skenario 8
  'auditory',    // Skenario 9
  'visual',      // Skenario 10
  'kinesthetic', // Skenario 11
  'kinesthetic', // Skenario 12
];

export const MOOD_JOURNAL_INPUT = {
  icebreaker: 'Saya merasa sangat lelah membagi waktu antara kerja lembur dan deadline tugas kuliah.',
  fullText: 'Saya merasa sangat lelah membagi waktu antara kerja lembur dan deadline tugas kuliah. Minggu ini pekerjaan kantor sedang tutup buku, sementara tugas tutorial harus selesai besok malam. Kepala rasanya penuh dan saya kewalahan membaca modul.',
};

export const CHAT_EXCHANGE = [
  {
    sender: 'counselor',
    text: 'Halo rekan Mahasiswa, saya Konselor Pendamping hari ini. Saya sudah melihat lampiran profilmu—kelihatan beban stresmu minggu ini sedang cukup berat (skor 28). Tarik napas pelan dulu ya, kamu aman di sini. Boleh ceritakan apa yang paling menguras energimu saat ini?',
  },
  {
    sender: 'student',
    pill: 'Kewalahan tugas',
    text: 'Saya merasa sangat tertekan dengan tugas kuliah. Kebetulan di kantor sedang lembur akhir bulan, pulang ke rumah sudah larut tapi masih harus membaca modul BMP yang tebal untuk tugas tutorial online. Rasanya buntu dan ingin menyerah saja.',
  },
  {
    sender: 'counselor',
    text: 'Terima kasih sudah jujur bercerita, wajar sekali tubuh dan pikiranmu protes setelah seharian bekerja lalu dipaksa langsung membaca teks panjang. Apalagi dari profil VAK-mu, gaya belajarmu dominan Kinestetik (58%)—otakmu memang cepat jenuh kalau hanya duduk diam membaca pasif di malam hari.',
  },
  {
    sender: 'student',
    pill: 'Rekomendasi ritme belajar',
    text: 'Bisakah konselor merekomendasikan ritme belajar yang tepat? Soalnya waktu luang saya di hari kerja benar-benar terbatas sebelum tidur.',
  },
  {
    sender: 'counselor',
    text: 'Tentu! Untuk malam ini, jangan paksa baca seluruh bab modul. Gunakan teknik Pomodoro Kinestetik 25 menit saja: langsung buka soal tugas, tulis poin-poin jawabannya dengan tangan di kertas sambil mencari kata kunci yang relevan di modul, lalu istirahat. Kita urai satu langkah kecil dulu ya, bagaimana menurutmu?',
  },
  {
    sender: 'student',
    pill: 'Terima kasih',
    text: 'Terima kasih banyak atas saran dan pendampingannya. Rasanya jauh lebih lega sekarang karena tahu harus mulai mencicil dari mana malam ini tanpa merasa bersalah.',
  },
];

export const NARRATION_SCRIPTS: NarrationSegment[] = [
  {
    id: 'scene_01_intro',
    role: 'narrator_student',
    voice: 'id-ID-GadisNeural',
    text: 'Selamat datang di video tutorial SafeSpace PWA, platform pra-konseling digital aman dan anonim bagi mahasiswa pendidikan jarak jauh.',
    approxDurationSec: 8,
  },
  {
    id: 'scene_02_login_student',
    role: 'narrator_student',
    voice: 'id-ID-GadisNeural',
    text: 'Pertama, masuk menggunakan akun Google Anda. Identitas Anda disanitasi secara kriptografis satu arah, sehingga tidak ada nama asli maupun email yang tersimpan.',
    approxDurationSec: 10,
  },
  {
    id: 'scene_03_dass21',
    role: 'narrator_student',
    voice: 'id-ID-GadisNeural',
    text: 'Pada menu Asesmen Mandiri, Anda dapat mengisi 21 butir instrumen baku DASS-21 untuk memetakan tingkat depresi, kecemasan, dan stres selama satu minggu terakhir.',
    approxDurationSec: 11,
  },
  {
    id: 'scene_04_dass21_result',
    role: 'narrator_student',
    voice: 'id-ID-GadisNeural',
    text: 'Hasil analisis langsung keluar seketika dengan kalkulasi matematis murni Lovibond. Hasil ini otomatis tersimpan di sesi Anda untuk dilampirkan ke konselor.',
    approxDurationSec: 10,
  },
  {
    id: 'scene_05_vak',
    role: 'narrator_student',
    voice: 'id-ID-GadisNeural',
    text: 'Lanjutkan ke kuesioner VAK untuk mengetahui modalitas belajar dominan Anda: apakah Visual, Auditori, atau Kinestetik, lengkap dengan tips belajar adaptif.',
    approxDurationSec: 10,
  },
  {
    id: 'scene_06_mood_ticket',
    role: 'narrator_student',
    voice: 'id-ID-GadisNeural',
    text: 'Anda juga dapat menuliskan curhat harian di Mood Tracker untuk mendapatkan respons empati, lalu membuka tiket pra-konseling secara instan dengan profil terlampir.',
    approxDurationSec: 11,
  },
  {
    id: 'scene_07_counselor_triage',
    role: 'narrator_counselor',
    voice: 'id-ID-ArdiNeural',
    text: 'Kini dari sudut pandang konselor: staf konselor membuka menu Antrean Triage untuk melihat daftar tiket mahasiswa yang disusun berdasarkan tingkat urgensi.',
    approxDurationSec: 10,
  },
  {
    id: 'scene_08_counselor_attached_profile',
    role: 'narrator_counselor',
    voice: 'id-ID-ArdiNeural',
    text: 'Konselor dapat langsung membaca hasil DASS-21 dan gaya belajar VAK tanpa mengetahui identitas asli mahasiswa, lalu mengklik Terima dan Masuk Sesi.',
    approxDurationSec: 11,
  },
  {
    id: 'scene_09_chat_e2ee',
    role: 'narrator_counselor',
    voice: 'id-ID-ArdiNeural',
    text: 'Seluruh percakapan di ruang obrolan terkunci enkripsi ujung-ke-ujung AES-GCM 256-bit. Konselor memberikan panduan taktis berbasis gaya belajar mahasiswa.',
    approxDurationSec: 12,
  },
  {
    id: 'scene_10_safe_exit',
    role: 'narrator_student',
    voice: 'id-ID-GadisNeural',
    text: 'Bila berada di tempat umum, mahasiswa dapat mengklik tombol Safe Exit kapan saja untuk langsung mengalihkan layar ke Google tanpa meninggalkan jejak.',
    approxDurationSec: 10,
  },
  {
    id: 'scene_11_outro',
    role: 'system',
    voice: 'id-ID-GadisNeural',
    text: 'SafeSpace PWA: ruang aman anonim untuk mengurai burnout akademik dan menjaga kesehatan mental Anda selama kuliah jarak jauh.',
    approxDurationSec: 9,
  },
];
