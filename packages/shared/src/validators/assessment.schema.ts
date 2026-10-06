import { z } from 'zod';

export const dass21InputSchema = z.object({
  answers: z
    .array(
      z
        .number()
        .int({ message: 'Score must be an integer' })
        .min(0, { message: 'Score cannot be less than 0' })
        .max(3, { message: 'Score cannot exceed 3' }),
    )
    .length(21, { message: 'DASS-21 requires exactly 21 answers' }),
});

export type Dass21Input = z.infer<typeof dass21InputSchema>;

export const vakInputSchema = z.object({
  answers: z
    .array(z.enum(['visual', 'auditory', 'kinesthetic']))
    .min(3, { message: 'VAK assessment requires at least 3 answers' }),
});

export type VakInput = z.infer<typeof vakInputSchema>;

export const moodNarrativeInputSchema = z.object({
  narrative: z
    .string()
    .trim()
    .min(3, { message: 'Narrative must be at least 3 characters' })
    .max(5000, { message: 'Narrative cannot exceed 5000 characters' }),
});

export type MoodNarrativeInput = z.infer<typeof moodNarrativeInputSchema>;
