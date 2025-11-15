import { zipper } from './zipper';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import type { FileInput } from './types';

// Mock modules
jest.mock('file-saver');
const mockSaveAs = saveAs as jest.MockedFunction<typeof saveAs>;

describe('zipper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should download multiple files and create a ZIP', async () => {
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

    await zipper(files);

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

    await zipper(files, { zipFilename: 'custom.zip' });

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

    await zipper(files, { onProgress });

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

    await zipper(files, { onError });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expect.any(Error), files[1]);

    // Should still create ZIP with successful file
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

    await expect(zipper(files, { continueOnError: false })).rejects.toThrow();

    // Should not create ZIP
    expect(mockSaveAs).not.toHaveBeenCalled();
  });

  it('should throw error when no files are provided', async () => {
    await expect(zipper([])).rejects.toThrow('No files provided to download');
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

    await expect(zipper(files)).rejects.toThrow('All file downloads failed');

    expect(mockSaveAs).not.toHaveBeenCalled();
  });

  it('should handle fetch errors with AbortController', async () => {
    const files: FileInput[] = [
      { url: 'https://example.com/file.pdf', name: 'file.pdf' },
    ];

    const onError = jest.fn();

    // Mock fetch to simulate abort/timeout scenario
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('The operation was aborted')
    );

    await expect(zipper(files, { onError })).rejects.toThrow(
      'All file downloads failed'
    );

    // Should call onError
    expect(onError).toHaveBeenCalledTimes(1);
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

    await zipper(files, {
      fetchOptions: { headers: customHeaders },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/file1.pdf',
      expect.objectContaining({
        headers: customHeaders,
      })
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

    await zipper(files);

    // Get the blob that was passed to saveAs
    const savedBlob = mockSaveAs.mock.calls[0][0];

    // Load the ZIP and verify contents
    const zip = await JSZip.loadAsync(savedBlob);
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

    await expect(zipper(files, { onError })).rejects.toThrow(
      'All file downloads failed'
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Network error' }),
      files[0]
    );
  });
});
