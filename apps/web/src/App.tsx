import type { Dass21Result, VakResult } from '@safespace/shared';
import { useCallback, useEffect, useState } from 'react';
import { Dass21Wizard } from './components/assessment/Dass21Wizard';
import { MoodJournalBox } from './components/assessment/MoodJournalBox';
import { VakWizard } from './components/assessment/VakWizard';
import { GoogleOAuthCard } from './components/auth/GoogleOAuthCard';
import { ChatRoom } from './components/chat/ChatRoom';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { CounselorQueue } from './components/dashboard/CounselorQueue';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { AboutSection } from './components/home/AboutSection';
import { LandingHero } from './components/home/LandingHero';
import { AnonymousBanner } from './components/layout/AnonymousBanner';
import { Navbar } from './components/layout/Navbar';
import type { AuthSession } from './services/api';

const parseTabFromHash = (hash: string): string => {
  const clean = hash.replace(/^#\/?/, '').split('?')[0].trim().toLowerCase();
  switch (clean) {
    case 'tentang':
    case 'about':
      return 'about';
    case 'auth':
    case 'login':
    case 'masuk':
      return 'auth';
    case 'app/dashboard':
    case 'dashboard':
    case 'mahasiswa/dashboard':
      return 'dashboard';
    case 'app/asesmen':
    case 'asesmen':
    case 'assessment':
      return 'assessment';
    case 'app/curhat':
    case 'curhat':
    case 'mood':
      return 'mood';
    case 'konselor/antrean':
    case 'antrean-konselor':
    case 'counselor-queue':
      return 'counselor-queue';
    case 'admin/dashboard':
    case 'admin/users':
    case 'admin':
      return 'admin';
    case 'app/chat':
    case 'konselor/chat':
    case 'chat':
      return 'chat';
    default:
      return 'home';
  }
};

const mapTabToHash = (tab: string): string => {
  switch (tab) {
    case 'about':
      return '#/tentang';
    case 'auth':
      return '#/auth';
    case 'dashboard':
      return '#/app/dashboard';
    case 'assessment':
      return '#/app/asesmen';
    case 'mood':
      return '#/app/curhat';
    case 'counselor-queue':
      return '#/konselor/antrean';
    case 'admin':
      return '#/admin/dashboard';
    case 'chat':
      return '#/app/chat';
    default:
      return '#/';
  }
};

function ProtectedAuthGate({
  badge,
  badgeColorClass,
  title,
  description,
  onLoginSuccess,
}: {
  readonly badge: string;
  readonly badgeColorClass: string;
  readonly title: string;
  readonly description: string;
  readonly onLoginSuccess: (s: AuthSession) => void;
}) {
  return (
    <div className="max-w-lg mx-auto py-8 text-center space-y-4">
      <div className="space-y-1">
        <span className={`text-[11px] font-bold ${badgeColorClass} uppercase tracking-wider`}>
          {badge}
        </span>
        <h2 className="text-xl font-bold text-[#1E293B]">{title}</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{description}</p>
      </div>
      <GoogleOAuthCard onLoginSuccess={onLoginSuccess} />
    </div>
  );
}

function AssessmentTabContent({
  subTab,
  onSubTabChange,
  token,
  onDass21Complete,
  onVakComplete,
  onRequestTicket,
}: {
  readonly subTab: 'dass21' | 'vak';
  readonly onSubTabChange: (tab: 'dass21' | 'vak') => void;
  readonly token?: string;
  readonly onDass21Complete: (res: Dass21Result) => void;
  readonly onVakComplete: (res: VakResult) => void;
  readonly onRequestTicket: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3 max-w-md mx-auto p-1 bg-slate-200/60 rounded-xl">
        <button
          type="button"
          onClick={() => onSubTabChange('dass21')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            subTab === 'dass21'
              ? 'bg-white text-[#31523A] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Pemetaan Emosi (DASS-21)
        </button>
        <button
          type="button"
          onClick={() => onSubTabChange('vak')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            subTab === 'vak'
              ? 'bg-white text-[#24365D] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Gaya Belajar (VAK)
        </button>
      </div>

      {subTab === 'dass21' ? (
        <Dass21Wizard
          token={token}
          onComplete={onDass21Complete}
          onRequestTicket={onRequestTicket}
        />
      ) : (
        <VakWizard token={token} onComplete={onVakComplete} />
      )}
    </div>
  );
}

interface MainRouterProps {
  readonly currentTab: string;
  readonly session: AuthSession | null;
  readonly dass21Result: Dass21Result | null;
  readonly vakResult: VakResult | null;
  readonly assessmentSubTab: 'dass21' | 'vak';
  readonly activeSessionId: string | null;
  readonly onNavigateTab: (tab: string) => void;
  readonly onLoginSuccess: (session: AuthSession) => void;
  readonly onAssessmentSubTabChange: (tab: 'dass21' | 'vak') => void;
  readonly onDass21Complete: (res: Dass21Result) => void;
  readonly onVakComplete: (res: VakResult) => void;
  readonly onEnterChat: (sessionId: string) => void;
}

function PublicContentRouter({
  currentTab,
  session,
  onNavigateTab,
  onLoginSuccess,
}: Pick<MainRouterProps, 'currentTab' | 'session' | 'onNavigateTab' | 'onLoginSuccess'>) {
  if (currentTab === 'about') {
    return (
      <AboutSection
        onStartAssessment={() => onNavigateTab(session ? 'assessment' : 'auth')}
        onGoToLogin={() => onNavigateTab('auth')}
      />
    );
  }

  if (currentTab === 'auth') {
    return (
      <ProtectedAuthGate
        badge="Portal Otentikasi"
        badgeColorClass="text-[#4A7C59]"
        title="Masuk / Daftar ke SafeSpace PWA"
        description="Akses konsultasi privat, asesmen mandiri terukur, dan tiket pra-konseling aman."
        onLoginSuccess={onLoginSuccess}
      />
    );
  }

  return <LandingHero session={session} onNavigateTab={onNavigateTab} />;
}

function StudentContentRouter(props: MainRouterProps) {
  const {
    currentTab,
    session,
    dass21Result,
    vakResult,
    assessmentSubTab,
    onNavigateTab,
    onLoginSuccess,
    onAssessmentSubTabChange,
    onDass21Complete,
    onVakComplete,
    onEnterChat,
  } = props;

  if (currentTab === 'assessment') {
    if (!session) {
      return (
        <ProtectedAuthGate
          badge="Rute Terproteksi"
          badgeColorClass="text-[#4A7C59]"
          title="Otentikasi Diperlukan untuk Asesmen"
          description="Silakan masuk atau daftar menggunakan akun Google untuk mengakses dan menyimpan instrumen DASS-21 serta VAK."
          onLoginSuccess={onLoginSuccess}
        />
      );
    }
    return (
      <AssessmentTabContent
        subTab={assessmentSubTab}
        onSubTabChange={onAssessmentSubTabChange}
        token={session?.token}
        onDass21Complete={onDass21Complete}
        onVakComplete={onVakComplete}
        onRequestTicket={() => onNavigateTab('dashboard')}
      />
    );
  }

  if (currentTab === 'mood') {
    if (!session) {
      return (
        <ProtectedAuthGate
          badge="Rute Terproteksi"
          badgeColorClass="text-[#4A7C59]"
          title="Otentikasi Diperlukan untuk Curhat"
          description="Silakan masuk atau daftar terlebih dahulu untuk menggunakan fitur jurnal curhat dan refleksi mood harian."
          onLoginSuccess={onLoginSuccess}
        />
      );
    }
    return (
      <MoodJournalBox token={session?.token} onRequestTicket={() => onNavigateTab('dashboard')} />
    );
  }

  // currentTab === 'dashboard'
  if (!session) {
    return (
      <ProtectedAuthGate
        badge="Rute Terproteksi"
        badgeColorClass="text-[#4A7C59]"
        title="Akses Dashboard Sesi Mahasiswa"
        description="Dashboard ini mengelola status pemulihan burnout dan penerbitan tiket konseling pribadi. Silakan masuk terlebih dahulu untuk mengakses data Anda."
        onLoginSuccess={onLoginSuccess}
      />
    );
  }

  return (
    <StudentDashboard
      session={session}
      dass21Result={dass21Result}
      vakResult={vakResult}
      onNavigateAssessment={() => {
        onAssessmentSubTabChange('dass21');
        onNavigateTab('assessment');
      }}
      onEnterChat={onEnterChat}
    />
  );
}

function StaffContentRouter(props: MainRouterProps) {
  const { currentTab, session, activeSessionId, onNavigateTab, onLoginSuccess, onEnterChat } =
    props;

  const isCounselorOrAdmin = session?.user.role === 'counselor' || session?.user.role === 'admin';
  const isAdmin = session?.user.role === 'admin';

  if (currentTab === 'counselor-queue') {
    if (!session || !isCounselorOrAdmin) {
      return (
        <ProtectedAuthGate
          badge="Rute Khusus Konselor / Dosen BK"
          badgeColorClass="text-[#3B5998]"
          title="Antrean Triage Konselor Sebaya &amp; Dosen BK"
          description="Halaman ini khusus untuk staf konselor sebaya, dosen pembimbing, dan administrator terdaftar. Silakan masuk menggunakan akun konselor resmi."
          onLoginSuccess={onLoginSuccess}
        />
      );
    }
    return <CounselorQueue session={session} onEnterChat={onEnterChat} />;
  }

  if (currentTab === 'admin') {
    if (!session || !isAdmin) {
      return (
        <ProtectedAuthGate
          badge="Rute Khusus Administrator"
          badgeColorClass="text-purple-700"
          title="Panel Sysadmin &amp; Manajemen Peran"
          description="Halaman ini hanya dapat diakses oleh Administrator Sistem yang terdaftar pada konfigurasi resmi SafeSpace."
          onLoginSuccess={onLoginSuccess}
        />
      );
    }
    return (
      <AdminDashboard session={session} onNavigateQueue={() => onNavigateTab('counselor-queue')} />
    );
  }

  if (currentTab === 'chat' && session) {
    return (
      <ChatRoom
        sessionId={activeSessionId || 'default-demo-session'}
        session={session}
        onBack={() => {
          if (session.user.role === 'admin') {
            onNavigateTab('admin');
          } else if (session.user.role === 'counselor') {
            onNavigateTab('counselor-queue');
          } else {
            onNavigateTab('dashboard');
          }
        }}
      />
    );
  }

  return (
    <PublicContentRouter
      currentTab="home"
      session={session}
      onNavigateTab={onNavigateTab}
      onLoginSuccess={onLoginSuccess}
    />
  );
}

function MainContentRouter(props: MainRouterProps) {
  const { currentTab } = props;

  if (currentTab === 'home' || currentTab === 'about' || currentTab === 'auth') {
    return <PublicContentRouter {...props} />;
  }

  if (currentTab === 'assessment' || currentTab === 'mood' || currentTab === 'dashboard') {
    return <StudentContentRouter {...props} />;
  }

  return <StaffContentRouter {...props} />;
}

export function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return parseTabFromHash(window.location.hash);
    }
    return 'home';
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem('safespace_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [dass21Result, setDass21Result] = useState<Dass21Result | null>(() => {
    const saved = localStorage.getItem('safespace_dass21');
    return saved ? JSON.parse(saved) : null;
  });

  const [vakResult, setVakResult] = useState<VakResult | null>(() => {
    const saved = localStorage.getItem('safespace_vak');
    return saved ? JSON.parse(saved) : null;
  });

  const [assessmentSubTab, setAssessmentSubTab] = useState<'dass21' | 'vak'>('dass21');

  const navigateToTab = useCallback((tab: string) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      const targetHash = mapTabToHash(tab);
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const tab = parseTabFromHash(window.location.hash);
      setCurrentTab(tab);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (session) {
      localStorage.setItem('safespace_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('safespace_session');
    }
  }, [session]);

  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    if (newSession.user.role === 'admin') {
      navigateToTab('admin');
    } else if (newSession.user.role === 'counselor') {
      navigateToTab('counselor-queue');
    } else {
      navigateToTab('dashboard');
    }
  };

  const handleLogout = () => {
    setSession(null);
    navigateToTab('home');
  };

  const handleDass21Complete = (res: Dass21Result) => {
    setDass21Result(res);
    localStorage.setItem('safespace_dass21', JSON.stringify(res));
  };

  const handleVakComplete = (res: VakResult) => {
    setVakResult(res);
    localStorage.setItem('safespace_vak', JSON.stringify(res));
  };

  const handleEnterChat = (sessionId: string) => {
    setActiveSessionId(sessionId);
    navigateToTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F6] text-[#1E293B] flex flex-col font-sans">
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveSessionId(null);
          navigateToTab(tab);
        }}
        session={session}
        onLogout={handleLogout}
      />

      <AnonymousBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MainContentRouter
          currentTab={currentTab}
          session={session}
          dass21Result={dass21Result}
          vakResult={vakResult}
          assessmentSubTab={assessmentSubTab}
          activeSessionId={activeSessionId}
          onNavigateTab={navigateToTab}
          onLoginSuccess={handleLoginSuccess}
          onAssessmentSubTabChange={setAssessmentSubTab}
          onDass21Complete={handleDass21Complete}
          onVakComplete={handleVakComplete}
          onEnterChat={handleEnterChat}
        />
      </main>

      <footer className="border-t border-[#E2E8F0] bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-medium text-[#1E293B]">
            SafeSpace PWA: Sistem Pra-Konseling Anonim &amp; Deteksi Dini Academic Burnout
          </p>
          <p className="text-[11px] text-slate-400">
            Ekosistem Pendidikan Jarak Jauh (PJJ) &bull; Arsitektur Zero-Knowledge &amp; Two-Way
            Anonymity
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
