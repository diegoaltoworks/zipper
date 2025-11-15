import { saveAs } from 'file-saver';
import type { FileInput, DownloadOptions } from './types';
import { createZipFile } from './createZipFile';

/**
 * Downloads multiple files, creates a ZIP, and triggers browser download
 *
 * This is a browser-specific convenience function that uses createZipFile
 * internally and triggers a download using file-saver.
 *
 * @param files - Array of files to download, each with a URL and desired name
 * @param options - Optional configuration for the download process
 * @returns Promise<void> - Resolves when download is triggered
 * @throws Error if not in browser environment or if downloads fail
 *
 * @example
 * **Browser Example:**
 * ```typescript
 * import { downloadZipFile } from '@diegoaltoworks/zipper';
 *
 * await downloadZipFile([
 *   { url: '/api/file1.pdf', name: 'Document A.pdf' },
 *   { url: '/api/file2.pdf', name: 'Document B.pdf' }
 * ], {
 *   zipFilename: 'my-documents.zip',
 *   onProgress: (current, total) => console.log(`${current}/${total}`),
 *   onError: (error, file) => console.error(`Failed: ${file.name}`)
 * });
 * ```
 *
 * @example
 * **React Example:**
 * ```tsx
 * import { downloadZipFile } from '@diegoaltoworks/zipper';
 *
 * function DownloadButton() {
 *   const handleDownload = async () => {
 *     await downloadZipFile([
 *       { url: '/api/file1.pdf', name: 'file1.pdf' },
 *       { url: '/api/file2.pdf', name: 'file2.pdf' }
 *     ], {
 *       zipFilename: 'files.zip',
 *       onProgress: (current, total) => console.log(`Downloaded ${current}/${total}`)
 *     });
 *   };
 *
 *   return <button onClick={handleDownload}>Download ZIP</button>;
 * }
 * ```
 */
export async function downloadZipFile(
  files: FileInput[],
  options: DownloadOptions = {}
): Promise<void> {
  const { zipFilename = 'download.zip' } = options;

  // Use createZipFile to generate the ZIP
  const zipBlob = await createZipFile(files, options);

  // Trigger download using file-saver
  saveAs(zipBlob as Blob, zipFilename);
}
