import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ignore from 'ignore';

const IGNORE_FILENAME = '.mdsignore';

/**
 * Loads ignore patterns from a .mdsignore file in the given directory.
 *
 * @param publicDir - The root directory to look for .mdsignore
 * @returns Array of pattern strings (empty if file doesn't exist)
 */
export function loadIgnorePatterns(publicDir: string): string[] {
  try {
    const content = readFileSync(join(publicDir, IGNORE_FILENAME), 'utf-8');
    return content
      .split('\n')
      .filter((line) => line.trim() !== '' && !line.startsWith('#'));
  } catch {
    return [];
  }
}

/**
 * Creates a filter function that checks if a relative path should be ignored.
 *
 * @param publicDir - The root directory to look for .mdsignore
 * @returns A function that returns true if the given relative path is ignored
 */
export function createIgnoreFilter(publicDir: string): (relativePath: string) => boolean {
  const patterns = loadIgnorePatterns(publicDir);
  if (patterns.length === 0) {
    return () => false;
  }

  const ig = ignore().add(patterns);
  return (relativePath: string) => ig.ignores(relativePath);
}
