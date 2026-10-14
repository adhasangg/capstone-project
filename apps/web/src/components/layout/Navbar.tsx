import { AlertTriangle, LogIn, LogOut, Shield, ShieldCheck, User } from 'lucide-react';
import type React from 'react';
import type { AuthSession } from '../../services/api';

interface NavbarProps {
  readonly currentTab: string;
  readonly onSelectTab: (tab: string) => void;
  readonly session: AuthSession | null;
  readonly onLogout: () => void;
  readonly isOnline?: boolean;
  readonly unsyncedCount?: number;
}

interface NavLinksProps {
  readonly currentTab: string;
  readonly onSelectTab: (tab: string) => void;
}

const PublicNavLinks: React.FC<NavLinksProps> = ({ currentTab, onSelectTab }) => (
  <>
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
      onClick={() => onSelectTab('about')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        currentTab === 'about'
          ? 'bg-[#E3ECE5] text-[#31523A]'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      Tentang SafeSpace
    </button>
  </>
);

const StudentNavLinks: React.FC<NavLinksProps> = ({ currentTab, onSelectTab }) => (
  <>
    <button
      type="button"
      onClick={() => onSelectTab('dashboard')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        currentTab === 'dashboard'
          ? 'bg-[#E3ECE5] text-[#31523A]'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      Dashboard
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
      Curhat Refleksi
    </button>
    <button
      type="button"
      onClick={() => onSelectTab('docs')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        currentTab === 'docs'
          ? 'bg-[#E3ECE5] text-[#31523A]'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      Panduan
    </button>
  </>
);

const CounselorNavLinks: React.FC<NavLinksProps> = ({ currentTab, onSelectTab }) => (
  <>
    <button
      type="button"
      onClick={() => onSelectTab('counselor-queue')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        currentTab === 'counselor-queue'
          ? 'bg-[#D9E2EC] text-[#24365D]'
          : 'text-[#3B5998] hover:bg-[#F0F4F8]'
      }`}
    >
      Antrean Triage Konselor
    </button>
    <button
      type="button"
      onClick={() => onSelectTab('docs')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        currentTab === 'docs'
          ? 'bg-[#D9E2EC] text-[#24365D]'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      Panduan
    </button>
  </>
);

const AdminNavLinks: React.FC<NavLinksProps> = ({ currentTab, onSelectTab }) => (
  <>
    <button
      type="button"
      onClick={() => onSelectTab('admin')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        currentTab === 'admin'
          ? 'bg-purple-100 text-purple-800'
          : 'text-purple-700 hover:bg-purple-50'
      }`}
    >
      Panel Sysadmin
    </button>
    <button
      type="button"
      onClick={() => onSelectTab('counselor-queue')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        currentTab === 'counselor-queue'
          ? 'bg-[#D9E2EC] text-[#24365D]'
          : 'text-[#3B5998] hover:bg-[#F0F4F8]'
      }`}
    >
      Antrean Konseling
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
      Simulasi Mahasiswa
    </button>
    <button
      type="button"
      onClick={() => onSelectTab('docs')}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        currentTab === 'docs'
          ? 'bg-purple-100 text-purple-800'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      Panduan
    </button>
  </>
);

const UserRoleBadge: React.FC<{ readonly session: AuthSession }> = ({ session }) => {
  const role = session.user.role;
  const isSysadmin = role === 'admin';
  const isCounselor = role === 'counselor';

  const badgeClass = isSysadmin
    ? 'bg-purple-100 text-purple-800'
    : isCounselor
      ? 'bg-blue-100 text-blue-800'
      : 'bg-emerald-100 text-emerald-800';

  const badgeText = isSysadmin ? 'Sysadmin' : isCounselor ? 'Konselor' : 'Mahasiswa';
  const displayName = isSysadmin || isCounselor ? session.user.pseudonym : 'Akun Mahasiswa';

  return (
    <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-2xs shrink-0 max-w-[125px] sm:max-w-none">
      {isSysadmin ? (
        <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
      ) : (
        <User className="w-3.5 h-3.5 text-[#4A7C59] shrink-0" />
      )}
      <span className="font-semibold text-slate-800 truncate hidden sm:inline">{displayName}</span>
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${badgeClass}`}>
        {badgeText}
      </span>
    </div>
  );
};

