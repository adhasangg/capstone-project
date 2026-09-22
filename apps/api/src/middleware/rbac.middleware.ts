import type { UserRole } from '@safespace/shared';

interface JwtPayloadWithRole {
  readonly userId?: string;
  readonly role?: UserRole;
  readonly pseudonym?: string;
}

/**
 * Elysia beforeHandle guard enforcing Role-Based Access Control (RBAC).
 * Rejects requests with 401 Unauthorized if not logged in,
 * or 403 Forbidden if the user's role is not authorized.
 *
 * @param allowedRoles - Array of allowed roles for the endpoint
 */
export function requireRoles(allowedRoles: ReadonlyArray<UserRole>) {
  // biome-ignore lint/suspicious/noExplicitAny: Elysia beforeHandle context signature
  return async ({ headers, jwt, set }: any) => {
    const authHeader = headers.authorization as string | undefined;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication token is required',
        },
      };
    }

    const token = authHeader.slice(7);
    const payload = (await jwt.verify(token)) as JwtPayloadWithRole | null;

    if (!payload || !payload.userId || !payload.role) {
      set.status = 401;
      return {
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired session token',
        },
      };
    }

    if (!allowedRoles.includes(payload.role)) {
      set.status = 403;
      return {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied: role '${payload.role}' is not authorized`,
        },
      };
    }
  };
}
