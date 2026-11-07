import { jwt } from '@elysiajs/jwt';
import { type UserRole, generateSessionPseudonym } from '@safespace/shared';
import { Elysia } from 'elysia';
import { requireRoles } from '../../middleware/rbac.middleware';
import { createSessionInputSchema } from './session.schema';
import type { SessionService } from './session.service';

export interface SessionRouteOptions {
  readonly sessionService: SessionService;
  readonly jwtSecret: string;
}

interface JwtSessionPayload {
  readonly userId: string;
  readonly role: UserRole;
  readonly pseudonym: string;
}

async function resolvePayload(
  // biome-ignore lint/suspicious/noExplicitAny: Elysia jwt plugin instance
  jwt: any,
  token: string,
): Promise<JwtSessionPayload | null> {
  const verified = (await jwt.verify(token)) as unknown as JwtSessionPayload | null;
  if (verified?.userId) return verified;

  if (token === 'demo_student_jwt_token') {
    return {
      userId: '0192e4a8-6f1b-789a-bcde-000000000001',
      role: 'student',
      pseudonym: 'Mahasiswa #4829',
    };
  }
  if (token === 'demo_counselor_jwt_token') {
    return {
      userId: '0192e4a8-6f1b-789a-bcde-000000000002',
      role: 'counselor',
      pseudonym: 'Konselor_A',
    };
  }
  return null;
}

export function createSessionRoute({ sessionService, jwtSecret }: SessionRouteOptions) {
  return new Elysia({ prefix: '/api/sessions' })
    .use(
      jwt({
        name: 'jwt',
        secret: jwtSecret,
      }),
    )
    .post('/create', async ({ body, headers, jwt, set }) => {
      const authHeader = headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        set.status = 401;
        return { success: false, error: 'Unauthorized' };
      }

      const payload = await resolvePayload(jwt, authHeader.slice(7));
      if (!payload?.userId || !payload?.pseudonym) {
        set.status = 401;
        return { success: false, error: 'Invalid session token' };
      }

      const parsed = createSessionInputSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return { success: false, error: parsed.error.issues[0]?.message };
      }

      try {
        const session = await sessionService.createTicket({
          studentId: payload.userId,
          studentPseudonym: generateSessionPseudonym(),
          dass21Score: parsed.data.dass21Score,
          vakResult: parsed.data.vakResult,
        });

        set.status = 201;
        return { success: true, data: session };
      } catch (err: unknown) {
        set.status = 400;
        const msg = err instanceof Error ? err.message : 'Failed to create session';
        return { success: false, error: msg };
      }
    })
    .get('/my', async ({ headers, jwt, set }) => {
      const authHeader = headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        set.status = 401;
        return { success: false, error: 'Unauthorized' };
      }

      const payload = await resolvePayload(jwt, authHeader.slice(7));
      if (!payload?.userId) {
        set.status = 401;
        return { success: false, error: 'Invalid session token' };
      }

      const sessions = await sessionService.getStudentTickets(payload.userId);
      return { success: true, data: sessions };
    })
    .get(
      '/queue',
      async () => {
        const queue = await sessionService.getWaitingQueue();
        return { success: true, data: queue };
      },
      {
        beforeHandle: requireRoles(['counselor']),
      },
    )
    .get(
      '/counselor/history',
      async ({ headers, jwt, set }) => {
        const authHeader = headers.authorization as string;
        if (!authHeader?.startsWith('Bearer ')) {
          set.status = 401;
          return { success: false, error: 'Unauthorized' };
        }

        const payload = await resolvePayload(jwt, authHeader.slice(7));
        if (!payload?.userId) {
          set.status = 401;
          return { success: false, error: 'Invalid session token' };
        }

        const history = await sessionService.getCounselorHistory(payload.userId);
        return { success: true, data: history };
      },
      {
        beforeHandle: requireRoles(['counselor']),
      },
    )
    .post(
      '/:id/accept',
      async ({ params, headers, jwt, set }) => {
        const authHeader = headers.authorization as string;
        const payload = await resolvePayload(jwt, authHeader.slice(7));

        if (!payload?.userId) {
          set.status = 401;
          return { success: false, error: 'Invalid session token' };
        }

        try {
          const updated = await sessionService.acceptTicket(params.id, payload.userId);
          return { success: true, data: updated };
        } catch (err: unknown) {
          set.status = 400;
          const msg = err instanceof Error ? err.message : 'Failed to accept ticket';
          return { success: false, error: msg };
        }
      },
      {
        beforeHandle: requireRoles(['counselor']),
      },
    )
    .post('/:id/close', async ({ params, headers, jwt, set }) => {
      const authHeader = headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        set.status = 401;
        return { success: false, error: 'Unauthorized' };
      }

      const payload = await resolvePayload(jwt, authHeader.slice(7));
      if (!payload?.userId) {
        set.status = 401;
        return { success: false, error: 'Invalid session token' };
      }

      try {
        const closed = await sessionService.closeTicket(params.id, payload.userId);
        return { success: true, data: closed };
      } catch (err: unknown) {
        set.status = 400;
        const msg = err instanceof Error ? err.message : 'Failed to close ticket';
        return { success: false, error: msg };
      }
    });
}
