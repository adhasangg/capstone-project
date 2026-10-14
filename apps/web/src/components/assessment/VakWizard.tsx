import type { VakModality, VakResult } from '@safespace/shared';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  Headphones,
  Lightbulb,
  Move,
  RefreshCw,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { api } from '../../services/api';
import { offlineStorage } from '../../services/offlineStorage';

interface VakScenario {
  scenario: string;
  options: {
    modality: VakModality;
    label: string;
    description: string;
  }[];
}

const VAK_SCENARIOS: VakScenario[] = [
  {
    scenario: 'Saat mempelajari materi modul kuliah baru, saya lebih mudah paham jika:',
    options: [
      {
        modality: 'visual',
        label: 'Melihat Bagan & Teks',
        description: 'Melihat bagan, diagram, atau membaca teks dengan stabilo warna.',
      },
      {
        modality: 'auditory',
        label: 'Mendengarkan Penjelasan',
        description: 'Mendengarkan penjelasan tutor atau rekaman podcast materi.',
      },
      {
        modality: 'kinesthetic',
        label: 'Mencoba Latihan Langsung',
        description: 'Mencoba mengerjakan latihan soal atau membuat rangkuman tulisan tangan.',
      },
    ],
  },
  {
    scenario: 'Ketika mengingat informasi penting dari pertemuan tutorial daring:',
    options: [
      {
        modality: 'visual',
        label: 'Ingatan Visual Layar',
        description: 'Saya mengingat tulisan di layar atau catatan teks modul.',
      },
      {
        modality: 'auditory',
        label: 'Ingatan Suara Tutor',
        description: 'Saya mengingat intonasi suara tutor saat menekankan kata kunci.',
      },
      {
        modality: 'kinesthetic',
        label: 'Ingatan Gerakan / Catatan',
        description: 'Saya mengingat aktivitas fisik atau pengetikan saat sesi berlangsung.',
      },
    ],
  },
  {
    scenario: 'Ketika menemui petunjuk tugas atau panduan penggunaan aplikasi kuliah:',
    options: [
      {
        modality: 'visual',
        label: 'Membaca Teliti',
        description: 'Saya lebih suka membaca dokumen petunjuk tertulis secara mendalam.',
      },
      {
        modality: 'auditory',
        label: 'Bertanya & Diskusi',
        description: 'Saya lebih suka bertanya langsung atau mendengarkan penjelasan orang lain.',
      },
      {
        modality: 'kinesthetic',
        label: 'Langsung Eksplorasi',
        description: 'Saya langsung mencoba mengutak-atik sistem secara mandiri tanpa panduan.',
      },
    ],
  },
  {
    scenario: 'Saat sedang berpikir keras memecahkan masalah atau soal kuliah:',
    options: [
      {
        modality: 'visual',
        label: 'Membayangkan Pola',
        description: 'Pandangan saya terfokus pada kertas/layar atau membayangkan skema solusi.',
      },
      {
        modality: 'auditory',
        label: 'Self-Talk',
        description: 'Saya cenderung bergumam atau berbicara pelan kepada diri sendiri.',
      },
      {
        modality: 'kinesthetic',
        label: 'Gerakan Fisik',
        description: 'Saya merasa perlu berjalan kecil, mengetuk pena, atau berpindah posisi.',
      },
    ],
  },
  {
    scenario: 'Dalam waktu luang di sela-sela rutinitas kerja dan kuliah PJJ:',
    options: [
      {
        modality: 'visual',
        label: 'Membaca / Menonton',
        description: 'Saya lebih menikmati membaca buku/artikel atau menonton tayangan video.',
      },
      {
        modality: 'auditory',
        label: 'Musik & Ngobrol',
        description: 'Saya lebih menikmati mendengarkan musik, podcast, atau bercengkerama.',
      },
      {
        modality: 'kinesthetic',
        label: 'Olahraga / Kerajinan',
        description: 'Saya lebih menyukai olahraga fisik, jalan santai, atau hobi motorik.',
      },
    ],
  },
  {
    scenario: 'Hal yang paling mudah mengalihkan konsentrasi saya saat belajar online:',
    options: [
      {
        modality: 'visual',
        label: 'Kekacauan Ruangan',
        description: 'Tampilan meja yang berantakan atau pergerakan objek di pandangan saya.',
      },
      {
        modality: 'auditory',
        label: 'Suara Bising Sekitar',
        description: 'Suara bising televisi, obrolan orang, atau kegaduhan di lingkungan sekitar.',
      },
      {
        modality: 'kinesthetic',
        label: 'Posisi Duduk Pegal',
        description: 'Kursi yang tidak nyaman atau keharusan duduk diam terlalu lama.',
      },
    ],
  },
  {
    scenario: 'Saat menjelaskan tugas yang rumit kepada rekan sekelompok diskusi online:',
    options: [
      {
        modality: 'visual',
        label: 'Sketsa & Bagan',
        description: 'Saya suka menggambar sketsa, diagram alir, atau membagikan ringkasan teks.',
      },
      {
        modality: 'auditory',
        label: 'Penjelasan Lisan',
        description: 'Saya menjelaskannya secara lisan melalui panggilan suara atau VN.',
      },
      {
        modality: 'kinesthetic',
        label: 'Simulasi Langsung',
        description: 'Saya mempraktikkan langsung contoh nyata langkah-langkah solusinya.',
      },
    ],
  },
  {
    scenario: 'Ketika saya merasa penat atau stres akibat deadline tugas kuliah:',
    options: [
      {
        modality: 'visual',
        label: 'Melihat Pemandangan',
        description:
          'Pikiran saya segar saat melihat lingkungan yang rapi dan ruang terbuka hijau.',
      },
      {
        modality: 'auditory',
        label: 'Mendengar Musik Santai',
        description:
          'Pikiran saya rileks saat mendengarkan alunan instrumen tenang atau bercerita.',
      },
      {
        modality: 'kinesthetic',
        label: 'Aktivitas Fisik',
        description:
          'Pikiran saya segar dengan peregangan badan, jalan santai, atau mandi air hangat.',
      },
    ],
  },
  {
    scenario: 'Cara paling efektif saya dalam mengingat istilah-istilah ilmiah yang asing:',
    options: [
      {
        modality: 'visual',
        label: 'Flashcard & Gambar',
        description: 'Membayangkan bentuk tulisan kata atau membuat catatan flashcard bergambar.',
      },
      {
        modality: 'auditory',
        label: 'Mengulang Bunyi Kata',
        description: 'Mengulang-ulang pengucapan istilah tersebut beberapa kali dengan bersuara.',
      },
      {
        modality: 'kinesthetic',
        label: 'Menulis Berulang',
        description: 'Menuliskan istilah itu berkali-kali di kertas kosong dengan pena.',
      },
    ],
  },
  {
    scenario: 'Saat mengikuti webinar atau sesi perkuliahan daring interaktif:',
    options: [
      {
        modality: 'visual',
        label: 'Slide & Chat Teks',
        description: 'Saya fokus menyimak slide presentasi dosen dan kolom diskusi teks.',
      },
      {
        modality: 'auditory',
        label: 'Suara Pembicara',
        description: 'Saya memejamkan mata atau fokus mendengarkan pemaparan pemateri.',
      },
      {
        modality: 'kinesthetic',
        label: 'Mencatat Sambil Menyimak',
        description: 'Tangan saya harus aktif mencatat poin-poin penting agar tidak mengantuk.',
      },
    ],
  },
  {
    scenario: 'Format materi pembelajaran digital yang paling mempermudah saya menguasai konsep:',
    options: [
      {
        modality: 'visual',
        label: 'E-Book & Infografis',
        description: 'Buku modul digital dengan infografis dan navigasi rapi.',
      },
      {
        modality: 'auditory',
        label: 'Audiobook & Podcast',
        description: 'Rekaman audio pembahasan modul atau siaran podcast edukasi.',
      },
      {
        modality: 'kinesthetic',
        label: 'Latihan Interaktif',
        description: 'Kuis interaktif langsung, simulasi studi kasus, atau tugas proyek praktis.',
      },
    ],
  },
  {
    scenario: 'Ketika pikiran terasa buntu saat menyusun tugas akhir atau laporan karya ilmiah:',
    options: [
      {
        modality: 'visual',
        label: 'Menata Format & Outline',
        description: 'Saya menata ulang outline, memetakan konsep, atau merapikan meja kerja.',
      },
      {
        modality: 'auditory',
        label: 'Mencari Teman Diskusi',
        description: 'Saya mengajak rekan bicara untuk memancing ide-ide segar baru.',
      },
      {
        modality: 'kinesthetic',
        label: 'Istirahat Bergerak',
        description:
          'Saya beranjak dari meja kerja, berjalan ke luar ruangan atau berolahraga sejenak.',
      },
    ],
  },
];

