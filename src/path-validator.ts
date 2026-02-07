import { existsSync, statSync } from 'node:fs';
import { resolve, normalize, sep } from 'node:path';

export type PathValidationErrorType =
  | 'invalid_encoding'
  | 'path_traversal'
  | 'outside_public_dir'
  | 'not_found'
  | 'not_file'
  | 'not_markdown'
  | 'unknown';

export interface PathValidationResult {
  valid: boolean;
  resolvedPath?: string;
  error?: string;
  errorType?: PathValidationErrorType;
}

/**
 * Validates and resolves a request path to ensure it's safe and exists.
 * Prevents path traversal attacks and ensures the file is within publicDir.
 *
 * @param requestPath - The path from the HTTP request (e.g., "subdir/file.md")
 * @param publicDir - The base public directory
 * @returns Validation result with resolved path or error
 */
export function validateAndResolvePath(
  requestPath: string,
  publicDir: string
): PathValidationResult {
  try {
    // Decode URL-encoded characters
    let decodedPath: string;
    try {
      decodedPath = decodeURIComponent(requestPath);
    } catch {
      return {
        valid: false,
        error: 'Invalid path: malformed URL encoding',
        errorType: 'invalid_encoding',
      };
    }

    // Remove leading slash if present
    if (decodedPath.startsWith('/')) {
      decodedPath = decodedPath.slice(1);
    }

    // Check for path traversal attempts before normalization
    if (decodedPath.includes('..')) {
      return {
        valid: false,
        error: 'Invalid path: path traversal not allowed',
        errorType: 'path_traversal',
      };
    }

    // Normalize and resolve the path
    const normalizedPath = normalize(decodedPath);

    // Check again after normalization (catches edge cases)
    if (normalizedPath.includes('..')) {
      return {
        valid: false,
        error: 'Invalid path: path traversal not allowed',
        errorType: 'path_traversal',
      };
    }

    // Resolve to absolute path
    const resolvedPublicDir = resolve(publicDir);
    const resolvedPath = resolve(publicDir, normalizedPath);

    // Ensure resolved path is within publicDir
    if (!resolvedPath.startsWith(resolvedPublicDir + sep) && resolvedPath !== resolvedPublicDir) {
      return {
        valid: false,
        error: 'Invalid path: access outside public directory not allowed',
        errorType: 'outside_public_dir',
      };
    }

    // Check if file exists
    if (!existsSync(resolvedPath)) {
      return { valid: false, error: 'File not found', errorType: 'not_found' };
    }

    // Check if it's a file (not a directory)
    const stats = statSync(resolvedPath);
    if (!stats.isFile()) {
      return { valid: false, error: 'Path is not a file', errorType: 'not_file' };
    }

    // Check if it's a markdown file
    if (!resolvedPath.endsWith('.md')) {
      return {
        valid: false,
        error: 'Only Markdown files (.md) are allowed',
        errorType: 'not_markdown',
      };
    }

    return { valid: true, resolvedPath };
  } catch (error) {
    return {
      valid: false,
      error: `Invalid path: ${error instanceof Error ? error.message : 'unknown error'}`,
      errorType: 'unknown',
    };
  }
}
