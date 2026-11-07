import { describe, expect, it, mock } from 'bun:test';
import { jwt } from '@elysiajs/jwt';
import type { CounselingSessionSelect } from '@safespace/db';
import { Elysia } from 'elysia';
import { createSessionRoute } from './session.route';
import { SessionService } from './session.service';
import type { ISessionRepository } from './session.types';

describe('Session Route Integration Tests (TDD & RBAC)', () => {
  const jwtSecret = 'test_secret_for_sessions_route_testing_123';

  const sampleSession: CounselingSessionSelect = {
    id: '11111111-1111-1111-1111-111111111111',
    studentId: '22222222-2222-2222-2222-222222222222',
    counselorId: null,
    studentPseudonym: 'Mahasiswa #4021',
    dass21Score: null,
    vakResult: null,
    status: 'waiting',
    createdAt: new Date(),
    closedAt: null,
  };

  const mockRepo: ISessionRepository = {
    createSession: mock().mockResolvedValue(sampleSession),
    getStudentSessions: mock().mockResolvedValue([sampleSession]),
    getWaitingQueue: mock().mockResolvedValue([sampleSession]),
    getSessionById: mock().mockResolvedValue(sampleSession),
    getCounselorSessions: mock().mockResolvedValue([sampleSession]),
    assignCounselor: mock().mockResolvedValue({
      ...sampleSession,
      status: 'active',
      counselorId: '33333333-3333-3333-3333-333333333333',
    }),
    closeSession: mock().mockResolvedValue({ ...sampleSession, status: 'closed' }),
  };

  const sessionService = new SessionService(mockRepo);
  const app = new Elysia().use(createSessionRoute({ sessionService, jwtSecret }));

  // Helper app for generating signed test JWTs
  const tokenSigner = new Elysia().use(jwt({ name: 'jwt', secret: jwtSecret }));

  async function getStudentToken() {
    return tokenSigner.decorator.jwt.sign({
      userId: '22222222-2222-2222-2222-222222222222',
      role: 'student',
      pseudonym: 'Mahasiswa #4021',
    });
  }

  async function getCounselorToken() {
    return tokenSigner.decorator.jwt.sign({
      userId: '33333333-3333-3333-3333-333333333333',
      role: 'counselor',
      pseudonym: 'Konselor_A',
    });
  }

  async function getAdminToken() {
    return tokenSigner.decorator.jwt.sign({
      userId: '44444444-4444-4444-4444-444444444444',
      role: 'admin',
      pseudonym: 'Admin_Sys',
    });
  }

  describe('POST /api/sessions/create', () => {
    it('should return 401 Unauthorized if no auth token is provided', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/sessions/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }),
      );

      expect(res.status).toBe(401);
    });

    it('should allow student to create a pra-counseling ticket with attached profile', async () => {
      const token = await getStudentToken();
      const res = await app.handle(
        new Request('http://localhost/api/sessions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }),
      );

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.studentPseudonym).toBe('Mahasiswa #4021');
    });
  });

  describe('GET /api/sessions/queue (RBAC Defense)', () => {
    it('should return 403 Forbidden when student tries to inspect counselor queue', async () => {
      const token = await getStudentToken();
      const res = await app.handle(
        new Request('http://localhost/api/sessions/queue', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      expect(res.status).toBe(403);
    });

    it('should return 403 Forbidden when admin tries to inspect counselor queue (Least Privilege)', async () => {
      const token = await getAdminToken();
      const res = await app.handle(
        new Request('http://localhost/api/sessions/queue', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      expect(res.status).toBe(403);
    });

    it('should allow counselor to view waiting queue for triage', async () => {
      const token = await getCounselorToken();
      const res = await app.handle(
        new Request('http://localhost/api/sessions/queue', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBe(1);
    });
  });

  describe('POST /api/sessions/:id/accept', () => {
    it('should allow counselor to accept a ticket', async () => {
      const token = await getCounselorToken();
      const res = await app.handle(
        new Request(`http://localhost/api/sessions/${sampleSession.id}/accept`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('active');
    });

    it('should return 403 Forbidden when admin tries to accept a ticket', async () => {
      const token = await getAdminToken();
      const res = await app.handle(
        new Request(`http://localhost/api/sessions/${sampleSession.id}/accept`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/sessions/counselor/history', () => {
    it('should allow counselor to view their own handled sessions history', async () => {
      const token = await getCounselorToken();
      const res = await app.handle(
        new Request('http://localhost/api/sessions/counselor/history', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBe(1);
    });

    it('should reject student from accessing counselor history', async () => {
      const token = await getStudentToken();
      const res = await app.handle(
        new Request('http://localhost/api/sessions/counselor/history', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      expect(res.status).toBe(403);
    });

    it('should reject admin from accessing counselor history (Confidentiality)', async () => {
      const token = await getAdminToken();
      const res = await app.handle(
        new Request('http://localhost/api/sessions/counselor/history', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      expect(res.status).toBe(403);
    });
  });
});
