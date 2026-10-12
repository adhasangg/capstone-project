import { type SafeSpaceDatabase, type UserAuthSelect, usersAuth } from '@safespace/db';
import type { UserRole } from '@safespace/shared';
import { eq } from 'drizzle-orm';

export interface IAuthRepository {
  findByHashedIdentity(hashedIdentity: string): Promise<UserAuthSelect | null>;
  createUser(hashedIdentity: string, role?: UserRole): Promise<UserAuthSelect>;
  findById(id: string): Promise<UserAuthSelect | null>;
  findAll(): Promise<UserAuthSelect[]>;
  updateRole(id: string, role: UserRole): Promise<UserAuthSelect | null>;
}

export class AuthRepository implements IAuthRepository {
  private inMemoryUsers: UserAuthSelect[] = [];
  private isDbAvailable = true;

  constructor(private readonly db: SafeSpaceDatabase) {}

  setDbAvailable(available: boolean) {
    this.isDbAvailable = available;
  }

  async findByHashedIdentity(hashedIdentity: string): Promise<UserAuthSelect | null> {
    if (this.isDbAvailable) {
      try {
        const records = await this.db
          .select()
          .from(usersAuth)
          .where(eq(usersAuth.hashedIdentity, hashedIdentity))
          .limit(1);

        return records[0] ?? null;
      } catch {
        this.isDbAvailable = false;
      }
    }

    return this.inMemoryUsers.find((u) => u.hashedIdentity === hashedIdentity) ?? null;
  }

  async createUser(hashedIdentity: string, role: UserRole = 'student'): Promise<UserAuthSelect> {
    if (this.isDbAvailable) {
      try {
        const inserted = await this.db
          .insert(usersAuth)
          .values({
            hashedIdentity,
            role,
          })
          .returning();

        const created = inserted[0];
        if (created) {
          return created;
        }
      } catch {
        this.isDbAvailable = false;
      }
    }

    const created: UserAuthSelect = {
      id: crypto.randomUUID(),
      hashedIdentity,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inMemoryUsers.push(created);
    return created;
  }

  async findById(id: string): Promise<UserAuthSelect | null> {
    if (this.isDbAvailable) {
      try {
        const records = await this.db.select().from(usersAuth).where(eq(usersAuth.id, id)).limit(1);

        return records[0] ?? null;
      } catch {
        this.isDbAvailable = false;
      }
    }

    return this.inMemoryUsers.find((u) => u.id === id) ?? null;
  }

  async findAll(): Promise<UserAuthSelect[]> {
    if (this.isDbAvailable) {
      try {
        return await this.db.select().from(usersAuth);
      } catch {
        this.isDbAvailable = false;
      }
    }

    return [...this.inMemoryUsers];
  }

  async updateRole(id: string, role: UserRole): Promise<UserAuthSelect | null> {
    if (this.isDbAvailable) {
      try {
        const updated = await this.db
          .update(usersAuth)
          .set({ role, updatedAt: new Date() })
          .where(eq(usersAuth.id, id))
          .returning();

        if (updated[0]) {
          return updated[0];
        }
      } catch {
        this.isDbAvailable = false;
      }
    }

    const user = this.inMemoryUsers.find((u) => u.id === id);
    if (!user) {
      return null;
    }
    user.role = role;
    user.updatedAt = new Date();
    return user;
  }
}
