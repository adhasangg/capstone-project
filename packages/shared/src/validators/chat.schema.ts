import { z } from 'zod';

export const senderTypeEnum = z.enum(['student', 'counselor', 'system']);

export const encryptedMessageSchema = z.object({
  sessionId: z.string().uuid('Invalid session UUID'),
  senderType: senderTypeEnum,
  encryptedContent: z.string().min(1, 'Encrypted content cannot be empty'),
  iv: z.string().optional(),
  timestamp: z.string(),
});

export type EncryptedMessageInput = z.infer<typeof encryptedMessageSchema>;
