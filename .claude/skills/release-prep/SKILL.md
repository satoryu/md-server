---
name: release-prep
description: Release preparation workflow for @satoryu/md-server npm package. Handles version bumping (patch/minor/major or specific version), CHANGELOG generation from git history, git tagging, and npm publishing. Use when the user says "リリースして", "リリース準備", "v1.2.0をリリース", "パッチリリース", "publish", or any variation requesting a release of md-server.
---

# Release Prep for @satoryu/md-server

## Workflow

Execute the following steps in order. Stop and report to the user if any step fails.

### Step 1: Determine Version

Parse the user's request to determine the target version:

- Specific version (e.g., "v1.2.0をリリース") → use that version (strip the `v` prefix)
- Bump level (e.g., "パッチリリース", "マイナーリリース") → resolve using current version from `package.json`
- No version specified (e.g., "リリースして") → ask the user which bump level (patch/minor/major)

### Step 2: Pre-release Checks

Run all checks and stop if any fail:

```bash
npm run test:run
npm run typecheck
```

Verify the working tree is clean (`git status`). If there are uncommitted changes, warn the user and stop.

### Step 3: Update CHANGELOG

Generate CHANGELOG entries from git log since the last tag (or from the initial commit if no tags exist). See [references/changelog-format.md](references/changelog-format.md) for the format.

If `CHANGELOG.md` does not exist, create it. Prepend the new version section at the top (below the header).

### Step 4: Version Bump and Tag

```bash
# Stage CHANGELOG
git add CHANGELOG.md

# Commit
git commit -m "chore: release v<VERSION>"

# Create annotated tag
git tag -a "v<VERSION>" -m "v<VERSION>"

# Update package.json version (without creating another tag)
npm version <VERSION> --no-git-tag-version
git add package.json package-lock.json
git commit --amend --no-edit
git tag -d "v<VERSION>"
git tag -a "v<VERSION>" -m "v<VERSION>"
```

### Step 5: Publish

Ask the user for confirmation before each action:

1. **Push to remote**:
   ```bash
   git push origin main --follow-tags
   ```

2. **Publish to npm**:
   ```bash
   npm publish --access public
   ```
   Note: The `prepublishOnly` script in `package.json` automatically runs `npm run build` before publishing.

### Step 6: Post-release Summary

Report the completed release to the user:

- Version released
- npm package URL: `https://www.npmjs.com/package/@satoryu/md-server`
- Git tag created
- CHANGELOG entries added