const MobileNav: React.FC<{
  readonly currentTab: string;
  readonly onSelectTab: (tab: string) => void;
  readonly session: AuthSession | null;
}> = ({ currentTab, onSelectTab, session }) => {
  if (!session) {
    return (
      <div className="md:hidden flex items-center justify-center gap-8 border-t border-[#E2E8F0] bg-white py-2.5 px-4 text-xs shadow-2xs">
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
            currentTab === 'home'
              ? 'text-[#31523A] bg-[#E3ECE5] font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Beranda
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('about')}
          className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
            currentTab === 'about'
              ? 'text-[#31523A] bg-[#E3ECE5] font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tentang SafeSpace
        </button>
      </div>
    );
  }

  const role = session.user.role;

  return (
    <div className="md:hidden flex items-center justify-around border-t border-[#E2E8F0] bg-white py-2 px-1 text-xs overflow-x-auto">
      {role === 'admin' && (
        <>
          <button
            type="button"
            onClick={() => onSelectTab('admin')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
              currentTab === 'admin' ? 'text-purple-800 bg-purple-50 font-bold' : 'text-slate-600'
            }`}
          >
            Sysadmin
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('counselor-queue')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
              currentTab === 'counselor-queue'
                ? 'text-[#24365D] bg-[#D9E2EC] font-bold'
                : 'text-slate-600'
            }`}
          >
            Antrean
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('docs')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
              currentTab === 'docs' ? 'text-purple-800 bg-purple-50 font-bold' : 'text-slate-600'
            }`}
          >
            Panduan Sysadmin
          </button>
        </>
      )}

      {role === 'counselor' && (
        <>
          <button
            type="button"
            onClick={() => onSelectTab('counselor-queue')}
            className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
              currentTab === 'counselor-queue'
                ? 'text-[#24365D] bg-[#D9E2EC] font-bold'
                : 'text-slate-600'
            }`}
          >
            Antrean Konseling
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('docs')}
            className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
              currentTab === 'docs'
                ? 'text-[#24365D] bg-[#D9E2EC] font-bold'
                : 'text-slate-600'
            }`}
          >
            Panduan Konselor
          </button>
        </>
      )}

      {role === 'student' && (
        <>
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
              currentTab === 'dashboard'
                ? 'text-[#31523A] bg-[#E3ECE5] font-bold'
                : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('assessment')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
              currentTab === 'assessment'
                ? 'text-[#31523A] bg-[#E3ECE5] font-bold'
                : 'text-slate-600'
            }`}
          >
            Asesmen
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('mood')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
              currentTab === 'mood'
                ? 'text-[#31523A] bg-[#E3ECE5] font-bold'
                : 'text-slate-600'
            }`}
          >
            Curhat
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('docs')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
              currentTab === 'docs'
                ? 'text-[#31523A] bg-[#E3ECE5] font-bold'
                : 'text-slate-600'
            }`}
          >
            Panduan
          </button>
        </>
      )}
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  session,
  onLogout,
  isOnline = true,
  unsyncedCount = 0,
}) => {
  const handleSafeExit = () => {
    window.location.replace('https://www.google.com');
  };

  const handleBrandClick = () => {
    if (!session) {
      onSelectTab('home');
      return;
    }
    if (session.user.role === 'admin') {
      onSelectTab('admin');
      return;
    }
    if (session.user.role === 'counselor') {
      onSelectTab('counselor-queue');
      return;
    }
    onSelectTab('dashboard');
  };

  const role = session?.user.role;

  return (
    <header className="sticky top-0 z-50 bg-[#F9F9F6]/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & System Brand */}
          <button
            type="button"
            className="flex items-center gap-2 sm:gap-3 cursor-pointer text-left bg-transparent border-0 p-0 shrink-0"
            onClick={handleBrandClick}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#4A7C59] to-[#3B5998] flex items-center justify-center text-white font-bold shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-[#1E293B] block leading-tight">
                SafeSpace{' '}
                <span className="text-[#4A7C59] text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                  PWA
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden md:block">
                Pra-Konseling &amp; Deteksi Burnout PJJ
              </span>
            </div>
          </button>

          {/* Navigation Links: Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {!session && <PublicNavLinks currentTab={currentTab} onSelectTab={onSelectTab} />}
            {session && role === 'student' && (
              <StudentNavLinks currentTab={currentTab} onSelectTab={onSelectTab} />
            )}
            {session && role === 'counselor' && (
              <CounselorNavLinks currentTab={currentTab} onSelectTab={onSelectTab} />
            )}
            {session && role === 'admin' && (
              <AdminNavLinks currentTab={currentTab} onSelectTab={onSelectTab} />
            )}
          </nav>

          {/* Header Kanan: Status Akun, Status Koneksi, Tombol Masuk/Daftar & Safe Exit */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Online / Offline Status Badge */}
            {isOnline ? (
              <div
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-semibold"
                title="Aplikasi terhubung ke internet dan tersinkronisasi"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Online</span>
              </div>
            ) : (
              <div
                className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[10px] sm:text-[11px] font-semibold shrink-0"
                title="Mode offline aktif"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                <span>Offline</span>
              </div>
            )}

            {unsyncedCount > 0 && (
              <div
                className="hidden md:flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold"
                title={`${unsyncedCount} asesmen tersimpan di perangkat menunggu sinkronisasi`}
              >
                <span>{unsyncedCount} antrean</span>
              </div>
            )}

            {!session && (
              <button
                type="button"
                onClick={() => onSelectTab('auth')}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 bg-[#4A7C59] hover:bg-[#3D6649] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Masuk / Daftar</span>
                <span className="xs:hidden">Masuk</span>
              </button>
            )}

            {session && <UserRoleBadge session={session} />}

            {/* Trauma-Informed Safe Exit Button */}
            <button
              type="button"
              onClick={handleSafeExit}
              title="Tutup cepat ke Google jika butuh privasi darurat"
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Safe Exit</span>
              <span className="sm:hidden text-[11px]">Exit</span>
            </button>

            {session && (
              <button
                type="button"
                onClick={onLogout}
                title="Keluar dari sesi"
                className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <MobileNav currentTab={currentTab} onSelectTab={onSelectTab} session={session} />
    </header>
  );
};
