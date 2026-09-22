import {
  type Dass21Result,
  type MoodSentimentCategory,
  type MoodTrackerAnalysis,
  type VakModality,
  type VakResult,
  calculateDass21Score,
  calculateVakScore,
} from '@safespace/shared';

const SEVERE_DISTRESS_KEYWORDS = [
  'lelah',
  'capek',
  'kewalahan',
  'menyerah',
  'putus asa',
  'burnout',
  'depresi',
  'panik',
  'cemas',
  'takut',
  'hancur',
  'bunuh',
  'mati',
];

export class AssessmentService {
  /**
   * Processes DASS-21 answers using deterministic psychological formulas.
   */
  processDass21(answers: ReadonlyArray<number>): Dass21Result {
    return calculateDass21Score(answers);
  }

  /**
   * Processes VAK learning style questionnaire mathematically.
   */
  processVak(answers: ReadonlyArray<VakModality>): VakResult {
    return calculateVakScore(answers);
  }

  /**
   * Analyzes free-form daily mood narratives for empathetic reflection.
   * Identifies distress patterns to recommend opening a pra-counseling ticket.
   */
  async analyzeMoodNarrative(narrative: string): Promise<MoodTrackerAnalysis> {
    const trimmed = narrative.trim();
    if (!trimmed) {
      throw new Error('Narrative cannot be empty');
    }

    const lower = trimmed.toLowerCase();
    const containsSevereDistress = SEVERE_DISTRESS_KEYWORDS.some((kw) => lower.includes(kw));

    let sentiment: MoodSentimentCategory = 'neutral';
    let empatheticMessage: string;
    let shouldRecommendCounseling = false;

    if (containsSevereDistress) {
      sentiment = 'severe_distress';
      shouldRecommendCounseling = true;
      empatheticMessage =
        'Perasaanmu sepenuhnya valid. Beban akademik terkadang terasa luar biasa berat, namun kamu tidak harus menghadapinya seorang diri. Kamu berhak mendapatkan ruang aman untuk didengar.';
    } else if (
      lower.includes('senang') ||
      lower.includes('semangat') ||
      lower.includes('lega') ||
      lower.includes('berhasil')
    ) {
      sentiment = 'positive';
      empatheticMessage =
        'Senang mendengar kabarmu hari ini. Terus jaga ritme belajarmu dan apresiasi setiap kemajuan kecil yang telah kamu capai.';
    } else {
      sentiment = 'neutral';
      empatheticMessage =
        'Terima kasih telah meluangkan waktu untuk mencatat perasaanmu hari ini. Menyadari emosi adalah langkah awal menjaga kesehatan mental.';
    }

    return {
      narrative: trimmed,
      sentiment,
      empatheticMessage,
      shouldRecommendCounseling,
      analyzedAt: new Date().toISOString(),
    };
  }
}
