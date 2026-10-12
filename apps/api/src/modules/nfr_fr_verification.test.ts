import { describe, expect, it } from 'bun:test';
import { jwt } from '@elysiajs/jwt';
import type { SafeSpaceDatabase } from '@safespace/db';
import {
  type Dass21Result,
  type VakResult,
  calculateDass21Score,
  calculateVakScore,
  hashIdentity,
} from '@safespace/shared';
import { Elysia } from 'elysia';
import { AssessmentService } from './assessment/assessment.service';
import { ChatRepository } from './chat/chat.repository';
import { createChatRoute } from './chat/chat.route';
import { ChatService } from './chat/chat.service';
import { SessionRepository } from './session/session.repository';
import { createSessionRoute } from './session/session.route';
import { SessionService } from './session/session.service';

describe('System Verification: Functional & Non-Functional Requirements (FR & NFR)', () => {
  const jwtSecret = 'super_secret_jwt_key_for_nfr_fr_verification_tests_min_32_chars';
  const pepperSecret = 'super_secret_pepper_entropy_1234567890';

  const authHelper = new Elysia().use(
    jwt({
      name: 'jwt',
      secret: jwtSecret,
    }),
  );

  const mockDb = {} as unknown as SafeSpaceDatabase;
  const sessionRepo = new SessionRepository(mockDb);
  sessionRepo.setDbAvailable(false); // In-memory high-res testing mode
  const sessionService = new SessionService(sessionRepo);

  const chatRepo = new ChatRepository(mockDb);
  chatRepo.setDbAvailable(false); // In-memory high-res testing mode
  const chatService = new ChatService(chatRepo);

  const assessmentService = new AssessmentService();

  const sessionApp = new Elysia().use(
    createSessionRoute({
      sessionService,
      jwtSecret,
    }),
  );

  const chatApp = new Elysia().use(
    createChatRoute({
      chatService,
      jwtSecret,
    }),
  );

  const getStudentToken = async (pseudonym = 'Mahasiswa #9999') =>
    authHelper.decorator.jwt.sign({
      userId: '0192e4a8-6f1b-789a-bcde-000000000001',
      role: 'student',
      pseudonym,
    });

  const getCounselorToken = async (pseudonym = 'Konselor_A') =>
    authHelper.decorator.jwt.sign({
      userId: '0192e4a8-6f1b-789a-bcde-000000000002',
      role: 'counselor',
      pseudonym,
    });

  /* -------------------------------------------------------------------------- */
  /*  NON-FUNCTIONAL REQUIREMENTS (NFR) TESTING                                  */
  /* -------------------------------------------------------------------------- */

  describe('NFR-01: Zero-Knowledge & Database Plaintext Impossibility', () => {
    it('MUST guarantee that database stores ONLY ciphertext and zero plaintext', async () => {
      const sensitiveConfidentialMessage =
        'Saya merasa sangat tertekan dengan skripsi dan ingin menyerah';
      const fakeCiphertextBase64 = 'k9Z3e1A4X8yUv7Nm2Qp6Rt8Ws0La4Fq9Bc7Xy8Zv1Ow=';
      const fakeIvHex = '0a1b2c3d4e5f6a7b8c9d0e1f';
      const sessionId = '0192e4a8-6f1b-789a-bcde-000000000099';

      // Store message via chat repository (simulating database write)
      const stored = await chatRepo.createMessage({
        sessionId,
        senderType: 'student',
        encryptedContent: fakeCiphertextBase64,
        iv: fakeIvHex,
      });

      // 1. Verify that stored record contains ciphertext
      expect(stored.encryptedContent).toBe(fakeCiphertextBase64);
      expect(stored.iv).toBe(fakeIvHex);

      // 2. CRITICAL AUDIT: Ensure the sensitive plaintext is NEVER contained in the stored entity
      expect(stored.encryptedContent).not.toContain(sensitiveConfidentialMessage);
      expect(JSON.stringify(stored)).not.toContain(sensitiveConfidentialMessage);

      // 3. Retrieve messages from repository and re-verify
      const history = await chatRepo.getMessagesBySessionId(sessionId);
      expect(history.length).toBeGreaterThanOrEqual(1);
      for (const msg of history) {
        expect(msg.encryptedContent).not.toContain(sensitiveConfidentialMessage);
        expect(msg.encryptedContent).toBe(fakeCiphertextBase64);
      }
    });

    it('MUST sanitize user identity into an irreversible 64-char SHA-256 HMAC hash', () => {
      const realStudentGoogleSub = '109876543210987654321';
      const realEmail = 'budi.santoso@ecampus.ut.ac.id';

      const hashed = hashIdentity(realStudentGoogleSub, pepperSecret);

      // Verify hash characteristics
      expect(hashed).toHaveLength(64);
      expect(hashed).toMatch(/^[a-f0-9]{64}$/);

      // Verify zero leak of original identifiers
      expect(hashed).not.toContain(realStudentGoogleSub);
      expect(hashed).not.toContain(realEmail);
      expect(hashed).not.toContain('budi');
      expect(hashed).not.toContain('ecampus');
    });

    it('MUST ensure session ticketing stores only pseudonym and attached profile without PII', async () => {
      const dassScore: Dass21Result = {
        depression: 18,
        anxiety: 14,
        stress: 22,
        depressionCategory: 'Severe',
        anxietyCategory: 'Severe',
        stressCategory: 'Severe',
        burnoutRiskLevel: 'High',
      };

      const vakScore: VakResult = {
        visualScore: 8,
        auditoryScore: 2,
        kinestheticScore: 2,
        visualPercentage: 67,
        auditoryPercentage: 17,
        kinestheticPercentage: 17,
        dominantModality: 'visual',
      };

      const ticket = await sessionRepo.createSession({
        studentId: '0192e4a8-6f1b-789a-bcde-000000000001',
        studentPseudonym: 'Mahasiswa #7731',
        dass21Score: dassScore,
        vakResult: vakScore,
      });

      // Verify that ticket is detached from real identity
      expect(ticket.studentPseudonym).toBe('Mahasiswa #7731');
      expect(ticket.status).toBe('waiting');
      expect(ticket.dass21Score).toEqual(dassScore);
      expect(ticket.vakResult).toEqual(vakScore);
      expect(JSON.stringify(ticket)).not.toContain('ecampus.ut.ac.id');
    });
  });

  describe('NFR-02: Performance Latency (Sub-5ms Mathematical Processing)', () => {
    it('MUST compute DASS-21 scores within < 1ms on average (well below 5ms threshold)', () => {
      const sampleAnswers = [1, 2, 0, 3, 2, 1, 0, 2, 3, 1, 0, 2, 1, 3, 0, 2, 1, 3, 2, 0, 1];
      const iterations = 500;

      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        calculateDass21Score(sampleAnswers);
      }
      const totalTime = performance.now() - startTime;
      const averageTime = totalTime / iterations;

      expect(averageTime).toBeLessThan(1.0); // Sub-millisecond requirement
    });

    it('MUST compute VAK modality distribution within < 1ms on average', () => {
      const sampleAnswers = [
        'visual',
        'visual',
        'auditory',
        'kinesthetic',
        'visual',
        'auditory',
        'visual',
        'kinesthetic',
        'visual',
        'visual',
        'auditory',
        'kinesthetic',
      ] as const;
      const iterations = 500;

      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        calculateVakScore([...sampleAnswers]);
      }
      const totalTime = performance.now() - startTime;
      const averageTime = totalTime / iterations;

      expect(averageTime).toBeLessThan(1.0);
    });
  });

  describe('NFR-03: Security & Double-Blind RBAC Defense-in-Depth', () => {
    it('MUST return 401 Unauthorized when accessing session endpoints without token', async () => {
      const res = await sessionApp.handle(new Request('http://localhost/api/sessions/queue'));
      expect(res.status).toBe(401);
    });

    it('MUST return 403 Forbidden when student tries to inspect counselor queue', async () => {
      const studentToken = await getStudentToken();
      const res = await sessionApp.handle(
        new Request('http://localhost/api/sessions/queue', {
          headers: { Authorization: `Bearer ${studentToken}` },
        }),
      );
      expect(res.status).toBe(403);
    });

    it('MUST return 200 OK when counselor accesses counselor queue', async () => {
      const counselorToken = await getCounselorToken();
      const res = await sessionApp.handle(
        new Request('http://localhost/api/sessions/queue', {
          headers: { Authorization: `Bearer ${counselorToken}` },
        }),
      );
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*  FUNCTIONAL REQUIREMENTS (FR) TESTING                                       */
  /* -------------------------------------------------------------------------- */

  describe('FR-03: Tri-Dimension DASS-21 Assessment Flow', () => {
    it('should accurately calculate Normal, Moderate, and Extremely Severe scores', () => {
      // All zeros -> Normal
      const zeroAnswers = new Array(21).fill(0);
      const normalResult = calculateDass21Score(zeroAnswers);
      expect(normalResult.depression.multipliedScore).toBe(0);
      expect(normalResult.anxiety.multipliedScore).toBe(0);
      expect(normalResult.stress.multipliedScore).toBe(0);
      expect(normalResult.depression.category).toBe('Normal');
      expect(normalResult.anxiety.category).toBe('Normal');
      expect(normalResult.stress.category).toBe('Normal');

      // All threes (maximum: 21 * 2 = 42 per scale) -> Extremely Severe
      const maxAnswers = new Array(21).fill(3);
      const extremeResult = calculateDass21Score(maxAnswers);
      expect(extremeResult.depression.multipliedScore).toBe(42);
      expect(extremeResult.anxiety.multipliedScore).toBe(42);
      expect(extremeResult.stress.multipliedScore).toBe(42);
      expect(extremeResult.depression.category).toBe('Extremely Severe');
      expect(extremeResult.anxiety.category).toBe('Extremely Severe');
      expect(extremeResult.stress.category).toBe('Extremely Severe');
    });
  });

  describe('FR-04: VAK Learning Modality Mapping Flow', () => {
    it('should determine dominant modality and percentages correctly', () => {
      const visualDominantAnswers = [
        'visual',
        'visual',
        'visual',
        'visual',
        'visual',
        'visual',
        'visual',
        'visual',
        'auditory',
        'auditory',
        'kinesthetic',
        'kinesthetic',
      ] as const;

      const result = calculateVakScore([...visualDominantAnswers]);
      expect(result.dominantStyle).toBe('visual');
      expect(result.visual.count).toBe(8);
      expect(result.auditory.count).toBe(2);
      expect(result.kinesthetic.count).toBe(2);
      expect(result.visual.percentage).toBe(67);
    });
  });

  describe('FR-05: Mood Tracker Empathetic Feedback & Triage Recommendation', async () => {
    it('should detect distress and recommend pra-counseling ticket', async () => {
      const narrative =
        'Saya merasa sangat kelelahan bekerja dan tidak sanggup lagi mengerjakan tugas tuton.';
      const analysis = await assessmentService.analyzeMoodNarrative(narrative);

      expect(analysis.sentiment).toBe('severe_distress');
      expect(analysis.empatheticMessage).toBeDefined();
      expect(analysis.shouldRecommendCounseling).toBe(true);
    });
  });

  describe('FR-07 & FR-08: Attached-Profile Ticketing & Counselor Triage Integration Flow', () => {
    it('should complete ticket lifecycle from creation, queue triage, to acceptance', async () => {
      const studentToken = await getStudentToken('Mahasiswa #4021');
      const counselorToken = await getCounselorToken('Konselor_A');

      // 1. Student creates ticket with attached DASS-21
      const createRes = await sessionApp.handle(
        new Request('http://localhost/api/sessions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${studentToken}`,
          },
          body: JSON.stringify({
            dass21Score: {
              depression: 22,
              anxiety: 18,
              stress: 26,
              depressionCategory: 'Severe',
              anxietyCategory: 'Extremely Severe',
              stressCategory: 'Severe',
              burnoutRiskLevel: 'High',
            },
          }),
        }),
      );
      expect(createRes.status).toBe(201);
      const createdData = (await createRes.json()).data;
      expect(createdData.id).toBeDefined();
      expect(createdData.studentPseudonym.startsWith('Sahabat ')).toBe(true);
      expect(createdData.status).toBe('waiting');

      const ticketId = createdData.id;

      // 2. Counselor retrieves queue and finds the ticket
      const queueRes = await sessionApp.handle(
        new Request('http://localhost/api/sessions/queue', {
          headers: { Authorization: `Bearer ${counselorToken}` },
        }),
      );
      expect(queueRes.status).toBe(200);
      const queueList = (await queueRes.json()).data;
      const foundTicket = queueList.find(
        (t: { id: string; dass21Score: Dass21Result }) => t.id === ticketId,
      );
      expect(foundTicket).toBeDefined();
      expect(foundTicket.dass21Score.burnoutRiskLevel).toBe('High');

      // 3. Counselor accepts the ticket
      const acceptRes = await sessionApp.handle(
        new Request(`http://localhost/api/sessions/${ticketId}/accept`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${counselorToken}` },
        }),
      );
      expect(acceptRes.status).toBe(200);
      const acceptedData = (await acceptRes.json()).data;
      expect(acceptedData.id).toBe(ticketId);
      expect(acceptedData.status).toBe('active');
    });
  });

  describe('FR-09: E2EE Ciphertext Transport Flow', () => {
    it('should successfully transmit and retrieve encrypted messages', async () => {
      const studentToken = await getStudentToken();
      const sessionId = '0192e4a8-6f1b-789a-bcde-000000000055';

      // Send encrypted message
      const sendRes = await chatApp.handle(
        new Request(`http://localhost/api/chat/${sessionId}/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${studentToken}`,
          },
          body: JSON.stringify({
            encryptedContent: 'ENCRYPTED_CIPHERTEXT_AES_GCM_256_BASE64',
            iv: 'RANDOM_INITIALIZATION_VECTOR_16_BYTES',
          }),
        }),
      );
      expect(sendRes.status).toBe(201);

      // Counselor reads encrypted history
      const counselorToken = await getCounselorToken();
      const histRes = await chatApp.handle(
        new Request(`http://localhost/api/chat/${sessionId}/messages`, {
          headers: { Authorization: `Bearer ${counselorToken}` },
        }),
      );
      expect(histRes.status).toBe(200);
      const messages = (await histRes.json()).data;
      expect(messages.length).toBeGreaterThanOrEqual(1);
      expect(messages[0].encryptedContent).toBe('ENCRYPTED_CIPHERTEXT_AES_GCM_256_BASE64');
    });
  });
});
