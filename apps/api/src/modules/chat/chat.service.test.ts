import { describe, expect, it } from 'bun:test';
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

describe('ChatService (TDD & Zero-Knowledge E2EE)', () => {
  it('should successfully store an encrypted message without plaintext access', async () => {
    const repo = new MockChatRepository();
    const service = new ChatService(repo);

    const sessionId = '0192e4a8-6f1b-789a-bcde-000000000001';
    const fakeCiphertext = '4a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c';
    const fakeIv = '1a2b3c4d5e6f7a8b9c0d1e2f';

    const result = await service.sendMessage(sessionId, 'student', fakeCiphertext, fakeIv);

    expect(result.id).toBeDefined();
    expect(result.sessionId).toBe(sessionId);
    expect(result.senderType).toBe('student');
    expect(result.encryptedContent).toBe(fakeCiphertext);
    expect(result.iv).toBe(fakeIv);
  });

  it('should reject storing a message with empty encrypted content', async () => {
    const repo = new MockChatRepository();
    const service = new ChatService(repo);

    const sessionId = '0192e4a8-6f1b-789a-bcde-000000000001';

    expect(service.sendMessage(sessionId, 'student', '   ')).rejects.toThrow(
      'Konten pesan terenkripsi tidak boleh kosong',
    );
  });

  it('should reject storing a message with empty sessionId', async () => {
    const repo = new MockChatRepository();
    const service = new ChatService(repo);

    expect(service.sendMessage('', 'counselor', 'ciphertext')).rejects.toThrow(
      'ID Sesi tidak boleh kosong',
    );
  });

  it('should retrieve conversation history for a given sessionId', async () => {
    const repo = new MockChatRepository();
    const service = new ChatService(repo);

    const sessionId = '0192e4a8-6f1b-789a-bcde-000000000001';

    await service.sendMessage(sessionId, 'student', 'ciphertext-1', 'iv-1');
    await service.sendMessage(sessionId, 'counselor', 'ciphertext-2', 'iv-2');
    await service.sendMessage('other-session', 'student', 'ciphertext-3', 'iv-3');

    const history = await service.getMessages(sessionId);
    expect(history.length).toBe(2);
    expect(history[0]?.encryptedContent).toBe('ciphertext-1');
    expect(history[1]?.encryptedContent).toBe('ciphertext-2');
  });
});
