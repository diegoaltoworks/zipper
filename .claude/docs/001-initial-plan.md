# Zipper - Project Plan

**Date:** 2025-11-14
**Status:** Complete

## Project Overview

Create a modern, pure TypeScript npm package that provides a `zipper()` utility function. The package will:
- Accept an array of `{url, name}[]` objects
- Fetch all files as blobs concurrently
- Combine them into a single ZIP file
- Trigger browser download of the ZIP

## Project Structure

```
zipper/
├── backup/              # Backup of original src files
├── .claude/             # Documentation and planning
│   └── docs/            # Historical documentation
├── src/                 # Package source code (TypeScript)
│   ├── index.ts         # Main entry point
│   ├── downloadAllToZip.ts  # Core utility
│   └── types.ts         # Type definitions
├── __tests__/           # Jest unit tests (TypeScript)
├── demo/                # Next.js demo application (TypeScript)
│   └── data/            # 30 dummy PDF files (A1-9, B1-9, C1-9)
├── dist/                # Build output (ESM + CJS + .d.ts)
├── package.json         # Package configuration
├── tsconfig.json        # TypeScript configuration
├── rollup.config.js     # Build configuration
├── jest.config.js       # Test configuration
├── .eslintrc.js         # Linting rules
└── README.md            # Documentation
```

## Technical Stack

### Core Package
- **Language:** TypeScript (strict mode)
- **Dependencies:**
  - `jszip` - ZIP file creation
  - `file-saver` - Browser download utility
- **Build:** Rollup with TypeScript plugin (ESM + CJS outputs + type definitions)
- **Testing:** Jest with ts-jest
- **Linting:** ESLint + Prettier with TypeScript rules

### Demo Application
- **Framework:** Next.js (minimalist setup)
- **Purpose:** Demonstrate package usage
- **Test Data:** 30 dummy PDF files

## Implementation Plan

### Phase 1: Package Setup
1. ✅ Backup existing source files
2. ⏳ Create directory structure
3. ⏳ Initialize package.json with dependencies
4. ⏳ Configure build tools (Rollup)
5. ⏳ Configure linting (ESLint + Prettier)
6. ⏳ Configure testing (Jest)

### Phase 2: Core Development
1. ✅ Implement `zipper()` function
   - Parallel fetch with Promise.all
   - Progress callback support
   - Error handling
   - Blob conversion
   - ZIP creation with JSZip
   - Browser download trigger
2. ✅ Write unit tests
   - Mock fetch API
   - Test success scenarios
   - Test error handling
   - Test edge cases

### Phase 3: Demo Application
1. ⏳ Create Next.js app
2. ⏳ Generate 30 dummy PDF files
3. ⏳ Build demo UI
   - File list display
   - Download button
   - Progress indicator
   - Error display
4. ⏳ Integrate package

### Phase 4: Quality & Documentation
1. ⏳ Run linting and fix issues
2. ⏳ Ensure all tests pass
3. ⏳ Write comprehensive README
4. ⏳ Add usage examples
5. ⏳ Document API

## API Design

```typescript
import { downloadAllToZip, type FileInput } from 'zipper';

// Basic usage
const files: FileInput[] = [
  { url: '/api/file1.pdf', name: 'Document A.pdf' },
  { url: '/api/file2.pdf', name: 'Document B.pdf' }
];

await downloadAllToZip(files, {
  zipFilename: 'downloads.zip',
  onProgress: (current: number, total: number) => {
    console.log(`Downloaded ${current} of ${total}`);
  },
  onError: (error: Error, file: FileInput) => {
    console.error(`Failed to download ${file.name}:`, error);
  }
});
```

## Success Criteria

- ✅ Package builds to ESM and CJS formats
- ✅ All unit tests pass
- ✅ ESLint shows no errors
- ✅ Demo app successfully downloads 30 files as ZIP
- ✅ Package can be imported: `import { downloadAllToZip } from 'zipper'`
- ✅ README includes clear usage examples
- ✅ Error handling is robust

## Notes

- Original src files backed up to `./backup/src/`
- Original files contain browser-specific utilities and dependencies on external libraries
- New package will be modern, dependency-minimal, and tree-shakeable
- Focus on clean, testable code with good error handling
