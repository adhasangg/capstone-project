import { describe, expect, it } from 'bun:test';
import { calculateDass21Score } from './dass21.utils';

describe('calculateDass21Score (TDD)', () => {
  it('should return all Normal categories when all answers are 0', () => {
    const answers = Array(21).fill(0);
    const result = calculateDass21Score(answers);

    expect(result.depression.rawScore).toBe(0);
    expect(result.depression.multipliedScore).toBe(0);
    expect(result.depression.category).toBe('Normal');

    expect(result.anxiety.rawScore).toBe(0);
    expect(result.anxiety.multipliedScore).toBe(0);
    expect(result.anxiety.category).toBe('Normal');

    expect(result.stress.rawScore).toBe(0);
    expect(result.stress.multipliedScore).toBe(0);
    expect(result.stress.category).toBe('Normal');

    expect(result.completedAt).toBeDefined();
  });

  it('should return all Extremely Severe categories when all answers are 3', () => {
    const answers = Array(21).fill(3);
    const result = calculateDass21Score(answers);

    expect(result.depression.rawScore).toBe(21);
    expect(result.depression.multipliedScore).toBe(42);
    expect(result.depression.category).toBe('Extremely Severe');

    expect(result.anxiety.rawScore).toBe(21);
    expect(result.anxiety.multipliedScore).toBe(42);
    expect(result.anxiety.category).toBe('Extremely Severe');

    expect(result.stress.rawScore).toBe(21);
    expect(result.stress.multipliedScore).toBe(42);
    expect(result.stress.category).toBe('Extremely Severe');
  });

  it('should correctly classify Moderate depression (multiplied score 14-20)', () => {
    // Items for Depression (1-indexed): 3, 5, 10, 13, 16, 17, 21 (indices 2, 4, 9, 12, 15, 16, 20)
    const answers = Array(21).fill(0);
    answers[2] = 2; // item 3
    answers[4] = 2; // item 5
    answers[9] = 2; // item 10
    answers[12] = 2; // item 13 -> sum = 8, multiplied = 16 -> Moderate
    const result = calculateDass21Score(answers);

    expect(result.depression.rawScore).toBe(8);
    expect(result.depression.multipliedScore).toBe(16);
    expect(result.depression.category).toBe('Moderate');
    expect(result.anxiety.category).toBe('Normal');
    expect(result.stress.category).toBe('Normal');
  });

  it('should throw error if answers length is not exactly 21', () => {
    expect(() => calculateDass21Score(Array(20).fill(1))).toThrow(
      'DASS-21 requires exactly 21 answers',
    );
    expect(() => calculateDass21Score(Array(22).fill(1))).toThrow(
      'DASS-21 requires exactly 21 answers',
    );
  });

  it('should throw error if any score is out of 0-3 range', () => {
    const invalidAnswers = Array(21).fill(0);
    invalidAnswers[5] = 4;
    expect(() => calculateDass21Score(invalidAnswers)).toThrow(
      'Each answer score must be an integer between 0 and 3',
    );

    invalidAnswers[5] = -1;
    expect(() => calculateDass21Score(invalidAnswers)).toThrow(
      'Each answer score must be an integer between 0 and 3',
    );
  });
});
