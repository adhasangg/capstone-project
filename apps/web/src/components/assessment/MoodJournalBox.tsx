import type { MoodTrackerAnalysis } from '@safespace/shared';
import { AlertTriangle, ArrowRight, HeartHandshake, MessageSquareHeart, Send } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { api } from '../../services/api';

const ICEBREAKERS = [
  'Saya merasa sangat lelah membagi waktu antara kerja lembur dan deadline tuton.',
  'Tugas kuliah minggu ini menumpuk dan saya merasa sulit memulai mengerjakannya.',
  'Saya merasa cemas menghadapi ujian semester dan takut tidak bisa lulus.',
  'Saya merasa kesepian belajar jarak jauh dan butuh tempat bercerita tanpa dihakimi.',
];

interface MoodJournalBoxProps {
  onRequestTicket?: () => void;
  token?: string;
}

export const MoodJournalBox: React.FC<MoodJournalBoxProps> = ({ onRequestTicket, token }) => {
  const [narrative, setNarrative] = useState('');
  const [analysis, setAnalysis] = useState<MoodTrackerAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNarrative(e.target.value);
    // Auto-expand textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
    }
  };

  const handleSelectIcebreaker = (pillText: string) => {
    setNarrative(pillText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (narrative.trim().length < 3) {
      setError('Mohon ceritakan sedikit lagi apa yang sedang Anda rasakan.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.analyzeMood(narrative, token);
      setAnalysis(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses narasi curhat');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-xl bg-[#E3ECE5] text-[#4A7C59] flex items-center justify-center">
          <MessageSquareHeart className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">Catatan Refleksi & Curhat Harian</h2>
          <p className="text-xs text-slate-500">
            Tuliskan apa pun yang mengganjal di pikiran Anda. Semua teks dienkripsi dan anonim.
          </p>
        </div>
      </div>

      {/* Pill Icebreakers to combat blank canvas syndrome */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-slate-500 block mb-2">
          Pemantik Curhat Cepat (Pill Icebreakers):
        </span>
        <div className="flex flex-wrap gap-2">
          {ICEBREAKERS.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => handleSelectIcebreaker(pill)}
              className="px-3 py-1.5 rounded-full bg-[#F4F6F3] hover:bg-[#E3ECE5] text-slate-700 hover:text-[#31523A] border border-[#E2E8F0] text-xs font-medium transition-colors text-left cursor-pointer"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Narrative Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            ref={textareaRef}
            rows={4}
            value={narrative}
            onChange={handleInput}
            placeholder="Ketik apa yang sedang Anda rasakan hari ini secara leluasa..."
            className="w-full p-4 rounded-xl border border-slate-200 focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/20 outline-none text-sm text-[#1E293B] placeholder-slate-400 resize-none transition-all"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || narrative.trim().length < 3}
            className="px-5 py-2.5 bg-[#4A7C59] hover:bg-[#3D6649] text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isLoading ? <span>Menganalisis...</span> : <span>Kirim & Resapi Refleksi</span>}
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Empathetic Feedback Analysis Card */}
      {analysis && (
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="p-5 rounded-xl bg-[#F4F7F5] border border-[#C7D9CC]">
            <div className="flex items-start gap-3">
              <HeartHandshake className="w-6 h-6 text-[#4A7C59] shrink-0 mt-0.5" />
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Respon Empati Sistem
                  </span>
                  <p className="text-sm text-[#1E293B] mt-1 leading-relaxed">
                    "{analysis.empatheticMessage}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-white border border-[#C7D9CC] text-[#31523A] font-medium">
                    Sentimen:{' '}
                    <strong className="capitalize">{analysis.sentiment.replace('_', ' ')}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-[#C7D9CC] text-[#31523A] font-medium">
                    Indikator Krisis:{' '}
                    <strong>
                      {analysis.sentiment === 'severe_distress' ? 'Terdeteksi' : 'Rendah'}
                    </strong>
                  </span>
                </div>

                {analysis.shouldRecommendCounseling && (
                  <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        Beban emosional Anda tergolong berat. Sangat disarankan untuk mengobrol
                        dengan konselor pra-konseling kami.
                      </span>
                    </div>
                    {onRequestTicket && (
                      <button
                        type="button"
                        onClick={onRequestTicket}
                        className="px-3 py-1.5 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold rounded-lg shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Buka Tiket</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
