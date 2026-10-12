import { ArrowRight, BookOpen, Lock, MessageSquareHeart, Sparkles, UserCheck } from 'lucide-react';
import type React from 'react';
import type { AuthSession } from '../../services/api';

interface LandingHeroProps {
  readonly session: AuthSession | null;
  readonly onNavigateTab: (tab: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ session, onNavigateTab }) => {
  const handlePrimaryCta = () => {
    if (!session) {
      onNavigateTab('auth');
      return;
    }
    if (session.user.role === 'admin') {
      onNavigateTab('admin');
      return;
    }
    if (session.user.role === 'counselor') {
      onNavigateTab('counselor-queue');
      return;
    }
    onNavigateTab('dashboard');
  };

  const getPrimaryCtaText = () => {
    if (!session) return 'Masuk / Mulai Konsultasi';
    if (session.user.role === 'admin') return 'Buka Panel Sysadmin';
    if (session.user.role === 'counselor') return 'Buka Antrean Konselor';
    return 'Buka Dashboard Mahasiswa';
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4">
      {/* 1. Hero Brand Statement */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3ECE5] text-[#31523A] text-xs font-semibold tracking-wide shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#4A7C59]" />
          <span>Platform Pra-Konseling &bull; Zero-Knowledge Privasi Mahasiswa PJJ</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1E293B] leading-tight">
          Ruang Aman Anonim untuk Mengurai{' '}
          <span className="text-[#4A7C59] underline decoration-[#4A7C59]/30 underline-offset-8">
            Academic Burnout
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Deteksi dini kelelahan akademik dengan instrumen baku DASS-21 &amp; VAK Fleming. Terhubung
          langsung dengan konselor sebaya &amp; dosen pembimbing melalui enkripsi E2EE tanpa rekam
          jejak identitas asli.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrimaryCta}
            className="px-6 py-3 bg-[#4A7C59] hover:bg-[#3D6649] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{getPrimaryCtaText()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('about')}
            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Pelajari Metodologi &amp; Riset</span>
          </button>
        </div>

        {session && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Sesi Aktif: <strong className="font-semibold">{session.user.pseudonym}</strong>
            </span>
          </div>
        )}
      </div>

      {/* 2. Three Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#E3ECE5] text-[#4A7C59] flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#1E293B] mb-2">Two-Way Anonymity</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mahasiswa menggunakan nama samaran acak, konselor menggunakan kode profesional. Tanpa
            penghakiman moral maupun intimidasi akademis.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#D9E2EC] text-[#3B5998] flex items-center justify-center mb-4">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#1E293B] mb-2">Instrumen Baku &amp; Terukur</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kalkulasi matematis murni skala DASS-21 Lovibond dan preferensi VAK Fleming memberikan
            strategi belajar adaptif yang konkret untuk perkuliahan daring &amp; mandiri.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center mb-4">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#1E293B] mb-2">Attached Profile Ticketing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hasil asesmen langsung terlampir otomatis pada tiket pra-konseling tanpa perlu
            menceritakan ulang trauma atau beban dari awal kepada konselor.
          </p>
        </div>
      </div>

      {/* 3. 4 Tahap Menuju Pemulihan Mental */}
      <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold text-[#4A7C59] uppercase tracking-wider">
            Alur Layanan SafeSpace
          </span>
          <h3 className="text-xl font-bold text-[#1E293B]">4 Tahap Menuju Pemulihan Mental</h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Proses terstruktur yang dirancang agar mahasiswa PJJ merasa tenang, dihargai, dan
            terbantu secara nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#E3ECE5] text-[#31523A] font-bold text-xs flex items-center justify-center">
              01
            </div>
            <h4 className="font-bold text-slate-800 text-xs">Asesmen Mandiri</h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Isi kuesioner baku DASS-21 dan profil gaya belajar VAK dengan aman di portal
              terproteksi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#D9E2EC] text-[#24365D] font-bold text-xs flex items-center justify-center">
              02
            </div>
            <h4 className="font-bold text-slate-800 text-xs">Auto-Triage</h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Sistem menghitung tingkat burnout secara matematis dan menyiapkan panduan belajar
              adaptif.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
              03
            </div>
            <h4 className="font-bold text-slate-800 text-xs">Buka Tiket Anonim</h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Kaitkan profil asesmen ke antrean konselor sebaya &amp; dosen BK tanpa membeberkan
              identitas asli.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              04
            </div>
            <h4 className="font-bold text-slate-800 text-xs">Chat E2EE</h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Konseling mendalam di ruang obrolan terenkripsi AES-256 lokal yang aman dari
              penyadapan pihak ketiga.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Clean Call-to-Action Banner (Tanpa form login terbuka) */}
      <div className="p-8 bg-gradient-to-br from-[#E3ECE5]/60 to-[#D9E2EC]/50 border border-[#C7D9CC] rounded-3xl text-center space-y-4 shadow-xs">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#1E293B]">Siap Mengurai Beban Belajar Anda?</h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Masuk dengan akun Google Anda di portal resmi untuk mengakses asesmen psikometri
            terukur, catatan refleksi harian, dan tiket pra-konseling privat.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={handlePrimaryCta}
            className="px-6 py-3 bg-[#4A7C59] hover:bg-[#3D6649] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{session ? 'Buka Dashboard' : 'Buka Portal Masuk / Daftar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
