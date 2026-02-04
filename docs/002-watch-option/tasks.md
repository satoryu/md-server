# Implementation Tasks: --watch Option

## Task Checklist

### Phase 1: File Watcher

- [ ] **Task 1.1**: Create `watcher.ts` with `createWatcher` function
  - [ ] Write test for watcher creation
  - [ ] Implement watcher using chokidar
  - [ ] Write test for file change detection
  - [ ] Implement change event emission
  - [ ] Write test for watcher close
  - [ ] Implement watcher cleanup

### Phase 2: Reload Script

- [ ] **Task 2.1**: Create `reload-script.ts` with client-side script
  - [ ] Write test for script generation
  - [ ] Implement `getReloadScript()` function

### Phase 3: Server Extensions

- [ ] **Task 3.1**: Extend `ServerOptions` interface
  - [ ] Add `watch` option to `ServerOptions`
  - [ ] Update `createServer` to accept watch option

- [ ] **Task 3.2**: Add SSE endpoint
  - [ ] Write test for `/events` endpoint
  - [ ] Implement SSE endpoint with client connection management
  - [ ] Write test for SSE event sending
  - [ ] Implement event broadcasting to all connected clients

- [ ] **Task 3.3**: Inject reload script into HTML responses
  - [ ] Write test for script injection when watch is enabled
  - [ ] Modify `wrapWithHtmlTemplate` or create wrapper function
  - [ ] Write test for no injection when watch is disabled
  - [ ] Implement conditional script injection

- [ ] **Task 3.4**: Integrate file watcher with server
  - [ ] Write test for watcher integration
  - [ ] Implement watcher setup in server
  - [ ] Write test for change event propagation to SSE
  - [ ] Implement event propagation

### Phase 4: CLI Integration

- [ ] **Task 4.1**: Add `--watch` option to CLI
  - [ ] Add `-w, --watch` option to commander
  - [ ] Pass watch option to createServer

### Phase 5: Integration Testing

- [ ] **Task 5.1**: Integration tests
  - [ ] Test server with watch mode enabled
  - [ ] Test file change triggers browser reload
  - [ ] Test multiple clients receive reload event

### Phase 6: Documentation and Cleanup

- [ ] **Task 6.1**: Update documentation
  - [ ] Verify README.md is accurate
  - [ ] Add inline code documentation

- [ ] **Task 6.2**: Final verification
  - [ ] Run all tests
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
