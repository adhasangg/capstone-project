import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { createDatabaseConnection } from '@safespace/db';
import { Elysia } from 'elysia';
import { config } from './config/env';
import { createAssessmentRoute } from './modules/assessment/assessment.route';
import { AssessmentService } from './modules/assessment/assessment.service';
import { AuthRepository } from './modules/auth/auth.repository';
import { createAuthRoute } from './modules/auth/auth.route';
import { AuthService } from './modules/auth/auth.service';
import { SessionRepository } from './modules/session/session.repository';
import { createSessionRoute } from './modules/session/session.route';
import { SessionService } from './modules/session/session.service';

export function createServerApp() {
  const { db } = createDatabaseConnection();
  const authRepository = new AuthRepository(db);
  const authService = new AuthService(
    authRepository,
    config.identityPepperSecret,
    config.allowedEmailDomains,
  );
  const assessmentService = new AssessmentService();
  const sessionRepository = new SessionRepository(db);
  const sessionService = new SessionService(sessionRepository);

  return new Elysia()
    .use(
      cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    )
    .use(
      swagger({
        documentation: {
          info: {
            title: 'SafeSpace PWA API',
            version: '1.0.0',
            description: 'Double-Blind Anonymous Counseling Platform with End-to-End Encryption',
          },
        },
      }),
    )
    .get('/health', () => ({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }))
    .get('/', () => ({
      name: 'SafeSpace PWA API',
      version: '1.0.0',
      docs: '/swagger',
    }))
    .use(
      createAuthRoute({
        authService,
        jwtSecret: config.jwtSecret,
      }),
    )
    .use(
      createAssessmentRoute({
        assessmentService,
      }),
    )
    .use(
      createSessionRoute({
        sessionService,
        jwtSecret: config.jwtSecret,
      }),
    );
}
