export interface PromoVoiceover {
  id: string;
  voice: 'id-ID-GadisNeural' | 'id-ID-ArdiNeural';
  rate?: string; // e.g. "+8%" for lively promotional pacing
  pitch?: string;
  text: string;
  approxDurationSec: number;
}

export interface PromoCalloutOverlay {
  id: string;
  title: string;
  badges: string[];
  points: { icon: 'check' | 'cross' | 'lock' | 'shield' | 'zap' | 'chart' | 'alert'; text: string }[];
  highlightBox?: { x: number; y: number; width: number; height: number }; // In 1920x1080 canvas
  calloutPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-right' | 'center-left';
}

export const PROMO_VOICEOVERS: PromoVoiceover[] = [
  {
    id: 'promo_01_hook',
    voice: 'id-ID-GadisNeural',
    rate: '+8%',
    text: 'Sering merasa lelah, cemas, atau kewalahan dengan tugas kuliah PJJ, tapi ragu mencari bantuan karena takut identitas dan riwayat akademik Anda terekam?',
    approxDurationSec: 7.0,
  },
  {
    id: 'promo_02_intro_pwa',
    voice: 'id-ID-GadisNeural',
    rate: '+8%',
    text: 'Kenalkan SafeSpace PWA. Ruang pra-konseling mahasiswa yang dirancang privat sejak detik pertama. Tanpa instalasi rumit, cukup buka peramban Anda.',
    approxDurationSec: 6.5,
  },
  {
    id: 'promo_03_oauth_sanitization',
    voice: 'id-ID-GadisNeural',
    rate: '+8%',
    text: 'Masuk aman dengan Akun Google resmi. Identitas Anda disanitasi satu arah menggunakan kriptografi SHA-256. Nama asli dan email Anda tidak pernah disimpan di database.',
    approxDurationSec: 8.0,
  },
  {
    id: 'promo_04_student_anonymity',
    voice: 'id-ID-GadisNeural',
    rate: '+8%',
    text: 'Begitu masuk, perhatikan profil Anda. Tidak ada nama asli maupun NIM, hanya tertera label anonim Akun Mahasiswa. Bebas dari stigma dan bebas dari rekam jejak kampus.',
    approxDurationSec: 8.5,
  },
  {
    id: 'promo_05_dass21',
    voice: 'id-ID-GadisNeural',
    rate: '+8%',
    text: 'Mulai dengan asesmen mandiri DASS-21. Menggunakan rumus baku ilmiah Lovibond, bukan tebakan algoritma semata. Dalam hitungan detik, tingkat depresi, kecemasan, dan stres Anda terpetakan secara objektif.',
    approxDurationSec: 9.5,
  },
  {
    id: 'promo_06_vak_reflection',
    voice: 'id-ID-GadisNeural',
    rate: '+8%',
    text: 'Lengkapi dengan pemetaan gaya belajar VAK dan jurnal curhat refleksi. Semua data tersimpan aman secara offline di perangkat Anda dan otomatis terlampir saat Anda membuka tiket pra-konseling.',
    approxDurationSec: 9.5,
  },
  {
    id: 'promo_07_counselor_triage',
    voice: 'id-ID-ArdiNeural',
    rate: '+8%',
    text: 'Dari sisi konselor, protokol double-blind aktif sepenuhnya. Konselor hanya menerima tiket dengan nama samaran acak seperti Sahabat Fajar, lengkap dengan ringkasan skor tanpa perlu Anda mengulang cerita dari awal.',
    approxDurationSec: 10.0,
  },
  {
    id: 'promo_08_e2ee_chat',
    voice: 'id-ID-GadisNeural',
    rate: '+8%',
    text: 'Sesi percakapan dilindungi enkripsi end-to-end AES-GCM 256-bit. Konselor memberikan panduan belajar yang sesuai dengan gaya kinestetik Anda, dalam ruang obrolan yang sepenuhnya terenkripsi.',
    approxDurationSec: 10.5,
  },
  {
    id: 'promo_09_safe_exit',
    voice: 'id-ID-GadisNeural',
    rate: '+8%',
    text: 'Berada di ruang publik? Cukup klik tombol Safe Exit satu kali, dan layar langsung tertutup seketika menuju Google tanpa meninggalkan jejak.',
    approxDurationSec: 6.5,
  },
  {
    id: 'promo_10_outro',
    voice: 'id-ID-GadisNeural',
    rate: '+6%',
    text: 'SafeSpace PWA. Ruang aman pertama Anda sebelum konseling. Anonim, ilmiah, dan terenkripsi. Kunjungi safespace.ijplabs.dev sekarang.',
    approxDurationSec: 7.0,
  },
];

