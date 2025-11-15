# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2025-01-15

### Changed
- Renamed `/demo` directory to `/docs` for clarity
- Updated all documentation and references
- Improved README with links to separate demo application at zipper-demo.vercel.app
- Enhanced docs site with interactive examples and playground

### Added
- MIT LICENSE file
- CHANGELOG.md for version history
- Comprehensive documentation site
- Links to full-stack demo application

## [1.0.3] - 2025-01-14

### Changed
- Refactored API: separated `createZipFile` (isomorphic) and `downloadZipFile` (browser-specific)
- Moved `file-saver` from peer dependency to regular dependency for simplified installation
- Updated all examples and documentation to use new API

### Added
- `createZipFile()` function for isomorphic usage (returns Buffer in Node.js, Blob in browser)
- `downloadZipFile()` function for browser downloads
- Backward compatibility with legacy `zipper()` function

### Fixed
- Browser/Node.js environment detection
- Blob handling for cross-environment compatibility

## [1.0.2] - 2025-01-13

### Fixed
- Package installation issues with symlinks in Next.js/Turbopack
- Type definitions and module exports

## [1.0.1] - 2025-01-12

### Added
- Initial E2E tests with Playwright
- GitHub Actions workflows for CI/CD
- Demo application with multiple examples

### Fixed
- Build configuration for dual ESM/CJS output
- TypeScript strict mode compatibility

## [1.0.0] - 2025-01-10

### Added
- Initial release
- Isomorphic package for browser and Node.js
- TypeScript support with full type definitions
- Concurrent file downloads
- Progress tracking callbacks
- Error handling with `continueOnError` option
- Custom fetch options and timeouts
- Demo application with Next.js
- Comprehensive test suite with Jest
- Documentation and examples

[1.0.4]: https://github.com/diegoaltoworks/zipper/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/diegoaltoworks/zipper/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/diegoaltoworks/zipper/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/diegoaltoworks/zipper/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/diegoaltoworks/zipper/releases/tag/v1.0.0
