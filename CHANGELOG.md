# Changelog

## [0.1.0] - 2026-02-15

### Added
- Minimal markdown server that serves `.md` files as HTML
- `--watch` option for auto-reload on file changes
- `--public` option to specify the directory for markdown files
- Syntax highlighting for code blocks
- Mermaid diagram rendering for code blocks
- Request logging middleware
- `.mdsignore` file support for .gitignore-style file exclusion

### Fixed
- Resolve TypeScript error in wildcard route params access

### Changed
- Prepare @satoryu/md-server for npm publishing
