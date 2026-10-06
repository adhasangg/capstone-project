import {
  type CounselingSessionSelect,
  type SafeSpaceDatabase,
  counselingSessions,
} from '@safespace/db';
import { eq } from 'drizzle-orm';
import type { CreateSessionDTO, ISessionRepository } from './session.types';

export class SessionRepository implements ISessionRepository {
  constructor(private readonly db: SafeSpaceDatabase) {}

  /**
   * Creates a new counseling ticket with attached psychometric profile.
   */
  async createSession(data: CreateSessionDTO): Promise<CounselingSessionSelect> {
    const [inserted] = await this.db
      .insert(counselingSessions)
      .values({
        studentId: data.studentId,
        studentPseudonym: data.studentPseudonym,
        dass21Score: data.dass21Score,
        vakResult: data.vakResult,
        status: 'waiting',
      })
      .returning();

    if (!inserted) {
      throw new Error('Failed to create counseling session');
    }

    return inserted;
  }

  /**
   * Retrieves active or past sessions belonging to a specific student.
   */
  async getStudentSessions(studentId: string): Promise<CounselingSessionSelect[]> {
    return this.db
      .select()
      .from(counselingSessions)
      .where(eq(counselingSessions.studentId, studentId))
      .orderBy(counselingSessions.createdAt);
  }

  /**
   * Retrieves waiting queue for counselors without joining users_auth (Double-Blind Scoping).
   */
  async getWaitingQueue(): Promise<CounselingSessionSelect[]> {
    return this.db
      .select()
      .from(counselingSessions)
      .where(eq(counselingSessions.status, 'waiting'))
      .orderBy(counselingSessions.createdAt);
  }

  /**
   * Retrieves a single counseling session by ID.
   */
  async getSessionById(sessionId: string): Promise<CounselingSessionSelect | null> {
    const [found] = await this.db
      .select()
      .from(counselingSessions)
      .where(eq(counselingSessions.id, sessionId))
      .limit(1);

    return found ?? null;
  }

  /**
   * Assigns counselor to session and transitions status to active.
   */
  async assignCounselor(sessionId: string, counselorId: string): Promise<CounselingSessionSelect> {
    const [updated] = await this.db
      .update(counselingSessions)
      .set({
        counselorId,
        status: 'active',
      })
      .where(eq(counselingSessions.id, sessionId))
      .returning();

    if (!updated) {
      throw new Error('Session not found or assignment failed');
    }

    return updated;
  }

  /**
   * Closes an active or waiting session.
   */
  async closeSession(sessionId: string): Promise<CounselingSessionSelect> {
    const [closed] = await this.db
      .update(counselingSessions)
      .set({
        status: 'closed',
        closedAt: new Date(),
      })
      .where(eq(counselingSessions.id, sessionId))
      .returning();

    if (!closed) {
      throw new Error('Session not found or close failed');
    }

    return closed;
  }
}
