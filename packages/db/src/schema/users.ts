import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['student', 'counselor', 'admin']);

export const usersAuth = pgTable('users_auth', {
  id: uuid('id').defaultRandom().primaryKey(),
  hashedIdentity: varchar('hashed_identity', { length: 64 }).notNull().unique(),
  role: userRoleEnum('role').default('student').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type UserAuthSelect = typeof usersAuth.$inferSelect;
export type UserAuthInsert = typeof usersAuth.$inferInsert;
