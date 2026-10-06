import { describe, expect, it } from 'bun:test';
import { dass21InputSchema, moodNarrativeInputSchema, vakInputSchema } from './assessment.schema';

describe('Assessment Schemas (TDD)', () => {
  describe('dass21InputSchema', () => {
    it('should validate valid 21 answers array with scores 0-3', () => {
      const validAnswers = Array(21).fill(1);
      const res = dass21InputSchema.safeParse({ answers: validAnswers });
      expect(res.success).toBe(true);
    });

    it('should reject when length is not 21', () => {
      const res = dass21InputSchema.safeParse({ answers: [1, 2, 3] });
      expect(res.success).toBe(false);
    });

    it('should reject when score is out of 0-3 bounds', () => {
      const answers = Array(21).fill(0);
      answers[0] = 4;
      const res = dass21InputSchema.safeParse({ answers });
      expect(res.success).toBe(false);
    });
  });

  describe('vakInputSchema', () => {
    it('should validate valid VAK modalities', () => {
      const valid = { answers: ['visual', 'auditory', 'kinesthetic'] };
      const res = vakInputSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it('should reject invalid modality', () => {
      const invalid = { answers: ['visual', 'unknown_modality', 'kinesthetic'] };
      const res = vakInputSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it('should reject fewer than 3 answers', () => {
      const invalid = { answers: ['visual', 'auditory'] };
      const res = vakInputSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe('moodNarrativeInputSchema', () => {
    it('should validate valid narrative', () => {
      const res = moodNarrativeInputSchema.safeParse({
        narrative: 'Hari ini saya merasa lelah karena tugas kuliah menumpuk.',
      });
      expect(res.success).toBe(true);
    });

    it('should reject narrative with less than 3 chars or whitespace only', () => {
      const res = moodNarrativeInputSchema.safeParse({ narrative: '   ' });
      expect(res.success).toBe(false);
    });
  });
});
