import { jwt } from '@elysiajs/jwt';
import type { ApiResponse } from '@safespace/shared';
import { Elysia, t } from 'elysia';
import type { AuthService } from './auth.service';
import type { AuthSessionResponse, AuthenticatedUser } from './auth.types';

export interface AuthRouteOptions {
  readonly authService: AuthService;
  readonly jwtSecret: string;
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
          set.status = 400;
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
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
    });
}
