import { z } from 'zod';
import type { Dass21Result, VakResult } from '../types/assessment.types';

export const createSessionInputSchema = z.object({
  dass21Score: z.custom<Dass21Result>().optional(),
  vakResult: z.custom<VakResult>().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionInputSchema>;
