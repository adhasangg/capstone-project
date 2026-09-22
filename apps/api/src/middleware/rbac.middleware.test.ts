import { describe, expect, it } from 'bun:test';
import { jwt } from '@elysiajs/jwt';
import { Elysia } from 'elysia';
import { requireRoles } from './rbac.middleware';

describe('RBAC Middleware (TDD)', () => {
  const jwtSecret = 'test-secret-at-least-32-characters-long!';

  const app = new Elysia()
    .use(
      jwt({
        name: 'jwt',
        secret: jwtSecret,
      }),
    )
    .get('/api/counselor/queue', () => ({ status: 'queue accessed' }), {
      beforeHandle: requireRoles(['counselor', 'admin']),
    });

  it('should return 401 Unauthorized if no Authorization header is provided', async () => {
    const res = await app.handle(new Request('http://localhost/api/counselor/queue'));
    expect(res.status).toBe(401);
  });

  it('should return 403 Forbidden if student attempts to access counselor queue', async () => {
    // Generate a student JWT token
    const tokenApp = new Elysia().use(jwt({ name: 'jwt', secret: jwtSecret }));
    let studentToken = '';
    tokenApp.get('/token', async ({ jwt }) => {
      studentToken = await jwt.sign({
        userId: 'user-student-1',
        role: 'student',
        pseudonym: 'Mahasiswa #1001',
      });
      return { token: studentToken };
    });
    await tokenApp.handle(new Request('http://localhost/token'));

    const res = await app.handle(
      new Request('http://localhost/api/counselor/queue', {
        headers: { Authorization: `Bearer ${studentToken}` },
      }),
    );

    expect(res.status).toBe(403);
    const body = (await res.json()) as { success: boolean; error: { code: string } };
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('FORBIDDEN');
  });

  it('should allow access if counselor role is provided', async () => {
    const tokenApp = new Elysia().use(jwt({ name: 'jwt', secret: jwtSecret }));
    let counselorToken = '';
    tokenApp.get('/token', async ({ jwt }) => {
      counselorToken = await jwt.sign({
        userId: 'user-counselor-1',
        role: 'counselor',
        pseudonym: 'Konselor_A',
      });
      return { token: counselorToken };
    });
    await tokenApp.handle(new Request('http://localhost/token'));

    const res = await app.handle(
      new Request('http://localhost/api/counselor/queue', {
        headers: { Authorization: `Bearer ${counselorToken}` },
      }),
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe('queue accessed');
  });
});
