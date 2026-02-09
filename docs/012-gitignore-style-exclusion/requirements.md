# Requirements: .gitignore-style File Exclusion (#12)

## Problem Statement

Currently, all `.md` files in the public directory are served without exception. Users cannot exclude specific files or directories (e.g., drafts, internal notes, `node_modules` documentation) from being published. There is no mechanism to control which markdown files are visible to visitors.

## Requirements

1. **Ignore File Support**: Users can create a `.mdsignore` file in the root of the public directory to specify exclusion patterns.
2. **Gitignore Syntax**: The `.mdsignore` file uses the same pattern syntax as `.gitignore` (glob patterns, negation with `!`, directory patterns with `/`, comments with `#`).
3. **Index Exclusion**: Files matching ignore patterns are excluded from the file listing on the index page (`GET /`).
4. **Direct Access Exclusion**: Files matching ignore patterns return 404 when accessed directly via URL (`GET /:path.md`).
5. **Nested Directory Support**: Patterns work correctly with files in nested subdirectories.
6. **Backward Compatibility**: When no `.mdsignore` file exists, behavior is identical to the current implementation.
7. **The `.mdsignore` file itself should not be served** (it is not a `.md` file, so this is already the case).

## Constraints

- The `.mdsignore` file must be placed in the root of the public directory.
- Only one `.mdsignore` file is supported (no nested `.mdsignore` files in subdirectories).
- The ignore file is read on each request (no caching) to support dynamic updates without server restart.
- Pattern matching should be delegated to a well-tested library (e.g., the `ignore` npm package) rather than implementing custom pattern matching.

## Acceptance Criteria

- [ ] A `.mdsignore` file in the public directory root is recognized and parsed.
- [ ] Patterns follow `.gitignore` syntax (glob patterns, `!` negation, `#` comments, `/` directory markers).
- [ ] Matching files are excluded from the `GET /` index listing.
- [ ] Matching files return 404 when accessed via `GET /:path.md`.
- [ ] Patterns work for files in nested subdirectories.
- [ ] When no `.mdsignore` file exists, all `.md` files are served as before.
- [ ] When `.mdsignore` is empty, all `.md` files are served as before.

## User Stories

1. **As a user**, I want to create a `.mdsignore` file to exclude draft documents from being published, so that I can keep work-in-progress files private.
2. **As a user**, I want to exclude entire directories (e.g., `drafts/`) from serving, so that all files within those directories are hidden.
3. **As a user**, I want to use familiar `.gitignore` patterns, so that I don't need to learn a new syntax.
4. **As a user**, I want the server to work normally when no `.mdsignore` file exists, so that existing setups are not affected.
