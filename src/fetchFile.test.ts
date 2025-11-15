import { fetchFile } from './fetchFile';
import type { FileInput, DownloadOptions } from './types';

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

describe('fetchFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should successfully fetch a file', async () => {
    const file: FileInput = {
      url: 'https://example.com/file.pdf',
      name: 'test.pdf',
    };
    const options: DownloadOptions = {};

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['file content']),
    });

    const result = await fetchFile(file, options);

    expect(result).toEqual({
      name: 'test.pdf',
      blob: expect.any(Blob),
      success: true,
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/file.pdf',
      expect.objectContaining({ signal: expect.any(Object) })
    );
  });

  it('should return error when fetch fails', async () => {
    const file: FileInput = {
      url: 'https://example.com/file.pdf',
      name: 'test.pdf',
    };
    const options: DownloadOptions = {};

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const result = await fetchFile(file, options);

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toContain('404');
    expect(result.error?.message).toContain('Not Found');
  });

  it('should handle network errors', async () => {
    const file: FileInput = {
      url: 'https://example.com/file.pdf',
      name: 'test.pdf',
    };
    const options: DownloadOptions = {};

    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    const result = await fetchFile(file, options);

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe('Network error');
  });

  it('should pass custom fetch options', async () => {
    const file: FileInput = {
      url: 'https://example.com/file.pdf',
      name: 'test.pdf',
    };
    const options: DownloadOptions = {
      fetchOptions: {
        headers: { Authorization: 'Bearer token123' },
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['content']),
    });

    await fetchFile(file, options);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/file.pdf',
      expect.objectContaining({
        headers: { Authorization: 'Bearer token123' },
      })
    );
  });

  it('should handle non-Error exceptions', async () => {
    const file: FileInput = {
      url: 'https://example.com/file.pdf',
      name: 'test.pdf',
    };
    const options: DownloadOptions = {};

    (global.fetch as jest.Mock).mockRejectedValueOnce('String error');

    const result = await fetchFile(file, options);

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe('Unknown error occurred');
  });

  it('should clear timeout on successful fetch', async () => {
    const file: FileInput = {
      url: 'https://example.com/file.pdf',
      name: 'test.pdf',
    };
    const options: DownloadOptions = {};

    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['content']),
    });

    await fetchFile(file, options);

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should clear timeout on fetch error', async () => {
    const file: FileInput = {
      url: 'https://example.com/file.pdf',
      name: 'test.pdf',
    };
    const options: DownloadOptions = {};

    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    await fetchFile(file, options);

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
