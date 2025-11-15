/**
 * Browser compatibility detection for required APIs
 */

export interface CompatibilityStatus {
  supported: boolean;
  missing: string[];
}

/**
 * Checks if the current browser supports all required APIs for zipper
 * @returns Compatibility status with list of missing features
 */
export function checkBrowserCompatibility(): CompatibilityStatus {
  const missing: string[] = [];

  if (typeof window === 'undefined') {
    return {
      supported: false,
      missing: ['Browser environment (running in Node.js or SSR)'],
    };
  }

  if (typeof fetch === 'undefined') {
    missing.push('Fetch API');
  }

  if (typeof Blob === 'undefined') {
    missing.push('Blob API');
  }

  if (typeof Promise === 'undefined') {
    missing.push('Promise API');
  }

  if (typeof AbortController === 'undefined') {
    missing.push('AbortController API');
  }

  if (typeof URL === 'undefined') {
    missing.push('URL API');
  }

  return {
    supported: missing.length === 0,
    missing,
  };
}

/**
 * Logs browser compatibility warnings to the console
 * @returns true if browser is supported, false otherwise
 */
export function warnIfUnsupported(): boolean {
  const compat = checkBrowserCompatibility();

  if (!compat.supported) {
    console.error(
      '[Zipper] Browser not supported. Missing required APIs:',
      compat.missing
    );
    console.error(
      '[Zipper] Please use a modern browser (Chrome, Firefox, Safari, or Edge).'
    );
    console.error('[Zipper] For legacy browser support, consider using polyfills.');
    return false;
  }

  return true;
}

/**
 * Gets a user-friendly error message for unsupported browsers
 * @returns Error message if unsupported, null if supported
 */
export function getUnsupportedMessage(): string | null {
  const compat = checkBrowserCompatibility();

  if (!compat.supported) {
    return `Your browser is missing required features: ${compat.missing.join(', ')}. Please use a modern browser (Chrome, Firefox, Safari, or Edge).`;
  }

  return null;
}
