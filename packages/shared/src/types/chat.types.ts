export type SenderType = 'student' | 'counselor' | 'system';

export interface EncryptedMessagePayload {
  readonly sessionId: string;
  readonly senderType: SenderType;
  readonly encryptedContent: string;
  readonly iv?: string;
  readonly timestamp: string;
}

export interface StoredMessage {
  readonly id: string;
  readonly sessionId: string;
  readonly senderType: SenderType;
  readonly encryptedContent: string;
  readonly timestamp: Date;
}