export const PROMO_CALLOUTS: Record<string, PromoCalloutOverlay> = {
  callout_01_hook: {
    id: 'callout_01_hook',
    title: 'Akses Instan via Web PWA',
    badges: ['PWA Offline-First', 'safespace.ijplabs.dev'],
    points: [
      { icon: 'zap', text: 'Buka langsung di peramban tanpa install aplikasi rumit' },
      { icon: 'shield', text: 'Penyimpanan lokal IndexedDB terenkripsi' },
    ],
    calloutPosition: 'top-left',
  },
  callout_02_auth: {
    id: 'callout_02_auth',
    title: 'Autentikasi Bersih & Aman',
    badges: ['SSO Google Resmi', 'Double-Blind'],
    points: [
      { icon: 'lock', text: 'Sanitasi Kriptografis Satu Arah SHA-256' },
      { icon: 'cross', text: 'Nama asli & email TIDAK PERNAH disimpan di database' },
      { icon: 'check', text: 'Dwifungsi otomatis: Masuk sekaligus Daftar' },
    ],
    highlightBox: { x: 710, y: 350, width: 500, height: 380 },
    calloutPosition: 'center-left',
  },
  callout_03_anonymity: {
    id: 'callout_03_anonymity',
    title: 'Jaminan Anonimitas Total',
    badges: ['Zero Identity Storage', 'Bebas Stigma'],
    points: [
      { icon: 'cross', text: 'TIDAK ada nama asli maupun NIM mahasiswa' },
      { icon: 'check', text: 'Hanya berlabel generik "Akun Mahasiswa"' },
      { icon: 'shield', text: '100% aman dari rekam jejak akademik kampus' },
    ],
    highlightBox: { x: 1240, y: 15, width: 230, height: 42 },
    calloutPosition: 'bottom-left',
  },
  callout_04_dass21: {
    id: 'callout_04_dass21',
    title: 'Deteksi Dini Burnout PJJ Ilmiah',
    badges: ['Formula Lovibond', 'Non-AI Black Box'],
    points: [
      { icon: 'chart', text: 'Depresi 16 (Moderate) • Cemas 14 (Moderate)' },
      { icon: 'alert', text: 'Stres 28 (Severe) -> Resiko Burnout Tinggi' },
      { icon: 'check', text: 'Skor terverifikasi instan tanpa bias algoritma' },
    ],
    highlightBox: { x: 420, y: 160, width: 1080, height: 460 },
    calloutPosition: 'bottom-right',
  },
  callout_05_vak: {
    id: 'callout_05_vak',
    title: 'Modalitas Belajar Personal',
    badges: ['VAK Learning Style', 'Kinestetik 58%'],
    points: [
      { icon: 'check', text: 'Dominan Kinestetik: Belajar dengan praktik & gerak' },
      { icon: 'zap', text: 'Rekomendasi Pomodoro 25 menit + jeda aktif' },
      { icon: 'shield', text: 'Profil otomatis dilampirkan ke konselor' },
    ],
    highlightBox: { x: 420, y: 180, width: 1080, height: 440 },
    calloutPosition: 'top-left',
  },
  callout_06_counselor_triage: {
    id: 'callout_06_counselor_triage',
    title: 'Antrean Triage Pra-Konseling Anonim',
    badges: ['Protokol Double-Blind', 'Triage Efisien'],
    points: [
      { icon: 'lock', text: 'Konselor hanya melihat nama samaran: "Sahabat Fajar-89"' },
      { icon: 'chart', text: 'Hasil DASS-21 & VAK langsung terbaca terstruktur' },
      { icon: 'check', text: 'Konseling dimulai tanpa mahasiswa mengulang trauma' },
    ],
    highlightBox: { x: 990, y: 220, width: 850, height: 600 },
    calloutPosition: 'center-left',
  },
  callout_07_e2ee: {
    id: 'callout_07_e2ee',
    title: 'Percakapan Terkunci E2EE',
    badges: ['AES-GCM 256-bit', 'Web Crypto API'],
    points: [
      { icon: 'lock', text: 'Pesan dienkripsi di peramban sebelum dikirim' },
      { icon: 'cross', text: 'Peladen (server) BUTA terhadap isi percakapan' },
      { icon: 'check', text: 'Pill Icebreaker: Memudahkan mahasiswa bercerita' },
    ],
    highlightBox: { x: 380, y: 90, width: 1160, height: 80 },
    calloutPosition: 'bottom-left',
  },
  callout_08_safe_exit: {
    id: 'callout_08_safe_exit',
    title: 'Proteksi Darurat di Ruang Publik',
    badges: ['Safe Exit', '< 1 Detik'],
    points: [
      { icon: 'alert', text: 'Satu klik tombol Safe Exit saat ada orang mendekat' },
      { icon: 'check', text: 'Langsung beralih ke Google & hapus sesi di memori' },
    ],
    highlightBox: { x: 1470, y: 15, width: 120, height: 42 },
    calloutPosition: 'bottom-left',
  },
};
