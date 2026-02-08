# Issue #6: Syntax Highlighting — Tasks

## Implementation Checklist

- [x] 1. Install `highlight.js` as a production dependency
- [x] 2. Configure `marked` with a custom renderer that uses highlight.js for code blocks
  - Handle code blocks with a specified language
  - Handle code blocks without a language (use `highlightAuto`)
  - Handle unknown languages gracefully (fall back to plain escaped text)
- [x] 3. Add highlight.js GitHub theme CSS to the HTML template
- [x] 4. Update existing `pre`/`code` CSS to work with highlight.js classes
- [x] 5. Write tests for syntax highlighting
  - Test that code blocks with a known language produce highlighted output (contain `hljs` class)
  - Test that code blocks without a language still render properly
  - Test that code blocks with unknown languages render without errors
  - Test that the HTML template includes highlight.js theme styles
- [x] 6. Run full test suite and typecheck to ensure no regressions
