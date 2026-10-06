import { AlertTriangle, LogOut, ShieldCheck, User } from 'lucide-react';
import type React from 'react';
import type { AuthSession } from '../../services/api';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  session: AuthSession | null;
  onLogout: () => void;
}

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isCounselor: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab, isCounselor }) => (
  <div className="md:hidden flex items-center justify-around border-t border-[#E2E8F0] bg-white py-2 px-1 text-xs">
    <button
      type="button"
      onClick={() => onSelectTab('home')}
      className={`px-2 py-1 rounded cursor-pointer ${
        currentTab === 'home' ? 'text-[#4A7C59] font-bold' : 'text-slate-600'
      }`}
    >
      Beranda
    </button>
    <button
      type="button"
      onClick={() => onSelectTab('assessment')}
      className={`px-2 py-1 rounded cursor-pointer ${
        currentTab === 'assessment' ? 'text-[#4A7C59] font-bold' : 'text-slate-600'
      }`}
    >
      Asesmen
    </button>
    <button
      type="button"
      onClick={() => onSelectTab('mood')}
      className={`px-2 py-1 rounded cursor-pointer ${
        currentTab === 'mood' ? 'text-[#4A7C59] font-bold' : 'text-slate-600'
      }`}
    >
      Curhat
    </button>
    <button
      type="button"
      onClick={() => onSelectTab('dashboard')}
      className={`px-2 py-1 rounded cursor-pointer ${
        currentTab === 'dashboard' ? 'text-[#4A7C59] font-bold' : 'text-slate-600'
      }`}
    >
      Dashboard
    </button>
    {isCounselor && (
      <button
        type="button"
        onClick={() => onSelectTab('counselor-queue')}
        className={`px-2 py-1 rounded cursor-pointer ${
          currentTab === 'counselor-queue' ? 'text-[#3B5998] font-bold' : 'text-slate-600'
        }`}
      >
        Antrean
      </button>
    )}
  </div>
);

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, session, onLogout }) => {
  const handleSafeExit = () => {
    window.location.replace('https://www.google.com');
  };

  const isCounselor = session?.user.role === 'counselor' || session?.user.role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-[#F9F9F6]/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <button
            type="button"
            className="flex items-center gap-3 cursor-pointer text-left bg-transparent border-0 p-0"
            onClick={() => onSelectTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A7C59] to-[#3B5998] flex items-center justify-center text-white font-bold shadow-sm">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-[#1E293B] block leading-tight">
                SafeSpace{' '}
                <span className="text-[#4A7C59] text-xs font-semibold uppercase tracking-wider">
                  UT
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Pra-Konseling & Deteksi Burnout PJJ
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSelectTab('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-[#E3ECE5] text-[#31523A]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('assessment')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'assessment'
                  ? 'bg-[#E3ECE5] text-[#31523A]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Asesmen Mandiri
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('mood')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'mood'
                  ? 'bg-[#E3ECE5] text-[#31523A]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Mood Tracker
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-[#E3ECE5] text-[#31523A]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Dashboard Sesi
            </button>
            {isCounselor && (
              <button
                type="button"
                onClick={() => onSelectTab('counselor-queue')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === 'counselor-queue'
                    ? 'bg-[#D9E2EC] text-[#24365D]'
                    : 'text-[#3B5998] hover:bg-[#F0F4F8]'
                }`}
              >
                Antrean Konselor
              </button>
            )}
          </nav>

          {/* Right Header: Anonymous Badge & Safe Exit */}
          <div className="flex items-center gap-3">
            {session && (
              <div className="flex items-center gap-2 bg-[#E3ECE5]/60 border border-[#C7D9CC] px-2.5 py-1 rounded-full text-xs font-medium text-[#31523A]">
                <User className="w-3.5 h-3.5 text-[#4A7C59]" />
                <span className="font-semibold">{session.user.pseudonym}</span>
              </div>
            )}

            {/* Trauma-Informed Safe Exit Button */}
            <button
              type="button"
              onClick={handleSafeExit}
              title="Tutup cepat ke Google jika butuh privasi darurat"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Safe Exit</span>
            </button>

            {session && (
              <button
                type="button"
                onClick={onLogout}
                title="Keluar dari sesi"
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <MobileNav
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        isCounselor={Boolean(isCounselor)}
      />
    </header>
  );
};
