import { defineConfig } from 'drizzle-kit';

const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT) || 5432;
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'safespace_db';

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host,
    port,
    user,
    password,
    database,
    ssl: false,
  },
});
