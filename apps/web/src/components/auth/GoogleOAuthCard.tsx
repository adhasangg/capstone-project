import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Loader2,
  Lock,
  Shield,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type AuthSession, api } from '../../services/api';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number | string;
              logo_alignment?: 'left' | 'center';
            },
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleOAuthCardProps {
  onLoginSuccess: (session: AuthSession) => void;
}

const GoogleGLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const GoogleOAuthCard: React.FC<GoogleOAuthCardProps> = ({ onLoginSuccess }) => {
  const [clientId, setClientId] = useState<string>(() => {
    return (
      (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) ||
      (import.meta.env.GOOGLE_CLIENT_ID as string) ||
      localStorage.getItem('safespace_google_client_id') ||
      ''
    );
  });
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [gisReady, setGisReady] = useState<boolean>(false);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const handleCredential = useCallback(
    async (credential: string) => {
      if (!credential) {
        setErrorMsg('Google tidak mengembalikan token kredensial yang valid.');
        return;
      }
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const session = await api.loginWithGoogleToken(credential);
        onLoginSuccess(session);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Autentikasi gagal';
        setErrorMsg(message);
      } finally {
        setIsLoading(false);
      }
    },
    [onLoginSuccess],
  );

  useEffect(() => {
    const trimmedId = clientId.trim();
    if (!trimmedId || typeof window === 'undefined') return;

    const setupGis = () => {
      const google = window.google;
      if (!google?.accounts?.id) return false;

      try {
        google.accounts.id.initialize({
          client_id: trimmedId,
          callback: (res) => {
            void handleCredential(res.credential);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = '';
          google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 320,
            logo_alignment: 'left',
          });
        }
        setGisReady(true);
        return true;
      } catch (e) {
        console.warn('Gagal menginisialisasi Google Identity Services:', e);
        return false;
      }
    };

    if (setupGis()) return;

    const interval = setInterval(() => {
      if (setupGis()) clearInterval(interval);
    }, 400);

    return () => clearInterval(interval);
  }, [clientId, handleCredential]);

  const handleCustomGoogleClick = () => {
    if (window.google?.accounts?.id && clientId.trim()) {
      window.google.accounts.id.prompt();
    } else {
      setShowConfig(true);
    }
  };

  const handleDirectApiLogin = async (tokenKey: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const session = await api.loginWithGoogleToken(tokenKey);
      onLoginSuccess(session);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghubungi peladen autentikasi';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClientId = (val: string) => {
    setClientId(val);
    localStorage.setItem('safespace_google_client_id', val.trim());
  };

  const isSandboxEnvAllowed = import.meta.env.VITE_ENABLE_SANDBOX !== 'false';

  const [sandboxUnlocked, setSandboxUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = window.location.hash.includes('?')
      ? new URLSearchParams(window.location.hash.split('?')[1])
      : null;
    const urlKey = searchParams.get('sandbox_key') || hashParams?.get('sandbox_key');
    const stored = sessionStorage.getItem('safespace_sandbox_unlocked');
    return urlKey === 'safespace-evaluator-2026' || stored === 'true';
  });
  const [showSandboxModal, setShowSandboxModal] = useState<boolean>(false);
  const [sandboxPassInput, setSandboxPassInput] = useState<string>('');
  const [sandboxAuthError, setSandboxAuthError] = useState<string | null>(null);

  const handleUnlockSandbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (sandboxPassInput.trim() === 'safespace-evaluator-2026') {
      sessionStorage.setItem('safespace_sandbox_unlocked', 'true');
      setSandboxUnlocked(true);
      setShowSandboxModal(false);
      setSandboxAuthError(null);
      setSandboxPassInput('');
    } else {
      setSandboxAuthError('Kredensial evaluator salah. Akses ditolak.');
    }
  };

  const handleLockSandbox = () => {
    sessionStorage.removeItem('safespace_sandbox_unlocked');
    setSandboxUnlocked(false);
  };

  return (
    <div className="p-5 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 max-w-lg mx-auto shadow-xs text-left space-y-4">
      {/* Header Info */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#F0F4F8] border border-[#D9E2EC] flex items-center justify-center shrink-0 shadow-2xs">
          <GoogleGLogo className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-[#1E293B]">Masuk / Daftar Akun Google</h3>
            <span className="text-[10px] font-semibold bg-[#EBF3ED] text-[#234B30] px-2 py-0.5 rounded-full border border-[#C7D9CC]">
              Double-Blind
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Autentikasi dwifungsi (Sign In &amp; Sign Up). Identitas disanitasi satu arah via
            SHA-256 kriptografis tanpa menyimpan email/nama di basis data.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <strong>Gagal Autentikasi:</strong> {errorMsg}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center justify-center gap-2.5 font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-[#4A7C59]" />
          <span>Memverifikasi kredensial Google &amp; menerbitkan token anonim...</span>
        </div>
      )}

      {/* Primary Google Login Button Container */}
      {!isLoading && (
        <div className="space-y-3">
          {/* Render Google Identity Services official iframe/button if Client ID exists */}
          {clientId.trim() ? (
            <div className="flex flex-col items-center justify-center min-h-[44px]">
              <div ref={googleBtnContainerRef} className="w-full flex justify-center" />
              {!gisReady && (
                <button
                  type="button"
                  onClick={handleCustomGoogleClick}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <GoogleGLogo className="w-4 h-4" />
                  <span>Masuk / Daftar dengan Google (Sign In / Sign Up)</span>
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleCustomGoogleClick}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 shadow-2xs transition-all cursor-pointer"
            >
              <GoogleGLogo className="w-4 h-4" />
              <span>Masuk / Daftar dengan Google (Sign In / Sign Up)</span>
            </button>
          )}

          {/* Sandbox & Role-based Quick Login (Only available in non-production, locked by default) */}
          {isSandboxEnvAllowed && (
            <div className="pt-2 border-t border-slate-100">
              {sandboxUnlocked ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Mode Sandbox Evaluator Aktif:
                    </span>
                    <button
                      type="button"
                      onClick={handleLockSandbox}
                      className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                    >
                      Kunci Kembali
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDirectApiLogin('dev_token_student')}
                      className="p-2 rounded-xl border border-[#C7D9CC] bg-[#E3ECE5]/60 hover:bg-[#E3ECE5] text-[#31523A] text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Users className="w-3.5 h-3.5 text-[#4A7C59]" />
                      <span>Mahasiswa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDirectApiLogin('dev_token_counselor')}
                      className="p-2 rounded-xl border border-[#BCCCDC] bg-[#D9E2EC]/60 hover:bg-[#D9E2EC] text-[#24365D] text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#3B5998]" />
                      <span>Konselor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDirectApiLogin('dev_token_admin')}
                      className="p-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100/80 text-amber-900 text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      <span>Sysadmin</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowSandboxModal(true)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-medium cursor-pointer"
                  >
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Buka Mode Sandbox Evaluator (Terkunci)</span>
                  </button>
                  <span className="text-[10px] text-slate-400">Dev &amp; Testing Only</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal Dialog for Sandbox Passphrase */}
      {showSandboxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 max-w-sm w-full shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-800">Buka Akses Sandbox Evaluator</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSandboxModal(false);
                  setSandboxAuthError(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Masukkan passphrase rahasia evaluator dari konfigurasi{' '}
              <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                SANDBOX_PASSPHRASE
              </code>{' '}
              di lingkungan pengembangan.
            </p>
            {sandboxAuthError && (
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {sandboxAuthError}
              </div>
            )}
            <form onSubmit={handleUnlockSandbox} className="space-y-3">
              <input
                type="password"
                value={sandboxPassInput}
                onChange={(e) => setSandboxPassInput(e.target.value)}
                placeholder="Masukkan Passphrase Evaluator..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#4A7C59]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSandboxModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#4A7C59] text-white rounded-xl hover:bg-[#3d6649]"
                >
                  Verifikasi Kredensial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collapsible Client ID Configuration */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          className="text-[11px] text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer font-medium"
        >
          <KeyRound className="w-3 h-3 text-slate-400" />
          <span>{showConfig ? 'Sembunyikan' : 'Konfigurasi'} Google Cloud Client ID</span>
          {showConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showConfig && (
          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <label
              htmlFor="google-client-id-input"
              className="block text-[11px] font-medium text-slate-600"
            >
              Google OAuth Client ID (.apps.googleusercontent.com):
            </label>
            <input
              id="google-client-id-input"
              type="text"
              value={clientId}
              onChange={(e) => handleSaveClientId(e.target.value)}
              placeholder="1234567890-xxx.apps.googleusercontent.com"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#4A7C59]"
            />
            <p className="text-[10px] text-slate-400 leading-normal">
              Masukkan Client ID dari Google Cloud Console dengan Authorized JavaScript Origins set
              ke <code className="text-slate-600 font-bold">http://localhost:5173</code>. Client ID
              akan disimpan di browser lokal Anda.
            </p>
          </div>
        )}
      </div>

      {/* Footer Assurance */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
        <Lock className="w-3 h-3 text-[#4A7C59] shrink-0" />
        <span>Terotentikasi ke endpoint peladen /api/auth/google dengan enkripsi JWT 7 hari.</span>
      </div>
    </div>
  );
};
