const fs = require('fs');
const path = require('path');

// Create a minimal valid PDF with custom text
function createPDF(text) {
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj
4 0 obj
<<
/Length 65
>>
stream
BT
/F1 48 Tf
50 700 Td
(${text}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000317 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
431
%%EOF`;
}

// Generate PDF files
const outputDir = path.join(__dirname, '../docs/public/data');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate A-K (skip I), 0-9 for each
const prefixes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K']; // Skip I
let count = 0;

for (const prefix of prefixes) {
  for (let i = 0; i <= 9; i++) {
    const filename = `${prefix}${i}.pdf`;
    const filepath = path.join(outputDir, filename);
    const content = createPDF(`Document ${filename}`);

    fs.writeFileSync(filepath, content);
    count++;
    console.log(`Created: ${filename}`);
  }
}

console.log(`\nSuccessfully generated ${count} PDF files in ${outputDir}`);
