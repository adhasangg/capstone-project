import { describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import { createAssessmentRoute } from './assessment.route';
import { AssessmentService } from './assessment.service';

describe('Assessment Route Integration Tests (TDD)', () => {
  const assessmentService = new AssessmentService();
  const app = new Elysia().use(createAssessmentRoute({ assessmentService }));

  describe('POST /api/assessment/dass21', () => {
    it('should compute DASS-21 successfully and return 200', async () => {
      const answers = Array(21).fill(0);
      const res = await app.handle(
        new Request('http://localhost/api/assessment/dass21', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        }),
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.depression.category).toBe('Normal');
      expect(data.data.anxiety.category).toBe('Normal');
      expect(data.data.stress.category).toBe('Normal');
    });

    it('should return 400 when answers array has invalid length', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/assessment/dass21', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: [1, 2, 3] }),
        }),
      );

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
    });
  });

  describe('POST /api/assessment/vak', () => {
    it('should compute VAK successfully and return 200', async () => {
      const answers = ['visual', 'visual', 'auditory', 'kinesthetic'];
      const res = await app.handle(
        new Request('http://localhost/api/assessment/vak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        }),
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.dominantStyle).toBe('visual');
      expect(data.data.visual.count).toBe(2);
    });

    it('should return 400 when invalid modality is passed', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/assessment/vak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: ['invalid_type'] }),
        }),
      );

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
    });
  });

  describe('POST /api/assessment/mood', () => {
    it('should analyze mood reflection and return 200', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/assessment/mood', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            narrative: 'Hari ini saya merasa lelah sekali dengan tugas kuliah.',
          }),
        }),
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.sentiment).toBe('severe_distress');
      expect(data.data.shouldRecommendCounseling).toBe(true);
    });

    it('should return 400 when narrative is too short', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/assessment/mood', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ narrative: ' ' }),
        }),
      );

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
    });
  });
});
