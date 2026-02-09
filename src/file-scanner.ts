import { readdirSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';

export interface MarkdownFile {
  /** Relative path from publicDir (e.g., "docs/guide.md") */
  relativePath: string;

  /** Absolute path for file reading (e.g., "/path/to/public/docs/guide.md") */
  absolutePath: string;

  /** Filename only (e.g., "guide.md") */
  filename: string;

  /** Directory path relative to publicDir (e.g., "docs" or "" for root) */
  directory: string;
}

/**
 * Recursively scans a directory for markdown files.
 *
 * @param publicDir - The root directory to scan
 * @returns Array of MarkdownFile objects
 */
export function scanMarkdownFiles(publicDir: string, isIgnored?: (relativePath: string) => boolean): MarkdownFile[] {
  const files: MarkdownFile[] = [];

  try {
    // Use recursive option (Node.js 18.17+)
    const entries = readdirSync(publicDir, { withFileTypes: true, recursive: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        // Get the parent path from the entry
        const parentPath = entry.parentPath || entry.path || publicDir;
        const absolutePath = join(parentPath, entry.name);
        const relativePath = relative(publicDir, absolutePath);
        const directory = dirname(relativePath);

        if (isIgnored && isIgnored(relativePath)) {
          continue;
        }

        files.push({
          relativePath,
          absolutePath,
          filename: basename(absolutePath),
          directory: directory === '.' ? '' : directory,
        });
      }
    }
  } catch {
    // Return empty array if directory cannot be read
    return [];
  }

  // Sort by relative path for consistent ordering
  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}