interface VakWizardProps {
  onComplete?: (result: VakResult) => void;
  token?: string;
}

export const VakWizard: React.FC<VakWizardProps> = ({ onComplete, token }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<VakModality[]>([]);
  const [result, setResult] = useState<VakResult | null>(null);
  const [isOfflineResult, setIsOfflineResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectOption = (modality: VakModality) => {
    const updated = [...answers];
    updated[currentIndex] = modality;
    setAnswers(updated);

    if (currentIndex < 11) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.length < 12 || answers.includes(undefined as unknown as VakModality)) {
      setError('Mohon lengkapi ke-12 skenario belajar.');
      return;
    }
    setIsLoading(true);
    setError(null);

    // Jika sedang offline, hitung langsung secara deterministik di peramban
    if (!navigator.onLine) {
      const localRes = offlineStorage.processVakOffline(answers);
      setResult(localRes);
      setIsOfflineResult(true);
      setIsLoading(false);
      if (onComplete) onComplete(localRes);
      return;
    }

    try {
      const res = await api.submitVak(answers, token);
      offlineStorage.saveVakOnline(answers, res);
      setResult(res);
      setIsOfflineResult(false);
      if (onComplete) onComplete(res);
    } catch (err) {
      console.warn('API VAK gagal, beralih ke kalkulasi deterministik luring (client-side):', err);
      const localRes = offlineStorage.processVakOffline(answers);
      setResult(localRes);
      setIsOfflineResult(true);
      if (onComplete) onComplete(localRes);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setResult(null);
    setIsOfflineResult(false);
    setError(null);
  };

  const getDominanceLabel = (dom: string) => {
    switch (dom) {
      case 'visual':
        return 'Gaya Belajar Visual';
      case 'auditory':
        return 'Gaya Belajar Auditori';
      case 'kinesthetic':
        return 'Gaya Belajar Kinestetik';
      case 'multimodal':
        return 'Gaya Belajar Multimodal (Fleksibel)';
      default:
        return dom;
    }
  };

  if (result) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-[#D9E2EC] text-[#3B5998] flex items-center justify-center">
            <Lightbulb className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E293B]">Profil Modalitas Belajar VAK Anda</h2>
            <p className="text-xs text-slate-500">
              Instrumen Baku Fleming (1992) & DePorter Quantum Learning
            </p>
          </div>
        </div>

        {isOfflineResult && (
          <div className="mb-6 p-4 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-3">
            <WifiOff className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Mode Hemat Sinyal / Offline Aktif
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Skor modalitas belajar VAK Anda berhasil dihitung 100% secara matematis di peramban
                dan tersimpan aman di cache lokal perangkat Anda. Tips belajar LMS tetap dapat
                diakses penuh secara offline.
              </p>
            </div>
          </div>
        )}

        {/* Dominance Badge */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#E3ECE5] to-[#D9E2EC] border border-[#C7D9CC] mb-6 text-center">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
            Modalitas Dominan
          </span>
          <h3 className="text-2xl font-bold text-[#1E293B] mb-2">
            {getDominanceLabel(result.dominantStyle)}
          </h3>
          <p className="text-xs text-[#31523A] max-w-md mx-auto">
            {result.dominantStyle === 'visual' &&
              'Anda memproses materi paling baik menggunakan representasi visual, peta pikiran, teks terstruktur, dan kode warna.'}
            {result.dominantStyle === 'auditory' &&
              'Anda memproses materi secara optimal melalui penjelasan lisan, rekaman diskusi audio, dan verbalisasi konsep.'}
            {result.dominantStyle === 'kinesthetic' &&
              'Anda menyerap ilmu secara mendalam melalui praktik langsung, simulasi nyata, dan belajar dengan ritme gerak berkala.'}
            {result.dominantStyle === 'multimodal' &&
              'Anda memiliki fleksibilitas tinggi memadukan berbagai gaya belajar sesuai karakteristik mata kuliah yang dihadapi.'}
          </p>
        </div>

        {/* Distribution Bars */}
        <div className="space-y-3 mb-6">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-emerald-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Visual ({result.visual.count} butir)
              </span>
              <span>{result.visual.percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4A7C59] rounded-full transition-all duration-500"
                style={{ width: `${result.visual.percentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-blue-700 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                Auditori ({result.auditory.count} butir)
              </span>
              <span>{result.auditory.percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3B5998] rounded-full transition-all duration-500"
                style={{ width: `${result.auditory.percentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-amber-700 flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5" />
                Kinestetik ({result.kinesthetic.count} butir)
              </span>
              <span>{result.kinesthetic.percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D97706] rounded-full transition-all duration-500"
                style={{ width: `${result.kinesthetic.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ulangi Kuesioner VAK</span>
          </button>
        </div>
      </div>
    );
  }

  const currentScenario = VAK_SCENARIOS[currentIndex];
  const currentAnswer = answers[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / 12) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 max-w-2xl mx-auto">
      {/* Header & Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
          <span className="flex items-center gap-1 text-[#3B5998] font-semibold">
            <Lightbulb className="w-3.5 h-3.5" />
            Skenario {currentIndex + 1} dari 12
          </span>
          <span>{progressPercent}% Selesai</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#3B5998] to-[#476A8A] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Scenario Box: Impeccable Calm Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#F0F4F8] to-[#F9FBFD] border border-[#D9E2EC] p-6 sm:p-7 mb-6 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#D9E2EC]">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#24365D] uppercase tracking-wider bg-[#D9E2EC] px-2.5 py-0.5 rounded-full border border-[#BCCCDC]">
            Skenario Aktivitas Belajar
          </span>
          <span className="text-xs text-slate-400 font-mono font-medium">
            Skenario {currentIndex + 1} / 12
          </span>
        </div>
        <div className="py-2">
          <p className="text-base sm:text-lg font-semibold text-[#1E293B] leading-relaxed">
            {currentScenario.scenario}
          </p>
        </div>
      </div>

      {/* Option Cards: Impeccable Tactile Modality Cards */}
      <div className="space-y-3 mb-6">
        {currentScenario.options.map((opt) => {
          const isSelected = currentAnswer === opt.modality;
          return (
            <button
              key={opt.modality}
              type="button"
              onClick={() => handleSelectOption(opt.modality)}
              className={`group w-full p-4.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-4 select-none ${
                isSelected
                  ? 'border-[#3B5998] bg-[#F0F4F8] shadow-xs ring-2 ring-[#3B5998]/20'
                  : 'bg-white border-[#E2E8F0] hover:border-[#3B5998]/50 hover:bg-[#FAFBF9] hover:shadow-2xs'
              }`}
            >
              {/* Modality Icon Badge */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#3B5998] text-white shadow-2xs scale-102'
                    : 'bg-[#F4F6F9] text-slate-600 border border-[#E2E8F0] group-hover:border-[#3B5998]/40 group-hover:bg-[#EBF1F7] group-hover:text-[#24365D]'
                }`}
              >
                {opt.modality === 'visual' && <Eye className="w-5 h-5" />}
                {opt.modality === 'auditory' && <Headphones className="w-5 h-5" />}
                {opt.modality === 'kinesthetic' && <Move className="w-5 h-5" />}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-sm text-[#1E293B] tracking-tight">
                    {opt.label}
                  </span>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#D9E2EC] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#3B5998]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 group-hover:border-[#3B5998]/50 transition-colors" />
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
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

        {currentIndex === 11 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || answers.length < 12}
            className="px-5 py-2.5 bg-[#3B5998] hover:bg-[#2F477A] text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isLoading ? <span>Menghitung Profil...</span> : <span>Lihat Profil Gaya Belajar</span>}
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentIndex(Math.min(11, currentIndex + 1))}
            disabled={!currentAnswer}
            className="px-4 py-2 text-xs font-semibold text-[#3B5998] hover:text-[#24365D] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
          >
            <span>Selanjutnya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
