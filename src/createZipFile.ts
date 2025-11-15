import JSZip from 'jszip';
import type { FileInput, DownloadOptions, DownloadedFile } from './types';
import { fetchFile } from './fetchFile';
import { isNode } from './environment';

/**
 * Downloads multiple files and creates a ZIP archive
 *
 * This is the core agnostic function that works in both browser and Node.js.
 * Returns a Buffer in Node.js or Blob in browser.
 *
 * @param files - Array of files to download, each with a URL and desired name
 * @param options - Optional configuration for the download process
 * @returns Promise<Buffer> in Node.js, Promise<Blob> in browser
 * @throws Error if no files are provided or all downloads fail
 *
 * @example
 * **Node.js Example:**
 * ```typescript
 * import { createZipFile } from '@diegoaltoworks/zipper';
 * import { writeFile } from 'fs/promises';
 *
 * const buffer = await createZipFile([
 *   { url: 'https://example.com/file1.pdf', name: 'Document A.pdf' },
 *   { url: 'https://example.com/file2.pdf', name: 'Document B.pdf' }
 * ]);
 *
 * await writeFile('output.zip', buffer);
 * ```
 *
 * @example
 * **Browser Example:**
 * ```typescript
 * import { createZipFile } from '@diegoaltoworks/zipper';
 *
 * const blob = await createZipFile([
 *   { url: '/api/file1.pdf', name: 'Document A.pdf' },
 *   { url: '/api/file2.pdf', name: 'Document B.pdf' }
 * ]);
 *
 * // Upload to server
 * const formData = new FormData();
 * formData.append('zip', blob, 'files.zip');
 * await fetch('/api/upload', { method: 'POST', body: formData });
 * ```
 */
export async function createZipFile(
  files: FileInput[],
  options: DownloadOptions = {}
): Promise<Buffer | Blob> {
  if (!files || files.length === 0) {
    throw new Error('No files provided to download');
  }

  const { onProgress, onError, continueOnError = true } = options;

  // Track progress and handle errors
  let successCount = 0;
  const successfulDownloads: DownloadedFile[] = [];

  // Download all files in parallel, updating progress as each completes
  const downloadPromises = files.map(async (file) => {
    const result = await fetchFile(file, options);

    if (result.success) {
      successCount++;
      successfulDownloads.push(result);
      if (onProgress) {
        onProgress(successCount, files.length);
      }
    } else if (result.error) {
      if (onError) {
        onError(result.error, file);
      }
      if (!continueOnError) {
        throw result.error;
      }
    }

    return result;
  });

  await Promise.all(downloadPromises);

  // Check if we have any successful downloads
  if (successfulDownloads.length === 0) {
    throw new Error('All file downloads failed');
  }

  // Create ZIP file
  const zip = new JSZip();

  // Add files to ZIP
  for (const download of successfulDownloads) {
    // Convert blob to arrayBuffer if the method exists (Node.js and modern browsers)
    // Otherwise, pass the blob directly (older environments, JSZip handles it)
    if (typeof download.blob.arrayBuffer === 'function') {
      const arrayBuffer = await download.blob.arrayBuffer();
      zip.file(download.name, arrayBuffer);
    } else {
      zip.file(download.name, download.blob);
    }
  }

  // Generate ZIP based on environment
  if (isNode()) {
    const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    return buffer as Buffer;
  } else {
    const blob = await zip.generateAsync({ type: 'blob' });
    return blob;
  }
}
