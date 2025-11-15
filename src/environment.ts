/**
 * Runtime environment detection utilities
 */

export type RuntimeEnvironment = 'browser' | 'node';

/**
 * Detects the current runtime environment
 * @returns 'browser' if running in a browser, 'node' if running in Node.js
 */
export function detectEnvironment(): RuntimeEnvironment {
  // Check for Node.js environment
  if (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  ) {
    return 'node';
  }

  // Check for browser environment
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    return 'browser';
  }

  // Default to Node.js for server-side rendering contexts
  return 'node';
}

/**
 * Returns true if running in Node.js environment
 */
export const isNode = (): boolean => detectEnvironment() === 'node';

/**
 * Returns true if running in browser environment
 */
export const isBrowser = (): boolean => detectEnvironment() === 'browser';
