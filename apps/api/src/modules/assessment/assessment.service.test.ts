import { describe, expect, it } from 'bun:test';
import { AssessmentService } from './assessment.service';

describe('AssessmentService (TDD)', () => {
  const service = new AssessmentService();

  describe('DASS-21 processing', () => {
    it('should compute DASS-21 scores mathematically without AI hallucinations', () => {
      const answers = Array(21).fill(1); // 7 items per subscale * 1 * 2 = 14
      const result = service.processDass21(answers);

      expect(result.depression.multipliedScore).toBe(14);
      expect(result.depression.category).toBe('Moderate');
      expect(result.anxiety.multipliedScore).toBe(14);
      expect(result.anxiety.category).toBe('Moderate');
      expect(result.stress.multipliedScore).toBe(14);
      expect(result.stress.category).toBe('Normal');
    });
  });

  describe('VAK processing', () => {
    it('should compute VAK modality distribution deterministically', () => {
      const answers = [
        'visual',
        'visual',
        'visual',
        'visual',
        'auditory',
        'auditory',
        'kinesthetic',
        'kinesthetic',
      ] as const;

      const result = service.processVak(answers);

      expect(result.totalQuestionsAnswered).toBe(8);
      expect(result.visual.percentage).toBe(50);
      expect(result.dominantStyle).toBe('visual');
    });
  });

  describe('Mood Tracker narrative analysis', () => {
    it('should detect severe distress in narrative and recommend pra-konseling ticket', async () => {
      const narrative = 'Saya merasa sangat lelah, kewalahan kuliah, dan ingin menyerah.';
      const analysis = await service.analyzeMoodNarrative(narrative);

      expect(analysis.sentiment).toBe('severe_distress');
      expect(analysis.shouldRecommendCounseling).toBe(true);
      expect(analysis.empatheticMessage).toContain('valid');
    });

    it('should handle neutral/mild daily reflections without pushing ticket', async () => {
      const narrative = 'Hari ini saya belajar modul 3 dan membaca ringkasan tugas.';
      const analysis = await service.analyzeMoodNarrative(narrative);

      expect(analysis.sentiment).toBe('neutral');
      expect(analysis.shouldRecommendCounseling).toBe(false);
      expect(analysis.empatheticMessage).toBeDefined();
    });
  });
});
