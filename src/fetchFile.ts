import type { FileInput, DownloadOptions, DownloadedFile } from './types';

/**
 * Fetches a single file from a URL with timeout support
 * @param file - The file to download
 * @param options - Download options including timeout and fetch options
 * @returns Promise resolving to the downloaded file with blob data
 */
export async function fetchFile(
  file: FileInput,
  options: DownloadOptions
): Promise<DownloadedFile> {
  const timeout = options.timeout || 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(file.url, {
      ...options.fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${file.url}: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();

    return {
      name: file.name,
      blob,
      success: true,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const err =
      error instanceof Error ? error : new Error('Unknown error occurred');

    return {
      name: file.name,
      blob: new Blob(),
      success: false,
      error: err,
    };
  }
}
