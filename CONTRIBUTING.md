# Contributing to Zipper

Thank you for your interest in contributing to Zipper! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates. When creating a bug report:

1. Use the bug report template
2. Provide a clear title and description
3. Include steps to reproduce the issue
4. Provide code samples if applicable
5. Specify your environment (browser, OS, package version)

### Suggesting Features

Feature requests are welcome! When suggesting a feature:

1. Use the feature request template
2. Explain the problem your feature would solve
3. Describe your proposed solution
4. Provide example usage code
5. Consider if it benefits the broader community

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Run linting and fix any issues
7. Commit your changes with clear messages
8. Push to your fork
9. Open a pull request

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/zipper.git
cd zipper

# Install dependencies
npm install

# Install demo dependencies
cd demo && npm install && cd ..
```

### Project Structure

```
zipper/
├── src/                  # Package source code
│   ├── index.ts          # Main entry point
│   ├── zipper.ts         # Core zipper function
│   ├── fetchFile.ts      # File fetching utility
│   └── types.ts          # TypeScript type definitions
├── demo/                 # Next.js demo application
│   ├── app/              # Next.js app directory
│   └── public/data/      # Test PDF files
├── dist/                 # Build output (generated)
├── .github/              # GitHub configuration
│   ├── workflows/        # CI/CD workflows
│   └── ISSUE_TEMPLATE/   # Issue templates
└── .claude/              # Project documentation
    ├── docs/             # Historical documentation
    └── manual/           # Setup and deployment guides
```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting and Formatting

```bash
# Check for lint errors
npm run lint

# Fix lint errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Type check
npm run type-check
```

### Building

```bash
# Build the package
npm run build

# Output:
# - dist/index.esm.js (ES module)
# - dist/index.cjs.js (CommonJS)
# - dist/index.d.ts (TypeScript definitions)
```

### Running the Demo

```bash
cd demo

# Development server
npm run dev
# Visit http://localhost:3000

# Build for production
npm run build

# Test production build locally
npm start
```

## Testing Guidelines

### Unit Tests

- All new features must include unit tests
- Aim for >95% code coverage
- Use Jest and ts-jest
- Mock external dependencies (fetch, file-saver)

### Test File Naming

- Test files: `*.test.ts`
- Place tests alongside source files in `src/`

### Example Test

```typescript
import { zipper } from './zipper';

describe('zipper', () => {
  it('should download and zip files', async () => {
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['test']))
    });

    const files = [
      { url: '/test.pdf', name: 'test.pdf' }
    ];

    await zipper(files);

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Tests

- Use Playwright for browser testing
- Test on Chrome, Firefox, Safari, Edge
- Test on mobile browsers (iOS Safari, Chrome Android)
- Verify browser compatibility warnings

```bash
# Run E2E tests (when implemented)
npm run test:e2e

# Run on specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

## Code Style

### TypeScript

- Use TypeScript strict mode
- Provide type definitions for all exports
- Avoid `any` types
- Use meaningful variable names

### Formatting

- We use Prettier for code formatting
- 2 space indentation
- Single quotes for strings
- No semicolons (except where required)
- Trailing commas in multi-line structures

### ESLint Rules

- Follow the project's ESLint configuration
- Fix all warnings before submitting PR
- Avoid disabling ESLint rules unless absolutely necessary

## Commit Guidelines

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
git commit -m "feat: add retry logic for failed downloads"

git commit -m "fix: handle abort controller timeout correctly"

git commit -m "docs: update README with new options"

git commit -m "test: add tests for error handling"
```

## Pull Request Process

1. **Update Documentation**
   - Update README if adding features
   - Add JSDoc comments for new functions
   - Update type definitions

2. **Add Tests**
   - Unit tests for all new code
   - E2E tests for UI changes
   - Ensure all tests pass

3. **Run Quality Checks**
   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run build
   ```

4. **Update CHANGELOG** (if applicable)
   - Add entry under "Unreleased" section
   - Describe the change clearly

5. **Submit PR**
   - Provide clear title and description
   - Reference related issues
   - Request review

6. **Address Feedback**
   - Respond to review comments
   - Make requested changes
   - Update PR as needed

## Browser Compatibility

### Supported Browsers

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- iOS Safari: Last 2 versions
- Chrome Android: Last 2 versions

### Required APIs

The package requires these browser APIs:
- Fetch API
- Blob
- Promise
- AbortController (for timeout support)

### Compatibility Checking

When adding new features:
1. Check browser support on [caniuse.com](https://caniuse.com)
2. Add polyfills if needed (document in README)
3. Add browser compatibility warnings for unsupported features
4. Test on all supported browsers

## Release Process

Releases are automated via GitHub Actions:

1. Update version: `npm version [patch|minor|major]`
2. Push with tags: `git push && git push --tags`
3. GitHub Actions will:
   - Run tests
   - Build package
   - Publish to npm
   - Create GitHub release
   - Deploy demo to GitHub Pages

## Questions?

- Check the [README](README.md)
- Browse [existing issues](https://github.com/diegoaltoworks/zipper/issues)
- Start a [discussion](https://github.com/diegoaltoworks/zipper/discussions)
- Email: diego@diegoalto.works

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
