'use client';

import { useState } from 'react';
import { downloadZipFile, type FileInput } from '@diegoaltoworks/zipper';
import DemoLayout from '../components/DemoLayout';

export default function Playground() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const defaultFileList =
    '[\n' +
    '  {\n' +
    `    "url": "${basePath}/data/A0.pdf",\n` +
    '    "name": "Document-A0.pdf"\n' +
    '  },\n' +
    '  {\n' +
    `    "url": "${basePath}/data/B0.pdf",\n` +
    '    "name": "Document-B0.pdf"\n' +
    '  },\n' +
    '  {\n' +
    `    "url": "${basePath}/data/C0.pdf",\n` +
    '    "name": "Document-C0.pdf"\n' +
    '  }\n' +
    ']';

  const [fileList, setFileList] = useState<string>(defaultFileList);

  const [zipFilename, setZipFilename] = useState('my-files.zip');
  const [timeout, setTimeout] = useState('30000');
  const [continueOnError, setContinueOnError] = useState(true);

  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '▶';
    setConsoleOutput(prev => [...prev, `[${timestamp}] ${prefix} ${message}`]);
  };

  const clearConsole = () => {
    setConsoleOutput([]);
    setError(null);
  };

  const runCode = async () => {
    clearConsole();
    setIsRunning(true);
    setError(null);

    try {
      addLog('Parsing file list...');
      const files: FileInput[] = JSON.parse(fileList);

      addLog(`Preparing to download ${files.length} files`);

      const options = {
        zipFilename,
        timeout: parseInt(timeout),
        continueOnError,
        onProgress: (current: number, total: number) => {
          addLog(`Progress: ${current}/${total} files downloaded`, 'info');
        },
        onError: (err: Error, file: FileInput) => {
          addLog(`Error downloading ${file.name}: ${err.message}`, 'error');
        }
      };

      addLog('Starting download...');
      await downloadZipFile(files, options);

      addLog(`Successfully created ${zipFilename}`, 'success');
      addLog('Download triggered!', 'success');

    } catch (err) {
      let message = err instanceof Error ? err.message : 'Unknown error';

      // Provide helpful hint for JSON parsing errors
      if (message.includes('JSON') || message.includes('position')) {
        message = `JSON parsing error: ${message}\n\nTip: Make sure property names are in double quotes: {"url": "...", "name": "..."}`;
      }

      setError(message);
      addLog(`Fatal error: ${message}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const generatedCode = `import { downloadZipFile } from '@diegoaltoworks/zipper';

const files = ${fileList};

await downloadZipFile(files, {
  zipFilename: '${zipFilename}',
  timeout: ${timeout},
  continueOnError: ${continueOnError},
  onProgress: (current, total) => {
    console.log(\`Downloaded \${current}/\${total} files\`);
  },
  onError: (error, file) => {
    console.error(\`Failed: \${file.name}\`, error);
  }
});`;

  return (
    <DemoLayout
      currentDemo="playground"
      title="Interactive Playground"
      description="Test the Zipper API with custom configurations and see it in action"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Panel - Configuration */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Configuration</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    File List (JSON)
                  </label>
                  <button
                    onClick={() => setFileList(defaultFileList)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Reset to Default
                  </button>
                </div>
                <textarea
                  value={fileList}
                  onChange={(e) => setFileList(e.target.value)}
                  className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white"
                  placeholder='[{"url": "/file.pdf", "name": "file.pdf"}]'
                  spellCheck={false}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Array of objects with url and name properties. Property names must use double quotes.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Filename
                </label>
                <input
                  type="text"
                  value={zipFilename}
                  onChange={(e) => setZipFilename(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout (ms)
                </label>
                <input
                  type="number"
                  value={timeout}
                  onChange={(e) => setTimeout(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="continueOnError"
                  checked={continueOnError}
                  onChange={(e) => setContinueOnError(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="continueOnError" className="ml-2 text-sm text-gray-700">
                  Continue on error
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {isRunning ? 'Running...' : '▶ Run Code'}
              </button>
              <button
                onClick={clearConsole}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Console
              </button>
            </div>
          </div>

          {/* Generated Code */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Generated Code</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-xs font-mono">
              {generatedCode}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(generatedCode)}
              className="mt-3 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Copy Code
            </button>
          </div>
        </div>

        {/* Right Panel - Console Output */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Console Output</h3>
              {isRunning && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                  Running...
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-md p-4 h-96 overflow-y-auto font-mono text-sm">
              {consoleOutput.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  Console output will appear here when you run the code
                </div>
              ) : (
                <div className="space-y-1">
                  {consoleOutput.map((log, i) => (
                    <div
                      key={i}
                      className={`${
                        log.includes('❌') ? 'text-red-400' :
                        log.includes('✅') ? 'text-green-400' :
                        'text-gray-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800 font-medium">Error:</p>
                <p className="text-sm text-red-600 mt-1 whitespace-pre-line font-mono">{error}</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-orange-900 mb-2">💡 Tips</h3>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Modify the configuration and click "Run Code" to test</li>
              <li>• The code will actually download and create a ZIP file</li>
              <li>• Watch the console output for progress and errors</li>
              <li>• Copy the generated code to use in your own project</li>
            </ul>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
