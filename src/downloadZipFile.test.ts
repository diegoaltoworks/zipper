import { downloadZipFile } from './downloadZipFile';
import type { FileInput } from './types';

// Mock file-saver
const mockSaveAs = jest.fn();
jest.mock('file-saver', () => ({
  saveAs: jest.fn((...args) => mockSaveAs(...args)),
}));

// Mock environment to be browser
jest.mock('./environment', () => ({
  isNode: () => false,
  isBrowser: () => true,
  detectEnvironment: () => 'browser',
}));

describe('downloadZipFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    mockSaveAs.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should download multiple files and trigger browser download', async () => {
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

    await downloadZipFile(files);

    // Verify fetch was called for each file
    expect(global.fetch).toHaveBeenCalledTimes(2);

    // Verify saveAs was called with a blob and filename
    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), 'download.zip');
  });

  it('should use custom ZIP filename when provided', async () => {
    const files: FileInput[] = [
      { url: 'https://example.com/file1.pdf', name: 'file1.pdf' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['content']),
    });

    await downloadZipFile(files, { zipFilename: 'custom.zip' });

    expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), 'custom.zip');
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

    await downloadZipFile(files, { onProgress });

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

    await downloadZipFile(files, { onError });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expect.any(Error), files[1]);

    // Should still trigger download with successful file
    expect(mockSaveAs).toHaveBeenCalledTimes(1);
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
      downloadZipFile(files, { continueOnError: false })
    ).rejects.toThrow();

    // Should not trigger download
    expect(mockSaveAs).not.toHaveBeenCalled();
  });

  it('should throw error when no files are provided', async () => {
    await expect(downloadZipFile([])).rejects.toThrow(
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

    await expect(downloadZipFile(files)).rejects.toThrow(
      'All file downloads failed'
    );

    expect(mockSaveAs).not.toHaveBeenCalled();
  });

  it('should handle network errors gracefully', async () => {
    const files: FileInput[] = [
      { url: 'https://example.com/file1.pdf', name: 'file1.pdf' },
    ];

    const onError = jest.fn();

    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    await expect(downloadZipFile(files, { onError })).rejects.toThrow(
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

    await downloadZipFile(files, {
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
