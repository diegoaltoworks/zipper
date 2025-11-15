# Contributing to Zipper

Thank you for your interest in contributing!

## Quick Start

```bash
npm install
npm test
npm run lint
npm run build
```

## Pull Requests

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make your changes
4. Run tests and linting locally:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```
5. Submit a PR to the `main` branch

## Release Process

When your PR is approved and merged to `main`, an automated workflow handles the release:

### For Feature/Bug Fix PRs (No Version Change)
- PR merges normally
- No release is created
- Changes will be included in the next versioned release

### For Release PRs (With Version Bump)

If your PR includes a version bump in `package.json`:

```bash
npm version patch  # for bug fixes (1.0.0 → 1.0.1)
npm version minor  # for new features (1.0.0 → 1.1.0)
npm version major  # for breaking changes (1.0.0 → 2.0.0)
```

When the PR merges to `main`, the workflow automatically:

1. ✅ Detects the version change
2. ✅ Runs all tests, linting, and type checks
3. ✅ Builds the package
4. ✅ Publishes to NPM with provenance
5. ✅ Creates a git tag (e.g., `v1.0.5`)
6. ✅ Creates a GitHub Release with auto-generated notes

**No manual intervention required!** Just bump the version in your PR and let the automation handle the rest.

See README.md for more details.
