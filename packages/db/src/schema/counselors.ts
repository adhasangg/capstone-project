import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { usersAuth } from './users';

export const counselorsProfile = pgTable('counselors_profile', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => usersAuth.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  pseudonymName: varchar('pseudonym_name', { length: 100 }).notNull(),
  publicKey: text('public_key').notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type CounselorProfileSelect = typeof counselorsProfile.$inferSelect;
export type CounselorProfileInsert = typeof counselorsProfile.$inferInsert;
