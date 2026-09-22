export type UserRole = 'student' | 'counselor';

export interface UserAuthSession {
  readonly userId: string;
  readonly role: UserRole;
  readonly pseudonym: string;
  readonly exp?: number;
}

export interface GoogleAuthPayload {
  readonly idToken: string;
}

export interface SanitizedIdentity {
  readonly hashedIdentity: string;
  readonly domain: string;
}
