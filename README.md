# Zipper

An **isomorphic** TypeScript package for downloading multiple files and combining them into a ZIP archive. Works in both **browser** and **Node.js** environments!

**By Diego Alto** | [GitHub](https://github.com/diegoaltoworks/zipper) | [NPM](https://www.npmjs.com/package/@diegoaltoworks/zipper) | [Documentation](https://diegoaltoworks.github.io/zipper) | [Live Demo](https://zipper-demo.vercel.app)

## Features

- ⚡ **Isomorphic**: Works in both browser and Node.js environments
- 📦 **TypeScript Support**: Full type definitions included
- 🚀 **Concurrent Downloads**: Download multiple files in parallel
- 📊 **Progress Tracking**: Built-in progress callbacks
- 🛡️ **Error Handling**: Robust error handling with optional error callbacks
- 🌐 **Modern Dependencies**: Uses standard npm packages (JSZip, File-Saver)
- 🔧 **Flexible**: Continue on errors or fail fast
- ⚙️ **Customizable**: Custom fetch options, timeouts, and ZIP filename

## Installation

```bash
npm install @diegoaltoworks/zipper
```

That's it! File-saver is included automatically for browser support.

## Environment Support

- **Browser**: Auto-triggers ZIP download
- **Node.js**: Returns Buffer for server-side use
- **Next.js**: Works in both Client Components and API Routes
- **Express**: Perfect for server-side ZIP generation

## Usage

### Browser Example (Auto-Download)

```typescript
import { downloadZipFile, type FileInput } from '@diegoaltoworks/zipper';

const files: FileInput[] = [
  { url: '/api/documents/report1.pdf', name: 'Report 1.pdf' },
  { url: '/api/documents/report2.pdf', name: 'Report 2.pdf' },
];

await downloadZipFile(files, { zipFilename: 'reports.zip' });
// ✓ Triggers browser download automatically
```

### Node.js Example (Get Buffer)

```typescript
import { createZipFile } from '@diegoaltoworks/zipper';
import { writeFile } from 'fs/promises';

const files = [
  { url: 'https://example.com/file1.pdf', name: 'Document A.pdf' },
  { url: 'https://example.com/file2.pdf', name: 'Document B.pdf' }
];

const buffer = await createZipFile(files);
// ✓ Returns Buffer in Node.js

await writeFile('output.zip', buffer);
```

### Alternative: Use Default Export

```typescript
import zipper from '@diegoaltoworks/zipper';

// Same as downloadZipFile
await zipper(files, { zipFilename: 'download.zip' });
```

### Next.js API Route Example

```typescript
// app/api/download/route.ts
import { NextResponse } from 'next/server';
import { createZipFile } from '@diegoaltoworks/zipper';

export async function GET() {
  const buffer = await createZipFile([
    { url: 'https://example.com/file1.pdf', name: 'file1.pdf' },
    { url: 'https://example.com/file2.pdf', name: 'file2.pdf' }
  ]);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="download.zip"'
    }
  });
}
```

### With Options

```typescript
import { downloadZipFile, type FileInput, type DownloadOptions } from '@diegoaltoworks/zipper';

const files: FileInput[] = [
  { url: 'https://example.com/file1.pdf', name: 'Document A.pdf' },
  { url: 'https://example.com/file2.pdf', name: 'Document B.pdf' }
];

const options: DownloadOptions = {
  zipFilename: 'my-documents.zip',

  onProgress: (current, total) => {
    console.log(`Downloaded ${current} of ${total} files`);
    // Update your UI progress indicator here
  },

  onError: (error, file) => {
    console.error(`Failed to download ${file.name}:`, error.message);
    // Handle individual file errors
  },

  continueOnError: true, // Continue downloading even if some files fail

  timeout: 30000, // 30 second timeout per file

  fetchOptions: {
    headers: {
      'Authorization': 'Bearer your-token-here'
    }
  }
};

await downloadZipFile(files, options);
```

### React Example

```tsx
import { useState } from 'react';
import { downloadZipFile, type FileInput } from '@diegoaltoworks/zipper';

function DownloadButton() {
  const [progress, setProgress] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    const files: FileInput[] = [
      { url: '/api/file1.pdf', name: 'file1.pdf' },
      { url: '/api/file2.pdf', name: 'file2.pdf' }
    ];

    try {
      await downloadZipFile(files, {
        zipFilename: 'files.zip',
        onProgress: (current, total) => {
          setProgress(`${current}/${total}`);
        }
      });

      setProgress('Complete!');
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? `Downloading... ${progress}` : 'Download ZIP'}
      </button>
    </div>
  );
}
```

## API Reference

### `createZipFile(files, options?)`

Downloads multiple files and creates a ZIP archive (works in both browser and Node.js).

#### Parameters

- **`files`** `FileInput[]` - Array of files to download
  - `url` `string` - The URL to fetch the file from
  - `name` `string` - The filename to use in the ZIP archive

- **`options?`** `DownloadOptions` - Optional configuration
  - `onProgress?` `(current: number, total: number) => void` - Progress callback
  - `onError?` `(error: Error, file: FileInput) => void` - Error callback
  - `continueOnError?` `boolean` - Continue on errors (default: `true`)
  - `timeout?` `number` - Request timeout in milliseconds (default: `30000`)
  - `fetchOptions?` `RequestInit` - Additional fetch options (headers, etc.)

#### Returns

- `Promise<Buffer>` in Node.js
- `Promise<Blob>` in browser

#### Throws

- Throws an error if no files are provided
- Throws an error if all downloads fail
- Throws an error if `continueOnError` is `false` and any download fails

---

### `downloadZipFile(files, options?)`

Downloads multiple files, creates a ZIP, and triggers browser download.

#### Parameters

- **`files`** `FileInput[]` - Array of files to download
- **`options?`** `DownloadOptions` - Optional configuration
  - `zipFilename?` `string` - Name of the ZIP file (default: `'download.zip'`)
  - All options from `createZipFile` are also supported

#### Returns

`Promise<void>` - Resolves when download is triggered

#### Throws

- Same errors as `createZipFile`
- Throws an error if browser is not supported

## Type Definitions

```typescript
interface FileInput {
  url: string;
  name: string;
}

interface DownloadOptions {
  zipFilename?: string;
  onProgress?: (current: number, total: number) => void;
  onError?: (error: Error, file: FileInput) => void;
  continueOnError?: boolean;
  timeout?: number;
  fetchOptions?: RequestInit;
}
```

## Demo & Documentation

### Live Demo Application

Try the **full-stack demo application** at **[zipper-demo.vercel.app](https://zipper-demo.vercel.app)** featuring:
- Interactive file selection and downloads
- Server-side ZIP generation with Next.js API routes
- Real-time progress tracking
- Error handling demonstrations
- Mobile-responsive UI

**Source code:** [github.com/diegoaltoworks/zipper-demo](https://github.com/diegoaltoworks/zipper-demo)

### Interactive Documentation

Browse examples and code samples at **[diegoaltoworks.github.io/zipper](https://diegoaltoworks.github.io/zipper)**

The documentation site (`docs/` directory) includes:
- Browser usage examples with live demos
- Server-side usage patterns
- Code playground for experimentation
- Multiple file type demonstrations
- 100+ test files for testing (PDFs, PNGs, text files)

To run the docs locally:

```bash
cd docs
npm install
npm run dev
```

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

Outputs ESM and CJS modules to `dist/`:
- `dist/index.esm.js` - ES module
- `dist/index.cjs.js` - CommonJS module
- `dist/index.d.ts` - TypeScript definitions

### Test

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Lint

```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
npm run format        # Format with Prettier
```

### Type Check

```bash
npm run type-check
```

## Browser Compatibility

This package works in all modern browsers that support:
- Fetch API
- Blob
- Promise
- AbortController

For older browser support, you may need polyfills.

## License

MIT

## Credits

Built with:
- [JSZip](https://stuk.github.io/jszip/) - Create ZIP files
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/) - Save files in the browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
