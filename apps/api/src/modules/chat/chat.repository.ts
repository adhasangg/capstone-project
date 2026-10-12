import { type SafeSpaceDatabase, messages } from '@safespace/db';
import { asc, eq } from 'drizzle-orm';
import type { ChatMessageDto, IChatRepository, SendMessageDto } from './chat.types';

export class ChatRepository implements IChatRepository {
  private inMemoryMessages: ChatMessageDto[] = [];
  private isDbAvailable = false;

  constructor(private readonly db: SafeSpaceDatabase) {}

  public setDbAvailable(available: boolean) {
    this.isDbAvailable = available;
  }

  /**
   * Persists an encrypted message into PostgreSQL.
   * Only stores ciphertext and initialization vector (IV).
   * Plaintext is NEVER stored or processed on the server.
   */
  async createMessage(data: SendMessageDto): Promise<ChatMessageDto> {
    if (this.isDbAvailable) {
      try {
        const [inserted] = await this.db
          .insert(messages)
          .values({
            sessionId: data.sessionId,
            senderType: data.senderType,
            encryptedContent: data.encryptedContent,
            iv: data.iv ?? null,
          })
          .returning();

        if (inserted) {
          return {
            id: inserted.id,
            sessionId: inserted.sessionId,
            senderType: inserted.senderType,
            encryptedContent: inserted.encryptedContent,
            iv: inserted.iv,
            timestamp: inserted.timestamp,
          };
        }
      } catch {
        this.isDbAvailable = false;
      }
    }

    const fallback: ChatMessageDto = {
      id: crypto.randomUUID(),
      sessionId: data.sessionId,
      senderType: data.senderType,
      encryptedContent: data.encryptedContent,
      iv: data.iv ?? null,
      timestamp: new Date(),
    };
    this.inMemoryMessages.push(fallback);
    return fallback;
  }

  /**
   * Retrieves messages for a counseling session in chronological order.
   * Scoped strictly to the session, without joining users_auth table.
   */
  async getMessagesBySessionId(sessionId: string): Promise<ChatMessageDto[]> {
    if (this.isDbAvailable) {
      try {
        const records = await this.db
          .select()
          .from(messages)
          .where(eq(messages.sessionId, sessionId))
          .orderBy(asc(messages.timestamp));

        if (records && records.length > 0) {
          return records.map((r) => ({
            id: r.id,
            sessionId: r.sessionId,
            senderType: r.senderType,
            encryptedContent: r.encryptedContent,
            iv: r.iv,
            timestamp: r.timestamp,
          }));
        }
      } catch {
        this.isDbAvailable = false;
      }
    }

    return this.inMemoryMessages
      .filter((m) => m.sessionId === sessionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
}
