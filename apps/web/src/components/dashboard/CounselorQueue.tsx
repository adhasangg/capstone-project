import type { CounselingSessionSummary } from '@safespace/shared';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  History,
  MessageSquare,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { type AuthSession, api } from '../../services/api';

interface CounselorQueueProps {
  session: AuthSession;
  onEnterChat: (sessionId: string) => void;
}

export const CounselorQueue: React.FC<CounselorQueueProps> = ({ session, onEnterChat }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  const [queue, setQueue] = useState<CounselingSessionSummary[]>([]);
  const [history, setHistory] = useState<CounselingSessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [queueData, historyData] = await Promise.all([
        api.getCounselorQueue(session.token),
        api.getCounselorHistory(session.token),
      ]);
      setQueue(queueData);
      setHistory(historyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data konselor');
    } finally {
      setIsLoading(false);
    }
  }, [session.token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleAccept = async (sessionId: string) => {
    setAcceptingId(sessionId);
    try {
      await api.acceptTicket(session.token, sessionId);
      await loadData();
      onEnterChat(sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menerima tiket');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#D9E2EC] border border-[#BCCCDC] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#24365D] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#3B5998]" />
            <span>Portal Konselor Sebaya & Psikolog Kampus</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1E293B]">
            Antrean Triage Pra-Konseling Anonim
          </h1>
          <p className="text-xs text-slate-600 max-w-xl mt-1 leading-relaxed">
            Data identitas mahasiswa sepenuhnya anonim (menggunakan nama samaran dinamis per tiket).
            Anda dapat meninjau profil DASS-21 dan gaya belajar VAK yang terlampir untuk merancang
            strategi pendampingan secara adaptif.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          className="px-4 py-2.5 bg-[#3B5998] hover:bg-[#2F477A] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          {isLoading ? 'Menyegarkan...' : 'Perbarui Data'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sub-Tabs: Antrean Menunggu vs Riwayat Pendampingan */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-[#24365D] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Antrean Menunggu Triage</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'queue' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {queue.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#4A7C59] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat Pendampingan Saya</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {history.length}
          </span>
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'queue' ? (
        queue.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-[#4A7C59] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#1E293B]">Antrean Triage Bersih</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Tidak ada tiket mahasiswa yang sedang menunggu respon saat ini. Sesi baru akan muncul
              secara otomatis ketika mahasiswa mengajukan tiket pra-konseling.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queue.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#3B5998]">
                        #{item.id.slice(0, 8)}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.studentPseudonym}
                      </span>
                    </div>
                    <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      Menunggu Respon
                    </span>
                  </div>

                  {/* Attached Profiles */}
                  <div className="space-y-3 mb-4">
                    {item.dass21Score ? (
                      <div className="p-3 rounded-xl bg-[#F4F7F5] border border-[#C7D9CC]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#31523A] block mb-1">
                          Lampiran Hasil DASS-21:
                        </span>
                        <div className="grid grid-cols-3 gap-1 text-center text-xs">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Depresi</span>
                            <strong className="text-[#1E293B]">
                              {item.dass21Score.depression.multipliedScore} (
                              {item.dass21Score.depression.category})
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Kecemasan</span>
                            <strong className="text-[#1E293B]">
                              {item.dass21Score.anxiety.multipliedScore} (
                              {item.dass21Score.anxiety.category})
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Stres</span>
                            <strong className="text-[#1E293B]">
                              {item.dass21Score.stress.multipliedScore} (
                              {item.dass21Score.stress.category})
                            </strong>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        Tanpa lampiran DASS-21 (Mahasiswa membuka tiket langsung)
                      </div>
                    )}

                    {item.vakResult ? (
                      <div className="p-3 rounded-xl bg-[#F0F4F8] border border-[#D9E2EC]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#24365D] block mb-1">
                          Lampiran Gaya Belajar VAK:
                        </span>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#1E293B] capitalize">
                            Dominasi: {item.vakResult.dominantStyle}
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            V: {item.vakResult.visual.percentage}% | A:{' '}
                            {item.vakResult.auditory.percentage}% | K:{' '}
                            {item.vakResult.kinesthetic.percentage}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        Tanpa lampiran gaya belajar VAK
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAccept(item.id)}
                    disabled={acceptingId === item.id}
                    className="px-4 py-2 bg-[#4A7C59] hover:bg-[#3D6649] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{acceptingId === item.id ? 'Memproses...' : 'Terima & Masuk Sesi'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : history.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <History className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1E293B]">Belum Ada Riwayat Pendampingan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Anda belum pernah menerima atau mendampingi tiket mahasiswa. Sesi yang telah Anda klaim
            dari antrean akan tercatat di sini sebagai portofolio bimbingan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#3B5998]">
                      #{item.id.slice(0, 8)}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.studentPseudonym}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                      item.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.status === 'active' ? 'Sedang Berlangsung' : 'Sesi Selesai'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {item.dass21Score && (
                    <div className="p-2.5 rounded-lg bg-[#F4F7F5] border border-[#C7D9CC] text-xs">
                      <span className="text-[10px] font-bold uppercase text-[#31523A] block">
                        DASS-21 Saat Sesi:
                      </span>
                      <span className="text-slate-700">
                        Depresi: {item.dass21Score.depression.category} • Kecemasan:{' '}
                        {item.dass21Score.anxiety.category} • Stres:{' '}
                        {item.dass21Score.stress.category}
                      </span>
                    </div>
                  )}

                  {item.vakResult && (
                    <div className="p-2.5 rounded-lg bg-[#F0F4F8] border border-[#D9E2EC] text-xs">
                      <span className="text-[10px] font-bold uppercase text-[#24365D] block">
                        Gaya Belajar:
                      </span>
                      <span className="text-slate-700 capitalize">
                        Dominasi {item.vakResult.dominantStyle} (V:{' '}
                        {item.vakResult.visual.percentage}% | A:{' '}
                        {item.vakResult.auditory.percentage}% | K:{' '}
                        {item.vakResult.kinesthetic.percentage}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => onEnterChat(item.id)}
                  className="px-4 py-2 bg-[#24365D] hover:bg-[#1A2844] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Buka Ruang Konseling</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
