import type { SenderType } from '@safespace/shared';
import type { ChatMessageDto, IChatRepository } from './chat.types';

export class ChatService {
  constructor(private readonly chatRepository: IChatRepository) {}

  /**
   * Dispatches an encrypted message to the session message log.
   */
  async sendMessage(
    sessionId: string,
    senderType: SenderType,
    encryptedContent: string,
    iv?: string,
  ): Promise<ChatMessageDto> {
    if (!sessionId || sessionId.trim() === '') {
      throw new Error('ID Sesi tidak boleh kosong');
    }

    if (!encryptedContent || encryptedContent.trim() === '') {
      throw new Error('Konten pesan terenkripsi tidak boleh kosong');
    }

    return this.chatRepository.createMessage({
      sessionId,
      senderType,
      encryptedContent: encryptedContent.trim(),
      iv: iv?.trim(),
    });
  }

  /**
   * Retrieves all ciphertext messages for a given session.
   */
  async getMessages(sessionId: string): Promise<ChatMessageDto[]> {
    if (!sessionId || sessionId.trim() === '') {
      throw new Error('ID Sesi tidak boleh kosong');
    }

    return this.chatRepository.getMessagesBySessionId(sessionId);
  }
}
