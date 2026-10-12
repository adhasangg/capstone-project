import {
  type CounselingSessionSelect,
  type SafeSpaceDatabase,
  counselingSessions,
} from '@safespace/db';
import { desc, eq } from 'drizzle-orm';
import type { CreateSessionDTO, ISessionRepository } from './session.types';

export class SessionRepository implements ISessionRepository {
  private inMemorySessions: CounselingSessionSelect[] = [];
  private isDbAvailable = false;

  constructor(private readonly db: SafeSpaceDatabase) {}

  public setDbAvailable(available: boolean) {
    this.isDbAvailable = available;
  }

  /**
   * Creates a new counseling ticket with attached psychometric profile.
   */
  async createSession(data: CreateSessionDTO): Promise<CounselingSessionSelect> {
    if (this.isDbAvailable) {
      try {
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

        if (inserted) {
          return inserted;
        }
      } catch {
        this.isDbAvailable = false;
      }
    }

    const fallback: CounselingSessionSelect = {
      id: crypto.randomUUID(),
      studentId: data.studentId,
      studentPseudonym: data.studentPseudonym,
      counselorId: null,
      dass21Score: data.dass21Score ?? null,
      vakResult: data.vakResult ?? null,
      status: 'waiting',
      createdAt: new Date(),
      closedAt: null,
    };
    this.inMemorySessions.push(fallback);
    return fallback;
  }

  /**
   * Retrieves active or past sessions belonging to a specific student.
   */
  async getStudentSessions(studentId: string): Promise<CounselingSessionSelect[]> {
    if (this.isDbAvailable) {
      try {
        const rows = await this.db
          .select()
          .from(counselingSessions)
          .where(eq(counselingSessions.studentId, studentId))
          .orderBy(counselingSessions.createdAt);

        if (rows && rows.length > 0) {
          return rows;
        }
      } catch {
        this.isDbAvailable = false;
      }
    }

    return this.inMemorySessions
      .filter((s) => s.studentId === studentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  /**
   * Retrieves waiting queue for counselors without joining users_auth (Double-Blind Scoping).
   */
  async getWaitingQueue(): Promise<CounselingSessionSelect[]> {
    if (this.isDbAvailable) {
      try {
        const rows = await this.db
          .select()
          .from(counselingSessions)
          .where(eq(counselingSessions.status, 'waiting'))
          .orderBy(counselingSessions.createdAt);

        if (rows && rows.length > 0) {
          return rows;
        }
      } catch {
        this.isDbAvailable = false;
      }
    }

    return this.inMemorySessions
      .filter((s) => s.status === 'waiting')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  /**
   * Retrieves a single counseling session by ID.
   */
  async getSessionById(sessionId: string): Promise<CounselingSessionSelect | null> {
    if (this.isDbAvailable) {
      try {
        const [found] = await this.db
          .select()
          .from(counselingSessions)
          .where(eq(counselingSessions.id, sessionId))
          .limit(1);

        if (found) {
          return found;
        }
      } catch {
        this.isDbAvailable = false;
      }
    }

    return this.inMemorySessions.find((s) => s.id === sessionId) ?? null;
  }

  /**
   * Retrieves all sessions handled by a specific counselor (active or closed).
   */
  async getCounselorSessions(counselorId: string): Promise<CounselingSessionSelect[]> {
    if (this.isDbAvailable) {
      try {
        const rows = await this.db
          .select()
          .from(counselingSessions)
          .where(eq(counselingSessions.counselorId, counselorId))
          .orderBy(desc(counselingSessions.createdAt));

        if (rows && rows.length > 0) {
          return rows;
        }
      } catch {
        this.isDbAvailable = false;
      }
    }

    return this.inMemorySessions
      .filter((s) => s.counselorId === counselorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Assigns counselor to session and transitions status to active.
   */
  async assignCounselor(sessionId: string, counselorId: string): Promise<CounselingSessionSelect> {
    if (this.isDbAvailable) {
      try {
        const [updated] = await this.db
          .update(counselingSessions)
          .set({
            counselorId,
            status: 'active',
          })
          .where(eq(counselingSessions.id, sessionId))
          .returning();

        if (updated) {
          return updated;
        }
      } catch {
        this.isDbAvailable = false;
      }
    }

    const idx = this.inMemorySessions.findIndex((s) => s.id === sessionId);
    if (idx !== -1) {
      const target = this.inMemorySessions[idx];
      if (!target) throw new Error('Session not found');
      const updatedSession: CounselingSessionSelect = {
        ...target,
        counselorId,
        status: 'active',
      };
      this.inMemorySessions[idx] = updatedSession;
      return updatedSession;
    }

    throw new Error('Session not found or assignment failed');
  }

  /**
   * Closes an active or waiting session.
   */
  async closeSession(sessionId: string): Promise<CounselingSessionSelect> {
    if (this.isDbAvailable) {
      try {
        const [closed] = await this.db
          .update(counselingSessions)
          .set({
            status: 'closed',
            closedAt: new Date(),
          })
          .where(eq(counselingSessions.id, sessionId))
          .returning();

        if (closed) {
          return closed;
        }
      } catch {
        this.isDbAvailable = false;
      }
    }

    const idx = this.inMemorySessions.findIndex((s) => s.id === sessionId);
    if (idx !== -1) {
      const target = this.inMemorySessions[idx];
      if (!target) throw new Error('Session not found');
      const updatedSession: CounselingSessionSelect = {
        ...target,
        status: 'closed',
        closedAt: new Date(),
      };
      this.inMemorySessions[idx] = updatedSession;
      return updatedSession;
    }

    throw new Error('Session not found or close failed');
  }
}
