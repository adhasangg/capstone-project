import { describe, expect, it } from 'bun:test';
import { googleAuthSchema, isAllowedEmailDomain } from './auth.schema';

describe('isAllowedEmailDomain', () => {
  it('should accept email matching allowed domain', () => {
    expect(isAllowedEmailDomain('student@ecampus.ut.ac.id', ['ecampus.ut.ac.id'])).toBe(true);
  });

  it('should reject email from non-whitelisted domain', () => {
    expect(isAllowedEmailDomain('intruder@gmail.com', ['ecampus.ut.ac.id'])).toBe(false);
  });

  it('should allow any domain when wildcard "*" is configured', () => {
    expect(isAllowedEmailDomain('user@random-school.edu', ['*'])).toBe(true);
    expect(isAllowedEmailDomain('user@gmail.com', ['*'])).toBe(true);
  });

  it('should handle multiple allowed domains case-insensitively', () => {
    const allowed = ['ecampus.ut.ac.id', 'ugm.ac.id', 'ui.ac.id'];
    expect(isAllowedEmailDomain('ALICE@ECAMPUS.UT.AC.ID', allowed)).toBe(true);
    expect(isAllowedEmailDomain('bob@ugm.ac.id', allowed)).toBe(true);
    expect(isAllowedEmailDomain('charlie@itb.ac.id', allowed)).toBe(false);
  });

  it('should reject invalid email formats', () => {
    expect(isAllowedEmailDomain('not-an-email', ['ecampus.ut.ac.id'])).toBe(false);
    expect(isAllowedEmailDomain('', ['*'])).toBe(false);
  });
});

describe('googleAuthSchema', () => {
  it('should parse valid Google auth payload', () => {
    const result = googleAuthSchema.safeParse({ idToken: 'valid-jwt-token-string' });
    expect(result.success).toBe(true);
  });

  it('should reject payload missing idToken or with empty idToken', () => {
    expect(googleAuthSchema.safeParse({}).success).toBe(false);
    expect(googleAuthSchema.safeParse({ idToken: '' }).success).toBe(false);
    expect(googleAuthSchema.safeParse({ idToken: 123 }).success).toBe(false);
  });
});
