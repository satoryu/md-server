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
  let serverInstance: ServerInstance;
  let app: Express;

  beforeAll(() => {
    // Create test directory with sample markdown files
    mkdirSync(testDir, { recursive: true });
    writeFileSync(join(testDir, 'README.md'), '# README\n\nThis is a readme.');
    writeFileSync(join(testDir, 'test.md'), '# Test\n\n**Bold text**');

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

  describe('without watch mode', () => {
    it('should not include reload script in HTML response', async () => {
      const response = await request(app).get('/');
      expect(response.text).not.toContain('EventSource');
      expect(response.text).not.toContain('/events');
    });
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
