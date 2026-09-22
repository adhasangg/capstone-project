import { describe, expect, it } from 'bun:test';
import { getTableName } from 'drizzle-orm';
import {
  counselingSessions,
  counselorsProfile,
  getDatabaseConfig,
  messages,
  usersAuth,
} from './index';

describe('packages/db schemas and config', () => {
  it('should export all 4 core relational tables', () => {
    expect(usersAuth).toBeDefined();
    expect(counselorsProfile).toBeDefined();
    expect(counselingSessions).toBeDefined();
    expect(messages).toBeDefined();
  });

  it('should have proper table names in PostgreSQL', () => {
    expect(getTableName(usersAuth)).toBe('users_auth');
    expect(getTableName(counselorsProfile)).toBe('counselors_profile');
    expect(getTableName(counselingSessions)).toBe('counseling_sessions');
    expect(getTableName(messages)).toBe('messages');
  });

  it('should define vakResult and dass21Score columns on counseling_sessions', () => {
    expect(counselingSessions.vakResult).toBeDefined();
    expect(counselingSessions.dass21Score).toBeDefined();
  });

  it('should read database config with fallback defaults', () => {
    const config = getDatabaseConfig();
    expect(config.host).toBeDefined();
    expect(config.port).toBeGreaterThan(0);
    expect(config.database).toBeDefined();
  });
});
