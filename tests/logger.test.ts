import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { requestLogger } from '../src/logger.js';

describe('requestLogger', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log request to stdout on response finish', async () => {
    const app = express();
    app.use(requestLogger());
    app.get('/', (_req, res) => res.send('ok'));

    await request(app).get('/');

    expect(consoleSpy).toHaveBeenCalledOnce();
  });

  it('should include INFO level in log output', async () => {
    const app = express();
    app.use(requestLogger());
    app.get('/', (_req, res) => res.send('ok'));

    await request(app).get('/');

    const logMessage = consoleSpy.mock.calls[0][0] as string;
    expect(logMessage).toContain('INFO');
  });

  it('should include HTTP method in log output', async () => {
    const app = express();
    app.use(requestLogger());
    app.get('/test', (_req, res) => res.send('ok'));

    await request(app).get('/test');

    const logMessage = consoleSpy.mock.calls[0][0] as string;
    expect(logMessage).toContain('GET');
  });

  it('should include request path in log output', async () => {
    const app = express();
    app.use(requestLogger());
    app.get('/hello', (_req, res) => res.send('ok'));

    await request(app).get('/hello');

    const logMessage = consoleSpy.mock.calls[0][0] as string;
    expect(logMessage).toContain('/hello');
  });

  it('should include status code in log output', async () => {
    const app = express();
    app.use(requestLogger());
    app.get('/notfound', (_req, res) => res.status(404).send('not found'));

    await request(app).get('/notfound');

    const logMessage = consoleSpy.mock.calls[0][0] as string;
    expect(logMessage).toContain('404');
  });

  it('should include response time in ms', async () => {
    const app = express();
    app.use(requestLogger());
    app.get('/', (_req, res) => res.send('ok'));

    await request(app).get('/');

    const logMessage = consoleSpy.mock.calls[0][0] as string;
    expect(logMessage).toMatch(/\d+ms/);
  });

  it('should include ISO 8601 timestamp', async () => {
    const app = express();
    app.use(requestLogger());
    app.get('/', (_req, res) => res.send('ok'));

    await request(app).get('/');

    const logMessage = consoleSpy.mock.calls[0][0] as string;
    // ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
    expect(logMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\]/);
  });

  it('should log in expected format', async () => {
    const app = express();
    app.use(requestLogger());
    app.get('/docs/guide.md', (_req, res) => res.status(200).send('ok'));

    await request(app).get('/docs/guide.md');

    const logMessage = consoleSpy.mock.calls[0][0] as string;
    // Expected format: [timestamp] INFO GET /docs/guide.md 200 Xms
    expect(logMessage).toMatch(
      /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] INFO GET \/docs\/guide\.md 200 \d+ms$/
    );
  });
});
