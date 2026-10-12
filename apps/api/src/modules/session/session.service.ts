import type { CounselingSessionSelect } from '@safespace/db';
import { generateSessionPseudonym } from '@safespace/shared';
import type { CreateSessionDTO, ISessionRepository, SessionQueueItem } from './session.types';

export class SessionService {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  /**
   * Creates a new anonymous counseling ticket with attached psychometric results and an ephemeral session pseudonym.
   */
  async createTicket(data: CreateSessionDTO): Promise<CounselingSessionSelect> {
    if (!data.studentId) {
      throw new Error('Student ID is required');
    }

    const studentPseudonym = data.studentPseudonym || generateSessionPseudonym();

    return this.sessionRepository.createSession({
      ...data,
      studentPseudonym,
    });
  }

  /**
   * Retrieves active or waiting sessions for the authenticated student.
   */
  async getStudentTickets(studentId: string): Promise<CounselingSessionSelect[]> {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    return this.sessionRepository.getStudentSessions(studentId);
  }

  /**
   * Retrieves the counselor queue with attached triage data.
   */
  async getWaitingQueue(): Promise<SessionQueueItem[]> {
    const sessions = await this.sessionRepository.getWaitingQueue();
    return sessions.map((s) => ({
      id: s.id,
      studentPseudonym: s.studentPseudonym,
      dass21Score: s.dass21Score,
      vakResult: s.vakResult,
      status: s.status,
      createdAt: s.createdAt,
    }));
  }

  /**
   * Counselor accepts a waiting ticket, assigning themselves to the session.
   */
  async acceptTicket(sessionId: string, counselorId: string): Promise<CounselingSessionSelect> {
    const existing = await this.sessionRepository.getSessionById(sessionId);
    if (!existing) {
      throw new Error('Session not found');
    }

    if (existing.status !== 'waiting') {
      throw new Error('Session is not waiting for a counselor');
    }

    return this.sessionRepository.assignCounselor(sessionId, counselorId);
  }

  /**
   * Retrieves all counseling sessions handled by a specific counselor.
   */
  async getCounselorHistory(counselorId: string): Promise<CounselingSessionSelect[]> {
    if (!counselorId) {
      throw new Error('Counselor ID is required');
    }

    return this.sessionRepository.getCounselorSessions(counselorId);
  }

  /**
   * Closes a counseling session.
   */
  async closeTicket(sessionId: string, requesterUserId: string): Promise<CounselingSessionSelect> {
    const existing = await this.sessionRepository.getSessionById(sessionId);
    if (!existing) {
      throw new Error('Session not found');
    }

    if (existing.studentId !== requesterUserId && existing.counselorId !== requesterUserId) {
      throw new Error('Unauthorized to close this session');
    }

    return this.sessionRepository.closeSession(sessionId);
  }
}
