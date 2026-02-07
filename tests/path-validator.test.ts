import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { validateAndResolvePath } from '../src/path-validator.js';

describe('validateAndResolvePath', () => {
  const baseTmpDir = realpathSync(tmpdir());
  const testDir = join(baseTmpDir, 'md-server-path-validator-test-' + Date.now());
  const subDir = join(testDir, 'subdir');
  const nestedDir = join(testDir, 'a', 'b', 'c');

  beforeAll(() => {
    mkdirSync(testDir, { recursive: true });
    mkdirSync(subDir, { recursive: true });
    mkdirSync(nestedDir, { recursive: true });
    writeFileSync(join(testDir, 'root.md'), '# Root');
    writeFileSync(join(subDir, 'file.md'), '# Subdir File');
    writeFileSync(join(nestedDir, 'deep.md'), '# Deep File');
    writeFileSync(join(testDir, 'not-markdown.txt'), 'text file');
  });

  afterAll(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('valid paths', () => {
    it('should return valid result for root-level markdown file', () => {
      const result = validateAndResolvePath('root.md', testDir);
      expect(result.valid).toBe(true);
      expect(result.resolvedPath).toBe(join(testDir, 'root.md'));
      expect(result.error).toBeUndefined();
    });

    it('should return valid result for subdirectory markdown file', () => {
      const result = validateAndResolvePath('subdir/file.md', testDir);
      expect(result.valid).toBe(true);
      expect(result.resolvedPath).toBe(join(subDir, 'file.md'));
      expect(result.error).toBeUndefined();
    });

    it('should return valid result for deeply nested markdown file', () => {
      const result = validateAndResolvePath('a/b/c/deep.md', testDir);
      expect(result.valid).toBe(true);
      expect(result.resolvedPath).toBe(join(nestedDir, 'deep.md'));
      expect(result.error).toBeUndefined();
    });

    it('should handle leading slash in path', () => {
      const result = validateAndResolvePath('/subdir/file.md', testDir);
      expect(result.valid).toBe(true);
      expect(result.resolvedPath).toBe(join(subDir, 'file.md'));
    });
  });

  describe('path traversal attacks', () => {
    it('should reject path with .. segment', () => {
      const result = validateAndResolvePath('../etc/passwd', testDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid path');
    });

    it('should reject path with .. in middle', () => {
      const result = validateAndResolvePath('subdir/../../../etc/passwd', testDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid path');
    });

    it('should reject URL-encoded .. (%2e%2e)', () => {
      const result = validateAndResolvePath('%2e%2e/etc/passwd', testDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid path');
    });

    it('should reject URL-encoded slash with .. (%2e%2e%2f)', () => {
      const result = validateAndResolvePath('%2e%2e%2fetc/passwd', testDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid path');
    });

    it('should reject path that resolves outside publicDir', () => {
      const result = validateAndResolvePath('subdir/../../outside.md', testDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid path');
    });
  });

  describe('file validation', () => {
    it('should reject non-existent file', () => {
      const result = validateAndResolvePath('nonexistent.md', testDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should reject non-existent file in subdirectory', () => {
      const result = validateAndResolvePath('subdir/nonexistent.md', testDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should reject non-markdown file', () => {
      const result = validateAndResolvePath('not-markdown.txt', testDir);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Markdown');
    });

    it('should reject directory path', () => {
      const result = validateAndResolvePath('subdir', testDir);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
