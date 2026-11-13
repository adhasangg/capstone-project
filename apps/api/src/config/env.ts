export interface ApiConfig {
  readonly port: number;
  readonly nodeEnv: 'development' | 'production' | 'test';
  readonly identityPepperSecret: string;
  readonly jwtSecret: string;
  readonly allowedEmailDomains: ReadonlyArray<string>;
  readonly googleClientId?: string;
  readonly googleClientSecret?: string;
  readonly adminEmails: ReadonlyArray<string>;
  readonly counselorEmails: ReadonlyArray<string>;
  readonly enableSandbox: boolean;
  readonly sandboxPassphrase: string;
}

export function loadApiConfig(): ApiConfig {
  const allowedDomainsRaw = process.env.ALLOWED_EMAIL_DOMAINS || 'ecampus.ut.ac.id,*';
  const allowedEmailDomains = allowedDomainsRaw
    .split(',')
    .map((d: string) => d.trim())
    .filter((d: string) => d.length > 0);

  const adminEmailsRaw = process.env.ADMIN_EMAILS || 'admin@ecampus.ut.ac.id';
  const adminEmails = adminEmailsRaw
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter((e: string) => e.length > 0);

  const counselorEmailsRaw = process.env.COUNSELOR_EMAILS || 'konselor@ecampus.ac.id';
  const counselorEmails = counselorEmailsRaw
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter((e: string) => e.length > 0);

  const pepper =
    process.env.IDENTITY_PEPPER_SECRET || 'safespace_default_dev_pepper_secret_123456789';

  const jwtSecret = process.env.JWT_SECRET || 'safespace_default_dev_jwt_secret_key_987654321';

  const nodeEnv = (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development';

  const enableSandbox =
    process.env.ENABLE_SANDBOX !== undefined
      ? process.env.ENABLE_SANDBOX === 'true'
      : nodeEnv !== 'production';

  const sandboxPassphrase = process.env.SANDBOX_PASSPHRASE || 'safespace-evaluator-2026';

  return {
    port: Number(process.env.PORT) || 3000,
    nodeEnv,
    identityPepperSecret: pepper,
    jwtSecret,
    allowedEmailDomains,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    adminEmails,
    counselorEmails,
    enableSandbox,
    sandboxPassphrase,
  };
}

export const config = loadApiConfig();
