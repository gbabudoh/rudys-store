/**
 * Favicon Generator Script
 * 
 * This script helps generate all necessary favicon files for cross-browser compatibility.
 * 
 * Requirements:
 * - Install sharp: npm install sharp
 * - Have a source favicon image (PNG, at least 512x512px recommended)
 * 
 * Usage:
 * node scripts/generate-favicons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Source image - update this path to your source favicon
const SOURCE_IMAGE = path.join(__dirname, '../public/favicon.png');
const PUBLIC_DIR = path.join(__dirname, '../public');

// Favicon sizes needed for different browsers
const SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateFavicons() {
  try {
    // Check if source image exists
    if (!fs.existsSync(SOURCE_IMAGE)) {
      console.error(`❌ Source image not found: ${SOURCE_IMAGE}`);
      console.log('\n📝 Please ensure you have a favicon.png in the public directory');
      console.log('   Recommended size: 512x512px or larger');
      return;
    }

    console.log('🎨 Generating favicons...\n');

    // Generate PNG files
    for (const { name, size } of SIZES) {
      const outputPath = path.join(PUBLIC_DIR, name);
      await sharp(SOURCE_IMAGE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated: ${name} (${size}x${size})`);
    }

    // Generate favicon.ico (multi-size)
    const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');
    await sharp(SOURCE_IMAGE)
      .resize(32, 32)
      .toFile(icoPath);
    console.log(`✅ Generated: favicon.ico (32x32)`);

    // Copy to app directory for Next.js
    const appIcoPath = path.join(__dirname, '../app/favicon.ico');
    fs.copyFileSync(icoPath, appIcoPath);
    console.log(`✅ Copied: app/favicon.ico`);

    console.log('\n✨ All favicons generated successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Check the generated files in the public directory');
    console.log('   2. Run: npm run dev');
    console.log('   3. Test in different browsers');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    console.log('\n💡 Make sure you have installed sharp:');
    console.log('   npm install sharp --save-dev');
  }
}

generateFavicons();
