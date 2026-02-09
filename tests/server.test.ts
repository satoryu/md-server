import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import http from 'node:http';
import { createServer, type ServerInstance } from '../src/server.js';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { Express } from 'express';

describe('server', () => {
  const testDir = join(tmpdir(), 'md-server-test-' + Date.now());
  const subDir = join(testDir, 'docs');
  const nestedDir = join(testDir, 'guides', 'advanced');
  let serverInstance: ServerInstance;
  let app: Express;

  beforeAll(() => {
    // Create test directory with sample markdown files
    mkdirSync(testDir, { recursive: true });
    mkdirSync(subDir, { recursive: true });
    mkdirSync(nestedDir, { recursive: true });
    writeFileSync(join(testDir, 'README.md'), '# README\n\nThis is a readme.');
    writeFileSync(join(testDir, 'test.md'), '# Test\n\n**Bold text**');
    writeFileSync(join(subDir, 'guide.md'), '# Guide\n\nA guide document.');
    writeFileSync(join(nestedDir, 'deep.md'), '# Deep\n\nDeeply nested file.');

    serverInstance = createServer({ publicDir: testDir });
    app = serverInstance.app;
  });

  afterAll(async () => {
    // Clean up test directory
    await serverInstance.close();
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('GET /', () => {
    it('should return list of markdown files', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('README.md');
      expect(response.text).toContain('test.md');
    });

    it('should include subdirectory files in list', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('docs/guide.md');
      expect(response.text).toContain('guides/advanced/deep.md');
    });

    it('should return HTML content type', async () => {
      const response = await request(app).get('/');
      expect(response.headers['content-type']).toContain('text/html');
    });
  });

  describe('GET /:filename.md', () => {
    it('should return converted markdown as HTML', async () => {
      const response = await request(app).get('/README.md');
      expect(response.status).toBe(200);
      expect(response.text).toContain('<h1>README</h1>');
      expect(response.text).toContain('This is a readme.');
    });

    it('should return HTML with proper structure', async () => {
      const response = await request(app).get('/test.md');
      expect(response.text).toContain('<!DOCTYPE html>');
      expect(response.text).toContain('<strong>Bold text</strong>');
    });

    it('should return 404 for non-existent file', async () => {
      const response = await request(app).get('/nonexistent.md');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /subdir/*.md (subdirectory support)', () => {
    it('should return markdown from subdirectory', async () => {
      const response = await request(app).get('/docs/guide.md');
      expect(response.status).toBe(200);
      expect(response.text).toContain('<h1>Guide</h1>');
      expect(response.text).toContain('A guide document.');
    });

    it('should return markdown from deeply nested directory', async () => {
      const response = await request(app).get('/guides/advanced/deep.md');
      expect(response.status).toBe(200);
      expect(response.text).toContain('<h1>Deep</h1>');
      expect(response.text).toContain('Deeply nested file.');
    });

    it('should return 404 for non-existent file in subdirectory', async () => {
      const response = await request(app).get('/docs/nonexistent.md');
      expect(response.status).toBe(404);
    });

    it('should return 404 for non-existent subdirectory', async () => {
      const response = await request(app).get('/nonexistent/file.md');
      expect(response.status).toBe(404);
    });
  });

  describe('path traversal protection', () => {
    it('should not serve files outside public directory (path normalized by Express)', async () => {
      // Express normalizes /../ paths, so this becomes /etc/passwd.md
      // which doesn't exist in publicDir, hence 404
      const response = await request(app).get('/../etc/passwd.md');
      expect(response.status).toBe(404);
    });

    it('should not serve files with URL-encoded traversal (normalized by Express)', async () => {
      // Express decodes and normalizes the path
      const response = await request(app).get('/%2e%2e/etc/passwd.md');
      expect(response.status).toBe(404);
    });

    it('should not allow accessing parent via subdirectory traversal', async () => {
      // /docs/../../../etc/passwd.md normalizes to /etc/passwd.md (outside publicDir)
      const response = await request(app).get('/docs/../../../etc/passwd.md');
      expect(response.status).toBe(404);
    });
  });

  describe('without watch mode', () => {
    it('should not include reload script in HTML response', async () => {
      const response = await request(app).get('/');
      expect(response.text).not.toContain('EventSource');
      expect(response.text).not.toContain('/events');
    });
  });
});

describe('server with .mdsignore', () => {
  const ignoreTestDir = join(tmpdir(), 'md-server-ignore-test-' + Date.now());
  const draftsDir = join(ignoreTestDir, 'drafts');
  let serverInstance: ServerInstance;
  let app: Express;

  beforeAll(() => {
    mkdirSync(ignoreTestDir, { recursive: true });
    mkdirSync(draftsDir, { recursive: true });
    writeFileSync(join(ignoreTestDir, 'README.md'), '# README');
    writeFileSync(join(ignoreTestDir, 'secret.md'), '# Secret');
    writeFileSync(join(draftsDir, 'draft.md'), '# Draft');
    writeFileSync(join(ignoreTestDir, '.mdsignore'), 'secret.md\ndrafts/\n');

    serverInstance = createServer({ publicDir: ignoreTestDir });
    app = serverInstance.app;
  });

  afterAll(async () => {
    await serverInstance.close();
    rmSync(ignoreTestDir, { recursive: true, force: true });
  });

  describe('GET /', () => {
    it('should not list ignored files', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('README.md');
      expect(response.text).not.toContain('secret.md');
      expect(response.text).not.toContain('drafts/draft.md');
    });
  });

  describe('GET /*.md', () => {
    it('should return 404 for ignored files', async () => {
      const response = await request(app).get('/secret.md');
      expect(response.status).toBe(404);
    });

    it('should return 404 for files in ignored directories', async () => {
      const response = await request(app).get('/drafts/draft.md');
      expect(response.status).toBe(404);
    });

    it('should serve non-ignored files normally', async () => {
      const response = await request(app).get('/README.md');
      expect(response.status).toBe(200);
      expect(response.text).toContain('<h1>README</h1>');
    });
  });
});

describe('server without .mdsignore', () => {
  const noIgnoreTestDir = join(tmpdir(), 'md-server-no-ignore-test-' + Date.now());
  let serverInstance: ServerInstance;
  let app: Express;

  beforeAll(() => {
    mkdirSync(noIgnoreTestDir, { recursive: true });
    writeFileSync(join(noIgnoreTestDir, 'README.md'), '# README');
    writeFileSync(join(noIgnoreTestDir, 'notes.md'), '# Notes');

    serverInstance = createServer({ publicDir: noIgnoreTestDir });
    app = serverInstance.app;
  });

  afterAll(async () => {
    await serverInstance.close();
    rmSync(noIgnoreTestDir, { recursive: true, force: true });
  });

  it('should list all files when no .mdsignore exists', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('README.md');
    expect(response.text).toContain('notes.md');
  });

  it('should serve all files when no .mdsignore exists', async () => {
    const response = await request(app).get('/notes.md');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<h1>Notes</h1>');
  });
});

describe('server with watch mode', () => {
  const watchTestDir = join(tmpdir(), 'md-server-watch-test-' + Date.now());
  let serverInstance: ServerInstance;
  let httpServer: http.Server;
  let port: number;

  beforeEach(async () => {
    mkdirSync(watchTestDir, { recursive: true });
    writeFileSync(join(watchTestDir, 'watch-test.md'), '# Watch Test');
    serverInstance = createServer({ publicDir: watchTestDir, watch: true });

    // Start HTTP server on random port
    httpServer = http.createServer(serverInstance.app);
    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => {
        const address = httpServer.address();
        port = typeof address === 'object' && address ? address.port : 0;
        resolve();
      });
    });
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => httpServer.close(() => resolve()));
    await serverInstance.close();
    rmSync(watchTestDir, { recursive: true, force: true });
  });

  describe('GET /events', () => {
    it('should return SSE content type', async () => {
      const contentType = await new Promise<string>((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/events`, (res) => {
          resolve(res.headers['content-type'] || '');
          res.destroy();
          req.destroy();
        });
        req.on('error', reject);
      });

      expect(contentType).toContain('text/event-stream');
    });
  });

  describe('HTML responses with watch mode', () => {
    it('should include reload script in index page', async () => {
      const response = await request(serverInstance.app).get('/');
      expect(response.text).toContain('EventSource');
      expect(response.text).toContain('/events');
    });

    it('should include reload script in markdown page', async () => {
      const response = await request(serverInstance.app).get('/watch-test.md');
      expect(response.text).toContain('EventSource');
      expect(response.text).toContain('/events');
    });
  });
});
