export interface ApiConfig {
  readonly port: number;
  readonly nodeEnv: 'development' | 'production' | 'test';
  readonly identityPepperSecret: string;
  readonly jwtSecret: string;
  readonly allowedEmailDomains: ReadonlyArray<string>;
  readonly googleClientId?: string;
  readonly googleClientSecret?: string;
}

export function loadApiConfig(): ApiConfig {
  const allowedDomainsRaw = process.env.ALLOWED_EMAIL_DOMAINS || 'ecampus.ut.ac.id,*';
  const allowedEmailDomains = allowedDomainsRaw
    .split(',')
    .map((d) => d.trim())
    .filter((d) => d.length > 0);

  const pepper =
    process.env.IDENTITY_PEPPER_SECRET || 'safespace_default_dev_pepper_secret_123456789';

  const jwtSecret = process.env.JWT_SECRET || 'safespace_default_dev_jwt_secret_key_987654321';

  const nodeEnv = (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development';

  return {
    port: Number(process.env.PORT) || 3000,
    nodeEnv,
    identityPepperSecret: pepper,
    jwtSecret,
    allowedEmailDomains,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const config = loadApiConfig();
