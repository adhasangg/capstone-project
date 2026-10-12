import type { CounselingSessionSummary, Dass21Result, VakResult } from '@safespace/shared';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Headphones,
  LifeBuoy,
  MessageSquare,
  Move,
  PlusCircle,
  ShieldAlert,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { type AuthSession, api } from '../../services/api';

interface StudentDashboardProps {
  session: AuthSession;
  dass21Result: Dass21Result | null;
  vakResult: VakResult | null;
  onNavigateAssessment: () => void;
  onEnterChat: (sessionId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  session,
  dass21Result,
  vakResult,
  onNavigateAssessment,
  onEnterChat,
}) => {
  const [sessions, setSessions] = useState<CounselingSessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getMySessions(session.token);
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat sesi konseling');
    } finally {
      setIsLoading(false);
    }
  }, [session.token]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const handleCreateTicket = async () => {
    setIsCreatingTicket(true);
    setError(null);
    setTicketSuccess(null);
    try {
      const newSession = await api.createTicket(session.token, {
        dass21Result: dass21Result ?? undefined,
        vakResult: vakResult ?? undefined,
      });
      setTicketSuccess(`Tiket sesi pra-konseling #${newSession.id.slice(0, 8)} berhasil dibuka!`);
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuka tiket');
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const getBurnoutRiskLevel = (d: Dass21Result) => {
    if (d.depression.category === 'Extremely Severe' || d.stress.category === 'Extremely Severe') {
      return 'Sangat Tinggi (Kritis)';
    }
    if (d.depression.category === 'Severe' || d.stress.category === 'Severe') {
      return 'Tinggi (Perlu Intervensi)';
    }
    if (d.depression.category === 'Moderate' || d.stress.category === 'Moderate') {
      return 'Sedang (Waspada)';
    }
    return 'Rendah (Stabil)';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Menunggu Konselor</span>
          </span>
        );
      case 'active':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Sesi Aktif</span>
          </span>
        );
      case 'closed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#4A7C59] to-[#3B5998] rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
            Pusat Kendali Kesehatan Mental & Gaya Belajar PJJ
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
            Selamat Datang di SafeSpace PWA
          </h1>
          <p className="text-xs sm:text-sm text-slate-100 max-w-xl mt-1 leading-relaxed">
            Sistem memadukan diagnosis emosional DASS-21 dengan modalitas belajar VAK untuk
            mereduksi academic burnout selama menempuh perkuliahan di Universitas Terbuka.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateTicket}
          disabled={isCreatingTicket}
          className="px-5 py-3 bg-white text-[#31523A] hover:bg-[#F9F9F6] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4 text-[#4A7C59]" />
          <span>{isCreatingTicket ? 'Membuka Tiket...' : 'Buka Tiket Pra-Konseling'}</span>
        </button>
      </div>

      {ticketSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{ticketSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: 2 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DASS-21 Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#E3ECE5] text-[#4A7C59] flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1E293B]">Status Emosional (DASS-21)</h3>
                  <span className="text-[11px] text-slate-500">Kondisi 1 Minggu Terakhir</span>
                </div>
              </div>
              {dass21Result && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F4F6F3] text-slate-700">
                  Resiko: <strong>{getBurnoutRiskLevel(dass21Result)}</strong>
                </span>
              )}
            </div>

            {dass21Result ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-[#F9F9F6] rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Depresi
                    </span>
                    <span className="text-lg font-bold text-[#1E293B]">
                      {dass21Result.depression.multipliedScore}
                    </span>
                    <span className="text-[10px] block font-medium text-slate-600">
                      {dass21Result.depression.category}
                    </span>
                  </div>
                  <div className="p-3 bg-[#F9F9F6] rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Kecemasan
                    </span>
                    <span className="text-lg font-bold text-[#1E293B]">
                      {dass21Result.anxiety.multipliedScore}
                    </span>
                    <span className="text-[10px] block font-medium text-slate-600">
                      {dass21Result.anxiety.category}
                    </span>
                  </div>
                  <div className="p-3 bg-[#F9F9F6] rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Stres
                    </span>
                    <span className="text-lg font-bold text-[#1E293B]">
                      {dass21Result.stress.multipliedScore}
                    </span>
                    <span className="text-[10px] block font-medium text-slate-600">
                      {dass21Result.stress.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-[#F4F6F3] p-3 rounded-lg border border-[#E2E8F0]">
                  Hasil ini otomatis tersimpan di sesi lokal dan akan dilampirkan (*attached*) ke
                  konselor saat membuka tiket pra-konseling.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-slate-500 mb-3">
                  Anda belum mengisi instrumen 21 butir DASS-21.
                </p>
                <button
                  type="button"
                  onClick={onNavigateAssessment}
                  className="px-4 py-2 bg-[#E3ECE5] hover:bg-[#C7D9CC] text-[#31523A] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Mulai Asesmen DASS-21
                </button>
              </div>
            )}
          </div>

          {dass21Result && (
            <div className="pt-4 border-t border-slate-100 mt-4 flex justify-end">
              <button
                type="button"
                onClick={onNavigateAssessment}
                className="text-xs font-semibold text-[#4A7C59] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Perbarui Asesmen</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* VAK Learning Style Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#D9E2EC] text-[#3B5998] flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1E293B]">Gaya Belajar (VAK)</h3>
                  <span className="text-[11px] text-slate-500">Pedagogical Exit Strategy</span>
                </div>
              </div>
              {vakResult && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#D9E2EC] text-[#24365D] uppercase">
                  {vakResult.dominantStyle}
                </span>
              )}
            </div>

            {vakResult ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#4A7C59] flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Visual
                    </span>
                    <span>{vakResult.visual.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4A7C59] rounded-full"
                      style={{ width: `${vakResult.visual.percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#3B5998] flex items-center gap-1">
                      <Headphones className="w-3 h-3" /> Auditori
                    </span>
                    <span>{vakResult.auditory.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3B5998] rounded-full"
                      style={{ width: `${vakResult.auditory.percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#D97706] flex items-center gap-1">
                      <Move className="w-3 h-3" /> Kinestetik
                    </span>
                    <span>{vakResult.kinesthetic.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D97706] rounded-full"
                      style={{ width: `${vakResult.kinesthetic.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F0F4F8] rounded-xl border border-[#D9E2EC] text-xs text-[#24365D]">
                  <strong className="block mb-1">
                    Tips Adaptif untuk Pembelajaran Mandiri PJJ:
                  </strong>
                  {vakResult.dominantStyle === 'visual' &&
                    'Gunakan teknik Mind Mapping dan stabilo saat membaca modul dan materi digital di ruang baca online.'}
                  {vakResult.dominantStyle === 'auditory' &&
                    'Aktifkan rekaman audio/webinar kuliah dan dengarkan ulang saat perjalanan komuter kerja.'}
                  {vakResult.dominantStyle === 'kinesthetic' &&
                    'Terapkan metode Pomodoro 25 menit diselingi peregangan fisik agar terhindar dari kelesuan saat belajar mandiri.'}
                  {vakResult.dominantStyle === 'multimodal' &&
                    'Kombinasikan catatan visual dan pemutaran audio modul untuk materi dengan tingkat kompleksitas tinggi.'}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-slate-500 mb-3">
                  Anda belum mengisi pemetaan gaya belajar VAK.
                </p>
                <button
                  type="button"
                  onClick={onNavigateAssessment}
                  className="px-4 py-2 bg-[#D9E2EC] hover:bg-[#BCCCDC] text-[#24365D] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Mulai Kuesioner VAK
                </button>
              </div>
            )}
          </div>

          {vakResult && (
            <div className="pt-4 border-t border-slate-100 mt-4 flex justify-end">
              <button
                type="button"
                onClick={onNavigateAssessment}
                className="text-xs font-semibold text-[#3B5998] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ulangi Kuesioner VAK</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Counseling Sessions / Helpdesk Tickets List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#1E293B]">
              Daftar Tiket & Sesi Pra-Konseling Saya
            </h2>
            <p className="text-xs text-slate-500">
              Riwayat percakapan anonim terenkripsi bersama konselor sebaya atau psikolog
            </p>
          </div>
          <button
            type="button"
            onClick={loadSessions}
            disabled={isLoading}
            className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {isLoading ? 'Menyegarkan...' : 'Refresh'}
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-[#F9F9F6] rounded-xl border border-dashed border-slate-200">
            <LifeBuoy className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[#1E293B]">Belum Ada Tiket Aktif</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Jika beban perkuliahan atau pekerjaan membuat Anda penat, jangan ragu membuka tiket
              pra-konseling dengan mengklik tombol di atas.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessions.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1E293B]">
                      Tiket #{item.id.slice(0, 8)}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#E3ECE5] text-[#31523A] border border-[#C7D9CC]">
                      Samaran Sesi: <strong>{item.studentPseudonym}</strong>
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>
                      Konselor: {item.counselorId ? 'Konselor Ditugaskan' : 'Menunggu penugasan...'}
                    </span>
                    {item.dass21Score && (
                      <span className="text-emerald-700 font-medium">✓ DASS-21 Terlampir</span>
                    )}
                    {item.vakResult && (
                      <span className="text-blue-700 font-medium">✓ VAK Terlampir</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onEnterChat(item.id)}
                  className="px-4 py-2 bg-[#E3ECE5] hover:bg-[#C7D9CC] text-[#31523A] font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Buka Chatroom</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
