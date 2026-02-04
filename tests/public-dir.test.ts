import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { validatePublicDir } from '../src/public-dir.js';

describe('validatePublicDir', () => {
  // Use realpathSync to resolve symlinks (e.g., /var -> /private/var on macOS)
  const baseTmpDir = realpathSync(tmpdir());
  const testDir = join(baseTmpDir, 'md-server-public-dir-test-' + Date.now());
  const subDir = join(testDir, 'subdir');
  const testFile = join(testDir, 'test.txt');

  beforeAll(() => {
    mkdirSync(testDir, { recursive: true });
    mkdirSync(subDir, { recursive: true });
    writeFileSync(testFile, 'test content');
  });

  afterAll(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe('valid directory paths', () => {
    it('should return resolved absolute path for valid directory', () => {
      const result = validatePublicDir(testDir);
      expect(result).toBe(testDir);
    });

    it('should return resolved absolute path for subdirectory', () => {
      const result = validatePublicDir(subDir);
      expect(result).toBe(subDir);
    });

    it('should resolve relative paths to absolute paths', () => {
      const originalCwd = process.cwd();
      process.chdir(testDir);
      try {
        const result = validatePublicDir('./subdir');
        expect(result).toBe(subDir);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should handle paths with trailing slash', () => {
      const result = validatePublicDir(testDir + '/');
      expect(result).toBe(testDir);
    });
  });

  describe('invalid paths', () => {
    it('should throw error for non-existent path', () => {
      const nonExistentPath = join(testDir, 'nonexistent');
      expect(() => validatePublicDir(nonExistentPath)).toThrow(
        `Directory '${nonExistentPath}' does not exist or is not accessible.`
      );
    });

    it('should throw error for file path (not directory)', () => {
      expect(() => validatePublicDir(testFile)).toThrow(
        `Path '${testFile}' is not a directory.`
      );
    });

    it('should throw error for empty path', () => {
      expect(() => validatePublicDir('')).toThrow();
    });
  });
});
