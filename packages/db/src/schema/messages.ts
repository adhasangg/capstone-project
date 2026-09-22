import { pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { counselingSessions } from './sessions';

export const senderTypeEnum = pgEnum('sender_type', ['student', 'counselor', 'system']);

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id')
    .references(() => counselingSessions.id, { onDelete: 'cascade' })
    .notNull(),
  senderType: senderTypeEnum('sender_type').notNull(),
  encryptedContent: text('encrypted_content').notNull(),
  iv: varchar('iv', { length: 64 }),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});

export type MessageSelect = typeof messages.$inferSelect;
export type MessageInsert = typeof messages.$inferInsert;
