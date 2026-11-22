# CHANGELOG Format

## Structure

```markdown
# Changelog

## [VERSION] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing functionality

### Fixed
- Bug fixes

### Removed
- Removed features
```

## Rules

- Follow [Keep a Changelog](https://keepachangelog.com/) format.
- Use the current date (YYYY-MM-DD) for the release date.
- Categorize commits by type using conventional commit prefixes:
  - `feat:` → **Added**
  - `fix:` → **Fixed**
  - `chore:`, `refactor:`, `perf:` → **Changed**
  - Removal-related changes → **Removed**
- Omit empty categories.
- Write entries from the user's perspective (what changed for them), not implementation details.
- Each entry should be a single line starting with `- `.

## Example

```markdown
# Changelog

## [0.1.0] - 2026-02-15

### Added
- Add .gitignore-style file exclusion with .mdsignore

### Changed
- Prepare @satoryu/md-server for npm publishing
```
