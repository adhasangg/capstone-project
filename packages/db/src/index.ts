import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export * from './schema';

export interface DatabaseConfig {
  readonly host?: string;
  readonly port?: number;
  readonly user?: string;
  readonly password?: string;
  readonly database?: string;
  readonly maxConnections?: number;
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'safespace_db',
    maxConnections: Number(process.env.DB_MAX_CONNECTIONS) || 10,
  };
}

export function createDatabaseConnection(config: DatabaseConfig = getDatabaseConfig()) {
  const client = postgres({
    host: config.host,
    port: config.port,
    username: config.user,
    password: config.password,
    database: config.database,
    max: config.maxConnections,
    connect_timeout: Number(process.env.DB_CONNECT_TIMEOUT) || 2,
    idle_timeout: 30,
    onnotice: () => {},
  });

  const db = drizzle(client, { schema });
  return { db, client };
}

export type SafeSpaceDatabase = ReturnType<typeof createDatabaseConnection>['db'];
