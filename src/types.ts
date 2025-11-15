/**
 * Represents a file to be downloaded
 */
export interface FileInput {
  /** The URL to fetch the file from */
  url: string;
  /** The name to give the file in the ZIP archive */
  name: string;
}

/**
 * Progress callback function
 * @param current - Number of files downloaded so far
 * @param total - Total number of files to download
 */
export type ProgressCallback = (current: number, total: number) => void;

/**
 * Error callback function
 * @param error - The error that occurred
 * @param file - The file that failed to download
 */
export type ErrorCallback = (error: Error, file: FileInput) => void;

/**
 * Options for the downloadAllToZip function
 */
export interface DownloadOptions {
  /** The name of the ZIP file to create (default: 'download.zip') */
  zipFilename?: string;
  /** Callback invoked after each file is downloaded */
  onProgress?: ProgressCallback;
  /** Callback invoked when a file fails to download */
  onError?: ErrorCallback;
  /** Whether to continue downloading remaining files if one fails (default: true) */
  continueOnError?: boolean;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Additional fetch options to pass to each request */
  fetchOptions?: RequestInit;
  /**
   * If true, returns the ZIP as a Buffer/Blob instead of triggering download
   * Automatically set to true in Node.js environment
   * @default false in browser, true in Node.js
   */
  returnBuffer?: boolean;
}

/**
 * Internal type representing a downloaded file with its blob data
 */
export interface DownloadedFile {
  name: string;
  blob: Blob;
  success: boolean;
  error?: Error;
}
