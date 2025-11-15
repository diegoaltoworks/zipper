'use client';

import DemoLayout from '../components/DemoLayout';

export default function ServerDemo() {
  const nextJsExample = `// app/api/download/route.ts
import { NextResponse } from 'next/server';
import { createZipFile } from '@diegoaltoworks/zipper';

export async function GET() {
  const files = [
    { url: 'https://example.com/file1.pdf', name: 'Document-1.pdf' },
    { url: 'https://example.com/file2.pdf', name: 'Document-2.pdf' },
    { url: 'https://example.com/file3.pdf', name: 'Document-3.pdf' },
  ];

  // Create ZIP file on the server
  const zipData = await createZipFile(files, {
    onProgress: (current, total) => {
      console.log(\`Server: Downloaded \${current}/\${total} files\`);
    },
    onError: (error, file) => {
      console.error(\`Failed to download \${file.name}:\`, error);
    },
    continueOnError: true,
    timeout: 30000,
  });

  // Convert to Uint8Array for NextResponse
  const buffer = zipData instanceof Blob
    ? new Uint8Array(await zipData.arrayBuffer())
    : new Uint8Array(zipData);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="files.zip"',
    },
  });
}`;

  const expressExample = `// Express.js API endpoint
import express from 'express';
import { createZipFile } from '@diegoaltoworks/zipper';

const app = express();

app.get('/api/download', async (req, res) => {
  try {
    const files = [
      { url: 'https://example.com/file1.pdf', name: 'Document-1.pdf' },
      { url: 'https://example.com/file2.pdf', name: 'Document-2.pdf' },
    ];

    const zipData = await createZipFile(files, {
      onProgress: (current, total) => {
        console.log(\`Downloaded \${current}/\${total} files\`);
      },
    });

    // In Node.js, zipData is a Buffer
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="files.zip"');
    res.send(zipData);
  } catch (error) {
    console.error('Error creating ZIP:', error);
    res.status(500).send('Error creating ZIP file');
  }
});`;

  const nodeExample = `// Standalone Node.js script
import { createZipFile } from '@diegoaltoworks/zipper';
import fs from 'fs';

async function createArchive() {
  const files = [
    { url: 'https://example.com/report-q1.pdf', name: 'Q1-Report.pdf' },
    { url: 'https://example.com/report-q2.pdf', name: 'Q2-Report.pdf' },
    { url: 'https://example.com/report-q3.pdf', name: 'Q3-Report.pdf' },
    { url: 'https://example.com/report-q4.pdf', name: 'Q4-Report.pdf' },
  ];

  console.log('Creating ZIP archive...');

  const zipBuffer = await createZipFile(files, {
    onProgress: (current, total) => {
      console.log(\`Progress: \${current}/\${total} (\${Math.round(current/total*100)}%)\`);
    },
    onError: (error, file) => {
      console.error(\`Failed: \${file.name}\`, error.message);
    },
    continueOnError: true,
  });

  // Save to disk
  fs.writeFileSync('./archive.zip', zipBuffer);
  console.log('ZIP file saved to archive.zip');
}

createArchive();`;

  const dynamicExample = `// Next.js API route with dynamic file list from database
import { NextResponse } from 'next/server';
import { createZipFile } from '@diegoaltoworks/zipper';
import { db } from '@/lib/database';

export async function POST(request: Request) {
  const { userId } = await request.json();

  // Fetch user's documents from database
  const documents = await db.documents.findMany({
    where: { userId },
    select: { url: true, filename: true },
  });

  // Transform to zipper format
  const files = documents.map(doc => ({
    url: doc.url,
    name: doc.filename,
  }));

  // Create ZIP
  const zipData = await createZipFile(files, {
    onProgress: (current, total) => {
      console.log(\`User \${userId}: \${current}/\${total} files\`);
    },
  });

  const buffer = zipData instanceof Blob
    ? new Uint8Array(await zipData.arrayBuffer())
    : new Uint8Array(zipData);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': \`attachment; filename="user-\${userId}-documents.zip"\`,
    },
  });
}`;

  return (
    <DemoLayout
      currentDemo="server"
      title="Server-Side Usage"
      description="Use Zipper in Node.js, Next.js API routes, Express, and other server environments"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Server-Side Benefits</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span><strong>Privacy:</strong> Files never touch the client browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span><strong>Performance:</strong> Server bandwidth is typically faster</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span><strong>Security:</strong> Protected URLs and authentication</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span><strong>Scale:</strong> Handle large files without browser memory limits</span>
            </li>
          </ul>
        </div>

        {/* Live Demo Link */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">🚀 Live Server Demo</h3>
          <p className="mb-4 text-indigo-100">
            See a full working server-side implementation with Next.js API routes
          </p>
          <a
            href="https://github.com/diegoaltoworks/zipper-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            View Full Demo App
          </a>
        </div>

        {/* Next.js Example */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Next.js API Route</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Create a server-side endpoint that generates and streams ZIP files to clients
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-gray-100 font-mono whitespace-pre">
              {nextJsExample}
            </pre>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(nextJsExample)}
            className="mt-3 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Copy Code
          </button>
        </div>

        {/* Express Example */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Express.js Endpoint</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Use with Express or any Node.js HTTP server
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-gray-100 font-mono whitespace-pre">
              {expressExample}
            </pre>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(expressExample)}
            className="mt-3 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Copy Code
          </button>
        </div>

        {/* Node.js Script Example */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Standalone Node.js Script</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Create ZIP archives in scripts, cron jobs, or CLI tools
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-gray-100 font-mono whitespace-pre">
              {nodeExample}
            </pre>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(nodeExample)}
            className="mt-3 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Copy Code
          </button>
        </div>

        {/* Dynamic Example */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Dynamic File Lists</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Fetch files from database, S3, or any data source
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-gray-100 font-mono whitespace-pre">
              {dynamicExample}
            </pre>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(dynamicExample)}
            className="mt-3 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Copy Code
          </button>
        </div>

        {/* Key Differences */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">🔑 Key Differences</h3>
          <div className="space-y-3 text-sm text-yellow-800">
            <div>
              <strong className="block mb-1">Use createZipFile() instead of downloadZipFile()</strong>
              <p className="text-yellow-700">
                Server-side uses <code className="bg-yellow-100 px-1 rounded">createZipFile()</code> which returns a Buffer/Blob.
                Client-side uses <code className="bg-yellow-100 px-1 rounded">downloadZipFile()</code> which triggers browser download.
              </p>
            </div>
            <div>
              <strong className="block mb-1">Return type is Buffer in Node.js</strong>
              <p className="text-yellow-700">
                In Node.js environment, the function returns a Buffer. In browser, it returns a Blob.
              </p>
            </div>
            <div>
              <strong className="block mb-1">Set proper HTTP headers</strong>
              <p className="text-yellow-700">
                Always set Content-Type to 'application/zip' and Content-Disposition for filename.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">📦 Bulk Exports</h4>
            <p className="text-sm text-gray-600">
              Let users download all their documents, invoices, or reports as a single ZIP
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">🔒 Protected Content</h4>
            <p className="text-sm text-gray-600">
              Serve files from authenticated URLs without exposing them to the client
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">📊 Report Generation</h4>
            <p className="text-sm text-gray-600">
              Create archives of generated PDFs, CSVs, and other dynamic content
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">⚡ Background Jobs</h4>
            <p className="text-sm text-gray-600">
              Process large file collections in scheduled tasks or worker queues
            </p>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
