import type { Dass21Result, VakResult } from './assessment.types';

export type SessionStatus = 'waiting' | 'active' | 'closed';

export interface CounselingSessionSummary {
  readonly id: string;
  readonly studentId: string;
  readonly counselorId: string | null;
  readonly studentPseudonym: string;
  readonly status: SessionStatus;
  readonly createdAt: Date;
  readonly vakResult?: VakResult | null;
  readonly dass21Score?: Dass21Result | null;
}
