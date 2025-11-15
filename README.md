# Zipper

A modern, TypeScript-first npm package for downloading multiple files from URLs and combining them into a single ZIP archive. Perfect for bulk file downloads in web applications.

**By Diego Alto** | [GitHub](https://github.com/diegoaltoworks/zipper) | [Demo](https://diegoaltoworks.github.io/zipper)

## Features

- **TypeScript Support**: Full type definitions included
- **Concurrent Downloads**: Download multiple files in parallel with Promise.all
- **Progress Tracking**: Built-in progress callbacks
- **Error Handling**: Robust error handling with optional error callbacks
- **Modern Dependencies**: Uses standard npm packages (JSZip, File-Saver)
- **Browser Native**: Uses native Fetch API and Blob support (no polyfills needed for modern browsers)
- **Flexible**: Continue on errors or fail fast
- **Customizable**: Custom fetch options, timeouts, and ZIP filename

## Installation

```bash
npm install @diegoaltoworks/zipper
```

## Dependencies

- **[jszip](https://www.npmjs.com/package/jszip)** - Create ZIP archives in JavaScript
- **[file-saver](https://www.npmjs.com/package/file-saver)** - Trigger browser file downloads

Modern browsers have native Blob and Fetch API support, so no polyfills are required.

## Usage

### Basic Example

```typescript
import { zipper, type FileInput } from '@diegoaltoworks/zipper';

const files: FileInput[] = [
  { url: '/api/documents/report1.pdf', name: 'Report 1.pdf' },
  { url: '/api/documents/report2.pdf', name: 'Report 2.pdf' },
  { url: '/api/documents/report3.pdf', name: 'Report 3.pdf' }
];

await zipper(files);
// Downloads all files and creates "download.zip"
```

### With Options

```typescript
import { zipper, type FileInput, type DownloadOptions } from '@diegoaltoworks/zipper';

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

await zipper(files, options);
```

### React Example

```tsx
import { useState } from 'react';
import { zipper, type FileInput } from '@diegoaltoworks/zipper';

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
      await zipper(files, {
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

### `zipper(files, options?)`

Downloads multiple files and combines them into a ZIP archive.

#### Parameters

- **`files`** `FileInput[]` - Array of files to download
  - `url` `string` - The URL to fetch the file from
  - `name` `string` - The filename to use in the ZIP archive

- **`options?`** `DownloadOptions` - Optional configuration
  - `zipFilename?` `string` - Name of the ZIP file (default: `'download.zip'`)
  - `onProgress?` `(current: number, total: number) => void` - Progress callback
  - `onError?` `(error: Error, file: FileInput) => void` - Error callback
  - `continueOnError?` `boolean` - Continue on errors (default: `true`)
  - `timeout?` `number` - Request timeout in milliseconds (default: `30000`)
  - `fetchOptions?` `RequestInit` - Additional fetch options (headers, etc.)

#### Returns

`Promise<void>` - Resolves when the ZIP has been created and download triggered

#### Throws

- Throws an error if no files are provided
- Throws an error if all downloads fail
- Throws an error if `continueOnError` is `false` and any download fails

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

## Demo

A working Next.js demo is included in the `demo/` directory. To run it:

```bash
cd demo
npm install
npm run dev
```

The demo includes:
- Interactive file selection UI
- 100 test PDF files (A0-A9, B0-B9, ..., K0-K9, excluding I)
- Progress tracking
- Error display
- Responsive design with Tailwind CSS

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
