# Tasks: .gitignore-style File Exclusion (#12)

## Implementation Tasks

- [x] 1. Install the `ignore` npm package as a production dependency
- [x] 2. Create `src/ignore-filter.ts` with `loadIgnorePatterns` and `createIgnoreFilter` functions (TDD)
- [x] 3. Modify `src/file-scanner.ts` to accept an optional ignore filter function (TDD)
- [x] 4. Modify `src/server.ts` to integrate the ignore filter in `GET /` and `GET /*.md` routes (TDD)
- [x] 5. Run full test suite to confirm all existing and new tests pass
- [x] 6. Run type checking to confirm no type errors
