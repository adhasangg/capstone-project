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
  // Support developer testing / sandbox token in non-production environments
  if (idToken.startsWith('dev_') || idToken.startsWith('mock_')) {
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SANDBOX === 'false') {
      throw new Error('Mode sandbox autentikasi dinonaktifkan pada lingkungan produksi');
    }
    const isAdmin = idToken.includes('admin') || idToken.includes('sysadmin');
    const isCounselor = idToken.includes('counselor') || idToken.includes('konselor');
    return {
      sub: `mock_google_sub_${idToken}`,
      email: isAdmin
        ? 'fhasanblog@gmail.com'
        : isCounselor
          ? 'konselor@ecampus.ac.id'
          : 'mahasiswa.pjj@ecampus.ac.id',
      emailVerified: true,
    };
  }

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
    private readonly adminEmails: ReadonlyArray<string> = [],
    private readonly counselorEmails: ReadonlyArray<string> = [],
  ) {}

  private resolveRole(email: string): UserRole {
    const normalized = email.toLowerCase().trim();
    const isAdmin = this.adminEmails.some((e) => e.toLowerCase().trim() === normalized);
    if (isAdmin) {
      return 'admin';
    }

    const isCounselor =
      this.counselorEmails.some((e) => e.toLowerCase().trim() === normalized) ||
      normalized.includes('konselor') ||
      normalized.includes('counselor');
    if (isCounselor) {
      return 'counselor';
    }

    return 'student';
  }

  private getRolePrefix(role: UserRole): string {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'counselor':
        return 'Konselor';
      default:
        return 'Mahasiswa';
    }
  }

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
    const determinedRole = this.resolveRole(payload.email);

    const existingUser = await this.repo.findByHashedIdentity(hashedIdentity);
    if (existingUser) {
      const activeRole = existingUser.role === 'admin' ? 'admin' : determinedRole;
      return {
        id: existingUser.id,
        role: activeRole,
        pseudonym: generatePseudonym(this.getRolePrefix(activeRole)),
      };
    }

    const newUser = await this.repo.createUser(hashedIdentity, determinedRole);
    return {
      id: newUser.id,
      role: newUser.role,
      pseudonym: generatePseudonym(this.getRolePrefix(newUser.role)),
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

    return {
      id: user.id,
      role: user.role,
      pseudonym: generatePseudonym(this.getRolePrefix(user.role)),
    };
  }

  /**
   * Lists all users anonymously for sysadmin management.
   */
  async listAllUsers(): Promise<
    Array<{ id: string; role: UserRole; pseudonym: string; createdAt: Date }>
  > {
    const users = await this.repo.findAll();
    return users.map((u) => ({
      id: u.id,
      role: u.role,
      pseudonym: generatePseudonym(this.getRolePrefix(u.role)),
      createdAt: u.createdAt,
    }));
  }

  /**
   * Updates a user role (elevate to counselor/admin or downgrade to student).
   */
  async updateUserRole(
    userId: string,
    newRole: UserRole,
  ): Promise<{ id: string; role: UserRole; pseudonym: string } | null> {
    const updated = await this.repo.updateRole(userId, newRole);
    if (!updated) {
      return null;
    }
    return {
      id: updated.id,
      role: updated.role,
      pseudonym: generatePseudonym(this.getRolePrefix(updated.role)),
    };
  }
}
