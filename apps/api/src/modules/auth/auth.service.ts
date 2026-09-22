import { generatePseudonym, hashIdentity, isAllowedEmailDomain } from '@safespace/shared';
import type { IAuthRepository } from './auth.repository';
import type { AuthenticatedUser, GoogleTokenPayload, TokenVerifier } from './auth.types';

interface GoogleTokenInfoResponse {
  readonly sub?: string;
  readonly email?: string;
  readonly email_verified?: string;
  readonly error_description?: string;
}

/**
 * Default production verifier calling Google TokenInfo API.
 */
export async function defaultGoogleTokenVerifier(idToken: string): Promise<GoogleTokenPayload> {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
  );

  if (!response.ok) {
    throw new Error('Invalid or expired Google ID token');
  }

  const data = (await response.json()) as GoogleTokenInfoResponse;

  if (!data.sub || !data.email) {
    throw new Error('Google token is missing sub or email claims');
  }

  return {
    sub: data.sub,
    email: data.email,
    emailVerified: data.email_verified === 'true',
  };
}

export class AuthService {
  constructor(
    private readonly repo: IAuthRepository,
    private readonly pepperSecret: string,
    private readonly allowedDomains: ReadonlyArray<string>,
    private readonly tokenVerifier: TokenVerifier = defaultGoogleTokenVerifier,
  ) {}

  /**
   * Authenticates a user with a Google ID token, applying double-blind identity sanitization.
   *
   * @param idToken - The Google ID Token from the client
   * @returns AuthenticatedUser with anonymous pseudonym and UUID
   */
  async authenticateWithGoogle(idToken: string): Promise<AuthenticatedUser> {
    if (!idToken || idToken.trim().length === 0) {
      throw new Error('ID Token must not be empty');
    }

    const payload = await this.tokenVerifier(idToken);

    if (!payload.emailVerified) {
      throw new Error('Google account email is not verified');
    }

    const isAllowed = isAllowedEmailDomain(payload.email, this.allowedDomains);
    if (!isAllowed) {
      throw new Error(`Email domain is not authorized: ${payload.email}`);
    }

    // Double-blind: Immediately hash the Google subject identifier and discard raw email/sub
    const hashedIdentity = hashIdentity(payload.sub, this.pepperSecret);

    const existingUser = await this.repo.findByHashedIdentity(hashedIdentity);
    if (existingUser) {
      const prefix = existingUser.role === 'counselor' ? 'Konselor' : 'Mahasiswa';
      return {
        id: existingUser.id,
        role: existingUser.role,
        pseudonym: generatePseudonym(prefix),
      };
    }

    const newUser = await this.repo.createUser(hashedIdentity, 'student');
    return {
      id: newUser.id,
      role: newUser.role,
      pseudonym: generatePseudonym('Mahasiswa'),
    };
  }

  /**
   * Retrieves a user by their anonymous UUID.
   */
  async getUserById(userId: string): Promise<AuthenticatedUser | null> {
    const user = await this.repo.findById(userId);
    if (!user) {
      return null;
    }

    const prefix = user.role === 'counselor' ? 'Konselor' : 'Mahasiswa';
    return {
      id: user.id,
      role: user.role,
      pseudonym: generatePseudonym(prefix),
    };
  }
}
