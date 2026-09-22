import type { Dass21Category, Dass21Result, Dass21SubscaleResult } from '../types/assessment.types';

// DASS-21 1-indexed item distributions per Lovibond & Lovibond (1995)
const DEPRESSION_INDICES = [2, 4, 9, 12, 15, 16, 20]; // items 3, 5, 10, 13, 16, 17, 21
const ANXIETY_INDICES = [1, 3, 6, 8, 14, 18, 19]; // items 2, 4, 7, 9, 15, 19, 20
const STRESS_INDICES = [0, 5, 7, 10, 11, 13, 17]; // items 1, 6, 8, 11, 12, 14, 18

function classifyDepression(score: number): Dass21Category {
  if (score <= 9) return 'Normal';
  if (score <= 13) return 'Mild';
  if (score <= 20) return 'Moderate';
  if (score <= 27) return 'Severe';
  return 'Extremely Severe';
}

function classifyAnxiety(score: number): Dass21Category {
  if (score <= 7) return 'Normal';
  if (score <= 9) return 'Mild';
  if (score <= 14) return 'Moderate';
  if (score <= 19) return 'Severe';
  return 'Extremely Severe';
}

function classifyStress(score: number): Dass21Category {
  if (score <= 14) return 'Normal';
  if (score <= 18) return 'Mild';
  if (score <= 25) return 'Moderate';
  if (score <= 33) return 'Severe';
  return 'Extremely Severe';
}

function computeSubscale(
  answers: ReadonlyArray<number>,
  indices: ReadonlyArray<number>,
  classifier: (score: number) => Dass21Category,
): Dass21SubscaleResult {
  const rawScore = indices.reduce((sum, idx) => {
    const val = answers[idx];
    return sum + (val ?? 0);
  }, 0);

  const multipliedScore = rawScore * 2;
  return {
    rawScore,
    multipliedScore,
    category: classifier(multipliedScore),
  };
}

/**
 * Calculates standard DASS-21 psychometric scores using deterministic formulas.
 *
 * @param answers - Array of exactly 21 numbers (each between 0 and 3)
 * @returns Dass21Result with subscale scores and clinical categories
 */
export function calculateDass21Score(answers: ReadonlyArray<number>): Dass21Result {
  if (answers.length !== 21) {
    throw new Error('DASS-21 requires exactly 21 answers');
  }

  for (const score of answers) {
    if (!Number.isInteger(score) || score < 0 || score > 3) {
      throw new Error('Each answer score must be an integer between 0 and 3');
    }
  }

  return {
    depression: computeSubscale(answers, DEPRESSION_INDICES, classifyDepression),
    anxiety: computeSubscale(answers, ANXIETY_INDICES, classifyAnxiety),
    stress: computeSubscale(answers, STRESS_INDICES, classifyStress),
    completedAt: new Date().toISOString(),
  };
}
