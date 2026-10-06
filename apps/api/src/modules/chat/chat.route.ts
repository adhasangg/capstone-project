import { jwt } from '@elysiajs/jwt';
import { type SenderType, type UserRole, sendChatMessageSchema } from '@safespace/shared';
import { Elysia } from 'elysia';
import type { ChatService } from './chat.service';

export interface ChatRouteOptions {
  readonly chatService: ChatService;
  readonly jwtSecret: string;
}

interface JwtSessionPayload {
  readonly userId: string;
  readonly role: UserRole;
  readonly pseudonym: string;
}

export function createChatRoute({ chatService, jwtSecret }: ChatRouteOptions) {
  return new Elysia({ prefix: '/api/chat' })
    .use(
      jwt({
        name: 'jwt',
        secret: jwtSecret,
      }),
    )
    .post('/:sessionId/send', async ({ params, body, headers, jwt, set }) => {
      const authHeader = headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        set.status = 401;
        return { success: false, error: 'Unauthorized: Bearer token required' };
      }

      const payload = (await jwt.verify(
        authHeader.slice(7),
      )) as unknown as JwtSessionPayload | null;
      if (!payload?.userId) {
        set.status = 401;
        return { success: false, error: 'Invalid session token' };
      }

      const parsed = sendChatMessageSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return { success: false, error: parsed.error.issues[0]?.message };
      }

      const senderType: SenderType = payload.role === 'student' ? 'student' : 'counselor';

      try {
        const message = await chatService.sendMessage(
          params.sessionId,
          senderType,
          parsed.data.encryptedContent,
          parsed.data.iv,
        );
        set.status = 201;
        return { success: true, data: message };
      } catch (err: unknown) {
        set.status = 400;
        const msg = err instanceof Error ? err.message : 'Failed to send message';
        return { success: false, error: msg };
      }
    })
    .get('/:sessionId/messages', async ({ params, headers, jwt, set }) => {
      const authHeader = headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        set.status = 401;
        return { success: false, error: 'Unauthorized: Bearer token required' };
      }

      const payload = (await jwt.verify(
        authHeader.slice(7),
      )) as unknown as JwtSessionPayload | null;
      if (!payload?.userId) {
        set.status = 401;
        return { success: false, error: 'Invalid session token' };
      }

      try {
        const messages = await chatService.getMessages(params.sessionId);
        return { success: true, data: messages };
      } catch (err: unknown) {
        set.status = 400;
        const msg = err instanceof Error ? err.message : 'Failed to load messages';
        return { success: false, error: msg };
      }
    });
}
