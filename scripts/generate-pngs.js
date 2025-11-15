const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../docs/public/data');

const colors = {
  A: { r: 255, g: 107, b: 107 }, // Red
  B: { r: 78, g: 205, b: 196 },  // Teal
  C: { r: 69, g: 183, b: 209 },  // Blue
  D: { r: 255, g: 160, b: 122 }, // Orange
  E: { r: 152, g: 216, b: 200 }, // Mint
  F: { r: 255, g: 217, b: 61 },  // Yellow
  G: { r: 180, g: 167, b: 214 }, // Purple
  H: { r: 107, g: 207, b: 127 }, // Green
  J: { r: 255, g: 143, b: 171 }, // Pink
  K: { r: 168, g: 218, b: 220 }  // Sky blue
};

console.log('Generating PNG test files...\n');

async function generatePNGs() {
  for (const [prefix, color] of Object.entries(colors)) {
    for (let i = 0; i < 10; i++) {
      const filename = `${prefix}${i}.png`;
      const filepath = path.join(OUTPUT_DIR, filename);

      try {
        await sharp({
          create: {
            width: 100,
            height: 100,
            channels: 4,
            background: color
          }
        })
          .png()
          .toFile(filepath);

        console.log(`✓ Created ${filename}`);
      } catch (error) {
        console.error(`✗ Failed to create ${filename}:`, error.message);
      }
    }
  }

  console.log('\n✅ PNG generation complete!');
  console.log(`📁 Files saved to: ${OUTPUT_DIR}`);
}

generatePNGs().catch(console.error);
