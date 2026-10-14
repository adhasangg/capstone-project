import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Code2,
  ExternalLink,
  Flame,
  Globe,
  Heart,
  HelpCircle,
  Laptop,
  Lock,
  MessageSquare,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  Users,
  WifiOff,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

type GuideTab = 'student' | 'counselor' | 'admin' | 'pwa' | 'privacy' | 'api';

interface UserGuideProps {
  readonly onSelectTab?: (tab: string) => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ onSelectTab }) => {
  const [activeTab, setActiveTab] = useState<GuideTab>('student');
  const [searchQuery, setSearchQuery] = useState('');

  const handleActionClick = (targetTab: string) => {
    if (onSelectTab) {
      onSelectTab(targetTab);
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto text-left">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E3ECE5] via-[#F4F7F4] to-[#F9F9F6] border border-[#C7D9CC]/80 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-[#C7D9CC] text-[#31523A] text-xs font-semibold shadow-2xs">
            <BookOpen className="w-4 h-4 text-[#4A7C59]" />
            <span>Pusat Panduan &amp; Dokumentasi Pengguna SafeSpace PWA</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
            Versi Aplikasi: 1.0.0 &bull; E-Tutorial Terbuka
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight leading-snug mb-3">
          Panduan Lengkap Penggunaan{' '}
          <span className="text-[#4A7C59] underline decoration-[#C7D9CC] decoration-wavy decoration-2">
            SafeSpace PWA
          </span>
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed mb-6">
          Selamat datang di buku panduan interaktif SafeSpace. Sistem ini dirancang khusus untuk
          mendukung mahasiswa Pendidikan Jarak Jauh (PJJ) dalam mendeteksi kejenuhan akademis
          (academic burnout), mengidentifikasi gaya belajar dominan, dan mengakses konseling anonim
          dua arah yang aman, privat, serta hemat kuota.
        </p>

        {/* Quick Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik (misal: offline, DASS-21, konselor, tiket, e2ee)..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/30 focus:border-[#4A7C59] shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
            activeTab === 'student'
              ? 'bg-[#4A7C59] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Panduan Mahasiswa PJJ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('counselor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
            activeTab === 'counselor'
              ? 'bg-[#3B5998] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>2. Panduan Konselor Sebaya &amp; Dosen</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
            activeTab === 'admin'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>3. Panduan Administrator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pwa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
            activeTab === 'pwa'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>4. PWA &amp; Mode Offline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>5. Privasi &amp; FAQ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
            activeTab === 'api'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>6. Dokumen API / Swagger</span>
        </button>
      </div>

      {/* TAB 1: PANDUAN MAHASISWA PJJ */}
      {activeTab === 'student' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#E3ECE5] text-[#31523A] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#4A7C59]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E293B]">
                  Alur Cepat 3 Langkah Mahasiswa PJJ
                </h2>
                <p className="text-xs text-slate-500">
                  Didesain agar Anda dapat memeriksa kesehatan mental dalam waktu kurang dari 5
                  menit
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-[#F9F9F6] space-y-2">
                <div className="w-7 h-7 rounded-lg bg-[#4A7C59] text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="text-sm font-bold text-[#1E293B]">Asesmen Mandiri Terukur</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Isi 21 pertanyaan DASS-21 (Depresi, Kecemasan, Stres) dan 12 skenario belajar VAK.
                  Dapat diisi saat tersambung internet maupun saat hemat kuota (offline).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-[#F9F9F6] space-y-2">
                <div className="w-7 h-7 rounded-lg bg-[#3B5998] text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="text-sm font-bold text-[#1E293B]">Pahami Diagnosis &amp; Gaya</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lihat hasil skor baku Lovibond dan rekomendasi strategi belajar adaptif (Visual,
                  Auditori, atau Kinestetik) yang cocok untuk ritme kuliah mandiri Anda.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-[#F9F9F6] space-y-2">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="text-sm font-bold text-[#1E293B]">Konseling Anonim (Opsional)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jika skor mengindikasikan kelelahan atau Anda butuh teman cerita, buka tiket
                  pra-konseling. Identitas asli Anda tidak pernah diketahui oleh konselor.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleActionClick('assessment')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A7C59] hover:bg-[#3D6649] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <span>Mulai Asesmen DASS-21 &amp; VAK Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleActionClick('dashboard')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <span>Buka Dashboard Mahasiswa</span>
              </button>
            </div>
          </div>

          {/* Section: Rincian Fitur Utama Mahasiswa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-[#31523A]">
                <Flame className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-[#1E293B]">Pemetaan Emosi DASS-21</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instrumen DASS-21 mengukur 3 dimensi kelelahan mental selama 1 minggu terakhir
                menggunakan skala Likert 0 sampai 3:
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>
                  <strong className="text-slate-800">Depresi (D):</strong> Kehilangan antusiasme,
                  sulit memulai aktivitas, perasaan tidak berharga.
                </li>
                <li>
                  <strong className="text-slate-800">Kecemasan (A):</strong> Respon fisik seperti
                  jantung berdegup, mulut kering, kekhawatiran panik.
                </li>
                <li>
                  <strong className="text-slate-800">Stres (S):</strong> Ketegangan saraf, mudah
                  tersinggung karena hal sepele, sulit rileks.
                </li>
              </ul>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 leading-relaxed">
                <strong>Formula Baku Lovibond &amp; Lovibond:</strong> Skor 7 butir per skala
                dikalikan 2 secara matematis murni untuk menghasilkan kategori baku: Normal, Ringan,
                Sedang, Parah, atau Sangat Parah.
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-[#24365D]">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-[#1E293B]">Pemetaan Gaya Belajar VAK</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menyajikan 12 skenario belajar khas mahasiswa PJJ (tugas tuton, membaca modul BMP,
                menghafal istilah, mengatasi kebosanan):
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>
                  <strong className="text-slate-800">Visual:</strong> Paling mudah paham lewat
                  bagan, peta konsep, warna stabilo, dan teks terstruktur.
                </li>
                <li>
                  <strong className="text-slate-800">Auditori:</strong> Paling mudah paham lewat
                  mendengarkan penjelasan suara, diskusi verbal, atau membaca bersuara.
                </li>
                <li>
                  <strong className="text-slate-800">Kinestetik:</strong> Paling mudah paham lewat
                  latihan soal langsung, mencatat dengan tangan, dan bergerak aktif.
                </li>
              </ul>
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed">
                <strong>Pedagogi Personal:</strong> Menghindarkan Anda dari memaksakan cara belajar
                yang tidak sesuai dengan karakteristik alami otak Anda saat belajar mandiri.
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-[#31523A]">
                <MessageSquare className="w-5 h-5 text-[#4A7C59]" />
                <h3 className="text-sm font-bold text-[#1E293B]">Curhat Refleksi &amp; Mood Box</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Punya unek-unek tentang tugas akhir, tutor, atau benturan antara jam lembur kerja
                dan kuliah? Tuliskan secara bebas di fitur Curhat Refleksi.
              </p>
              <ul className="text-xs text-slate-600 space-y-1 text-slate-600 list-disc list-inside">
                <li>Deteksi sentimen otomatis mengenali tingkat keparahan beban emosi.</li>
                <li>Diberikan respon empatik awal dan saran tindakan praktis.</li>
                <li>
                  Tersedia tombol satu-klik untuk melampirkan curhatan ke tiket pra-konseling.
                </li>
              </ul>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-[#1E293B]">
                  Fitur Darurat: Tombol Safe Exit
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jika Anda sedang membuka aplikasi SafeSpace di tempat umum (misalnya di kantor,
                laboratorium kampus, atau ruang keluarga) dan seseorang tiba-tiba mendekat:
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Klik tombol <strong className="text-amber-800 font-semibold">Safe Exit</strong> di
                pojok kanan atas navbar. Halaman akan langsung dialihkan seketika ke Google Search
                tanpa meninggalkan jejak riwayat obrolan di layar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PANDUAN KONSELOR SEBAYA & DOSEN */}
      {activeTab === 'counselor' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E293B]">
                  Panduan Peran Konselor Sebaya &amp; Dosen BK
                </h2>
                <p className="text-xs text-slate-500">
                  Protokol triage antrean, pendampingan empatik, dan kode etik pra-konseling PJJ
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Sebagai konselor sebaya atau dosen pembimbing, peran utama Anda adalah menjadi{' '}
                <strong className="text-slate-800">pendengar yang hadir tanpa menghakimi</strong>{' '}
                dan membantu mahasiswa mengurai simpul kelelahan belajar mereka. Anda tidak dituntut
                memberikan diagnosis kejiwaan klinis formal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-2">
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>1. Membaca Matriks Triage Antrean</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pada menu <strong>Antrean Triage</strong>, tiket mahasiswa disusun berdasarkan
                  urgensi emosional. Tiket berlabel merah (<em>Sangat Parah / Extremely Severe</em>)
                  dan oranye (<em>Parah / Severe</em>) diposisikan paling atas agar segera
                  mendapatkan tanggapan konselor.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-2">
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>2. Intervensi Berbasis Gaya Belajar</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Periksa modalitas belajar mahasiswa di tiketnya. Jika mahasiswa memiliki gaya{' '}
                  <em>Kinestetik</em> namun mengeluh jenuh membaca modul tebal, sarankan teknik
                  belajar berbasis proyek kecil atau teknik Pomodoro fisik ketimbang terus membaca
                  di depan laptop.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-2">
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>3. Kerahasiaan Dua Arah (Two-Way Anonymity)</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Anda tidak diperkenankan menanyakan identitas pribadi mahasiswa (Nama asli, NIM,
                  program studi, lokasi rumah, nomor WhatsApp). Semua komunikasi dilakukan melalui
                  pseudonim sistem (contoh: <em>Ksatria-Tenang-241</em>).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-2">
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>4. Batasan &amp; Protokol Rujukan Kritis</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jika dalam percakapan terindikasi adanya rencana menyakiti diri sendiri atau
                  krisis kejiwaan berat, konselor wajib segera menyarankan rujukan resmi ke Pusat
                  Layanan Kesehatan Mahasiswa / Psikolog Klinis Universitas.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleActionClick('counselor-queue')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3B5998] hover:bg-[#2C4476] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <span>Buka Panel Antrean Konselor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PANDUAN ADMINISTRATOR SISTEM */}
      {activeTab === 'admin' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E293B]">
                  Panduan Administrator Sistem (Sysadmin)
                </h2>
                <p className="text-xs text-slate-500">
                  Manajemen peran pengguna, keamanan platform, dan analitik agregat kampus
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1E293B]">Elevasi Peran Pengguna</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Secara default, seluruh akun Google yang masuk pertama kali berstatus{' '}
                  <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">student</code>.
                  Sysadmin dapat menaikkan peran pengguna terpilih menjadi{' '}
                  <code className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded text-[11px]">
                    counselor
                  </code>{' '}
                  atau{' '}
                  <code className="bg-purple-100 text-purple-900 px-1 py-0.5 rounded text-[11px]">
                    admin
                  </code>{' '}
                  melalui panel tabel manajemen pengguna.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1E293B]">Perlindungan Zero PII</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bahkan Sysadmin sekalipun tidak memiliki akses ke email plaintext mahasiswa pada
                  basis data utama. Semua identitas disimpan dalam bentuk hash HMAC-SHA256 dengan
                  Secret Pepper di level backend.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1E293B]">Metrik Kesehatan Burnout</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Memantau distribusi keparahan burnout secara agregat (tingkat depresi, kecemasan,
                  dan stres) untuk keperluan laporan universitas dan pengambilan kebijakan kurikulum
                  PJJ tanpa membocorkan privasi individu.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleActionClick('admin')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <span>Buka Panel Manajemen Sysadmin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PWA & MODE OFFLINE */}
      {activeTab === 'pwa' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E293B]">
                  Instalasi PWA &amp; Penggunaan Mode Offline (Hemat Kuota)
                </h2>
                <p className="text-xs text-slate-500">
                  SafeSpace dapat dipasang sebagai aplikasi mandiri di HP atau Laptop dan berjalan
                  tanpa kuota internet
                </p>
              </div>
            </div>

            {/* Sub-section: Cara Install */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>Android (Chrome / Edge)</span>
                </div>
                <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Buka website SafeSpace di browser Google Chrome.</li>
                  <li>
                    Tekan ikon <strong>Titik Tiga</strong> di sudut kanan atas layar.
                  </li>
                  <li>
                    Pilih menu <strong>Install App</strong> atau{' '}
                    <strong>Tambahkan ke Layar Utama</strong>.
                  </li>
                  <li>Ikon SafeSpace akan muncul di layar ponsel layaknya aplikasi Play Store.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>iOS (iPhone / iPad Safari)</span>
                </div>
                <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Buka website SafeSpace di browser Safari.</li>
                  <li>
                    Tekan tombol <strong>Share</strong> (ikon kotak berpanah ke atas di bagian
                    bawah).
                  </li>
                  <li>
                    Gulir ke bawah dan pilih <strong>Add to Home Screen</strong>.
                  </li>
                  <li>Tekan tombol Tambah di pojok kanan atas.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Laptop className="w-4 h-4" />
                  <span>Laptop / Komputer (Desktop)</span>
                </div>
                <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Buka website di Google Chrome atau Microsoft Edge.</li>
                  <li>
                    Perhatikan ikon <strong>Komputer / Install</strong> di ujung kanan bilah alamat
                    (URL bar).
                  </li>
                  <li>Klik tombol tersebut dan pilih Install.</li>
                  <li>SafeSpace akan berjalan di jendela mandiri tanpa address bar browser.</li>
                </ol>
              </div>
            </div>

            {/* Offline Pure Math Explanation */}
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <WifiOff className="w-4 h-4 text-emerald-700" />
                <span>Bagaimana Cara Kerja Pengisian Asesmen Saat Offline?</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                Di daerah terpencil atau saat paket kuota data mahasiswa habis, pengisian instrumen
                DASS-21 dan VAK tetap berjalan lancar:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 space-y-1">
                  <h4 className="font-bold text-slate-900">Kalkulasi Deterministik di Peramban</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Logika rumus Lovibond &amp; Lovibond (DASS-21) dan pembagian persentase Fleming
                    (VAK) dijalankan 100% oleh JavaScript di peramban pengguna. Skor langsung keluar
                    seketika tanpa menunggu sinyal server.
                  </p>
                </div>
                <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 space-y-1">
                  <h4 className="font-bold text-slate-900">Auto-Sync Antrean Luring</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Hasil disimpan ke dalam cache lokal perangkat (
                    <code className="text-emerald-800">localStorage</code>). Begitu perangkat
                    mendeteksi koneksi internet pulih, antrean akan disinkronkan otomatis ke server
                    tanpa perlu mengisi ulang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PRIVASI & FAQ */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E293B]">
                  Arsitektur Keamanan Privasi &amp; Tanya Jawab (FAQ)
                </h2>
                <p className="text-xs text-slate-500">
                  Transparansi penuh mengenai perlindungan data pribadi dan kerahasiaan identitas
                  Anda
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-1.5">
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#4A7C59]" />
                  <span>Apakah dosen atau kampus saya tahu isi curhat dan skor saya?</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Tidak.</strong> SafeSpace mengusung prinsip Two-Way Anonymity. Identitas
                  Google Anda diubah menjadi nama samaran acak yang tidak dapat dilacak balik oleh
                  konselor maupun dosen. Konselor hanya melihat skor kelelahan emosional dan gaya
                  belajar agar dapat memberikan saran yang relevan.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-1.5">
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#4A7C59]" />
                  <span>Bagaimana pesan dalam ruang chat diamankan dari penyadapan (E2EE)?</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ruang percakapan menggunakan standar enkripsi Web Crypto API peramban dengan
                  protokol pertukaran kunci ECDH (Elliptic-Curve Diffie-Hellman) kurva P-256 dan
                  algoritma simetris AES-GCM 256-bit. Pesan dienkripsi di perangkat pengirim dan
                  hanya bisa didekripsi di perangkat penerima. Server kami hanya bertindak sebagai
                  perantara ciphertext.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-1.5">
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#4A7C59]" />
                  <span>Apakah layanan pra-konseling ini berbayar?</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Layanan SafeSpace PWA disediakan secara 100% gratis dan terbuka bagi seluruh
                  mahasiswa sebagai kontribusi riset Capstone STSI4401 dalam mewujudkan ekosistem
                  Pendidikan Jarak Jauh yang lebih manusiawi dan ramah kesehatan mental.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9F6] space-y-1.5">
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#4A7C59]" />
                  <span>Bagaimana jika saya ingin menghapus seluruh data sesi saya?</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Anda dapat keluar akun kapan saja dengan menekan tombol Logout di navbar. Riwayat
                  di memori lokal perangkat Anda dapat dibersihkan seketika dengan membersihkan
                  cache browser atau menggunakan mode penyamaran (Incognito).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DOKUMEN API / SWAGGER */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E293B]">
                  Dokumentasi Pengembang &amp; Swagger API
                </h2>
                <p className="text-xs text-slate-500">
                  Spesifikasi OpenAPI / Swagger untuk pengembang, penguji sistem, dan reviewer
                  akademis
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Backend SafeSpace dibangun menggunakan framework berkinerja tinggi Elysia.js pada
              runtime Bun. Spesifikasi antarmuka pemrograman aplikasi (API) telah terintegrasi
              dengan OpenAPI 3.0 dan dapat diakses langsung melalui Swagger UI interaktif.
            </p>

            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400">
                  Swagger UI Endpoint: /swagger
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  OpenAPI 3.0
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Saat server backend berjalan di lingkungan pengembangan lokal, Anda dapat mengakses
                dokumentasi Swagger di:
              </p>
              <div className="p-2.5 bg-slate-950 rounded-lg font-mono text-xs text-emerald-300 flex items-center justify-between">
                <span>http://localhost:3000/swagger</span>
                <a
                  href="http://localhost:3000/swagger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Tab Baru</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Modul Autentikasi (`/api/auth/*`)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Endpoint verifikasi Google OAuth, pertukaran JWT token terproteksi, dan profil
                  pengguna anonymized.
                </p>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Modul Asesmen (`/api/assessment/*`)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Endpoint kalkulasi baku DASS-21, pemetaan modalitas belajar VAK, dan analisis
                  sentimen curhat refleksi.
                </p>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Modul Sesi &amp; Triage (`/api/sessions/*`)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Penerbitan tiket pra-konseling mahasiswa, antrean triage konselor berdasarkan
                  skala keparahan, dan riwayat sesi.
                </p>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Modul Obrolan Terenkripsi (`/api/chat/*`)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Transport ciphertext E2EE, riwayat percakapan rahasia, dan penutupan sesi
                  konseling.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
