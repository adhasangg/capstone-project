export type Dass21Category = 'Normal' | 'Mild' | 'Moderate' | 'Severe' | 'Extremely Severe';

export interface Dass21SubscaleResult {
  readonly rawScore: number;
  readonly multipliedScore: number;
  readonly category: Dass21Category;
}

export interface Dass21Result {
  readonly depression: Dass21SubscaleResult;
  readonly anxiety: Dass21SubscaleResult;
  readonly stress: Dass21SubscaleResult;
  readonly completedAt: string;
}

export type VakModality = 'visual' | 'auditory' | 'kinesthetic';

export interface VakModalityScore {
  readonly count: number;
  readonly percentage: number;
}

export interface VakResult {
  readonly visual: VakModalityScore;
  readonly auditory: VakModalityScore;
  readonly kinesthetic: VakModalityScore;
  readonly dominantStyle: VakModality | 'multimodal';
  readonly totalQuestionsAnswered: number;
  readonly completedAt: string;
}

export type MoodSentimentCategory = 'positive' | 'neutral' | 'mild_distress' | 'severe_distress';

export interface MoodTrackerAnalysis {
  readonly narrative: string;
  readonly sentiment: MoodSentimentCategory;
  readonly empatheticMessage: string;
  readonly shouldRecommendCounseling: boolean;
  readonly analyzedAt: string;
}
