'use client';

import { useState } from 'react';
import { downloadZipFile, type FileInput } from '@diegoaltoworks/zipper';
import DemoLayout from '../components/DemoLayout';

interface FileOption {
  filename: string;
  type: 'pdf' | 'png' | 'txt';
  displayName: string;
}

export default function MixedFilesDemo() {
  const [selectedFiles, setSelectedFiles] = useState<FileOption[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  // Generate mixed file options
  const fileOptions: FileOption[] = [];

  // Add PDFs from different letter groups
  ['A', 'B', 'C', 'D', 'E'].forEach((letter) => {
    for (let i = 0; i < 6; i++) {
      fileOptions.push({
        filename: `${letter}${i}.pdf`,
        type: 'pdf',
        displayName: `${letter}${i}.pdf`
      });
    }
  });

  // Add PNGs from different letter groups
  ['F', 'G', 'H', 'J', 'K'].forEach((letter) => {
    for (let i = 0; i < 6; i++) {
      fileOptions.push({
        filename: `${letter}${i}.png`,
        type: 'png',
        displayName: `${letter}${i}.png`
      });
    }
  });

  // Add text files
  for (let i = 0; i < 10; i++) {
    fileOptions.push({
      filename: `L${i}.txt`,
      type: 'txt',
      displayName: `L${i}.txt`
    });
  }

  const toggleFile = (file: FileOption) => {
    setSelectedFiles((prev) => {
      const exists = prev.some(f => f.filename === file.filename);
      if (exists) {
        return prev.filter((f) => f.filename !== file.filename);
      } else {
        return [...prev, file];
      }
    });
  };

  const selectAllPDFs = () => {
    const pdfs = fileOptions.filter(f => f.type === 'pdf');
    setSelectedFiles(pdfs);
  };

  const selectAllPNGs = () => {
    const pngs = fileOptions.filter(f => f.type === 'png');
    setSelectedFiles(pngs);
  };

  const selectAllText = () => {
    const txts = fileOptions.filter(f => f.type === 'txt');
    setSelectedFiles(txts);
  };

  const selectMixed = () => {
    const mixed: FileOption[] = [];

    // Get random PDFs (between 3-8)
    const pdfCount = Math.floor(Math.random() * 6) + 3;
    const pdfs = fileOptions.filter(f => f.type === 'pdf');
    const shuffledPdfs = [...pdfs].sort(() => 0.5 - Math.random());
    mixed.push(...shuffledPdfs.slice(0, pdfCount));

    // Get random PNGs (between 3-8)
    const pngCount = Math.floor(Math.random() * 6) + 3;
    const pngs = fileOptions.filter(f => f.type === 'png');
    const shuffledPngs = [...pngs].sort(() => 0.5 - Math.random());
    mixed.push(...shuffledPngs.slice(0, pngCount));

    // Get random text files (between 2-5)
    const txtCount = Math.floor(Math.random() * 4) + 2;
    const txts = fileOptions.filter(f => f.type === 'txt');
    const shuffledTxts = [...txts].sort(() => 0.5 - Math.random());
    mixed.push(...shuffledTxts.slice(0, txtCount));

    setSelectedFiles(mixed);
  };

  const selectNone = () => setSelectedFiles([]);

  const handleDownload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file');
      return;
    }

    setIsDownloading(true);
    setProgress('');
    setErrors([]);

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const files: FileInput[] = selectedFiles.map((file) => ({
      url: `${basePath}/data/${file.filename}`,
      name: file.displayName,
    }));

    try {
      await downloadZipFile(files, {
        zipFilename: 'mixed-files.zip',
        onProgress: (current, total) => {
          setProgress(`Downloaded ${current} of ${total} files`);
        },
        onError: (error, file) => {
          setErrors((prev) => [...prev, `Failed: ${file.name} - ${error.message}`]);
        },
        continueOnError: true
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

  const pdfCount = selectedFiles.filter(f => f.type === 'pdf').length;
  const pngCount = selectedFiles.filter(f => f.type === 'png').length;
  const txtCount = selectedFiles.filter(f => f.type === 'txt').length;

  return (
    <DemoLayout
      currentDemo="mixed"
      title="Download Mixed File Types"
      description="Select any combination of PDFs, PNGs, and text files to download as a single ZIP"
    >
      {/* Quick Select Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={selectAllPDFs}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          All PDFs ({fileOptions.filter(f => f.type === 'pdf').length})
        </button>
        <button
          onClick={selectAllPNGs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          All PNGs ({fileOptions.filter(f => f.type === 'png').length})
        </button>
        <button
          onClick={selectAllText}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
        >
          All Text ({fileOptions.filter(f => f.type === 'txt').length})
        </button>
        <button
          onClick={selectMixed}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          Random Mix
        </button>
        <button
          onClick={selectNone}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          Clear All
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

      {/* File Type Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{pdfCount}</div>
          <div className="text-xs text-red-700">PDFs</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{pngCount}</div>
          <div className="text-xs text-blue-700">PNGs</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{txtCount}</div>
          <div className="text-xs text-yellow-700">Text Files</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{selectedFiles.length}</div>
          <div className="text-xs text-green-700">Total</div>
        </div>
      </div>

      {/* File Grid - Responsive: 3 cols mobile, 6 cols tablet, 12 cols desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-6">
        {fileOptions.map((file) => {
          const isSelected = selectedFiles.some(f => f.filename === file.filename);
          const colorClasses = {
            pdf: {
              selected: 'border-red-600 bg-red-50 text-red-700',
              icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            },
            png: {
              selected: 'border-blue-600 bg-blue-50 text-blue-700',
              icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            },
            txt: {
              selected: 'border-yellow-600 bg-yellow-50 text-yellow-700',
              icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            }
          };

          const typeStyle = colorClasses[file.type];

          return (
            <button
              key={file.filename}
              onClick={() => toggleFile(file)}
              className={`p-2 rounded-lg border-2 transition-all text-xs font-semibold flex flex-col items-center gap-1 ${
                isSelected
                  ? `${typeStyle.selected} shadow-sm`
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {typeStyle.icon}
              <span className="text-[10px]">{file.displayName.split('.')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Progress */}
      {progress && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            {isDownloading && (
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
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

      {/* Info */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-sm font-semibold text-green-900 mb-2">About This Demo</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Mix PDFs, PNGs, and text files in a single download</li>
          <li>• Demonstrates file type flexibility</li>
          <li>• All file types are preserved in the ZIP</li>
          <li>• Works with any file format your browser can fetch</li>
          <li>• "Random Mix" selects a different combination each time</li>
        </ul>
      </div>
    </DemoLayout>
  );
}
