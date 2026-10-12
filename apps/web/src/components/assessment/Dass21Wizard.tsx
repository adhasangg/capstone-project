import type { Dass21Category, Dass21Result } from '@safespace/shared';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { api } from '../../services/api';

const DASS21_QUESTIONS = [
  'Saya merasa bahwa diri saya menjadi marah karena hal-hal sepele.',
  'Saya merasa mulut saya sering terasa kering.',
  'Saya sama sekali tidak dapat merasakan perasaan positif atau gembira.',
  'Saya mengalami kesulitan bernapas (misal: terengah-engah tanpa aktivitas fisik).',
  'Saya sepertinya tidak kuat lagi / merasa sangat sulit untuk memulai suatu kegiatan.',
  'Saya cenderung bereaksi berlebihan terhadap suatu situasi yang terjadi.',
  'Saya merasakan getaran atau gemetar (misalnya pada tangan atau kaki).',
  'Saya merasa telah menghabiskan banyak energi cemas / sulit menenangkan saraf.',
  'Saya merasa khawatir dengan situasi di mana saya mungkin panik atau mempermalukan diri.',
  'Saya merasa tidak ada hal baik yang dapat diharapkan di masa depan.',
  'Saya merasa diri saya gelisah dan tidak bisa diam.',
  'Saya merasa sulit untuk bersantai atau merasa tenang.',
  'Saya merasa sedih, tertekan, dan murung.',
  'Saya sulit untuk bersabar menghadapi gangguan pada hal yang sedang saya kerjakan.',
  'Saya merasa hampir panik tanpa alasan yang wajar.',
  'Saya tidak mampu merasa antusias terhadap hal apa pun dalam hidup.',
  'Saya merasa bahwa diri saya tidak berharga sebagai seorang individu.',
  'Perasaan saya menjadi mudah tersinggung atau terlalu sensitif.',
  'Saya menyadari detak jantung saya berdegup kencang tanpa aktivitas fisik berat.',
  'Saya merasa takut atau ngeri tanpa alasan yang jelas.',
  'Saya merasa bahwa hidup ini sama sekali tidak ada artinya.',
];

const LIKERT_OPTIONS = [
  {
    score: 0,
    label: 'Tidak Pernah',
    desc: 'Tidak dialami sama sekali selama 1 minggu terakhir',
  },
  {
    score: 1,
    label: 'Kadang-kadang',
    desc: 'Dialami sampai tingkat tertentu / sesekali',
  },
  {
    score: 2,
    label: 'Sering',
    desc: 'Dialami cukup sering / batas yang nyata',
  },
  {
    score: 3,
    label: 'Sangat Sering',
    desc: 'Dialami hampir setiap waktu / sangat sering',
  },
];

interface Dass21WizardProps {
  onComplete?: (result: Dass21Result) => void;
  onRequestTicket?: (result: Dass21Result) => void;
  token?: string;
}

