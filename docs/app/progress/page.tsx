'use client';

import { useState } from 'react';
import { downloadZipFile, type FileInput } from '@diegoaltoworks/zipper';
import DemoLayout from '../components/DemoLayout';

export default function ProgressDemo() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentFile, setCurrentFile] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const handleDownload = async () => {
    setIsDownloading(true);
    setCurrentFile(0);
    setErrors([]);
    setStartTime(Date.now());

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    // Mix of PDFs and PNGs for variety
    const files: FileInput[] = [];
    for (let i = 0; i < 50; i++) {
      const letter = String.fromCharCode(65 + Math.floor(i / 10)); // A-E
      const num = i % 10;
      const ext = i % 2 === 0 ? 'pdf' : 'png';
      if (letter !== 'I') { // Skip I as we don't have it
        files.push({
          url: `${basePath}/data/${letter}${num}.${ext}`,
          name: `File-${letter}${num}.${ext}`
        });
      }
    }

    setTotalFiles(files.length);

    try {
      await downloadZipFile(files, {
        zipFilename: 'progress-demo.zip',
        onProgress: (current, total) => {
          setCurrentFile(current);
          setTotalFiles(total);

          // Calculate download speed
          const elapsed = (Date.now() - startTime) / 1000; // seconds
          const speed = elapsed > 0 ? current / elapsed : 0;
          setDownloadSpeed(speed);
        },
        onError: (error, file) => {
          setErrors(prev => [...prev, `Failed: ${file.name}`]);
        },
        continueOnError: true
      });
    } catch (error) {
      setErrors(prev => [
        ...prev,
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      ]);
    } finally {
      setIsDownloading(false);
    }
  };

  const progress = totalFiles > 0 ? (currentFile / totalFiles) * 100 : 0;
  const eta = downloadSpeed > 0 && currentFile < totalFiles
    ? ((totalFiles - currentFile) / downloadSpeed).toFixed(1)
    : '0';

  return (
    <DemoLayout
      currentDemo="progress"
      title="Download Progress Demonstration"
      description="Watch the progress bar as 50 files are downloaded and zipped"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {isDownloading ? 'Downloading...' : 'Ready to download'}
          </span>
          <span className="text-sm font-medium text-indigo-600">
            {currentFile} / {totalFiles} files
          </span>
        </div>

        {/* Progress bar container */}
        <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 ease-out flex items-center justify-center"
            style={{ width: `${progress}%` }}
          >
            {progress > 10 && (
              <span className="text-xs font-bold text-white">
                {progress.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">
              {progress.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">Complete</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {downloadSpeed.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Files/second</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-pink-600">
              {eta}s
            </div>
            <div className="text-xs text-gray-600">ETA</div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold text-lg shadow-lg transition-all"
      >
        {isDownloading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            Downloading {currentFile} of {totalFiles}...
          </span>
        ) : (
          'Start Download (50 files)'
        )}
      </button>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-semibold text-red-900 mb-2">Errors:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, i) => (
              <li key={i}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">About This Demo</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Downloads 50 mixed files (PDFs and PNGs)</li>
          <li>• Shows real-time progress with visual bar</li>
          <li>• Displays download speed and estimated time</li>
          <li>• Demonstrates the onProgress callback</li>
        </ul>
      </div>

      {/* Tip */}
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="text-sm font-semibold text-amber-900 mb-2">💡 Tip</h3>
        <p className="text-sm text-amber-800">
          To see the progress bar update in real-time, open your browser DevTools (F12) → Network tab →
          throttle your connection to "Slow 3G" or "Fast 3G". This simulates a slower network and makes
          the incremental progress visible.
        </p>
      </div>
    </DemoLayout>
  );
}
