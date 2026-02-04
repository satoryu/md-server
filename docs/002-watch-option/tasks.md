# Implementation Tasks: --watch Option

## Task Checklist

### Phase 1: File Watcher

- [x] **Task 1.1**: Create `watcher.ts` with `createWatcher` function
  - [x] Write test for watcher creation
  - [x] Implement watcher using chokidar
  - [x] Write test for file change detection
  - [x] Implement change event emission
  - [x] Write test for watcher close
  - [x] Implement watcher cleanup

### Phase 2: Reload Script

- [x] **Task 2.1**: Create `reload-script.ts` with client-side script
  - [x] Write test for script generation
  - [x] Implement `getReloadScript()` function

### Phase 3: Server Extensions

- [x] **Task 3.1**: Extend `ServerOptions` interface
  - [x] Add `watch` option to `ServerOptions`
  - [x] Update `createServer` to accept watch option

- [x] **Task 3.2**: Add SSE endpoint
  - [x] Write test for `/events` endpoint
  - [x] Implement SSE endpoint with client connection management
  - [x] Write test for SSE event sending
  - [x] Implement event broadcasting to all connected clients

- [x] **Task 3.3**: Inject reload script into HTML responses
  - [x] Write test for script injection when watch is enabled
  - [x] Modify `wrapWithHtmlTemplate` or create wrapper function
  - [x] Write test for no injection when watch is disabled
  - [x] Implement conditional script injection

- [x] **Task 3.4**: Integrate file watcher with server
  - [x] Write test for watcher integration
  - [x] Implement watcher setup in server
  - [x] Write test for change event propagation to SSE
  - [x] Implement event propagation

### Phase 4: CLI Integration

- [x] **Task 4.1**: Add `--watch` option to CLI
  - [x] Add `-w, --watch` option to commander
  - [x] Pass watch option to createServer

### Phase 5: Integration Testing

- [x] **Task 5.1**: Integration tests
  - [x] Test server with watch mode enabled
  - [x] Test file change triggers browser reload
  - [x] Test multiple clients receive reload event

### Phase 6: Documentation and Cleanup

- [x] **Task 6.1**: Update documentation
  - [x] Verify README.md is accurate
  - [x] Add inline code documentation

- [x] **Task 6.2**: Final verification
  - [x] Run all tests
  - [ ] Manual testing with real browser
  - [ ] Code review

## Dependencies

- Phase 2 depends on Phase 1 completion
- Phase 3 depends on Phase 1 and 2 completion
- Phase 4 depends on Phase 3 completion
- Phase 5 depends on Phase 4 completion

## Notes

- TDD approach: Write test first, then implement
- Each task should be committed separately
- Run `npm run test` after each task to ensure no regressions
