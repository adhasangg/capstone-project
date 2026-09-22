import type { VakModality, VakResult } from '../types/assessment.types';

/**
 * Calculates VAK learning styles dynamically, supporting default 12-question format,
 * complete 30-question format, or any valid answer set (min 3 questions).
 *
 * @param answers - Array of selected modalities per question
 * @returns VakResult with scores, percentages, and dominant learning style
 */
export function calculateVakScore(answers: ReadonlyArray<VakModality>): VakResult {
  const total = answers.length;
  if (total < 3) {
    throw new Error('VAK questionnaire requires at least 3 answered questions');
  }

  let visualCount = 0;
  let auditoryCount = 0;
  let kinestheticCount = 0;

  for (const answer of answers) {
    if (answer === 'visual') visualCount++;
    else if (answer === 'auditory') auditoryCount++;
    else if (answer === 'kinesthetic') kinestheticCount++;
  }

  const visualPct = Math.round((visualCount / total) * 100);
  const auditoryPct = Math.round((auditoryCount / total) * 100);
  const kinestheticPct = Math.round((kinestheticCount / total) * 100);

  let dominantStyle: VakModality | 'multimodal';
  if (visualCount > auditoryCount && visualCount > kinestheticCount) {
    dominantStyle = 'visual';
  } else if (auditoryCount > visualCount && auditoryCount > kinestheticCount) {
    dominantStyle = 'auditory';
  } else if (kinestheticCount > visualCount && kinestheticCount > auditoryCount) {
    dominantStyle = 'kinesthetic';
  } else {
    dominantStyle = 'multimodal';
  }

  return {
    visual: { count: visualCount, percentage: visualPct },
    auditory: { count: auditoryCount, percentage: auditoryPct },
    kinesthetic: { count: kinestheticCount, percentage: kinestheticPct },
    dominantStyle,
    totalQuestionsAnswered: total,
    completedAt: new Date().toISOString(),
  };
}
