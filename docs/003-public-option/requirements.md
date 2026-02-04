# Requirements: --public Option

## Problem Statement

Currently, the `mds` command serves Markdown files from the current working directory (`process.cwd()`). Users cannot specify an alternative directory to serve files from without first changing to that directory. This limits flexibility, especially when users want to serve files from a different location than their current shell directory.

## Requirements

### Functional Requirements

1. **FR-1**: The CLI must accept a `--public <path_to_directory>` option to specify the directory containing Markdown files to serve.
2. **FR-2**: The `--public` option should also accept `-P` as a short alias.
3. **FR-3**: If `--public` is not provided, the server should default to the current working directory (existing behavior).
4. **FR-4**: The specified directory path can be either absolute or relative to the current working directory.
5. **FR-5**: The server should validate that the specified directory exists and is accessible.
6. **FR-6**: If the specified directory does not exist or is not accessible, the server should display a clear error message and exit.

### Non-Functional Requirements

1. **NFR-1**: The implementation should follow existing code patterns and conventions.
2. **NFR-2**: All existing tests must continue to pass.
3. **NFR-3**: New functionality must be covered by appropriate tests.

## Constraints

1. The implementation must be backward compatible - existing usage without `--public` must continue to work.
2. The implementation must follow the TDD approach as specified in CLAUDE.md.
3. The implementation must use TypeScript.

## Acceptance Criteria

1. **AC-1**: Running `mds --public ./docs` serves Markdown files from the `./docs` directory.
2. **AC-2**: Running `mds -P /absolute/path` serves Markdown files from `/absolute/path`.
3. **AC-3**: Running `mds` (without `--public`) serves files from the current directory (unchanged behavior).
4. **AC-4**: Running `mds --public /nonexistent/path` displays an error message and exits with a non-zero code.
5. **AC-5**: The `--public` option works in combination with other options (`--port`, `--watch`).
6. **AC-6**: Running `mds --help` shows documentation for the `--public` option.

## User Stories

### US-1: Serve files from a specific directory
**As a** user
**I want to** specify a directory containing my Markdown files
**So that** I can serve files without changing my current working directory

**Example:**
```bash
mds --public ~/my-docs
```

### US-2: Combine with other options
**As a** user
**I want to** use `--public` with `--port` and `--watch`
**So that** I can configure all aspects of the server in one command

**Example:**
```bash
mds --public ./docs --port 8080 --watch
```

### US-3: Handle invalid paths gracefully
**As a** user
**I want to** receive a clear error message when I specify an invalid directory
**So that** I can correct my command quickly

**Example:**
```bash
$ mds --public /does/not/exist
Error: Directory '/does/not/exist' does not exist or is not accessible.
```
