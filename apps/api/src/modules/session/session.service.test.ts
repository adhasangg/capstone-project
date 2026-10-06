import { describe, expect, it, mock } from 'bun:test';
import type { CounselingSessionSelect } from '@safespace/db';
import type { Dass21Result, VakResult } from '@safespace/shared';
import { SessionService } from './session.service';
import type { ISessionRepository } from './session.types';

describe('SessionService (TDD)', () => {
  const mockDass21: Dass21Result = {
    depression: { rawScore: 10, multipliedScore: 20, category: 'Moderate' },
    anxiety: { rawScore: 5, multipliedScore: 10, category: 'Moderate' },
    stress: { rawScore: 8, multipliedScore: 16, category: 'Mild' },
    completedAt: '2026-10-06T00:00:00.000Z',
  };

  const mockVak: VakResult = {
    visual: { count: 6, percentage: 50 },
    auditory: { count: 3, percentage: 25 },
    kinesthetic: { count: 3, percentage: 25 },
    dominantStyle: 'visual',
    totalQuestionsAnswered: 12,
    completedAt: '2026-10-06T00:00:00.000Z',
  };

  const sampleSession: CounselingSessionSelect = {
    id: '11111111-1111-1111-1111-111111111111',
    studentId: '22222222-2222-2222-2222-222222222222',
    counselorId: null,
    studentPseudonym: 'Mahasiswa #4021',
    dass21Score: mockDass21,
    vakResult: mockVak,
    status: 'waiting',
    createdAt: new Date(),
    closedAt: null,
  };

  it('should successfully create a pra-counseling ticket with attached profiles', async () => {
    const mockRepo: ISessionRepository = {
      createSession: mock().mockResolvedValue(sampleSession),
      getStudentSessions: mock().mockResolvedValue([sampleSession]),
      getWaitingQueue: mock().mockResolvedValue([sampleSession]),
      getSessionById: mock().mockResolvedValue(sampleSession),
      assignCounselor: mock().mockResolvedValue({
        ...sampleSession,
        status: 'active',
        counselorId: '33333333-3333-3333-3333-333333333333',
      }),
      closeSession: mock().mockResolvedValue({ ...sampleSession, status: 'closed' }),
    };

    const service = new SessionService(mockRepo);
    const result = await service.createTicket({
      studentId: '22222222-2222-2222-2222-222222222222',
      studentPseudonym: 'Mahasiswa #4021',
      dass21Score: mockDass21,
      vakResult: mockVak,
    });

    expect(result.id).toBe(sampleSession.id);
    expect(result.studentPseudonym).toBe('Mahasiswa #4021');
    expect(result.dass21Score?.depression.category).toBe('Moderate');
    expect(result.vakResult?.dominantStyle).toBe('visual');
    expect(mockRepo.createSession).toHaveBeenCalled();
  });

  it('should allow counselors to view waiting queue for triage', async () => {
    const mockRepo: ISessionRepository = {
      createSession: mock(),
      getStudentSessions: mock(),
      getWaitingQueue: mock().mockResolvedValue([sampleSession]),
      getSessionById: mock(),
      assignCounselor: mock(),
      closeSession: mock(),
    };

    const service = new SessionService(mockRepo);
    const queue = await service.getWaitingQueue();

    expect(queue.length).toBe(1);
    expect(queue[0]?.studentPseudonym).toBe('Mahasiswa #4021');
    expect(queue[0]?.status).toBe('waiting');
  });

  it('should allow counselor to accept a waiting ticket', async () => {
    const counselorId = '33333333-3333-3333-3333-333333333333';
    const mockRepo: ISessionRepository = {
      createSession: mock(),
      getStudentSessions: mock(),
      getWaitingQueue: mock(),
      getSessionById: mock().mockResolvedValue(sampleSession),
      assignCounselor: mock().mockResolvedValue({
        ...sampleSession,
        counselorId,
        status: 'active',
      }),
      closeSession: mock(),
    };

    const service = new SessionService(mockRepo);
    const updated = await service.acceptTicket(sampleSession.id, counselorId);

    expect(updated.status).toBe('active');
    expect(updated.counselorId).toBe(counselorId);
  });

  it('should reject accepting a ticket that is already closed or active', async () => {
    const mockRepo: ISessionRepository = {
      createSession: mock(),
      getStudentSessions: mock(),
      getWaitingQueue: mock(),
      getSessionById: mock().mockResolvedValue({
        ...sampleSession,
        status: 'active',
      }),
      assignCounselor: mock(),
      closeSession: mock(),
    };

    const service = new SessionService(mockRepo);
    expect(
      service.acceptTicket(sampleSession.id, '33333333-3333-3333-3333-333333333333'),
    ).rejects.toThrow('Session is not waiting for a counselor');
  });
});
