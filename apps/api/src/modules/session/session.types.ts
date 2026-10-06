import type { CounselingSessionSelect } from '@safespace/db';
import type { Dass21Result, SessionStatus, VakResult } from '@safespace/shared';

export interface CreateSessionDTO {
  readonly studentId: string;
  readonly studentPseudonym: string;
  readonly dass21Score?: Dass21Result;
  readonly vakResult?: VakResult;
}

export interface SessionQueueItem {
  readonly id: string;
  readonly studentPseudonym: string;
  readonly dass21Score: Dass21Result | null;
  readonly vakResult: VakResult | null;
  readonly status: SessionStatus;
  readonly createdAt: Date;
}

export interface ISessionRepository {
  createSession(data: CreateSessionDTO): Promise<CounselingSessionSelect>;
  getStudentSessions(studentId: string): Promise<CounselingSessionSelect[]>;
  getWaitingQueue(): Promise<CounselingSessionSelect[]>;
  getSessionById(sessionId: string): Promise<CounselingSessionSelect | null>;
  assignCounselor(sessionId: string, counselorId: string): Promise<CounselingSessionSelect>;
  closeSession(sessionId: string): Promise<CounselingSessionSelect>;
}
