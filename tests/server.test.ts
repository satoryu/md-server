import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/server.js';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { Express } from 'express';

describe('server', () => {
  const testDir = join(tmpdir(), 'md-server-test-' + Date.now());
  let app: Express;

  beforeAll(() => {
    // Create test directory with sample markdown files
    mkdirSync(testDir, { recursive: true });
    writeFileSync(join(testDir, 'README.md'), '# README\n\nThis is a readme.');
    writeFileSync(join(testDir, 'test.md'), '# Test\n\n**Bold text**');

    app = createServer({ publicDir: testDir });
  });

  afterAll(() => {
    // Clean up test directory
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
});
