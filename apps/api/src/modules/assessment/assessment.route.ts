import { dass21InputSchema, moodNarrativeInputSchema, vakInputSchema } from '@safespace/shared';
import { Elysia } from 'elysia';
import type { AssessmentService } from './assessment.service';

export interface AssessmentRouteOptions {
  readonly assessmentService: AssessmentService;
}

export function createAssessmentRoute(options: AssessmentRouteOptions) {
  const { assessmentService } = options;

  return new Elysia({ prefix: '/api/assessment' })
    .post('/dass21', ({ body, set }) => {
      const parsed = dass21InputSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid DASS-21 payload',
        };
      }

      try {
        const result = assessmentService.processDass21(parsed.data.answers);
        return {
          success: true,
          data: result,
        };
      } catch (err: unknown) {
        set.status = 400;
        const message = err instanceof Error ? err.message : 'DASS-21 calculation failed';
        return { success: false, error: message };
      }
    })
    .post('/vak', ({ body, set }) => {
      const parsed = vakInputSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid VAK payload',
        };
      }

      try {
        const result = assessmentService.processVak(parsed.data.answers);
        return {
          success: true,
          data: result,
        };
      } catch (err: unknown) {
        set.status = 400;
        const message = err instanceof Error ? err.message : 'VAK calculation failed';
        return { success: false, error: message };
      }
    })
    .post('/mood', async ({ body, set }) => {
      const parsed = moodNarrativeInputSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid mood payload',
        };
      }

      try {
        const result = await assessmentService.analyzeMoodNarrative(parsed.data.narrative);
        return {
          success: true,
          data: result,
        };
      } catch (err: unknown) {
        set.status = 400;
        const message = err instanceof Error ? err.message : 'Mood analysis failed';
        return { success: false, error: message };
      }
    });
}
