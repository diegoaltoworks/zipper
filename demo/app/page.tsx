'use client';

import { useState } from 'react';
import { zipper, type FileInput } from '@diegoaltoworks/zipper';

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [progress, setProgress] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate all file options (A-K excluding I, 0-9 for each)
  const allFiles = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'].flatMap((prefix) =>
    Array.from({ length: 10 }, (_, i) => `${prefix}${i}.pdf`)
  );

  const toggleFile = (file: string) => {
    setSelectedFiles((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    );
  };

  const selectAll = () => setSelectedFiles([...allFiles]);
  const selectNone = () => setSelectedFiles([]);

  const handleDownload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file');
      return;
    }

    setIsDownloading(true);
    setProgress('');
    setErrors([]);

    // Use relative path to work with basePath in production
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const files: FileInput[] = selectedFiles.map((filename) => ({
      url: `${basePath}/data/${filename}`,
      name: filename,
    }));

    try {
      await zipper(files, {
        zipFilename: 'zipper-demo.zip',
        onProgress: (current, total) => {
          setProgress(`Downloaded ${current} of ${total} files`);
        },
        onError: (error, file) => {
          setErrors((prev) => [...prev, `Failed: ${file.name} - ${error.message}`]);
        },
      });

      setProgress('Download complete!');
    } catch (error) {
      setErrors((prev) => [
        ...prev,
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ]);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Zipper
              </h1>
              <p className="text-gray-600 mt-1">
                Bulk file downloads made simple
              </p>
            </div>
            <a
              href="https://github.com/diegoaltoworks/zipper"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                What is Zipper?
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Zipper is a modern TypeScript package that lets you download multiple files from URLs and combine them into a single ZIP archive. Perfect for bulk file downloads in web applications.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <code className="text-sm text-gray-800">npm install @diegoaltoworks/zipper</code>
              </div>
              <a
                href="https://www.npmjs.com/package/@diegoaltoworks/zipper"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View on NPM →
              </a>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Features
              </h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>TypeScript support with full type definitions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Concurrent downloads with Promise.all</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Progress tracking callbacks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Robust error handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Custom fetch options & timeouts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Browser native (no polyfills needed)</span>
                </li>
              </ul>
            </div>

            {/* Code Example */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Usage Example
              </h2>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-gray-100 font-mono">
                  <code>{`import { zipper } from '@diegoaltoworks/zipper';

await zipper([
  { url: '/file1.pdf', name: 'A.pdf' },
  { url: '/file2.pdf', name: 'B.pdf' }
], {
  zipFilename: 'download.zip',
  onProgress: (current, total) => {
    console.log(\`\${current}/\${total}\`);
  }
});`}</code>
                </pre>
              </div>
              <a
                href="https://github.com/diegoaltoworks/zipper#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-3"
              >
                Read full documentation →
              </a>
            </div>
          </div>

          {/* Right Column - Demo */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Try it Live
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Select files below and download them as a ZIP
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {allFiles.length} files available
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={selectAll}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Select All
                </button>
                <button
                  onClick={selectNone}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading || selectedFiles.length === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto text-sm font-medium shadow-sm"
                >
                  {isDownloading
                    ? 'Downloading...'
                    : `Download ZIP (${selectedFiles.length})`}
                </button>
              </div>

              {/* File Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-6">
                {allFiles.map((file) => (
                  <button
                    key={file}
                    onClick={() => toggleFile(file)}
                    className={`p-3 rounded-lg border-2 transition-all text-xs font-semibold ${
                      selectedFiles.includes(file)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    {file}
                  </button>
                ))}
              </div>

              {/* Progress */}
              {progress && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    {isDownloading && (
                      <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <p className="text-blue-700 font-medium text-sm">{progress}</p>
                  </div>
                </div>
              )}

              {/* Errors */}
              {errors.length > 0 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-red-700 font-semibold mb-2 text-sm">Errors:</h3>
                  <ul className="text-red-600 text-xs space-y-1">
                    {errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">{selectedFiles.length}</div>
                    <div className="text-xs text-gray-600 mt-1">Selected</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{allFiles.length}</div>
                    <div className="text-xs text-gray-600 mt-1">Total Files</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {progress.includes('complete') ? '✓' : '-'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            Built with ❤️ by{' '}
            <a
              href="https://diegoalto.works"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Diego Alto
            </a>
            {' '}·{' '}
            <a
              href="https://github.com/diegoaltoworks/zipper"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              GitHub
            </a>
            {' '}·{' '}
            <a
              href="https://www.npmjs.com/package/@diegoaltoworks/zipper"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              NPM
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
