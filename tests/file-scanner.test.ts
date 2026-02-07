import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { scanMarkdownFiles } from '../src/file-scanner.js';

describe('scanMarkdownFiles', () => {
  const baseTmpDir = realpathSync(tmpdir());
  const testDir = join(baseTmpDir, 'md-server-file-scanner-test-' + Date.now());
  const subDir = join(testDir, 'docs');
  const nestedDir = join(testDir, 'guides', 'advanced');
  const emptyDir = join(testDir, 'empty');

  beforeAll(() => {
    mkdirSync(testDir, { recursive: true });
    mkdirSync(subDir, { recursive: true });
    mkdirSync(nestedDir, { recursive: true });
    mkdirSync(emptyDir, { recursive: true });

    // Root level files
    writeFileSync(join(testDir, 'README.md'), '# README');
    writeFileSync(join(testDir, 'index.md'), '# Index');
    writeFileSync(join(testDir, 'config.json'), '{}'); // non-md file

    // Subdirectory files
    writeFileSync(join(subDir, 'guide.md'), '# Guide');
    writeFileSync(join(subDir, 'api.md'), '# API');

    // Nested directory files
    writeFileSync(join(nestedDir, 'deep.md'), '# Deep');
  });

  afterAll(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('should find root-level markdown files', () => {
    const files = scanMarkdownFiles(testDir);
    const relativePaths = files.map((f) => f.relativePath);

    expect(relativePaths).toContain('README.md');
    expect(relativePaths).toContain('index.md');
  });

  it('should find subdirectory markdown files', () => {
    const files = scanMarkdownFiles(testDir);
    const relativePaths = files.map((f) => f.relativePath);

    expect(relativePaths).toContain('docs/guide.md');
    expect(relativePaths).toContain('docs/api.md');
  });

  it('should find deeply nested markdown files', () => {
    const files = scanMarkdownFiles(testDir);
    const relativePaths = files.map((f) => f.relativePath);

    expect(relativePaths).toContain('guides/advanced/deep.md');
  });

  it('should not include non-markdown files', () => {
    const files = scanMarkdownFiles(testDir);
    const relativePaths = files.map((f) => f.relativePath);

    expect(relativePaths).not.toContain('config.json');
  });

  it('should return empty array for empty directory', () => {
    const files = scanMarkdownFiles(emptyDir);
    expect(files).toEqual([]);
  });

  it('should include correct absolute paths', () => {
    const files = scanMarkdownFiles(testDir);
    const readmeFile = files.find((f) => f.relativePath === 'README.md');

    expect(readmeFile).toBeDefined();
    expect(readmeFile?.absolutePath).toBe(join(testDir, 'README.md'));
  });

  it('should include correct filename', () => {
    const files = scanMarkdownFiles(testDir);
    const guideFile = files.find((f) => f.relativePath === 'docs/guide.md');

    expect(guideFile).toBeDefined();
    expect(guideFile?.filename).toBe('guide.md');
  });

  it('should include correct directory path', () => {
    const files = scanMarkdownFiles(testDir);
    const deepFile = files.find((f) => f.relativePath === 'guides/advanced/deep.md');

    expect(deepFile).toBeDefined();
    expect(deepFile?.directory).toBe('guides/advanced');
  });

  it('should have empty directory for root-level files', () => {
    const files = scanMarkdownFiles(testDir);
    const readmeFile = files.find((f) => f.relativePath === 'README.md');

    expect(readmeFile).toBeDefined();
    expect(readmeFile?.directory).toBe('');
  });
});
