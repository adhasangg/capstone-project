import { jwt } from '@elysiajs/jwt';
import type { UserRole } from '@safespace/shared';
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

      const payload = (await jwt.verify(
        authHeader.slice(7),
      )) as unknown as JwtSessionPayload | null;
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
          studentPseudonym: payload.pseudonym,
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

      const payload = (await jwt.verify(
        authHeader.slice(7),
      )) as unknown as JwtSessionPayload | null;
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
        beforeHandle: requireRoles(['counselor', 'admin']),
      },
    )
    .post(
      '/:id/accept',
      async ({ params, headers, jwt, set }) => {
        const authHeader = headers.authorization as string;
        const payload = (await jwt.verify(authHeader.slice(7))) as unknown as JwtSessionPayload;

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
        beforeHandle: requireRoles(['counselor', 'admin']),
      },
    )
    .post('/:id/close', async ({ params, headers, jwt, set }) => {
      const authHeader = headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        set.status = 401;
        return { success: false, error: 'Unauthorized' };
      }

      const payload = (await jwt.verify(
        authHeader.slice(7),
      )) as unknown as JwtSessionPayload | null;
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
