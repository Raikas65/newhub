const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://togetherjs.com/hub/server.js';
const destDir = path.join(__dirname, '..', 'hub');
const destFile = path.join(destDir, 'server.cjs');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log(`Downloading TogetherJS Hub from ${url}...`);

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: ${res.statusCode}`);
    process.exit(1);
  }

  const file = fs.createWriteStream(destFile);
  res.pipe(file);

  file.on('finish', () => {
    file.close(() => {
      console.log(`TogetherJS Hub saved as ${destFile}`);
    });
  });
}).on('error', (err) => {
  console.error(`Download error: ${err.message}`);
  process.exit(1);
});
