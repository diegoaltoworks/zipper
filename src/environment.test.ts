import { detectEnvironment, isNode, isBrowser } from './environment';

describe('environment', () => {
  // Store original globals
  const originalWindow = global.window;
  const originalProcess = global.process;

  // Restore globals after each test
  afterEach(() => {
    global.window = originalWindow;
    global.process = originalProcess;
  });

  describe('detectEnvironment', () => {
    it('should detect Node.js environment', () => {
      // Jest runs in Node.js environment by default
      const env = detectEnvironment();
      expect(env).toBe('node');
    });

    it('should detect browser environment when window is defined', () => {
      // Mock browser environment
      // @ts-expect-error - mocking global
      global.window = { document: {} };
      // @ts-expect-error - mocking global
      global.process = undefined;

      const env = detectEnvironment();
      expect(env).toBe('browser');
    });

    it('should detect Node.js when process.versions.node exists', () => {
      // @ts-expect-error - mocking global
      global.window = undefined;

      const env = detectEnvironment();
      expect(env).toBe('node');
      expect(process.versions.node).toBeDefined();
    });
  });

  describe('isNode', () => {
    it('should return true in Node.js environment', () => {
      expect(isNode()).toBe(true);
    });

    it('should return false in browser environment', () => {
      // @ts-expect-error - mocking global
      global.window = { document: {} };
      // @ts-expect-error - mocking global
      global.process = undefined;

      expect(isNode()).toBe(false);
    });
  });

  describe('isBrowser', () => {
    it('should return false in Node.js environment', () => {
      expect(isBrowser()).toBe(false);
    });

    it('should return true in browser environment', () => {
      // @ts-expect-error - mocking global
      global.window = { document: {} };
      // @ts-expect-error - mocking global
      global.process = undefined;

      expect(isBrowser()).toBe(true);
    });
  });
});
