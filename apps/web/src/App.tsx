import type { Dass21Result, VakResult } from '@safespace/shared';
import { useEffect, useState } from 'react';
import { Dass21Wizard } from './components/assessment/Dass21Wizard';
import { MoodJournalBox } from './components/assessment/MoodJournalBox';
import { VakWizard } from './components/assessment/VakWizard';
import { ChatRoom } from './components/chat/ChatRoom';
import { CounselorQueue } from './components/dashboard/CounselorQueue';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { LandingHero } from './components/home/LandingHero';
import { AnonymousBanner } from './components/layout/AnonymousBanner';
import { Navbar } from './components/layout/Navbar';
import type { AuthSession } from './services/api';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
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
    // Default initial mock student session for immediate usability & demo
    return {
      token: 'demo_student_jwt_token',
      user: {
        id: '0192e4a8-6f1b-789a-bcde-000000000001',
        role: 'student',
        pseudonym: 'Mahasiswa #4829',
      },
    };
  });

  const [dass21Result, setDass21Result] = useState<Dass21Result | null>(() => {
    const saved = localStorage.getItem('safespace_dass21');
    return saved ? JSON.parse(saved) : null;
  });

  const [vakResult, setVakResult] = useState<VakResult | null>(() => {
    const saved = localStorage.getItem('safespace_vak');
    return saved ? JSON.parse(saved) : null;
  });

  // Assessment sub-tab: 'dass21' | 'vak'
  const [assessmentSubTab, setAssessmentSubTab] = useState<'dass21' | 'vak'>('dass21');

  useEffect(() => {
    if (session) {
      localStorage.setItem('safespace_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('safespace_session');
    }
  }, [session]);

  const handleSelectRole = (role: 'student' | 'counselor') => {
    if (role === 'student') {
      const studentSession: AuthSession = {
        token: 'demo_student_jwt_token',
        user: {
          id: '0192e4a8-6f1b-789a-bcde-000000000001',
          role: 'student',
          pseudonym: `Mahasiswa #${Math.floor(1000 + Math.random() * 9000)}`,
        },
      };
      setSession(studentSession);
      setCurrentTab('dashboard');
    } else {
      const counselorSession: AuthSession = {
        token: 'demo_counselor_jwt_token',
        user: {
          id: '0192e4a8-6f1b-789a-bcde-000000000002',
          role: 'counselor',
          pseudonym: 'Konselor_A',
        },
      };
      setSession(counselorSession);
      setCurrentTab('counselor-queue');
    }
  };

  const handleLogout = () => {
    setSession(null);
    setCurrentTab('home');
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
    setCurrentTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F6] text-[#1E293B] flex flex-col font-sans">
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveSessionId(null);
          setCurrentTab(tab);
        }}
        session={session}
        onLogout={handleLogout}
      />

      <AnonymousBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: HOME */}
        {currentTab === 'home' && (
          <LandingHero
            session={session}
            onSelectRole={handleSelectRole}
            onNavigateTab={setCurrentTab}
          />
        )}

        {/* TAB 2: ASSESSMENT */}
        {currentTab === 'assessment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 max-w-md mx-auto p-1 bg-slate-200/60 rounded-xl">
              <button
                type="button"
                onClick={() => setAssessmentSubTab('dass21')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  assessmentSubTab === 'dass21'
                    ? 'bg-white text-[#31523A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Pemetaan Emosi (DASS-21)
              </button>
              <button
                type="button"
                onClick={() => setAssessmentSubTab('vak')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  assessmentSubTab === 'vak'
                    ? 'bg-white text-[#24365D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Gaya Belajar (VAK)
              </button>
            </div>

            {assessmentSubTab === 'dass21' ? (
              <Dass21Wizard
                token={session?.token}
                onComplete={handleDass21Complete}
                onRequestTicket={() => setCurrentTab('dashboard')}
              />
            ) : (
              <VakWizard token={session?.token} onComplete={handleVakComplete} />
            )}
          </div>
        )}

        {/* TAB 3: MOOD TRACKER */}
        {currentTab === 'mood' && (
          <MoodJournalBox
            token={session?.token}
            onRequestTicket={() => setCurrentTab('dashboard')}
          />
        )}

        {/* TAB 4: STUDENT DASHBOARD */}
        {currentTab === 'dashboard' && session && (
          <StudentDashboard
            session={session}
            dass21Result={dass21Result}
            vakResult={vakResult}
            onNavigateAssessment={() => {
              setAssessmentSubTab('dass21');
              setCurrentTab('assessment');
            }}
            onEnterChat={handleEnterChat}
          />
        )}

        {/* TAB 5: COUNSELOR QUEUE */}
        {currentTab === 'counselor-queue' && session && (
          <CounselorQueue session={session} onEnterChat={handleEnterChat} />
        )}

        {/* TAB 6: CHATROOM */}
        {currentTab === 'chat' && session && (
          <ChatRoom
            sessionId={activeSessionId || 'default-demo-session'}
            session={session}
            onBack={() => {
              if (session.user.role === 'counselor') {
                setCurrentTab('counselor-queue');
              } else {
                setCurrentTab('dashboard');
              }
            }}
          />
        )}
      </main>

      <footer className="border-t border-[#E2E8F0] bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-medium text-[#1E293B]">
            SafeSpace PWA — Sistem Pra-Konseling Anonim & Deteksi Dini Academic Burnout
          </p>
          <p className="text-[11px] text-slate-400">
            Mata Kuliah STSI4401 Capstone Project • Universitas Terbuka • Arsitektur Zero-Knowledge
            & Two-Way Anonymity
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
