import { describe, expect, it } from 'bun:test';
import { hashIdentity } from './crypto.utils';

describe('hashIdentity (One-Way Identity Sanitizer)', () => {
  const pepper = 'super-secret-pepper-for-tests-12345';
  const sampleGoogleSub = '109876543210987654321';

  it('should return a 64-character hex SHA-256 hash', () => {
    const hash = hashIdentity(sampleGoogleSub, pepper);
    expect(hash).toHaveLength(64);
    expect(/^[a-f0-9]{64}$/.test(hash)).toBe(true);
  });

  it('should produce deterministic output for identical inputs', () => {
    const hash1 = hashIdentity(sampleGoogleSub, pepper);
    const hash2 = hashIdentity(sampleGoogleSub, pepper);
    expect(hash1).toBe(hash2);
  });

  it('should produce completely different hashes when input changes', () => {
    const hash1 = hashIdentity(sampleGoogleSub, pepper);
    const hash2 = hashIdentity('different-sub-123456', pepper);
    expect(hash1).not.toBe(hash2);
  });

  it('should produce completely different hashes when pepper changes', () => {
    const hash1 = hashIdentity(sampleGoogleSub, pepper);
    const hash2 = hashIdentity(sampleGoogleSub, 'different-pepper-67890');
    expect(hash1).not.toBe(hash2);
  });

  it('should throw an error if googleSub is empty', () => {
    expect(() => hashIdentity('', pepper)).toThrow('Subject identifier cannot be empty');
  });

  it('should throw an error if pepperSecret is shorter than 16 characters', () => {
    expect(() => hashIdentity(sampleGoogleSub, 'short')).toThrow(
      'Pepper secret must be at least 16 characters',
    );
  });
});
