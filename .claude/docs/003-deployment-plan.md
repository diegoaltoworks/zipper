# Deployment Plan

**Date:** 2025-11-14
**Status:** Ready for Deployment

## Overview

This document outlines the steps to deploy the `zipper` package to npm and the demo application to GitHub Pages.

## Prerequisites

### For NPM Publishing
1. **NPM Account** - Create at https://www.npmjs.com/signup
2. **NPM Token** - Generate at https://www.npmjs.com/settings/[username]/tokens
   - Type: "Automation" token for GitHub Actions
3. **GitHub Repository** - Push code to GitHub first

### For GitHub Pages
1. **GitHub Account** - Your existing account
2. **Repository Settings** - Enable GitHub Pages in repo settings
3. **Repository Secret** - Add `GITHUB_TOKEN` (automatically provided by GitHub)

## Step 1: Prepare Package for NPM

### Update package.json

Replace placeholders with actual values:

```json
{
  "name": "@diegoaltoworks/zipper",
  "version": "1.0.0",
  "description": "A modern TypeScript package for downloading multiple files and combining them into a ZIP archive",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/diegoaltoworks/zipper.git"
  },
  "bugs": {
    "url": "https://github.com/diegoaltoworks/zipper/issues"
  },
  "homepage": "https://github.com/diegoaltoworks/zipper#readme"
}
```

**Important:** Check if package name is available:
```bash
npm search zipper
```

If taken, use scoped package: `@your-username/zipper`

### Pre-publish Checklist

Run these commands locally:

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Run all quality checks
npm test
npm run lint
npm run type-check
npm run build

# 3. Test the package locally
npm pack
# Creates zipper-1.0.0.tgz

# 4. Test in another project
cd /tmp/test-project
npm init -y
npm install /path/to/zipper-1.0.0.tgz
```

## Step 2: Set Up GitHub Repository

### Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: zipper package"
git branch -M main
git remote add origin https://github.com/diegoaltoworks/zipper.git
git push -u origin main
```

### Add GitHub Secrets

Go to: Repository → Settings → Secrets and variables → Actions

Add these secrets:

1. **`NPM_TOKEN`** - Your npm automation token
   - Get from: https://www.npmjs.com/settings/[username]/tokens
   - Type: Automation
   - Click "Generate New Token" → "Classic Token"
   - Select "Automation" type
   - Copy the token

## Step 3: NPM Publishing Strategy

### Manual Publishing (First Time)

```bash
# 1. Login to npm
npm login

# 2. Publish (dry run first)
npm publish --dry-run

# 3. Actually publish
npm publish --access public
```

### Automated Publishing with GitHub Actions

The workflow file `.github/workflows/npm-publish.yml` will:
- Trigger on new version tags (v*)
- Run tests and build
- Publish to npm automatically

To publish a new version:

```bash
# 1. Update version in package.json
npm version patch  # or minor, or major

# 2. Push with tags
git push && git push --tags

# GitHub Actions will automatically publish to npm
```

## Step 4: GitHub Pages Deployment

### Configure Next.js for Static Export

The workflow will:
1. Build the Next.js demo app
2. Export as static files
3. Deploy to GitHub Pages

### Enable GitHub Pages

1. Go to: Repository → Settings → Pages
2. Source: "GitHub Actions"
3. The demo will be available at: `https://diegoaltoworks.github.io/zipper/`

### Custom Domain (Optional)

1. Add `CNAME` file to demo/public/:
   ```
   your-domain.com
   ```

2. Configure DNS:
   ```
   CNAME    demo    diegoaltoworks.github.io
   ```

## Step 5: Automated Workflows

### NPM Publish Workflow
**File:** `.github/workflows/npm-publish.yml`

**Triggers:**
- Manual workflow dispatch
- Git tags matching `v*` (e.g., v1.0.0, v1.1.0)

**Process:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run tests
5. Run linting
6. Build package
7. Publish to npm

### GitHub Pages Workflow
**File:** `.github/workflows/deploy-demo.yml`

**Triggers:**
- Push to `main` branch (path: demo/**)
- Manual workflow dispatch

**Process:**
1. Checkout code
2. Setup Node.js
3. Install dependencies (root and demo)
4. Build zipper package
5. Install package in demo
6. Build Next.js static export
7. Deploy to GitHub Pages

## Versioning Strategy

Follow Semantic Versioning (semver):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

```bash
# Patch release (bug fix)
npm version patch
git push && git push --tags

# Minor release (new feature)
npm version minor
git push && git push --tags

# Major release (breaking change)
npm version major
git push && git push --tags
```

## Post-Deployment Verification

### Verify NPM Package

```bash
# Check package page
open https://www.npmjs.com/package/zipper

# Install and test
npm install zipper
```

### Verify GitHub Pages

```bash
# Check deployment
open https://diegoaltoworks.github.io/zipper/
```

### Verify Package Installation

Test in a fresh project:

```bash
mkdir test-install
cd test-install
npm init -y
npm install zipper

# Create test.js
cat > test.mjs << 'EOF'
import { zipper } from 'zipper';
console.log('Import successful:', typeof zipper);
EOF

node test.mjs
```

## Troubleshooting

### NPM Publish Issues

**401 Unauthorized:**
- Check NPM_TOKEN in GitHub secrets
- Regenerate token if needed
- Ensure token has publish permissions

**403 Forbidden:**
- Package name already taken
- Use scoped package: `@username/zipper`

**Package name conflict:**
- Change name in package.json
- Update all documentation

### GitHub Pages Issues

**404 Not Found:**
- Check GitHub Pages is enabled in settings
- Verify workflow completed successfully
- Check deployment logs in Actions tab

**Assets not loading:**
- Update `next.config.js` with basePath
- Ensure assetPrefix is set correctly

## Maintenance

### Regular Updates

1. **Dependencies:**
   ```bash
   npm outdated
   npm update
   npm audit fix
   ```

2. **Security:**
   ```bash
   npm audit
   ```

3. **Testing:**
   - Keep test coverage above 80%
   - Add tests for new features
   - Update tests for bug fixes

## Rollback Plan

### Rollback NPM Package

```bash
# Deprecate a version
npm deprecate zipper@1.0.1 "Contains bug, use 1.0.2"

# Unpublish (only within 72 hours)
npm unpublish zipper@1.0.1
```

### Rollback GitHub Pages

```bash
# Redeploy previous version
git checkout [previous-commit]
git push -f origin gh-pages
```

## Next Steps After Deployment

1. **Promote the package:**
   - Share on social media
   - Post to relevant communities (Reddit, Dev.to)
   - Add to awesome lists

2. **Monitor:**
   - npm download stats
   - GitHub issues
   - Pull requests

3. **Iterate:**
   - Gather user feedback
   - Fix bugs promptly
   - Add requested features

## Support

- **Issues:** https://github.com/diegoaltoworks/zipper/issues
- **NPM:** https://www.npmjs.com/package/zipper
- **Demo:** https://diegoaltoworks.github.io/zipper/
