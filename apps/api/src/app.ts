import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { createDatabaseConnection } from '@safespace/db';
import { Elysia } from 'elysia';
import { config } from './config/env';
import { createAssessmentRoute } from './modules/assessment/assessment.route';
import { AssessmentService } from './modules/assessment/assessment.service';
import { AuthRepository } from './modules/auth/auth.repository';
import { createAuthRoute } from './modules/auth/auth.route';
import { AuthService, defaultGoogleTokenVerifier } from './modules/auth/auth.service';
import { ChatRepository } from './modules/chat/chat.repository';
import { createChatRoute } from './modules/chat/chat.route';
import { ChatService } from './modules/chat/chat.service';
import { SessionRepository } from './modules/session/session.repository';
import { createSessionRoute } from './modules/session/session.route';
import { SessionService } from './modules/session/session.service';

export function createServerApp() {
  const { db, client } = createDatabaseConnection();
  const authRepository = new AuthRepository(db);
  const authService = new AuthService(
    authRepository,
    config.identityPepperSecret,
    config.allowedEmailDomains,
    defaultGoogleTokenVerifier,
    config.adminEmails,
    config.counselorEmails,
  );
  const assessmentService = new AssessmentService();
  const sessionRepository = new SessionRepository(db);
  const sessionService = new SessionService(sessionRepository);
  const chatRepository = new ChatRepository(db);
  const chatService = new ChatService(chatRepository);

  // Probe database non-blockingly to avoid 10s connection timeout stalls when offline
  client`SELECT 1`
    .then(() => {
      authRepository.setDbAvailable(true);
      sessionRepository.setDbAvailable(true);
      chatRepository.setDbAvailable(true);
    })
    .catch(() => {
      authRepository.setDbAvailable(false);
      sessionRepository.setDbAvailable(false);
      chatRepository.setDbAvailable(false);
    });

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
    )
    .use(
      createChatRoute({
        chatService,
        jwtSecret: config.jwtSecret,
      }),
    );
}
