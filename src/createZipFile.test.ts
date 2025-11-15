import { createZipFile } from './createZipFile';
import JSZip from 'jszip';
import type { FileInput } from './types';

// Mock environment to be browser for these tests
jest.mock('./environment', () => ({
  isNode: () => false,
  isBrowser: () => true,
  detectEnvironment: () => 'browser',
}));

describe('createZipFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should download multiple files and create a ZIP blob', async () => {
    const files: FileInput[] = [
      { url: 'https://example.com/file1.pdf', name: 'file1.pdf' },
      { url: 'https://example.com/file2.pdf', name: 'file2.pdf' },
    ];

    // Mock successful fetch responses
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['file1 content']),
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['file2 content']),
    });

    const result = await createZipFile(files);

    // Should return a Blob in browser environment
    expect(result).toBeInstanceOf(Blob);

    // Verify fetch was called for each file
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/file1.pdf',
      expect.any(Object)
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/file2.pdf',
      expect.any(Object)
    );
  });

  it('should call onProgress callback for each successful download', async () => {
    const files: FileInput[] = [
      { url: 'https://example.com/file1.pdf', name: 'file1.pdf' },
      { url: 'https://example.com/file2.pdf', name: 'file2.pdf' },
      { url: 'https://example.com/file3.pdf', name: 'file3.pdf' },
    ];

    const onProgress = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['content']),
    });

    await createZipFile(files, { onProgress });

    expect(onProgress).toHaveBeenCalledTimes(3);
    expect(onProgress).toHaveBeenNthCalledWith(1, 1, 3);
    expect(onProgress).toHaveBeenNthCalledWith(2, 2, 3);
    expect(onProgress).toHaveBeenNthCalledWith(3, 3, 3);
  });

  it('should call onError callback when a download fails', async () => {
    const files: FileInput[] = [
      { url: 'https://example.com/file1.pdf', name: 'file1.pdf' },
      { url: 'https://example.com/file2.pdf', name: 'file2.pdf' },
    ];

    const onError = jest.fn();

    // First file succeeds, second fails
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['content']),
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const result = await createZipFile(files, { onError });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expect.any(Error), files[1]);

    // Should still create ZIP with successful file
    expect(result).toBeInstanceOf(Blob);
  });

  it('should throw error when continueOnError is false and a download fails', async () => {
    const files: FileInput[] = [
      { url: 'https://example.com/file1.pdf', name: 'file1.pdf' },
      { url: 'https://example.com/file2.pdf', name: 'file2.pdf' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['content']),
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    });

    await expect(
      createZipFile(files, { continueOnError: false })
    ).rejects.toThrow();
  });

  it('should throw error when no files are provided', async () => {
    await expect(createZipFile([])).rejects.toThrow(
      'No files provided to download'
    );
  });

  it('should throw error when all downloads fail', async () => {
    const files: FileInput[] = [
      { url: 'https://example.com/file1.pdf', name: 'file1.pdf' },
      { url: 'https://example.com/file2.pdf', name: 'file2.pdf' },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(createZipFile(files)).rejects.toThrow(
      'All file downloads failed'
    );
  });

  it('should create ZIP with correct file structure', async () => {
    const files: FileInput[] = [
      { url: 'https://example.com/file1.pdf', name: 'Document A.pdf' },
      { url: 'https://example.com/file2.pdf', name: 'Document B.pdf' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['content A']),
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['content B']),
    });

    const result = await createZipFile(files);

    // Load the ZIP and verify contents
    const zip = await JSZip.loadAsync(result as Blob);
    const fileNames = Object.keys(zip.files);

    expect(fileNames).toContain('Document A.pdf');
    expect(fileNames).toContain('Document B.pdf');
    expect(fileNames).toHaveLength(2);
  });

  it('should handle network errors gracefully', async () => {
    const files: FileInput[] = [
      { url: 'https://example.com/file1.pdf', name: 'file1.pdf' },
    ];

    const onError = jest.fn();

    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    await expect(createZipFile(files, { onError })).rejects.toThrow(
      'All file downloads failed'
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Network error' }),
      files[0]
    );
  });

  it('should pass custom fetch options to fetch calls', async () => {
    const files: FileInput[] = [
      { url: 'https://example.com/file1.pdf', name: 'file1.pdf' },
    ];

    const customHeaders = { Authorization: 'Bearer token123' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['content']),
    });

    await createZipFile(files, {
      fetchOptions: { headers: customHeaders },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/file1.pdf',
      expect.objectContaining({
        headers: customHeaders,
      })
    );
  });
});
