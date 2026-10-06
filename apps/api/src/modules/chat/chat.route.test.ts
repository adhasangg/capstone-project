import { describe, expect, it } from 'bun:test';
import { jwt } from '@elysiajs/jwt';
import { Elysia } from 'elysia';
import { createChatRoute } from './chat.route';
import { ChatService } from './chat.service';
import type { ChatMessageDto, IChatRepository, SendMessageDto } from './chat.types';

class MockChatRepository implements IChatRepository {
  private messages: ChatMessageDto[] = [];

  async createMessage(data: SendMessageDto): Promise<ChatMessageDto> {
    const record: ChatMessageDto = {
      id: `msg-${this.messages.length + 1}`,
      sessionId: data.sessionId,
      senderType: data.senderType,
      encryptedContent: data.encryptedContent,
      iv: data.iv ?? null,
      timestamp: new Date(),
    };
    this.messages.push(record);
    return record;
  }

  async getMessagesBySessionId(sessionId: string): Promise<ChatMessageDto[]> {
    return this.messages.filter((m) => m.sessionId === sessionId);
  }
}

describe('Chat Route Integration Tests (E2EE Ciphertext Transport)', () => {
  const jwtSecret = 'super_secret_test_jwt_key_at_least_32_characters_long';
  const chatRepository = new MockChatRepository();
  const chatService = new ChatService(chatRepository);

  const authHelper = new Elysia().use(
    jwt({
      name: 'jwt',
      secret: jwtSecret,
    }),
  );

  const app = new Elysia().use(
    createChatRoute({
      chatService,
      jwtSecret,
    }),
  );

  const createToken = async (role: 'student' | 'counselor') => {
    return authHelper.decorator.jwt.sign({
      userId: '0192e4a8-6f1b-789a-bcde-000000000001',
      role,
      pseudonym: role === 'student' ? 'Mahasiswa #1234' : 'Konselor_A',
    });
  };

  it('POST /api/chat/:sessionId/send > should return 401 Unauthorized if no auth token is provided', async () => {
    const res = await app.handle(
      new Request('http://localhost/api/chat/sess-1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedContent: 'ciphertext' }),
      }),
    );

    expect(res.status).toBe(401);
  });

  it('POST /api/chat/:sessionId/send > should successfully store encrypted message when authenticated', async () => {
    const token = await createToken('student');
    const res = await app.handle(
      new Request('http://localhost/api/chat/sess-1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          encryptedContent: 'a1b2c3d4e5f6g7h8i9j0_ciphertext',
          iv: 'random_iv_123',
        }),
      }),
    );

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.encryptedContent).toBe('a1b2c3d4e5f6g7h8i9j0_ciphertext');
    expect(body.data.iv).toBe('random_iv_123');
    expect(body.data.senderType).toBe('student');
  });

  it('POST /api/chat/:sessionId/send > should return 400 when encryptedContent is empty', async () => {
    const token = await createToken('student');
    const res = await app.handle(
      new Request('http://localhost/api/chat/sess-1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          encryptedContent: '',
        }),
      }),
    );

    expect(res.status).toBe(400);
  });

  it('GET /api/chat/:sessionId/messages > should return 401 Unauthorized if no auth token', async () => {
    const res = await app.handle(
      new Request('http://localhost/api/chat/sess-1/messages', {
        headers: {},
      }),
    );

    expect(res.status).toBe(401);
  });

  it('GET /api/chat/:sessionId/messages > should return message history for authenticated user', async () => {
    const token = await createToken('counselor');
    const res = await app.handle(
      new Request('http://localhost/api/chat/sess-1/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });
});
