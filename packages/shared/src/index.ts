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
