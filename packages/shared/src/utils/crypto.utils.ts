import { createHmac } from 'node:crypto';

/**
 * Performs a one-way deterministic cryptographic HMAC-SHA-256 on an external subject identifier.
 * Ensures that the actual subject identifier cannot be derived from the stored hash.
 *
 * @param googleSub - The unique 'sub' identifier from Google OAuth token.
 * @param pepperSecret - A high-entropy secret pepper key from the environment.
 * @returns A 64-character hexadecimal SHA-256 hash.
 */
export function hashIdentity(googleSub: string, pepperSecret: string): string {
  if (!googleSub || googleSub.trim().length === 0) {
    throw new Error('Subject identifier cannot be empty');
  }

  if (!pepperSecret || pepperSecret.length < 16) {
    throw new Error('Pepper secret must be at least 16 characters');
  }

  return createHmac('sha256', pepperSecret).update(googleSub).digest('hex');
}
