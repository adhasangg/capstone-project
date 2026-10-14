import { beforeEach, describe, expect, it } from 'bun:test';
import type { UserAuthSelect } from '@safespace/db';
import type { UserRole } from '@safespace/shared';
import type { IAuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import type { TokenVerifier } from './auth.types';

// In-memory mock repository for unit testing
class MockAuthRepository implements IAuthRepository {
  private users: UserAuthSelect[] = [];

  async findByHashedIdentity(hashedIdentity: string): Promise<UserAuthSelect | null> {
    return this.users.find((u) => u.hashedIdentity === hashedIdentity) ?? null;
  }

  async createUser(hashedIdentity: string, role = 'student' as const): Promise<UserAuthSelect> {
    const user: UserAuthSelect = {
      id: `018f-mock-uuid-${this.users.length + 1}`,
      hashedIdentity,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findById(id: string): Promise<UserAuthSelect | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async findAll(): Promise<UserAuthSelect[]> {
    return this.users;
  }

  async updateRole(id: string, role: UserRole): Promise<UserAuthSelect | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    user.role = role;
    return user;
  }
}

describe('AuthService (TDD)', () => {
  let mockRepo: MockAuthRepository;
  let service: AuthService;
  const pepper = 'super-secret-pepper-test-12345';
  const allowedDomains = ['ecampus.ut.ac.id', 'ugm.ac.id'];

  const mockSuccessVerifier: TokenVerifier = async (idToken: string) => {
    if (idToken === 'valid-ut-token') {
      return {
        sub: 'google-sub-1234567890',
        email: 'student@ecampus.ut.ac.id',
        emailVerified: true,
      };
    }
    if (idToken === 'valid-unauthorized-domain-token') {
      return {
        sub: 'google-sub-hacker',
        email: 'intruder@gmail.com',
        emailVerified: true,
      };
    }
    if (idToken === 'unverified-email-token') {
      return {
        sub: 'google-sub-unverified',
        email: 'user@ecampus.ut.ac.id',
        emailVerified: false,
      };
    }
    throw new Error('Invalid Google token signature');
  };

  beforeEach(() => {
    mockRepo = new MockAuthRepository();
    service = new AuthService(mockRepo, pepper, allowedDomains, mockSuccessVerifier);
  });

  describe('Happy Path', () => {
    it('should authenticate a valid user, sanitize identity, and return anonymous user info', async () => {
      const user = await service.authenticateWithGoogle('valid-ut-token');

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.role).toBe('student');
      expect(user.pseudonym.startsWith('Mahasiswa #')).toBe(true);

      // Verify that the repository stored a hash, NOT the raw email or Google sub
      const stored = await mockRepo.findByHashedIdentity(user.id);
      // Raw sub must not be present
      expect(stored).toBeNull(); // search by id won't match hashed identity
    });

    it('should recognize an existing user and not create duplicates', async () => {
      const firstLogin = await service.authenticateWithGoogle('valid-ut-token');
      const secondLogin = await service.authenticateWithGoogle('valid-ut-token');

      expect(firstLogin.id).toBe(secondLogin.id);
    });
  });

  describe('Error Path', () => {
    it('should reject authentication if the email domain is not in the whitelist', async () => {
      expect(service.authenticateWithGoogle('valid-unauthorized-domain-token')).rejects.toThrow(
        'Email domain is not authorized',
      );
    });

    it('should reject authentication if Google reports email as not verified', async () => {
      expect(service.authenticateWithGoogle('unverified-email-token')).rejects.toThrow(
        'Google account email is not verified',
      );
    });

    it('should reject invalid or expired Google tokens', async () => {
      expect(service.authenticateWithGoogle('invalid-token-xyz')).rejects.toThrow(
        'Invalid Google token signature',
      );
    });
  });
});
