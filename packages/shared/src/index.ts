// Types
export type {
  UserRole,
  UserAuthSession,
  GoogleAuthPayload,
  SanitizedIdentity,
} from './types/auth.types';

export type {
  SessionStatus,
  CounselingSessionSummary,
} from './types/session.types';

export type {
  SenderType,
  EncryptedMessagePayload,
  StoredMessage,
} from './types/chat.types';

export type {
  ApiResponseSuccess,
  ApiResponseError,
  ApiResponse,
} from './types/api.types';

export type {
  Dass21Category,
  Dass21SubscaleResult,
  Dass21Result,
  VakModality,
  VakModalityScore,
  VakResult,
  MoodSentimentCategory,
  MoodTrackerAnalysis,
} from './types/assessment.types';

// Validators & Schemas
export {
  googleAuthSchema,
  isAllowedEmailDomain,
  type GoogleAuthInput,
} from './validators/auth.schema';

export {
  senderTypeEnum,
  encryptedMessageSchema,
  type EncryptedMessageInput,
} from './validators/chat.schema';

// Utilities
export { hashIdentity } from './utils/crypto.utils';
export { generatePseudonym } from './utils/pseudonym.utils';
export { calculateDass21Score } from './utils/dass21.utils';
export { calculateVakScore } from './utils/vak.utils';
