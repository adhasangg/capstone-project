import { describe, expect, it } from 'bun:test';
import type { VakModality } from '../types/assessment.types';
import { calculateVakScore } from './vak.utils';

describe('calculateVakScore (TDD)', () => {
  it('should calculate compact 12-question VAK format with visual dominance', () => {
    const answers: VakModality[] = [
      'visual',
      'visual',
      'visual',
      'visual',
      'visual',
      'visual', // 6 visual
      'auditory',
      'auditory',
      'auditory', // 3 auditory
      'kinesthetic',
      'kinesthetic',
      'kinesthetic', // 3 kinesthetic
    ];

    const result = calculateVakScore(answers);

    expect(result.totalQuestionsAnswered).toBe(12);
    expect(result.visual.count).toBe(6);
    expect(result.visual.percentage).toBe(50);
    expect(result.auditory.count).toBe(3);
    expect(result.auditory.percentage).toBe(25);
    expect(result.kinesthetic.count).toBe(3);
    expect(result.kinesthetic.percentage).toBe(25);
    expect(result.dominantStyle).toBe('visual');
  });

  it('should calculate complete 30-question VAK format with kinesthetic dominance', () => {
    const answers: VakModality[] = [
      ...Array(5).fill('visual'),
      ...Array(10).fill('auditory'),
      ...Array(15).fill('kinesthetic'),
    ];

    const result = calculateVakScore(answers);

    expect(result.totalQuestionsAnswered).toBe(30);
    expect(result.visual.count).toBe(5);
    expect(result.auditory.count).toBe(10);
    expect(result.kinesthetic.count).toBe(15);
    expect(result.dominantStyle).toBe('kinesthetic');
  });

  it('should return "multimodal" when two or more modalities are tied for highest score', () => {
    const answers: VakModality[] = [
      'visual',
      'visual',
      'visual',
      'auditory',
      'auditory',
      'auditory',
      'kinesthetic',
      'kinesthetic',
    ];

    const result = calculateVakScore(answers);

    expect(result.dominantStyle).toBe('multimodal');
  });

  it('should throw an error if answers has fewer than 3 items', () => {
    expect(() => calculateVakScore([])).toThrow(
      'VAK questionnaire requires at least 3 answered questions',
    );
    expect(() => calculateVakScore(['visual', 'auditory'])).toThrow(
      'VAK questionnaire requires at least 3 answered questions',
    );
  });
});
