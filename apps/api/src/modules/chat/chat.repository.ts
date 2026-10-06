import { type SafeSpaceDatabase, messages } from '@safespace/db';
import { asc, eq } from 'drizzle-orm';
import type { ChatMessageDto, IChatRepository, SendMessageDto } from './chat.types';

export class ChatRepository implements IChatRepository {
  constructor(private readonly db: SafeSpaceDatabase) {}

  /**
   * Persists an encrypted message into PostgreSQL.
   * Only stores ciphertext and initialization vector (IV).
   * Plaintext is NEVER stored or processed on the server.
   */
  async createMessage(data: SendMessageDto): Promise<ChatMessageDto> {
    const [inserted] = await this.db
      .insert(messages)
      .values({
        sessionId: data.sessionId,
        senderType: data.senderType,
        encryptedContent: data.encryptedContent,
        iv: data.iv ?? null,
      })
      .returning();

    if (!inserted) {
      throw new Error('Gagal menyimpan pesan terenkripsi ke database');
    }

    return {
      id: inserted.id,
      sessionId: inserted.sessionId,
      senderType: inserted.senderType,
      encryptedContent: inserted.encryptedContent,
      iv: inserted.iv,
      timestamp: inserted.timestamp,
    };
  }

  /**
   * Retrieves messages for a counseling session in chronological order.
   * Scoped strictly to the session, without joining users_auth table.
   */
  async getMessagesBySessionId(sessionId: string): Promise<ChatMessageDto[]> {
    const records = await this.db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(asc(messages.timestamp));

    return records.map((r) => ({
      id: r.id,
      sessionId: r.sessionId,
      senderType: r.senderType,
      encryptedContent: r.encryptedContent,
      iv: r.iv,
      timestamp: r.timestamp,
    }));
  }
}
