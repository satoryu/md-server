import { existsSync, statSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Validates and resolves a public directory path.
 * @param dirPath - The directory path to validate (can be relative or absolute)
 * @returns The resolved absolute path (with symlinks resolved)
 * @throws Error if the path does not exist, is not accessible, or is not a directory
 */
export function validatePublicDir(dirPath: string): string {
  if (!dirPath) {
    throw new Error('Directory path cannot be empty.');
  }

  // Resolve to absolute path and normalize (remove trailing slashes)
  const resolvedPath = resolve(dirPath);

  // Check if path exists
  if (!existsSync(resolvedPath)) {
    throw new Error(`Directory '${resolvedPath}' does not exist or is not accessible.`);
  }

  // Check if path is a directory
  const stats = statSync(resolvedPath);
  if (!stats.isDirectory()) {
    throw new Error(`Path '${resolvedPath}' is not a directory.`);
  }

  // Resolve symlinks to get canonical path
  return realpathSync(resolvedPath);
}
