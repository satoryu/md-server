# Issue #6: Syntax Highlighting for Code Blocks

## Problem Statement

Currently, code blocks in rendered markdown pages have a plain gray background with no syntax highlighting. This makes reading code snippets difficult, especially for longer or more complex blocks. Adding syntax highlighting will significantly improve readability and the overall developer experience.

## Requirements

1. Fenced code blocks with a language specifier (e.g., ` ```javascript `) must render with syntax highlighting.
2. Code blocks without a language specifier must still render properly without errors.
3. The highlighting theme must be visually consistent with the existing page styling.
4. Syntax highlighting should be performed server-side to avoid flash of unstyled content and to work without client-side JavaScript.
5. No impact on existing functionality (all tests pass, auto-reload works, file listing works).

## Constraints

- Must use a well-maintained, widely-adopted library for syntax highlighting.
- Server-side rendering is preferred over client-side to avoid layout shifts.
- The solution should not significantly increase page load time or response latency.
- The highlight theme CSS must be included inline in the HTML template (consistent with current approach of no external assets).

## Acceptance Criteria

- [ ] Fenced code blocks with language identifiers (e.g., `js`, `python`, `typescript`) are rendered with syntax highlighting.
- [ ] Code blocks without a language identifier render without errors and with reasonable styling.
- [ ] The highlight theme colors are visually harmonious with the existing page design.
- [ ] All existing tests continue to pass.
- [ ] New tests cover the syntax highlighting functionality.

## User Stories

1. **As a reader**, I want code blocks to have syntax highlighting so that I can read and understand code more easily.
2. **As a document author**, I want to specify the language in fenced code blocks and see proper highlighting for that language.
3. **As a document author**, I want code blocks without a language specifier to still render cleanly.
