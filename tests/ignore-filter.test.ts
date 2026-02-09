import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadIgnorePatterns, createIgnoreFilter } from '../src/ignore-filter.js';

describe('loadIgnorePatterns', () => {
  const baseTmpDir = realpathSync(tmpdir());
  const testDir = join(baseTmpDir, 'md-server-ignore-patterns-test-' + Date.now());

  beforeAll(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterAll(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('should return an empty array when .mdsignore does not exist', () => {
    const patterns = loadIgnorePatterns(testDir);
    expect(patterns).toEqual([]);
  });

  it('should return patterns from .mdsignore file', () => {
    const dir = join(testDir, 'with-ignore');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, '.mdsignore'), 'drafts/\nsecret.md\n');

    const patterns = loadIgnorePatterns(dir);
    expect(patterns).toEqual(['drafts/', 'secret.md']);
  });

  it('should ignore comments and empty lines', () => {
    const dir = join(testDir, 'with-comments');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, '.mdsignore'), '# This is a comment\n\ndrafts/\n\n# Another comment\nsecret.md\n');

    const patterns = loadIgnorePatterns(dir);
    expect(patterns).toEqual(['drafts/', 'secret.md']);
  });

  it('should return an empty array for an empty .mdsignore file', () => {
    const dir = join(testDir, 'empty-ignore');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, '.mdsignore'), '');

    const patterns = loadIgnorePatterns(dir);
    expect(patterns).toEqual([]);
  });
});

describe('createIgnoreFilter', () => {
  const baseTmpDir = realpathSync(tmpdir());
  const testDir = join(baseTmpDir, 'md-server-ignore-filter-test-' + Date.now());

  beforeAll(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterAll(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('should return a function that always returns false when no .mdsignore exists', () => {
    const isIgnored = createIgnoreFilter(testDir);
    expect(isIgnored('README.md')).toBe(false);
    expect(isIgnored('docs/guide.md')).toBe(false);
  });

  it('should ignore files matching exact filename patterns', () => {
    const dir = join(testDir, 'exact');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, '.mdsignore'), 'secret.md\n');

    const isIgnored = createIgnoreFilter(dir);
    expect(isIgnored('secret.md')).toBe(true);
    expect(isIgnored('README.md')).toBe(false);
  });

  it('should ignore files matching directory patterns', () => {
    const dir = join(testDir, 'directory');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, '.mdsignore'), 'drafts/\n');

    const isIgnored = createIgnoreFilter(dir);
    expect(isIgnored('drafts/notes.md')).toBe(true);
    expect(isIgnored('drafts/deep/nested.md')).toBe(true);
    expect(isIgnored('published/notes.md')).toBe(false);
  });

  it('should ignore files matching glob patterns', () => {
    const dir = join(testDir, 'glob');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, '.mdsignore'), 'TODO-*.md\n');

    const isIgnored = createIgnoreFilter(dir);
    expect(isIgnored('TODO-2024.md')).toBe(true);
    expect(isIgnored('TODO-feature.md')).toBe(true);
    expect(isIgnored('README.md')).toBe(false);
  });

  it('should support negation patterns', () => {
    const dir = join(testDir, 'negation');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, '.mdsignore'), '*.md\n!important.md\n');

    const isIgnored = createIgnoreFilter(dir);
    expect(isIgnored('notes.md')).toBe(true);
    expect(isIgnored('important.md')).toBe(false);
  });

  it('should return false for all files when .mdsignore is empty', () => {
    const dir = join(testDir, 'empty');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, '.mdsignore'), '');

    const isIgnored = createIgnoreFilter(dir);
    expect(isIgnored('README.md')).toBe(false);
    expect(isIgnored('docs/guide.md')).toBe(false);
  });
});
