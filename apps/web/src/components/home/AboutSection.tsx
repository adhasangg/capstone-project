import {
  BookOpen,
  CheckCircle2,
  HeartHandshake,
  HelpCircle,
  Lock,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import type React from 'react';

interface AboutSectionProps {
  onStartAssessment: () => void;
  onGoToLogin: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onStartAssessment, onGoToLogin }) => {
  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto text-left">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E3ECE5] via-[#F4F7F4] to-[#F9F9F6] border border-[#C7D9CC]/70 p-8 sm:p-12 text-center shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#C7D9CC] text-[#31523A] text-xs font-semibold mb-4 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#4A7C59]" />
          <span>Mengenal SafeSpace PWA &bull; Capstone STSI4401</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight leading-tight mb-4">
          Memanusiakan Pembelajaran Jarak Jauh Lewat{' '}
          <span className="text-[#4A7C59] underline decoration-[#C7D9CC] decoration-wavy decoration-2">
            Privasi &amp; Psikometri Terukur
          </span>
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed mb-6">
          SafeSpace PWA lahir dari kajian mendalam terhadap fenomena kelelahan akademis (
          <em>academic burnout</em>) yang dialami mahasiswa Pendidikan Jarak Jauh (PJJ).
          Menggabungkan instrumen psikometri klinis baku, pedagogi belajar adaptif, dan protokol
          keamanan tanpa jejak.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStartAssessment}
            className="px-5 py-2.5 bg-[#4A7C59] hover:bg-[#3D6649] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coba Asesmen Mandiri Gratis</span>
          </button>
          <button
            type="button"
            onClick={onGoToLogin}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Masuk ke Portal Konseling</span>
          </button>
        </div>
      </div>

      {/* 1. Latar Belakang Masalah PJJ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1E293B] mb-2">Tantangan Nyata Mahasiswa PJJ</h2>
            <p className="text-xs text-slate-600 leading-relaxed space-y-2">
              Sebagian besar mahasiswa PJJ menjalani peran ganda sebagai pekerja penuh waktu
              sekaligus mahasiswa mandiri. Tuntutan tenggat tugas tutorial online (tuton), beban
              kognitif membaca ratusan modul secara soliter, serta minimnya interaksi tatap muka
              sering kali memicu kejenuhan mental yang tidak terdeteksi sejak awal.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>Keterbatasan konseling tatap muka konvensional di wilayah terpencil</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#E3ECE5] text-[#31523A] border border-[#C7D9CC] flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1E293B] mb-2">
              Hambatan Mencari Pertolongan (Help-Seeking)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed space-y-2">
              Banyak mahasiswa enggan mengeluhkan kondisi mental karena khawatir identitasnya
              tercatat dalam arsip akademik, dicap tidak mampu mengatur waktu, atau menghadapi rasa
              malu sosial. SafeSpace hadir menghapus stigma tersebut dengan menyediakan ruang aman
              tanpa penghakiman moral.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#4A7C59] shrink-0" />
            <span>Privasi absolut membangkitkan keberanian untuk bersuara</span>
          </div>
        </div>
      </div>

      {/* 2. Tiga Landasan Ilmiah Utama */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">Landasan Teori &amp; Metodologi Baku</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sistem tidak mengarang diagnosis secara subjektif, melainkan berpedoman pada instrumen
            baku internasional yang tervalidasi secara empiris.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-[#E3ECE5] text-[#4A7C59] flex items-center justify-center mb-3">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#1E293B] mb-1.5">
              1. DASS-21 (Lovibond &amp; Lovibond, 1995)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instrumen 21 butir pernyataan untuk mengukur tingkat keparahan Depresi, Kecemasan, dan
              Stres melalui kalkulasi matematis deterministik tanpa bias halusinasi AI.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-[#D9E2EC] text-[#3B5998] flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#1E293B] mb-1.5">
              2. Modalitas VAK (Fleming, 2001)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Identifikasi preferensi modalitas belajar (Visual, Auditori, Kinestetik) agar
              mahasiswa menemukan strategi belajar mandiri yang efektif dan menghemat energi
              kognitif.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#D97706] flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#1E293B] mb-1.5">
              3. Enkripsi E2EE (Boneh &amp; Shoup, 2020)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Percakapan konseling diamankan dengan algoritma AES-GCM 256-bit berbasis Web Crypto
              API lokal. Peladen dan admin basis data hanya meneruskan sandi acak tanpa kunci
              dekripsi.
            </p>
          </div>
        </div>
      </div>

      {/* 3. FAQ Interaktif */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-[#4A7C59]" />
          <h2 className="text-lg font-bold text-[#1E293B]">Pertanyaan Umum Mahasiswa (FAQ)</h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7C59]" />
              Apakah dosen atau pihak fakultas dapat melihat curhatan saya?
            </h4>
            <p className="text-slate-600 leading-relaxed pl-5">
              Tidak sama sekali. Sistem menggunakan prinsip Two-Way Anonymity. Identitas email
              Google langsung disanitasi satu arah via SHA-256 HMAC dan dibuang dari memori server.
              Konselor hanya melihat pseudonim acak seperti &quot;Mahasiswa #4861&quot;.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7C59]" />
              Apakah layanan SafeSpace PWA memungut biaya?
            </h4>
            <p className="text-slate-600 leading-relaxed pl-5">
              100% Bebas Biaya (Gratis). Layanan ini dikembangkan sebagai karya Capstone Project
              Sistem Informasi untuk mendukung kesejahteraan mental mahasiswa PJJ di seluruh penjuru
              Indonesia.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7C59]" />
              Bagaimana jika koneksi internet saya buruk saat mengisi asesmen?
            </h4>
            <p className="text-slate-600 leading-relaxed pl-5">
              SafeSpace berarsitektur Progressive Web App (PWA) dengan kapabilitas luring
              (offline-first). Seluruh soal DASS-21 dan VAK dapat dikerjakan secara offline. Begitu
              perangkat Anda kembali terhubung internet, sistem otomatis menyinkronkan data profil
              asesmen Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