export const Dass21Wizard: React.FC<Dass21WizardProps> = ({
  onComplete,
  onRequestTicket,
  token,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(21).fill(-1));
  const [result, setResult] = useState<Dass21Result | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectScore = (score: number) => {
    const updated = [...answers];
    updated[currentIndex] = score;
    setAnswers(updated);

    if (currentIndex < 20) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some((a) => a === -1)) {
      setError('Mohon lengkapi seluruh 21 pertanyaan sebelum melihat hasil diagnosis.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.submitDass21(answers, token);
      setResult(res);
      if (onComplete) onComplete(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses instrumen DASS-21');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers(Array(21).fill(-1));
    setCurrentIndex(0);
    setResult(null);
    setError(null);
  };

  const getCategoryBadgeClass = (category: Dass21Category) => {
    switch (category) {
      case 'Normal':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Mild':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Moderate':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Severe':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Extremely Severe':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  if (result) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-[#E3ECE5] text-[#4A7C59] flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E293B]">Hasil Pemetaan Emosional DASS-21</h2>
            <p className="text-xs text-slate-500">
              Formula Baku Lovibond & Lovibond (Dikalikan 2, Standar Internasional)
            </p>
          </div>
        </div>

        {/* 3 Subscale Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl border border-slate-100 bg-[#F9F9F6] text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Depresi (D)
            </span>
            <div className="text-2xl font-bold text-[#1E293B] mb-1">
              {result.depression.multipliedScore}
            </div>
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${getCategoryBadgeClass(
                result.depression.category,
              )}`}
            >
              {result.depression.category}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-[#F9F9F6] text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Kecemasan (A)
            </span>
            <div className="text-2xl font-bold text-[#1E293B] mb-1">
              {result.anxiety.multipliedScore}
            </div>
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${getCategoryBadgeClass(
                result.anxiety.category,
              )}`}
            >
              {result.anxiety.category}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-[#F9F9F6] text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Stres (S)
            </span>
            <div className="text-2xl font-bold text-[#1E293B] mb-1">
              {result.stress.multipliedScore}
            </div>
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${getCategoryBadgeClass(
                result.stress.category,
              )}`}
            >
              {result.stress.category}
            </span>
          </div>
        </div>

        {/* Diagnostic Assessment Banner */}
        {(() => {
          const risk = (() => {
            if (
              result.depression.category === 'Extremely Severe' ||
              result.stress.category === 'Extremely Severe'
            ) {
              return { level: 'Kritis / Sangat Berat', isHigh: true };
            }
            if (result.depression.category === 'Severe' || result.stress.category === 'Severe') {
              return { level: 'Tinggi', isHigh: true };
            }
            if (
              result.depression.category === 'Moderate' ||
              result.stress.category === 'Moderate'
            ) {
              return { level: 'Sedang (Waspada)', isHigh: false };
            }
            return { level: 'Rendah (Stabil)', isHigh: false };
          })();

          return (
            <div className="p-4 rounded-xl bg-[#F0F4F8] border border-[#D9E2EC] mb-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#3B5998] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#24365D]">
                    Tingkat Resiko Burnout: <span>{risk.level}</span>
                  </h4>
                  <p className="text-xs text-[#334155] mt-1 leading-relaxed">
                    {risk.isHigh
                      ? 'Kondisi psikologis Anda menunjukkan beban mental yang cukup tinggi akibat rutinitas belajar dan pekerjaan. Sangat disarankan untuk mendiskusikan kondisi ini secara anonim dengan konselor sebaya / psikolog kampus.'
                      : 'Kondisi psikologis Anda relatif stabil. Anda dapat memadukannya dengan pemetaan gaya belajar VAK untuk mengoptimalkan ritme belajar jarak jauh.'}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ulangi Asesmen</span>
          </button>

          {onRequestTicket ? (
            <button
              type="button"
              onClick={() => onRequestTicket(result)}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#4A7C59] to-[#3B5998] hover:opacity-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lampirkan ke Tiket Pra-Konseling</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const currentAnswer = answers[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / 21) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 max-w-2xl mx-auto">
      {/* Header & Chunking Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
          <span className="flex items-center gap-1 text-[#4A7C59] font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            Pertanyaan {currentIndex + 1} dari 21
          </span>
          <span>{progressPercent}% Selesai</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4A7C59] to-[#5B8A6E] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Trauma-Informed Question Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#F4F6F3] to-[#F9F9F6] border border-[#DCE4DE] p-6 sm:p-7 mb-6 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#E2E8F0]">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#31523A] uppercase tracking-wider bg-[#E3ECE5] px-2.5 py-0.5 rounded-full border border-[#C7D9CC]">
            Refleksi Kondisi 1 Minggu Terakhir
          </span>
          <span className="text-xs text-slate-400 font-mono font-medium">
            Butir {currentIndex + 1} / 21
          </span>
        </div>
        <div className="py-3 flex items-center justify-center min-h-[90px] text-center">
          <p className="text-base sm:text-lg font-medium text-[#1E293B] leading-relaxed max-w-xl mx-auto">
            "{DASS21_QUESTIONS[currentIndex]}"
          </p>
        </div>
      </div>

      {/* Likert Scale Options: Impeccable Tactile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
        {LIKERT_OPTIONS.map((opt) => {
          const isSelected = currentAnswer === opt.score;
          return (
            <button
              key={opt.score}
              type="button"
              onClick={() => handleSelectScore(opt.score)}
              className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3.5 select-none ${
                isSelected
                  ? 'border-[#4A7C59] bg-[#F3F7F4] shadow-xs ring-2 ring-[#4A7C59]/20'
                  : 'bg-white border-[#E2E8F0] hover:border-[#4A7C59]/50 hover:bg-[#FAFBF9] hover:shadow-2xs'
              }`}
            >
              {/* Distinct Tactile Score Badge */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#4A7C59] text-white shadow-2xs scale-102'
                    : 'bg-[#F4F6F3] text-[#334155] border border-[#E2E8F0] group-hover:border-[#4A7C59]/40 group-hover:bg-[#EBF3ED] group-hover:text-[#234B30]'
                }`}
              >
                {opt.score}
              </div>

              {/* Text Hierarchy */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm text-[#1E293B] tracking-tight">
                    {opt.label}
                  </span>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#EBF3ED] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 group-hover:border-[#4A7C59]/50 transition-colors" />
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>

        {currentIndex === 20 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || answers.includes(-1)}
            className="px-5 py-2.5 bg-[#4A7C59] hover:bg-[#3D6649] text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isLoading ? <span>Menghitung...</span> : <span>Lihat Hasil Analisis</span>}
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentIndex(Math.min(20, currentIndex + 1))}
            disabled={currentAnswer === -1}
            className="px-4 py-2 text-xs font-semibold text-[#4A7C59] hover:text-[#31523A] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
          >
            <span>Selanjutnya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
