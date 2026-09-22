import { describe, expect, it } from 'bun:test';
import { createServerApp } from './app';

describe('Server App Health and Info Endpoints', () => {
  const app = createServerApp();

  it('GET /health should return 200 OK', async () => {
    const response = await app.handle(new Request('http://localhost/health'));
    expect(response.status).toBe(200);

    const body = (await response.json()) as { status: string };
    expect(body.status).toBe('ok');
  });

  it('GET / should return 200 with API metadata', async () => {
    const response = await app.handle(new Request('http://localhost/'));
    expect(response.status).toBe(200);

    const body = (await response.json()) as { name: string; docs: string };
    expect(body.name).toBe('SafeSpace PWA API');
    expect(body.docs).toBe('/swagger');
  });
});
