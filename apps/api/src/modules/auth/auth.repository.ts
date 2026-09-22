import { type SafeSpaceDatabase, type UserAuthSelect, usersAuth } from '@safespace/db';
import type { UserRole } from '@safespace/shared';
import { eq } from 'drizzle-orm';

export interface IAuthRepository {
  findByHashedIdentity(hashedIdentity: string): Promise<UserAuthSelect | null>;
  createUser(hashedIdentity: string, role?: UserRole): Promise<UserAuthSelect>;
  findById(id: string): Promise<UserAuthSelect | null>;
}

export class AuthRepository implements IAuthRepository {
  constructor(private readonly db: SafeSpaceDatabase) {}

  async findByHashedIdentity(hashedIdentity: string): Promise<UserAuthSelect | null> {
    const records = await this.db
      .select()
      .from(usersAuth)
      .where(eq(usersAuth.hashedIdentity, hashedIdentity))
      .limit(1);

    return records[0] ?? null;
  }

  async createUser(hashedIdentity: string, role: UserRole = 'student'): Promise<UserAuthSelect> {
    const inserted = await this.db
      .insert(usersAuth)
      .values({
        hashedIdentity,
        role,
      })
      .returning();

    const created = inserted[0];
    if (!created) {
      throw new Error('Failed to create user in database');
    }
    return created;
  }

  async findById(id: string): Promise<UserAuthSelect | null> {
    const records = await this.db.select().from(usersAuth).where(eq(usersAuth.id, id)).limit(1);

    return records[0] ?? null;
  }
}
