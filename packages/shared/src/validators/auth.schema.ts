import { z } from 'zod';

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, 'ID Token must not be empty'),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;

/**
 * Validates if an email's domain matches the allowed domains whitelist.
 * Supports wildcard '*' for open adoption.
 *
 * @param email - User's email string
 * @param allowedDomains - Array of allowed domain strings (e.g. ['ecampus.ut.ac.id', '*'])
 * @returns Boolean indicating whether the domain is allowed
 */
export function isAllowedEmailDomain(
  email: string,
  allowedDomains: ReadonlyArray<string>,
): boolean {
  if (!email || !email.includes('@')) {
    return false;
  }

  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) {
    return false;
  }

  const domain = parts[1];
  if (!domain || domain.length === 0) {
    return false;
  }

  if (allowedDomains.includes('*')) {
    return true;
  }

  const normalizedAllowed = allowedDomains.map((d) => d.trim().toLowerCase());
  return normalizedAllowed.includes(domain);
}
