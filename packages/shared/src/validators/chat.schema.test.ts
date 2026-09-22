import { describe, expect, it } from 'bun:test';
import { encryptedMessageSchema } from './chat.schema';

describe('encryptedMessageSchema', () => {
  it('should accept valid encrypted message payload', () => {
    const payload = {
      sessionId: '018f3a21-7294-71bc-9bf2-d1d8a1f8101a',
      senderType: 'student',
      encryptedContent: 'dGhpcyBpcyBhbiBlbmNyeXB0ZWQgY2lwaGVydGV4dA==',
      timestamp: new Date().toISOString(),
    };
    const result = encryptedMessageSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('should reject invalid senderType', () => {
    const payload = {
      sessionId: '018f3a21-7294-71bc-9bf2-d1d8a1f8101a',
      senderType: 'hacker',
      encryptedContent: 'valid-base64',
      timestamp: new Date().toISOString(),
    };
    const result = encryptedMessageSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('should reject empty encrypted content', () => {
    const payload = {
      sessionId: '018f3a21-7294-71bc-9bf2-d1d8a1f8101a',
      senderType: 'counselor',
      encryptedContent: '',
      timestamp: new Date().toISOString(),
    };
    const result = encryptedMessageSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
