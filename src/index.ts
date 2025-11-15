/**
 * zipper
 * An isomorphic TypeScript package for downloading multiple files and combining them into a ZIP archive
 * Works in both browser and Node.js environments
 */

// Core functions
export { createZipFile } from './createZipFile';
export { downloadZipFile } from './downloadZipFile';

// Default export for convenience (browser download)
export { downloadZipFile as default } from './downloadZipFile';

// Types
export type {
  FileInput,
  DownloadOptions,
  ProgressCallback,
  ErrorCallback,
  DownloadedFile,
} from './types';
