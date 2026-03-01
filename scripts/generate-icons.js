const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(process.cwd(), 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const svgIcon = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${size * 0.45}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">P</text>
</svg>
`;

async function generateIcons() {
  for (const size of sizes) {
    const filename = `icon-${size}x${size}.png`;
    await sharp(Buffer.from(svgIcon(size)))
      .png()
      .toFile(path.join(iconsDir, filename));
    console.log(`Generated ${filename}`);
  }
  console.log('All icons generated!');
}

generateIcons().catch(console.error);
