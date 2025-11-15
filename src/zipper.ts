import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { FileInput, DownloadOptions, DownloadedFile } from './types';
import { fetchFile } from './fetchFile';
import { warnIfUnsupported, getUnsupportedMessage } from './browserCompat';

/**
 * Downloads multiple files and combines them into a single ZIP archive
 * @param files - Array of files to download, each with a URL and desired name
 * @param options - Optional configuration for the download process
 * @returns Promise that resolves when the ZIP file has been created and download triggered
 * @throws Error if no files are provided or all downloads fail
 *
 * @example
 * ```typescript
 * await zipper([
 *   { url: '/api/file1.pdf', name: 'Document A.pdf' },
 *   { url: '/api/file2.pdf', name: 'Document B.pdf' }
 * ], {
 *   zipFilename: 'my-documents.zip',
 *   onProgress: (current, total) => console.log(`${current}/${total}`),
 *   onError: (error, file) => console.error(`Failed: ${file.name}`)
 * });
 * ```
 */
export async function zipper(
  files: FileInput[],
  options: DownloadOptions = {}
): Promise<void> {
  if (!files || files.length === 0) {
    throw new Error('No files provided to download');
  }

  const isSupported = warnIfUnsupported();
  if (!isSupported) {
    const message = getUnsupportedMessage();
    throw new Error(message || 'Browser not supported');
  }

  const {
    zipFilename = 'download.zip',
    onProgress,
    onError,
    continueOnError = true,
  } = options;

  // Download all files in parallel
  const downloadPromises = files.map((file) => fetchFile(file, options));
  const results = await Promise.all(downloadPromises);

  // Track progress and handle errors
  let successCount = 0;
  const successfulDownloads: DownloadedFile[] = [];

  for (const result of results) {
    if (result.success) {
      successCount++;
      successfulDownloads.push(result);
      if (onProgress) {
        onProgress(successCount, files.length);
      }
    } else if (result.error) {
      // Find the original file input for the error callback
      const originalFile = files.find((f) => f.name === result.name);
      if (originalFile && onError) {
        onError(result.error, originalFile);
      }
      if (!continueOnError) {
        throw result.error;
      }
    }
  }

  // Check if we have any successful downloads
  if (successfulDownloads.length === 0) {
    throw new Error('All file downloads failed');
  }

  // Create ZIP file
  const zip = new JSZip();

  for (const download of successfulDownloads) {
    zip.file(download.name, download.blob);
  }

  // Generate and save the ZIP file
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, zipFilename);
}
