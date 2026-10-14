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

  const globalAny = globalThis as unknown as {
    Bun?: {
      CryptoHasher: new (
        algo: string,
        secret?: string,
      ) => { update: (data: string) => void; digest: (format: string) => string };
    };
    require?: (mod: string) => {
      createHmac: (
        algo: string,
        secret: string,
      ) => { update: (data: string) => { digest: (format: string) => string } };
    };
  };

  // 1. Fast native path in Bun runtime
  if (typeof globalAny.Bun?.CryptoHasher === 'function') {
    const hasher = new globalAny.Bun.CryptoHasher('sha256', pepperSecret);
    hasher.update(googleSub);
    return hasher.digest('hex');
  }

  // 2. Standard path in Node.js runtime
  if (typeof globalAny.require === 'function') {
    try {
      const nodeCrypto = globalAny.require('node:crypto');
      return nodeCrypto.createHmac('sha256', pepperSecret).update(googleSub).digest('hex');
    } catch {
      // Fall through to error
    }
  }

  throw new Error('hashIdentity is only available in server-side environments (Node.js/Bun).');
}
