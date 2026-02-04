# Implementation Tasks: --public Option

## Task Checklist

### Phase 1: Setup and Preparation

- [x] **Task 1.1**: Create feature branch `feature/003-public-option`
- [x] **Task 1.2**: Review existing CLI implementation in `src/cli.ts`

### Phase 2: Test-Driven Development

- [x] **Task 2.1**: Write unit tests for path validation helper function
  - Test that valid directory paths return resolved absolute path
  - Test that non-existent paths throw an error
  - Test that file paths (not directories) throw an error
  - Test that relative paths are resolved correctly

- [x] **Task 2.2**: Write integration tests for CLI with `--public` option
  - Test that `--public ./valid-dir` uses the specified directory
  - Test that `-P /absolute/path` uses the specified directory
  - Test that omitting `--public` uses current working directory
  - Test that `--public` works with `--port` and `--watch`

- [x] **Task 2.3**: Write integration tests for error cases
  - Test that invalid directory shows error message
  - Test that file path (not directory) shows error message

### Phase 3: Implementation

- [x] **Task 3.1**: Implement path validation helper function
  - Create `validatePublicDir(path: string): string` function
  - Resolve relative paths to absolute paths
  - Validate directory exists and is accessible
  - Throw descriptive error if validation fails

- [x] **Task 3.2**: Update CLI to accept `--public` option
  - Add `-P, --public <path>` option to commander program
  - Set default value to `process.cwd()`
  - Integrate path validation before server creation

- [x] **Task 3.3**: Handle validation errors gracefully
  - Catch validation errors in CLI action
  - Display user-friendly error message to stderr
  - Exit with non-zero code on error

### Phase 4: Verification

- [x] **Task 4.1**: Run all tests and ensure they pass
  ```bash
  npm run test
  ```

- [x] **Task 4.2**: Manual testing
  - Test with valid relative directory
  - Test with valid absolute directory
  - Test with invalid directory
  - Test with file path instead of directory
  - Test combination with `--port` and `--watch`

- [x] **Task 4.3**: Verify `--help` output includes `--public` option

### Phase 5: Finalization

- [x] **Task 5.1**: Review code for consistency with existing patterns
- [ ] **Task 5.2**: Commit changes with descriptive message
- [ ] **Task 5.3**: Create pull request to merge into main branch

## Dependencies

```
Task 2.1 → Task 3.1 (Write tests before implementation)
Task 2.2 → Task 3.2 (Write tests before implementation)
Task 2.3 → Task 3.3 (Write tests before implementation)
Task 3.1 → Task 3.2 (Helper function needed for CLI)
Task 3.2 → Task 3.3 (Error handling after CLI update)
Task 3.3 → Task 4.1 (All implementation complete before verification)
```

## Notes

- Follow TDD: Write failing tests first, then implement to make them pass
- Keep changes minimal and focused on the `--public` option
- Maintain backward compatibility with existing CLI usage
