import { describe, expect, it } from 'bun:test';
import type { UserAuthSelect } from '@safespace/db';
import type { UserRole } from '@safespace/shared';
import { Elysia } from 'elysia';
import type { IAuthRepository } from './auth.repository';
import { createAuthRoute } from './auth.route';
import { AuthService } from './auth.service';
import type { TokenVerifier } from './auth.types';

class MockRouteAuthRepository implements IAuthRepository {
  private users: UserAuthSelect[] = [];

  async findByHashedIdentity(hashedIdentity: string): Promise<UserAuthSelect | null> {
    return this.users.find((u) => u.hashedIdentity === hashedIdentity) ?? null;
  }

  async createUser(hashedIdentity: string, role = 'student' as const): Promise<UserAuthSelect> {
    const user: UserAuthSelect = {
      id: '018f-test-uuid-1',
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

describe('Auth Route Integration Tests', () => {
  const jwtSecret = 'test-jwt-secret-at-least-32-characters-long!';
  const pepper = 'test-pepper-secret-long-enough-32-chars';
  const allowedDomains = ['ecampus.ut.ac.id'];

  const testVerifier: TokenVerifier = async (idToken: string) => {
    if (idToken === 'valid-token') {
      return {
        sub: 'sub-test-12345',
        email: 'student@ecampus.ut.ac.id',
        emailVerified: true,
      };
    }
    throw new Error('Token verification failed');
  };

  const mockRepo = new MockRouteAuthRepository();
  const authService = new AuthService(mockRepo, pepper, allowedDomains, testVerifier);
  const app = new Elysia().use(createAuthRoute({ authService, jwtSecret }));

  it('POST /api/auth/google should successfully authenticate and return JWT', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: 'valid-token' }),
      }),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      success: boolean;
      data: { user: { id: string; role: string; pseudonym: string }; token: string };
    };

    expect(body.success).toBe(true);
    expect(body.data.user.role).toBe('student');
    expect(body.data.token).toBeDefined();

    // Now test GET /api/auth/me with the received token
    const meResponse = await app.handle(
      new Request('http://localhost/api/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${body.data.token}` },
      }),
    );

    expect(meResponse.status).toBe(200);
    const meBody = (await meResponse.json()) as {
      success: boolean;
      data: { id: string; role: string; pseudonym: string; token: string };
    };
    expect(meBody.success).toBe(true);
    expect(meBody.data.id).toBe(body.data.user.id);
    expect(meBody.data.role).toBe('student');
    expect(meBody.data.token).toBeDefined();

    // Now simulate Sysadmin elevating user role to counselor in repository
    await mockRepo.updateRole(body.data.user.id, 'counselor');

    // Calling GET /api/auth/me should immediately return updated role and fresh counselor token
    const refreshedMeResponse = await app.handle(
      new Request('http://localhost/api/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${body.data.token}` },
      }),
    );
    expect(refreshedMeResponse.status).toBe(200);
    const refreshedMeBody = (await refreshedMeResponse.json()) as {
      success: boolean;
      data: { id: string; role: string; pseudonym: string; token: string };
    };
    expect(refreshedMeBody.success).toBe(true);
    expect(refreshedMeBody.data.role).toBe('counselor');
    expect(refreshedMeBody.data.token).toBeDefined();
    expect(refreshedMeBody.data.token).not.toBe(body.data.token);
  });

  it('POST /api/auth/google should return 400 for invalid token', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: 'invalid-token' }),
      }),
    );

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: boolean; error: { code: string } };
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('AUTH_FAILED');
  });

  it('GET /api/auth/me should return 401 when Authorization header is missing', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/me', {
        method: 'GET',
      }),
    );

    expect(response.status).toBe(401);
  });

  it('GET /api/auth/config should return auth configuration and sandbox status', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/config', {
        method: 'GET',
      }),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      success: boolean;
      data: { enableSandbox: boolean; googleClientId: string };
    };
    expect(body.success).toBe(true);
    expect(typeof body.data.enableSandbox).toBe('boolean');
    expect(typeof body.data.googleClientId).toBe('string');
  });
});
