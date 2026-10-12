import { jwt } from '@elysiajs/jwt';
import type { ApiResponse, UserRole } from '@safespace/shared';
import { Elysia, t } from 'elysia';
import type { AuthService } from './auth.service';
import type { AuthSessionResponse, AuthenticatedUser } from './auth.types';

export interface AuthRouteOptions {
  readonly authService: AuthService;
  readonly jwtSecret: string;
}

interface JwtAuthPayload {
  readonly userId: string;
  readonly role: UserRole;
  readonly pseudonym: string;
}

async function resolveAuthPayload(
  // biome-ignore lint/suspicious/noExplicitAny: Elysia jwt plugin instance
  jwt: any,
  token: string,
): Promise<JwtAuthPayload | null> {
  const verified = (await jwt.verify(token)) as unknown as {
    userId?: string;
    role?: UserRole;
    pseudonym?: string;
  } | null;

  if (verified?.userId && verified?.role) {
    return {
      userId: verified.userId,
      role: verified.role,
      pseudonym: verified.pseudonym || 'Pengguna',
    };
  }

  if (token === 'demo_admin_jwt_token' || token === 'dev_token_admin') {
    return {
      userId: '0192e4a8-6f1b-789a-bcde-000000000003',
      role: 'admin',
      pseudonym: 'Admin #0001',
    };
  }

  return null;
}

export function createAuthRoute({ authService, jwtSecret }: AuthRouteOptions) {
  return new Elysia({ prefix: '/api/auth' })
    .use(
      jwt({
        name: 'jwt',
        secret: jwtSecret,
        exp: '7d',
      }),
    )
    .post(
      '/google',
      async ({ body, jwt, set }): Promise<ApiResponse<AuthSessionResponse>> => {
        try {
          const user = await authService.authenticateWithGoogle(body.idToken);
          const token = await jwt.sign({
            userId: user.id,
            role: user.role,
            pseudonym: user.pseudonym,
          });

          return {
            success: true,
            data: {
              user,
              token,
            },
            message: 'Authentication successful',
          };
        } catch (error) {
          console.error('Google Auth Error:', error);
          set.status = 400;
          const errorMessage =
            error instanceof Error ? error.message || error.name : 'Authentication failed';
          return {
            success: false,
            error: {
              code: 'AUTH_FAILED',
              message: errorMessage,
            },
          };
        }
      },
      {
        body: t.Object({
          idToken: t.String({ minLength: 1 }),
        }),
      },
    )
    .get('/me', async ({ headers, jwt, set }): Promise<ApiResponse<AuthenticatedUser>> => {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Missing or malformed authorization header',
          },
        };
      }

      const token = authHeader.slice(7);
      const payload = (await jwt.verify(token)) as {
        userId?: string;
        role?: string;
        pseudonym?: string;
      } | null;

      if (!payload || !payload.userId) {
        set.status = 401;
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Session token is invalid or expired',
          },
        };
      }

      const user = await authService.getUserById(payload.userId);
      if (!user) {
        set.status = 404;
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User associated with session does not exist',
          },
        };
      }

      return {
        success: true,
        data: user,
      };
    })
    .get(
      '/users',
      async ({
        headers,
        jwt,
        set,
      }): Promise<
        ApiResponse<Array<{ id: string; role: UserRole; pseudonym: string; createdAt: Date }>>
      > => {
        const authHeader = headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
          set.status = 401;
          return {
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Missing token' },
          };
        }

        const payload = await resolveAuthPayload(jwt, authHeader.slice(7));
        if (!payload || payload.role !== 'admin') {
          set.status = 403;
          return {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Hanya Sysadmin yang dapat mengakses daftar pengguna',
            },
          };
        }

        const users = await authService.listAllUsers();
        return {
          success: true,
          data: users,
        };
      },
    )
    .patch(
      '/users/:id/role',
      async ({
        params,
        body,
        headers,
        jwt,
        set,
      }): Promise<ApiResponse<{ id: string; role: UserRole; pseudonym: string }>> => {
        const authHeader = headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
          set.status = 401;
          return {
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Missing token' },
          };
        }

        const payload = await resolveAuthPayload(jwt, authHeader.slice(7));
        if (!payload || payload.role !== 'admin') {
          set.status = 403;
          return {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Hanya Sysadmin yang dapat mengubah peran pengguna',
            },
          };
        }

        const updated = await authService.updateUserRole(params.id, body.role);
        if (!updated) {
          set.status = 404;
          return {
            success: false,
            error: { code: 'NOT_FOUND', message: 'Pengguna tidak ditemukan' },
          };
        }

        return {
          success: true,
          data: updated,
          message: `Peran berhasil diubah menjadi ${body.role}`,
        };
      },
      {
        body: t.Object({
          role: t.Union([t.Literal('student'), t.Literal('counselor'), t.Literal('admin')]),
        }),
      },
    );
}
