import {
  ArrowRight,
  BookOpen,
  Lock,
  MessageSquareHeart,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import type React from 'react';
import type { AuthSession } from '../../services/api';

interface LandingHeroProps {
  session: AuthSession | null;
  onSelectRole: (role: 'student' | 'counselor') => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  session,
  onSelectRole,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#E3ECE5]/60 to-[#F9F9F6] border border-[#C7D9CC]/60 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xs">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#C7D9CC] text-[#31523A] text-xs font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#4A7C59]" />
          <span>Sistem Informasi Capstone STSI4401 — Universitas Terbuka (2026)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight leading-tight mb-4">
          Ruang Aman Anonim untuk Mengurai{' '}
          <span className="text-[#4A7C59] underline decoration-[#C7D9CC] decoration-wavy decoration-2">
            Academic Burnout
          </span>
        </h1>

        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
          Paduan formula baku <strong>DASS-21</strong> (Lovibond) dan diagnosis modalitas belajar{' '}
          <strong>VAK</strong> (Fleming). Didesain khusus untuk mahasiswa Pendidikan Jarak Jauh
          (PJJ) dengan jaminan privasi mutlak tanpa rekam jejak identitas.
        </p>

        {/* Quick Role Switcher / Auth Simulation */}
        {!session ? (
          <div className="p-4 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 max-w-md mx-auto shadow-xs space-y-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Pilih Akses Sesi Anonim:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onSelectRole('student')}
                className="p-3 rounded-xl border border-[#4A7C59] bg-[#E3ECE5]/60 hover:bg-[#E3ECE5] text-[#31523A] text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#4A7C59]" />
                <span>Mahasiswa UT</span>
                <span className="text-[10px] font-normal text-slate-500">Mode Samaran</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectRole('counselor')}
                className="p-3 rounded-xl border border-[#3B5998] bg-[#D9E2EC]/60 hover:bg-[#D9E2EC] text-[#24365D] text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#3B5998]" />
                <span>Konselor Sebaya</span>
                <span className="text-[10px] font-normal text-slate-500">Antrean Triage</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              *Data Google ID Token disanitasi satu arah (One-Way Hashing SHA-256)
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('assessment')}
              className="px-6 py-3 bg-[#4A7C59] hover:bg-[#3D6649] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Mulai Asesmen DASS-21 & VAK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Buka Dashboard Sesi</span>
            </button>
          </div>
        )}
      </div>

      {/* 3 Value Pillars */}
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
          <h3 className="font-bold text-base text-[#1E293B] mb-2">Instrumen Baku & Terukur</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kalkulasi matematis murni skala DASS-21 Lovibond dan preferensi VAK Fleming memberikan
            strategi belajar adaptif yang konkret untuk perkuliahan Tuton.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center mb-4">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#1E293B] mb-2">Attached Profile Ticketing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hasil diagnostik otomatis dilampirkan ke tiket pra-konseling sehingga konselor langsung
            memahami kondisi mental tanpa meminta mahasiswa mengulang keluhan.
          </p>
        </div>
      </div>
    </div>
  );
};
