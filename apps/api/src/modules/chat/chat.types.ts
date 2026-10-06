import type { SenderType } from '@safespace/shared';

export interface ChatMessageDto {
  id: string;
  sessionId: string;
  senderType: SenderType;
  encryptedContent: string;
  iv?: string | null;
  timestamp: Date;
}

export interface SendMessageDto {
  sessionId: string;
  senderType: SenderType;
  encryptedContent: string;
  iv?: string;
}

export interface IChatRepository {
  createMessage(data: SendMessageDto): Promise<ChatMessageDto>;
  getMessagesBySessionId(sessionId: string): Promise<ChatMessageDto[]>;
}
