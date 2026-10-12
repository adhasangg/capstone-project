import { z } from 'zod';
import type { Dass21Result, VakResult } from '../types/assessment.types';

export const createSessionInputSchema = z
  .object({
    dass21Score: z.custom<Dass21Result>().optional(),
    dass21Result: z.custom<Dass21Result>().optional(),
    vakResult: z.custom<VakResult>().optional(),
  })
  .transform((data) => ({
    dass21Score: data.dass21Score ?? data.dass21Result,
    vakResult: data.vakResult,
  }));

export type CreateSessionInput = z.infer<typeof createSessionInputSchema>;
