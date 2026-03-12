const sharp = require('sharp');
const path = require('path');

const iconsDir = path.join(process.cwd(), 'public', 'icons');

const svgIcon = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4a173f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4a173f;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${size * 0.45}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">P</text>
</svg>
`;

async function generate180Icon() {
  await sharp(Buffer.from(svgIcon(180)))
    .png()
    .toFile(path.join(iconsDir, 'icon-180x180.png'));
  console.log('Generated icon-180x180.png');
}

generate180Icon().catch(console.error);
