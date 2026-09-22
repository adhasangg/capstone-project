import type { UserRole } from '@safespace/shared';

export interface GoogleTokenPayload {
  readonly sub: string;
  readonly email: string;
  readonly emailVerified: boolean;
}

export type TokenVerifier = (idToken: string) => Promise<GoogleTokenPayload>;

export interface AuthenticatedUser {
  readonly id: string;
  readonly role: UserRole;
  readonly pseudonym: string;
}

export interface AuthSessionResponse {
  readonly user: AuthenticatedUser;
  readonly token: string;
}
