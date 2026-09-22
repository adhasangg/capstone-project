import type { Dass21Result, VakResult } from '@safespace/shared';
import { jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { usersAuth } from './users';

export const sessionStatusEnum = pgEnum('session_status', ['waiting', 'active', 'closed']);

export const counselingSessions = pgTable('counseling_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id')
    .references(() => usersAuth.id, { onDelete: 'cascade' })
    .notNull(),
  counselorId: uuid('counselor_id').references(() => usersAuth.id, { onDelete: 'set null' }),
  studentPseudonym: varchar('student_pseudonym', { length: 100 }).notNull(),
  vakResult: jsonb('vak_result').$type<VakResult>(),
  dass21Score: jsonb('dass21_score').$type<Dass21Result>(),
  status: sessionStatusEnum('status').default('waiting').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  closedAt: timestamp('closed_at', { withTimezone: true }),
});

export type CounselingSessionSelect = typeof counselingSessions.$inferSelect;
export type CounselingSessionInsert = typeof counselingSessions.$inferInsert;
