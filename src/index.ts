/**
 * zipper
 * A TypeScript package for downloading multiple files and combining them into a ZIP archive
 */

export { zipper } from './zipper';

export {
  checkBrowserCompatibility,
  warnIfUnsupported,
  getUnsupportedMessage,
} from './browserCompat';

export type {
  FileInput,
  DownloadOptions,
  ProgressCallback,
  ErrorCallback,
  DownloadedFile,
} from './types';

export type { CompatibilityStatus } from './browserCompat';
