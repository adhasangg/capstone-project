/**
 * Web Crypto API Utility for End-to-End Encryption (E2EE)
 * Standards: AES-GCM-256 with 96-bit random IVs and PBKDF2 key derivation.
 *
 * Ensures Zero-Knowledge: Plaintext never leaves the client browser.
 * Only base64 ciphertext and IV are transmitted to and stored by the server.
 */

// Salt for session-based deterministic key derivation in room
const STATIC_ROOM_SALT = new TextEncoder().encode('SafeSpace-UT-E2EE-Room-Salt-2026');

/**
 * Derives an AES-GCM 256-bit CryptoKey from a given sessionId.
 */
async function deriveSessionKey(sessionId: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(sessionId),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: STATIC_ROOM_SALT,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Encrypts plaintext string using AES-GCM 256.
 * Returns base64-encoded ciphertext and hex-encoded IV.
 */
export async function encryptClientMessage(
  plainText: string,
  sessionId: string,
): Promise<{ cipherText: string; iv: string }> {
  const key = await deriveSessionKey(sessionId);
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const encodedText = new TextEncoder().encode(plainText);

  const cipherBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedText,
  );

  // Convert cipherBuffer to Base64
  const cipherBytes = new Uint8Array(cipherBuffer);
  let binary = '';
  for (let i = 0; i < cipherBytes.byteLength; i++) {
    binary += String.fromCharCode(cipherBytes[i]);
  }
  const cipherText = btoa(binary);

  // Convert IV to Hex
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { cipherText, iv: ivHex };
}

/**
 * Decrypts base64-encoded ciphertext using AES-GCM 256 and hex IV.
 * Returns decoded plaintext string.
 */
export async function decryptClientMessage(
  cipherText: string,
  ivHex: string,
  sessionId: string,
): Promise<string> {
  try {
    const key = await deriveSessionKey(sessionId);

    // Convert hex IV to Uint8Array
    const ivMatch = ivHex.match(/.{1,2}/g);
    if (!ivMatch) throw new Error('Invalid IV format');
    const iv = new Uint8Array(ivMatch.map((byte) => Number.parseInt(byte, 16)));

    // Convert Base64 to Uint8Array
    const binary = atob(cipherText);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      bytes,
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch {
    // If decryption fails (e.g. legacy plain message or corrupt key), fallback gracefully
    return '[Pesan terenkripsi tidak dapat didekripsi]';
  }
}
